import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Cloud, Calendar, Sparkles, ChevronLeft, Home, Settings } from 'lucide-react';

// Types
interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
  cards?: CardData[];
}

interface CardData {
  type: 'weather' | 'task' | 'article' | 'summary';
  data: any;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

interface TaskData {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  tags: string[];
}

interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  imageUrl?: string;
  tags: string[];
}

// Mock Services
const mockWeatherService = {
  getCurrentWeather: async (): Promise<WeatherData> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      forecast: [
        { day: 'Tomorrow', high: 24, low: 18, condition: 'Sunny' },
        { day: 'Thursday', high: 23, low: 17, condition: 'Cloudy' },
        { day: 'Friday', high: 25, low: 19, condition: 'Partly Cloudy' }
      ]
    };
  }
};

const mockTaskService = {
  getTasks: async (): Promise<TaskData[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      {
        id: '1',
        title: 'Water tomato plants',
        description: 'Morning watering scheduled for greenhouse tomatoes',
        priority: 'high',
        dueDate: 'Today, 8:00 AM',
        status: 'pending',
        tags: ['watering', 'greenhouse', 'tomatoes']
      },
      {
        id: '2',
        title: 'Check soil pH levels',
        description: 'Weekly pH testing for vegetable beds',
        priority: 'medium',
        dueDate: 'Tomorrow, 10:00 AM',
        status: 'pending',
        tags: ['soil', 'testing', 'maintenance']
      }
    ];
  }
};

const mockArticleService = {
  getArticles: async (): Promise<ArticleData[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return [
      {
        id: '1',
        title: 'Organic Pest Control Methods',
        excerpt: 'Discover natural ways to protect your garden from common pests without harmful chemicals.',
        category: 'Pest Management',
        readTime: 5,
        tags: ['organic', 'pest-control', 'natural']
      },
      {
        id: '2',
        title: 'Companion Planting Guide',
        excerpt: 'Learn which plants grow best together and how to maximize your garden\'s potential.',
        category: 'Planting Tips',
        readTime: 8,
        tags: ['companion-planting', 'planning', 'tips']
      }
    ];
  }
};

// Components
const WeatherCard: React.FC<{ weather: WeatherData }> = ({ weather }) => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 mb-3">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Cloud className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-gray-800">Weather Update</span>
      </div>
      <span className="text-2xl font-bold text-blue-600">{weather.temperature}°C</span>
    </div>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>
        <span className="text-gray-600">Condition:</span>
        <span className="ml-1 font-medium">{weather.condition}</span>
      </div>
      <div>
        <span className="text-gray-600">Humidity:</span>
        <span className="ml-1 font-medium">{weather.humidity}%</span>
      </div>
    </div>
    <div className="mt-3 pt-3 border-t border-blue-200">
      <div className="text-xs font-semibold text-gray-700 mb-2">3-Day Forecast</div>
      <div className="grid grid-cols-3 gap-2">
        {weather.forecast.map((day, idx) => (
          <div key={idx} className="text-center">
            <div className="text-xs text-gray-600">{day.day}</div>
            <div className="text-sm font-medium">{day.high}°/{day.low}°</div>
            <div className="text-xs text-gray-500">{day.condition}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TaskCard: React.FC<{ task: TaskData }> = ({ task }) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800">{task.title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{task.dueDate}</span>
        </div>
        <div className="flex gap-1">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: ArticleData }> = ({ article }) => (
  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-3 hover:shadow-sm transition-shadow cursor-pointer">
    <div className="flex items-start justify-between mb-2">
      <h4 className="font-semibold text-gray-800">{article.title}</h4>
      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
        {article.readTime} min read
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-green-700">{article.category}</span>
      <div className="flex gap-1">
        {article.tags.slice(0, 2).map((tag, idx) => (
          <span key={idx} className="text-xs bg-white text-gray-600 px-2 py-1 rounded border border-gray-200">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const GoodPalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! I\'m GoodPal, your AI farming assistant. How can I help you with your garden today? 🌱',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeIntent = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('weather') || lowerText.includes('temperature') || lowerText.includes('forecast')) {
      return 'weather';
    }
    if (lowerText.includes('task') || lowerText.includes('todo') || lowerText.includes('water') || lowerText.includes('plant')) {
      return 'tasks';
    }
    if (lowerText.includes('pest') || lowerText.includes('disease') || lowerText.includes('tip') || lowerText.includes('guide')) {
      return 'articles';
    }
    return 'general';
  };

  const generateBotResponse = async (userMessage: string): Promise<{ text: string; cards?: CardData[] }> => {
    const intent = analyzeIntent(userMessage);
    
    switch (intent) {
      case 'weather':
        const weather = await mockWeatherService.getCurrentWeather();
        return {
          text: 'Here\'s the current weather and forecast for your area:',
          cards: [{ type: 'weather', data: weather }]
        };
      
      case 'tasks':
        const tasks = await mockTaskService.getTasks();
        return {
          text: `I found ${tasks.length} tasks for you to review:`,
          cards: tasks.map(task => ({ type: 'task', data: task }))
        };
      
      case 'articles':
        const articles = await mockArticleService.getArticles();
        return {
          text: 'Here are some helpful articles based on your question:',
          cards: articles.map(article => ({ type: 'article', data: article }))
        };
      
      default:
        return {
          text: 'I can help you with weather updates, task management, and gardening tips. What would you like to know about?'
        };
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Add loading message
    const loadingMessage: Message = {
      id: `${Date.now()}-loading`,
      type: 'bot',
      text: '',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await generateBotResponse(inputText);
      
      // Remove loading message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: Date.now().toString(),
          type: 'bot',
          text: response.text,
          timestamp: new Date(),
          cards: response.cards
        }];
      });
    } catch (error) {
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: Date.now().toString(),
          type: 'bot',
          text: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">GoodPal Assistant</h1>
                  <p className="text-xs text-gray-500">Your AI Farming Companion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Home className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  {message.isLoading ? (
                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        <span className="text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`rounded-lg px-4 py-3 shadow-sm ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                      {message.cards && (
                        <div className="mt-3 space-y-2">
                          {message.cards.map((card, idx) => {
                            switch (card.type) {
                              case 'weather':
                                return <WeatherCard key={idx} weather={card.data} />;
                              case 'task':
                                return <TaskCard key={idx} task={card.data} />;
                              case 'article':
                                return <ArticleCard key={idx} article={card.data} />;
                              default:
                                return null;
                            }
                          })}
                        </div>
                      )}
                    </>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me about weather, tasks, or gardening tips..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            <button 
              onClick={() => setInputText('What\'s the weather like today?')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-700 transition-colors"
            >
              Weather update
            </button>
            <button 
              onClick={() => setInputText('Show me my tasks')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-700 transition-colors"
            >
              View tasks
            </button>
            <button 
              onClick={() => setInputText('Tips for pest control')}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-700 transition-colors"
            >
              Gardening tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodPalChat;