import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Toolbar, 
  Divider, 
  Paper,
  Tooltip 
} from '@mui/material';
import DOMPurify from 'dompurify';
import {
  Bold, Italic, Underline, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Heading1,
  Heading2, Link, Image, Code
} from 'lucide-react';

// Configure DOMPurify to handle HTML nesting issues
const configureDOMPurify = () => {
  DOMPurify.addHook('afterSanitizeElements', (node) => {
    if (node.nodeName === 'DIV' && node.parentNode && node.parentNode.nodeName === 'P') {
      const parentP = node.parentNode;
      const newDiv = document.createElement('div');
      newDiv.innerHTML = (parentP as HTMLElement).innerHTML;

      if (parentP.parentNode) {
        parentP.parentNode.replaceChild(newDiv, parentP);
      }
    }
    return node;
  });
};

interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  direction?: 'ltr' | 'rtl';  // Support for RTL
  height?: string; // Allow setting a fixed height
}

interface CursorPosition {
  startOffset: number;
  endOffset: number;
  scrollTop?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  id, 
  value, 
  onChange, 
  direction = 'ltr',
  height = '300px' // Default fixed height
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(value || '');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    configureDOMPurify();
  }, []);

  useEffect(() => {
    if (!isUpdating && value !== html) {
      setHtml(value);
    }
  }, [value, html, isUpdating]);

  const handleContentChange = () => {
    if (editorRef.current) {
      const sanitizedContent = DOMPurify.sanitize(editorRef.current.innerHTML, {
        ALLOWED_TAGS: ['p', 'div', 'span', 'br', 'b', 'i', 'u', 'strong', 'em', 'a', 'h1', 'h2', 'ul', 'ol', 'li', 'img', 'pre', 'code'],
        FORBID_TAGS: [],
        FORBID_CONTENTS: ['p'],
        ADD_ATTR: ['style'],  // Allow style attributes for alignment
      });

      setIsUpdating(true);
      setHtml(sanitizedContent);
      onChange(sanitizedContent);
      setIsUpdating(false);
    }
  };

  // Improved cursor position preservation using text offsets instead of DOM nodes
  const preserveCursorPosition = (): CursorPosition | null => {
    const editor = editorRef.current;
    if (!editor) return null;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    
    // Make sure the selection is within our editor
    if (!editor.contains(range.commonAncestorContainer)) return null;
    
    // Create ranges from start of editor to selection points
    const startRange = document.createRange();
    startRange.setStart(editor, 0);
    startRange.setEnd(range.startContainer, range.startOffset);
    
    const endRange = document.createRange();
    endRange.setStart(editor, 0);
    endRange.setEnd(range.endContainer, range.endOffset);
    
    // Get character offsets
    const startOffset = startRange.toString().length;
    const endOffset = endRange.toString().length;
    
    // Also save the current scroll position
    const scrollTop = editor.scrollTop;
    
    return { startOffset, endOffset, scrollTop };
  };

  // Function to find a node and offset based on character position
  const findNodeAndOffsetFromPosition = (targetOffset: number): { node: Node, offset: number } | null => {
    const editor = editorRef.current;
    if (!editor) return null;
    
    const treeWalker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let currentOffset = 0;
    let currentNode = treeWalker.currentNode;
    
    // Walk through text nodes until we find our position
    while (currentNode) {
      const nodeTextLength = currentNode.nodeValue?.length || 0;
      
      if (currentOffset + nodeTextLength >= targetOffset) {
        // Found the node
        return {
          node: currentNode,
          offset: targetOffset - currentOffset
        };
      }
      
      currentOffset += nodeTextLength;
      currentNode = treeWalker.nextNode() as Node;
    }
    
    // If we reached the end, return the last position
    const lastTextNode = editor.lastChild;
    if (lastTextNode && lastTextNode.nodeType === Node.TEXT_NODE) {
      return {
        node: lastTextNode,
        offset: (lastTextNode.nodeValue?.length || 0)
      };
    } else if (lastTextNode && lastTextNode.childNodes.length > 0) {
      // Try to find the last text node within the last child
      const lastTextNodeWalker = document.createTreeWalker(
        lastTextNode,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let lastFoundTextNode = null;
      
      // Go to last text node
      while (lastTextNodeWalker.nextNode()) {
        lastFoundTextNode = lastTextNodeWalker.currentNode;
      }
      
      if (lastFoundTextNode) {
        return {
          node: lastFoundTextNode,
          offset: (lastFoundTextNode.nodeValue?.length || 0)
        };
      }
    }
    
    // If all else fails, just return the editor itself
    return {
      node: editor,
      offset: 0
    };
  };

  // Restore cursor position using the saved text offsets
  const restoreCursorPosition = (position: CursorPosition | null) => {
    if (!position || !editorRef.current) return;
    
    try {
      // Find the nodes and offsets based on the character positions
      const startPos = findNodeAndOffsetFromPosition(position.startOffset);
      const endPos = findNodeAndOffsetFromPosition(position.endOffset);
      
      if (!startPos || !endPos) return;
      
      // Apply the selection
      const selection = window.getSelection();
      const range = document.createRange();
      
      range.setStart(startPos.node, startPos.offset);
      range.setEnd(endPos.node, endPos.offset);
      
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // Restore scroll position if available
      if (position.scrollTop !== undefined && editorRef.current) {
        editorRef.current.scrollTop = position.scrollTop;
      }
      
      // Ensure the cursor is visible
      const rect = range.getBoundingClientRect();
      if (editorRef.current) {
        const editorRect = editorRef.current.getBoundingClientRect();
        
        // If cursor is below the visible area
        if (rect.bottom > editorRect.bottom) {
          editorRef.current.scrollTop += (rect.bottom - editorRect.bottom) + 30;
        }
        
        // If cursor is above the visible area
        if (rect.top < editorRect.top) {
          editorRef.current.scrollTop -= (editorRect.top - rect.top) + 30;
        }
      }
      
      // Ensure editor has focus
      editorRef.current.focus();
    } catch (e) {
      console.error("Error restoring cursor position:", e);
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const handleInput = () => {
    const position = preserveCursorPosition();
    handleContentChange();
    // Use setTimeout to ensure the DOM has been updated
    setTimeout(() => {
      restoreCursorPosition(position);
    }, 0);
  };

  // Handle key events for special cases like Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior
  
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
  
      const range = selection.getRangeAt(0);
  
      // Create a new paragraph element for the new line
      const newLine = document.createElement("p");
      newLine.innerHTML = "<br>"; // Ensures proper spacing in contentEditable
  
      // Insert the new line at the current cursor position
      range.insertNode(newLine);
  
      // Move the cursor to the new line
      const newRange = document.createRange();
      newRange.setStart(newLine, 0);
      newRange.setEnd(newLine, 0);
      selection.removeAllRanges();
      selection.addRange(newRange);
  
      // Ensure scrolling works properly
      if (editorRef.current) {
        editorRef.current.scrollTop = editorRef.current.scrollHeight;
      }
  
      // Handle content change
      handleContentChange();
  
      // Ensure the cursor is in the correct position after content change
      setTimeout(() => {
        const newLineInDocument = editorRef.current?.querySelector('p:last-child');
        if (newLineInDocument) {
          const newRangeAfterUpdate = document.createRange();
          newRangeAfterUpdate.setStart(newLineInDocument, 0);
          newRangeAfterUpdate.setEnd(newLineInDocument, 0);
          selection.removeAllRanges();
          selection.addRange(newRangeAfterUpdate);
        }
      }, 0);
    }
  };
  
  
  
  
  const applyFormatting = (tag: string) => {
    const position = preserveCursorPosition();
    document.execCommand('formatBlock', false, tag);
    handleContentChange();
    setTimeout(() => {
      restoreCursorPosition(position);
    }, 0);
  };

  const applyInlineFormatting = (command: string) => {
    const position = preserveCursorPosition();
    document.execCommand(command, false);
    handleContentChange();
    setTimeout(() => {
      restoreCursorPosition(position);
    }, 0);
  };

  const insertList = (listType: 'insertUnorderedList' | 'insertOrderedList') => {
    const position = preserveCursorPosition();
    document.execCommand(listType, false);
    handleContentChange();
    setTimeout(() => {
      restoreCursorPosition(position);
    }, 0);
  };

  const setTextAlignment = (alignment: 'left' | 'center' | 'right') => {
    const position = preserveCursorPosition();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentElement;

      if (parentElement?.tagName.toLowerCase() === 'p') {
        const content = parentElement.innerHTML;
        const div = document.createElement('div');
        div.innerHTML = content;
        div.style.textAlign = alignment;
        parentElement.parentNode?.replaceChild(div, parentElement);
        handleContentChange();
        setTimeout(() => {
          restoreCursorPosition(position);
        }, 0);
        return;
      }
    }

    switch (alignment) {
      case 'left':
        document.execCommand('justifyLeft', false);
        break;
      case 'center':
        document.execCommand('justifyCenter', false);
        break;
      case 'right':
        document.execCommand('justifyRight', false);
        break;
    }

    handleContentChange();
    setTimeout(() => {
      restoreCursorPosition(position);
    }, 0);
  };

  const insertLink = () => {
    const position = preserveCursorPosition();
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
      handleContentChange();
      setTimeout(() => {
        restoreCursorPosition(position);
      }, 0);
    }
  };

  const insertImage = () => {
    const position = preserveCursorPosition();
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
      handleContentChange();
      setTimeout(() => {
        restoreCursorPosition(position);
      }, 0);
    }
  };

  const insertCode = () => {
    const position = preserveCursorPosition();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const preElement = document.createElement('pre');
    preElement.appendChild(range.extractContents());
    range.insertNode(preElement);
    handleContentChange();
    setTimeout(() => {
      restoreCursorPosition(position);
    }, 0);
  };

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <Toolbar 
        variant="dense" 
        sx={{ 
          minHeight: 48,
          flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
          flexWrap: 'wrap',
          gap: 0.5,
          bgcolor: 'grey.50'
        }}
      >
        <Tooltip title="Bold">
          <IconButton size="small" onClick={() => applyInlineFormatting('bold')}>
            <Bold size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton size="small" onClick={() => applyInlineFormatting('italic')}>
            <Italic size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton size="small" onClick={() => applyInlineFormatting('underline')}>
            <Underline size={16} />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        <Tooltip title="Heading 1">
          <IconButton size="small" onClick={() => applyFormatting('h1')}>
            <Heading1 size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Heading 2">
          <IconButton size="small" onClick={() => applyFormatting('h2')}>
            <Heading2 size={16} />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        <Tooltip title="Bullet List">
          <IconButton size="small" onClick={() => insertList('insertUnorderedList')}>
            <List size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <IconButton size="small" onClick={() => insertList('insertOrderedList')}>
            <ListOrdered size={16} />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        <Tooltip title="Align Left">
          <IconButton size="small" onClick={() => setTextAlignment('left')}>
            <AlignLeft size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Center">
          <IconButton size="small" onClick={() => setTextAlignment('center')}>
            <AlignCenter size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Right">
          <IconButton size="small" onClick={() => setTextAlignment('right')}>
            <AlignRight size={16} />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        <Tooltip title="Insert Link">
          <IconButton size="small" onClick={insertLink}>
            <Link size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Image">
          <IconButton size="small" onClick={insertImage}>
            <Image size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Code">
          <IconButton size="small" onClick={insertCode}>
            <Code size={16} />
          </IconButton>
        </Tooltip>
      </Toolbar>

      <Box
        component="div"
        id={id}
        ref={editorRef}
        sx={{
          p: 2,
          height,
          maxHeight: height,
          overflowY: 'auto',
          unicodeBidi: 'isolate',
          border: 'none',
          outline: 'none',
          bgcolor: 'background.paper',
          '&:focus': {
            outline: 'none'
          }
        }}
        contentEditable
        dir={direction}
        dangerouslySetInnerHTML={{ __html: html }}
        onInput={handleInput}
        onBlur={handleContentChange}
        onKeyDown={handleKeyDown}
      />
    </Paper>
  );
};

export default RichTextEditor;