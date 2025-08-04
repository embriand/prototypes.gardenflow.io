export interface Group {
    id: string;
    name: string;
  }
  
 export interface Activity {
    id: string;
    name: string;
    description?: string;
  }

  // Define types for state
export interface User {
    id: string;
    name: string;
    email: string;
    availability: { [key: string]: string[] };
  }
  
export interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    activities: string[];
    groups: string[];
    content: string;
  }
  
 export interface Assignment {
    id: string;
    userId: string;
    groupId: string;
  }

  // types.ts - Add this to your existing types file
export type NotificationType = 'announcement' | 'article' | 'event' | 'activity' | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  date: string; // ISO string
  read: boolean;
  icon?: string;
  eventId?: string;
  groupId?: string;
  activityId?: string;
}

export interface NotificationGroup {
  [userId: string]: Notification[];
}