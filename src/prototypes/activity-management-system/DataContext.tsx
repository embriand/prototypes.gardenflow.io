import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import {
  Activity,
  Group,
  User,
  Event,
  Assignment,
  Notification
} from './types';

// Helper function to get current timestamp
const getTimestamp = () => new Date().toISOString();

interface AutomaticAssignment {
  eventId: string;
  userId: string;
  groupId: string;
  activityId: string;
}

type NotificationRecord = {
  assignmentId: string; // We'll generate this from the assignment details
  timestamp: string;
};

interface DataContextType {
  users: User[];
  groups: Group[];
  activities: Activity[];
  events: Event[];
  assignments: Assignment[];
  notifications: { [key: string]: Notification[] };
  automaticAssignments: AutomaticAssignment[];
  notifiedAssignments: NotificationRecord[];
  
  // UI state
  selectedUser: string;
  direction: 'ltr' | 'rtl';
  
  // CRUD operations
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<{ [key: string]: Notification[] }>>;
  setAutomaticAssignments: React.Dispatch<React.SetStateAction<AutomaticAssignment[]>>;
  setNotifiedAssignments: React.Dispatch<React.SetStateAction<NotificationRecord[]>>;
  setSelectedUser: (userId: string) => void;
  
  // Helper functions
  generateAutomaticAssignments: () => void;
  handleSendNotification: () => void;
  markAsRead: (userId: string, notificationId: string | number) => void;
  clearNotifications: (userId: string) => void;
  formatDate: (dateString: string) => string;
  formatTimestamp: (timestamp: string) => string;
  
