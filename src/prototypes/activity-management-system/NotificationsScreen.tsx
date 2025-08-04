import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Bell, Home, Menu, X, Settings, Filter, Newspaper } from 'lucide-react';
import NotificationCard from './NotificationCard';

import { useDataContext } from './DataContext';


// Current view mode
type ViewMode = 'notifications' | 'actualities';

// Props interface allows both standalone and integrated usage
interface NotificationsScreenProps {
  standalone?: boolean;
  currentViewMode?: ViewMode;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  standalone = false,
  currentViewMode = 'notifications'
}) => {
  const {
    users,
    selectedUser,
    setSelectedUser,
    notifications,
    markAsRead,
    clearNotifications,
    formatTimestamp,
    formatDate,
    events,
  } = useDataContext();

  const [viewMode, setViewMode] = useState<ViewMode>(currentViewMode);
  const [notificationCounts, setNotificationCounts] = useState<{[key: string]: number}>({});
  const [actualityCounts, setActualityCounts] = useState<{[key: string]: number}>({});

  // Calculate counts for all users
  useEffect(() => {
    if (notifications) {
      const notifCounts: {[key: string]: number} = {};
      const actualCounts: {[key: string]: number} = {};
      
      Object.keys(notifications).forEach(userId => {
        if (notifications[userId]) {
          // Count notifications
          notifCounts[userId] = notifications[userId].filter(n => {
            // Get display category from notification or related event
            const event = n.eventId ? events.find(e => e.id === n.eventId) : null;
            const displayCat = n.displayCategory || (event?.displayCategory) || 'both';
            return (displayCat === 'notification' || displayCat === 'both') && !n.read;
          }).length;
          
          // Count actualities
          actualCounts[userId] = notifications[userId].filter(n => {
            // Get display category from notification or related event
            const event = n.eventId ? events.find(e => e.id === n.eventId) : null;
            const displayCat = n.displayCategory || (event?.displayCategory) || 'both';
            return (displayCat === 'actuality' || displayCat === 'both') && !n.read;
          }).length;
        }
      });
      
      setNotificationCounts(notifCounts);
      setActualityCounts(actualCounts);
    }
  }, [notifications, events]);

  // Get current user's notifications
  const userNotifications = selectedUser && notifications ? notifications[selectedUser] || [] : [];
  
  // Filter notifications based on view mode
  const filteredNotifications = userNotifications.filter(notification => {
    // Get the related event if it exists
    const event = notification.eventId ? events.find(e => e.id === notification.eventId) : null;
    
    // Determine display category from notification or related event
    const displayCat = notification.displayCategory || (event ? event.displayCategory : null) || 'both';
    
    if (viewMode === 'notifications') {
      return displayCat === 'notification' || displayCat === 'both';
    } else {
      return displayCat === 'actuality' || displayCat === 'both';
    }
  });
  
  // Sort notifications by date (newest first)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    const dateA = a.timestamp ? new Date(a.timestamp).getTime() : new Date(a.date).getTime();
    const dateB = b.timestamp ? new Date(b.timestamp).getTime() : new Date(b.date).getTime();
    return dateB - dateA;
  });
  
  // Get current user's unread count for the current view mode
  const currentUserNotificationCount = notificationCounts[selectedUser] || 0;
  const currentUserActualityCount = actualityCounts[selectedUser] || 0;

  // Handle notification or actuality click based on standalone mode
  const handleNotificationClick = (userId: string, notificationId: string | number) => {
    markAsRead(userId, notificationId);

    // If standalone, could add additional handling like opening details
    if (standalone) {
      // For example: navigate to detail view, open modal, etc.
    }
  };

  return (
    <div className={`${standalone ? 'bg-slate-50 min-h-screen' : 'h-full'} flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">
          {viewMode === 'notifications' ? 'Mes notifications' : 'Actualités'}
        </h1>
        <div className="flex items-center gap-2">
          {(viewMode === 'notifications' && currentUserNotificationCount > 0) && (
            <div className="bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
              {currentUserNotificationCount}
            </div>
          )}
          {(viewMode === 'actualities' && currentUserActualityCount > 0) && (
            <div className="bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
              {currentUserActualityCount}
            </div>
          )}
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* User selector (if multiple users) */}
      {users.length > 1 && (
        <div className="p-4 border-b bg-white">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {users.map(user => (
                <SelectItem key={user.id} value={user.id} className="bg-white hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <span>{user.name}</span>
                    <div className="flex gap-1">
                      {notificationCounts[user.id] > 0 && (
                        <div className="flex items-center">
                          <Bell size={12} className="text-blue-500 mr-1" />
                          <span className="bg-blue-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                            {notificationCounts[user.id]}
                          </span>
                        </div>
                      )}
                      {actualityCounts[user.id] > 0 && (
                        <div className="flex items-center ml-1">
                          <Newspaper size={12} className="text-green-500 mr-1" />
                          <span className="bg-green-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                            {actualityCounts[user.id]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Notifications content - Single Column */}
      <div className="flex-1 overflow-auto p-4">
        {sortedNotifications.length > 0 ? (
          <div className="space-y-3">
            {sortedNotifications.map(notification => {
              const eventId = notification.eventId;
              const event = events.find(e => e.id === eventId);

              return (
                <NotificationCard
                  key={notification.id}
                  notification={{ ...notification, id: String(notification.id) }}
                  event={event}
                  formatTimestamp={(timestamp) => formatTimestamp(timestamp || notification.date)}
                  formatDate={formatDate}
                  onClick={() => handleNotificationClick(selectedUser, notification.id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            {viewMode === 'notifications' ? (
              <>
                <Bell size={48} className="mb-4 opacity-30" />
                <p className="text-center">Vous n'avez pas de notifications.</p>
              </>
            ) : (
              <>
                <Newspaper size={48} className="mb-4 opacity-30" />
                <p className="text-center">Aucune actualité disponible.</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Clear button (only if there are notifications) */}
      {sortedNotifications.length > 0 && (
        <div className="border-t bg-white p-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => clearNotifications(selectedUser)}
          >
            <X size={16} className="mr-2" />
            {viewMode === 'notifications' ? 'Effacer toutes les notifications' : 'Effacer toutes les actualités'}
          </Button>
        </div>
      )}

      {/* Filter button */}
      <div className="fixed bottom-20 right-4">
        <Button className="rounded-full shadow-lg bg-black text-white flex items-center gap-2 px-6">
          <Filter className="h-5 w-5" />
          <span>Filtrer</span>
        </Button>
      </div>

      {/* Navigation bar */}
      <div className="bg-white border-t mt-auto">
        <div className="flex justify-between items-center">
          {standalone && (
            <Button
              variant="ghost"
              className="flex flex-col items-center p-4 w-full text-gray-500 hover:text-gray-700"
            >
              <Home className="h-6 w-6 mb-1" />
              <span className="text-xs">Accueil</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-4 w-full relative transition-all duration-200 ${
              viewMode === 'actualities' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setViewMode('actualities')}
          >
            <Newspaper className={`h-6 w-6 mb-1 transition-colors duration-200 ${
              viewMode === 'actualities' ? 'text-green-600' : ''
            }`} />
            {currentUserActualityCount > 0 && (
              <span className="absolute top-2 right-1/4 bg-green-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                {currentUserActualityCount}
              </span>
            )}
            <span className="text-xs">Actualités</span>
          </Button>
          
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-4 w-full relative transition-all duration-200 ${
              viewMode === 'notifications' 
                ? 'text-pink-600 bg-pink-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setViewMode('notifications')}
          >
            <Bell className={`h-6 w-6 mb-1 transition-colors duration-200 ${
              viewMode === 'notifications' ? 'text-pink-600' : ''
            }`} />
            {currentUserNotificationCount > 0 && (
              <span className="absolute top-2 right-1/4 bg-pink-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                {currentUserNotificationCount}
              </span>
            )}
            <span className="text-xs">Notifications</span>
          </Button>
          
          {standalone && (
            <Button
              variant="ghost"
              className="flex flex-col items-center p-4 w-full text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6 mb-1" />
              <span className="text-xs">Menu</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;