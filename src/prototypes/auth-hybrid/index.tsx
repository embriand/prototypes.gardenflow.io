import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf,
  Globe,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  TrendingUp,
  Calendar,
  Package,
  Users,
  BarChart3,
  Sprout,
  Sun,
  Cloud,
  ChevronDown
} from 'lucide-react';
import './styles.css';

const AuthHybrid: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'fr', name: 'FR', flag: '🇫🇷' },
    { code: 'de', name: 'DE', flag: '🇩🇪' },
    { code: 'es', name: 'ES', flag: '🇪🇸' },
    { code: 'zh', name: 'CN', flag: '🇨🇳' },
  ];

  return (
    <div className="auth-hybrid min-h-screen flex">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2.5 rounded-xl shadow-lg">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              GardenFlow
            </span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 font-medium">
                {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showLanguageMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLanguageMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <span>{lang.flag}</span>
                    <span className="text-gray-700">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {isLogin ? 'Welcome back' : 'Get started'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Enter your credentials to access your garden dashboard' 
                  : 'Create your account and start growing smarter'}
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded border-gray-300" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-green-600 hover:text-green-700">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
                <button className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Toggle */}
            <div className="mt-8 text-center">
              <span className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <a href="https://gardenflow.io" className="hover:text-gray-700">Back to website</a>
          <span className="mx-2">•</span>
          <a href="#" className="hover:text-gray-700">Terms</a>
          <span className="mx-2">•</span>
          <a href="#" className="hover:text-gray-700">Privacy</a>
        </div>
      </div>

      {/* Right Side - Animated Dashboard Preview */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-12 relative overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Preview Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Garden Dashboard Awaits</h2>
            <p className="text-gray-600">See what you can achieve with GardenFlow</p>
          </div>

          {/* Animated Dashboard Preview */}
          <div className="flex-1 relative">
            {/* Skeleton Dashboard */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 h-full">
              {/* Mini Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 skeleton-pulse">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-200 rounded-lg p-2">
                      <Sprout className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="h-3 w-16 bg-green-200 rounded mb-1"></div>
                      <div className="h-5 w-12 bg-green-300 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 skeleton-pulse">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-200 rounded-lg p-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="h-3 w-16 bg-blue-200 rounded mb-1"></div>
                      <div className="h-5 w-12 bg-blue-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 skeleton-pulse">
                <div className="h-3 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="flex items-end gap-2 h-32">
                  <div className="flex-1 bg-green-200 rounded-t" style={{ height: '60%' }}></div>
                  <div className="flex-1 bg-green-300 rounded-t" style={{ height: '80%' }}></div>
                  <div className="flex-1 bg-green-200 rounded-t" style={{ height: '45%' }}></div>
                  <div className="flex-1 bg-green-400 rounded-t" style={{ height: '90%' }}></div>
                  <div className="flex-1 bg-green-300 rounded-t" style={{ height: '70%' }}></div>
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-3">
                <div className="h-3 w-20 bg-gray-200 rounded mb-3"></div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg skeleton-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 w-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="w-12 h-6 bg-green-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-8 right-8 bg-white rounded-lg shadow-lg p-3 animate-float">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">24°C</span>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 bg-white rounded-lg shadow-lg p-3 animate-float-delayed">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Rain Tomorrow</span>
              </div>
            </div>

            <div className="absolute top-1/2 right-12 bg-white rounded-lg shadow-lg p-3 animate-float">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">5 Tasks</span>
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

export default AuthHybrid;