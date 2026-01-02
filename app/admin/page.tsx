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
  RefreshCw,
  LogOut,
  Shield,
  Terminal as TerminalIcon,
  Database,
  Newspaper,
  Code,
  Cpu,
  Power,
  MessageCircle,
  Fingerprint,
  Edit,
  X,
  Save,
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
    "monitor" | "articles" | "users" | "intercept" | "console"
  >("monitor");
  const [searchTerm, setSearchTerm] = useState("");
  const [intercepts, setIntercepts] = useState<any[]>([]);
  const [activeInterception, setActiveInterception] = useState<string | null>(
    null
  );
  const [allRoomMessages, setAllRoomMessages] = useState<
    Record<string, LiveMessage[]>
  >({});
  const [sqlCommand, setSqlCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "[SYSTEM] Root established...",
    "[INFO] Protocol V4.2 Active",
  ]);
  const [isLockdown, setIsLockdown] = useState(false);

  const [localArticles, setLocalArticles] =
    useState<Article[]>(initialArticles);
  const [localUsers, setLocalUsers] = useState<Profile[]>(initialUsers);

  // God-Mode Edit State
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

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
    if (chatScrollRef.current)
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [allRoomMessages, activeInterception]);

  useEffect(() => {
    if (terminalScrollRef.current)
      terminalScrollRef.current.scrollTop =
        terminalScrollRef.current.scrollHeight;
  }, [terminalOutput]);

  const runSqlCommand = async () => {
    if (!sqlCommand.trim()) return;
    const cmd = sqlCommand.trim();
    setTerminalOutput((prev) => [...prev, `> ${cmd}`]);
    setSqlCommand("");

    try {
      // Direct SQL execution via RPC (must exist in Supabase)
      const { data, error } = await (supabase as any).rpc("exec_sql", {
        sql_query: cmd,
      });
      if (error) {
        setTerminalOutput((prev) => [...prev, `[ERROR] ${error.message}`]);
      } else {
        setTerminalOutput((prev) => [
          ...prev,
          `[SUCCESS] Operation completed.`,
        ]);
        if (onUpdateUsers) onUpdateUsers();
      }
    } catch (err: any) {
      setTerminalOutput((prev) => [...prev, `[FATAL] ${err.message}`]);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUserId)
      return toast.error("ROOT PROTECTION: Self-termination blocked.");
    if (
      !confirm(
        "TERMINATE IDENTITY? This node and all its dispatches will be purged from the registry."
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      if (error) throw error;

      toast.success("IDENTITY PURGED");
      if (onUpdateUsers) onUpdateUsers();
    } catch (err: any) {
      toast.error("PURGE FAILED: " + err.message);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editingUser.full_name,
          bio: editingUser.bio,
          budget: editingUser.budget,
          role: editingUser.role,
        })
        .eq("id", editingUser.id);

      if (error) throw error;
      toast.success("NODE SYNCHRONIZED");
      setEditingUser(null);
      if (onUpdateUsers) onUpdateUsers();
    } catch (err: any) {
      toast.error("SYNC FAILED: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("PURGE DISPATCH?")) return;
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
      toast.success("DISPATCH DELETED");
      setLocalArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      toast.error("MODERATION FAILED");
    }
  };

  const toggleLockdown = () => {
    setIsLockdown(!isLockdown);
    toast(isLockdown ? "LOCKDOWN TERMINATED" : "GLOBAL LOCKDOWN INITIATED", {
      icon: isLockdown ? "🔓" : "🔒",
      style: {
        background: isLockdown ? "#10b981" : "#ef4444",
        color: "#fff",
        fontWeight: "black",
        textTransform: "uppercase",
        fontSize: "10px",
      },
    });
  };

  const filteredUsers = useMemo(() => {
    return localUsers.filter(
      (u) =>
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.serial_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localUsers, searchTerm]);

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col items-start justify-between gap-8 pb-10 border-b lg:flex-row border-slate-100 dark:border-slate-800">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 animate-pulse">
            <ShieldAlert size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              ROOT CONTROL V4.2
            </span>
          </div>
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase sm:text-7xl md:text-8xl dark:text-white">
            COMMAND
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              CORE: AUTH_OVERRIDE_ACTIVE
            </span>
            <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-emerald-500 font-black uppercase text-[9px] tracking-widest flex items-center gap-1">
              <Cpu size={10} /> NETWORK_STABLE
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end w-full gap-4 sm:flex-row lg:flex-col lg:w-auto">
          <div className="flex w-full gap-2 lg:w-auto">
            <button
              onClick={toggleLockdown}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isLockdown
                  ? "bg-red-600 border-red-600 text-white shadow-2xl animate-pulse"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-red-600 hover:bg-red-50"
              }`}
            >
              <Power size={16} />{" "}
              {isLockdown ? "TERMINATE LOCKDOWN" : "PROTOCOL LOCKDOWN"}
            </button>
            <button
              onClick={onLogout}
              className="flex-1 p-4 transition-all border sm:flex-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-red-600"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="w-full px-4 pb-2 -mx-4 overflow-x-auto lg:w-auto scrollbar-hide lg:p-0 lg:overflow-visible">
            <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl min-w-max shadow-sm">
              <TabButton
                active={activeTab === "monitor"}
                onClick={() => setActiveTab("monitor")}
                label="Pulse"
                icon={<Activity size={14} />}
              />
              <TabButton
                active={activeTab === "users"}
                onClick={() => setActiveTab("users")}
                label="Registry"
                icon={<Users size={14} />}
              />
              <TabButton
                active={activeTab === "articles"}
                onClick={() => setActiveTab("articles")}
                label="Moderation"
                icon={<FileText size={14} />}
              />
              <TabButton
                active={activeTab === "intercept"}
                onClick={() => setActiveTab("intercept")}
                label="Signals"
                icon={<Radio size={14} />}
              />
              <TabButton
                active={activeTab === "console"}
                onClick={() => setActiveTab("console")}
                label="Terminal"
                icon={<Code size={14} />}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pb-20 space-y-12">
        {activeTab === "monitor" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MonitorCard
              label="Total Nodes"
              value={localUsers.length}
              desc="Identified Identity Shards"
              icon={<User2 size={20} />}
            />
            <MonitorCard
              label="Dispatches"
              value={localArticles.length}
              desc="Public Information Packets"
              icon={<Newspaper size={20} />}
            />
            <MonitorCard
              label="Integrity"
              value="99.9%"
              color="text-emerald-500"
              desc="System Shield: Online"
              icon={<ShieldCheck size={20} />}
            />
            <MonitorCard
              label="Supabase Sync"
              value="LIVE"
              color="text-blue-500"
              desc="Real-time Node Link"
              icon={<Database size={20} />}
            />

            <div className="lg:col-span-4 bg-slate-950 rounded-[3rem] p-10 border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <TerminalIcon size={120} className="text-white" />
              </div>
              <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                      Live Operations Log
                    </h3>
                  </div>
                  <div className="font-mono text-[10px] space-y-3 text-slate-400 bg-white/5 p-6 rounded-2xl border border-white/5 h-48 overflow-y-auto custom-scrollbar">
                    <p>
                      <span className="text-blue-500">[INFO]</span> Command
                      Center established.
                    </p>
                    <p>
                      <span className="text-emerald-500">[AUTH]</span> Root
                      credentials verified.
                    </p>
                    <p>
                      <span className="text-amber-500">[WARN]</span> Potential
                      breach detected on Node 023.
                    </p>
                    <p>
                      <span className="text-red-500">[ALRT]</span> Attempted
                      unauthorized database dump.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-6">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Node Latency
                  </h4>
                  <div className="space-y-4">
                    <ThresholdBar label="Global Traffic" val={92} />
                    <ThresholdBar label="Identity Verified" val={100} />
                    <ThresholdBar
                      label="Sync Speed"
                      val={100}
                      color="bg-blue-600"
                    />
                  </div>
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
                placeholder="QUERYING NETWORK REGISTRY..."
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 group hover:border-blue-600 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400">
                        <Fingerprint size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black leading-tight uppercase dark:text-white">
                          {user.full_name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 italic">
                          ID: {user.serial_id}
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

                  <div className="py-6 space-y-3 border-y border-slate-50 dark:border-white/5">
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                      <span>Identity Email</span>
                      <span className="text-blue-600 truncate max-w-[150px]">
                        {user.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                      <span>Reputation Budget</span>
                      <span className="font-bold text-emerald-500">
                        {user.budget} CREDITS
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={14} /> Adjust Node
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-4 text-red-400 transition-all bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "articles" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {localArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 flex gap-8 items-center shadow-sm"
              >
                <div className="flex-shrink-0 w-32 h-32 overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={article.image_url}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-grow space-y-4 overflow-hidden">
                  <div className="flex items-start justify-between">
                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em]">
                      {article.category}
                    </p>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="p-2 text-red-500 transition-all hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h4 className="text-lg font-black leading-tight uppercase truncate dark:text-white">
                    {article.title}
                  </h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                    Node: {article.author_serial}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "console" && (
          <div className="bg-slate-950 rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-4 p-8 border-b border-white/10 bg-white/5">
              <Code size={20} className="text-blue-500" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                Advanced SQL Interface
              </h3>
            </div>
            <div
              ref={terminalScrollRef}
              className="p-12 space-y-3 overflow-y-auto font-mono text-xs h-96 custom-scrollbar"
            >
              {terminalOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.includes("[ERROR]")
                      ? "text-red-500"
                      : line.includes("[SUCCESS]")
                      ? "text-emerald-500"
                      : line.startsWith(">")
                      ? "text-blue-400"
                      : "text-slate-400"
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-6 p-10 border-t bg-white/5 border-white/10">
              <textarea
                value={sqlCommand}
                onChange={(e) => setSqlCommand(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), runSqlCommand())
                }
                placeholder="EXECUTE DIRECT DATABASE MODIFICATION..."
                className="w-full h-32 font-mono text-sm text-white bg-transparent border-none outline-none resize-none focus:ring-0 placeholder:text-slate-700"
              />
              <div className="flex justify-end">
                <button
                  onClick={runSqlCommand}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-blue-600 transition-all shadow-xl"
                >
                  RUN_COMMAND
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Node Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setEditingUser(null)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[4rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Protocol: Node Modification
                </p>
                <h3 className="text-3xl italic font-black tracking-tighter uppercase dark:text-white">
                  {editingUser.serial_id}
                </h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-3 transition-all bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Legal Name
                </label>
                <input
                  value={editingUser.full_name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full p-5 text-sm font-bold border-none outline-none bg-slate-50 dark:bg-slate-950 rounded-2xl dark:text-white focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Reputation Credits
                  </label>
                  <input
                    type="number"
                    value={editingUser.budget}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        budget: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-5 text-sm font-bold border-none outline-none bg-slate-50 dark:bg-slate-950 rounded-2xl dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Clearance
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl text-[10px] font-black uppercase border-none outline-none dark:text-white appearance-none"
                  >
                    <option value="user">USER NODE</option>
                    <option value="admin">ROOT ADMIN</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Node Bio / Manifesto
                </label>
                <textarea
                  value={editingUser.bio}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full p-5 text-sm font-medium border-none outline-none bg-slate-50 dark:bg-slate-950 rounded-2xl dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateUser}
              disabled={isUpdating}
              className="w-full py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-2xl"
            >
              {isUpdating ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} /> SYNCHRONIZE DATA
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

const MonitorCard = ({ label, value, color, desc, icon }: any) => (
  <div className="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] space-y-5 shadow-sm group hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-blue-600 transition-colors">
        {label}
      </p>
      <div className="text-slate-200 dark:text-slate-800">{icon}</div>
    </div>
    <p
      className={`text-5xl font-black dark:text-white uppercase italic tracking-tighter ${
        color || ""
      }`}
    >
      {value}
    </p>
    <p className="text-[10px] font-bold text-slate-400 italic uppercase tracking-widest">
      {desc}
    </p>
  </div>
);

const ThresholdBar = ({ label, val, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span>{val}%</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
      <div
        className={`h-full ${
          color || "bg-emerald-500"
        } transition-all duration-1000`}
        style={{ width: `${val}%` }}
      />
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
      active
        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl scale-105 z-10 border border-slate-100 dark:border-slate-700"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon} {label}
  </button>
);

export default AdminPage;
