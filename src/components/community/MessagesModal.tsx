import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Paperclip, Smile, Mic, Send } from 'lucide-react';
import { useCommunity } from '@/contexts/CommunityContext';

const DM_KEY = 'communityDM_v1';
const STATUS_KEY = 'communityDM_status_v1';
const CONTACTS_KEY = 'communityDM_contacts_v1';

interface Message { id: string; senderId: string; content: string; createdAt: string; }
interface Contact { id: string; name: string; avatarUrl?: string | null }

const threadIdOf = (a: string, b: string) => [a, b].sort().join('|');

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
  const { currentUser, posts } = useCommunity();
  const [selected, setSelected] = useState<string | null>(partner?.id || null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [onlineMap, setOnlineMap] = useState<Record<string, { online: boolean; lastSeen?: string }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  const [addedContacts, setAddedContacts] = useState<Contact[]>([]);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('');

  const peopleFromPosts = useMemo(() => {
    const map = new Map<string, { name: string; avatarUrl?: string | null }>();
    posts.forEach(p => {
      if (p.user.id !== currentUser?.id && !map.has(p.user.id)) map.set(p.user.id, { name: p.user.name, avatarUrl: p.user.avatarUrl });
    });
    return Array.from(map.entries()).map(([id, v]) => ({ id, ...v }));
  }, [posts, currentUser]);

  const combinedPeople = useMemo(() => {
    const map = new Map<string, Contact>();
    // addedContacts first
    addedContacts.forEach(c => map.set(c.id, c));
    peopleFromPosts.forEach(p => { if (!map.has(p.id)) map.set(p.id, { id: p.id, name: p.name, avatarUrl: p.avatarUrl }); });
    return Array.from(map.values());
  }, [addedContacts, peopleFromPosts]);

  const filteredPeople = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return combinedPeople;
    return combinedPeople.filter(p => {
      const byName = p.name.toLowerCase().includes(term);
      const tid = currentUser ? threadIdOf(currentUser.id, p.id) : '';
      const last = threads[tid]?.at(-1)?.content?.toLowerCase() || '';
      return byName || last.includes(term);
    });
  }, [combinedPeople, search, threads, currentUser]);

  useEffect(() => { setSelected(partner?.id || null); }, [partner?.id]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DM_KEY);
      setThreads(raw ? (JSON.parse(raw) as Record<string, Message[]>) : {});
    } catch { setThreads({}); }
  }, [open]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTACTS_KEY);
      setAddedContacts(raw ? (JSON.parse(raw) as Contact[]) : []);
    } catch { setAddedContacts([]); }
  }, [open]);

  useEffect(() => {
    if (!currentUser || !selected) { setMessages([]); return; }
    try {
      const tid = threadIdOf(currentUser.id, selected);
      setMessages(threads[tid] || []);
    } catch { setMessages([]); }
  }, [currentUser?.id, selected, threads]);

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

  const persistThreads = (next: Record<string, Message[]>) => {
    try {
      localStorage.setItem(DM_KEY, JSON.stringify(next));
      setThreads(next);
    } catch {}
  };

  const persistContacts = (next: Contact[]) => {
    try {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
      setAddedContacts(next);
    } catch {}
  };

  const send = () => {
    if (!currentUser || !selected || !input.trim()) return;
    const msg: Message = { id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, senderId: currentUser.id, content: input.trim(), createdAt: new Date().toISOString() };
    try {
      const tid = threadIdOf(currentUser.id, selected);
      const arr = threads[tid] ? threads[tid].slice() : [];
      arr.push(msg);
      const next = { ...threads, [tid]: arr };
      persistThreads(next);
      setInput('');
      const map = { ...onlineMap };
      if (map[selected]) map[selected].lastSeen = new Date().toISOString();
      localStorage.setItem(STATUS_KEY, JSON.stringify(map));
      setOnlineMap(map);
    } catch {}
  };

  const handleAttach = (files: FileList | null) => {
    if (!files || !currentUser || !selected) return;
    const items = Array.from(files).slice(0, 5);
    items.forEach((f, i) => {
      const msg: Message = { id: `${Date.now()+i}_${Math.random().toString(36).slice(2)}`, senderId: currentUser.id, content: `Sent an attachment: ${f.name}`, createdAt: new Date().toISOString() };
      const tid = threadIdOf(currentUser.id, selected);
      const arr = threads[tid] ? threads[tid].slice() : [];
      arr.push(msg);
      const next = { ...threads, [tid]: arr };
      persistThreads(next);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVoice = () => {
    if (!currentUser || !selected) return;
    const secs = Math.max(5, Math.floor(Math.random() * 30));
    const mm = Math.floor(secs / 60).toString();
    const ss = (secs % 60).toString().padStart(2, '0');
    const msg: Message = { id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, senderId: currentUser.id, content: `Voice message (${mm}:${ss})`, createdAt: new Date().toISOString() };
    const tid = threadIdOf(currentUser.id, selected);
    const arr = threads[tid] ? threads[tid].slice() : [];
    arr.push(msg);
    const next = { ...threads, [tid]: arr };
    persistThreads(next);
  };

  const lastMessageOf = (partnerId: string) => {
    if (!currentUser) return undefined;
    const tid = threadIdOf(currentUser.id, partnerId);
    const arr = threads[tid] || [];
    return arr[arr.length - 1];
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
    // ensure thread exists
    const tid = threadIdOf(currentUser.id, id);
    const arr = threads[tid] ? threads[tid].slice() : [];
    const nextThreads = { ...threads, [tid]: arr };
    persistThreads(nextThreads);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Messages</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[320px_minmax(0,1fr)] h-[70vh] gap-0">
          {/* Left: Contacts */}
          <div className="relative border-r flex flex-col">
            <div className="p-4 pb-2">
              <div className="text-lg font-semibold">Chats</div>
              <div className="mt-2">
                <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredPeople.map(p => {
                const last = lastMessageOf(p.id);
                return (
                  <button key={p.id} onClick={() => setSelected(p.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 ${selected === p.id ? 'bg-slate-100' : ''}`}>
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={(p as Contact).avatarUrl || undefined} />
                        <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${isOnline(p.id) ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm truncate">{p.name}</div>
                        {last && <div className="text-[11px] text-muted-foreground ml-2 whitespace-nowrap">{formatTime(last.createdAt)}</div>}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{last ? last.content : 'No messages yet'}</div>
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
              <div className="p-3 border-t bg-white">
                <div className="text-sm font-medium mb-2">Start a new chat</div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Contact name" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') createNewContact(); }} />
                  <Input placeholder="Avatar URL (optional)" value={newAvatar} onChange={(e) => setNewAvatar(e.target.value)} />
                </div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={() => { setNewChatOpen(false); setNewName(''); setNewAvatar(''); }}>Cancel</Button>
                  <Button onClick={createNewContact} disabled={!newName.trim()}>Create</Button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                // open inline new chat composer
                setNewChatOpen(prev => !prev);
                setSearch('');
              }}
              className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700"
              aria-label="New chat"
            >
              +
            </button>
          </div>

          {/* Right: Chat */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div>
                <div className="font-semibold">{selected ? combinedPeople.find(p => p.id === selected)?.name || 'Chat' : 'Select a person'}</div>
                {selected && (
                  <div className="text-xs text-muted-foreground">
                    {isOnline(selected) ? 'Online' : formatLastSeen(lastSeenFor(selected))}
                  </div>
                )}
              </div>
              {selected && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={combinedPeople.find(p => p.id === selected)?.avatarUrl || undefined} />
                  <AvatarFallback>{combinedPeople.find(p => p.id === selected)?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-slate-50/50">
              {messages.map(m => {
                const mine = m.senderId === currentUser?.id;
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                      <div>{m.content}</div>
                      <div className={`text-[10px] mt-1 ${mine ? 'text-blue-100' : 'text-slate-400'}`}>{formatTime(m.createdAt)}</div>
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
            </div>

            {/* Composer */}
            <div className="px-3 py-2 border-t flex items-center gap-2">
              <input ref={fileInputRef} type="file" className="hidden" multiple onChange={(e) => handleAttach(e.target.files)} />
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-2">
                  <div className="grid grid-cols-6 gap-1">
                    {emojis.map(e => (
                      <button key={e} className="text-xl hover:scale-110" onClick={() => setInput(prev => prev + e)}>{e}</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon" className="shrink-0" onClick={handleVoice} disabled={!selected}>
                <Mic className="h-4 w-4" />
              </Button>
              <Input placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
              <Button onClick={send} disabled={!selected || !input.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="h-4 w-4 mr-1" /> Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesModal;
