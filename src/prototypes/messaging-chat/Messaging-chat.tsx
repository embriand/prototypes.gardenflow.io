import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { MessageCircle, X, Minimize2, Maximize2, Search, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// Types
interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: string;
}

interface Contact {
  id: number;
  name: string;
  title: string;
  avatar: string;
  isOnline: boolean;
  messages: Message[];
}

// Initial mock data
const initialContacts: Contact[] = [
  {
    id: 1,
    name: 'Emma Thompson',
    title: 'UX Designer at Google',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
    messages: [
      {
        id: 1,
        content: "Hi! I saw your recent post about design systems. Would love to discuss further!",
        timestamp: "2024-12-20T10:30:00",
        sender: "Emma Thompson"
      },
      {
        id: 2,
        content: "Absolutely! I'm particularly interested in your approach to component libraries.",
        timestamp: "2024-12-20T10:35:00",
        sender: "You"
      }
    ]
  },
  {
    id: 2,
    name: 'James Wilson',
    title: 'Senior Developer at Microsoft',
    avatar: '/api/placeholder/40/40',
    isOnline: false,
    messages: [
      {
        id: 1,
        content: "Hey, are you attending the tech conference next month?",
        timestamp: "2024-12-19T15:20:00",
        sender: "James Wilson"
      },
      {
        id: 2,
        content: "Not sure yet, but I'd love to catch up if you're going!",
        timestamp: "2024-12-19T15:25:00",
        sender: "You"
      }
    ]
  },
  {
    id: 3,
    name: 'Sarah Chen',
    title: 'Product Manager at Apple',
    avatar: '/api/placeholder/40/40',
    isOnline: true,
    messages: [
      {
        id: 1,
        content: "Thanks for connecting! I'd love to discuss potential collaboration.",
        timestamp: "2024-12-18T09:15:00",
        sender: "Sarah Chen"
      }
    ]
  }
];

// Local Storage Service
const STORAGE_KEY = 'messaging_data';

const loadFromStorage = (): Contact[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialContacts;
  }
  return initialContacts;
};

const saveToStorage = (contacts: Contact[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }
};

// Context
interface MessagingContextType {
  contacts: Contact[];
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  sendMessage: (contactId: number, content: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

// Provider Component
const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    setContacts(loadFromStorage());
  }, []);

  useEffect(() => {
    saveToStorage(contacts);
  }, [contacts]);

  const sendMessage = useCallback((contactId: number, content: string) => {
    setContacts(prevContacts => {
      const newContacts = prevContacts.map(contact => {
        if (contact.id === contactId) {
          const newMessage: Message = {
            id: contact.messages.length + 1,
            content,
            timestamp: new Date().toISOString(),
            sender: "You"
          };
          return {
            ...contact,
            messages: [...contact.messages, newMessage]
          };
        }
        return contact;
      });
      return newContacts;
    });
  }, []);

  return (
    <MessagingContext.Provider
      value={{
        contacts,
        selectedContact,
        setSelectedContact,
        sendMessage
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

// Hook for using the messaging context
const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};

const MainComponent = () => {
  const { contacts, selectedContact, setSelectedContact, sendMessage } = useMessaging();
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      sendMessage(selectedContact.id, newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Messaging Component */}
      <div className="fixed bottom-8 right-4 flex gap-4">
        {isMessengerOpen && (
          <div
            className={`bg-white rounded-lg shadow-lg transition-all duration-300 flex ${
              isMinimized ? 'h-12' : 'h-[600px]'
            }`}
            style={{ width: selectedContact ? '700px' : '300px' }}
          >
            {/* Contact list */}
            <div className="w-72 border-r flex flex-col">
              <div className="p-3 border-b flex-shrink-0">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">Messaging</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMessengerOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search messages"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {!isMinimized && (
                <div className="overflow-y-auto flex-1 flex flex-col flex-shrink">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`w-full p-3 hover:bg-gray-100 cursor-pointer border-b flex-shrink-0 ${
                        selectedContact?.id === contact.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-10 h-10 rounded-full"
                          />
                          {contact.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                          <p className="text-xs text-gray-500 truncate">{contact.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat window */}
            {selectedContact && !isMinimized && (
              <div className="flex-1 flex flex-col h-full">
                <div className="p-3 border-b flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{selectedContact.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedContact.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col space-y-4">
                    {selectedContact.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'You' ? 'justify-end' : 'justify-start'
                        } w-full`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === 'You'
                              ? 'bg-blue-600 text-white ml-auto'
                              : 'bg-gray-100 mr-auto'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span
                            className={`text-xs ${
                              message.sender === 'You'
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 border-t flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a message..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messaging button */}
        {!isMessengerOpen && (
          <Button
            className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-600 text-white shadow-lg hover:bg-blue-700"
            onClick={() => setIsMessengerOpen(true)}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default function MessagingChat() {
  return (
    <MessagingProvider>
      <MainComponent />
    </MessagingProvider>
  );
}