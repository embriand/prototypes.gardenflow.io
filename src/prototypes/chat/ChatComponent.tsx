import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Send, User, Search, MoreVertical, Phone, Video, ChevronLeft, MessageSquare } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

interface ChatUser {
  id: string;
  email: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  status?: 'online' | 'offline';
  lastSeen?: Date;
}

// Mock data for standalone prototype
const mockCurrentUser = {
  id: 'current-user',
  email: 'john.doe@example.com'
};

const mockUsers = [
  { id: 'user-1', email: 'alice.smith@example.com' },
  { id: 'user-2', email: 'bob.johnson@example.com' },
  { id: 'user-3', email: 'carol.williams@example.com' },
  { id: 'user-4', email: 'david.brown@example.com' },
  { id: 'user-5', email: 'emma.davis@example.com' }
];

const ChatComponent = () => {
  // Mock data replaces Redux and i18n dependencies
  const currentUser = mockCurrentUser;
  const users = mockUsers;
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatUsers: ChatUser[] = users.map(user => ({
    id: user.id,
    email: user.email,
    lastMessage: messages
      .filter(m => m.senderId === user.id || m.senderId === currentUser?.id)
      .slice(-1)[0]?.content,
    lastMessageTime: messages
      .filter(m => m.senderId === user.id || m.senderId === currentUser?.id)
      .slice(-1)[0]?.timestamp,
    unreadCount: messages.filter(m => m.senderId === user.id).length,
    status: Math.random() > 0.5 ? 'online' : 'offline',
    lastSeen: new Date(Date.now() - Math.random() * 10000000)
  })).filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser || !currentUser) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] bg-gray-100">
      <div className="container mx-auto h-full py-6">
        <div className="grid grid-cols-12 h-full bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Sidebar */}
          <div className="col-span-4 border-r border-gray-200">
            {/* User Profile Header */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{currentUser?.email}</h3>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 bg-white">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-gray-100 border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="overflow-y-auto h-[calc(100%-8rem)]">
              {chatUsers.map(chatUser => (
                <button
                  key={chatUser.id}
                  onClick={() => setSelectedUser(chatUser)}
                  className={`w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedUser?.id === chatUser.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-teal-600" />
                      </div>
                      {chatUser.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {chatUser.email}
                        </p>
                        {chatUser.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {format(chatUser.lastMessageTime, 'HH:mm')}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500 truncate">
                          {chatUser.lastMessage || (chatUser.status === 'online' ? 'online' : `last seen ${format(chatUser.lastSeen!, 'HH:mm')}`)}
                        </p>
                        {chatUser.unreadCount > 0 && (
                          <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chatUser.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-8 flex flex-col bg-[#f0f2f5]">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedUser.email}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedUser.status === 'online' ? 'online' : `last seen ${format(selectedUser.lastSeen!, 'HH:mm')}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Video className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div 
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat'
                  }}
                >
                  {messages
                    .filter(
                      m =>
                        (m.senderId === currentUser?.id &&
                          selectedUser.id === selectedUser.id) ||
                        (m.senderId === selectedUser.id &&
                          currentUser?.id === currentUser?.id)
                    )
                    .map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === currentUser?.id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
                            message.senderId === currentUser?.id
                              ? 'bg-[#dcf8c6] text-gray-800'
                              : 'bg-white text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-[10px] text-gray-500 text-right mt-1">
                            {format(message.timestamp, 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 bg-white border-gray-200"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!message.trim()}
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700">
Select a contact to start chatting
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;