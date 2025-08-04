import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { v4 as uuidv4 } from 'uuid';
import UsersAvailability from './UsersAvailability';
import GroupsActivities from './GroupsActivities';
import UserAssignments from './UserAssignments';
import EventManagement from './EventManagement';
import AutomaticAssignments from './AutomaticAssignments';
import NotificationsScreen from './NotificationsScreen';
import { Button } from '../../components/ui/button';

import { DataProvider } from './DataContext';

import { UserPlus, Users, CheckSquare, Calendar, Bell, ArrowRight } from 'lucide-react';

import {
  Activity,
  Group,
  User,
  Event,
  Assignment,
  Notification
} from './types';

// Time slots for availability selection
const timeSlots = ["9AM-12PM", "12PM-3PM", "3PM-6PM", "6PM-9PM"];

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Helper function to generate UUID
const generateId = () => uuidv4();

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

const ActivityManagementSystem: React.FC = () => {
  // Mock translation function - remove i18n dependency
  const t = (key: string) => key; // Simply return the key as the translation
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Mock language detection - default to ltr
    const dir = 'ltr';
    setDirection(dir);
    document.documentElement.dir = dir;
  }, []);

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
        { id: 1, message: "You've been assigned to Development Team for Product Launch", read: false, timestamp: '2025-03-01T09:15:00Z', eventId: 'event2', type: 'activity', title: 'New Task', content: "You've been assigned to Development Team for Product Launch", date: '2025-03-01T09:15:00Z' }
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

  const [currentTab, setCurrentTab] = useState<string>('users');

  const [selectedUser, setSelectedUser] = useState<string>(users.length > 0 ? users[0].id : '');

  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', availability: {} });
  const [newGroup, setNewGroup] = useState<Group>({ id: generateId(), name: '' });
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({ name: '', description: '' });

  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    name: '',
    description: '',
    date: '',
    activities: [],
    groups: [],
    content: ''
  });
  const [newAssignment, setNewAssignment] = useState<Assignment>({ id: '', userId: '', groupId: '' });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingAvailability, setEditingAvailability] = useState<{ userId: string; availability: { [key: string]: string[] } } | null>(null);

  const [userDialogOpen, setUserDialogOpen] = useState<boolean>(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState<boolean>(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState<boolean>(false);
  const [eventDialogOpen, setEventDialogOpen] = useState<boolean>(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState<boolean>(false);

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
            content: `You've been assigned to ${group.name} for ${event.name} (${activity.name}) ${event.content}`,
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

  const addUser = () => {
    if (newUser.name.trim() === '' || newUser.email.trim() === '') {
      alert('Please fill in all required fields.');
      return;
    }

    const user: User = {
      id: generateId(),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      availability: newUser.availability || {}
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', availability: {} });
    setUserDialogOpen(false);
  };

  const updateUser = () => {
    if (!editingUser || editingUser.name.trim() === '' || editingUser.email.trim() === '') {
      alert('Please fill in all required fields.');
      return;
    }

    setUsers(users.map(user =>
      user.id === editingUser.id ? { ...editingUser } : user
    ));

    setEditingUser(null);
    setUserDialogOpen(false);
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      setAssignments(assignments.filter(assignment => assignment.userId !== userId));
      setAutomaticAssignments(automaticAssignments.filter(assignment => assignment.userId !== userId));
      const newNotifications = { ...notifications };
      delete newNotifications[userId];
      setNotifications(newNotifications);
    }
  };

  const addGroup = () => {
    if (newGroup.name.trim() === '') {
      alert('Please enter a group name.');
      return;
    }

    const group: Group = {
      id: generateId(),
      name: newGroup.name.trim()
    };

    setGroups([...groups, group]);
    setNewGroup({ id: generateId(), name: '' });
    setGroupDialogOpen(false);
  };

  const updateGroup = () => {
    if (!editingGroup || editingGroup.name.trim() === '') {
      alert('Please enter a group name.');
      return;
    }

    setGroups(groups.map(group =>
      group.id === editingGroup.id ? { ...editingGroup } : group
    ));

    setEditingGroup(null);
    setGroupDialogOpen(false);
  };

  const deleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      setGroups(groups.filter(group => group.id !== groupId));
      setAssignments(assignments.filter(assignment => assignment.groupId !== groupId));
      setAutomaticAssignments(automaticAssignments.filter(assignment => assignment.groupId !== groupId));
      setEvents(events.map(event => ({
        ...event,
        groups: event.groups.filter(g => g !== groupId)
      })));
    }
  };

  const addActivity = () => {
    if (newActivity.name.trim() === '') {
      alert('Please enter an activity name.');
      return;
    }

    const activity: Activity = {
      id: generateId(),
      name: newActivity.name.trim(),
      description: (newActivity.description || '').trim()
    };

    setActivities([...activities, activity]);
    setNewActivity({ name: '', description: '' });
    setActivityDialogOpen(false);
  };

  const updateActivity = () => {
    if (!editingActivity || editingActivity.name.trim() === '') {
      alert('Please enter an activity name.');
      return;
    }

    setActivities(activities.map(activity =>
      activity.id === editingActivity.id ? { ...editingActivity } : activity
    ));

    setEditingActivity(null);
    setActivityDialogOpen(false);
  };

  const deleteActivity = (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setActivities(activities.filter(activity => activity.id !== activityId));
      setAutomaticAssignments(automaticAssignments.filter(assignment => assignment.activityId !== activityId));
      setEvents(events.map(event => ({
        ...event,
        activities: event.activities.filter(a => a !== activityId)
      })));
    }
  };

  const addEvent = () => {
    if (newEvent.name.trim() === '' || !newEvent.date) {
      alert('Please fill in all required fields.');
      return;
    }

    const event: Event = {
      id: generateId(),
      name: newEvent.name.trim(),
      description: newEvent.description.trim(),
      date: newEvent.date,
      activities: newEvent.activities || [],
      groups: newEvent.groups || [],
      content: newEvent.content || ''
    };

    setEvents([...events, event]);
    setNewEvent({ name: '', description: '', date: '', activities: [], groups: [], content: '' });
    setEventDialogOpen(false);
  };

  const updateEvent = () => {
    if (!editingEvent || editingEvent.name.trim() === '' || !editingEvent.date) {
      alert('Please fill in all required fields.');
      return;
    }

    setEvents(events.map(event =>
      event.id === editingEvent.id ? { ...editingEvent } : event
    ));

    setEditingEvent(null);
    setEventDialogOpen(false);
  };

  const deleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
      setAutomaticAssignments(automaticAssignments.filter(assignment => assignment.eventId !== eventId));
      
      // Remove notification records for this event
      setNotifiedAssignments(notifiedAssignments.filter(
        record => !record.assignmentId.startsWith(`${eventId}_`)
      ));
    }
  };

  const addAssignment = () => {
    if (!newAssignment.userId || !newAssignment.groupId) {
      alert('Please select both a user and a group.');
      return;
    }

    const assignmentExists = assignments.some(
      assignment => assignment.userId === newAssignment.userId && assignment.groupId === newAssignment.groupId
    );

    if (assignmentExists) {
      alert('This user is already assigned to this group.');
      return;
    }

    const assignment: Assignment = {
      id: generateId(),
      userId: newAssignment.userId,
      groupId: newAssignment.groupId
    };

    setAssignments([...assignments, assignment]);
    setNewAssignment({ id: '', userId: '', groupId: '' });
  };

  const deleteAssignment = (assignmentId: string) => {
    if (window.confirm('Are you sure you want to remove this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
    }
  };

  const updateAvailability = () => {
    if (!editingAvailability) return;

    setUsers(users.map(user =>
      user.id === editingAvailability.userId
        ? { ...user, availability: editingAvailability.availability }
        : user
    ));

    setEditingAvailability(null);
    setAvailabilityDialogOpen(false);
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

  return (
    <div className="activity-management-system bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mb-6 px-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Activity Management System
        </h1>
        <p className="text-gray-700">
          Comprehensive activity, user, group, and event management with automatic assignments and notifications
        </p>
        
        {/* Feature highlights */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Key Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• User availability management</li>
            <li>• Group and activity organization</li>
            <li>• Event scheduling and assignments</li>
            <li>• Automatic assignment generation</li>
            <li>• Real-time notification system</li>
          </ul>
        </div>
      </div>

      <div className="flex bg-slate-50 relative">
        {/* Main Content Area */}
        <div className={`transition-all duration-300 ease-in-out ${showNotifications ? 'w-3/4' : 'w-full'}`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">System Dashboard</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              {showNotifications ? (
                <>
                  <ArrowRight size={16} />
                  <span>Hide Notifications</span>
                </>
              ) : (
                <>
                  <Bell size={16} />
                  <span>Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 min-w-5 inline-flex items-center justify-center px-1">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </>
              )}
            </Button>
            </div>
          
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserPlus size={16} />
                <span>Users & Availability</span>
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users size={16} />
                <span>Groups & Activities</span>
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                <CheckSquare size={16} />
                <span>User Assignments</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Event Management</span>
              </TabsTrigger>
              <TabsTrigger value="auto" className="flex items-center gap-2">
                <Bell size={16} />
                <span>Auto-Assignments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UsersAvailability
                users={users}
                userDialogOpen={userDialogOpen}
                setUserDialogOpen={setUserDialogOpen}
                editingUser={editingUser}
                setEditingUser={setEditingUser}
                newUser={{ ...newUser, id: generateId() }}
                setNewUser={setNewUser}
                addUser={addUser}
                updateUser={updateUser}
                deleteUser={deleteUser}
                availabilityDialogOpen={availabilityDialogOpen}
                setAvailabilityDialogOpen={setAvailabilityDialogOpen}
                editingAvailability={editingAvailability}
                setEditingAvailability={setEditingAvailability}
                updateAvailability={updateAvailability}
                daysOfWeek={daysOfWeek}
                timeSlots={timeSlots}
              />
            </TabsContent>

            <TabsContent value="groups">
              <GroupsActivities
                groups={groups}
                groupDialogOpen={groupDialogOpen}
                setGroupDialogOpen={setGroupDialogOpen}
                editingGroup={editingGroup}
                setEditingGroup={setEditingGroup}
                newGroup={newGroup}
                setNewGroup={setNewGroup}
                addGroup={addGroup}
                updateGroup={updateGroup}
                deleteGroup={deleteGroup}
                activities={activities}
                activityDialogOpen={activityDialogOpen}
                setActivityDialogOpen={setActivityDialogOpen}
                editingActivity={editingActivity}
                setEditingActivity={setEditingActivity}
                newActivity={{ ...newActivity, id: generateId() }}
                setNewActivity={setNewActivity}
                addActivity={addActivity}
                updateActivity={updateActivity}
                deleteActivity={deleteActivity}
              />
            </TabsContent>

            <TabsContent value="assignments">
              <UserAssignments
                users={users}
                groups={groups}
                newAssignment={newAssignment}
                setNewAssignment={setNewAssignment}
                addAssignment={addAssignment}
                assignments={assignments}
                deleteAssignment={deleteAssignment}
              />
            </TabsContent>

            <TabsContent value="events">
              <EventManagement
                events={events}
                eventDialogOpen={eventDialogOpen}
                setEventDialogOpen={setEventDialogOpen}
                editingEvent={editingEvent}
                setEditingEvent={setEditingEvent}
                newEvent={newEvent}
                setNewEvent={setNewEvent}
                addEvent={addEvent}
                updateEvent={updateEvent}
                deleteEvent={deleteEvent}
                formatDate={formatDate}
                direction={direction}
                groups={groups}
                activities={activities}
              />
            </TabsContent>

            <TabsContent value="auto">
              <AutomaticAssignments
                automaticAssignments={automaticAssignments}
                generateAutomaticAssignments={generateAutomaticAssignments}
                handleSendNotification={handleSendNotification}
                events={events}
                users={users}
                groups={groups}
                activities={activities}
              />
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <div 
        className={`fixed top-20 bottom-0 right-0 transition-all duration-300 ease-in-out ${
          showNotifications ? 'translate-x-0 w-1/4' : 'translate-x-full w-0'
        }`}
        style={{ top: '76px' }}
      >
        {showNotifications && (
          <div className="h-full">
            <DataProvider>
              <div className="h-full bg-gray-50">
                <NotificationsScreen standalone={false} />
              </div>
            </DataProvider>
            {/* <NotificationsScreen
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              notifications={notifications}
              markAsRead={markAsRead}
              clearNotifications={clearNotifications}
              formatTimestamp={formatTimestamp}
              formatDate={formatDate}
              events={events}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityManagementSystem;