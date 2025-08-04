import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '../../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';

interface NotificationRichEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  direction?: 'ltr' | 'rtl';
  height?: string;
}

const NotificationRichEditor: React.FC<NotificationRichEditorProps> = ({
  id,
  value,
  onChange,
  direction = 'ltr',
  height = '200px'
}) => {
  // Common emojis for notifications
  const notificationEmojis = ['🔔', '📢', '💬', 'ℹ️', '⚠️', '✅', '❌', '⭐', '🔥'];
  
  // Garden/plant related emojis
  const gardenEmojis = ['🌱', '🌿', '🍃', '🌷', '🌺', '🌻', '🌼', '🌸', '🌹', '🍀', '🪴', '🌵'];
  
  // Calendar/event related emojis
  const eventEmojis = ['📅', '⏰', '⌚', '📆', '🕒', '📌', '📝', '🗓️'];
  
  // Common symbols and other useful emoji
  const symbolEmojis = ['👍', '👏', '❤️', '🎉', '🎯', '🚀', '💪', '🏆', '🔗', '📍'];

  const insertEmoji = (emoji: string) => {
    onChange(value + emoji);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 bg-slate-50 p-2.5 rounded-md border mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              🔔 Notification
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-5 gap-1">
              {notificationEmojis.map((emoji, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => insertEmoji(emoji)}
                >
                  <span className="text-xl">{emoji}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              🌱 Jardin
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-5 gap-1">
              {gardenEmojis.map((emoji, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => insertEmoji(emoji)}
                >
                  <span className="text-xl">{emoji}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              📅 Événements
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-5 gap-1">
              {eventEmojis.map((emoji, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => insertEmoji(emoji)}
                >
                  <span className="text-xl">{emoji}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              👍 Symboles
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-5 gap-1">
              {symbolEmojis.map((emoji, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => insertEmoji(emoji)}
                >
                  <span className="text-xl">{emoji}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <RichTextEditor
        id={id}
        value={value}
        onChange={onChange}
        direction={direction}
        height={height}
      />
    </div>
  );
};

export default NotificationRichEditor;