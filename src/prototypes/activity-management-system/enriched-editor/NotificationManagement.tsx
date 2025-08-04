import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Bell, PlusCircle, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import NotificationsList from './NotificationsList';
import NotificationForm from './NotificationForm';
import { Notification, NotificationGroup } from '../types';

interface NotificationManagementProps {
  users: { id: string; name: string }[];
  groups?: { id: string; name: string }[];
  activities?: { id: string; name: string; description?: string }[];
  events?: { id: string; name: string; description?: string; date: string }[];
  direction?: 'ltr' | 'rtl';
}

const NotificationManagement: React.FC<NotificationManagementProps> = ({
  users,
  groups = [],
  activities = [],
  events = [],
  direction = 'ltr',
}) => {
  // State for notifications
  const [notifications, setNotifications] = useState<NotificationGroup>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : {};
  });

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days < 7) {
        return `il y a ${days} jour${days > 1 ? 's' : ''}`;
      } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // State for selected user in the management view
  const [selectedUserId, setSelectedUserId] = useState<string>(
    users.length > 0 ? users[0].id : ''
  );

  // State for the notification creation dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('view');

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Add a notification
  const addNotification = (notification: Notification) => {
    const newNotifications = { ...notifications };

    // Create arrays for each recipient
    interface UserNotification extends Notification {
        id: string;
        read: boolean;
    }

    (notification.recipients || [selectedUserId]).forEach((userId: string) => {
        if (!newNotifications[userId]) {
            newNotifications[userId] = [];
        }

        const userNotification: UserNotification = {
            ...notification,
            id: uuidv4(), // Generate unique ID for each recipient
            read: false,
        };

        newNotifications[userId].push(userNotification);
    });

    setNotifications(newNotifications);
    setFormOpen(false);
    setEditingNotification(null);
  };

  // Update a notification
  const updateNotification = (notification: Notification) => {
    const newNotifications = { ...notifications };

    // Update in current user's notifications
    if (newNotifications[selectedUserId]) {
      newNotifications[selectedUserId] = newNotifications[selectedUserId].map(n => 
        n.id === notification.id ? { ...notification } : n
      );
    }

    setNotifications(newNotifications);
    setFormOpen(false);
    setEditingNotification(null);
  };

  // Mark a notification as read
  const markAsRead = (userId: string, notificationId: string) => {
    const newNotifications = { ...notifications };

    if (newNotifications[userId]) {
      newNotifications[userId] = newNotifications[userId].map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );

      setNotifications(newNotifications);
    }
  };

  // Clear all notifications for a user
  const clearNotifications = (userId: string) => {
    const newNotifications = { ...notifications };
    newNotifications[userId] = [];
    setNotifications(newNotifications);
  };

  // View notification details
  const viewNotificationDetails = (notification: Notification) => {
    setEditingNotification(notification);
    setFormOpen(true);
  };

  const handleCreateNotification = () => {
    setEditingNotification(null);
    setFormOpen(true);
  };

  const generateMockNotifications = () => {
    const mockTypes = ['announcement', 'article', 'event', 'activity', 'reminder'];
    const mockTitles = [
      'Le Nuage Montpellier',
      'Jardin Communautaire',
      'Atelier de jardinage',
      'Journée portes ouvertes'
    ];
    const mockContents = [
      '🌟 JOURNÉE MONDIALE DE LA PLANTE 🌟<br>📅 Demain, pour célébrer cette journée spéciale, nous offrons des graines gratuites!',
      '📌 [ NOUVEAUTÉ ]<br>Un nouvel espace de jardinage sera installé cette semaine 🌱',
      'Votre jardin vient de publier une nouvelle actualité : « 🌱 Atelier compostage »',
      '🍀 Stage de PERMACULTURE 🌿<br>📌 Save the date, le samedi 15/03/25.'
    ];

    const now = new Date();
    const newNotifications = { ...notifications };

    // Generate 10 random notifications for each user
    users.forEach(user => {
      if (!newNotifications[user.id]) {
        newNotifications[user.id] = [];
      }

      // Add 3-5 mock notifications per user
      const numToAdd = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numToAdd; i++) {
        const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
        const randomTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)];
        const randomContent = mockContents[Math.floor(Math.random() * mockContents.length)];
        
        // Random date in the last 14 days
        const randomDaysAgo = Math.floor(Math.random() * 14);
        const date = new Date(now);
        date.setDate(date.getDate() - randomDaysAgo);
        
        newNotifications[user.id].push({
          id: uuidv4(),
          type: randomType as any,
          title: randomTitle,
          content: randomContent,
          date: date.toISOString(),
          read: Math.random() > 0.6, // 40% chance of being unread
        });
      }
    });

    setNotifications(newNotifications);
    alert('Mock notifications generated successfully!');
  };

  // Handler for the form submit
  const handleSaveNotification = (notification: Notification) => {
    if (editingNotification) {
      updateNotification(notification);
    } else {
      addNotification(notification);
    }
  };

  // Calculate total and unread notification counts
  const getTotalNotifications = () => {
    return Object.values(notifications).reduce((sum, userNotifs) => sum + userNotifs.length, 0);
  };

  const getUnreadNotifications = () => {
    return Object.values(notifications).reduce(
      (sum, userNotifs) => sum + userNotifs.filter(n => !n.read).length, 
      0
    );
  };

  return (
    <div className="flex h-full">
      {/* Management Side */}
      <Card className="flex-1 max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des notifications</CardTitle>
            <Button size="sm" variant="outline" onClick={generateMockNotifications}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Générer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="view">
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="create">
                Créer
              </TabsTrigger>
            </TabsList>

            {/* View Overview Tab */}
            <TabsContent value="view">
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <span className="text-3xl font-bold">{getTotalNotifications()}</span>
                      <span className="text-sm text-muted-foreground">Total notifications</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <span className="text-3xl font-bold">{getUnreadNotifications()}</span>
                      <span className="text-sm text-muted-foreground">Non lues</span>
                    </CardContent>
                  </Card>
                </div>

                {/* User Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sélectionner utilisateur</label>
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

                {/* User's Notifications */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <Button onClick={handleCreateNotification} size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Nouvelle
                    </Button>
                  </div>

                  <div className="max-h-96 overflow-auto border rounded-md p-2">
                    {!notifications[selectedUserId] || notifications[selectedUserId].length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Aucune notification pour cet utilisateur</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications[selectedUserId]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map(notification => (
                            <div 
                              key={notification.id} 
                              className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                              onClick={() => viewNotificationDetails(notification)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{notification.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatTimestamp(notification.date)}
                                  </div>
                                </div>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Create Tab */}
            <TabsContent value="create">
              <Button 
                className="w-full mb-6" 
                size="lg"
                onClick={handleCreateNotification}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Créer une nouvelle notification
              </Button>
              
              {/* Recent Template Examples */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Modèles récents</h3>
                <div className="space-y-2">
                  <div 
                    className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setEditingNotification({
                        id: '',
                        type: 'announcement',
                        title: 'Annonce importante',
                        content: '🌟 Annonce importante concernant le jardin communautaire',
                        date: new Date().toISOString(),
                        read: false,
                      });
                      setFormOpen(true);
                    }}
                  >
                    <div className="font-medium">Annonce importante</div>
                    <div className="text-sm text-muted-foreground">Modèle d'annonce</div>
                  </div>
                  
                  <div 
                    className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setEditingNotification({
                        id: '',
                        type: 'event',
                        title: 'Nouvel événement',
                        content: '📅 Un nouvel événement a été planifié, rejoignez-nous!',
                        date: new Date().toISOString(),
                        read: false,
                      });
                      setFormOpen(true);
                    }}
                  >
                    <div className="font-medium">Nouvel événement</div>
                    <div className="text-sm text-muted-foreground">Modèle d'événement</div>
                  </div>
                  
                  <div 
                    className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setEditingNotification({
                        id: '',
                        type: 'reminder',
                        title: 'Rappel d\'activité',
                        content: '⏰ N\'oubliez pas l\'activité à venir!',
                        date: new Date().toISOString(),
                        read: false,
                      });
                      setFormOpen(true);
                    }}
                  >
                    <div className="font-medium">Rappel d'activité</div>
                    <div className="text-sm text-muted-foreground">Modèle de rappel</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview Side */}
      <div className="flex-1 ml-4 bg-gray-50 border rounded-lg overflow-hidden">
        <NotificationsList
          notifications={notifications}
          users={users}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          markAsRead={markAsRead}
          clearNotifications={clearNotifications}
          formatTimestamp={formatTimestamp}
          onViewDetails={viewNotificationDetails}
        />
      </div>

      {/* Form Dialog */}
      <NotificationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveNotification}
        editingNotification={editingNotification}
        users={users}
        groups={groups}
        activities={activities}
        events={events}
        direction={direction}
      />
    </div>
  );
};

export default NotificationManagement;