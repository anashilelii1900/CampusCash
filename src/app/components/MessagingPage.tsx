import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Search, Send, Paperclip, MoreVertical, Plus, X, User } from 'lucide-react';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { api } from '../api/client';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

interface MessagingPageProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout: () => void;
}

export function MessagingPage({ onNavigate, userRole, onLogout }: MessagingPageProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [me, setMe] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New Chat State
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Socket instance
  const socketRef = useRef<any>(null);

  useEffect(() => {
    fetchMe();
    fetchConversations();

    // Initialize Socket to production or local backend
    const backendUrl = (import.meta as any).env.VITE_API_URL
      ? (import.meta as any).env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';
    const socket = io(backendUrl);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
    });

    socket.on('new_message', (message: any) => {
      // If we're currently chatting with the sender, show the message immediately
      if (selectedConversation?.id === message.senderId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      // Always refresh conversations list to update 'lastMessage'
      fetchConversations();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (me?.id && socketRef.current) {
      socketRef.current.emit('join', me.id);
    }
  }, [me?.id]);

  const fetchMe = async () => {
    try {
      const data = await api.get('/users/me');
      setMe(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchConversations = async () => {
    try {
      const data = await api.get('/messages/conversations');
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0].user); // each conversation has { user, lastMessage, time }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchMessages = async (userId: number) => {
    try {
      const data = await api.get(`/messages/conversation/${userId}`);
      // Backend returns { otherUser, messages }
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      setMessages(msgs);
      scrollToBottom();
    } catch (e) {
      console.error(e);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent, fileData?: { url: string, type: string }) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() && !fileData && !selectedConversation) return;

    try {
      const payload: any = {
        receiverId: selectedConversation.id
      };
      
      if (fileData) {
        payload.fileUrl = fileData.url;
        payload.fileType = fileData.type;
        payload.content = messageInput.trim() || null;
      } else {
        payload.content = messageInput.trim();
      }

      await api.post('/messages', payload);
      setMessageInput('');
      fetchMessages(selectedConversation.id);
      fetchConversations(); // update last message
    } catch (e) {
      console.error(e);
      toast.error('Failed to send message');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;

    const toastId = toast.loading('Uploading file...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const backendBase = (import.meta as any).env.VITE_API_URL
        ? (import.meta as any).env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:5000';
      const response = await fetch(`${backendBase}/api/messages/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      
      toast.success('File uploaded', { id: toastId });
      // Send message immediately with the file
      handleSendMessage(null as any, { url: data.fileUrl, type: data.fileType });
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload file', { id: toastId });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getInitials = (user: any) => {
    if (!user) return 'U';
    const name = user.companyName || user.name || 'User';
    return name.substring(0, 2).toUpperCase();
  };

  // Search users for new conversation
  useEffect(() => {
    if (!isNewChatOpen) return;
    const fetchSearchResults = async () => {
      setIsSearching(true);
      try {
        const query = userSearchQuery ? `?q=${userSearchQuery}` : '';
        const data = await api.get(`/users${query}`);
        // Filter out self
        setSearchResults(data.filter((u: any) => u.id !== me?.id));
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [userSearchQuery, isNewChatOpen, me?.id]);

  const startNewConversation = (user: any) => {
    setIsNewChatOpen(false);
    setSelectedConversation(user);
    // Don't have to create anything on backend yet until first message is sent, 
    // but we can query to see if history exists
    fetchMessages(user.id);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0A0A0A] flex flex-col transition-colors duration-300">
      <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} activePage="messaging" />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 w-full flex flex-col">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[#111111] dark:text-white mb-2 tracking-tight">Messages</h1>
            <p className="text-[#777777] dark:text-gray-400">Communicate with employers and candidates</p>
          </div>
          <button 
            onClick={() => setIsNewChatOpen(true)}
            className="bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-5 py-2.5 rounded-xl hover:bg-[#222222] dark:hover:bg-gray-200 transition-all flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            <span className="font-semibold text-sm">New Chat</span>
          </button>
        </div>

        <div className="bg-white dark:bg-[#111111] rounded-xl shadow-md dark:shadow-none border border-transparent dark:border-white/5 overflow-hidden flex-1 flex flex-col lg:flex-row min-h-[600px]">
          {/* Conversation List */}
          <div className="w-full lg:w-1/3 border-r border-[#E5E5E5] dark:border-white/5 flex flex-col h-full">
            {/* Search */}
            <div className="p-4 border-b border-[#E5E5E5] dark:border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#777777] dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedConversation(conv.user)}
                  className={`p-4 border-b border-[#E5E5E5] dark:border-white/5 cursor-pointer transition-all hover:bg-[#F5F3EF] dark:hover:bg-white/5 ${selectedConversation?.id === conv.user.id ? 'bg-[#F5F3EF] dark:bg-white/5' : ''
                    }`}
                >
                  <div className="flex items-start">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center font-bold">
                        {getInitials(conv.user)}
                      </div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-[#111111] dark:text-white truncate">{conv.user.companyName || conv.user.name}</h3>
                        <span className="text-xs text-[#777777] dark:text-gray-500 ml-2 flex-shrink-0">
                          {new Date(conv.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-[#777777] dark:text-gray-400 truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="text-center p-8 text-gray-500">No conversations yet</div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col h-full bg-[#FFFFFF] dark:bg-[#0A0A0A]">
              {/* Chat Header */}
              <div className="p-4 border-b border-[#E5E5E5] dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#111111] shrink-0">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 bg-[#111111] text-white rounded-full flex items-center justify-center font-bold">
                      {getInitials(selectedConversation)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-[#111111] dark:text-white">
                      {selectedConversation.companyName || selectedConversation.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-[#F5F3EF] dark:hover:bg-white/5 rounded-lg transition-colors">
                    <MoreVertical size={20} className="text-[#777777] dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20">
                {messages.map((message) => {
                  const isMe = message.senderId === me?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-[#1A1A1A] text-[#111111] dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-white/5'
                            }`}
                        >
                          {message.fileUrl && (
                            <div className="mb-2 overflow-hidden rounded-lg">
                              {(() => {
                                const baseUrl = (import.meta as any).env.VITE_API_URL
                                  ? (import.meta as any).env.VITE_API_URL.replace('/api', '')
                                  : 'http://localhost:5000';
                                return message.fileType === 'image' ? (
                                  <img
                                    src={`${baseUrl}${message.fileUrl}`}
                                    alt="Shared"
                                    className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(`${baseUrl}${message.fileUrl}`, '_blank')}
                                  />
                                ) : (
                                  <a
                                    href={`${baseUrl}${message.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center space-x-2 p-3 rounded-lg border ${
                                      isMe ? 'bg-white/10 border-white/20' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10'
                                    }`}
                                  >
                                    <Paperclip size={18} />
                                    <span className="text-sm font-medium truncate max-w-[150px]">
                                      {message.fileUrl.split('/').pop()}
                                    </span>
                                  </a>
                                );
                              })()}
                            </div>
                          )}
                          {message.content && (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          )}
                          <p
                            className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'
                              }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-white/5">
                <form onSubmit={handleSendMessage} className="relative flex items-end space-x-2">
                  <div className="flex-1 relative group">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute left-2 bottom-2 p-2 text-gray-400 hover:text-[#C9941A] dark:hover:text-[#C9941A]400 transition-colors"
                    >
                      <Paperclip size={20} />
                    </button>
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e as any);
                        }
                      }}
                      placeholder="Type a message..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C9941A]500/20 focus:border-[#E8E0C8]500 text-[#111111] dark:text-white placeholder-gray-400 min-h-[48px] max-h-32 resize-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-[#FDF9EC]700 disabled:opacity-50 disabled:hover:bg-[#FDF9EC]600 transition-all shadow-lg shadow-[#C9941A]/600/20 active:scale-95 flex-shrink-0"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#777777] dark:text-gray-500">
              <MessageSquare size={48} className="mb-4 text-[#E5E5E5] dark:text-white/10" />
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

      <Footer onNavigate={onNavigate} />

      {/* New Chat Modal */}
      <AnimatePresence>
        {isNewChatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewChatOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh] border border-transparent dark:border-white/10"
            >
              <div className="p-6 border-b border-[#E5E5E5] dark:border-white/5 flex justify-between items-center bg-[#FFFFFF] dark:bg-[#0A0A0A]">
                <h2 className="text-xl font-bold text-[#111111] dark:text-white">Start a New Chat</h2>
                <button onClick={() => setIsNewChatOpen(false)} className="text-[#777777] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 border-b border-[#E5E5E5] dark:border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#777777] dark:text-gray-500" size={18} />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by name or company..."
                    className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isSearching ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-[#C9940A] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div 
                      key={user.id} 
                      onClick={() => startNewConversation(user)}
                      className="flex items-center p-4 rounded-xl hover:bg-[#F5F3EF] dark:hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-[#C9940A]/20"
                    >
                      <div className="w-12 h-12 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {getInitials(user)}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-[#111111] dark:text-white">{user.companyName || user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <User size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No users found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessageSquare(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
