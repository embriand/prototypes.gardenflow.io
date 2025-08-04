
export type NotificationType = 'announcement' | 'article' | 'activity' | 'reminder' | 'event';
export type DisplayCategory = 'notification' | 'actuality' | 'both';

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
    availability: { [day: string]: string[] };
    // availability: { [key: string]: string[] };
  }
  
  export interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    activities: string[];
    groups: string[];
    content: string;
    displayCategory?: DisplayCategory;
  }
  
 export interface Assignment {
    id: string;
    userId: string;
    groupId: string;
  }

export interface Notification {
    id: string;
    type: NotificationType; // Using the enum but allowing string for flexibility
    title: string;
    content: string;
    date: string; // ISO string
    read: boolean;
    icon?: string;
    eventId?: string;
    groupId?: string;
    activityId?: string;
    displayCategory?: DisplayCategory;
    message?: string;
    timestamp?: string;    
  }

export interface NotificationGroup {
  [userId: string]: Notification[];
}

// Rich Editor Content type
export interface RichContent {
    entityMap: Record<string, any>;
    blocks: Array<{
      key: string;
      text: string;
      type: string;
      depth: number;
      inlineStyleRanges: Array<{
        offset: number;
        length: number;
        style: string;
      }>;
      entityRanges: Array<{
        offset: number;
        length: number;
        key: number;
      }>;
      data: Record<string, any>;
    }>;
  }