  // Calculated values
  unreadNotificationsCount: number;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: 'user1', name: 'John Doe', email: 'john@example.com', availability: { Monday: ["9AM-12PM", "12PM-3PM"], Tuesday: ["9AM-12PM", "12PM-3PM"], Wednesday: ["12PM-3PM", "3PM-6PM"], Thursday: ["9AM-12PM", "12PM-3PM"] } },
      { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', availability: { Monday: ["3PM-6PM", "6PM-9PM"], Tuesday: ["3PM-6PM", "6PM-9PM"], Wednesday: ["9AM-12PM", "12PM-3PM"], Friday: ["9AM-12PM", "12PM-3PM"] } },
      { id: 'user3', name: 'Bob Johnson', email: 'bob@example.com', availability: { Monday: ["9AM-12PM"], Tuesday: ["9AM-12PM"], Thursday: ["3PM-6PM"], Friday: ["3PM-6PM"] } },
    ];
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const savedGroups = localStorage.getItem('groups');
    return savedGroups ? JSON.parse(savedGroups) : [
      { id: 'group1', name: 'Marketing Team' },
      { id: 'group2', name: 'Development Team' },
      { id: 'group3', name: 'Support Team' },
    ];
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const savedActivities = localStorage.getItem('activities');
    return savedActivities ? JSON.parse(savedActivities) : [
      { id: 'activity1', name: 'Content Creation', description: 'Creating blog posts and social media content' },
      { id: 'activity2', name: 'Code Review', description: 'Reviewing pull requests and code changes' },
      { id: 'activity3', name: 'Customer Support', description: 'Helping customers with issues and questions' },
    ];
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [
      { id: 'event1', name: 'Quarterly Planning', description: 'Planning for the next quarter', date: '2025-03-15', activities: ['activity1'], groups: ['group1', 'group2'], content: '' },
      { id: 'event2', name: 'Product Launch', description: 'New product launch event', date: '2025-04-01', activities: ['activity1', 'activity2', 'activity3'], groups: ['group1', 'group2', 'group3'], content: '' },
    ];
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const savedAssignments = localStorage.getItem('assignments');
    return savedAssignments ? JSON.parse(savedAssignments) : [
      { id: 'assign1', userId: 'user1', groupId: 'group1' },
      { id: 'assign2', userId: 'user2', groupId: 'group2' },
      { id: 'assign3', userId: 'user3', groupId: 'group3' },
    ];
  });

  const [notifications, setNotifications] = useState<{ [key: string]: Notification[] }>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : {
      user1: [
        { id: 1, message: "You've been assigned to Marketing Team for Quarterly Planning", read: false, timestamp: '2025-03-01T10:00:00Z', eventId: 'event1', type: 'event', title: 'Notification', content: "You've been assigned to Marketing Team for Quarterly Planning", date: '2025-03-01T10:00:00Z' },
        { id: 2, message: "New availability request for Development Team", read: true, timestamp: '2025-02-28T15:30:00Z', eventId: 'event2', type: 'announcement', title: 'Availability Request', content: "New availability request for Development Team", date: '2025-02-28T15:30:00Z' }
      ],
      user2: [
        { id: 1, message: "You've been assigned to Development Team for Product Launch", read: false, timestamp: '2025-03-01T09:15:00Z', eventId: 'event2', type: 'activity', title: 'Tâche', content: "You've been assigned to Development Team for Product Launch", date: '2025-03-01T09:15:00Z' }
      ],
      user3: []
    };
  });

  const [automaticAssignments, setAutomaticAssignments] = useState<AutomaticAssignment[]>(() => {
    const savedAutoAssignments = localStorage.getItem('automaticAssignments');
    return savedAutoAssignments ? JSON.parse(savedAutoAssignments) : [
      { eventId: 'event1', userId: 'user1', groupId: 'group1', activityId: 'activity1' },
      { eventId: 'event1', userId: 'user2', groupId: 'group2', activityId: 'activity1' },
      { eventId: 'event2', userId: 'user1', groupId: 'group1', activityId: 'activity1' },
      { eventId: 'event2', userId: 'user2', groupId: 'group2', activityId: 'activity2' },
      { eventId: 'event2', userId: 'user3', groupId: 'group3', activityId: 'activity3' },
    ];
  });

  const [selectedUser, setSelectedUser] = useState<string>(users.length > 0 ? users[0].id : '');

  const [notifiedAssignments, setNotifiedAssignments] = useState<NotificationRecord[]>(() => {
    const savedNotifiedAssignments = localStorage.getItem('notifiedAssignments');
    return savedNotifiedAssignments ? JSON.parse(savedNotifiedAssignments) : [];
  });

  // Calculate unread notifications count
  const unreadNotificationsCount = Object.values(notifications).reduce((sum, userNotifs) => 
    sum + userNotifs.filter(n => !n.read).length, 
  0);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('groups', JSON.stringify(groups));
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('assignments', JSON.stringify(assignments));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('automaticAssignments', JSON.stringify(automaticAssignments));
    localStorage.setItem('notifiedAssignments', JSON.stringify(notifiedAssignments));
  }, [users, groups, activities, events, assignments, notifications, automaticAssignments, notifiedAssignments]);

  // Helper function to generate a unique ID for an assignment notification
  const generateAssignmentNotificationId = (assignment: AutomaticAssignment): string => {
    return `${assignment.eventId}_${assignment.userId}_${assignment.groupId}_${assignment.activityId}`;
  };

  const generateAutomaticAssignments = () => {
    const groupAssignments: { [key: string]: string[] } = {};

    assignments.forEach(assignment => {
      if (!groupAssignments[assignment.groupId]) {
        groupAssignments[assignment.groupId] = [];
      }
      groupAssignments[assignment.groupId].push(assignment.userId);
    });

    const newAutoAssignments: AutomaticAssignment[] = [];

    events.forEach(event => {
      event.groups.forEach(groupId => {
        const groupUsers = groupAssignments[groupId] || [];

        event.activities.forEach(activityId => {
          const userForAssignment = groupUsers.find(userId => {
            const user = users.find(u => u.id === userId);
            return user && user.availability;
          });

          if (userForAssignment) {
            newAutoAssignments.push({
              eventId: event.id,
              userId: userForAssignment,
              groupId: groupId,
              activityId: activityId
            });
          }
        });
      });
    });

    setAutomaticAssignments(newAutoAssignments);

    alert('Auto-assignments have been regenerated based on availability.');
  };

  const handleSendNotification = () => {
    const newNotifications = { ...notifications };
    const newNotifiedAssignments = [...notifiedAssignments];
    let notificationsAdded = 0;
  
    automaticAssignments.forEach(assignment => {
      // Generate a unique identifier for this assignment
      const assignmentId = generateAssignmentNotificationId(assignment);
      
      // Check if we've already sent a notification for this assignment
      const alreadyNotified = notifiedAssignments.some(
        record => record.assignmentId === assignmentId
      );
      
      if (!alreadyNotified) {
        const user = users.find(u => u.id === assignment.userId);
        const event = events.find(e => e.id === assignment.eventId);
        const group = groups.find(g => g.id === assignment.groupId);
        const activity = activities.find(a => a.id === assignment.activityId);
  
        if (user && event && group && activity) {
          if (!newNotifications[user.id]) {
            newNotifications[user.id] = [];
          }
  
          const notificationId = Math.floor(Math.random() * 1000000).toString();
          
          newNotifications[user.id].push({
            id: notificationId,
            eventId: event.id,
            message: `You've been assigned to ${group.name} for ${event.name} (${activity.name})`,
            read: false,
            timestamp: getTimestamp(),
            type: 'event',
            title: 'Notification',
            content: event.content || `- ${group.name} for ${event.name} (${activity.name})`,
            date: getTimestamp()
          });
  
          // Record that we've sent this notification
          newNotifiedAssignments.push({
            assignmentId,
            timestamp: getTimestamp()
          });
          
          notificationsAdded++;
        }
      }
    });
  
    setNotifications(newNotifications);
    setNotifiedAssignments(newNotifiedAssignments);
  
    if (notificationsAdded > 0) {
      alert(`${notificationsAdded} new notification(s) sent to users!`);
    } else {
      alert('No new notifications to send. All assignments have already been notified.');
    }
  };

  const markAsRead = (userId: string, notificationId: string | number) => {
    const updatedNotifications = { ...notifications };

    if (updatedNotifications[userId]) {
      updatedNotifications[userId] = updatedNotifications[userId].map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );

      setNotifications(updatedNotifications);
    }
  };

  const clearNotifications = (userId: string) => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      const updatedNotifications = { ...notifications };
      updatedNotifications[userId] = [];
      setNotifications(updatedNotifications);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days < 7) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }
    }
  };

  const value: DataContextType = {
    users,
    groups,
    activities,
    events,
    assignments,
    notifications,
    automaticAssignments,
    notifiedAssignments,
    selectedUser,
    direction,
    setUsers,
    setGroups,
    setActivities,
    setEvents,
    setAssignments,
    setNotifications,
    setAutomaticAssignments,
    setNotifiedAssignments,
    setSelectedUser,
    generateAutomaticAssignments,
    handleSendNotification,
    markAsRead,
    clearNotifications,
    formatDate,
    formatTimestamp,
    unreadNotificationsCount,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;