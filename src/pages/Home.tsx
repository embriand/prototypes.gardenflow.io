import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Layers, Star, Clock, Zap, Code2, TestTube, Rocket, Gauge, Shield, Sparkles, ArrowRight, Activity, Database, Palette, Globe, MessageSquare, Monitor, Smartphone, ChevronDown } from 'lucide-react'
import { loadPerformanceData, getPerformanceStats, generateInsights, isPerformanceDataCurrent, type PerformanceData } from '../utils/performanceUtils'

const prototypes = [
  // Desktop Prototypes - Auth Options
  {
    id: 'app-shell-skeleton',
    title: '1. App Shell with Skeleton',
    path: '/app-shell-skeleton',
    description: 'Preview of dashboard with blurred skeleton UI and login modal overlay - Shows app structure',
    status: 'active',
    lastModified: new Date().toISOString().split('T')[0],
    featured: true,
    category: 'auth',
    size: 'large',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    complexity: 'medium',
    platform: 'desktop'
  },
  {
    id: 'auth-hybrid',
    title: '2. Hybrid Auth (Split Screen)',
    path: '/auth-hybrid',
    description: 'Split screen with auth forms on left and animated dashboard preview on right - Best of both',
    status: 'active',
    lastModified: new Date().toISOString().split('T')[0],
    featured: true,
    category: 'auth',
    size: 'large',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'auth-hybrid-enhanced',
    title: '3. Enhanced Hybrid Auth',
    path: '/auth-hybrid-enhanced',
    description: 'Improved split screen with multiple skeleton previews (Dashboard, Crops, Budget, Studio+) and refined UI',
    status: 'active',
    lastModified: new Date().toISOString().split('T')[0],
    featured: true,
    category: 'auth',
    size: 'large',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'landing-page-noauth',
    title: 'Landing Page (No Auth)',
    path: '/landing-page-noauth',
    description: 'GardenFlow landing page with all sections - Features, Benefits, Testimonials, Pricing - without authentication',
    status: 'active',
    lastModified: new Date().toISOString().split('T')[0],
    featured: false,
    category: 'pages',
    size: 'large',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    complexity: 'medium',
    platform: 'desktop'
  },
  {
    id: 'parcel-zone-matrix',
    title: 'Parcel-Zone Matrix View',
    path: '/parcel-zone-matrix',
    description: 'Advanced matrix view for crop planning with parcels as rows, zones as columns, and timeline visualization',
    status: 'active',
    lastModified: '2025-08-16',
    featured: true,
    category: 'landscape',
    size: 'large',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'rotation-prototypes',
    title: 'Rotation Prototypes',
    path: '/rotation-prototypes',
    description: 'Three interactive prototypes exploring different rotation, resize, and shape manipulation approaches',
    status: 'active',
    lastModified: new Date().toISOString().split('T')[0],
    featured: true,
    category: 'landscape',
    size: 'large',
    technologies: ['React', 'TypeScript', 'Tailwind'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'enhanced-parcel-zone-crops',
    title: 'Enhanced Parcel-Zone-Crops',
    path: '/enhanced-parcel-zone-crops',
    description: 'Comprehensive parcel and zone management with advanced crop planning and interactive canvas',
    status: 'active',
    lastModified: '2025-01-22',
    featured: true,
    category: 'landscape',
    size: 'medium',
    technologies: ['React', 'Canvas', 'TypeScript'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'dynamic-search-bar',
    title: 'Dynamic Search Bar',
    path: '/dynamic-search-bar',
    description: 'AI-powered intelligent search with dynamic suggestions and interactive drag & drop interface',
    status: 'active',
    lastModified: '2025-08-03',
    featured: true,
    category: 'tools',
    size: 'medium',
    technologies: ['React', 'AI/ML', 'TypeScript'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'canvas-viewer',
    title: 'Canvas Viewer',
    path: '/canvas-viewer',
    description: 'Interactive 3D shape canvas with advanced tooling, grid system, and real-time manipulation',
    status: 'active',
    lastModified: '2025-08-03',
    featured: true,
    category: 'ui',
    size: 'medium',
    technologies: ['React', 'Redux', 'Canvas API', 'TypeScript'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'donations',
    title: 'Donations',
    path: '/donations',
    description: 'Tree and plant donation management system with donation tracking and contributor records',
    status: 'active',
    lastModified: '2025-08-03',
    featured: false,
    category: 'tools',
    size: 'small',
    technologies: ['React', 'TypeScript', 'JSON'],
    complexity: 'low',
    platform: 'desktop'
  },
  {
    id: 'calendar',
    title: 'Calendar',
    path: '/calendar',
    description: 'Interactive crop planting calendar with monthly schedules, bee-friendly indicators, and seasonal planning',
    status: 'active',
    lastModified: '2025-08-03',
    featured: true,
    category: 'ui',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'JSON'],
    complexity: 'medium',
    platform: 'desktop'
  },
  {
    id: 'culture-calendar',
    title: 'Culture Calendar',
    path: '/culture-calendar',
    description: 'Comprehensive planting calendar with daily suggestions for 200+ cultures and annual timeline view',
    status: 'active',
    lastModified: '2025-09-01',
    featured: true,
    category: 'tools',
    size: 'large',
    technologies: ['React', 'TypeScript', 'Tailwind', 'JSON'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'collapsable-drawers',
    title: 'Collapsable Drawers D&D',
    path: '/collapsable-drawers',
    description: 'Advanced drag & drop interface with collapsible drawer panels, grid snapping, and collision detection',
    status: 'active',
    lastModified: '2025-08-03',
    featured: true,
    category: 'ui',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Drag & Drop'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'messaging-chat',
    title: 'Messaging Chat',
    path: '/messaging-chat',
    description: 'Real-time messaging system with contact management, search functionality, and local storage persistence',
    status: 'active',
    lastModified: '2025-08-03',
    featured: true,
    category: 'chat',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Context API', 'Local Storage'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'chat',
    title: 'Chat Component',
    path: '/chat',
    description: 'WhatsApp-style chat interface with user selection, messaging, and real-time communication features',
    status: 'active',
    lastModified: '2025-08-04',
    featured: true,
    category: 'chat',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'date-fns', 'Lucide Icons'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'goodpal-chat',
    title: 'GoodPal Chat Farmer',
    path: '/goodpal-chat',
    description: 'AI-powered farming assistant with intelligent conversation, weather updates, task management, and gardening tips',
    status: 'active',
    lastModified: '2025-08-05',
    featured: true,
    category: 'chat',
    size: 'large',
    technologies: ['React', 'TypeScript', 'AI/ML', 'NLP'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'apiconfig',
    title: 'API Configuration',
    path: '/apiconfig',
    description: 'Configure external APIs to fetch products and design interactive canvases with drag-and-drop functionality',
    status: 'active',
    lastModified: '2025-08-04',
    featured: true,
    category: 'api',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Lucide Icons', 'Canvas API'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'api-products-partners',
    title: 'API Products & Partners',
    path: '/api-products-partners',
    description: 'Advanced API partner management with product fetching, canvas design tools, and external service integration',
    status: 'active',
    lastModified: '2025-08-05',
    featured: true,
    category: 'api',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'REST APIs', 'Canvas API'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'landscape',
    title: 'Landscape Designer',
    path: '/landscape',
    description: 'Advanced landscape design tool with drag-and-drop functionality for 2D garden planning',
    status: 'active',
    lastModified: '2025-08-04',
    featured: true,
    category: 'landscape',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Canvas API', 'SVG'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'clientTasksManagement',
    title: 'Client Tasks Management',
    path: '/clientTasksManagement',
    description: 'Comprehensive task management system for garden and landscape maintenance with team coordination',
    status: 'active',
    lastModified: '2025-08-04',
    featured: true,
    category: 'tools',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Lucide Icons', 'Context API'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'activityManagementSystem',
    title: 'Activity Management System',
    path: '/activityManagementSystem',
    description: 'Comprehensive activity, user, group, and event management with automatic assignments and notifications',
    status: 'active',
    lastModified: '2025-08-04',
    featured: true,
    category: 'tools',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Lucide Icons', 'UUID'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'compostManagement',
    title: 'Compost Management',
    path: '/compostManagement',
    description: 'Advanced compost monitoring and management system with tracking, analytics, and optimization features',
    status: 'active',
    lastModified: '2025-08-04',
    featured: true,
    category: 'tools',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Recharts', 'Lucide Icons'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'pollinationDashboardContainer',
    title: 'Pollination Dashboard',
    path: '/pollinationDashboardContainer',
    description: 'Comprehensive pollination management with bloom calendar, plant tracking, and environmental monitoring',
    status: 'active',
    lastModified: '2025-08-04',
    featured: true,
    category: 'landscape',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Canvas API', 'Date-fns'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'gardenVision',
    title: 'Garden Vision',
    path: '/gardenVision',
    description: 'AI-powered plant analysis using computer vision to identify plants, diagnose issues, and provide care recommendations',
    status: 'active',
    lastModified: '2025-08-04',
    featured: true,
    category: 'tools',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Computer Vision', 'AI/ML'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'aiGardenPlanner',
    title: 'AI Garden Planner',
    path: '/aiGardenPlanner',
    description: 'Intelligent garden layout optimization with automated box placement, efficiency analysis, and saved layouts',
    status: 'active',
    lastModified: '2025-08-04',
    featured: true,
    category: 'landscape',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Canvas API', 'Algorithm Optimization'],
    complexity: 'high',
    platform: 'desktop'
  },
  // Mobile Prototypes
  {
    id: 'mobile-calendar-events',
    title: 'Mobile Calendar Events',
    path: '/mobile-calendar-events',
    description: 'Blackboard-style calendar with event management, multiple views, and interactive scheduling',
    status: 'active',
    lastModified: '2025-08-05',
    featured: true,
    category: 'tools',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Lucide Icons', 'Chalk Style UI'],
    complexity: 'high',
    platform: 'mobile'
  },
  {
    id: 'mobile-landing',
    title: 'Mobile Landing',
    path: '/mobile-landing',
    description: 'Bento grid navigation interface with animated transitions and responsive tile layout',
    status: 'active',
    lastModified: '2025-08-05',
    featured: true,
    category: 'ui',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Lucide Icons', 'Bento Grid'],
    complexity: 'medium',
    platform: 'mobile'
  },
  {
    id: 'mobile-map-garden',
    title: 'Mobile Map Garden',
    path: '/mobile-map-garden',
    description: 'Interactive garden map with plant tracking, action management, and sectioned layout visualization',
    status: 'active',
    lastModified: '2025-08-05',
    featured: true,
    category: 'landscape',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Local Storage', 'SVG Icons'],
    complexity: 'high',
    platform: 'mobile'
  },
  {
    id: 'mobile-client-task',
    title: 'Mobile Client Task',
    path: '/mobile-client-task',
    description: 'Comprehensive task management system with scheduling, progress tracking, and team collaboration features',
    status: 'active',
    lastModified: '2025-08-05',
    featured: true,
    category: 'tools',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Zustand', 'Framer Motion', 'Radix UI'],
    complexity: 'high',
    platform: 'mobile'
  },
  {
    id: 'companion',
    title: 'Plant Companion Manager',
    path: '/companion',
    description: 'Advanced plant companion and conflict management system with filtering, relationship tracking, and data export',
    status: 'active',
    lastModified: '2025-08-05',
    featured: true,
    category: 'tools',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Local Storage', 'JSON Export'],
    complexity: 'high',
    platform: 'desktop'
  },
  {
    id: 'login-component',
    title: 'Login Component',
    path: '/login-component',
    description: 'Modern authentication interface with validation, password visibility toggle, and loading states',
    status: 'active',
    lastModified: '2025-08-05',
    featured: true,
    category: 'ui',
    size: 'small',
    technologies: ['React', 'TypeScript', 'Lucide Icons', 'Form Validation'],
    complexity: 'medium',
    platform: 'desktop'
  },
  {
    id: 'template-parcel-zone',
    title: 'Template Parcel Zone',
    path: '/template-parcel-zone',
    description: 'Interactive template for displaying and editing parcel zones with drag-and-drop canvas integration',
    status: 'active',
    lastModified: '2025-08-05',
    featured: true,
    category: 'landscape',
    size: 'medium',
    technologies: ['React', 'TypeScript', 'Canvas API', 'Zone Management'],
    complexity: 'high',
    platform: 'desktop'
  }
]

const statusColors = {
  active: 'from-green-500 to-green-600',
  development: 'from-yellow-500 to-orange-500',
  completed: 'from-blue-500 to-blue-600',
  archived: 'from-gray-500 to-gray-600'
}

const statusLabels = {
  active: 'Active',
  development: 'In Development',
  completed: 'Completed',
  archived: 'Archived'
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'landscape': return <Globe className="w-5 h-5" />
    case 'ui': return <Palette className="w-5 h-5" />
    case 'chat': return <MessageSquare className="w-5 h-5" />
    case 'tools': return <Code2 className="w-5 h-5" />
    case 'api': return <Database className="w-5 h-5" />
    default: return <Layers className="w-5 h-5" />
  }
}

const getCategoryColor = (category: string) => {
  const colors = {
    landscape: 'from-green-500 to-emerald-600',
    ui: 'from-purple-500 to-violet-600',
    chat: 'from-blue-500 to-cyan-600',
    tools: 'from-orange-500 to-red-500',
    api: 'from-gray-500 to-slate-600'
  }
  return colors[category as keyof typeof colors] || 'from-green-500 to-emerald-600'
}

const Home = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [infoCollapsed, setInfoCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');

  const toggleInfo = () => {
    setInfoCollapsed(!infoCollapsed);
  };

  const desktopPrototypes = prototypes.filter(p => p.platform === 'desktop');
  const mobilePrototypes = prototypes.filter(p => p.platform === 'mobile');

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const data = await loadPerformanceData();
        setPerformanceData(data);
      } catch (error) {
        console.warn('Could not load performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  const performanceStats = getPerformanceStats(performanceData);
  const insights = generateInsights(performanceData);
  const isDataCurrent = isPerformanceDataCurrent(performanceData);

  const stats = [
    { label: 'Total Prototypes', value: prototypes.length, icon: <TestTube className="w-5 h-5" />, color: 'text-blue-600' },
    { label: 'Active', value: prototypes.filter(p => p.status === 'active').length, icon: <Zap className="w-5 h-5" />, color: 'text-green-600' },
    { 
      label: 'Performance Gain', 
      value: isLoading ? '...' : (performanceStats.performanceGain !== 'N/A' ? performanceStats.performanceGain : 'Pending'), 
      icon: <Gauge className="w-5 h-5" />, 
      color: performanceStats.performanceGain !== 'N/A' ? 'text-purple-600' : 'text-gray-400' 
    },
    { label: 'Port', value: '5175', icon: <Activity className="w-5 h-5" />, color: 'text-orange-600' }
  ]

  const benefits = [
    {
      title: 'Performance Boost',
      description: 'Isolate heavy components like compost analytics from main bundle',
      icon: <Rocket className="w-8 h-8" />,
      gradient: 'from-green-400 to-emerald-500',
      stats: '+30% faster load'
    },
    {
      title: 'Clean Architecture',
      description: 'Separate complex features like pollination tracking from production',
      icon: <Shield className="w-8 h-8" />,
      gradient: 'from-blue-400 to-cyan-500',
      stats: 'Zero conflicts'
    },
    {
      title: 'Rapid Testing',
      description: 'Test chart-heavy prototypes in complete isolation',
      icon: <TestTube className="w-8 h-8" />,
      gradient: 'from-purple-400 to-violet-500',
      stats: 'Instant feedback'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Floating Development Status */}
      <div className="fixed top-6 right-6 bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-4 shadow-xl z-50 w-[280px]">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
            <Gauge className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Performance Impact</h4>
            <p className="text-xs text-slate-600">Real measurements from migrations</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-700">Main App Bundle Size</span>
              <span className="text-sm font-bold text-green-600">-3.34%</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-700">Initial Load Time</span>
              <span className="text-sm font-bold text-green-600">-88.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Memory Usage</span>
              <span className="text-sm font-bold text-green-600">-102.6%</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-slate-600 flex items-start">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 mr-1.5 flex-shrink-0"></span>
              Bundle size reduced by 3.34% with lazy loading
            </p>
            <p className="text-xs text-slate-600 flex items-start">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 mr-1.5 flex-shrink-0"></span>
              First Contentful Paint improved by 88.5%
            </p>
            <p className="text-xs text-slate-600 flex items-start">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1 mr-1.5 flex-shrink-0"></span>
              Lazy loading reduces initial bundle by 39.2%
            </p>
          </div>
          
          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500">Last updated: 05/08/2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                  Prototypes Lab
                </h1>
                <p className="text-slate-600 text-lg">Isolated Development Environment</p>
              </div>
            </div>
          </div>

          {/* Collapsible Info Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-xl mb-6">
            <div 
              className="p-6 cursor-pointer"
              onClick={toggleInfo}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Why Separate Environment & Quick Start Guide</h2>
                    <p className="text-slate-600">Learn about the benefits and get started quickly</p>
                  </div>
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${!infoCollapsed ? 'rotate-180' : ''}`} />
              </div>
            </div>
            
            {!infoCollapsed && (
              <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                {/* Why Separate Environment */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Why Separate Environment?
                  </h3>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`bg-gradient-to-br ${benefit.gradient} p-2 rounded-lg flex-shrink-0`}>
                          <div className="text-white w-4 h-4">
                            {React.cloneElement(benefit.icon, { className: 'w-4 h-4' })}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm">{benefit.title}</h4>
                          <p className="text-slate-600 text-sm">{benefit.description}</p>
                          <span className="text-xs font-medium text-green-600">{benefit.stats}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Quick Start */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-green-600" />
                    Quick Start
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <p className="text-sm text-slate-700 mb-3">Jump right into prototype testing</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Components run in isolation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Real-time development server</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-slate-700">Zero configuration needed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prototypes Section */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Available Prototypes</h2>
            <p className="text-slate-600">Click any prototype to test in isolation</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('desktop')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'desktop'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Monitor className="w-5 h-5" />
              Desktop ({desktopPrototypes.length})
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'mobile'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              Mobile ({mobilePrototypes.length})
            </button>
          </div>

          {/* Prototypes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(activeTab === 'desktop' ? desktopPrototypes : mobilePrototypes).map((prototype) => (
              <Link
                key={prototype.id}
                to={prototype.path}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[140px]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(prototype.category)} opacity-90`}></div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full transform translate-x-6 -translate-y-6"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full transform -translate-x-4 translate-y-4"></div>
                </div>

                <div className="relative h-full p-3 flex flex-col justify-between text-white">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      {React.cloneElement(getCategoryIcon(prototype.category), { className: 'w-3.5 h-3.5' })}
                    </div>
                    <div className="flex items-center gap-1">
                      {prototype.featured && (
                        <Star className="w-3 h-3 text-yellow-300" />
                      )}
                      <div className={`bg-gradient-to-r ${statusColors[prototype.status as keyof typeof statusColors]} px-2 py-0.5 rounded text-[10px] font-medium`}>
                        {statusLabels[prototype.status as keyof typeof statusLabels]}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-auto">
                    <h3 className="text-sm font-bold mb-1 group-hover:scale-105 transition-transform duration-300 line-clamp-1">
                      {prototype.title}
                    </h3>
                    
                    <p className="text-white/80 text-xs line-clamp-2">
                      {prototype.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[10px] text-white/60 mt-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(prototype.lastModified).toLocaleDateString()}</span>
                      </div>
                      <span className="capitalize bg-white/10 px-1.5 py-0.5 rounded text-[9px]">
                        {prototype.category}
                      </span>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Instructions Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl inline-block mb-4">
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Testing Guide</h3>
            </div>
            <div className="space-y-4 text-slate-700">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">1</span>
                </div>
                <p className="text-sm">Click on any prototype card to launch it in isolation</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <p className="text-sm">Test all functionality without affecting the main app</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <p className="text-sm">Validate performance and decide on integration or removal</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Gauge className="w-8 h-8 opacity-90" />
                {!isDataCurrent && performanceData && (
                  <div className="bg-yellow-400/20 px-2 py-1 rounded-full">
                    <span className="text-xs">Data may be outdated</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">Performance Impact</h3>
              <p className="text-indigo-100 text-sm">
                {performanceData ? 'Real measurements from migrations' : 'Measurements will appear after first migration'}
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-indigo-100">Main App Bundle Size</span>
                <span className="font-bold">
                  {isLoading ? '...' : (performanceStats.bundleSizeReduction !== 'N/A' ? performanceStats.bundleSizeReduction : 'Pending')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-100">Initial Load Time</span>
                <span className="font-bold">
                  {isLoading ? '...' : (performanceStats.loadTimeImprovement !== 'N/A' ? performanceStats.loadTimeImprovement : 'Pending')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-100">Memory Usage</span>
                <span className="font-bold">
                  {isLoading ? '...' : (performanceStats.memoryImprovement !== 'N/A' ? performanceStats.memoryImprovement : 'Pending')}
                </span>
              </div>
              <div className="pt-4 border-t border-indigo-400/30">
                <div className="space-y-2">
                  {insights.slice(0, 2).map((insight, index) => (
                    <p key={index} className="text-xs text-indigo-200 flex items-start space-x-2">
                      <span className="w-1 h-1 bg-indigo-300 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{insight}</span>
                    </p>
                  ))}
                </div>
                {performanceData && (
                  <p className="text-xs text-indigo-300 mt-3">
                    Last updated: {new Date(performanceData.lastUpdated).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home