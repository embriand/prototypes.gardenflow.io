/**
 * Glassy Bento Garden Calendar - Modern glassmorphism design
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Bed as Seed, Scissors, Clock, 
  Sun, CloudRain, Thermometer, Wind, Snowflake, CloudSnow, Cloud,
  Droplets, Zap, Sparkles, TreePine, Flower2, Sprout, Leaf,
  Moon, Star, AlertCircle, TrendingUp, Activity, Gauge, Share2, Check,
  CloudSun, SunDim
} from 'lucide-react';

// Import all monthly data
import januaryData from './data/gardenData.json';
import februaryData from './data/gardenData.json';
import marchData from './data/march.json';
import aprilData from './data/april.json';
import mayData from './data/may.json';
import juneData from './data/june.json';
import julyData from './data/july.json';
import augustData from './data/august.json';
import septemberData from './data/september.json';
import octoberData from './data/october.json';
import novemberData from './data/november.json';
import decemberData from './data/december.json';

interface Plant {
  id: string;
  name: string;
  emoji: string;
  type: string;
  action: string;
  difficulty: string;
  maturationTime: string;
  tips: string;
  companions: string[];
  sunExposure: string;
  weather: string;
  temperature: string;
  color: string;
  yieldKgM2?: number | string;
  yieldTHa?: number | string;
}

const GlassyGardenCalendar: React.FC = () => {
  const today = new Date();
  
  // Get initial month/year from URL params or use current date
  const getInitialMonthYear = () => {
    const params = new URLSearchParams(window.location.search);
    const monthParam = params.get('month');
    const yearParam = params.get('year');
    
    const month = monthParam ? parseInt(monthParam, 10) - 1 : today.getMonth(); // Convert 1-12 to 0-11
    const year = yearParam ? parseInt(yearParam, 10) : today.getFullYear();
    
    // Validate month and year
    const validMonth = month >= 0 && month <= 11 ? month : today.getMonth();
    const validYear = year >= 2020 && year <= 2030 ? year : today.getFullYear();
    
    return { month: validMonth, year: validYear };
  };
  
  const initialValues = getInitialMonthYear();
  const [currentMonth, setCurrentMonth] = useState(initialValues.month);
  const [currentYear, setCurrentYear] = useState(initialValues.year);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareComment, setShareComment] = useState('');
  
  // Update URL when month/year changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('month', String(currentMonth + 1)); // Convert 0-11 to 1-12 for URL
    params.set('year', String(currentYear));
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [currentMonth, currentYear]);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  // Month themes with green-oriented gradients matching GardenFlow
  const monthThemes = {
    0: { gradient: 'from-emerald-500 via-teal-500 to-cyan-500', icon: <Snowflake className="w-5 h-5" />, bg: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50' },
    1: { gradient: 'from-teal-500 via-emerald-500 to-green-500', icon: <CloudSnow className="w-5 h-5" />, bg: 'bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50' },
    2: { gradient: 'from-green-500 via-emerald-500 to-teal-500', icon: <Sprout className="w-5 h-5" />, bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50' },
    3: { gradient: 'from-lime-500 via-green-500 to-emerald-500', icon: <Flower2 className="w-5 h-5" />, bg: 'bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50' },
    4: { gradient: 'from-green-400 via-emerald-400 to-teal-400', icon: <Sun className="w-5 h-5" />, bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50' },
    5: { gradient: 'from-emerald-400 via-green-400 to-lime-400', icon: <Sun className="w-5 h-5" />, bg: 'bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50' },
    6: { gradient: 'from-lime-400 via-green-400 to-emerald-400', icon: <Zap className="w-5 h-5" />, bg: 'bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50' },
    7: { gradient: 'from-green-500 via-lime-500 to-yellow-500', icon: <Sun className="w-5 h-5" />, bg: 'bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50' },
    8: { gradient: 'from-emerald-500 via-teal-500 to-green-500', icon: <Leaf className="w-5 h-5" />, bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50' },
    9: { gradient: 'from-teal-500 via-emerald-500 to-green-500', icon: <Leaf className="w-5 h-5" />, bg: 'bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50' },
    10: { gradient: 'from-emerald-600 via-teal-600 to-cyan-600', icon: <Wind className="w-5 h-5" />, bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50' },
    11: { gradient: 'from-teal-600 via-emerald-600 to-green-600', icon: <Snowflake className="w-5 h-5" />, bg: 'bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50' }
  };

  const getMonthData = () => {
    const monthDataSources = [
      januaryData.january,
      februaryData.february,
      marchData.march,
      aprilData.april,
      mayData.may,
      juneData.june,
      julyData.july,
      augustData.august,
      septemberData.september,
      octoberData.october,
      novemberData.november,
      decemberData.december
    ];
    
    return monthDataSources[currentMonth] || [];
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const monthData = getMonthData();
    
    const days = [];
    
    // Empty days at the beginning
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        day: 0,
        plants: [],
        isToday: false,
        isWeekend: false,
        weather: '',
        temperature: ''
      });
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
      const dayData = monthData.find(d => d.day === day);
      
      days.push({
        day,
        plants: dayData?.plants || [],
        isToday: isCurrentMonth && today.getDate() === day,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        weather: '', // Not used, kept for compatibility
        temperature: ''
      });
    }
    
    return days;
  };

  const getWeatherIcon = (day: number, month: number) => {
    const winterMonths = [11, 0, 1];
    const springMonths = [2, 3, 4];
    const summerMonths = [5, 6, 7];
    const autumnMonths = [8, 9, 10];
    
    if (winterMonths.includes(month)) {
      if (day <= 10) return <Snowflake className="w-3 h-3 text-blue-400" />;
      if (day <= 20) return <CloudSnow className="w-3 h-3 text-gray-400" />;
      return <Cloud className="w-3 h-3 text-gray-500" />;
    } else if (springMonths.includes(month)) {
      if (day <= 10) return <CloudRain className="w-3 h-3 text-blue-400" />;
      if (day <= 20) return <Sun className="w-3 h-3 text-yellow-400" />;
      return <CloudRain className="w-3 h-3 text-blue-500" />;
    } else if (summerMonths.includes(month)) {
      if (day <= 10) return <Sun className="w-3 h-3 text-orange-400" />;
      if (day <= 20) return <Sun className="w-3 h-3 text-yellow-400" />;
      return <Zap className="w-3 h-3 text-purple-400" />;
    }
    return <Leaf className="w-3 h-3 text-orange-400" />;
  };

  const getDifficultyGradient = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-gradient-to-r from-green-400 to-emerald-400';
      case 'moyen': return 'bg-gradient-to-r from-yellow-400 to-amber-400';
      case 'difficile': return 'bg-gradient-to-r from-red-400 to-rose-400';
      default: return 'bg-gradient-to-r from-gray-400 to-slate-400';
    }
  };

  const getActionGradient = (action: string) => {
    switch (action) {
      case 'sow': return 'from-emerald-100 via-green-100 to-teal-100';
      case 'harvest': return 'from-lime-100 via-green-100 to-emerald-100';
      case 'plan': return 'from-teal-100 via-emerald-100 to-green-100';
      case 'maintain': return 'from-green-100 via-emerald-100 to-teal-100';
      default: return 'from-green-100 via-emerald-100 to-teal-100';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'sow': return <Seed className="w-3 h-3" />;
      case 'harvest': return <Scissors className="w-3 h-3" />;
      case 'plan': return <Calendar className="w-3 h-3" />;
      case 'maintain': return <Activity className="w-3 h-3" />;
      default: return <Sprout className="w-3 h-3" />;
    }
  };

  const calendarDays = generateCalendarDays();
  const currentTheme = monthThemes[currentMonth as keyof typeof monthThemes];

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    }
    setSelectedDay(null);
  };
  
  // Generate shareable URL that works in both dev and production
  const getShareableUrl = () => {
    // Use the current URL which includes query parameters for month/year
    const url = new URL(window.location.href);
    
    // Ensure we have the month and year parameters
    url.searchParams.set('month', String(currentMonth + 1));
    url.searchParams.set('year', String(currentYear));
    
    return url.toString();
  };

  const handleShare = async () => {
    const url = getShareableUrl();
    const shareTitle = `Calendrier de Plantation - ${months[currentMonth]} ${currentYear}`;
    const shareText = shareComment || `Découvrez le calendrier de plantation pour ${months[currentMonth]} ${currentYear}`;
    
    // Check if Web Share API is available (works on both mobile and some desktop browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: url
        });
        return; // Exit if share was successful
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error('Error sharing:', err);
          // Fall back to modal if native share fails
        }
      }
    }
    
    // Show custom share modal for desktop or if native share is not available
    setShowShareModal(true);
  };
  
  const handleCopyLink = async () => {
    const url = getShareableUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Merged Header & Legend - GardenFlow Green Theme */}
        <div className="mb-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-xl p-8 border border-green-100">
            {/* Top section - Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className={`p-4 bg-gradient-to-br ${currentTheme.gradient} rounded-2xl`}>
                  <Calendar className="text-white w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-green-900">
                    Calendrier De Plantation
                  </h2>
                  <p className="text-green-600 mt-1">
                    Suggestions quotidiennes personnalisées pour {currentYear}
                  </p>
                </div>
              </div>
              
              {/* Month Navigation */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/70 rounded-2xl p-2 backdrop-blur-sm">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2.5 bg-white/80 hover:bg-white rounded-xl transition-all duration-200"
                  >
                    <ChevronLeft className="text-green-700 w-5 h-5" />
                  </button>
                  
                  <div className="text-center px-6 py-2 min-w-[180px]">
                    <div className="flex items-center justify-center space-x-3">
                      <div className={`p-1.5 bg-gradient-to-br ${currentTheme.gradient} rounded-lg`}>
                        {React.cloneElement(currentTheme.icon, { className: "w-4 h-4 text-white" })}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-900">
                          {months[currentMonth]}
                        </h3>
                        <p className="text-xs text-green-600">{currentYear}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2.5 bg-white/80 hover:bg-white rounded-xl transition-all duration-200"
                  >
                    <ChevronRight className="text-green-700 w-5 h-5" />
                  </button>
                </div>
                
                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl transition-all duration-200 bg-white/70 hover:bg-white text-green-700 backdrop-blur-sm"
                  title="Partager ce mois"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Divider line */}
            <div className="h-px bg-green-200 mb-6"></div>

            {/* Legend Section - Wallet compartments */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider">
                Légende
              </h3>
              
              {/* Legend grid - compact wallet card slots */}
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {/* Actions row */}
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 bg-blue-100 rounded-lg">
                      <Seed className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold text-green-800">Semis</span>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 bg-orange-100 rounded-lg">
                      <Scissors className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <span className="text-xs font-semibold text-green-800">Récolte</span>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 bg-purple-100 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <span className="text-xs font-semibold text-green-800">Planning</span>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <div className="p-1 bg-gray-200 rounded-lg">
                      <Activity className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    <span className="text-xs font-semibold text-green-800">Entretien</span>
                  </div>
                </div>
                
                {/* Sun Exposure */}
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <Sun className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-xs font-semibold text-green-800">Soleil</span>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-green-800">Mi-ombre</span>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <SunDim className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-semibold text-green-800">Ombre</span>
                  </div>
                </div>
                
                {/* Difficulty */}
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded"></div>
                    <span className="text-xs font-semibold text-green-800">Facile</span>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-gradient-to-r from-yellow-400 to-amber-400 rounded"></div>
                    <span className="text-xs font-semibold text-green-800">Moyen</span>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-gradient-to-r from-red-400 to-rose-400 rounded"></div>
                    <span className="text-xs font-semibold text-green-800">Difficile</span>
                  </div>
                </div>
                
                {/* Yield */}
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm">📊</span>
                    <span className="text-xs font-semibold text-green-800">kg/m²</span>
                  </div>
                </div>
                
                <div className="bg-white/60 rounded-xl p-2.5 hover:bg-white/80 transition-all backdrop-blur-sm">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm">🏆</span>
                    <span className="text-xs font-semibold text-green-800">t/ha</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Calendar Grid - GardenFlow Green Theme */}
        <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl shadow-xl p-6 border border-emerald-100">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-3 mb-4">
            {weekDays.map((day, index) => (
              <div 
                key={day}
                className="text-center py-2.5"
              >
                <div className="text-xs font-semibold text-green-700 uppercase tracking-wider">{day.slice(0, 3)}</div>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                className={`relative group ${dayData.day === 0 ? 'invisible' : ''}`}
                onMouseEnter={() => dayData.day > 0 && setHoveredDay(dayData.day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {dayData.day > 0 && (
                  <div
                    className={`
                      min-h-[140px] p-2 rounded-2xl transition-all duration-300 cursor-pointer border
                      ${dayData.isToday 
                        ? 'border-emerald-400 shadow-md bg-gradient-to-br from-emerald-100 to-green-100' 
                        : hoveredDay === dayData.day 
                        ? 'border-green-300 shadow-md bg-gradient-to-br from-green-50 to-emerald-50' 
                        : 'bg-gradient-to-br from-green-50/50 to-emerald-50/50 border-green-100 hover:border-green-200 hover:from-green-50 hover:to-emerald-50'
                      }
                      ${dayData.plants.length > 0 ? 'ring-2 ring-emerald-200' : ''}
                    `}
                    onClick={() => dayData.plants.length > 0 && setSelectedDay(dayData.day)}
                  >
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className={`
                        text-sm font-bold rounded-full px-2.5 py-1 shadow-sm
                        ${dayData.isToday 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm' 
                          : dayData.isWeekend
                          ? 'bg-gradient-to-r from-teal-400/50 to-emerald-400/50 text-green-800'
                          : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                        }
                      `}>
                        {dayData.day}
                      </div>
                      <div className="flex items-center space-x-1">
                        {getWeatherIcon(dayData.day, currentMonth)}
                      </div>
                    </div>

                    {/* Plants for this day - Glassy Mini Cards */}
                    <div className="space-y-1.5">
                      {dayData.plants.slice(0, 2).map((plant: Plant, plantIndex) => (
                        <div
                          key={`${plant.id}-${plantIndex}`}
                          className={`
                            p-2 rounded-xl transition-all duration-200
                            bg-gradient-to-r ${getActionGradient(plant.action)}
                            border border-green-200/50
                            hover:shadow-md hover:scale-[1.02] hover:border-green-300
                          `}
                        >
                          {/* Row 1: Name and Action */}
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-1 flex-1 min-w-0">
                              <span className="text-base flex-shrink-0">{plant.emoji}</span>
                              <span className="text-xs font-bold text-gray-800 truncate">
                                {plant.name}
                              </span>
                            </div>
                            <div className="p-1 rounded-lg bg-white/60 flex-shrink-0">
                              {getActionIcon(plant.action)}
                            </div>
                          </div>
                          
                          {/* Row 2: Difficulty, Sun, Temperature */}
                          <div className="flex items-center justify-between gap-1">
                            <div className={`text-[10px] px-1.5 py-0.5 rounded-full ${getDifficultyGradient(plant.difficulty)} text-white font-bold flex-shrink-0`}>
                              {plant.difficulty === 'facile' ? 'F' : plant.difficulty === 'moyen' ? 'M' : 'D'}
                            </div>
                            
                            <div className="flex items-center gap-1 flex-1 justify-end">
                              <div className="bg-white/40 rounded px-1 py-0.5">
                                {plant.sunExposure?.toLowerCase().includes('soleil') || plant.sunExposure?.toLowerCase() === 'full' ? 
                                  <Sun className="w-3 h-3 text-yellow-500" /> : 
                                  plant.sunExposure?.toLowerCase().includes('ombre') && !plant.sunExposure?.toLowerCase().includes('mi') ?
                                  <SunDim className="w-3 h-3 text-gray-500" /> :
                                  <CloudSun className="w-3 h-3 text-amber-500" />
                                }
                              </div>
                              
                              {plant.temperature && (
                                <div className="flex items-center bg-white/40 rounded px-1 py-0.5">
                                  <Thermometer className="w-2.5 h-2.5 text-red-500 mr-0.5" />
                                  <span className="text-[10px] text-gray-800 font-bold">
                                    {plant.temperature.split('-')[0]}°
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Row 3: Yield information if available */}
                          {(plant.yieldKgM2 || plant.yieldTHa) && (
                            <div className="flex items-center justify-between mt-1 gap-1">
                              {plant.yieldKgM2 && (
                                <div className="flex items-center bg-purple-100/50 rounded px-1 py-0.5">
                                  <span className="text-[10px] mr-0.5">📊</span>
                                  <span className="text-[10px] text-purple-800 font-bold">{plant.yieldKgM2}</span>
                                </div>
                              )}
                              {plant.yieldTHa && (
                                <div className="flex items-center bg-blue-100/50 rounded px-1 py-0.5">
                                  <span className="text-[10px] mr-0.5">🏆</span>
                                  <span className="text-[10px] text-blue-800 font-bold">{plant.yieldTHa}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {dayData.plants.length > 2 && (
                        <div className="text-center">
                          <span className="text-xs font-medium text-green-600 bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm">
                            +{dayData.plants.length - 2} autres
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Day Modal - Glassy Design */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-white/50">
              <div className="p-8 border-b border-gray-100/50 bg-gradient-to-r from-white/50 to-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 bg-gradient-to-br ${currentTheme.gradient} rounded-2xl`}>
                      <Calendar className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {selectedDay} {months[currentMonth]} {currentYear}
                      </h3>
                      <p className="text-gray-600">Détails des plantations</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-3 bg-gray-100/50 hover:bg-gray-200/50 backdrop-blur-sm rounded-2xl transition-all duration-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-8 space-y-4">
                {calendarDays.find(d => d.day === selectedDay)?.plants.map((plant: Plant, index) => (
                  <div key={index} className="bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${getActionGradient(plant.action)} backdrop-blur-sm shadow-lg`}>
                        {plant.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xl font-bold text-gray-900">{plant.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getDifficultyGradient(plant.difficulty)}`}>
                            {plant.difficulty}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{plant.maturationTime}</span>
                            </div>
                          </div>
                          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Thermometer className="w-4 h-4" />
                              <span>{plant.temperature}</span>
                            </div>
                          </div>
                          
                          {/* Sun exposure */}
                          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              {plant.sunExposure?.toLowerCase().includes('soleil') || plant.sunExposure?.toLowerCase() === 'full' ? 
                                <Sun className="w-4 h-4 text-yellow-500" /> : 
                                plant.sunExposure?.toLowerCase().includes('ombre') && !plant.sunExposure?.toLowerCase().includes('mi') ?
                                <SunDim className="w-4 h-4 text-gray-500" /> :
                                <CloudSun className="w-4 h-4 text-amber-500" />
                              }
                              <span>
                                {plant.sunExposure || 'Non spécifié'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Action type */}
                          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              {getActionIcon(plant.action)}
                              <span>
                                {plant.action === 'sow' ? 'Semis' : 
                                 plant.action === 'harvest' ? 'Récolte' : 
                                 plant.action === 'plan' ? 'Planning' : 'Entretien'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Yield information if available */}
                        {(plant.yieldKgM2 || plant.yieldTHa) && (
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {plant.yieldKgM2 && (
                              <div className="bg-purple-50/50 backdrop-blur-sm rounded-xl p-3">
                                <div className="flex items-center space-x-2 text-sm">
                                  <span className="text-xl">📊</span>
                                  <div>
                                    <p className="text-xs text-gray-500">kg/m²</p>
                                    <p className="font-bold text-purple-700">{plant.yieldKgM2}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                            {plant.yieldTHa && (
                              <div className="bg-blue-50/50 backdrop-blur-sm rounded-xl p-3">
                                <div className="flex items-center space-x-2 text-sm">
                                  <span className="text-xl">🏆</span>
                                  <div>
                                    <p className="text-xs text-gray-500">t/ha</p>
                                    <p className="font-bold text-blue-700">{plant.yieldTHa}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 backdrop-blur-sm rounded-xl p-4">
                          <p className="text-sm text-gray-700 flex items-start">
                            <Sparkles className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                            {plant.tips}
                          </p>
                        </div>
                        
                        {plant.companions.length > 0 && (
                          <div className="mt-4 flex items-center space-x-2">
                            <span className="text-sm text-purple-600 font-medium">Compagnons:</span>
                            <div className="flex flex-wrap gap-2">
                              {plant.companions.map((companion, i) => (
                                <span key={i} className="px-2 py-1 bg-purple-100/50 backdrop-blur-sm text-purple-700 rounded-lg text-xs">
                                  {companion}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl">
                      <Share2 className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Partager le calendrier
                      </h3>
                      <p className="text-sm text-gray-600">
                        {months[currentMonth]} {currentYear}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowShareModal(false);
                      setShareComment('');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Comment field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter un commentaire (optionnel)
                  </label>
                  <textarea
                    value={shareComment}
                    onChange={(e) => setShareComment(e.target.value)}
                    placeholder="Ex: Voici le planning pour ce mois..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                    rows={3}
                  />
                </div>
                
                {/* URL display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien à partager
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={getShareableUrl()}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`p-3 rounded-xl transition-all duration-200 ${
                        copied 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      title="Copier le lien"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Share buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(shareComment || `Calendrier de plantation - ${months[currentMonth]} ${currentYear}`);
                      const url = encodeURIComponent(getShareableUrl());
                      window.open(`mailto:?subject=${text}&body=${url}`, '_blank');
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 font-medium"
                  >
                    Envoyer par email
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Copier le lien
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default GlassyGardenCalendar;