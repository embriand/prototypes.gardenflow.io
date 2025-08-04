import React from 'react';
import { Calendar, Bell, MessageCircle, Info, Newspaper } from 'lucide-react';
import { NotificationType, DisplayCategory } from './types';

interface NotificationCardProps {
  notification: {
    id: string;
    type: NotificationType;
    title: string;
    content: string;
    date: string;
    read: boolean;
    icon?: string;
    eventId?: string;
    groupId?: string;
    activityId?: string;
    displayCategory?: DisplayCategory;
    message?: string;
    timestamp?: string;
  };
  event?: {
    id: string;
    name: string;
    content?: string;
    date?: string;
    displayCategory?: DisplayCategory;
  };
  formatTimestamp: (timestamp: string) => string;
  formatDate?: (date: string) => string;
  onClick: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  event,
  formatTimestamp,
  formatDate,
  onClick
}) => {
      
  // Function to determine notification icon based on type
  const getNotificationIcon = () => {
    const type = notification.type || 'default';
    
    switch(type) {
      case 'event':
        return <Calendar size={16} className="text-green-500" />;
      case 'announcement':
        return <MessageCircle size={16} className="text-pink-500" />;
      case 'article':
        return <Info size={16} className="text-blue-500" />;
      case 'activity':
        return <Calendar size={16} className="text-purple-500" />;
      case 'reminder':
        return <Bell size={16} className="text-orange-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  // Function to determine badge based on display category
  const getDisplayCategoryBadge = () => {
    // Get display category from notification or event
    const displayCat = notification.displayCategory || (event?.displayCategory) || 'both';
    
    if (displayCat === 'notification') {
      return (
        <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
          <Bell size={10} className="mr-1" />
          Notif
        </div>
      );
    } else if (displayCat === 'actuality') {
      return (
        <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
          <Newspaper size={10} className="mr-1" />
          Actu
        </div>
      );
    } else {
      return null; // Don't show badge for 'both'
    }
  };

  // Function to determine content to display
  const renderContent = () => {
    
    // First check if notification has content
    if (notification.content && notification.content.trim() !== '') {
      return <div dangerouslySetInnerHTML={{ __html: notification.content }} />;
    }
    
    // Then check if there's an event with content
    if (event?.content && event.content.trim() !== '') {
        return <div dangerouslySetInnerHTML={{ __html: event.content || '' }} />;
    }

    // Then check if notification has a message
    if (notification.message && notification.message.trim() !== '') {
      return <div>{notification.message}</div>;
    }
    
    // Fallback message
    return <div>No content available</div>;
  };

  return (
    <div
      className={`p-3 rounded-lg shadow-sm ${
        notification.read 
          ? 'bg-white' 
          : 'bg-blue-50 border-l-4 border-blue-500'
      } cursor-pointer transition-all hover:shadow-md`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {getNotificationIcon()}
          <h3 className="font-medium text-gray-800 ml-2">
            {notification.title || event?.name || 'Notification'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {getDisplayCategoryBadge()}
          <span className="text-xs text-slate-500">
            {formatTimestamp(notification.timestamp || notification.date)}
          </span>
        </div>
      </div>
      
      <div className="text-sm text-gray-700">
        {renderContent()}
      </div>
      
      {event?.date && formatDate && (
        <div className="mt-2 text-xs font-medium flex items-center text-gray-600">
          <Calendar size={12} className="mr-1" />
          {formatDate(event.date)}
        </div>
      )}
    </div>
  );
};

export default NotificationCard;