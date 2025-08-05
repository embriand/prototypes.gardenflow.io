import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Check, Pencil, Trash2 } from 'lucide-react';
import MobileDeviceFrame from '../../components/MobileDeviceFrame';

const BlackboardCalendar = () => {
  const [showManager, setShowManager] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<{
     id: number, date: string, title: string, color: string, time: string, icon: string, priority: string
  } | null>(null);

  const [viewMode, setViewMode] = useState('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSimplified, setShowSimplified] = useState(false);
  const [selectedCell, setSelectedCell] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    icon: '',
    priority: 'medium',
    color: '#ff9999'
  });

  const priorityOptions = [
    { value: 'high', label: 'Haute', icon: '🔴' },
    { value: 'medium', label: 'Moyenne', icon: '🟡' },
    { value: 'low', label: 'Basse', icon: '🟢' }
  ];

  const colorOptions = [
    { value: '#ff9999', label: 'Rouge' },
    { value: '#99ff99', label: 'Vert' },
    { value: '#9999ff', label: 'Bleu' },
    { value: '#ffff99', label: 'Jaune' },
    { value: '#ff99ff', label: 'Rose' }
  ];

  const iconOptions = ['🥬', '♻️', '🌾', '🏗️', '🏪', '🌱', '📋', '🚜', '📅', '🐦'];

interface Event {
    id: number;
    date: string;
    title: string;
    color: string;
    time: string;
    icon: string;
    priority: string;
}

interface FormData {
    title: string;
    date: string;
    time: string;
    icon: string;
    priority: string;
    color: string;
}

const getPriorityIcon = (priority: string): string => {
    switch (priority) {
        case 'high':
            return '🔴';
        case 'medium':
            return '🟡';
        case 'low':
            return '🟢';
        default:
            return '';
    }
};

  // Style craie
  const chalkStyle = {
    textShadow: '2px 2px 3px rgba(255,255,255,0.1)',
    fontFamily: '"Comic Sans MS", cursive',
  };

interface DayEvents {
    id: number;
    date: string;
    title: string;
    color: string;
    time: string;
    icon: string;
    priority: string;
}

const getDayEvents = (date: Date | null): DayEvents[] => {
    if (!date) return [];
    return events.filter(event => event.date === date.toISOString().split('T')[0]);
};

interface WeekDays {
    (date: Date): Date[];
}

const getWeekDays: WeekDays = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(start);
        day.setDate(day.getDate() + i);
        return day;
    });
};

interface GetDaysInMonth {
    (date: Date): (Date | null)[];
}

const getDaysInMonth: GetDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days: (Date | null)[] = [];
    
    // Add empty days for padding
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }
    
    return days;
};

interface IsSameDay {
    (date1: Date | null, date2: Date | null): boolean;
}

const isSameDay: IsSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
                 date1.getMonth() === date2.getMonth() &&
                 date1.getFullYear() === date2.getFullYear();
};

  const [events, setEvents] = useState([
    { 
      id: 1, 
      date: '2025-02-19', 
      title: 'Distribution AMAP', 
      color: '#ff9999', 
      time: '16:00',
      icon: '🥬',
      priority: 'high'
    },
    { 
      id: 2, 
      date: '2025-02-19', 
      title: 'Atelier compostage', 
      color: '#ff99ff', 
      time: '14:00',
      icon: '♻️',
      priority: 'medium'
    },
    { 
      id: 3, 
      date: '2025-02-19', 
      title: 'Récolte légumes AMAP', 
      color: '#ffff99', 
      time: '09:00',
      icon: '🌾',
      priority: 'high'
    },
    { 
      id: 4, 
      date: '2025-02-19', 
      title: 'Entretien serre collective', 
      color: '#9999ff', 
      time: '11:00',
      icon: '🏗️',
      priority: 'medium'
    },
    { 
      id: 5, 
      date: '2025-02-22', 
      title: 'Marché local - Vente', 
      color: '#ff9999', 
      time: '08:00',
      icon: '🏪',
      priority: 'high'
    },
    { 
      id: 6, 
      date: '2025-02-22', 
      title: 'Atelier semis collectif', 
      color: '#99ff99', 
      time: '14:00',
      icon: '🌱',
      priority: 'medium'
    },
    { 
      id: 17, 
      date: '2025-02-24', 
      title: 'Stock semences', 
      color: '#ff99ff', 
      time: '09:00',
      icon: '📋',
      priority: 'low'
    },
    { 
      id: 18, 
      date: '2025-02-24', 
      title: 'Préparation sol parcelle 3', 
      color: '#99ff99', 
      time: '11:00',
      icon: '🚜',
      priority: 'high'
    },
    { 
      id: 19, 
      date: '2025-02-25', 
      title: 'Réunion planification', 
      color: '#ff99ff', 
      time: '14:00',
      icon: '📅',
      priority: 'medium'
    },
    { 
      id: 20, 
      date: '2025-02-25', 
      title: 'Installation nichoirs', 
      color: '#ffff99', 
      time: '10:00',
      icon: '🐦',
      priority: 'low'
    },
    { 
      id: 21, 
      date: '2025-03-02', 
      title: 'Installation nichoirs', 
      color: '#ffff99', 
      time: '10:00',
      icon: '🐦',
      priority: 'low'
    },
    {
        id: 22, 
        date: '2025-02-06', 
        title: 'Distribution AMAP', 
        color: '#ff9999', 
        time: '16:00',
        icon: '🥬',
        priority: 'high'
    },
  ]);

