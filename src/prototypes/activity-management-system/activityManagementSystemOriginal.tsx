import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Textarea } from '../../components/ui/textarea';
import { AlertCircle, Check, UserPlus, Users, Calendar, Bell, CheckSquare, PlusCircle, X, Edit, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { RichTextEditor } from './RichTextEditor.js'; // You'll need to implement this or use a library

import { useTranslation } from 'node_modules/react-i18next/index.js';

// Time slots for availability selection
const timeSlots = [
  "9AM-12PM", "12PM-3PM", "3PM-6PM", "6PM-9PM"
];

// Days of the week
const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

// Helper function to generate UUID
const generateId = () => uuidv4();

// Helper function to get current timestamp
const getTimestamp = () => new Date().toISOString();

// Define types for state
interface User {
  id: string;
  name: string;
  email: string;
  availability: { [key: string]: string[] };
}

interface Group {
  id: string;
  name: string;
}

interface Activity {
  id: string;
  name: string;
  description: string;
}

// Or if you're using an interface:
interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  activities: string[];
  groups: string[];
  content: string; // Add this line
}

interface Assignment {
  id: string;
  userId: string;
  groupId: string;
}

type Notification = {
  id: string | number;
  message: string;
  read: boolean;
  timestamp: string;
  eventId: string;
};

interface AutomaticAssignment {
  eventId: string;
  userId: string;
  groupId: string;
  activityId: string;
}

// Main component
const ActivityManagementSystem: React.FC = () => {

  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const dir = i18n.language === 'ar' || i18n.language === 'he' ? 'rtl' : 'ltr';
    setDirection(dir);
    document.documentElement.dir = dir; // Update document-level direction

    console.log('Current direction:', direction);

  }, [i18n.language]);

  // Initialize state with localStorage data or defaults
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
      { id: 'event1', name: 'Quarterly Planning', description: 'Planning for the next quarter', date: '2025-03-15', activities: ['activity1'], groups: ['group1', 'group2'] },
      { id: 'event2', name: 'Product Launch', description: 'New product launch event', date: '2025-04-01', activities: ['activity1', 'activity2', 'activity3'], groups: ['group1', 'group2', 'group3'] },
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
        { id: 1, message: "You've been assigned to Marketing Team for Quarterly Planning", read: false, timestamp: '2025-03-01T10:00:00Z' },
        { id: 2, message: "New availability request for Development Team", read: true, timestamp: '2025-02-28T15:30:00Z' }
      ],
      user2: [
        { id: 1, message: "You've been assigned to Development Team for Product Launch", read: false, timestamp: '2025-03-01T09:15:00Z' }
      ],
      user3: []
    };
  });

  // Calculate automatic assignments based on availability and current assignments
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

  // UI state
  const [selectedUser, setSelectedUser] = useState<string>('user1');
  const [currentTab, setCurrentTab] = useState<string>('users');

  // Form states
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', availability: {} });
  const [newGroup, setNewGroup] = useState<Omit<Group, 'id'>>({ name: '' });
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({ name: '', description: '' });
  
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    name: '', 
    description: '', 
    date: '', 
    activities: [], 
    groups: [],
    content: '' // Add this line
  });

  const [newAssignment, setNewAssignment] = useState<Omit<Assignment, 'id'>>({ userId: '', groupId: '' });

  // Edit states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingAvailability, setEditingAvailability] = useState<{ userId: string; availability: { [key: string]: string[] } } | null>(null);

  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState<boolean>(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState<boolean>(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState<boolean>(false);
  const [eventDialogOpen, setEventDialogOpen] = useState<boolean>(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState<boolean>(false);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('groups', JSON.stringify(groups));
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('assignments', JSON.stringify(assignments));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('automaticAssignments', JSON.stringify(automaticAssignments));
  }, [users, groups, activities, events, assignments, notifications, automaticAssignments]);

  // Function to generate automatic assignments
  const generateAutomaticAssignments = () => {
    // Get all assigned users to groups
    const groupAssignments: { [key: string]: string[] } = {};

    assignments.forEach(assignment => {
      if (!groupAssignments[assignment.groupId]) {
        groupAssignments[assignment.groupId] = [];
      }
      groupAssignments[assignment.groupId].push(assignment.userId);
    });

    // Create new notification based on events and availability
    const newAutoAssignments: AutomaticAssignment[] = [];

    events.forEach(event => {
      event.groups.forEach(groupId => {
        const groupUsers = groupAssignments[groupId] || [];

        event.activities.forEach(activityId => {
          // Find an available user
          const userForAssignment = groupUsers.find(userId => {
            const user = users.find(u => u.id === userId);
            return user && user.availability; // In a real app, check actual availability for the event date
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

    // Update state with new automatic assignments
    setAutomaticAssignments(newAutoAssignments);

    // Show confirmation
    alert('Auto-assignments have been regenerated based on availability.');
  };

  // Function to send notifications based on automatic assignments
  const handleSendNotification = () => {
    const newNotifications = { ...notifications };

    automaticAssignments.forEach(assignment => {
      const user = users.find(u => u.id === assignment.userId);
      const event = events.find(e => e.id === assignment.eventId);
      const group = groups.find(g => g.id === assignment.groupId);
      const activity = activities.find(a => a.id === assignment.activityId);

      if (user && event && group && activity) {
        if (!newNotifications[user.id]) {
          newNotifications[user.id] = [];
        }

        /* newNotifications[user.id].push({
          id: Math.floor(Math.random() * 1000000),
          message: `You've been assigned to ${group.name} for ${event.name} (${activity.name})`,
          read: false,
          timestamp: getTimestamp()
        }); */

        newNotifications[user.id].push({
          id: Math.floor(Math.random() * 1000000),
          eventId: event.id, // Store the event ID
          message: `You've been assigned to ${group.name} for ${event.name} (${activity.name})`,
          read: false,
          timestamp: getTimestamp()
        });
      }
    });

    // Update notifications state
    setNotifications(newNotifications);

    // Show confirmation
    alert('Notifications sent to users!');
  };

  // CRUD Operations for Users
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
      // Delete user
      setUsers(users.filter(user => user.id !== userId));

      // Delete associated assignments
      setAssignments(assignments.filter(assignment => assignment.userId !== userId));

      // Delete associated automatic assignments
      setAutomaticAssignments(automaticAssignments.filter(assignment => assignment.userId !== userId));

      // Delete associated notifications
      const newNotifications = { ...notifications };
      delete newNotifications[userId];
      setNotifications(newNotifications);
    }
  };

  // CRUD Operations for Groups
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
    setNewGroup({ name: '' });
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
      // Delete group
      setGroups(groups.filter(group => group.id !== groupId));

      // Delete associated assignments
      setAssignments(assignments.filter(assignment => assignment.groupId !== groupId));

      // Delete associated automatic assignments
      setAutomaticAssignments(automaticAssignments.filter(assignment => assignment.groupId !== groupId));

      // Update events by removing this group
      setEvents(events.map(event => ({
        ...event,
        groups: event.groups.filter(g => g !== groupId)
      })));
    }
  };

  // CRUD Operations for Activities
  const addActivity = () => {
    if (newActivity.name.trim() === '') {
      alert('Please enter an activity name.');
      return;
    }

    const activity: Activity = {
      id: generateId(),
      name: newActivity.name.trim(),
      description: newActivity.description.trim()
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
      // Delete activity
      setActivities(activities.filter(activity => activity.id !== activityId));

      // Delete associated automatic assignments
      setAutomaticAssignments(automaticAssignments.filter(assignment => assignment.activityId !== activityId));

      // Update events by removing this activity
      setEvents(events.map(event => ({
        ...event,
        activities: event.activities.filter(a => a !== activityId)
      })));
    }
  };

  // CRUD Operations for Events
  const addEvent = () => {
    if (newEvent.name.trim() === '' || !newEvent.date) {
      alert('Please fill in all required fields.');
      return;
    }

    /* const event: Event = {
      id: generateId(),
      name: newEvent.name.trim(),
      description: newEvent.description.trim(),
      date: newEvent.date,
      activities: newEvent.activities || [],
      groups: newEvent.groups || []
    }; */

    const event = {
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
      // Delete event
      setEvents(events.filter(event => event.id !== eventId));

      // Delete associated automatic assignments
      setAutomaticAssignments(automaticAssignments.filter(assignment => assignment.eventId !== eventId));
    }
  };

  // CRUD Operations for Assignments
  const addAssignment = () => {
    if (!newAssignment.userId || !newAssignment.groupId) {
      alert('Please select both a user and a group.');
      return;
    }

    // Check if assignment already exists
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
    setNewAssignment({ userId: '', groupId: '' });
  };

  const deleteAssignment = (assignmentId: string) => {
    if (window.confirm('Are you sure you want to remove this assignment?')) {
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
    }
  };

  // User availability operations
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

  // Mark notification as read
  const markAsRead = (userId: string, notificationId: string | number) => {
    const updatedNotifications = { ...notifications };

    if (updatedNotifications[userId]) {
      updatedNotifications[userId] = updatedNotifications[userId].map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );

      setNotifications(updatedNotifications);
    }
  };

  // Clear all notifications for a user
  const clearNotifications = (userId: string) => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      const updatedNotifications = { ...notifications };
      updatedNotifications[userId] = [];
      setNotifications(updatedNotifications);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Format timestamp for display
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
    <div className="flex h-screen bg-slate-50">
      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {/* <Card className="mb-4 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Activity Management System</CardTitle>
            <CardDescription>
              Manage users, groups, activities, and event assignments
            </CardDescription>
          </CardHeader>
        </Card> */}

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

          {/* Tab 1: Users & Availability Management */}
          <TabsContent value="users">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Users & Availability Management</CardTitle>
                <CardDescription>
                  Register users and manage their weekly availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Registered Users</h3>
                    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex items-center gap-2" onClick={() => {
                          setEditingUser(null);
                          setNewUser({ name: '', email: '', availability: {} });
                        }}>
                          <PlusCircle size={16} />
                          <span>Add User</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                          <DialogDescription>
                            {editingUser ? 'Update user details below.' : 'Enter user details below.'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={editingUser ? editingUser.name : newUser.name}
                              onChange={(e) => editingUser
                                ? setEditingUser({ ...editingUser, name: e.target.value })
                                : setNewUser({ ...newUser, name: e.target.value })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={editingUser ? editingUser.email : newUser.email}
                              onChange={(e) => editingUser
                                ? setEditingUser({ ...editingUser, email: e.target.value })
                                : setNewUser({ ...newUser, email: e.target.value })
                              }
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setUserDialogOpen(false)}>Cancel</Button>
                          <Button onClick={editingUser ? updateUser : addUser}>
                            {editingUser ? 'Update' : 'Add'} User
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">User</th>
                          {daysOfWeek.map(day => (
                            <th key={day} className="py-2 px-4 border-b text-center">{day.substring(0, 3)}</th>
                          ))}
                          <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id} className="border-b">
                            <td className="py-2 px-4">
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            {daysOfWeek.map(day => (
                              <td key={day} className="py-2 px-4 text-center">
                                {user.availability[day]?.map((slot, index) => (
                                  <div key={index} className="bg-blue-200 text-blue-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full">
                                    {slot}
                                  </div>
                                ))}
                                {!user.availability[day]?.length && (
                                  <div className="text-gray-400 text-xs">Not Available</div>
                                )}
                              </td>
                            ))}
                            <td className="py-2 px-4">
                              <div className="flex gap-2">
                                <Dialog open={availabilityDialogOpen && editingAvailability?.userId === user.id} onOpenChange={(open) => {
                                  if (!open) setAvailabilityDialogOpen(false);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => {
                                      setEditingAvailability({
                                        userId: user.id,
                                        availability: { ...(user.availability || {}) }
                                      });
                                      setAvailabilityDialogOpen(true);
                                    }}>
                                      Edit Availability
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>Edit User Availability</DialogTitle>
                                      <DialogDescription>
                                        Set available time slots for each day of the week.
                                      </DialogDescription>
                                    </DialogHeader>
                                    {editingAvailability && (
                                      <div className="overflow-y-auto max-h-96">
                                        {daysOfWeek.map(day => (
                                          <div key={day} className="mb-4">
                                            <h4 className="font-medium mb-2">{day}</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                              {timeSlots.map(slot => {
                                                const isChecked = editingAvailability.availability[day]?.includes(slot) || false;
                                                return (
                                                  <div key={slot} className="flex items-center space-x-2">
                                                    <Checkbox
                                                      id={`${day}-${slot}`}
                                                      checked={isChecked}
                                                      onCheckedChange={(checked) => {
                                                        const newAvailability = { ...editingAvailability.availability };

                                                        if (!newAvailability[day]) {
                                                          newAvailability[day] = [];
                                                        }

                                                        if (checked) {
                                                          if (!newAvailability[day].includes(slot)) {
                                                            newAvailability[day].push(slot);
                                                          }
                                                        } else {
                                                          newAvailability[day] = newAvailability[day].filter(t => t !== slot);

                                                          // Clean up empty arrays
                                                          if (newAvailability[day].length === 0) {
                                                            delete newAvailability[day];
                                                          }
                                                        }

                                                        setEditingAvailability({
                                                          ...editingAvailability,
                                                          availability: newAvailability
                                                        });
                                                      }}
                                                    />
                                                    <Label htmlFor={`${day}-${slot}`}>{slot}</Label>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setAvailabilityDialogOpen(false)}>Cancel</Button>
                                      <Button onClick={updateAvailability}>Save Availability</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button size="sm" variant="ghost" onClick={() => {
                                  setEditingUser(user);
                                  setUserDialogOpen(true);
                                }}>
                                  <Edit size={16} />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteUser(user.id)}>
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={9} className="py-10 text-center text-gray-500">
                              No users found. Add a user to get started.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Groups & Activities Management */}
          <TabsContent value="groups">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Groups Management</CardTitle>
                  <CardDescription>
                    Create and manage groups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Groups</h3>
                      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex items-center gap-2" onClick={() => {
                            setEditingGroup(null);
                            setNewGroup({ name: '' });
                          }}>
                            <PlusCircle size={16} />
                            <span>Add Group</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{editingGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
                            <DialogDescription>
                              {editingGroup ? 'Update group details below.' : 'Enter group details below.'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="group-name" className="text-right">
                                Group Name
                              </Label>
                              <Input
                                id="group-name"
                                value={editingGroup ? editingGroup.name : newGroup.name}
                                onChange={(e) => editingGroup
                                  ? setEditingGroup({ ...editingGroup, name: e.target.value })
                                  : setNewGroup({ ...newGroup, name: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>Cancel</Button>
                            <Button onClick={editingGroup ? updateGroup : addGroup}>
                              {editingGroup ? 'Update' : 'Add'} Group
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-2">
                      {groups.map(group => (
                        <div key={group.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                          <span>{group.name}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => {
                              setEditingGroup(group);
                              setGroupDialogOpen(true);
                            }}>
                              <Edit size={16} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteGroup(group.id)}>
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {groups.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                          No groups found. Add a group to get started.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Activities Management</CardTitle>
                  <CardDescription>
                    Create and manage activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Activities</h3>
                      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex items-center gap-2" onClick={() => {
                            setEditingActivity(null);
                            setNewActivity({ name: '', description: '' });
                          }}>
                            <PlusCircle size={16} />
                            <span>Add Activity</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
                            <DialogDescription>
                              {editingActivity ? 'Update activity details below.' : 'Enter activity details below.'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="activity-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="activity-name"
                                value={editingActivity ? editingActivity.name : newActivity.name}
                                onChange={(e) => editingActivity
                                  ? setEditingActivity({ ...editingActivity, name: e.target.value })
                                  : setNewActivity({ ...newActivity, name: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="activity-description" className="text-right">
                                Description
                              </Label>
                              <Textarea
                                id="activity-description"
                                value={editingActivity ? editingActivity.description : newActivity.description}
                                onChange={(e) => editingActivity
                                  ? setEditingActivity({ ...editingActivity, description: e.target.value })
                                  : setNewActivity({ ...newActivity, description: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>Cancel</Button>
                            <Button onClick={editingActivity ? updateActivity : addActivity}>
                              {editingActivity ? 'Update' : 'Add'} Activity
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-2">
                      {activities.map(activity => (
                        <div key={activity.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                          <div>
                            <div className="font-medium">{activity.name}</div>
                            {activity.description && (
                              <div className="text-sm text-slate-500">{activity.description}</div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => {
                              setEditingActivity(activity);
                              setActivityDialogOpen(true);
                            }}>
                              <Edit size={16} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteActivity(activity.id)}>
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {activities.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                          No activities found. Add an activity to get started.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 3: User Assignments to Groups/Activities */}
      <TabsContent value="assignments">
        <Card className="bg-white shadow-sm">
            <CardHeader>
            <CardTitle>User Assignments</CardTitle>
            <CardDescription>
                Assign users to groups and activities
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Select User</label>
                    <Select
                    value={newAssignment.userId}
                    onValueChange={(value) => setNewAssignment({...newAssignment, userId: value})}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Assign to Group</label>
                    <Select
                    value={newAssignment.groupId}
                    onValueChange={(value) => setNewAssignment({...newAssignment, groupId: value})}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                        {groups.map(group => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div className="flex items-end">
                    <Button className="w-full md:w-auto" onClick={addAssignment}>
                    Create Assignment
                    </Button>
                </div>
                </div>

                <div>
                <h3 className="text-lg font-medium mb-3">Current Assignments</h3>
                <div className="border rounded overflow-hidden">
                    <table className="min-w-full">
                    <thead className="bg-slate-50">
                        <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">User</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Group</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {assignments.map(assignment => {
                        const user = users.find(u => u.id === assignment.userId);
                        const group = groups.find(g => g.id === assignment.groupId);

                        return (
                            <tr key={assignment.id}>
                            <td className="px-4 py-3">{user ? user.name : 'Unknown User'}</td>
                            <td className="px-4 py-3">{group ? group.name : 'Unknown Group'}</td>
                            <td className="px-4 py-3">
                                <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteAssignment(assignment.id)}
                                >
                                Remove
                                </Button>
                            </td>
                            </tr>
                        );
                        })}
                        {assignments.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                            No assignments found. Create an assignment to get started.
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 4: Event Management */}
        <TabsContent value="events">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              {/* Use a div instead of CardDescription to avoid nesting issues */}
              <div className="text-sm text-muted-foreground">
                Create and manage events across groups and activities
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Events</h3>
                  <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2" onClick={() => {
                        setEditingEvent(null);
                        setNewEvent({ name: '', description: '', date: '', activities: [], groups: [], content: '' });
                      }}>
                        <PlusCircle size={16} />
                        <span>Create Event</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                        <DialogDescription>
                          {editingEvent ? 'Update event details and assignments.' : 'Enter event details and assign groups and activities.'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="event-name" className="text-right">
                            Event Name
                          </Label>
                          <Input
                            id="event-name"
                            value={editingEvent ? editingEvent.name : newEvent.name}
                            onChange={(e) => editingEvent
                              ? setEditingEvent({ ...editingEvent, name: e.target.value })
                              : setNewEvent({ ...newEvent, name: e.target.value })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="event-description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="event-description"
                            value={editingEvent ? editingEvent.description : newEvent.description}
                            onChange={(e) => editingEvent
                              ? setEditingEvent({ ...editingEvent, description: e.target.value })
                              : setNewEvent({ ...newEvent, description: e.target.value })
                            }
                            className="col-span-3"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="event-content" className="text-right pt-2">
                            Content
                          </Label>
                          <div className="col-span-3">
                            <RichTextEditor
                              id="event-content"
                              value={editingEvent ? editingEvent.content : newEvent.content}
                              onChange={(value) => 
                                editingEvent 
                                  ? setEditingEvent({ ...editingEvent, content: value })
                                  : setNewEvent({ ...newEvent, content: value })
                              }
                              direction={direction}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="event-date" className="text-right">
                            Date
                          </Label>
                          <Input
                            id="event-date"
                            type="date"
                            value={editingEvent ? editingEvent.date : newEvent.date}
                            onChange={(e) => editingEvent
                              ? setEditingEvent({ ...editingEvent, date: e.target.value })
                              : setNewEvent({ ...newEvent, date: e.target.value })
                            }
                            className="col-span-3"
                          />
                        </div>
                                        
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEventDialogOpen(false)}>Cancel</Button>
                        <Button onClick={editingEvent ? updateEvent : addEvent}>
                          {editingEvent ? 'Update' : 'Create'} Event
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {events.map(event => (
                    <Card key={event.id} className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        {/* Replace CardDescription with a div to avoid nesting issues */}
                        <div className="text-sm text-muted-foreground">
                          {/* Render description as plain text or in a separate component */}
                          {event.description && <div className="mb-1">{event.description}</div>}
                          <div className="font-medium text-slate-700 mt-1">Date: {formatDate(event.date)}</div>
                        </div>
                      </CardHeader>
                      
                      {/* Render rich content in a separate section */}
                      {event.content && (
                        <CardContent className="pt-0 pb-2 border-b">
                          <div 
                            className="rich-content-container" 
                            dangerouslySetInnerHTML={{ __html: event.content }}
                          />
                        </CardContent>
                      )}
                      
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Assigned Groups</h4>
                            <div className="space-y-1">
                              {event.groups.map(groupId => {
                                const group = groups.find(g => g.id === groupId);
                                return group ? (
                                  <div key={groupId} className="p-2 bg-slate-50 rounded text-sm">
                                    {group.name}
                                  </div>
                                ) : null;
                              })}
                              {event.groups.length === 0 && (
                                <div className="p-2 bg-slate-50 rounded text-sm text-slate-500 italic">
                                  No groups assigned
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Assigned Activities</h4>
                            <div className="space-y-1">
                              {event.activities.map(activityId => {
                                const activity = activities.find(a => a.id === activityId);
                                return activity ? (
                                  <div key={activityId} className="p-2 bg-slate-50 rounded text-sm">
                                    {activity.name}
                                  </div>
                                ) : null;
                              })}
                              {event.activities.length === 0 && (
                                <div className="p-2 bg-slate-50 rounded text-sm text-slate-500 italic">
                                  No activities assigned
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingEvent(event);
                              setEventDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteEvent(event.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {events.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                      No events found. Create an event to get started.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Tab 5: Automatic Assignments */}
        <TabsContent value="auto">
        <Card className="bg-white shadow-sm">
            <CardHeader>
            <CardTitle>Automatic Assignments</CardTitle>
            <CardDescription>
                View and confirm automatically generated assignments
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Generated Assignments</h3>
                <div className="flex gap-2">
                    <Button
                    variant="outline"
                    onClick={generateAutomaticAssignments}
                    >
                    Regenerate
                    </Button>
                    <Button
                    onClick={handleSendNotification}
                    disabled={automaticAssignments.length === 0}
                    >
                    Send Notifications
                    </Button>
                </div>
                </div>

                <div className="border rounded overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">Event</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">User</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Group</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Activity</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {automaticAssignments.map((assignment, index) => {
                        const event = events.find(e => e.id === assignment.eventId);
                        const user = users.find(u => u.id === assignment.userId);
                        const group = groups.find(g => g.id === assignment.groupId);
                        const activity = activities.find(a => a.id === assignment.activityId);

                        return (
                        <tr key={index}>
                            <td className="px-4 py-3">{event ? event.name : 'Unknown Event'}</td>
                            <td className="px-4 py-3">{user ? user.name : 'Unknown User'}</td>
                            <td className="px-4 py-3">{group ? group.name : 'Unknown Group'}</td>
                            <td className="px-4 py-3">{activity ? activity.name : 'Unknown Activity'}</td>
                            <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Available
                            </span>
                            </td>
                        </tr>
                        );
                    })}
                    {automaticAssignments.length === 0 && (
                        <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                            No automatic assignments generated. Click "Regenerate" to create assignments.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
            </CardContent>
        </Card>
        </TabsContent>
        </Tabs>
      </div>

      {/* Notification Sidebar */}
      <div className="w-80 border-l bg-slate-50 p-4 flex flex-col h-screen">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">User Notifications</h3>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-auto space-y-4">
          <div className="flex flex-col items-center mb-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              {selectedUser && notifications[selectedUser]?.length > 0
                ? `${notifications[selectedUser].length} Notifications`
                : 'No notifications'}
            </h4>
            {selectedUser && notifications[selectedUser]?.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs text-red-500 hover:text-red-700"
                onClick={() => clearNotifications(selectedUser)}
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {/* {selectedUser && notifications[selectedUser]?.map(notification => (
              <div
                key={notification.id}
                className={`p-3 rounded-md shadow-sm text-sm cursor-pointer transition-colors duration-200 ${
                  notification.read ? 'bg-white hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
                }`}
                onClick={() => markAsRead(selectedUser, Number(notification.id))}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={notification.read ? 'text-slate-600' : 'font-medium text-slate-800'}>
                      {notification.message}
                    </p>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatTimestamp(notification.timestamp)}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))} */}
            {/* Replace the existing notification items in sidebar */}
            {selectedUser && notifications[selectedUser]?.map(notification => {
              // Find the related event for this notification
              const eventId = notification.eventId; // You need to store this in your notifications
              const event = events.find(e => e.id === eventId);
              
              return (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg shadow-sm ${notification.read ? 'bg-white' : 'bg-blue-50 border-l-4 border-blue-500'}`}
                  onClick={() => markAsRead(selectedUser, notification.id)}
                >
                  {/* Event Card Header */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{event?.name || 'Event'}</h3>
                    <span className="text-xs text-slate-500">{formatTimestamp(notification.timestamp)}</span>
                  </div>
                  
                  {/* Event Card Content - render HTML content safely */}
                  <div className="text-sm">
                    {event?.content && (
                      <div dangerouslySetInnerHTML={{ __html: event.content }} />
                    )}
                    {!event?.content && (
                      <div>{notification.message}</div>
                    )}
                  </div>
                  
                  {/* Event Date */}
                  {event?.date && (
                    <div className="mt-2 text-xs font-medium flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(event.date)}
                    </div>
                  )}
                </div>
              );
            })}
            {(!selectedUser || !notifications[selectedUser] || notifications[selectedUser].length === 0) && (
              <div className="text-center py-10 text-slate-500">
                No notifications found.
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default ActivityManagementSystem;