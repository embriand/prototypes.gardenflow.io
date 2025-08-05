import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginComponent: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login attempted with:', formData);
      
      // Show success state
      alert('Login successful! (This is a prototype)');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mb-8 p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Login Component
        </h1>
        <p className="text-slate-600">
          Modern authentication interface with validation, password visibility toggle, and loading states
        </p>
        
        {/* Feature highlights */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Key Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Form validation with error messages</li>
            <li>• Password visibility toggle</li>
            <li>• Loading states and animations</li>
            <li>• Remember me functionality</li>
            <li>• Responsive design</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl shadow-xl w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl inline-block mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              GardenFlow
            </h2>
            <p className="text-slate-600 mt-2">Connexion à votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Saisir votre email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-300 bg-white/50'
                  }`}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Saisir votre mot de passe"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-300 bg-white/50'
                  }`}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Se souvenir de moi
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors"
                disabled={isLoading}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Vous n'avez pas de compte ?{' '}
            <button className="font-medium text-green-600 hover:text-green-500 transition-colors">
              Créer un compte
            </button>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Données de test :</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>Email:</strong> demo@gardenflow.io</p>
              <p><strong>Mot de passe:</strong> demo123</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  email: 'demo@gardenflow.io',
                  password: 'demo123',
                  rememberMe: true
                });
              }}
              className="mt-2 text-xs text-green-600 hover:text-green-700 font-medium"
              disabled={isLoading}
            >
              Remplir automatiquement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;