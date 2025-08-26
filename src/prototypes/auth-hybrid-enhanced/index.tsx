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

// Import preview components
import DashboardPreview from './components/previews/DashboardPreview';
import StudioPreview from './components/previews/StudioPreview';
import TasksPreview from './components/previews/TasksPreview';
import ParcelsPreview from './components/previews/ParcelsPreview';
import BudgetPreview from './components/previews/BudgetPreview';
import InventoryPreview from './components/previews/InventoryPreview';
import CulturesPreview from './components/previews/CulturesPreview';
import TreesPreview from './components/previews/TreesPreview';

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
        return <DashboardPreview />;
      case 1: // Studio+
        return <StudioPreview />;
      case 2: // Tâches
        return <TasksPreview />;
      case 3: // Parcelles  
        return <ParcelsPreview />;
      case 4: // Budget
        return <BudgetPreview />;
      case 5: // Inventaire
        return <InventoryPreview />;
      case 6: // Cultures (Gantt View)
        return <CulturesPreview />;
      case 7: // Arbres (Gantt View)
        return <TreesPreview />;
      default:
        return <DashboardPreview />;
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