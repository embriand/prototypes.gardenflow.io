import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Users, 
  Calendar,
  Clock,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flower2,
  Trash2,
  Scissors
} from 'lucide-react';
import type { ClientTasksProps, Plant, User, Action, Comment, Task } from './types';

const ClientTasksManagement: React.FC<ClientTasksProps> = () => {
  const [calendarView, setCalendarView] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayMode, setDisplayMode] = useState('tasks');
  const [selectedAction, setSelectedAction] = useState('all');

  const getRelativeDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };


  const getUrgencyColor = (urgency: string): string => {
    const urgencyColorMap: Record<string, string> = {
      'haute': 'bg-red-100 text-red-800',
      'moyenne': 'bg-yellow-100 text-yellow-800',
      'basse': 'bg-green-100 text-green-800',
    };

    return urgencyColorMap[urgency] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string): string => {
    const statusColorMap: Record<string, string> = {
      'terminé': 'bg-green-100 text-green-800',
      'en-cours': 'bg-blue-100 text-blue-800',
      'en-attente': 'bg-yellow-100 text-yellow-800',
    };

    return statusColorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const commonActions = [
    { 
      id: 'preparer-sol', 
      name: 'Préparer le sol',
      type: 'plantation',
      icon: <Trash2 className="h-5 w-5" />
    },
    { 
      id: 'planter', 
      name: 'Planter les graines',
      type: 'plantation',
      icon: <Flower2 className="h-5 w-5" />
    },
    { 
      id: 'arroser', 
      name: 'Arroser',
      type: 'maintenance',
      icon: <Clock className="h-5 w-5" />
    },
    { 
      id: 'tailler', 
      name: 'Tailler',
      type: 'entretien',
      icon: <Scissors className="h-5 w-5" />
    }
  ];

  const allTasks = [
    {
      id: 1,
      title: 'Pilea',
      description: 'Maintenir l\'humidité du sol',
      status: 'en-cours',
      category: 'maintenance',
      dueDate: getRelativeDate(0),
      plant: { name: 'Pilea', image: '/api/placeholder/64/64' },
      assignedUsers: [
        { id: 1, name: 'Marie Dubois', avatar: './assets/placeholder/user-placeholder.png', role: 'Responsable' },
        { id: 2, name: 'Jean Martin', avatar: './assets/placeholder/user-placeholder.png', role: 'Assistant' }
      ],
      actions: [
        { id: 1, name: 'Vérifier l\'humidité', status: 'terminé', category: 'arroser' },
        { id: 2, name: 'Arroser si nécessaire', status: 'en-cours', category: 'arroser' }
      ],
      progress: 1,
      total: 2,
      comments: [
        { 
          id: 1,
          user: 'Marie Dubois',
          avatar: './assets/placeholder/user-placeholder.png',
          text: 'Le sol est encore humide, pas besoin d\'arroser aujourd\'hui',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          user: 'Jean Martin',
          avatar: './assets/placeholder/user-placeholder.png',
          text: 'J\'ai remarqué quelques feuilles jaunies à surveiller',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ]
    },
    {
      id: 2,
      title: 'Radis',
      description: 'Semis et entretien des radis',
      status: 'en-attente',
      category: 'plantation',
      dueDate: getRelativeDate(1),
      urgency: 'haute',
      deadline: getRelativeDate(3),
      plant: { name: 'Radis', image: '/api/placeholder/64/64' },
      assignedUsers: [
        { id: 2, name: 'Pierre Martin', avatar: './assets/placeholder/user-placeholder.png' },
        { id: 3, name: 'Sophie Dubois', avatar: './assets/placeholder/user-placeholder.png' }
      ],
      actions: [
        { id: 3, name: 'Préparer le sol', status: 'en-attente', category: 'preparer-sol' },
        { id: 4, name: 'Semer les graines', status: 'en-attente', category: 'planter' }
      ],
      progress: 0,
      total: 2,
      comments: [
        {
          id: 1,
          user: 'Pierre Martin',
          avatar: './assets/placeholder/user-placeholder.png',
          text: 'Le sol est prêt pour les semis',
          timestamp: new Date(Date.now() - 24 * 3600000).toISOString()
        }
      ]
    }
  ];

  interface NavigateCalendarProps {
    direction: 'next' | 'prev';
  }

  const navigateCalendar = (direction: NavigateCalendarProps['direction']): void => {
    const newDate = new Date(selectedDate);
    switch (calendarView) {
      case 'day':
        newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(selectedDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    setSelectedDate(newDate);
  };

  const filteredTasks = useMemo(() => {
    let filtered = allTasks;
    
    if (selectedAction !== 'all') {
      filtered = filtered.filter(task => 
        task.actions.some(action => 
          action.category === selectedAction
        )
      );
    }

    return filtered.filter(task => {
      const taskDate = new Date(task.dueDate);
      const today = new Date(selectedDate);
      
      switch (calendarView) {
        case 'day':
          return taskDate.toDateString() === today.toDateString();
        case 'week': {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return taskDate >= weekStart && taskDate <= weekEnd;
        }
        case 'month':
          return taskDate.getMonth() === today.getMonth() && 
                 taskDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  }, [selectedDate, calendarView, selectedAction, allTasks]);

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={task.plant.image}
              alt={task.plant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <CardTitle className="text-lg font-semibold">{task.plant.name}</CardTitle>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(task.urgency || '')}`}>
                {task.urgency}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Échéance: {new Date(task.deadline || task.dueDate).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Assigned Users Section */}
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Personnes assignées</h4>
            <div className="space-y-2">
              {task.assignedUsers?.map(user => (
                <div key={user.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border-2 border-white"
                    />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      {user.role && (
                        <p className="text-xs text-gray-500">{user.role}</p>
                      )}
                    </div>
                  </div>
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions Section */}
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Actions à réaliser</h4>
            <div className="space-y-2">
              {task.actions.map(action => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={action.status === 'terminé'}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      onChange={() => {/* Handle status update */}}
                    />
                    <span className="text-sm">{action.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(action.status)}`}>
                    {action.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          {task.comments && task.comments.length > 0 && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Commentaires</h4>
                <span className="text-xs text-gray-500">{task.comments.length} commentaire(s)</span>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {task.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={comment.avatar}
                          alt={comment.user}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-sm font-medium">{comment.user}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 pl-8">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mb-8 p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Client Tasks Management
        </h1>
        <p className="text-slate-600">
          Comprehensive task management system for garden and landscape maintenance with team coordination
        </p>
        
        {/* Feature highlights */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Key Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Task scheduling and assignment</li>
            <li>• Team member coordination</li>
            <li>• Plant and garden management</li>
            <li>• Progress tracking and comments</li>
            <li>• Calendar and timeline views</li>
          </ul>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-8 mx-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold">Mon Jardin</h2>
            </div>

        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDisplayMode('tasks')}
              className={`px-3 py-1 rounded-md text-sm flex items-center space-x-1 ${
                displayMode === 'tasks'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Leaf className="h-4 w-4 mr-1" />
              <span>Plantes</span>
            </button>
            <button
              onClick={() => setDisplayMode('actions')}
              className={`px-3 py-1 rounded-md text-sm flex items-center space-x-1 ${
                displayMode === 'actions'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Filter className="h-4 w-4 mr-1" />
              <span>Actions</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            {['day', 'week', 'month'].map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`px-3 py-1 rounded-md text-sm ${
                  calendarView === view
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view === 'day' ? 'Jour' : view === 'week' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <button
          onClick={() => navigateCalendar('prev')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-medium">
          {calendarView === 'day' && selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {calendarView === 'week' && `Semaine du ${selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`}
          {calendarView === 'month' && selectedDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
        </h3>
        <button
          onClick={() => navigateCalendar('next')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {displayMode === 'actions' && (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedAction('all')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              selectedAction === 'all'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>Toutes les actions</span>
          </button>
          {commonActions.map(action => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                selectedAction === action.id
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {action.icon}
              <span>{action.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune tâche pour cette période</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTasksManagement;