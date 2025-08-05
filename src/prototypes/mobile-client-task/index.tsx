import React, { useState } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfToday, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import MobileDeviceFrame from '../../components/MobileDeviceFrame';
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Droplets,
  Scissors,
  Shovel,
  LayoutGrid,
  Timer,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';

// Utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskType = 'planting' | 'watering' | 'pruning' | 'maintenance' | 'harvesting';

export interface TaskAction {
  id: string;
  taskId: string;
  type: 'watering' | 'weeding' | 'fertilizing' | 'pruning' | 'harvesting' | 'other';
  date: Date;
  description: string;
  duration: number; // en minutes
  performedBy: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  dueDate: Date;
  plant: {
    name: string;
    imageUrl: string;
  };
  assignees: Array<{
    id: string;
    name: string;
    avatarUrl: string;
  }>;
  progress: number;
  location: {
    parcel: string;
    zone: string;
  };
  estimatedTime: string;
  tools: string[];
  actions?: TaskAction[];
}

export interface Filter {
  id: string;
  name: string;
  icon: string;
}

// Store
interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  addTaskAction: (taskId: string, action: Omit<TaskAction, 'id'>) => void;
  getFilteredTasks: (view: 'day' | 'week' | 'month', currentDate: Date, filters: string[]) => Task[];
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Récolte de Tomates',
    description: 'Récolter les tomates mûres dans la serre 1',
    status: 'in-progress',
    priority: 'high',
    type: 'harvesting',
    dueDate: addDays(startOfToday(), 1),
    plant: {
      name: 'Tomates Roma',
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop'
    },
    assignees: [
      {
        id: 'user1',
        name: 'Marie Dubois',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop'
      },
      {
        id: 'user2',
        name: 'Jean Martin',
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
      }
    ],
    progress: 65,
    location: {
      parcel: 'P2',
      zone: 'Z-1-8'
    },
    estimatedTime: '2h',
    tools: ['Sécateur', 'Cagettes'],
    actions: [
      {
        id: 'action1',
        taskId: '1',
        type: 'harvesting',
        date: new Date(2024, 1, 15, 9, 30),
        description: 'Récolte de 15kg de tomates',
        duration: 45,
        performedBy: {
          id: 'user1',
          name: 'Marie Dubois',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop'
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Désherbage Carottes',
    description: 'Désherbage manuel des rangs de carottes',
    status: 'pending',
    priority: 'medium',
    type: 'maintenance',
    dueDate: addDays(startOfToday(), 2),
    plant: {
      name: 'Carottes Nantaises',
      imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop'
    },
    assignees: [
      {
        id: 'user3',
        name: 'Sophie Bernard',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop'
      }
    ],
    progress: 0,
    location: {
      parcel: 'P3',
      zone: 'Z-2-4'
    },
    estimatedTime: '4h',
    tools: ['Binette', 'Gants']
  },
  {
    id: '3',
    title: 'Arrosage Serres',
    description: 'Arrosage des plants en serre avec vérification de l\'humidité',
    status: 'pending',
    priority: 'high',
    type: 'watering',
    dueDate: startOfToday(),
    plant: {
      name: 'Plants divers',
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop'
    },
    assignees: [
      {
        id: 'user1',
        name: 'Marie Dubois',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop'
      }
    ],
    progress: 0,
    location: {
      parcel: 'Serre 1-3',
      zone: 'Toutes'
    },
    estimatedTime: '1h30',
    tools: ['Arrosoir', 'Tuyau d\'arrosage']
  }
];

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: mockTasks,
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    })),
  updateTaskProgress: (taskId, progress) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, progress } : task
      ),
    })),
  addTaskAction: (taskId, action) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              actions: [
                ...(task.actions || []),
                { ...action, id: `action${Date.now()}` },
              ],
            }
          : task
      ),
    })),
  getFilteredTasks: (view, currentDate, filters) => {
    const tasks = get().tasks;
    let filteredTasks = [...tasks];

    // Date filtering
    const start = view === 'day' ? startOfDay(currentDate)
      : view === 'week' ? startOfWeek(currentDate, { weekStartsOn: 1 })
      : startOfMonth(currentDate);
    
    const end = view === 'day' ? endOfDay(currentDate)
      : view === 'week' ? endOfWeek(currentDate, { weekStartsOn: 1 })
      : endOfMonth(currentDate);

    filteredTasks = filteredTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isWithinInterval(taskDate, { start, end });
    });

    // Type filtering
    if (!filters.includes('all')) {
      filteredTasks = filteredTasks.filter(task => 
        filters.includes(task.type)
      );
    }

    return filteredTasks;
  }
}));

