import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Paperclip, Smile, Mic, Send, Users } from 'lucide-react';
import { useCommunity } from '@/contexts/CommunityContext';
import { realTimeMessagingService } from '@/services/realTimeMessaging';
import UserDiscovery from './UserDiscovery';

const STATUS_KEY = 'communityDM_status_v1';
const CONTACTS_KEY = 'communityDM_contacts_v1';

interface Contact { id: string; name: string; avatarUrl?: string | null }

const formatTime = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
};

const formatLastSeen = (iso?: string) => {
  if (!iso) return 'last seen recently';
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Online';
  if (min < 60) return `last seen ${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `last seen ${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `last seen ${day}d ago`;
};

const MessagesModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void; partner?: { id: string; name: string; avatarUrl?: string | null } }> = ({ open, onOpenChange, partner }) => {
  const { currentUser, posts, sendMessage, getConversation, getMessages, markConversationAsRead } = useCommunity();
  const [selected, setSelected] = useState<string | null>(partner?.id || null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [onlineMap, setOnlineMap] = useState<Record<string, { online: boolean; lastSeen?: string }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  const [addedContacts, setAddedContacts] = useState<Contact[]>([]);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [discoverUsersOpen, setDiscoverUsersOpen] = useState(false);

  // Get messages for the selected conversation
  const [messages, setMessages] = useState<any[]>([]);
  
  // Load messages when selected changes
  useEffect(() => {
    if (selected && currentUser) {
      console.log('Loading messages for conversation between:', currentUser.id, 'and', selected);
      const conversationId = [currentUser.id, selected].sort().join('_');
      console.log('Conversation ID:', conversationId);
      
      // Load initial messages
      getMessages(conversationId).then(msgs => {
        console.log('Loaded messages:', msgs);
        setMessages(Array.isArray(msgs) ? msgs : []);
      }).catch(error => {
        console.error('Error loading messages:', error);
        setMessages([]);
      });

      // Set up real-time subscription
      console.log('Setting up real-time subscription for:', currentUser.id, 'and', selected);
      const unsubscribe = realTimeMessagingService.subscribeToMessages(
        currentUser.id,
        selected,
        (newMessages) => {
          console.log('Real-time messages update:', newMessages);
          // Convert ServiceMessage to Message format
          const convertedMessages = newMessages.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            content: msg.content,
            messageType: msg.message_type,
            mediaUrl: msg.media_url || '',
            createdAt: msg.created_at,
            read: msg.read
          }));
          setMessages(convertedMessages);
        }
      );

      // Cleanup subscription on unmount or when selected changes
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      setMessages([]);
    }
  }, [selected, currentUser]); // Removed getMessages from dependencies

  const peopleFromPosts = useMemo(() => {
    const map = new Map<string, { name: string; avatarUrl?: string | null }>();
    posts.forEach(p => {
      // Add safety check for p and p.user, and ensure it's not the current user
      if (p && p.user && p.user.id !== currentUser?.id && p.user.name !== currentUser?.name && !map.has(p.user.id)) {
        map.set(p.user.id, { name: p.user.name, avatarUrl: p.user.avatarUrl });
      }
    });
    return Array.from(map.entries()).map(([id, v]) => ({ id, ...v }));
  }, [posts, currentUser]);

  const combinedPeople = useMemo(() => {
    const map = new Map<string, Contact>();
    
    // Add current user first (so they appear in contacts)
    if (currentUser) {
      map.set(currentUser.id, {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl
      });
    }
    
    // addedContacts
    addedContacts.forEach(c => {
      map.set(c.id, c);
    });
    
    // peopleFromPosts
    peopleFromPosts.forEach(p => { 
      if (!map.has(p.id)) {
        map.set(p.id, { id: p.id, name: p.name, avatarUrl: p.avatarUrl }); 
      }
    });
    
    return Array.from(map.values());
  }, [addedContacts, peopleFromPosts, currentUser]);

  const filteredPeople = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return combinedPeople;
    return combinedPeople.filter(p => {
      const byName = p.name.toLowerCase().includes(term);
      const conversation = getConversation(p.id);
      const last = conversation?.lastMessage?.content?.toLowerCase() || '';
      return byName || last.includes(term);
    });
  }, [combinedPeople, search, getConversation]);

  useEffect(() => { setSelected(partner?.id || null); }, [partner?.id]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selected && currentUser) {
      const conversationId = [currentUser.id, selected].sort().join('_');
      markConversationAsRead(conversationId);
    }
  }, [selected, currentUser, markConversationAsRead]);

  // Remove old localStorage-based message handling
  // Messages are now handled by the context

  // Load contacts on mount and when modal opens
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTACTS_KEY);
      setAddedContacts(raw ? (JSON.parse(raw) as Contact[]) : []);
      console.log('Loaded contacts from localStorage:', raw ? JSON.parse(raw) : []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setAddedContacts([]);
    }
  }, [open]);

  // Also load contacts when component mounts
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTACTS_KEY);
      if (raw) {
        setAddedContacts(JSON.parse(raw) as Contact[]);
        console.log('Loaded contacts on mount:', JSON.parse(raw));
      }
    } catch (error) {
      console.error('Error loading contacts on mount:', error);
    }
  }, []);

  // Messages are now handled by the context via getMessages()

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(STATUS_KEY);
      const saved = raw ? (JSON.parse(raw) as Record<string, { online: boolean; lastSeen?: string }>) : {};
      const next: Record<string, { online: boolean; lastSeen?: string }> = { ...saved };
      combinedPeople.forEach(p => { if (!next[p.id]) next[p.id] = { online: Math.random() < 0.5, lastSeen: new Date(Date.now() - Math.floor(Math.random()*6_000_000)).toISOString() }; });
      if (currentUser) next[currentUser.id] = { online: true, lastSeen: new Date().toISOString() };
      setOnlineMap(next);
      localStorage.setItem(STATUS_KEY, JSON.stringify(next));
    } catch {}
  }, [open, combinedPeople, currentUser?.id]);

  useEffect(() => {
    if (!selected) return;
    setPartnerTyping(true);
    const t = setTimeout(() => setPartnerTyping(false), 1600);
    return () => clearTimeout(t);
  }, [selected]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, partnerTyping]);

  // Thread persistence is now handled by the context

  const persistContacts = (next: Contact[]) => {
    try {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
      setAddedContacts(next);
    } catch {}
  };

  const send = async () => {
    console.log('Send function called with:', { 
      currentUser: currentUser?.id, 
      selected, 
      input: input.trim(),
      hasCurrentUser: !!currentUser,
      hasSelected: !!selected,
      hasInput: !!input.trim()
    });
    
    if (!currentUser || !selected || !input.trim()) {
      console.log('Cannot send message - missing requirements:', { 
        currentUser: !!currentUser, 
        selected, 
        input: input.trim() 
      });
      return;
    }
    
    // Prevent self-messaging
    if (selected === currentUser.id) {
      console.log('Cannot message yourself');
      return;
    }
    
    console.log('Sending message from', currentUser.id, 'to', selected, 'content:', input.trim());
    
    try {
      // Ensure the selected user is in contacts before sending
      const userExists = combinedPeople.some(person => person.id === selected);
      if (!userExists) {
        // Try to find user data from peopleFromPosts or create a basic contact
        const userData = peopleFromPosts.find(p => p.id === selected);
        if (userData) {
          const newContact = {
            id: userData.id,
            name: userData.name,
            avatarUrl: userData.avatarUrl
          };
          const updatedContacts = [...addedContacts, newContact];
          persistContacts(updatedContacts);
          console.log('Auto-added user to contacts:', newContact);
        }
      }
      
      // Use the context's sendMessage function
      await sendMessage(selected, input.trim(), 'text');
      console.log('Message sent successfully');
      setInput('');
      
      // Reload messages after sending
      setTimeout(() => {
        const conversationId = [currentUser.id, selected].sort().join('_');
        getMessages(conversationId).then(msgs => {
          console.log('Reloaded messages:', msgs);
          setMessages(Array.isArray(msgs) ? msgs : []);
        });
      }, 500);
      
      // Update online status
      const map = { ...onlineMap };
      if (map[selected]) map[selected].lastSeen = new Date().toISOString();
      localStorage.setItem(STATUS_KEY, JSON.stringify(map));
      setOnlineMap(map);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAttach = (files: FileList | null) => {
    if (!files || !currentUser || !selected) return;
    const items = Array.from(files).slice(0, 5);
    items.forEach((f, i) => {
      // Use the context's sendMessage function for attachments
      sendMessage(selected, `Sent an attachment: ${f.name}`, 'image', URL.createObjectURL(f));
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVoice = () => {
    if (!currentUser || !selected) return;
    const secs = Math.max(5, Math.floor(Math.random() * 30));
    const mm = Math.floor(secs / 60).toString();
    const ss = (secs % 60).toString().padStart(2, '0');
    // Use the context's sendMessage function for voice messages
    sendMessage(selected, `Voice message (${mm}:${ss})`, 'video');
  };

  const lastMessageOf = (partnerId: string) => {
    if (!currentUser) return undefined;
    const conversation = getConversation(partnerId);
    return conversation?.lastMessage;
  };

  const isOnline = (id: string) => onlineMap[id]?.online;
  const lastSeenFor = (id: string) => onlineMap[id]?.lastSeen;

  const emojis = ['😀','😁','😂','🤣','😊','😍','😘','😎','🤔','👍','🙏','🌿','🌱','🌎','🔥','🎉','💬'];

  const createNewContact = () => {
    const name = newName.trim();
    if (!name || !currentUser) return;
    const id = `c_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const contact: Contact = { id, name, avatarUrl: newAvatar.trim() || undefined };
    const next = [contact, ...addedContacts];
    persistContacts(next);
    setNewName(''); setNewAvatar(''); setNewChatOpen(false);
    // select newly created contact
    setSelected(id);
    // Messages will be created automatically when first message is sent
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 border-0 shadow-2xl">
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Messages
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDiscoverUsersOpen(true)}
              className="flex items-center gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <Users className="h-4 w-4" />
              Discover Users
            </Button>
          </div>
        </DialogHeader>
        <div className="flex h-[calc(85vh-80px)]">
          {/* Left: Contacts */}
          <div className="w-80 border-r border-emerald-200/50 flex flex-col bg-white/80 backdrop-blur-sm">
            <div className="p-4 pb-2 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-emerald-200/30 flex-shrink-0">
              <div className="text-lg font-semibold text-emerald-800">
                Chats
              </div>
              <div className="mt-2">
                <Input 
                  placeholder="Search conversations..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white/80 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
              {filteredPeople.map(p => {
                const last = lastMessageOf(p.id);
                return (
                  <button key={p.id} onClick={() => setSelected(p.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-emerald-50/80 ${selected === p.id ? 'bg-gradient-to-r from-emerald-100 to-blue-100 border-r-4 border-emerald-400' : 'hover:shadow-sm'}`}>
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={(p as Contact).avatarUrl || undefined} />
                        <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${isOnline(p.id) ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm truncate text-gray-800">{p.name}</div>
                        {last && <div className="text-[11px] text-gray-400 ml-2 whitespace-nowrap">{formatTime(last.createdAt)}</div>}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{last ? last.content : 'No messages yet'}</div>
                    </div>
                  </button>
                );
              })}
              {filteredPeople.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">No contacts found.</div>
              )}
            </div>

            {/* New chat form (inline) */}
            {newChatOpen && (
              <div className="p-3 border-t border-emerald-200/30 bg-gradient-to-r from-emerald-50 to-blue-50">
                <div className="text-sm font-medium mb-2 text-emerald-800">Start a new chat</div>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Contact name" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') createNewContact(); }}
                    className="bg-white/80 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200"
                  />
                  <Input 
                    placeholder="Avatar URL (optional)" 
                    value={newAvatar} 
                    onChange={(e) => setNewAvatar(e.target.value)}
                    className="bg-white/80 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => { setNewChatOpen(false); setNewName(''); setNewAvatar(''); }}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={createNewContact} 
                    disabled={!newName.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                  >
                    Create
                  </Button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                // open inline new chat composer
                setNewChatOpen(prev => !prev);
                setSearch('');
              }}
              className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white flex items-center justify-center shadow-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 hover:scale-105"
              aria-label="New chat"
            >
              <span className="text-xl">+</span>
            </button>
          </div>

          {/* Right: Chat */}
          <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-sm min-w-0">
            {/* Header */}
            <div className="px-6 py-4 border-b border-emerald-200/50 bg-gradient-to-r from-emerald-50 to-blue-50 flex items-center justify-between flex-shrink-0">
              <div>
                <div className="font-semibold text-emerald-800">
                  {selected ? (
                    combinedPeople.find(p => p.id === selected)?.name || 'Chat'
                  ) : (
                    'Select a person'
                  )}
                </div>
                {selected && (
                  <div className="text-xs text-emerald-600 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isOnline(selected) ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    {isOnline(selected) ? 'Online' : formatLastSeen(lastSeenFor(selected))}
                  </div>
                )}
              </div>
              {selected && (
                <Avatar className="h-10 w-10 ring-2 ring-emerald-200">
                  <AvatarImage src={combinedPeople.find(p => p.id === selected)?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                    {combinedPeople.find(p => p.id === selected)?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar bg-gradient-to-b from-blue-50/30 to-green-50/30 min-h-0">
              {!selected ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Select a contact to start chatting</p>
                    <p className="text-sm">Choose someone from the contacts list to begin messaging</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(m => {
                const mine = m.senderId === currentUser?.id;
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-all duration-200 hover:shadow-md ${mine ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white' : 'bg-white border border-emerald-100'}`}>
                      {m.messageType === 'image' && m.mediaUrl && (
                        <div className="mb-2">
                          <img src={m.mediaUrl} alt="Attachment" className="max-w-full h-auto rounded-lg" />
                        </div>
                      )}
                      {m.messageType === 'video' && m.mediaUrl && (
                        <div className="mb-2">
                          <video src={m.mediaUrl} controls className="max-w-full h-auto rounded-lg" />
                        </div>
                      )}
                      <div>{m.content}</div>
                      <div className={`text-[10px] mt-1 ${mine ? 'text-blue-100' : 'text-slate-400'}`}>
                        {formatTime(m.createdAt)} {m.read && mine ? '✓' : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
                  {selected && messages.length === 0 && (
                    <div className="text-sm text-muted-foreground">Say hi!</div>
                  )}
                  {(input.trim().length > 0 || partnerTyping) && (
                    <div className="text-xs text-muted-foreground">
                      {partnerTyping ? 'Contact is typing…' : 'You are typing…'}
                    </div>
                  )}
                  <div ref={listEndRef} />
                </>
              )}
            </div>

            {/* Composer */}
            <div className="px-4 py-3 border-t border-emerald-200/50 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 flex items-center gap-3 flex-shrink-0">
              <input ref={fileInputRef} type="file" className="hidden" multiple onChange={(e) => handleAttach(e.target.files)} />
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-3 bg-white border-emerald-200 shadow-lg">
                  <div className="grid grid-cols-6 gap-2">
                    {emojis.map(e => (
                      <button key={e} className="text-xl hover:scale-110 transition-transform p-1 rounded hover:bg-emerald-50" onClick={() => setInput(prev => prev + e)}>{e}</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300" 
                onClick={handleVoice} 
                disabled={!selected}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Input 
                placeholder="Type a message..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                className="flex-1 bg-white border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-lg"
              />
              <Button 
                onClick={send} 
                disabled={!selected || !input.trim()} 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6"
              >
                <Send className="h-4 w-4 mr-2" /> Send
              </Button>
            </div>
          </div>
        </div>
        
        {/* User Discovery Modal */}
        <UserDiscovery
          open={discoverUsersOpen}
          onOpenChange={setDiscoverUsersOpen}
          onStartChat={(userId, userData) => {
            // Add user to contacts if not already there
            const userExists = combinedPeople.some(person => person.id === userId);
            if (!userExists && userData) {
              const newContact = {
                id: userData.id,
                name: userData.fullName,
                avatarUrl: userData.avatarUrl
              };
              const updatedContacts = [...addedContacts, newContact];
              persistContacts(updatedContacts);
              console.log('Added user to contacts and persisted:', newContact);
            }
            // Set as selected user
            setSelected(userId);
            console.log('Selected user for chat:', userId);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MessagesModal;
