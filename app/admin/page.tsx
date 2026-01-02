import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  FileText,
  Users,
  Activity,
  Zap,
  Trash2,
  RefreshCw,
  Code,
  Fingerprint,
  MessageSquare,
  Power,
  Newspaper,
  LogOut,
  Camera,
  Mic,
  Smartphone,
  Eye,
  EyeOff,
  ShieldCheck,
  Database,
  Radio,
  MapPin,
  List,
  Eye as EyeIcon,
} from "lucide-react";
import { Article, Profile } from "../../types";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

interface AdminPageProps {
  articles: Article[];
  users: Profile[];
  currentUserId: string;
  onUpdateUsers?: () => void;
  onUpdateArticles?: () => void;
  onLogout?: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  articles,
  users,
  currentUserId,
  onUpdateUsers,
  onUpdateArticles,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    "monitor" | "intercepts" | "articles" | "users"
  >("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredArticles = useMemo(
    () =>
      articles.filter((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [articles, searchTerm]
  );
  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.serial_id.includes(searchTerm)
      ),
    [users, searchTerm]
  );

  const forceResync = async () => {
    setIsSyncing(true);
    if (onUpdateArticles) await onUpdateArticles();
    if (onUpdateUsers) await onUpdateUsers();
    setIsSyncing(false);
    toast.success("Root Re-Sync Complete");
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUserId)
      return toast.error("SELF-PURGE PROTECTION ACTIVE.");
    if (
      confirm(
        "🚨 PERMANENT IDENTITY PURGE: Are you sure you want to erase this node from the global network?"
      )
    ) {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (!error) {
        toast.success("Identity Purged.");
        onUpdateUsers?.();
      } else {
        toast.error("Identity Protection Active. Check RLS.");
      }
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm("🚨 PURGE DISPATCH: Erase this report from the global feed?")) {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (!error) {
        toast.success("Dispatch Erased.");
        onUpdateArticles?.();
      } else {
        toast.error("Dispatch Locked.");
      }
    }
  };

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-24 md:py-32 space-y-12">
      <div className="flex flex-col items-start justify-between gap-8 pb-10 border-b lg:flex-row border-slate-100 dark:border-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 animate-pulse">
            <ShieldAlert size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              ROOT COMMAND TERMINAL
            </span>
          </div>
          <h1 className="text-6xl italic font-black leading-none tracking-tighter uppercase md:text-9xl dark:text-white">
            ROOT
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                Platform Bypass: Active
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-500 transition-colors hover:text-red-700"
            >
              <LogOut size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Kill Session
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-sm">
          <TabButton
            active={activeTab === "monitor"}
            onClick={() => setActiveTab("monitor")}
            label="System"
            icon={<Activity size={14} />}
          />
          <TabButton
            active={activeTab === "intercepts"}
            onClick={() => setActiveTab("intercepts")}
            label="Signals"
            icon={<Radio size={14} />}
          />
          <TabButton
            active={activeTab === "articles"}
            onClick={() => setActiveTab("articles")}
            label="Feeds"
            icon={<Newspaper size={14} />}
          />
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            label="Registry"
            icon={<Users size={14} />}
          />
          <button
            onClick={forceResync}
            className="p-3 text-blue-600 transition-transform hover:scale-110"
          >
            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 px-8 py-5 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm focus-within:ring-2 focus-within:ring-red-500 transition-all">
        <Search size={20} className="text-slate-300" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-[11px] font-black uppercase tracking-[0.3em] outline-none flex-grow dark:text-white placeholder:text-slate-200"
          placeholder="QUERING GLOBAL DATABASE..."
        />
      </div>

      {activeTab === "users" && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-6 hover:border-red-600/50 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 border bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-white/5">
                    <Fingerprint size={24} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="font-black leading-none tracking-tight uppercase text-slate-900 dark:text-white">
                      {u.full_name}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 italic">
                      @{u.username} // {u.serial_id}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${
                    u.is_online
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {u.is_online ? "ONLINE" : "IDLE"}
                </div>
              </div>

              <div className="p-6 space-y-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-white/5 pb-2">
                  Remote Node Surveillance
                </p>
                <div className="grid grid-cols-4 gap-4">
                  <HardwareNode
                    icon={<Camera size={14} />}
                    label="CAM"
                    active={u.is_online}
                  />
                  <HardwareNode
                    icon={<Mic size={14} />}
                    label="MIC"
                    active={u.is_online}
                  />
                  <HardwareNode
                    icon={<MapPin size={14} />}
                    label="GPS"
                    active={u.is_online}
                  />
                  <HardwareNode
                    icon={<Smartphone size={14} />}
                    label="DATA"
                    active={u.is_online}
                    onClick={() =>
                      toast.success(
                        `Extracted ${Math.floor(
                          Math.random() * 500
                        )} local contacts from mobile.`
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  className="flex-1 py-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-900/30"
                >
                  PURGE
                </button>
                <button
                  onClick={() => toast.success("Identity Verified.")}
                  className="flex-[3] py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={14} /> INSPECT PROFILE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "intercepts" && (
        <div className="bg-slate-950 rounded-[3rem] border border-white/10 p-10 space-y-8 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <Radio className="text-red-500 animate-pulse" />
              <h3 className="font-black text-white uppercase tracking-[0.3em]">
                Live Signal Intercepts
              </h3>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase">
              Monitoring 128 Active Comms Channels
            </span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-6 transition-all border bg-white/5 rounded-2xl border-white/5 hover:bg-white/10 cursor-crosshair group"
              >
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      NODE_
                      {Math.random().toString(36).substr(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div className="w-12 h-px transition-colors bg-white/10 group-hover:bg-red-500" />
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      NODE_
                      {Math.random().toString(36).substr(2, 4).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    LATENCY: 1.{i}ms
                  </span>
                  <button
                    onClick={() =>
                      toast(
                        "Signal Decryption Initiated. Monitoring Live Stream...",
                        { icon: "🔐" }
                      )
                    }
                    className="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all"
                  >
                    INTERCEPT CHAT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "articles" && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-slate-950 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 space-y-4 shadow-sm hover:border-blue-500/30 transition-all"
            >
              <div className="overflow-hidden border aspect-video rounded-3xl bg-slate-900 border-slate-100 dark:border-white/5">
                <img
                  src={a.image_url}
                  className="object-cover w-full h-full transition-opacity opacity-70 group-hover:opacity-100"
                />
              </div>
              <div className="space-y-1">
                <h4 className="italic font-black leading-tight uppercase truncate text-slate-900 dark:text-white">
                  {a.title}
                </h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  AUTHOR: {a.author_name} // {a.category.toUpperCase()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteArticle(a.id)}
                  className="flex-1 py-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-900/30"
                >
                  PURGE FEED
                </button>
                <button className="flex-1 py-4 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <EyeIcon size={14} /> VIEW DISPATCH
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "monitor" && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <StatItem
            label="Active Nodes"
            value={users.length}
            icon={<Users className="text-blue-500" />}
          />
          <StatItem
            label="Global Dispatches"
            value={articles.length}
            icon={<Newspaper className="text-emerald-500" />}
          />
          <StatItem
            label="Root Clearance"
            value="LEVEL_MAX"
            icon={<ShieldCheck className="text-red-500" />}
          />
          <StatItem
            label="Network Health"
            value="OPTIMAL"
            icon={<Activity className="text-emerald-500" />}
          />
        </div>
      )}
    </main>
  );
};

const HardwareNode = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all group ${
      active
        ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white"
        : "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-30"
    }`}
  >
    {icon}
    <span className="text-[7px] font-black uppercase tracking-widest">
      {label}
    </span>
  </button>
);

const StatItem = ({ label, value, icon }: any) => (
  <div className="bg-white dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5 space-y-4 shadow-sm hover:scale-[1.02] transition-transform">
    <div className="p-3 border bg-slate-50 dark:bg-slate-900 w-fit rounded-2xl border-slate-100 dark:border-white/5">
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="text-3xl italic font-black leading-none tracking-tighter uppercase dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
      active
        ? "bg-white dark:bg-slate-800 text-red-600 shadow-xl border border-slate-100 dark:border-slate-700"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon} {label}
  </button>
);

export default AdminPage;
