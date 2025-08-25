import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Calendar, 
  Users, 
  BarChart3, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Star,
  Globe,
  Smartphone,
  Shield,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Heart,
  Home
} from 'lucide-react';
import './styles.css';

const LandingPageNoAuth: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Smart Crop Planning',
      description: 'Plan your garden with AI-powered recommendations and seasonal optimization.'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Intelligent Scheduling',
      description: 'Never miss important gardening tasks with automated reminders and timeline management.'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Garden Analytics',
      description: 'Track your garden performance with detailed insights and harvest predictions.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Garden',
      description: 'Connect with fellow gardeners and share knowledge in our thriving community.'
    }
  ];

  const benefits = [
    'Increase organic yield by up to 40%',
    'Reduce water usage with smart irrigation',
    'Perfect seasonal planning every time',
    'Optimize companion planting strategies'
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: 'Urban Gardener',
      content: 'GardenFlow transformed my small balcony into a productive garden. The AI recommendations are spot-on!',
      rating: 5
    },
    {
      name: "Jean Martin",
      role: 'Professional Farmer',
      content: 'The crop rotation feature saved me from many mistakes. My harvest has never been better.',
      rating: 5
    }
  ];

  const navigationItems = [
    { href: '#features', label: 'Features' },
    { href: '#benefits', label: 'Benefits' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#pricing', label: 'Pricing' }
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="landing-page-noauth min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Back to Prototypes Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 right-4 z-[60] bg-white/90 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
      >
        <Home className="w-4 h-4" />
        <span>Back to Prototypes</span>
      </button>
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl group-hover:shadow-lg transition-all duration-300">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                GardenFlow
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Demo Badge */}
            <div className="hidden md:flex items-center">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Demo Version - No Auth
              </span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
              <div className="px-4 py-6 space-y-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block text-gray-700 hover:text-green-600 font-medium py-2 transition-colors duration-200"
                    onClick={(e) => scrollToSection(e, item.href)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block">
                    Demo Version
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Grow Smarter with
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> GardenFlow</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The AI-powered garden management platform that helps you plan, track, and optimize your crops for maximum yield and sustainability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                Explore Demo
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-green-200 hover:border-green-300 text-green-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed for gardeners of all levels, from beginners to professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-3 w-fit mb-4 text-green-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Transform Your Garden Results
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of gardeners who have revolutionized their growing experience with GardenFlow.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <Globe className="w-8 h-8" />
                  <Smartphone className="w-8 h-8" />
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Trusted Worldwide
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-green-100">Active Gardeners</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-green-100">Crops Managed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-green-100">Satisfaction Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">25+</div>
                    <div className="text-green-100">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Gardeners Say
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real gardeners using GardenFlow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your garden.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for home gardeners</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Up to 10 plants</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Basic planning tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Community access</span>
                </li>
              </ul>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-8 shadow-xl text-white transform scale-105">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold w-fit mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-green-100 mb-6">For serious gardeners</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€9</span>
                <span className="text-green-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Unlimited plants</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>AI recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button className="w-full bg-white text-green-600 hover:bg-green-50 py-3 rounded-lg font-semibold transition-colors">
                Start Pro Trial
              </button>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
              <p className="text-gray-600 mb-6">For farms & professionals</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Custom integrations</span>
                </li>
              </ul>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Garden?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the power of smart gardening with our demo.
          </p>
          <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-5 rounded-xl font-semibold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-3">
            Try Demo Now
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">GardenFlow</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                The AI-powered garden management platform helping gardeners worldwide grow smarter, more sustainable crops.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <a href="mailto:contact@gardenflow.io" className="text-gray-300 hover:text-white transition-colors">
                    contact@gardenflow.io
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Press Kit</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Investors</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Send Feedback</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">GDPR Compliance</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="max-w-md mx-auto text-center">
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-300 mb-6">
                Get the latest gardening tips and product updates delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-gray-400 text-sm">
                <p className="flex items-center gap-1">
                  © 2024 GardenFlow. All rights reserved.
                  <span className="flex items-center gap-1 ml-2">
                    Made with <Heart className="w-4 h-4 text-red-500" /> for gardeners worldwide
                  </span>
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm hidden sm:block">Follow us:</span>
                <div className="flex gap-3">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform">
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Demo Notice */}
            <div className="mt-4 pt-4 border-t border-gray-800 text-center">
              <p className="text-purple-400 text-sm font-medium">
                🎨 Demo Version - No Authentication Required - Prototype Environment
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageNoAuth;