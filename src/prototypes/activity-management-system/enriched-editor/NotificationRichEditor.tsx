import React, { useRef } from 'react';
import { RichTextEditor } from '../RichTextEditor';
import { Button } from '../../../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Bell, Calendar, MessageCircle, Info, AlertCircle, CheckCircle2, 
         Award, Heart, Star, ThumbsUp, Smile, Zap, Gift, PartyPopper } from 'lucide-react';
// Fire
interface NotificationRichEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  direction?: 'ltr' | 'rtl';  // Support for RTL
  height?: string; // Allow setting a fixed height
}

export const NotificationRichEditor: React.FC<NotificationRichEditorProps> = ({
  id,
  value,
  onChange,
  direction = 'ltr',
  height = '300px'
}) => {
  const editorRef = useRef<any>(null);

  // Icon categories for notifications
  const notificationIcons = [
    { icon: <Bell size={20} className="text-gray-600" />, emoji: '🔔', label: 'Notification' },
    { icon: <MessageCircle size={20} className="text-pink-500" />, emoji: '💬', label: 'Message' },
    { icon: <Info size={20} className="text-blue-500" />, emoji: 'ℹ️', label: 'Info' },
    { icon: <Calendar size={20} className="text-green-500" />, emoji: '📅', label: 'Événement' }
  ];

  const statusIcons = [
    { icon: <AlertCircle size={20} className="text-red-500" />, emoji: '⚠️', label: 'Alerte' },
    { icon: <CheckCircle2 size={20} className="text-green-500" />, emoji: '✅', label: 'Terminé' },
    { icon: <Zap size={20} className="text-yellow-500" />, emoji: '⚡', label: 'Important' }
  ];

  const celebrationIcons = [
    { icon: <PartyPopper size={20} className="text-purple-500" />, emoji: '🎉', label: 'Célébration' },
    { icon: <Award size={20} className="text-amber-500" />, emoji: '🏆', label: 'Récompense' },
    { icon: <Star size={20} className="text-yellow-500" />, emoji: '⭐', label: 'Étoile' },
    { icon: <Gift size={20} className="text-red-500" />, emoji: '🎁', label: 'Cadeau' }
  ];

  const emotionIcons = [
    { icon: <Heart size={20} className="text-red-500" />, emoji: '❤️', label: 'Cœur' },
    { icon: <ThumbsUp size={20} className="text-blue-500" />, emoji: '👍', label: 'Pouce en haut' },
    { icon: <Bell size={20} className="text-orange-500" />, emoji: '🔥', label: 'Feu' },
    { icon: <Smile size={20} className="text-yellow-500" />, emoji: '😊', label: 'Sourire' }
  ];

  const insertEmoji = (emoji: string) => {
    if (editorRef.current) {
      // If we have direct access to the editor content
      const content = value + emoji;
      onChange(content);
    } else {
      // Otherwise just append to the end
      onChange(value + emoji);
    }
  };

  // Common emojis for garden/plant app
  const gardenEmojis = ['🌱', '🌿', '🍃', '🌷', '🌺', '🌻', '🌼', '🌸', '🌹', '🍀', '🍂', '🍁', '🌳', '🌲', '🌴', '🪴', '☘️', '🌵', '🌾', '💐', '🏡', '⛅', '🌞', '🌈'];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 bg-slate-50 p-2.5 rounded-md border mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 px-2">
              🔔 Notification
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Icônes de notification</h4>
              <div className="grid grid-cols-4 gap-1">
                {notificationIcons.map(item => (
                  <Button 
                    key={item.label} 
                    variant="ghost" 
                    className="h-8 px-2 flex flex-col items-center text-xs"
                    onClick={() => insertEmoji(item.emoji)}
                  >
                    <span className="text-lg mb-1">{item.emoji}</span>
                    <span className="text-xs truncate">{item.label}</span>
                  </Button>
                ))}
              </div>
              
              <h4 className="font-medium text-sm pt-2">Statuts</h4>
              <div className="grid grid-cols-4 gap-1">
                {statusIcons.map(item => (
                  <Button 
                    key={item.label} 
                    variant="ghost" 
                    className="h-8 px-2 flex flex-col items-center text-xs"
                    onClick={() => insertEmoji(item.emoji)}
                  >
                    <span className="text-lg mb-1">{item.emoji}</span>
                    <span className="text-xs truncate">{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 px-2">
              🎉 Célébration
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Célébrations</h4>
              <div className="grid grid-cols-4 gap-1">
                {celebrationIcons.map(item => (
                  <Button 
                    key={item.label} 
                    variant="ghost" 
                    className="h-8 px-2 flex flex-col items-center text-xs"
                    onClick={() => insertEmoji(item.emoji)}
                  >
                    <span className="text-lg mb-1">{item.emoji}</span>
                    <span className="text-xs truncate">{item.label}</span>
                  </Button>
                ))}
              </div>

              <h4 className="font-medium text-sm pt-2">Émotions</h4>
              <div className="grid grid-cols-4 gap-1">
                {emotionIcons.map(item => (
                  <Button 
                    key={item.label} 
                    variant="ghost" 
                    className="h-8 px-2 flex flex-col items-center text-xs"
                    onClick={() => insertEmoji(item.emoji)}
                  >
                    <span className="text-lg mb-1">{item.emoji}</span>
                    <span className="text-xs truncate">{item.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 px-2">
              🌱 Jardin
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Emojis de jardin/plantes</h4>
              <div className="grid grid-cols-6 gap-1">
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
        ref={editorRef}
      />
    </div>
  );
};

export default NotificationRichEditor;