import React, { useState, useMemo, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  Users,
  Activity,
  RefreshCw,
  Fingerprint,
  Radio,
  Newspaper,
  LogOut,
  Camera,
  Mic,
  Smartphone,
  ShieldCheck,
  MapPin,
  Eye as EyeIcon,
  MessageSquare,
  Zap,
  Target,
} from "lucide-react";
import { Article, Profile, ChatRequest } from "../../types";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import ChatOverlay from "../../components/ChatOverlay.tsx";

interface AdminPageProps {
  articles: Article[];
  users: Profile[];
  currentUserId: string;
  onUpdateUsers?: () => void;
  onUpdateArticles?: () => void;
  onLogout?: () => void;
}

const StatItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-slate-950 p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/5 space-y-4 hover:scale-[1.02] transition-transform shadow-sm">
    <div className="p-3 text-blue-500 border bg-slate-50 dark:bg-slate-900 w-fit rounded-2xl border-slate-100 dark:border-white/5">
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-3xl italic font-black leading-none tracking-tighter uppercase text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const HardwareNode = ({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) => (
  <div
    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
      active
        ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-500"
        : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-300 dark:text-slate-700"
    }`}
  >
    {icon}
    <span className="text-[7px] font-black uppercase tracking-widest">
      {label}
    </span>
  </div>
);

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
  const [activeSignals, setActiveSignals] = useState<any[]>([]);
  const [interceptChat, setInterceptChat] = useState<{
    profile: Profile;
    handshakeId: string;
  } | null>(null);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.serial_id.includes(searchTerm)
      ),
    [users, searchTerm]
  );

  useEffect(() => {
    if (activeTab === "intercepts") {
      const fetchSignals = async () => {
        const { data } = await supabase
          .from("chat_requests")
          .select(
            "*, from_node:from_id(id, full_name, serial_id, avatar_url), to_node:to_id(id, full_name, serial_id, avatar_url)"
          )
          .eq("status", "accepted")
          .order("created_at", { ascending: false });
        if (data) setActiveSignals(data);
      };
      fetchSignals();

      // Real-time listener for new signals
      const channel = supabase
        .channel("admin_signals")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chat_requests",
            filter: "status=eq.accepted",
          },
          () => {
            fetchSignals();
            toast("New Node Connection Detected", { icon: "🔔" });
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [activeTab]);

  const handleDeleteUser = async (id: string) => {
    if (id === currentUserId) return toast.error("SELF-PURGE PROTECTED.");
    if (confirm("🚨 PURGE IDENTITY: Remove node from registry?")) {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (!error) {
        toast.success("Identity Purged.");
        onUpdateUsers?.();
      }
    }
  };

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-24 md:py-32 space-y-12">
      <div className="flex flex-col items-start justify-between gap-8 pb-10 border-b border-slate-100 dark:border-white/5 lg:flex-row">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 animate-pulse">
            <ShieldAlert size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              ROOT COMMAND TERMINAL
            </span>
          </div>
          <h1 className="text-6xl italic font-black leading-none tracking-tighter uppercase md:text-9xl text-slate-900 dark:text-white">
            ROOT
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-400">
                Totalitarian Bypass: Active
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
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem]">
          {["monitor", "intercepts", "articles", "users"].map((tab: any) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "intercepts" ? "Signals" : tab}
            </button>
          ))}
          <button
            onClick={async () => {
              setIsSyncing(true);
              await onUpdateUsers?.();
              setIsSyncing(false);
            }}
            className="p-3 text-blue-600 transition-transform hover:scale-110"
          >
            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 px-8 py-5 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 focus-within:ring-2 focus-within:ring-red-600/30 transition-all shadow-sm">
        <Search size={20} className="text-slate-300" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-[11px] font-black uppercase outline-none flex-grow text-slate-950 dark:text-white"
          placeholder="QUERYING DATABASE..."
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
                  <div className="flex items-center justify-center w-12 h-12 border bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-white/5 text-slate-300">
                    <Fingerprint size={24} />
                  </div>
                  <div>
                    <p className="font-black leading-none uppercase text-slate-950 dark:text-white">
                      {u.full_name}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 italic">
                      @{u.username} // {u.serial_id}
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-lg text-[8px] font-black uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-500">
                  Live
                </div>
              </div>
              <div className="p-6 space-y-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                <p className="text-[8px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-white/5 pb-2">
                  Surveillance
                </p>
                <div className="grid grid-cols-4 gap-4">
                  <HardwareNode
                    icon={<Camera size={14} />}
                    label="CAM"
                    active={true}
                  />
                  <HardwareNode
                    icon={<Mic size={14} />}
                    label="MIC"
                    active={true}
                  />
                  <HardwareNode
                    icon={<MapPin size={14} />}
                    label="GPS"
                    active={true}
                  />
                  <HardwareNode
                    icon={<Smartphone size={14} />}
                    label="DATA"
                    active={true}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  className="flex-1 py-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all border border-red-100"
                >
                  Purge
                </button>
                <button className="flex-[3] py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:opacity-90">
                  <ShieldCheck size={14} /> Inspect Node
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "intercepts" && (
        <div className="bg-slate-950 rounded-[3rem] border border-white/5 p-10 space-y-8 animate-in slide-in-from-bottom-4 duration-500 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <Radio className="text-red-500 animate-pulse" />
              <h3 className="text-xl italic font-black tracking-tighter text-white uppercase">
                Live Signal Intercepts
              </h3>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {activeSignals.length} Active Pairs
            </span>
          </div>

          <div className="space-y-4">
            {activeSignals.length === 0 ? (
              <div className="py-20 space-y-4 text-center opacity-30">
                <Zap size={48} className="mx-auto text-slate-500" />
                <p className="text-xs font-black uppercase tracking-[0.4em] text-white">
                  No Communications Detected
                </p>
              </div>
            ) : (
              activeSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="flex flex-col items-center justify-between gap-6 p-6 transition-all border md:flex-row bg-white/5 border-white/5 rounded-2xl group hover:bg-white/10"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden border rounded-xl bg-slate-800 border-white/10">
                        {signal.from_node?.avatar_url && (
                          <img
                            src={signal.from_node.avatar_url}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase">
                          {signal.from_node?.full_name}
                        </span>
                        <span className="text-[8px] font-bold text-slate-500">
                          {signal.from_node?.serial_id}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <Target
                        size={14}
                        className="text-red-600 animate-pulse"
                      />
                      <div className="w-12 h-px mt-2 bg-white/10" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] font-black text-white uppercase">
                          {signal.to_node?.full_name}
                        </span>
                        <span className="text-[8px] font-bold text-slate-500">
                          {signal.to_node?.serial_id}
                        </span>
                      </div>
                      <div className="w-10 h-10 overflow-hidden border rounded-xl bg-slate-800 border-white/10">
                        {signal.to_node?.avatar_url && (
                          <img
                            src={signal.to_node.avatar_url}
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 bg-red-950 text-red-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-red-500/20">
                      Active Transmission
                    </div>
                    <button
                      onClick={() => {
                        setInterceptChat({
                          profile: signal.to_node,
                          handshakeId: signal.id,
                        });
                        toast.success("Broadcast Channel Intercepted");
                      }}
                      className="px-6 py-2.5 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                    >
                      <EyeIcon size={14} /> Intercept
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "monitor" && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <StatItem
            label="Active Nodes"
            value={users.length}
            icon={<Users />}
          />
          <StatItem
            label="Global Reports"
            value={articles.length}
            icon={<Newspaper />}
          />
          <StatItem
            label="Clearance"
            value="LEVEL_ROOT"
            icon={<ShieldCheck />}
          />
          <StatItem
            label="Active Signals"
            value={activeSignals.length}
            icon={<Activity />}
          />
        </div>
      )}

      {/* Fix: Removed non-existent isAdminMode prop which caused a TypeScript error */}
      {interceptChat && (
        <ChatOverlay
          recipient={interceptChat.profile}
          currentUserId="admin-surveillance"
          handshakeId={interceptChat.handshakeId}
          onClose={() => setInterceptChat(null)}
        />
      )}
    </main>
  );
};

export default AdminPage;
