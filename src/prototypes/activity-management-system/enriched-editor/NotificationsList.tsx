import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Info, MessageCircle, Settings, Filter, Home, Activity, Calendar, Menu, Bell, XCircle } from 'lucide-react';
import { Notification, NotificationGroup } from '../types';
import NotificationCard from './NotificationCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';

interface NotificationsListProps {
  notifications: NotificationGroup;
  users: any[]; // Use your User type here
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  markAsRead: (userId: string, notificationId: string) => void;
  clearNotifications: (userId: string) => void;
  formatTimestamp: (timestamp: string) => string;
  onViewDetails?: (notification: Notification) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  users,
  selectedUserId,
  setSelectedUserId,
  markAsRead,
  clearNotifications,
  formatTimestamp,
  onViewDetails,
}) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  // Get user's notifications
  const userNotifications = notifications[selectedUserId] || [];
  
  // Function to filter notifications
  const getFilteredNotifications = () => {
    let filtered = [...userNotifications];
    
    // Filter by type if filter is active
    if (filterType) {
      filtered = filtered.filter(n => n.type === filterType);
    }
    
    // Apply tab filtering
    if (selectedTab === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return filtered;
  };

  // Get notification counts for badges
  const getUnreadCount = () => userNotifications.filter(n => !n.read).length;
  
  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(selectedUserId, notificationId);
  };
  
  const handleFilterSelect = (type: string | null) => {
    setFilterType(type);
    setFilterDialogOpen(false);
  };
  
  const handleClearNotifications = () => {
    clearNotifications(selectedUserId);
  };

  // Group notifications by date categories
  const groupNotificationsByDate = () => {
    const filtered = getFilteredNotifications();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDay()).getTime();
    const yesterday = today - 86400000; // Minus one day in milliseconds
    const thisWeek = today - 6 * 86400000; // Minus 6 days
    
    const groups: { [key: string]: Notification[] } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: []
    };
    
    filtered.forEach(notification => {
      const date = new Date(notification.date).getTime();
      if (date >= today) {
        groups.today.push(notification);
      } else if (date >= yesterday) {
        groups.yesterday.push(notification);
      } else if (date >= thisWeek) {
        groups.thisWeek.push(notification);
      } else {
        groups.earlier.push(notification);
      }
    });
    
    return groups;
  };
  
  const notificationGroups = groupNotificationsByDate();
  const hasNotifications = getFilteredNotifications().length > 0;

  return (
    <div className="max-w-md mx-auto bg-gray-50 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">Mes notifications</h1>
        <div className="flex items-center gap-2">
          {getUnreadCount() > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {getUnreadCount()}
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* User selector (if applicable) */}
      {users.length > 1 && (
        <div className="p-4 border-b border-gray-200">
          <select
            className="w-full p-2 border rounded-md"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Filter tabs */}
      <Tabs
        defaultValue="all"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="border-b border-gray-200"
      >
        <TabsList className="w-full justify-start p-0 px-4 py-1 h-12 bg-transparent">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Tout
          </TabsTrigger>
          <TabsTrigger 
            value="unread"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Non lu {getUnreadCount() > 0 && `(${getUnreadCount()})`}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Content area */}
      <div className="flex-1 overflow-auto p-4">
        {/* Today */}
        {notificationGroups.today.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-3">Aujourd'hui</h2>
            {notificationGroups.today.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                formatTimestamp={formatTimestamp}
                onMarkAsRead={handleMarkAsRead}
                onClick={onViewDetails}
              />
            ))}
          </div>
        )}
        
        {/* Yesterday */}
        {notificationGroups.yesterday.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-3">Hier</h2>
            {notificationGroups.yesterday.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                formatTimestamp={formatTimestamp}
                onMarkAsRead={handleMarkAsRead}
                onClick={onViewDetails}
              />
            ))}
          </div>
        )}
        
        {/* This Week */}
        {notificationGroups.thisWeek.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-3">Cette semaine</h2>
            {notificationGroups.thisWeek.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                formatTimestamp={formatTimestamp}
                onMarkAsRead={handleMarkAsRead}
                onClick={onViewDetails}
              />
            ))}
          </div>
        )}
        
        {/* Earlier */}
        {notificationGroups.earlier.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-3">Plus tôt</h2>
            {notificationGroups.earlier.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                formatTimestamp={formatTimestamp}
                onMarkAsRead={handleMarkAsRead}
                onClick={onViewDetails}
              />
            ))}
          </div>
        )}
        
        {/* No notifications message */}
        {!hasNotifications && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Bell size={48} className="mb-4 opacity-30" />
            <p className="text-center">
              {filterType 
                ? "Aucune notification de ce type pour le moment."
                : selectedTab === 'unread'
                  ? "Vous n'avez pas de notifications non lues."
                  : "Vous n'avez pas de notifications."
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Clear Notifications Button (shown only if there are notifications) */}
      {userNotifications.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleClearNotifications}
          >
            <XCircle size={16} />
            <span>Effacer toutes les notifications</span>
          </Button>
        </div>
      )}
      
      {/* Filter button */}
      <div className="fixed bottom-20 right-4">
        <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg bg-black text-white flex items-center gap-2 px-6">
              <Filter className="h-5 w-5" />
              <span>Filtrer</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtrer par type</DialogTitle>
              <DialogDescription>
                Sélectionnez un type de notification à afficher
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <Button 
                variant={filterType === null ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => handleFilterSelect(null)}
              >
                <Bell className="mr-2 h-4 w-4" />
                Tous les types
              </Button>
              <Button 
                variant={filterType === 'announcement' ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => handleFilterSelect('announcement')}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Annonces
              </Button>
              <Button 
                variant={filterType === 'article' ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => handleFilterSelect('article')}
              >
                <Info className="mr-2 h-4 w-4" />
                Articles
              </Button>
              <Button 
                variant={filterType === 'event' ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => handleFilterSelect('event')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Événements
              </Button>
              <Button 
                variant={filterType === 'activity' ? "default" : "outline"} 
                className="w-full justify-start"
                onClick={() => handleFilterSelect('activity')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Activités
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={() => setFilterDialogOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Navigation bar */}
      <div className="bg-white border-t border-gray-200 p-4 mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center text-xs">
            <Home className="h-6 w-6 mb-1" />
            <span>Accueil</span>
          </div>
          <div className="flex flex-col items-center text-xs">
            <Activity className="h-6 w-6 mb-1" />
            <span>Entrainement</span>
          </div>
          <div className="flex flex-col items-center text-xs">
            <Calendar className="h-6 w-6 mb-1" />
            <span>Actualités</span>
          </div>
          <div className="flex flex-col items-center text-xs text-pink-500 font-medium">
            <Bell className="h-6 w-6 mb-1 text-pink-500" />
            <span>Notifications</span>
          </div>
          <div className="flex flex-col items-center text-xs">
            <Menu className="h-6 w-6 mb-1" />
            <span>Menu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsList;