import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Layers, Star, Clock, Eye, Zap, Code2, TestTube, Rocket, Gauge, Shield, Sparkles, ArrowRight, ChevronRight, Activity, Database, Palette, Globe, MessageSquare } from 'lucide-react'
import { loadPerformanceData, getPerformanceStats, generateInsights, isPerformanceDataCurrent, type PerformanceData } from '../utils/performanceUtils'

const prototypes = [
  {
    id: 'enhanced-parcel-zone-crops',
    title: 'Enhanced Parcel-Zone-Crops',
    path: '/enhanced-parcel-zone-crops',
    description: 'Comprehensive parcel and zone management with advanced crop planning and interactive canvas',
    status: 'active',
    lastModified: '2025-01-22',
    featured: true,
    category: 'landscape',
    size: 'large',
    technologies: ['React', 'Canvas', 'TypeScript'],
    complexity: 'high'
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
    size: 'large',
    technologies: ['React', 'AI/ML', 'TypeScript'],
    complexity: 'high'
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
    size: 'large',
    technologies: ['React', 'Redux', 'Canvas API', 'TypeScript'],
    complexity: 'high'
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
    size: 'medium',
    technologies: ['React', 'TypeScript', 'JSON'],
    complexity: 'low'
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
    size: 'large',
    technologies: ['React', 'TypeScript', 'JSON'],
    complexity: 'medium'
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

const getCardSize = (size: string) => {
  switch (size) {
    case 'small': return 'col-span-1 row-span-1'
    case 'medium': return 'col-span-2 row-span-1'
    case 'large': return 'col-span-2 row-span-2'
    default: return 'col-span-1 row-span-1'
  }
}

const Home = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      description: 'Isolate heavy components from main app bundle',
      icon: <Rocket className="w-8 h-8" />,
      gradient: 'from-green-400 to-emerald-500',
      stats: '+25% faster load'
    },
    {
      title: 'Clean Architecture',
      description: 'Separate experimental features from production',
      icon: <Shield className="w-8 h-8" />,
      gradient: 'from-blue-400 to-cyan-500',
      stats: 'Zero conflicts'
    },
    {
      title: 'Rapid Testing',
      description: 'Test prototypes in complete isolation',
      icon: <TestTube className="w-8 h-8" />,
      gradient: 'from-purple-400 to-violet-500',
      stats: 'Instant feedback'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section with Bento Layout */}
        <div className="mb-8">
          <div className="text-center mb-8">
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

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Benefits Section - Takes up left side */}
          <div className="lg:col-span-7">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 shadow-xl h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Why Separate Environment?</h2>
                <p className="text-slate-600">Unlock the full potential of your development workflow</p>
              </div>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`bg-gradient-to-br ${benefit.gradient} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">
                          {benefit.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-slate-900">{benefit.title}</h3>
                          <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            {benefit.stats}
                          </span>
                        </div>
                        <p className="text-slate-600">{benefit.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions - Takes up right side */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Start */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
              <div className="mb-4">
                <Rocket className="w-10 h-10 mb-3 opacity-90" />
                <h3 className="text-xl font-bold mb-2">Quick Start</h3>
                <p className="text-blue-100 text-sm">Jump right into prototype testing</p>
              </div>
              <div className="space-y-2 text-sm text-blue-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  <span>Components run in isolation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  <span>Real-time development server</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                  <span>Zero configuration needed</span>
                </div>
              </div>
            </div>

            {/* Development Status */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Development Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Server Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Hot Reload</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">TypeScript</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-600">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prototypes Bento Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Available Prototypes</h2>
              <p className="text-slate-600">Click any prototype to test in isolation</p>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-500">
              <Eye className="w-4 h-4" />
              <span>{prototypes.length} prototype{prototypes.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {prototypes.map((prototype) => (
              <Link
                key={prototype.id}
                to={prototype.path}
                className={`${getCardSize(prototype.size)} group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(prototype.category)} opacity-90`}></div>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-6 translate-y-6"></div>
                </div>

                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(prototype.category)}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {prototype.featured && (
                        <div className="bg-yellow-400/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-300" />
                          <span className="text-xs font-medium">Featured</span>
                        </div>
                      )}
                      <div className={`bg-gradient-to-r ${statusColors[prototype.status as keyof typeof statusColors]} px-3 py-1 rounded-full`}>
                        <span className="text-xs font-medium">{statusLabels[prototype.status as keyof typeof statusLabels]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-auto">
                    <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                      {prototype.title}
                    </h3>
                    
                    {prototype.size !== 'small' && (
                      <p className="text-white/90 text-sm mb-4 line-clamp-2">
                        {prototype.description}
                      </p>
                    )}

                    {/* Technologies */}
                    {prototype.technologies && prototype.size === 'large' && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {prototype.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(prototype.lastModified).toLocaleDateString()}</span>
                      </div>
                      <span className="capitalize bg-white/10 px-2 py-1 rounded">
                        {prototype.category}
                      </span>
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}

            {/* Add More Card */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-all duration-300 group cursor-pointer">
              <div className="bg-slate-200 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 mb-4">
                <Code2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-center mb-2">Add New Prototype</h3>
              <p className="text-sm text-center leading-relaxed">
                Ready to migrate another component?
              </p>
            </div>
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