interface EventForm {
    title: string;
    date: string;
    time: string;
    icon: string;
    priority: string;
    color: string;
}

interface NewEvent extends EventForm {
    id: number;
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newEvent: NewEvent = {
        ...formData,
        id: editingEvent ? editingEvent.id : Math.max(...events.map(e => e.id), 0) + 1
    };

    let updatedEvents: Event[];
    if (editingEvent) {
        updatedEvents = events.map(event => 
            event.id === editingEvent.id ? newEvent : event
        );
    } else {
        updatedEvents = [...events, newEvent];
    }

    setEvents(updatedEvents);
    resetForm();
};

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      icon: '',
      priority: 'medium',
      color: '#ff9999'
    });
    setEditingEvent(null);
    setShowForm(false);
  };

interface EditEvent {
    id: number;
    title: string;
    date: string;
    time: string;
    icon: string;
    priority: string;
    color: string;
}

const handleEdit = (event: EditEvent) => {
    setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        icon: event.icon,
        priority: event.priority,
        color: event.color
    });
    setEditingEvent(event);
    setShowForm(true);
    setShowManager(true);
};

interface HandleDelete {
    (eventId: number): void;
}

const handleDelete: HandleDelete = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
};

interface HandleModeClick {
    (mode: string): void;
}

const handleModeClick: HandleModeClick = (mode) => {
    if (mode === 'month' && viewMode === 'month') {
        setShowSimplified(!showSimplified);
    } else {
        setViewMode(mode);
    }
};

interface GetButtonText {
    (mode: string): string;
}