// UI Components
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
const CollapsibleContent = CollapsiblePrimitive.Content;

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Components
interface TaskHeaderProps {
  currentView: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  currentDate: Date;
  onDateChange: (direction: 'prev' | 'next') => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  currentView,
  onViewChange,
  currentDate,
  onDateChange,
}) => {
  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 border-b">
      <div className="flex items-center justify-between h-8 mb-1">
        <button
          onClick={() => onDateChange('prev')}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <h2 className="text-xs font-medium text-gray-700">
          {format(currentDate, "d MMMM yyyy", { locale: fr })}
        </h2>

        <button
          onClick={() => onDateChange('next')}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex rounded-lg bg-gray-100 p-0.5 h-6 mb-1">
        {(['day', 'week', 'month'] as const).map((view) => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`
              flex-1 px-2 text-xs font-medium rounded-md
              transition-all duration-200
              ${
                currentView === view
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {view === 'day'
              ? 'Jour'
              : view === 'week'
              ? 'Semaine'
              : 'Mois'}
          </button>
        ))}
      </div>
    </div>
  );
};

interface TaskFiltersProps {
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
}

const filters = [
  { id: 'all', name: 'Toutes', icon: LayoutGrid },
  { id: 'planting', name: 'Plantation', icon: Leaf },
  { id: 'watering', name: 'Arrosage', icon: Droplets },
  { id: 'pruning', name: 'Taille', icon: Scissors },
  { id: 'maintenance', name: 'Entretien', icon: Shovel },
];

const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedFilters,
  onFilterChange,
}) => {
  return (
    <div className="relative w-full max-w-[calc(100vw-2rem)] mx-auto">
      <div className="overflow-x-auto scrollbar-thin">
        <div className="flex space-x-3 min-w-max px-1 py-1">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isSelected = selectedFilters.includes(filter.id);
            
            return (
              <motion.button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full
                  transition-colors duration-200 whitespace-nowrap
                  ${
                    isSelected
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{filter.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getActionIcon = (type: TaskAction['type']) => {
  switch (type) {
    case 'watering':
      return <Droplets className="w-4 h-4 text-blue-600" />;
    case 'pruning':
      return <Scissors className="w-4 h-4 text-green-600" />;
    case 'weeding':
      return <Shovel className="w-4 h-4 text-lime-900" />;
    case 'fertilizing':
      return <Leaf className="w-4 h-4 text-emerald-600" />;
    default:
      return <Timer className="w-4 h-4 text-gray-600" />;
  }
};

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onClick: (taskId: string) => void;
  onAddAction: (taskId: string, action: Omit<TaskAction, 'id'>) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onClick,
  onAddAction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeActions, setActiveActions] = useState<string[]>([]);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActionClick = (actionType: TaskAction['type']) => {
    if (activeActions.includes(actionType)) {
      setActiveActions(activeActions.filter(type => type !== actionType));
    } else {
      setActiveActions([...activeActions, actionType]);
      onAddAction(task.id, {
        taskId: task.id,
        type: actionType,
        date: new Date(),
        description: `Action ${actionType} ajoutée`,
        duration: 30,
        performedBy: task.assignees[0]
      });
    }
    
    // Si au moins une action est effectuée, on met à jour le statut de la tâche
    if (!activeActions.includes(actionType)) {
      onStatusChange(task.id, 'completed');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={task.plant.imageUrl}
              alt={task.plant.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {task.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => onStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed')}
            className={`
              p-2 rounded-full transition-colors
              ${task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}
            `}
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Timer className="w-4 h-4 mr-2" />
              <span>{task.estimatedTime}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{task.location.parcel} - {task.location.zone}</span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <div className="flex space-x-2 py-2">
              {(['watering', 'pruning', 'weeding', 'fertilizing', 'harvesting'] as const).map((actionType) => (
                <button
                  key={actionType}
                  onClick={() => handleActionClick(actionType)}
                  className={`
                    flex flex-col items-center p-2 rounded-lg border transition-colors min-w-[80px]
                    ${
                      activeActions.includes(actionType)
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-200 hover:text-green-600'
                    }
                  `}
                >
                  {getActionIcon(actionType)}
                  <span className={`
                    text-xs mt-1
                    ${activeActions.includes(actionType) ? 'text-green-700' : 'text-gray-600'}
                  `}>
                    {actionType === 'watering' ? 'Arrosage' :
                     actionType === 'pruning' ? 'Taille' :
                     actionType === 'weeding' ? 'Désherbage' :
                     actionType === 'fertilizing' ? 'Fertilisation' :
                     'Récolte'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100">
              <span>Observations détaillées</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-4">
                {task.actions && task.actions.length > 0 ? (
                  <div className="space-y-2">
                    {task.actions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
                      >
                        <div className="p-1.5 bg-gray-100 rounded-full flex-shrink-0">
                          {getActionIcon(action.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 text-sm">
                                {action.type === 'watering' ? 'Arrosage' :
                                 action.type === 'weeding' ? 'Désherbage' :
                                 action.type === 'fertilizing' ? 'Fertilisation' :
                                 action.type === 'pruning' ? 'Taille' :
                                 action.type === 'harvesting' ? 'Récolte' : 'Autre'}
                              </p>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{action.duration} min</span>
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {format(action.date, "HH:mm", { locale: fr })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate mt-0.5">
                            {action.description}
                          </p>
                          {action.type === 'watering' && (
                            <p className="text-xs italic text-emerald-600 mt-1">
                              Sol légèrement humide, besoin modéré en eau. Les feuilles sont turgescentes.
                            </p>
                          )}
                          {action.type === 'weeding' && (
                            <p className="text-xs italic text-emerald-600 mt-1">
                              Présence de chénopodes et de liserons à surveiller. Le paillage est à renouveler.
                            </p>
                          )}
                          {action.type === 'fertilizing' && (
                            <p className="text-xs italic text-emerald-600 mt-1">
                              Apport de compost bien décomposé. Les plants montrent des signes de carence en azote.
                            </p>
                          )}
                          {action.type === 'pruning' && (
                            <p className="text-xs italic text-emerald-600 mt-1">
                              Suppression des gourmands et des feuilles jaunies. La croissance est vigoureuse.
                            </p>
                          )}
                          {action.type === 'harvesting' && (
                            <p className="text-xs italic text-emerald-600 mt-1">
                              Fruits bien colorés et fermes. Rendement estimé à 2,5kg/m².
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-1">
                            <img
                              src={action.performedBy.avatarUrl}
                              alt={action.performedBy.name}
                              className="w-4 h-4 rounded-full"
                            />
                            <span className="text-xs text-gray-500">{action.performedBy.name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucune observation enregistrée pour cette tâche
                  </p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>

      <CardFooter className="justify-between items-center">
        <div className="flex -space-x-2">
          {task.assignees.map((assignee) => (
            <img
              key={assignee.id}
              src={assignee.avatarUrl}
              alt={assignee.name}
              className="w-8 h-8 rounded-full border-2 border-white"
              title={assignee.name}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {format(task.dueDate, "d MMMM yyyy", { locale: fr })}
        </span>
      </CardFooter>
    </Card>
  );
};

interface TaskListProps {
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  currentView: 'day' | 'week' | 'month';
  currentDate: Date;
  selectedFilters: string[];
}

const TaskList: React.FC<TaskListProps> = ({
  onTaskClick,
  onStatusChange,
  currentView,
  currentDate,
  selectedFilters,
}) => {
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
  const addTaskAction = useTaskStore((state) => state.addTaskAction);
  const filteredTasks = getFilteredTasks(currentView, currentDate, selectedFilters);

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucune tâche trouvée pour cette période</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TaskCard
              task={task}
              onClick={onTaskClick}
              onStatusChange={onStatusChange}
              onAddAction={addTaskAction}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const TaskManagementScreen = () => {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilters, setSelectedFilters] = useState(['all']);

  const handleViewChange = (view: 'day' | 'week' | 'month') => {
    setCurrentView(view);
  };

  const handleDateChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const days = direction === 'next' ? 1 : -1;
    
    switch (currentView) {
      case 'day':
        newDate.setDate(newDate.getDate() + days);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (days * 7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + days);
        break;
    }
    
    setCurrentDate(newDate);
  };

  const handleFilterChange = (filterId: string) => {
    if (filterId === 'all') {
      setSelectedFilters(['all']);
    } else {
      const newFilters = selectedFilters.includes('all')
        ? [filterId]
        : selectedFilters.includes(filterId)
        ? selectedFilters.filter(f => f !== filterId)
        : [...selectedFilters, filterId];
      
      setSelectedFilters(newFilters.length ? newFilters : ['all']);
    }
  };

  const handleTaskClick = (taskId: string) => {
    console.log('Task clicked:', taskId);
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    console.log('Status updated:', taskId, newStatus);
  };

  return (
    <div className="w-full px-4 py-6">
      <TaskHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />
      
      <div className="mt-6 w-full overflow-x-auto">
        <TaskFilters
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
      </div>

      
      <main className="mt-8">
        <TaskList
          currentView={currentView}
          currentDate={currentDate}
          selectedFilters={selectedFilters}
          onTaskClick={handleTaskClick}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
};

const MobileClientTask = () => {
  return (
    <MobileDeviceFrame>
      <div className="h-full bg-gray-50 overflow-hidden">
      <style>
        {`
          :root {
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 222.2 84% 4.9%;
            --primary: 221.2 83.2% 53.3%;
            --primary-foreground: 210 40% 98%;
            --secondary: 210 40% 96.1%;
            --secondary-foreground: 222.2 47.4% 11.2%;
            --muted: 210 40% 96.1%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96.1%;
            --accent-foreground: 222.2 47.4% 11.2%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;
            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --ring: 221.2 83.2% 53.3%;
            --radius: 0.75rem;
          }

          .dark {
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
            --card: 222.2 84% 4.9%;
            --card-foreground: 210 40% 98%;
            --popover: 222.2 84% 4.9%;
            --popover-foreground: 210 40% 98%;
            --primary: 217.2 91.2% 59.8%;
            --primary-foreground: 222.2 47.4% 11.2%;
            --secondary: 217.2 32.6% 17.5%;
            --secondary-foreground: 210 40% 98%;
            --muted: 217.2 32.6% 17.5%;
            --muted-foreground: 215 20.2% 65.1%;
            --accent: 217.2 32.6% 17.5%;
            --accent-foreground: 210 40% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 210 40% 98%;
            --border: 217.2 32.6% 17.5%;
            --input: 217.2 32.6% 17.5%;
            --ring: 224.3 76.3% 48%;
          }

          * {
            border-color: hsl(var(--border));
          }

          body {
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            font-feature-settings: "rlig" 1, "calt" 1;
          }

          /* Scrollbar styles */
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          .scrollbar-thin::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }

          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }

          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}
      </style>
      <TaskManagementScreen />
      </div>
    </MobileDeviceFrame>
  );
};

export default MobileClientTask;