
import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, Search, FileText, Users, Activity, Zap, Radio, ChevronRight, Trash2, ShieldCheck, User2, ExternalLink, RefreshCw, LogOut, Shield, Globe, Lock, Terminal as TerminalIcon, Mail, Smartphone, Key } from 'lucide-react';
import { Article, Profile, LiveMessage } from '../../types';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface AdminPageProps {
  articles: Article[];
  users: Profile[];
  currentUserId: string;
  onUpdateUsers?: () => void;
  onLogout?: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ articles: initialArticles, users: initialUsers, currentUserId, onUpdateUsers, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'articles' | 'users' | 'intercept'>('monitor');
  const [searchTerm, setSearchTerm] = useState('');
  const [intercepts, setIntercepts] = useState<any[]>([]);
  const [activeInterception, setActiveInterception] = useState<string | null>(null);
  const [interceptedMessages, setInterceptedMessages] = useState<LiveMessage[]>([]);
  
  const [localArticles, setLocalArticles] = useState<Article[]>(initialArticles);
  const [localUsers, setLocalUsers] = useState<Profile[]>(initialUsers);

  useEffect(() => {
    setLocalArticles(initialArticles);
    setLocalUsers(initialUsers);
  }, [initialArticles, initialUsers]);

  useEffect(() => {
    const channel = supabase.channel('admin_oversight');
    channel.on('broadcast', { event: 'intercept_pulse' }, (p) => {
      setIntercepts(prev => {
        const exists = prev.find(i => i.room === p.payload.room);
        if (exists) return prev;
        return [...prev, p.payload];
      });
      
      if (activeInterception === p.payload.room) {
        setInterceptedMessages(prev => [...prev, p.payload]);
      }
    }).subscribe();

    return () => { channel.unsubscribe(); };
  }, [activeInterception]);

  const joinIntercept = (room: string) => {
    setActiveInterception(room);
    setInterceptedMessages([]);
    toast(`INTERCEPT ACTIVE: CHANNEL ${room.substring(5, 12)}`, { 
      icon: '🎧',
      style: { background: '#000', border: '1px solid #dc2626', color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'black' }
    });
  };

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    if (userId === currentUserId) {
      toast.error("ROOT NODE PROTECTION: CANNOT MODIFY OWN CLEARANCE.");
      return;
    }

    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmText = `PROTOCOL CHANGE: ELEVATE NODE TO ADMIN STATUS?`;
    const revokeText = `PROTOCOL CHANGE: REVOKE ADMIN CLEARANCE?`;
    
    if (!window.confirm(currentRole === 'admin' ? revokeText : confirmText)) return;

    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      toast.success(`CLEARANCE UPDATED: ${newRole.toUpperCase()}`);
      onUpdateUsers?.();
    } catch (err: any) {
      toast.error("SYNCHRONIZATION FAILURE");
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm("RECALL INTEL: PERMANENTLY REMOVE BROADCAST?")) return;
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      setLocalArticles(prev => prev.filter(a => a.id !== id));
      toast.success("INTEL PURGED");
    } catch (err: any) {
      toast.error("PURGE INTERRUPTED");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUserId) return toast.error("CANNOT TERMINATE ROOT NODE");
    if (!window.confirm("TERMINATE NODE: BLACKLIST OPERATOR?")) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setLocalUsers(prev => prev.filter(u => u.id !== id));
      toast.success("NODE TERMINATED");
    } catch (err: any) {
      toast.error("TERMINATION FAILED");
    }
  };

  const filteredUsers = useMemo(() => {
    return localUsers.filter(u => 
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.serial_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localUsers, searchTerm]);

  const filteredArticles = useMemo(() => {
    return localArticles.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.author_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localArticles, searchTerm]);

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-8 md:space-y-12 animate-in fade-in duration-500">
       {/* Header Section */}
       <div className="flex flex-col items-start justify-between gap-8 pb-10 border-b lg:flex-row border-slate-100 dark:border-slate-800">
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-red-600 animate-pulse">
                <ShieldAlert size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Root Operations Terminal</span>
             </div>
             <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase sm:text-7xl md:text-8xl dark:text-white">COMMAND</h1>
             <div className="flex items-center gap-4">
               <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Access Verified: Root Level</span>
               <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />
               <span className="text-emerald-500 font-black uppercase text-[9px] tracking-widest flex items-center gap-1">
                 <Zap size={10} fill="currentColor" /> Active Sync
               </span>
             </div>
          </div>
          
          <div className="flex flex-col items-end w-full gap-4 sm:flex-row lg:flex-col lg:w-auto">
            <button 
              onClick={onLogout}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-red-600/10 text-red-600 border border-red-600/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <LogOut size={16} /> Terminate Root Session
            </button>
            
            <div className="w-full px-4 pb-2 -mx-4 overflow-x-auto lg:w-auto scrollbar-hide lg:p-0 lg:overflow-visible">
              <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl min-w-max shadow-sm">
                <TabButton active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} label="System" icon={<Activity size={14} />} />
                <TabButton active={activeTab === 'intercept'} onClick={() => setActiveTab('intercept')} label="Signals" icon={<Radio size={14} />} />
                <TabButton active={activeTab === 'articles'} onClick={() => setActiveTab('articles')} label="Articles" icon={<FileText size={14} />} />
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="Registry" icon={<Users size={14} />} />
              </div>
            </div>
          </div>
       </div>

       {/* Tab Content */}
       <div className="space-y-12">
          {activeTab === 'monitor' && (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <MonitorCard label="Broadcast Volume" value={localArticles.length} desc="Active Intelligence" />
                <MonitorCard label="Verified Nodes" value={localUsers.length} desc="Operator Registry" />
                <MonitorCard label="Network Latency" value="0.8ms" color="text-emerald-500" desc="Secure Proxy Ready" />
                <MonitorCard label="Security state" value="LOCKDOWN" color="text-blue-500" desc="Admin Oversight Active" />
                
                <div className="lg:col-span-4 bg-slate-950 rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                     <TerminalIcon size={120} className="text-white" />
                   </div>
                   <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Live Operations Log</h3>
                      </div>
                      <div className="font-mono text-[11px] space-y-2 text-slate-400">
                        <p><span className="text-emerald-500">[OK]</span> Handshake protocol validated.</p>
                        <p><span className="text-blue-500">[INFO]</span> Root admin session established from authorized range.</p>
                        <p><span className="text-amber-500">[WARN]</span> Accessing restricted member metadata ledger...</p>
                        <p><span className="text-slate-600">>> Decrypting operator contact protocols...</span></p>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {(activeTab === 'articles' || activeTab === 'users') && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 px-8 py-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-600 transition-all">
                <Search size={20} className="text-slate-400" />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] outline-none flex-grow dark:text-white" 
                  placeholder={`FILTERING ${activeTab.toUpperCase()} LEDGER (SEARCH BY NAME, EMAIL, OR SERIAL)...`} 
                />
              </div>

              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Desktop Full Detail Table */}
                  <div className="hidden xl:block bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-8 py-6">Operator Node</th>
                            <th className="px-8 py-6">Verified Email</th>
                            <th className="px-8 py-6">Contact Protocol</th>
                            <th className="px-8 py-6">Serial Index</th>
                            <th className="px-8 py-6">Clearance</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5 group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                                     <User2 size={18} />
                                   </div>
                                   <div>
                                     <p className="text-xs font-black uppercase dark:text-white">{user.full_name}</p>
                                     <p className="text-[9px] font-bold text-slate-400">@{user.username}</p>
                                   </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <Mail size={12} className="text-slate-300" />
                                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{user.email || 'NOT_VERIFIED'}</p>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <Smartphone size={12} className="text-slate-300" />
                                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{user.phone || 'NO_PROTO'}</p>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <Key size={12} className="text-slate-300" />
                                  <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 font-mono tracking-tighter">{user.serial_id}</p>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:border-red-900' : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                                  <button 
                                    onClick={() => handleToggleAdmin(user.id, user.role)}
                                    className={`p-3 rounded-xl transition-all ${user.role === 'admin' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                    title={user.role === 'admin' ? "Revoke Admin Clearance" : "Promote to Admin"}
                                  >
                                    <Shield size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-3 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                                    title="Terminate Node"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tablet/Mobile Responsive Full View */}
                  <div className="grid grid-cols-1 gap-6 xl:hidden md:grid-cols-2">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 group hover:border-red-500/30 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                             <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400">
                               <User2 size={24} />
                             </div>
                             <div>
                               <p className="text-sm font-black leading-tight uppercase dark:text-white">{user.full_name}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{user.serial_id}</p>
                             </div>
                          </div>
                          <span className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-lg border ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                            {user.role}
                          </span>
                        </div>
                        
                        <div className="py-6 space-y-4 border-y border-slate-50 dark:border-white/5">
                           <div className="flex items-center gap-3">
                              <Mail size={14} className="text-slate-400" />
                              <p className="text-xs font-bold dark:text-slate-300">{user.email || 'Email missing'}</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <Smartphone size={14} className="text-slate-400" />
                              <p className="text-xs font-bold dark:text-slate-300">{user.phone || 'Phone missing'}</p>
                           </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                           <button 
                             onClick={() => handleToggleAdmin(user.id, user.role)}
                             className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                           >
                             <Shield size={14} className={user.role === 'admin' ? 'text-red-500' : 'text-blue-500'} />
                             {user.role === 'admin' ? 'Revoke Clearance' : 'Promote Admin'}
                           </button>
                           <button 
                             onClick={() => handleDeleteUser(user.id)}
                             className="flex items-center justify-center text-red-500 transition-all w-14 h-14 bg-red-50 dark:bg-red-950/20 rounded-2xl hover:bg-red-600 hover:text-white"
                           >
                             <Trash2 size={20} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'articles' && (
                <div className="grid grid-cols-1 gap-6 pb-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between group hover:border-blue-500/30 transition-all">
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">{article.category}</span>
                          <button 
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 transition-all text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <h3 className="text-2xl italic font-black leading-tight tracking-tighter uppercase dark:text-white line-clamp-2">{article.title}</h3>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">ID</div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Op: {article.author_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-50 dark:border-white/5">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(article.created_at).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2 text-blue-600 transition-opacity opacity-0 group-hover:opacity-100">
                          <span className="text-[9px] font-black uppercase tracking-widest">Audit intel</span>
                          <ExternalLink size={12} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'intercept' && (
             <div className="grid grid-cols-1 gap-12 pb-20 lg:grid-cols-12">
                <div className="space-y-8 lg:col-span-5">
                   <div className="flex items-center justify-between">
                     <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                       <Zap size={16} className="text-amber-500 animate-pulse" /> Live Pulse Map
                     </h3>
                     <span className="text-[9px] font-black text-white bg-red-600 px-3 py-1 rounded-full uppercase tracking-widest">{intercepts.length} Active Waves</span>
                   </div>

                   {intercepts.length === 0 ? (
                     <div className="p-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] text-center opacity-30 flex flex-col items-center gap-6">
                        <RefreshCw size={48} className="animate-spin text-slate-300" />
                        <p className="text-[11px] font-black uppercase tracking-[0.3em]">Network Scanning Active...</p>
                     </div>
                   ) : (
                     <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {intercepts.map((i, idx) => (
                           <button 
                             key={idx} 
                             onClick={() => joinIntercept(i.room)}
                             className={`w-full p-8 rounded-[2.5rem] border transition-all flex justify-between items-center text-left ${activeInterception === i.room ? 'bg-red-600 border-red-600 text-white shadow-2xl scale-[1.02] z-10' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-red-200'}`}
                           >
                              <div className="space-y-2 overflow-hidden">
                                 <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${activeInterception === i.room ? 'text-white/60' : 'text-slate-400'}`}>Signal Hash: {i.room.substring(5, 12)}</p>
                                 <div className="flex items-center gap-4">
                                   <p className="text-sm font-black uppercase italic truncate max-w-[100px]">{i.node1}</p>
                                   <div className={`w-6 h-px ${activeInterception === i.room ? 'bg-white/40' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                   <p className="text-sm font-black uppercase italic truncate max-w-[100px]">{i.node2}</p>
                                 </div>
                              </div>
                              <div className={`p-3 rounded-2xl ${activeInterception === i.room ? 'bg-white/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
                                 <ChevronRight size={18} />
                              </div>
                           </button>
                        ))}
                     </div>
                   )}
                </div>

                <div className="lg:col-span-7 bg-slate-950 rounded-[3rem] p-8 md:p-12 min-h-[500px] flex flex-col border border-white/10 shadow-2xl relative overflow-hidden">
                   {/* Scanning Scanline Effect */}
                   <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                   
                   <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/10">
                      <div className="flex items-center gap-4">
                         <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.9)]" />
                         <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">LIVE FEED TERMINAL</span>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[10px] font-mono text-slate-500 uppercase">CHANNEL_ID: {activeInterception?.substring(5, 16) || 'NULL'}</span>
                         <span className="text-[8px] font-black text-red-500 uppercase tracking-widest pt-1">Decryption: Active</span>
                      </div>
                   </div>

                   <div className="flex-grow space-y-6 overflow-y-auto max-h-[400px] custom-scrollbar px-2 relative z-10">
                      {interceptedMessages.map((m, idx) => (
                         <div key={idx} className="p-6 duration-300 border bg-white/5 rounded-3xl border-white/5 animate-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between mb-3">
                               <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                                  <span className="text-[11px] font-black text-red-500 uppercase tracking-widest">{m.senderName}</span>
                               </div>
                               <span className="text-[9px] font-mono text-slate-600 uppercase italic">Packet: {new Date(m.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-[13px] text-slate-300 font-medium leading-relaxed italic opacity-80">"{m.text}"</p>
                         </div>
                      ))}
                      {!activeInterception && (
                         <div className="flex flex-col items-center justify-center h-full py-24 text-center opacity-20">
                            <ShieldAlert size={64} className="mb-8 text-white" />
                            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white max-w-[300px] leading-loose">SELECT A PULSE NODE FROM THE REGISTRY TO START DECRYPTION</p>
                         </div>
                      )}
                   </div>

                   {activeInterception && (
                      <div className="mt-8 p-6 bg-red-950/20 border border-red-900/30 rounded-[2rem] flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <Activity size={20} className="text-red-500 animate-pulse" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Signal Integrity Secured via Root Proxy</p>
                         </div>
                         <div className="flex gap-1">
                            {Array(5).fill(0).map((_, i) => (
                              <div key={i} className="w-1 h-3 rounded-full bg-red-600/40" style={{ height: `${Math.random() * 100}%` }} />
                            ))}
                         </div>
                      </div>
                   )}
                </div>
             </div>
          )}
       </div>
    </main>
  );
};

const MonitorCard = ({ label, value, color, desc }: any) => (
  <div className="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] space-y-4 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all group">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-blue-600 transition-colors">{label}</p>
      <Zap size={14} className="text-slate-200 dark:text-slate-800" />
    </div>
    <p className={`text-5xl font-black dark:text-white uppercase italic tracking-tighter ${color || ''}`}>{value}</p>
    <div className="flex items-center gap-2 pt-2">
       <div className="w-1 h-1 bg-blue-600 rounded-full" />
       <p className="text-[10px] font-bold text-slate-400 italic tracking-wide uppercase">{desc}</p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${active ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xl scale-105 z-10 border border-slate-100 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <span className={active ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
    {label}
  </button>
);

export default AdminPage;
