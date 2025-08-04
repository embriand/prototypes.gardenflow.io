// TypeScript types for Client Tasks Management prototype

export interface ClientTasksProps {
  // Define your component props here
}

export interface Plant {
  name: string;
  image: string;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  role?: string;
}

export interface Action {
  id: number;
  name: string;
  status: string;
  category: string;
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: number;
  client: string;
  title: string;
  garden: {
    name: string;
    location?: string;
  };
  assignedTo: User[];
  totalUsers: number;
  plants?: Plant[];
  actions: Action[];
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  date: string;
  time: string;
  duration: string;
  completionPercentage: number;
  comments?: Comment[];
  weather?: {
    temp: string;
    condition: string;
    icon: string;
  };
}