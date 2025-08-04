import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Checkbox } from '../../../components/ui/checkbox';
import { RichTextEditor } from '../RichTextEditor';
import { Notification, NotificationType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Bell, Calendar, MessageCircle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

interface NotificationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (notification: Notification) => void;
  editingNotification: Notification | null;
  users?: { id: string; name: string }[];
  groups?: { id: string; name: string }[];
  activities?: { id: string; name: string }[];
  events?: { id: string; name: string }[];
  direction?: 'ltr' | 'rtl';
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
  open,
  onOpenChange,
  onSave,
  editingNotification,
  users = [],
  groups = [],
  activities = [],
  events = [],
  direction = 'ltr',
}) => {
  const [notification, setNotification] = useState<Notification>(() => {
    if (editingNotification) {
      return { ...editingNotification };
    }
    return {
      id: uuidv4(),
      type: 'announcement',
      title: '',
      content: '',
      date: new Date().toISOString(),
      read: false,
    };
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    editingNotification?.recipients || []
  );

  // Reset form when editingNotification changes
  React.useEffect(() => {
    if (editingNotification) {
      setNotification({ ...editingNotification });
      setSelectedUsers(editingNotification.recipients || []);
    } else {
      setNotification({
        id: uuidv4(),
        type: 'announcement',
        title: '',
        content: '',
        date: new Date().toISOString(),
        read: false,
      });
      setSelectedUsers([]);
    }
  }, [editingNotification, open]);

  const handleSave = () => {
    if (!notification.title.trim()) {
      alert('Please enter a notification title');
      return;
    }

    // Create a complete notification object
    const completeNotification: Notification = {
      ...notification,
      recipients: selectedUsers,
      date: notification.date || new Date().toISOString(),
    };

    onSave(completeNotification);
    onOpenChange(false);
  };

  const handleTypeChange = (type: NotificationType) => {
    setNotification({ ...notification, type });
  };

  const renderTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'announcement':
        return <MessageCircle className="h-4 w-4 text-pink-500" />;
      case 'article':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'activity':
        return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
      case 'reminder':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(current => 
      current.includes(userId)
        ? current.filter(id => id !== userId)
        : [...current, userId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editingNotification ? 'Modifier la notification' : 'Créer une notification'}
          </DialogTitle>
          <DialogDescription>
            {editingNotification
              ? 'Mettez à jour les détails de la notification.'
              : 'Entrez les détails de la notification et sélectionnez les destinataires.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Notification Type */}
          <div className="grid gap-2">
            <Label>Type de notification</Label>
            <RadioGroup
              value={notification.type}
              onValueChange={(value) => handleTypeChange(value as NotificationType)}
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
                <RadioGroupItem value="activity" id="type-activity" />
                <Label htmlFor="type-activity" className="flex items-center space-x-1 cursor-pointer">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span>Activité</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <RadioGroupItem value="reminder" id="type-reminder" />
                <Label htmlFor="type-reminder" className="flex items-center space-x-1 cursor-pointer">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>Rappel</span>
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
            />
          </div>

          {/* Content (using RichTextEditor) */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notification-content" className="text-right pt-2">
              Contenu
            </Label>
            <div className="col-span-3">
              <RichTextEditor
                id="notification-content"
                value={notification.content}
                onChange={(value) => setNotification({ ...notification, content: value })}
                direction={direction}
                height="200px"
              />
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
                onChange={(e) => setNotification({ ...notification, eventId: e.target.value || undefined })}
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

          {/* Related Group (if applicable) */}
          {groups.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notification-group" className="text-right">
                Groupe lié
              </Label>
              <select
                id="notification-group"
                value={notification.groupId || ''}
                onChange={(e) => setNotification({ ...notification, groupId: e.target.value || undefined })}
                className="col-span-3 w-full p-2 border rounded-md"
              >
                <option value="">Aucun groupe</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Related Activity (if applicable) */}
          {activities.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notification-activity" className="text-right">
                Activité liée
              </Label>
              <select
                id="notification-activity"
                value={notification.activityId || ''}
                onChange={(e) => setNotification({ ...notification, activityId: e.target.value || undefined })}
                className="col-span-3 w-full p-2 border rounded-md"
              >
                <option value="">Aucune activité</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Recipients (Users) */}
          {users.length > 0 && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Destinataires
              </Label>
              <div className="col-span-3 border rounded-md p-3 max-h-48 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun utilisateur disponible</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 pb-2 border-b">
                      <Checkbox 
                        id="select-all-users"
                        checked={selectedUsers.length === users.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(users.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                      <Label htmlFor="select-all-users">Sélectionner tous</Label>
                    </div>
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUser(user.id)}
                        />
                        <Label htmlFor={`user-${user.id}`}>{user.name}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Schedule Date/Time (optional) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notification-date" className="text-right">
              Date d'envoi
            </Label>
            <Input
              id="notification-date"
              type="datetime-local"
              value={notification.date ? new Date(notification.date).toISOString().slice(0, 16) : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString();
                setNotification({ ...notification, date });
              }}
              className="col-span-3"
            />
          </div>
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