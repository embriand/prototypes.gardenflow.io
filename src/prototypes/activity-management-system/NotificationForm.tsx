import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Calendar, Bell, MessageCircle, Info } from 'lucide-react';
import NotificationRichEditor from './NotificationRichEditor';
import { v4 as uuidv4 } from 'uuid';

interface NotificationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (notification: any) => void;
  editingNotification: any | null;
  events?: { id: string; name: string }[];
  direction?: 'ltr' | 'rtl';
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  open,
  onOpenChange,
  onSave,
  editingNotification,
  events = [],
  direction = 'ltr',
}) => {
  const [notification, setNotification] = useState<any>({
    id: '',
    type: 'announcement',
    title: '',
    message: '',
    content: '',
    timestamp: new Date().toISOString(),
    read: false,
    eventId: '',
  });

  // Reset form when editingNotification changes
  useEffect(() => {
    if (editingNotification) {
      setNotification({ ...editingNotification });
    } else {
      setNotification({
        id: uuidv4(),
        type: 'announcement',
        title: '',
        message: '',
        content: '',
        timestamp: new Date().toISOString(),
        read: false,
        eventId: '',
      });
    }
  }, [editingNotification, open]);

  const handleSave = () => {
    if (!notification.title.trim()) {
      alert('Veuillez entrer un titre pour la notification');
      return;
    }

    if (!notification.message.trim() && !notification.content.trim()) {
      alert('Veuillez entrer un message ou du contenu pour la notification');
      return;
    }

    onSave({
      ...notification,
      timestamp: notification.timestamp || new Date().toISOString(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingNotification ? 'Modifier la notification' : 'Créer une notification'}
          </DialogTitle>
          <DialogDescription>
            {editingNotification
              ? 'Mettez à jour les détails de la notification.'
              : 'Entrez les détails de la nouvelle notification.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Notification Type */}
          <div className="grid gap-2">
            <Label>Type de notification</Label>
            <RadioGroup
              value={notification.type}
              onValueChange={(value) => setNotification({ ...notification, type: value })}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <RadioGroupItem value="announcement" id="type-announcement" />
                <Label htmlFor="type-announcement" className="flex items-center space-x-1 cursor-pointer">
                  <MessageCircle className="h-4 w-4 text-pink-500" />
                  <span>Annonce</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <RadioGroupItem value="article" id="type-article" />
                <Label htmlFor="type-article" className="flex items-center space-x-1 cursor-pointer">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span>Article</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <RadioGroupItem value="event" id="type-event" />
                <Label htmlFor="type-event" className="flex items-center space-x-1 cursor-pointer">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span>Événement</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <RadioGroupItem value="default" id="type-default" />
                <Label htmlFor="type-default" className="flex items-center space-x-1 cursor-pointer">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span>Par défaut</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notification-title" className="text-right">
              Titre
            </Label>
            <Input
              id="notification-title"
              value={notification.title}
              onChange={(e) => setNotification({ ...notification, title: e.target.value })}
              className="col-span-3"
              placeholder="Titre de la notification"
            />
          </div>

          {/* Simple Message */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notification-message" className="text-right">
              Message simple
            </Label>
            <Input
              id="notification-message"
              value={notification.message}
              onChange={(e) => setNotification({ ...notification, message: e.target.value })}
              className="col-span-3"
              placeholder="Message court et simple (sans formatage)"
            />
          </div>

          {/* Rich Content */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notification-content" className="text-right pt-2">
              Contenu formaté
            </Label>
            <div className="col-span-3">
              <NotificationRichEditor
                id="notification-content"
                value={notification.content || ''}
                onChange={(value) => setNotification({ ...notification, content: value })}
                direction={direction}
                height="200px"
              />
              <p className="text-xs text-gray-500 mt-1">
                Utilisez ce champ pour un contenu plus riche avec des emojis et du formatage.
              </p>
            </div>
          </div>

          {/* Related Event (if applicable) */}
          {events.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notification-event" className="text-right">
                Événement lié
              </Label>
              <select
                id="notification-event"
                value={notification.eventId || ''}
                onChange={(e) => setNotification({ ...notification, eventId: e.target.value || '' })}
                className="col-span-3 w-full p-2 border rounded-md"
              >
                <option value="">Aucun événement</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            {editingNotification ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationForm;