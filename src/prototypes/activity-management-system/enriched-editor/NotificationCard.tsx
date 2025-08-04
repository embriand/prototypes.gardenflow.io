import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Bell, Calendar, MessageCircle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../../../lib/utils';

interface NotificationCardProps {
  notification: Notification;
  formatTimestamp: (date: string) => string;
  onMarkAsRead: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  formatTimestamp,
  onMarkAsRead,
  onClick,
}) => {
  // Function to get notification type text
  const getNotificationType = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'Annonce';
      case 'article':
        return 'Article';
      case 'event':
        return 'Événement';
      case 'activity':
        return 'Activité';
      case 'reminder':
        return 'Rappel';
      default:
        return 'Notification';
    }
  };

  // Function to get the appropriate icon based on notification type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'announcement':
        return <MessageCircle size={20} className="text-pink-500" />;
      case 'article':
        return <Info size={20} className="text-blue-500" />;
      case 'event':
        return <Calendar size={20} className="text-green-500" />;
      case 'activity':
        return <CheckCircle2 size={20} className="text-purple-500" />;
      case 'reminder':
        return <AlertCircle size={20} className="text-amber-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  // Function to get the background color for the icon container
  const getIconBgColor = () => {
    switch (notification.type) {
      case 'announcement':
        return 'bg-pink-50';
      case 'article':
        return 'bg-blue-50';
      case 'event':
        return 'bg-green-50';
      case 'activity':
        return 'bg-purple-50';
      case 'reminder':
        return 'bg-amber-50';
      default:
        return 'bg-gray-50';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <Card 
      className={cn(
        "mb-3 overflow-hidden border rounded-lg shadow-sm transition-all", 
        notification.read ? "border-gray-200" : "border-l-4 border-l-blue-500",
        "hover:shadow-md cursor-pointer"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          {/* Logo/Icon Column */}
          <div className="mr-3 mt-1">
            <div className={cn("p-2 rounded-full flex items-center justify-center w-12 h-12", getIconBgColor())}>
              {notification.icon ? (
                // If custom icon exists, use it
                <div dangerouslySetInnerHTML={{ __html: notification.icon }} />
              ) : (
                // Otherwise use default icon based on type
                getNotificationIcon()
              )}
            </div>
          </div>
          
          {/* Content Column */}
          <div className="flex-1">
            {/* Header with title */}
            <div className="mb-1">
              <h3 className="font-bold text-lg">{notification.title}</h3>
            </div>
            
            {/* Notification meta info */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="font-medium">{getNotificationType(notification.type)}</span>
              <span className="mx-1">•</span>
              <span>{formatTimestamp(notification.date)}</span>
              {!notification.read && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-blue-500 font-medium">Nouveau</span>
                </>
              )}
            </div>
            
            {/* Notification content */}
            <div 
              className="text-sm" 
              dangerouslySetInnerHTML={{ __html: notification.content }} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;