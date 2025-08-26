import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Leaf,
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  UserPlus,
  LogIn,
  ArrowRight,
  TrendingUp,
  Calendar,
  Package,
  Users,
  BarChart3,
  Sprout,
  Sun,
  Cloud,
  ChevronDown,
  DollarSign,
  Palette,
  Home,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Layers,
  PieChart,
  Activity,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Map,
  MapPin,
  Droplets,
  TreePine,
  Trees,
  PackageSearch,
  SquareChartGantt,
  Grid3X3,
  CheckSquare,
  Pencil,
  Layout,
  GitBranch,
  Bell,
  Gauge,
  Wallet,
  LineChart,
  BookOpen,
  Flower2
} from 'lucide-react';
// Logo will be loaded from main app URL
import './styles.css';

const AuthHybridEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(0);
  const [language, setLanguage] = useState('fr');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const languages = [
    { code: 'fr', name: 'FR', flag: '🇫🇷' },
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'de', name: 'DE', flag: '🇩🇪' },
    { code: 'ar', name: 'AR', flag: '🇸🇦' },
    { code: 'ko', name: 'KO', flag: '🇰🇷' },
    { code: 'zh', name: 'CN', flag: '🇨🇳' },
    { code: 'zh-TW', name: 'TW', flag: '🇹🇼' }
  ];

  // Using actual sidebar items from app.gardenflow.io
  const previews = [
    { name: 'Tableau de Bord', icon: Home },
    { name: 'Studio+', icon: Palette },
    { name: 'Tâches', icon: CheckSquare },
    { name: 'Parcelles', icon: MapPin },
    { name: 'Budget', icon: TrendingUp },
    { name: 'Inventaire', icon: PackageSearch },
    { name: 'Cultures', icon: SquareChartGantt },
    { name: 'Arbres', icon: Trees }
  ];

  // Auto-rotate previews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPreview((prev) => (prev + 1) % previews.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [previews.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const renderSkeletonPreview = () => {
    switch (currentPreview) {
      case 0: // Tableau de Bord
        return (
          <div className="h-full flex flex-col gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center justify-between">
              <div className="h-2 w-20 bg-gray-300 rounded"></div>
              <div className="flex gap-1">
                <div className="px-2 py-1 bg-blue-100 rounded">
                  <div className="h-1.5 w-8 bg-blue-300 rounded"></div>
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded">
                  <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded">
                  <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>

            {/* Top Stats Cards - Always visible */}
            <div className="grid grid-cols-4 gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`rounded p-1.5 ${
                  i === 1 ? 'bg-green-50' :
                  i === 2 ? 'bg-blue-50' :
                  i === 3 ? 'bg-purple-50' :
                  'bg-orange-50'
                }`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="h-1.5 w-10 bg-gray-200 rounded"></div>
                    <div className={`w-3 h-3 rounded ${
                      i === 1 ? 'bg-green-200' :
                      i === 2 ? 'bg-blue-200' :
                      i === 3 ? 'bg-purple-200' :
                      'bg-orange-200'
                    }`}></div>
                  </div>
                  <div className="h-2.5 w-6 bg-gray-300 rounded mb-0.5"></div>
                  <div className="h-1 w-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Main Content - Split View showing Cards and Map */}
            <div className="flex-1 grid grid-cols-2 gap-2">
              {/* Left Side - Cards View */}
              <div className="bg-white/50 rounded-lg p-2 overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="h-1.5 w-14 bg-gray-300 rounded"></div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                {/* Cards Grid */}
                <div className="grid grid-cols-2 gap-1.5 h-[calc(100%-20px)] overflow-y-auto">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-50 rounded p-1.5 h-fit">
                      {/* Card image area */}
                      <div className="w-full h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-1"></div>
                      {/* Card content */}
                      <div className="space-y-0.5">
                        <div className="h-1.5 w-full bg-gray-300 rounded"></div>
                        <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
                        <div className="flex justify-between items-center pt-0.5">
                          <div className={`h-1 w-8 rounded ${
                            i % 3 === 0 ? 'bg-green-300' :
                            i % 3 === 1 ? 'bg-orange-300' :
                            'bg-blue-300'
                          }`}></div>
                          <div className="flex gap-0.5">
                            <div className="w-2 h-2 bg-gray-200 rounded"></div>
                            <div className="w-2 h-2 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Map View */}
              <div className="bg-white/50 rounded-lg p-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="h-1.5 w-14 bg-gray-300 rounded"></div>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                {/* Map Container */}
                <div className="h-[calc(100%-20px)] relative bg-gradient-to-br from-green-50 to-blue-50 rounded overflow-hidden">
                  {/* Map grid lines */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="h-full w-full" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, #ccc 0px, transparent 1px, transparent 30px, #ccc 31px), repeating-linear-gradient(90deg, #ccc 0px, transparent 1px, transparent 30px, #ccc 31px)',
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>
                  
                  {/* Map markers/parcels - Pin style markers */}
                  <div className="absolute top-[20%] left-[15%] transform -translate-x-1/2 -translate-y-full">
                    <div className="relative">
                      <div className="w-6 h-8 bg-green-400 rounded-t-full rounded-b-lg shadow-lg border border-green-500 relative">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/80 rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-green-400"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-[40%] left-[30%] transform -translate-x-1/2 -translate-y-full">
                    <div className="relative">
                      <div className="w-6 h-8 bg-blue-400 rounded-t-full rounded-b-lg shadow-lg border border-blue-500 relative">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/80 rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-blue-400"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-[60%] right-[25%] transform -translate-x-1/2 -translate-y-full">
                    <div className="relative">
                      <div className="w-6 h-8 bg-orange-400 rounded-t-full rounded-b-lg shadow-lg border border-orange-500 relative">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/80 rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-orange-400"></div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-[20%] left-[40%] transform -translate-x-1/2 -translate-y-full">
                    <div className="relative">
                      <div className="w-5 h-7 bg-purple-400 rounded-t-full rounded-b-lg shadow-lg border border-purple-500 relative">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/80 rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[3px] border-t-purple-400"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-[30%] right-[15%] transform -translate-x-1/2 -translate-y-full">
                    <div className="relative">
                      <div className="w-6 h-8 bg-red-400 rounded-t-full rounded-b-lg shadow-lg border border-red-500 relative">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/80 rounded-full"></div>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-red-400"></div>
                    </div>
                  </div>
                  
                  {/* Map polygons/zones */}
                  <div className="absolute top-[10%] left-[10%] w-[25%] h-[20%] bg-green-200/30 border border-green-400 rounded transform rotate-6"></div>
                  <div className="absolute bottom-[30%] right-[20%] w-[30%] h-[25%] bg-blue-200/30 border border-blue-400 rounded transform -rotate-3"></div>
                  <div className="absolute top-[50%] left-[35%] w-[20%] h-[15%] bg-yellow-200/30 border border-yellow-400 rounded"></div>
                  
                  {/* Map legend */}
                  <div className="absolute bottom-2 left-2 bg-white/80 rounded p-1">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="h-1 w-8 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="h-1 w-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Map controls */}
                  <div className="absolute top-2 right-2 bg-white/80 rounded p-1">
                    <div className="space-y-1">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Studio+
        return (
          <div className="h-full flex gap-2">
            {/* Left Panel - Layers */}
            <div className="w-1/5 bg-white/50 rounded p-2">
              <div className="text-xs font-medium mb-2">
                <div className="h-2 w-10 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-1 text-xs">
                {[
                  { active: true },
                  { active: false },
                  { active: true },
                  { active: true }
                ].map((layer, i) => (
                  <div key={i} className={`flex items-center gap-1 p-1 rounded ${
                    layer.active ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <div className={`w-2 h-2 rounded ${layer.active ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded"></div>
                    <div className="w-2 h-2 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Central Canvas with Dock Tools */}
            <div className="flex-1 flex gap-2">
              {/* Canvas */}
              <div className="flex-1 bg-white/50 rounded p-2">
                <div className="h-full relative bg-gradient-to-br from-green-50 to-gray-50">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, #ccc 0px, transparent 1px, transparent 15px, #ccc 16px), repeating-linear-gradient(90deg, #ccc 0px, transparent 1px, transparent 15px, #ccc 16px)',
                    backgroundSize: '15px 15px'
                  }}></div>
                </div>
                
                {/* Multiple parcels filling the canvas */}
                {/* Large parcel top-left with right-click menu */}
                <div className="absolute top-1 left-1 w-[30%] h-[45%] border border-green-400 bg-green-100/30">
                  {/* Right-click context menu - skeleton only */}
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur rounded-lg shadow-lg border border-gray-200 p-1.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer">
                        <div className="w-2.5 h-2.5 bg-blue-400 rounded"></div>
                        <div className="h-1.5 w-12 bg-gray-300 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer">
                        <div className="w-2.5 h-2.5 bg-green-400 rounded"></div>
                        <div className="h-1.5 w-14 bg-gray-300 rounded"></div>
                      </div>
                      <div className="border-t border-gray-200 my-0.5"></div>
                      <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer">
                        <div className="w-2.5 h-2.5 bg-orange-400 rounded"></div>
                        <div className="h-1.5 w-10 bg-gray-300 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded cursor-pointer">
                        <div className="w-2.5 h-2.5 bg-red-400 rounded"></div>
                        <div className="h-1.5 w-11 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 h-full">
                    {/* Zones with crops inside */}
                    <div className="bg-blue-200/40 border border-blue-300/50">
                      <div className="grid grid-cols-2 grid-rows-2 gap-px h-full">
                        <div className="bg-orange-300/60"></div>
                        <div className="bg-orange-300/60"></div>
                        <div className="bg-orange-300/60"></div>
                        <div className="bg-orange-300/60"></div>
                      </div>
                    </div>
                    <div className="bg-yellow-200/40 border border-yellow-300/50">
                      <div className="grid grid-cols-3 gap-px h-full">
                        <div className="bg-green-400/60"></div>
                        <div className="bg-green-400/60"></div>
                        <div className="bg-green-400/60"></div>
                      </div>
                    </div>
                    <div className="bg-purple-200/40 border border-purple-300/50"></div>
                    <div className="bg-orange-200/40 border border-orange-300/50">
                      <div className="grid grid-rows-3 gap-px h-full">
                        <div className="bg-red-400/60"></div>
                        <div className="bg-red-400/60"></div>
                        <div className="bg-red-400/60"></div>
                      </div>
                    </div>
                    <div className="bg-green-200/40 border border-green-300/50"></div>
                    <div className="bg-blue-200/40 border border-blue-300/50">
                      <div className="grid grid-cols-2 gap-px h-full">
                        <div className="bg-purple-400/60"></div>
                        <div className="bg-purple-400/60"></div>
                      </div>
                    </div>
                    <div className="bg-yellow-200/40 border border-yellow-300/50"></div>
                    <div className="bg-pink-200/40 border border-pink-300/50">
                      <div className="h-full bg-yellow-400/60"></div>
                    </div>
                    <div className="bg-cyan-200/40 border border-cyan-300/50"></div>
                  </div>
                </div>

                {/* Rectangle parcel top-right */}
                <div className="absolute top-1 right-1 w-[35%] h-[25%] border border-blue-400 bg-blue-100/30">
                  <div className="grid grid-cols-4 grid-rows-2 gap-0.5 p-0.5 h-full">
                    <div className="bg-green-300/40 border border-green-400/50">
                      <div className="h-full bg-green-500/60"></div>
                    </div>
                    <div className="bg-orange-300/40 border border-orange-400/50">
                      <div className="h-full bg-orange-500/60"></div>
                    </div>
                    <div className="bg-red-300/40 border border-red-400/50">
                      <div className="h-full bg-red-500/60"></div>
                    </div>
                    <div className="bg-purple-300/40 border border-purple-400/50"></div>
                    <div className="bg-yellow-300/40 border border-yellow-400/50">
                      <div className="h-full bg-yellow-500/60"></div>
                    </div>
                    <div className="bg-blue-300/40 border border-blue-400/50"></div>
                    <div className="bg-green-300/40 border border-green-400/50">
                      <div className="h-full bg-green-500/60"></div>
                    </div>
                    <div className="bg-pink-300/40 border border-pink-400/50"></div>
                  </div>
                </div>

                {/* Square parcel middle-right */}
                <div className="absolute top-[30%] right-1 w-[25%] h-[25%] border border-purple-400 bg-purple-100/30">
                  <div className="grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5 h-full">
                    <div className="bg-orange-300/40 border border-orange-400/50">
                      <div className="grid grid-cols-2 grid-rows-2 gap-px h-full">
                        <div className="bg-orange-500/70"></div>
                        <div className="bg-orange-500/70"></div>
                        <div className="bg-orange-500/70"></div>
                        <div className="bg-orange-500/70"></div>
                      </div>
                    </div>
                    <div className="bg-green-300/40 border border-green-400/50">
                      <div className="h-full bg-green-500/60"></div>
                    </div>
                    <div className="bg-blue-300/40 border border-blue-400/50">
                      <div className="h-full bg-blue-500/60"></div>
                    </div>
                    <div className="bg-red-300/40 border border-red-400/50">
                      <div className="grid grid-rows-2 gap-px h-full">
                        <div className="bg-red-500/70"></div>
                        <div className="bg-red-500/70"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Long parcel bottom */}
                <div className="absolute bottom-1 left-1 w-[60%] h-[30%] border border-orange-400 bg-orange-100/30">
                  <div className="grid grid-cols-5 grid-rows-2 gap-0.5 p-0.5 h-full">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`${
                        i % 3 === 0 ? 'bg-green-300/40 border border-green-400/50' :
                        i % 3 === 1 ? 'bg-blue-300/40 border border-blue-400/50' :
                        'bg-yellow-300/40 border border-yellow-400/50'
                      }`}>
                        <div className={`h-full ${
                          i % 2 === 0 ? 'bg-green-500/60' : 'bg-orange-500/60'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Small square parcel bottom-right */}
                <div className="absolute bottom-1 right-1 w-[20%] h-[20%] border border-red-400 bg-red-100/30">
                  <div className="grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 h-full">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="bg-green-300/40 border border-green-400/50">
                        <div className="h-full bg-green-500/70"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center small parcel */}
                <div className="absolute top-[50%] left-[35%] w-[15%] h-[15%] border border-cyan-400 bg-cyan-100/30">
                  <div className="p-0.5 h-full">
                    <div className="h-full bg-cyan-300/50 border border-cyan-400/50">
                      <div className="grid grid-cols-2 grid-rows-2 gap-px h-full p-px">
                        <div className="bg-cyan-500/70"></div>
                        <div className="bg-cyan-500/70"></div>
                        <div className="bg-cyan-500/70"></div>
                        <div className="bg-cyan-500/70"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              
              {/* Dock Tools - Right Side */}
              <div className="bg-white/50 rounded-lg p-2 flex flex-col justify-end">
                <div className="flex gap-1">
                  {/* Tool buttons */}
                  <div className="space-y-1">
                    {/* Create Parcel Tool */}
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center cursor-pointer hover:bg-green-200">
                      <div className="w-4 h-4 bg-green-400 rounded"></div>
                    </div>
                    {/* Create Zone Tool */}
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center cursor-pointer hover:bg-blue-200">
                      <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                    </div>
                    {/* Add Crop Tool */}
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center cursor-pointer hover:bg-orange-200">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    </div>
                    {/* Divider */}
                    <div className="h-px bg-gray-300 my-1"></div>
                    {/* Select Tool */}
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-sm"></div>
                    </div>
                    {/* Move Tool */}
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                      <div className="grid grid-cols-2 grid-rows-2 gap-px">
                        <div className="w-1.5 h-1.5 bg-gray-400"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400"></div>
                      </div>
                    </div>
                    {/* Delete Tool */}
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center cursor-pointer hover:bg-red-200">
                      <div className="w-4 h-0.5 bg-red-400 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Vertical divider */}
                  <div className="w-px bg-gray-300 mx-1"></div>
                  
                  {/* Search and settings */}
                  <div className="space-y-1">
                    {/* Search */}
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center cursor-pointer hover:bg-purple-200">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400">
                        <div className="w-1 h-1 bg-purple-400 rounded-full ml-2.5 mt-2.5"></div>
                      </div>
                    </div>
                    {/* Zoom In */}
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                      <div className="relative">
                        <div className="w-4 h-0.5 bg-gray-400"></div>
                        <div className="w-0.5 h-4 bg-gray-400 absolute left-1.5 -top-1.5"></div>
                      </div>
                    </div>
                    {/* Zoom Out */}
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                      <div className="w-4 h-0.5 bg-gray-400"></div>
                    </div>
                    {/* Divider */}
                    <div className="h-px bg-gray-300 my-1"></div>
                    {/* Layers */}
                    <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center cursor-pointer hover:bg-indigo-200">
                      <div className="space-y-0.5">
                        <div className="w-4 h-0.5 bg-indigo-400"></div>
                        <div className="w-4 h-0.5 bg-indigo-400"></div>
                        <div className="w-4 h-0.5 bg-indigo-400"></div>
                      </div>
                    </div>
                    {/* Settings */}
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-400">
                        <div className="grid grid-cols-2 grid-rows-2 gap-px p-0.5">
                          <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Actions & Properties */}
            <div className="w-1/5 flex flex-col gap-2">
              {/* Quick Actions */}
              <div className="bg-white/50 rounded p-1.5">
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>

              {/* Properties */}
              <div className="bg-white/50 rounded p-2 flex-1">
                <div className="text-xs space-y-1.5">
                  <div className="h-1.5 w-12 bg-gray-300 rounded mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-1.5 w-6 bg-gray-200 rounded"></div>
                    <div className="h-1.5 w-8 bg-green-300 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-1.5 w-6 bg-gray-200 rounded"></div>
                    <div className="h-1.5 w-8 bg-blue-300 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-1.5 w-6 bg-gray-200 rounded"></div>
                    <div className="h-1.5 w-8 bg-orange-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Tâches
        return (
          <div className="h-full flex flex-col gap-2">
            {/* Top Stats */}
            <div className="flex gap-2">
              <div className="flex-1 bg-blue-50 rounded p-1.5">
                <div className="flex justify-between items-center">
                  <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
                  <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
                </div>
                <div className="h-2 w-6 bg-blue-500 rounded mt-1"></div>
              </div>
              <div className="flex-1 bg-orange-50 rounded p-1.5">
                <div className="flex justify-between items-center">
                  <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
                  <div className="h-3 w-3 bg-orange-400 rounded-full"></div>
                </div>
                <div className="h-2 w-6 bg-orange-500 rounded mt-1"></div>
              </div>
              <div className="flex-1 bg-green-50 rounded p-1.5">
                <div className="flex justify-between items-center">
                  <div className="h-1.5 w-8 bg-gray-300 rounded"></div>
                  <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="h-2 w-6 bg-green-500 rounded mt-1"></div>
              </div>
            </div>

            {/* Task List */}
            <div className="flex-1 bg-white/50 rounded-lg p-2 overflow-auto">
              <div className="space-y-1.5">
                {[
                  { priority: 'high', status: 'progress' },
                  { priority: 'medium', status: 'todo' },
                  { priority: 'low', status: 'done' },
                  { priority: 'high', status: 'todo' },
                  { priority: 'medium', status: 'progress' },
                  { priority: 'low', status: 'todo' }
                ].map((task, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded p-1.5">
                    {/* Checkbox */}
                    <div className={`w-3 h-3 rounded border-2 ${
                      task.status === 'done' ? 'bg-green-400 border-green-400' : 'border-gray-300'
                    }`}></div>
                    
                    {/* Priority indicator */}
                    <div className={`w-1 h-4 rounded ${
                      task.priority === 'high' ? 'bg-red-400' :
                      task.priority === 'medium' ? 'bg-orange-400' :
                      'bg-blue-400'
                    }`}></div>
                    
                    {/* Task title */}
                    <div className="flex-1">
                      <div className="h-1.5 w-24 bg-gray-300 rounded mb-0.5"></div>
                      <div className="h-1 w-16 bg-gray-200 rounded"></div>
                    </div>
                    
                    {/* Assignee */}
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    
                    {/* Due date */}
                    <div className="h-1.5 w-10 bg-gray-200 rounded"></div>
                    
                    {/* Status badge */}
                    <div className={`h-2 w-8 rounded ${
                      task.status === 'done' ? 'bg-green-200' :
                      task.status === 'progress' ? 'bg-blue-200' :
                      'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-1">
              <div className="flex-1 h-6 bg-green-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
              </div>
              <div className="flex-1 h-6 bg-blue-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
              </div>
              <div className="flex-1 h-6 bg-gray-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        );

      case 3: // Parcelles  
        return (
          <div className="h-full flex flex-col gap-2">
            {/* Search Bar */}
            <div className="bg-white/50 rounded-lg p-2">
              <div className="flex gap-2">
                <div className="flex-1 h-3 bg-gray-200 rounded"></div>
                <div className="w-16 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Parcels Cards Grid */}
            <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((parcelId) => (
                  <div key={parcelId} className="bg-white/50 rounded-lg p-2">
                    {/* Card Header */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-2 w-20 bg-gray-300 rounded"></div>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>

                    {/* Zones List */}
                    <div className="space-y-1 mb-2">
                      {[1, 2, 3].map((zoneId) => (
                        <div key={zoneId} className="bg-gray-50 rounded p-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-blue-300 rounded"></div>
                            <div className="h-1.5 w-16 bg-gray-200 rounded"></div>
                          </div>
                          {/* Zone details like form fields */}
                          <div className="pl-4 space-y-0.5">
                            <div className="flex gap-1">
                              <div className="h-1 w-8 bg-gray-200 rounded"></div>
                              <div className="h-1 w-12 bg-gray-300 rounded"></div>
                            </div>
                            <div className="flex gap-1">
                              <div className="h-1 w-6 bg-gray-200 rounded"></div>
                              <div className="h-1 w-10 bg-green-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Card Footer Stats */}
                    <div className="flex justify-between pt-1 border-t border-gray-200">
                      <div className="flex gap-2">
                        <div className="h-1.5 w-8 bg-gray-200 rounded"></div>
                        <div className="h-1.5 w-6 bg-green-300 rounded"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-1.5 w-8 bg-gray-200 rounded"></div>
                        <div className="h-1.5 w-6 bg-blue-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Budget
        return (
          <div className="h-full flex flex-col gap-2">
            {/* Top Financial Stats */}
            <div className="grid grid-cols-4 gap-1">
              <div className="bg-green-50 rounded p-1">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="h-1 w-8 bg-gray-200 rounded"></div>
                  <div className="w-2 h-2 bg-green-300 rounded"></div>
                </div>
                <div className="h-3 w-10 bg-green-400 rounded mb-0.5"></div>
                <div className="h-1 w-6 bg-green-200 rounded"></div>
              </div>
              <div className="bg-red-50 rounded p-1">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="h-1 w-8 bg-gray-200 rounded"></div>
                  <div className="w-2 h-2 bg-red-300 rounded"></div>
                </div>
                <div className="h-3 w-10 bg-red-400 rounded mb-0.5"></div>
                <div className="h-1 w-6 bg-red-200 rounded"></div>
              </div>
              <div className="bg-blue-50 rounded p-1">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="h-1 w-8 bg-gray-200 rounded"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded"></div>
                </div>
                <div className="h-3 w-10 bg-blue-400 rounded mb-0.5"></div>
                <div className="h-1 w-6 bg-blue-200 rounded"></div>
              </div>
              <div className="bg-purple-50 rounded p-1">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="h-1 w-8 bg-gray-200 rounded"></div>
                  <div className="w-2 h-2 bg-purple-300 rounded"></div>
                </div>
                <div className="h-3 w-10 bg-purple-400 rounded mb-0.5"></div>
                <div className="h-1 w-6 bg-purple-200 rounded"></div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-3 gap-2">
              {/* Left - Crop Revenue Breakdown */}
              <div className="bg-white/50 rounded-lg p-2">
                <div className="h-2 w-16 bg-gray-300 rounded mb-2"></div>
                {/* Crop list with revenue */}
                <div className="space-y-1">
                  {[
                    { crop: 'Tomates', revenue: 75, color: 'red' },
                    { crop: 'Carottes', revenue: 60, color: 'orange' },
                    { crop: 'Salades', revenue: 45, color: 'green' },
                    { crop: 'Fraises', revenue: 80, color: 'pink' },
                    { crop: 'Basilic', revenue: 30, color: 'green' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className={`w-1 h-4 bg-${item.color}-400 rounded`}></div>
                      <div className="flex-1">
                        <div className="h-1 w-12 bg-gray-200 rounded mb-0.5"></div>
                        <div className="h-3 bg-gray-100 rounded relative overflow-hidden">
                          <div 
                            className={`absolute left-0 top-0 h-full bg-${item.color}-300`}
                            style={{ width: `${item.revenue}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="h-2 w-6 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center - Monthly Cash Flow Chart */}
              <div className="bg-white/50 rounded-lg p-2">
                <div className="h-2 w-20 bg-gray-300 rounded mb-2"></div>
                {/* Dual bar chart - Income vs Expenses */}
                <div className="h-full flex items-end gap-1 pb-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-1 flex gap-0.5 items-end">
                      <div className="flex-1 flex flex-col justify-end">
                        <div 
                          className="w-full bg-green-400 rounded-t"
                          style={{ height: `${Math.random() * 60 + 20}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 flex flex-col justify-end">
                        <div 
                          className="w-full bg-red-400 rounded-t"
                          style={{ height: `${Math.random() * 50 + 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Month labels */}
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-1">
                      <div className="h-1 w-full bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Expense Categories Pie Chart */}
              <div className="bg-white/50 rounded-lg p-2">
                <div className="h-2 w-16 bg-gray-300 rounded mb-2"></div>
                {/* Pie chart skeleton */}
                <div className="flex items-center justify-center h-24">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-300 via-blue-300 via-orange-300 to-purple-300"></div>
                    <div className="absolute inset-2 rounded-full bg-white/90"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-3 w-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {[
                    { color: 'green' },
                    { color: 'blue' },
                    { color: 'orange' },
                    { color: 'purple' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className={`w-2 h-2 bg-${item.color}-400 rounded`}></div>
                      <div className="h-1 w-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom - Recent Transactions Table */}
            <div className="bg-white/50 rounded-lg p-2">
              <div className="h-1.5 w-20 bg-gray-300 rounded mb-1"></div>
              <div className="space-y-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-1 bg-gray-50 rounded">
                    <div className={`w-1 h-3 rounded ${
                      i % 2 === 0 ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <div className="h-1 w-8 bg-gray-200 rounded"></div>
                    <div className="flex-1 h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 w-10 bg-gray-200 rounded"></div>
                    <div className={`h-1.5 w-8 rounded ${
                      i % 2 === 0 ? 'bg-green-300' : 'bg-red-300'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Inventaire
        return (
          <div className="h-full flex flex-col gap-2">
            {/* Top Stats Bar */}
            <div className="grid grid-cols-4 gap-1">
              <div className="bg-green-50 rounded p-1">
                <div className="h-1.5 w-6 bg-gray-200 rounded mb-0.5"></div>
                <div className="h-2 w-4 bg-green-300 rounded"></div>
              </div>
              <div className="bg-orange-50 rounded p-1">
                <div className="h-1.5 w-6 bg-gray-200 rounded mb-0.5"></div>
                <div className="h-2 w-4 bg-orange-300 rounded"></div>
              </div>
              <div className="bg-blue-50 rounded p-1">
                <div className="h-1.5 w-6 bg-gray-200 rounded mb-0.5"></div>
                <div className="h-2 w-4 bg-blue-300 rounded"></div>
              </div>
              <div className="bg-red-50 rounded p-1">
                <div className="h-1.5 w-6 bg-gray-200 rounded mb-0.5"></div>
                <div className="h-2 w-4 bg-red-300 rounded"></div>
              </div>
            </div>

            {/* Items Grid - Cards with form-like skeleton */}
            <div className="flex-1 bg-white/50 rounded-lg p-2">
              <div className="grid grid-cols-4 gap-1.5 h-full">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded p-1.5 flex flex-col">
                    {/* Image skeleton area */}
                    <div className="w-full h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-1.5"></div>
                    
                    {/* Form-like fields */}
                    <div className="space-y-1 flex-1">
                      {/* Field 1 - Name label/input */}
                      <div>
                        <div className="h-1 w-8 bg-gray-300 rounded mb-0.5"></div>
                        <div className="h-2 w-full bg-gray-200 rounded"></div>
                      </div>
                      
                      {/* Field 2 - Category */}
                      <div>
                        <div className="h-1 w-6 bg-gray-300 rounded mb-0.5"></div>
                        <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                      </div>
                      
                      {/* Field 3 - Quantity with number */}
                      <div className="flex gap-1">
                        <div className="flex-1">
                          <div className="h-1 w-5 bg-gray-300 rounded mb-0.5"></div>
                          <div className="h-2 w-full bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-1/3">
                          <div className="h-1 w-3 bg-gray-300 rounded mb-0.5"></div>
                          <div className={`h-2 w-full rounded ${
                            i % 3 === 0 ? 'bg-green-200' : 
                            i % 3 === 1 ? 'bg-orange-200' : 
                            'bg-red-200'
                          }`}></div>
                        </div>
                      </div>
                      
                      {/* Field 4 - Status indicator */}
                      <div className="flex items-center gap-1">
                        <div className={`w-1 h-1 rounded-full ${
                          i % 3 === 0 ? 'bg-green-400' : 
                          i % 3 === 1 ? 'bg-orange-400' : 
                          'bg-red-400'
                        }`}></div>
                        <div className="h-1 w-10 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6: // Cultures (Gantt View)
        return (
          <div className="h-full flex flex-col">
            {/* Gantt Chart Skeleton */}
            <div className="flex-1 bg-white/50 rounded-lg p-2 flex flex-col">
              {/* Timeline Header */}
              <div className="flex gap-1 mb-2 flex-shrink-0">
                <div className="w-24">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1 flex gap-1">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="flex-1">
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Gantt Rows - All rows have timeline bars */}
              <div className="flex-1 flex flex-col gap-1">
                {/* Parcel 1 */}
                <div className="flex gap-1 flex-1">
                  <div className="w-24 bg-blue-100 rounded p-1 flex items-center">
                    <div className="h-3 w-14 bg-blue-300 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-5 bg-blue-200 rounded" style={{marginLeft: '5%', width: '85%'}}></div>
                  </div>
                </div>
                
                {/* Zone 1 */}
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-2 flex items-center">
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-5 bg-gray-300 rounded" style={{marginLeft: '5%', width: '60%'}}></div>
                  </div>
                </div>
                
                {/* Crops in Zone 1 with Tooltip */}
                <div className="flex gap-1 flex-1 relative">
                  <div className="w-24 pl-4 flex items-center">
                    <div className="h-3 w-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center relative">
                    <div className="h-5 bg-orange-300 rounded" style={{marginLeft: '10%', width: '25%'}}></div>
                    {/* Tooltip appearing over this gantt bar - skeleton only */}
                    <div className="absolute top-[-40px] left-[15%] z-10 bg-gray-900/95 backdrop-blur rounded-lg shadow-xl p-2.5 whitespace-nowrap">
                      <div className="h-2 w-20 bg-gray-400 rounded mb-2"></div>
                      <div className="space-y-1">
                        <div className="flex gap-3">
                          <div className="h-1.5 w-8 bg-gray-500 rounded"></div>
                          <div className="h-1.5 w-12 bg-gray-300 rounded"></div>
                        </div>
                        <div className="flex gap-3">
                          <div className="h-1.5 w-10 bg-gray-500 rounded"></div>
                          <div className="h-1.5 w-10 bg-gray-300 rounded"></div>
                        </div>
                        <div className="flex gap-3">
                          <div className="h-1.5 w-12 bg-gray-500 rounded"></div>
                          <div className="h-1.5 w-8 bg-green-400 rounded"></div>
                        </div>
                      </div>
                      {/* Tooltip arrow pointing down */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/95 transform rotate-45"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-4 flex items-center">
                    <div className="h-3 w-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-5 bg-green-300 rounded" style={{marginLeft: '25%', width: '20%'}}></div>
                  </div>
                </div>
                
                {/* Zone 2 */}
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-2 flex items-center">
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-5 bg-gray-300 rounded" style={{marginLeft: '35%', width: '45%'}}></div>
                  </div>
                </div>
                
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-4 flex items-center">
                    <div className="h-3 w-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-5 bg-purple-300 rounded" style={{marginLeft: '35%', width: '30%'}}></div>
                  </div>
                </div>
                
                {/* Parcel 2 */}
                <div className="flex gap-1 flex-1">
                  <div className="w-24 bg-green-100 rounded p-1 flex items-center">
                    <div className="h-3 w-14 bg-green-300 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-5 bg-green-200 rounded" style={{marginLeft: '15%', width: '70%'}}></div>
                  </div>
                </div>
                
                {/* Zone 3 */}
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-2 flex items-center">
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-5 bg-gray-300 rounded" style={{marginLeft: '20%', width: '55%'}}></div>
                  </div>
                </div>
                
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-4 flex items-center">
                    <div className="h-3 w-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-5 bg-red-300 rounded" style={{marginLeft: '15%', width: '40%'}}></div>
                  </div>
                </div>
                
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-4 flex items-center">
                    <div className="h-3 w-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-5 bg-yellow-300 rounded" style={{marginLeft: '45%', width: '25%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 7: // Arbres (Gantt View)
        return (
          <div className="h-full flex flex-col">
            {/* Tree Season Gantt Skeleton */}
            <div className="flex-1 bg-white/50 rounded-lg p-2 flex flex-col">
              {/* Season Headers */}
              <div className="flex gap-1 mb-2 flex-shrink-0">
                <div className="w-24">
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-1">
                  <div className="bg-green-50 rounded p-1">
                    <div className="h-3 w-full bg-green-200 rounded"></div>
                  </div>
                  <div className="bg-yellow-50 rounded p-1">
                    <div className="h-3 w-full bg-yellow-200 rounded"></div>
                  </div>
                  <div className="bg-orange-50 rounded p-1">
                    <div className="h-3 w-full bg-orange-200 rounded"></div>
                  </div>
                  <div className="bg-blue-50 rounded p-1">
                    <div className="h-3 w-full bg-blue-200 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Tree Activity Rows - Fills full height */}
              <div className="flex-1 flex flex-col gap-1">
                {/* Zone level */}
                <div className="flex gap-1 flex-1">
                  <div className="w-24 bg-emerald-100 rounded p-1 flex items-center">
                    <div className="h-3 w-14 bg-emerald-300 rounded"></div>
                  </div>
                  <div className="flex-1"></div>
                </div>
                
                {/* Tree rows with seasonal activities */}
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-2 flex items-center">
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-1">
                    <div className="bg-green-300 rounded"></div>
                    <div className="bg-yellow-300 rounded"></div>
                    <div className="bg-orange-300 rounded"></div>
                    <div className="bg-gray-100 rounded"></div>
                  </div>
                </div>
                
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-2 flex items-center">
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-1">
                    <div className="bg-green-300 rounded"></div>
                    <div className="bg-gray-100 rounded"></div>
                    <div className="bg-orange-300 rounded"></div>
                    <div className="bg-blue-300 rounded"></div>
                  </div>
                </div>
                
                {/* Another zone */}
                <div className="flex gap-1 flex-1">
                  <div className="w-24 bg-emerald-100 rounded p-1 flex items-center">
                    <div className="h-3 w-14 bg-emerald-300 rounded"></div>
                  </div>
                  <div className="flex-1"></div>
                </div>
                
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-2 flex items-center">
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-1">
                    <div className="bg-gray-100 rounded"></div>
                    <div className="bg-yellow-300 rounded"></div>
                    <div className="bg-orange-300 rounded"></div>
                    <div className="bg-gray-100 rounded"></div>
                  </div>
                </div>
                
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-2 flex items-center">
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-1">
                    <div className="bg-green-300 rounded"></div>
                    <div className="bg-yellow-300 rounded"></div>
                    <div className="bg-gray-100 rounded"></div>
                    <div className="bg-blue-300 rounded"></div>
                  </div>
                </div>
                
                {/* Third zone */}
                <div className="flex gap-1 flex-1">
                  <div className="w-24 bg-emerald-100 rounded p-1 flex items-center">
                    <div className="h-3 w-14 bg-emerald-300 rounded"></div>
                  </div>
                  <div className="flex-1"></div>
                </div>
                
                <div className="flex gap-1 flex-1">
                  <div className="w-24 pl-2 flex items-center">
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-1">
                    <div className="bg-green-300 rounded"></div>
                    <div className="bg-gray-100 rounded"></div>
                    <div className="bg-orange-300 rounded"></div>
                    <div className="bg-blue-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-hybrid-enhanced min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Auth Form - Reduced width */}
      <div className="w-full lg:w-2/5 bg-white flex flex-col h-screen">
        {/* Header */}
        <header className="p-4 lg:p-6 flex justify-end items-center flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.name}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>

              {showLanguageMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 min-w-[120px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors text-sm"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-gray-700">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Toggle Button */}
            {isLogin ? (
              <button
                onClick={() => setIsLogin(false)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium text-sm hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                S'inscrire
              </button>
            ) : (
              <button
                onClick={() => setIsLogin(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-medium transition-colors text-sm px-4 py-2"
              >
                <LogIn className="w-4 h-4" />
                Se connecter
              </button>
            )}
          </div>
        </header>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Link to="/" className="inline-block">
                <img 
                  src="http://localhost:5175/src/assets/logo-gardenflow.webp" 
                  alt="GardenFlow" 
                  className="h-24 w-auto object-contain" 
                />
              </Link>
            </div>
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                {isLogin ? 'Connexion' : 'Inscription'}
              </h1>
            </div>

            {isLogin ? (
              // Login Form
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Entrez votre e-mail"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Entrez votre mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Se souvenir de moi
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-green-600 hover:text-green-500 font-medium transition-colors duration-200"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Se connecter
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            ) : (
              // Signup Form
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Dupont"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Créez un mot de passe fort"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                      placeholder="Confirmez votre mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-0.5"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                    J'accepte les{' '}
                    <Link to="/terms" className="text-green-600 hover:text-green-500">
                      Conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to="/privacy" className="text-green-600 hover:text-green-500">
                      Politique de confidentialité
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Créer un compte
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                En vous connectant, vous acceptez nos{' '}
                <Link to="/terms" className="text-green-600 hover:text-green-500">
                  Conditions d'utilisation
                </Link>{' '}
                et{' '}
                <Link to="/privacy" className="text-green-600 hover:text-green-500">
                  Politique de confidentialité
                </Link>
              </p>
            </div>

            {/* Toggle */}
            <div className="mt-4 text-center">
              <span className="text-gray-600">
                {isLogin ? "Pas encore de compte? " : "Déjà un compte? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                {isLogin ? "S'inscrire" : 'Se connecter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Combined Glassy Card - Expanded width */}
      <div className="hidden lg:block lg:w-3/5 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Single Glassy Container - Full Width */}
        <div className="h-full flex items-center justify-center p-4">
          <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/20 rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
            {/* Header Section with Features */}
            <div className="p-5 bg-gradient-to-b from-white/50 to-white/30 backdrop-blur-xl border-b border-white/30">
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3 whitespace-nowrap">
                GardenFlow - La plateforme intuitive tout-en-un pour jardiner comme un pro
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {/* Conception & Visualisation */}
                <div className="flex items-center gap-2 backdrop-blur-2xl bg-white/40 rounded-xl p-2 border border-white/50 shadow-sm hover:bg-white/50 transition-all">
                  <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg p-1.5 shadow-lg">
                    <Pencil className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">Conception et design 2D</div>
                    <div className="text-[11px] text-gray-600 truncate">Dessinez, organisez, optimisez vos espaces</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 backdrop-blur-2xl bg-white/40 rounded-xl p-2 border border-white/50 shadow-sm hover:bg-white/50 transition-all">
                  <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg p-1.5 shadow-lg">
                    <Layout className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">Tableau de bord détaillé</div>
                    <div className="text-[11px] text-gray-600 truncate">Paysager, horticole, potager, verger</div>
                  </div>
                </div>
                
                {/* Planification & Optimisation */}
                <div className="flex items-center gap-2 backdrop-blur-2xl bg-white/40 rounded-xl p-2 border border-white/50 shadow-sm hover:bg-white/50 transition-all">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-1.5 shadow-lg">
                    <Calendar className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">Planification des cultures</div>
                    <div className="text-[11px] text-gray-600 truncate">Optimisez rotations, associations et traçabilité</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 backdrop-blur-2xl bg-white/40 rounded-xl p-2 border border-white/50 shadow-sm hover:bg-white/50 transition-all">
                  <div className="bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg p-1.5 shadow-lg">
                    <GitBranch className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">Associations optimisées</div>
                    <div className="text-[11px] text-gray-600 truncate">Recommandations pour vos cultures</div>
                  </div>
                </div>
                
                {/* Gestion & Pilotage */}
                <div className="flex items-center gap-2 backdrop-blur-2xl bg-white/40 rounded-xl p-2 border border-white/50 shadow-sm hover:bg-white/50 transition-all">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-1.5 shadow-lg">
                    <Gauge className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">Pilotage en temps réel</div>
                    <div className="text-[11px] text-gray-600 truncate">Tâches, alertes et rappels automatisés</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 backdrop-blur-2xl bg-white/40 rounded-xl p-2 border border-white/50 shadow-sm hover:bg-white/50 transition-all">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-1.5 shadow-lg">
                    <Wallet className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">Suivi budgétaire temps réel</div>
                    <div className="text-[11px] text-gray-600 truncate">Maîtrisez vos coûts et revenus instantanément</div>
                  </div>
                </div>
                
                {/* Analyse & Ressources */}
                <div className="flex items-center gap-2 backdrop-blur-2xl bg-white/40 rounded-xl p-2 border border-white/50 shadow-sm hover:bg-white/50 transition-all">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-1.5 shadow-lg">
                    <LineChart className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">Analyse de rendement</div>
                    <div className="text-[11px] text-gray-600 truncate">Suivez et améliorez vos performances</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 backdrop-blur-2xl bg-white/40 rounded-xl p-2 border border-white/50 shadow-sm hover:bg-white/50 transition-all">
                  <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg p-1.5 shadow-lg">
                    <BookOpen className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">Bibliothèque végétale</div>
                    <div className="text-[11px] text-gray-600 truncate">Catalogue et conseils de culture (potager, fleurs, arbres)</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview Section */}
            <div className="p-4 bg-gradient-to-b from-white/25 to-white/15 backdrop-blur-xl">
              {/* Glassy Tab Navigation - Single Row */}
              <div className="flex items-center gap-1 mb-3 overflow-x-auto">
                {previews.map((preview, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPreview(index)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg backdrop-blur-2xl transition-all whitespace-nowrap flex-shrink-0 ${
                      currentPreview === index
                        ? 'bg-white/70 shadow-lg text-green-600 font-semibold border border-white/70'
                        : 'bg-white/25 text-gray-600 hover:bg-white/35 border border-white/20'
                    }`}
                  >
                    <preview.icon className="w-4 h-4" />
                    <div className="h-2 w-14 bg-gray-400 rounded"></div>
                  </button>
                ))}
              </div>
              
              {/* Skeleton Preview with Glassy Effect - Increased Height */}
              <div className="bg-white/40 backdrop-blur-2xl rounded-xl shadow-xl p-4 h-[400px] overflow-hidden border border-white/60">
                {renderSkeletonPreview()}
              </div>
              
              {/* Navigation Dots */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {previews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPreview(index)}
                    className={`h-1.5 rounded-full transition-all shadow-sm backdrop-blur ${
                      currentPreview === index
                        ? 'w-6 bg-gradient-to-r from-green-500 to-green-600 shadow-green-400/50'
                        : 'w-1.5 bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Prototypes Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors z-50"
      >
        Back to Prototypes
      </button>
    </div>
  );
};

export default AuthHybridEnhanced;