const getButtonText: GetButtonText = (mode) => {
    if (mode === 'day') return 'Jour';
    if (mode === 'week') return 'Semaine';
    if (mode === 'month') return viewMode === 'month' ? (showSimplified ? 'Mois' : 'Liste') : 'Mois';
    return mode;
};

  const modes = ['day', 'week', 'month'];

  const renderMonthView = () => {
    if (showSimplified) {
      return (
        <div className="space-y-4">
          {getDaysInMonth(currentDate)
        .filter(date => date !== null && getDayEvents(date).length > 0)
        .map((date, index) => (
              <div
                key={index}
                className={`p-4 rounded ${
                  isSameDay(date, new Date())
                    ? 'bg-gray-700'
                    : 'bg-gray-800 bg-opacity-50'
                }`}
              >
                <div 
                  className="text-white text-xl mb-3"
                  style={chalkStyle}
                >
                  {date ? date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' }) : ''}
                </div>
                <div className="space-y-2">
                  {getDayEvents(date).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center p-2 rounded"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderLeft: `4px solid ${event.color}`
                      }}
                    >
                      <span 
                        style={{ color: event.color }}
                        className="text-lg font-bold mr-3"
                      >
                        {event.time}
                      </span>
                      <span className="text-white text-lg flex items-center gap-2">
                        {event.icon} {event.title} {getPriorityIcon(event.priority)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      );
    }

    return (
        <>
          <div className="grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div
                key={day}
                className="text-center text-white p-2 text-lg"
                style={chalkStyle}
              >
                {day}
              </div>
            ))}
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayEvents = getDayEvents(date);
              return (
                <div
                  key={index}
                  className={`p-2 rounded min-h-24 relative cursor-pointer group ${
                    isSameDay(date, new Date())
                      ? 'bg-gray-700'
                      : dayEvents.length > 0 
                        ? 'bg-gray-800 bg-opacity-50 hover:bg-gray-700'
                        : 'hover:bg-gray-800'
                  }`}
                  style={chalkStyle}
                  onClick={() => setSelectedCell(dayEvents.length > 0 ? date : null)}
                >
                  <div className="text-white text-lg mb-1">{date ? date.getDate() : ''}</div>
                  {dayEvents.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1 items-center">
                        {[...new Set(dayEvents.map(event => event.icon))].map((icon, i) => (
                          <span key={i} className="text-sm">{icon}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {[...new Set(dayEvents.map(event => getPriorityIcon(event.priority)))].map((priority, i) => (
                          <span key={i} className="text-xs">{priority}</span>
                        ))}
                      </div>
                      {dayEvents.length > 0 && date && (
                        <div className="text-white text-xs opacity-75">
                            {dayEvents.length} événement{dayEvents.length > 1 ? 's' : ''}
                        </div>
                        )}
                    </div>
                  )}
  
                  {/* Popup détaillée au survol */}
                  {dayEvents.length > 0 && (
                    <div className="fixed z-50 w-64 bg-gray-800 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="text-white font-bold mb-2">
                        {date && date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })}
                      </div>
                      <div className="space-y-2">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center gap-2 text-sm p-1 rounded"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.2)',
                              borderLeft: `3px solid ${event.color}`
                            }}
                          >
                            <span style={{ color: event.color }}>{event.time}</span>
                            <span className="text-white flex items-center gap-1">
                              {event.icon} {event.title} {getPriorityIcon(event.priority)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
  
          {/* Modal détaillé au clic */}
          {selectedCell && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedCell(null);
              }}
            >
              <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full m-4" style={chalkStyle}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-xl">
                    {selectedCell.toLocaleDateString('fr-FR', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </h2>
                  <button 
                    onClick={() => setSelectedCell(null)}
                    className="text-white hover:bg-gray-700 rounded-full p-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  {getDayEvents(selectedCell).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderLeft: `4px solid ${event.color}`
                      }}
                    >
                      <div className="text-white flex items-center gap-2">
                        <span style={{ color: event.color }}>{event.time}</span>
                        <span className="text-lg flex items-center gap-2">
                          {event.icon} {event.title} {getPriorityIcon(event.priority)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      );
    };

  return (
    <MobileDeviceFrame>
      <div className="bg-black w-full h-full p-4 flex justify-center overflow-hidden">
        <div className="w-full rounded-lg relative flex flex-col" style={{
          boxShadow: 'inset 0 0 25px rgba(255,255,255,0.1)',
          height: '100%'
        }}>
        {/* Event Manager */}
        <div className="mb-4">
          <button
            onClick={() => setShowManager(!showManager)}
            className="w-full bg-gray-800 p-4 rounded-lg text-white flex items-center justify-between"
            style={chalkStyle}
          >
            <span className="text-xl">Gestionnaire d'événements</span>
            {showManager ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </button>

          {showManager && (
            <div className="mt-2 bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl" style={chalkStyle}>
                  {showForm ? (editingEvent ? 'Modifier l\'événement' : 'Nouvel événement') : 'Liste des événements'}
                </h2>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
                >
                  {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {showForm ? 'Annuler' : 'Nouvel Événement'}
                </button>
              </div>

              {showForm ? (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-700 rounded-lg p-4">
                  <div>
                    <label className="block text-white mb-2">Titre</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-gray-600 text-white rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-gray-600 text-white rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Heure</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-gray-600 text-white rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2">Priorité</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-gray-600 text-white rounded px-3 py-2"
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Couleur</label>
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full bg-gray-600 text-white rounded px-3 py-2"
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Icône</label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full bg-gray-600 text-white rounded px-3 py-2"
                    >
                      <option value="">Sélectionner une icône</option>
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 flex justify-end gap-3 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      {editingEvent ? 'Modifier' : 'Créer'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  {events.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between bg-gray-700 p-3 rounded"
                    >
                      <div className="flex items-center gap-3 text-white">
                        <span className="text-2xl">{event.icon}</span>
                        <div>
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-sm text-gray-300">
                            {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 hover:bg-gray-600 rounded"
                        >
                          <Pencil className="w-5 h-5 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 hover:bg-gray-600 rounded"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-black w-full p-2 flex justify-center">
            <div className="w-full bg-gray-900 rounded-lg p-4 relative flex flex-col" style={{
                boxShadow: 'inset 0 0 50px rgba(255,255,255,0.1)',
                minHeight: '90vh'
            }}>
                {/* En-tête */}
                <div className="flex justify-between items-center mb-6 text-white" style={chalkStyle}>
                    <button 
                    className="p-2 hover:bg-gray-800 rounded-full"
                    onClick={() => {
                        const newDate = new Date(currentDate);
                        switch (viewMode) {
                        case 'day':
                            newDate.setDate(newDate.getDate() - 1);
                            break;
                        case 'week':
                            newDate.setDate(newDate.getDate() - 7);
                            break;
                        case 'month':
                            newDate.setMonth(newDate.getMonth() - 1);
                            break;
                        }
                        setCurrentDate(newDate);
                    }}
                    >
                    <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6" />
                    <h1 className="text-2xl">
                        {currentDate.toLocaleDateString('fr-FR', { 
                        weekday: viewMode === 'month' ? undefined : 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: viewMode === 'month' ? undefined : 'numeric' 
                        })}
                    </h1>
                    </div>
        
                    <button 
                    className="p-2 hover:bg-gray-800 rounded-full"
                    onClick={() => {
                        const newDate = new Date(currentDate);
                        switch (viewMode) {
                        case 'day':
                            newDate.setDate(newDate.getDate() + 1);
                            break;
                        case 'week':
                            newDate.setDate(newDate.getDate() + 7);
                            break;
                        case 'month':
                            newDate.setMonth(newDate.getMonth() + 1);
                            break;
                        }
                        setCurrentDate(newDate);
                    }}
                    >
                    <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
        
                {/* Navigation */}
                <div className="flex gap-2 mb-8 justify-center items-center shrink-0">
                    {modes.map((mode) => (
                    <button
                    key={mode}
                    className="px-6 py-3 rounded text-xl transition-colors duration-200 bg-transparent hover:bg-gray-800"
                    onClick={() => handleModeClick(mode)}
                    >
                        <span className={`font-medium capitalize ${viewMode === mode ? 'text-yellow-300 text-1xl' : 'text-white'}`}>
                        {getButtonText(mode)}
                        </span>
                    </button>
                    ))}
                </div>
        
                {/* Contenu */}
                <div className="flex-1 overflow-auto">
                    {viewMode === 'month' && renderMonthView()}
                    
                    {viewMode === 'day' && (
                    <div className="space-y-3">
                        {getDayEvents(currentDate).map((event) => (
                        <div
                            key={event.id}
                            className="p-3 rounded"
                            style={{
                            ...chalkStyle,
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderLeft: `4px solid ${event.color}`
                            }}
                        >
                            <div className="text-white flex items-center gap-2">
                            <span style={{ color: event.color }}>{event.time}</span>
                            <span className="text-lg flex items-center gap-2">
                                {event.icon} {event.title} {getPriorityIcon(event.priority)}
                            </span>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
        
                    {viewMode === 'week' && (
                    <div className="grid grid-cols-1 gap-3">
                        {getWeekDays(currentDate).map((date, index) => (
                        <div 
                            key={index}
                            className={`p-4 rounded ${
                            isSameDay(date, new Date())
                                ? 'bg-gray-700'
                                : 'hover:bg-gray-800'
                            }`}
                        >
                            <div 
                            className="text-white text-xl mb-3"
                            style={chalkStyle}
                            >
                            {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })}
                            </div>
                            <div className="grid gap-2">
                            {getDayEvents(date).map((event) => (
                                <div
                                key={event.id}
                                className="text-base p-2 rounded"
                                style={{
                                    ...chalkStyle,
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderLeft: `4px solid ${event.color}`
                                }}
                                >
                                <span style={{ color: event.color }} className="text-lg">{event.time}</span>
                                <span className="text-white ml-3 text-lg flex items-center gap-2">
                                    {event.icon} {event.title} {getPriorityIcon(event.priority)}
                                </span>
                                </div>
                            ))}
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
        
                {/* Effet poussière de craie */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                    background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAKxqQ9AAAACHRSTlMABgkNERQXGzAJGVAAAABhSURBVDjLY2AgETDBGEyoYkwwBlNkJpwRGSGnM8IZzFAbwQzGqAw4gxnVRlTLmFEZcAYzqo2oljGjMuAMZlQbUS1jRmXAGcyoNqJaxozKgDOYUW1EtYwZlQFnMKPaiGoZgOEAAwDaTnx5mXgJ8QAAAABJRU5ErkJggg==")',
                    opacity: 0.05,
                    }}
                />
                </div>
            </div>
        </div>
      </div>
    </MobileDeviceFrame>
  );      
};

export default BlackboardCalendar;