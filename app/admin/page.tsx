import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ShieldAlert,
  Search,
  FileText,
  Users,
  Activity,
  Zap,
  Radio,
  ChevronRight,
  Trash2,
  ShieldCheck,
  User2,
  ExternalLink,
  RefreshCw,
  LogOut,
  Shield,
  Globe,
  Lock,
  Terminal as TerminalIcon,
  Mail,
  Smartphone,
  Key,
  Camera,
  Mic,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Article, Profile, LiveMessage } from "../../types";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

interface AdminPageProps {
  articles: Article[];
  users: Profile[];
  currentUserId: string;
  onUpdateUsers?: () => void;
  onLogout?: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  articles: initialArticles,
  users: initialUsers,
  currentUserId,
  onUpdateUsers,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    "monitor" | "articles" | "users" | "intercept"
  >("monitor");
  const [searchTerm, setSearchTerm] = useState("");
  const [intercepts, setIntercepts] = useState<any[]>([]);
  const [activeInterception, setActiveInterception] = useState<string | null>(
    null
  );
  const [allRoomMessages, setAllRoomMessages] = useState<
    Record<string, LiveMessage[]>
  >({});
  const [localArticles, setLocalArticles] =
    useState<Article[]>(initialArticles);
  const [localUsers, setLocalUsers] = useState<Profile[]>(initialUsers);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalArticles(initialArticles);
    setLocalUsers(initialUsers);
  }, [initialArticles, initialUsers]);

  useEffect(() => {
    const channel = supabase.channel("admin_oversight");
    channel
      .on("broadcast", { event: "intercept_pulse" }, (p) => {
        setIntercepts((prev) => {
          const exists = prev.find((i) => i.room === p.payload.room);
          if (exists) return prev;
          return [...prev, p.payload];
        });

        if (p.payload.text && p.payload.id) {
          setAllRoomMessages((prev) => {
            const roomMsgs = prev[p.payload.room] || [];
            if (roomMsgs.find((m) => m.id === p.payload.id)) return prev;
            return {
              ...prev,
              [p.payload.room]: [
                ...roomMsgs,
                {
                  id: p.payload.id,
                  senderId: p.payload.senderId,
                  senderName: p.payload.senderName,
                  text: p.payload.text,
                  timestamp: p.payload.timestamp,
                },
              ],
            };
          });
        }
      })
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [allRoomMessages, activeInterception]);

  const joinIntercept = (room: string) => {
    setActiveInterception(room);
    toast(`MONITORING: CHANNEL ${room.substring(5, 12)}`, {
      icon: "🎧",
      style: {
        background: "#000",
        border: "1px solid #1d4ed8",
        color: "#fff",
        fontSize: "10px",
        textTransform: "uppercase",
        fontWeight: "black",
      },
    });
  };

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    if (userId === currentUserId)
      return toast.error("ROOT NODE PROTECTION ACTIVE.");
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);
      if (error) throw error;
      toast.success(`CLEARANCE UPDATED: ${newRole.toUpperCase()}`);
      if (onUpdateUsers) onUpdateUsers();
    } catch (err: any) {
      toast.error("SYNCHRONIZATION FAILURE");
    }
  };

  const filteredUsers = useMemo(() => {
    return localUsers.filter(
      (u) =>
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.serial_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localUsers, searchTerm]);

  const filteredArticles = useMemo(() => {
    return localArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.author_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localArticles, searchTerm]);

  const currentRoomMessages = activeInterception
    ? allRoomMessages[activeInterception] || []
    : [];

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-8 md:space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col items-start justify-between gap-8 pb-10 border-b lg:flex-row border-slate-100 dark:border-slate-800">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 animate-pulse">
            <ShieldAlert size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Root Operations Terminal
            </span>
          </div>
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase sm:text-7xl md:text-8xl dark:text-white">
            COMMAND
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Access Verified: Root Level
            </span>
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
              <TabButton
                active={activeTab === "monitor"}
                onClick={() => setActiveTab("monitor")}
                label="System"
                icon={<Activity size={14} />}
              />
              <TabButton
                active={activeTab === "intercept"}
                onClick={() => setActiveTab("intercept")}
                label="Signals"
                icon={<Radio size={14} />}
              />
              <TabButton
                active={activeTab === "articles"}
                onClick={() => setActiveTab("articles")}
                label="Articles"
                icon={<FileText size={14} />}
              />
              <TabButton
                active={activeTab === "users"}
                onClick={() => setActiveTab("users")}
                label="Registry"
                icon={<Users size={14} />}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {activeTab === "monitor" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MonitorCard
              label="Broadcast Volume"
              value={localArticles.length}
              desc="Active Intelligence"
            />
            <MonitorCard
              label="Verified Nodes"
              value={localUsers.length}
              desc="Operator Registry"
            />
            <MonitorCard
              label="Network Latency"
              value="0.4ms"
              color="text-emerald-500"
              desc="Secure Proxy Ready"
            />
            <MonitorCard
              label="Security state"
              value="LOCKDOWN"
              color="text-blue-500"
              desc="Admin Oversight Active"
            />

            <div className="lg:col-span-4 bg-slate-950 rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TerminalIcon size={120} className="text-white" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                    Live Operations Log
                  </h3>
                </div>
                <div className="font-mono text-[11px] space-y-2 text-slate-400">
                  <p>
                    <span className="text-emerald-500">[OK]</span> Node
                    integrity verified.
                  </p>
                  <p>
                    <span className="text-blue-500">[INFO]</span> Permission
                    auditing system enabled.
                  </p>
                  <p>
                    <span className="text-amber-500">[WARN]</span> Restricted
                    metadata fetch initiated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 px-8 py-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-600 transition-all">
              <Search size={20} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] outline-none flex-grow dark:text-white"
                placeholder="FILTERING REGISTRY BY HASH OR SERIAL..."
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 group hover:border-red-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400">
                        <User2 size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black leading-tight uppercase dark:text-white">
                          {user.full_name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 italic">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-lg border ${
                        user.role === "admin"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-slate-50 text-slate-400 border-slate-100"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="py-6 space-y-4 border-y border-slate-50 dark:border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                      Permission Audit
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <PermissionIndicator
                        active={user.settings?.camera_access}
                        icon={<Camera size={12} />}
                        label="CAM"
                      />
                      <PermissionIndicator
                        active={user.settings?.mic_access}
                        icon={<Mic size={12} />}
                        label="MIC"
                      />
                      <PermissionIndicator
                        active={user.settings?.location_access}
                        icon={<MapPin size={12} />}
                        label="GEO"
                      />
                      <PermissionIndicator
                        active={user.settings?.storage_access}
                        icon={<CheckCircle2 size={12} />}
                        label="FS"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleAdmin(user.id, user.role)}
                      className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Shield
                        size={14}
                        className={
                          user.role === "admin"
                            ? "text-red-500"
                            : "text-blue-500"
                        }
                      />
                      Toggle Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "intercept" && (
          <div className="grid grid-cols-1 gap-12 pb-20 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                  <Zap size={16} className="text-amber-500 animate-pulse" />{" "}
                  Signal Waves
                </h3>
                <span className="text-[9px] font-black text-white bg-red-600 px-3 py-1 rounded-full uppercase tracking-widest">
                  {intercepts.length} Direct
                </span>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {intercepts.map((i, idx) => (
                  <button
                    key={idx}
                    onClick={() => joinIntercept(i.room)}
                    className={`w-full p-8 rounded-[2.5rem] border transition-all flex justify-between items-center text-left ${
                      activeInterception === i.room
                        ? "bg-red-600 border-red-600 text-white shadow-2xl scale-[1.02]"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <div className="space-y-2 overflow-hidden">
                      <p
                        className={`text-[9px] font-black uppercase tracking-[0.3em] ${
                          activeInterception === i.room
                            ? "text-white/60"
                            : "text-slate-400"
                        }`}
                      >
                        HASH: {i.room.substring(5, 12)}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-black uppercase italic truncate max-w-[100px]">
                          {i.node1}
                        </p>
                        <div
                          className={`w-6 h-px ${
                            activeInterception === i.room
                              ? "bg-white/40"
                              : "bg-slate-200"
                          }`}
                        />
                        <p className="text-sm font-black uppercase italic truncate max-w-[100px]">
                          {i.node2}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-950 rounded-[3rem] p-8 md:p-12 min-h-[500px] flex flex-col border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.9)]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">
                    INTERCEPT FEED
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase italic">
                  STATUS: DECRYPTING
                </span>
              </div>
              <div
                ref={chatScrollRef}
                className="flex-grow space-y-6 overflow-y-auto max-h-[400px] custom-scrollbar px-2"
              >
                {currentRoomMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-6 duration-300 border bg-white/5 rounded-3xl border-white/5 animate-in slide-in-from-bottom-2"
                  >
                    <p className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-2">
                      {m.senderName}
                    </p>
                    <p className="text-[13px] text-slate-300 font-medium italic opacity-80">
                      "{m.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const PermissionIndicator = ({ active, icon, label }: any) => (
  <div
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${
      active
        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20"
        : "bg-slate-50 text-slate-300 border-slate-100 dark:bg-slate-900"
    }`}
  >
    {icon} {label}
  </div>
);

const MonitorCard = ({ label, value, color, desc }: any) => (
  <div className="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] space-y-4 shadow-sm group">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-blue-600 transition-colors">
      {label}
    </p>
    <p
      className={`text-5xl font-black dark:text-white uppercase italic tracking-tighter ${
        color || ""
      }`}
    >
      {value}
    </p>
    <p className="text-[10px] font-bold text-slate-400 italic uppercase">
      {desc}
    </p>
  </div>
);

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
      active
        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl scale-105 z-10 border"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon} {label}
  </button>
);

export default AdminPage;
