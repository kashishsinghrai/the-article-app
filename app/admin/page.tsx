import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  FileText,
  Users,
  Activity,
  Zap,
  MessageCircle,
  ArrowLeft,
  Radio,
  Eye,
  ChevronRight,
  Trash2,
  ShieldCheck,
  Mail,
  User2,
  MapPin,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Article, Profile, LiveMessage } from "../../types";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

interface AdminPageProps {
  articles: Article[];
  users: Profile[];
  currentUserId: string;
}

const AdminPage: React.FC<AdminPageProps> = ({
  articles: initialArticles,
  users: initialUsers,
  currentUserId,
}) => {
  const [activeTab, setActiveTab] = useState<
    "monitor" | "articles" | "users" | "intercept"
  >("monitor");
  const [searchTerm, setSearchTerm] = useState("");
  const [intercepts, setIntercepts] = useState<any[]>([]);
  const [activeInterception, setActiveInterception] = useState<string | null>(
    null
  );
  const [interceptedMessages, setInterceptedMessages] = useState<LiveMessage[]>(
    []
  );

  // Local state for immediate UI feedback after deletion
  const [localArticles, setLocalArticles] =
    useState<Article[]>(initialArticles);
  const [localUsers, setLocalUsers] = useState<Profile[]>(initialUsers);

  useEffect(() => {
    setLocalArticles(initialArticles);
  }, [initialArticles]);

  useEffect(() => {
    setLocalUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    const channel = supabase.channel("admin_oversight");
    channel
      .on("broadcast", { event: "intercept_pulse" }, (p) => {
        setIntercepts((prev) => {
          const exists = prev.find((i) => i.room === p.payload.room);
          if (exists) return prev;
          return [...prev, p.payload];
        });

        if (activeInterception === p.payload.room) {
          setInterceptedMessages((prev) => [...prev, p.payload]);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [activeInterception]);

  const joinIntercept = (room: string) => {
    setActiveInterception(room);
    setInterceptedMessages([]);
    toast(`Interception Active: Channel ${room.substring(5, 12)}`, {
      icon: "🎧",
      style: {
        background: "#dc2626",
        color: "#fff",
        fontSize: "10px",
        textTransform: "uppercase",
        fontWeight: "bold",
      },
    });
  };

  const handleDeleteArticle = async (id: string) => {
    const confirm = window.confirm(
      "RECALL REPORT: Are you sure you want to permanently remove this intel from the network?"
    );
    if (!confirm) return;

    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
      setLocalArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Intel Recalled Successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUserId) {
      toast.error("Cannot terminate root admin node.");
      return;
    }
    const confirm = window.confirm(
      "TERMINATE NODE: This will remove the operator's profile and credentials. Continue?"
    );
    if (!confirm) return;

    try {
      // First delete profile from DB
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
      setLocalUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Node Terminated and Blacklisted");
    } catch (err: any) {
      toast.error(err.message);
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

  return (
    <main className="px-4 py-24 mx-auto space-y-12 max-w-7xl md:px-8 md:py-32">
      <div className="flex flex-col items-start justify-between gap-8 pb-12 border-b lg:flex-row border-slate-100 dark:border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Operations Control
            </span>
          </div>
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-8xl dark:text-white">
            TERMINAL
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Root Administrative Access Active
          </p>
        </div>

        <div className="w-full px-4 pb-2 -mx-4 overflow-x-auto lg:w-auto scrollbar-hide lg:p-0 lg:overflow-visible">
          <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl min-w-max shadow-sm">
            <TabButton
              active={activeTab === "monitor"}
              onClick={() => setActiveTab("monitor")}
              label="System Pulse"
              icon={<Activity size={14} />}
            />
            <TabButton
              active={activeTab === "intercept"}
              onClick={() => setActiveTab("intercept")}
              label="Intercept"
              icon={<Radio size={14} />}
            />
            <TabButton
              active={activeTab === "articles"}
              onClick={() => setActiveTab("articles")}
              label="Intel Index"
              icon={<FileText size={14} />}
            />
            <TabButton
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
              label="Node Registry"
              icon={<Users size={14} />}
            />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {activeTab === "monitor" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MonitorCard
              label="Total Intelligence"
              value={localArticles.length}
              desc="Active Broadcasts"
            />
            <MonitorCard
              label="Registered Nodes"
              value={localUsers.length}
              desc="Verified Operators"
            />
            <MonitorCard
              label="Network Load"
              value="Optimal"
              color="text-emerald-500"
              desc="1.2ms Response"
            />
            <MonitorCard
              label="Security Status"
              value="GUARDED"
              color="text-blue-500"
              desc="P2P Shields Up"
            />
          </div>
        )}

        {(activeTab === "articles" || activeTab === "users") && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 px-6 py-4 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
              <Search size={18} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow text-xs font-bold tracking-widest uppercase bg-transparent border-none outline-none dark:text-white"
                placeholder={`FILTERING ${activeTab.toUpperCase()} DATABASE...`}
              />
            </div>

            {activeTab === "users" && (
              <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <th className="px-8 py-5">Node Identity</th>
                        <th className="px-8 py-5">Contact / Email</th>
                        <th className="px-8 py-5">Gender</th>
                        <th className="px-8 py-5">Standing</th>
                        <th className="px-8 py-5 text-right">Protocol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                                <User2 size={18} />
                              </div>
                              <div>
                                <p className="text-xs font-black uppercase dark:text-white">
                                  {user.full_name}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400">
                                  @{user.username}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                              {user.serial_id}
                            </p>
                            <p className="text-[10px] font-bold text-blue-600">
                              {user.role.toUpperCase()}
                            </p>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                              {user.gender}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                Active
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                              title="Terminate Node"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && (
                  <div className="flex flex-col items-center gap-4 py-20 text-center opacity-20">
                    <Users size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      No matching nodes found
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "articles" && (
              <div className="grid grid-cols-1 gap-6 pb-20 md:grid-cols-2">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          {article.category}
                        </span>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 transition-all rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h3 className="text-xl italic font-black uppercase dark:text-white line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-400">
                          ID
                        </div>
                        <p className="text-[10px] font-bold text-slate-500">
                          Node: {article.author_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50 dark:border-white/5">
                      <span className="text-[9px] font-bold text-slate-300 uppercase">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2 text-blue-600">
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Audit Intel
                        </span>
                        <ExternalLink size={12} />
                      </div>
                    </div>
                  </div>
                ))}
                {filteredArticles.length === 0 && (
                  <div className="flex flex-col items-center gap-4 py-20 text-center col-span-full opacity-20">
                    <FileText size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Intel Index empty
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "intercept" && (
          <div className="grid grid-cols-1 gap-8 pb-20 lg:grid-cols-12 md:gap-12">
            <div className="space-y-6 lg:col-span-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" /> Live Signal Map
                </h3>
                <span className="text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded uppercase">
                  {intercepts.length} ACTIVE
                </span>
              </div>

              {intercepts.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-center opacity-30 flex flex-col items-center gap-4">
                  <RefreshCw size={24} className="animate-spin" />
                  <p className="text-[9px] font-black uppercase tracking-widest">
                    Scanning Network Pulses...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {intercepts.map((i, idx) => (
                    <button
                      key={idx}
                      onClick={() => joinIntercept(i.room)}
                      className={`w-full p-6 rounded-[2rem] border transition-all flex justify-between items-center text-left ${
                        activeInterception === i.room
                          ? "bg-red-600 border-red-600 text-white shadow-xl scale-[1.02]"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-red-200"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-2">
                          Signal #{i.room.substring(5, 10)}
                        </p>
                        <div className="flex items-center gap-3">
                          <p className="text-xs italic font-black uppercase truncate">
                            {i.node1}
                          </p>
                          <div className="w-2 h-px bg-current opacity-30" />
                          <p className="text-xs italic font-black uppercase truncate">
                            {i.node2}
                          </p>
                        </div>
                      </div>
                      <div className="p-2 bg-white/10 rounded-xl">
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 bg-slate-950 rounded-[3rem] p-8 min-h-[500px] flex flex-col border border-white/10 shadow-2xl relative overflow-hidden">
              {/* OLED Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

              <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                    INTERCEPT FEED
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[8px] font-mono text-slate-500 uppercase">
                    CHANNEL: {activeInterception?.substring(5, 16) || "NULL"}
                  </span>
                </div>
              </div>

              <div className="flex-grow space-y-6 overflow-y-auto max-h-[400px] custom-scrollbar px-2">
                {interceptedMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-5 duration-300 border bg-white/5 rounded-2xl border-white/5 animate-in slide-in-from-bottom-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={12} className="text-red-600" />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                          {m.senderName}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-600 uppercase">
                        {new Date(m.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-300 font-medium leading-relaxed italic">
                      "{m.text}"
                    </p>
                  </div>
                ))}
                {!activeInterception && (
                  <div className="flex flex-col items-center justify-center h-full py-24 text-center opacity-20">
                    <ShieldAlert size={48} className="mb-6 text-white" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white max-w-[200px]">
                      PENDING SELECTION OF LIVE PULSE SIGNAL
                    </p>
                  </div>
                )}
              </div>

              {activeInterception && (
                <div className="flex items-center gap-4 p-4 mt-8 border bg-red-950/20 border-red-900/30 rounded-2xl">
                  <Activity size={16} className="text-red-500 animate-pulse" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-red-400">
                    Recording live transmission hash for compliance audit...
                  </p>
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
  <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] space-y-3 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all">
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <p
      className={`text-4xl font-black dark:text-white uppercase italic tracking-tighter ${
        color || ""
      }`}
    >
      {value}
    </p>
    <p className="text-[10px] font-bold text-slate-400 italic">{desc}</p>
  </div>
);

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
      active
        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl scale-105 z-10 border border-slate-100 dark:border-slate-700"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon}
    {label}
  </button>
);

export default AdminPage;
