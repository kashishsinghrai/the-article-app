import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  FileText,
  Users,
  Activity,
  Zap,
  Trash2,
  Edit,
  RefreshCw,
  Terminal as TerminalIcon,
  Code,
  Database,
  X,
  Save,
  Eye,
  ShieldCheck,
  Fingerprint,
  Info,
  MessageSquare,
  Power,
  Newspaper,
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
  articles: initialArticles,
  users: initialUsers,
  currentUserId,
  onUpdateUsers,
  onUpdateArticles,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    "articles" | "users" | "monitor" | "console"
  >("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [sqlCommand, setSqlCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "[SYSTEM] Root level established...",
    "[INFO] Admin Override Active",
  ]);

  const [localArticles, setLocalArticles] =
    useState<Article[]>(initialArticles);
  const [localUsers, setLocalUsers] = useState<Profile[]>(initialUsers);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync state with incoming props
  useEffect(() => {
    setLocalArticles(initialArticles);
    setLocalUsers(initialUsers);
  }, [initialArticles, initialUsers]);

  const forceResync = async () => {
    setIsSyncing(true);
    const id = toast.loading("Resyncing Central Registry...");
    try {
      if (onUpdateArticles) await onUpdateArticles();
      if (onUpdateUsers) await onUpdateUsers();
      toast.success("Registry Synced Successfully", { id });
    } catch (e) {
      toast.error("Sync Failed", { id });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (
      !confirm(
        "⚠️ WARNING: PURGE DISPATCH? This will delete this article for all users globally."
      )
    )
      return;
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);
      if (error) throw error;
      toast.success("Dispatch Erased");
      if (onUpdateArticles) onUpdateArticles();
    } catch (err: any) {
      toast.error("Moderation Error: " + err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUserId)
      return toast.error("ACCESS DENIED: You cannot purge the root admin.");
    if (
      !confirm(
        "🚨 FATAL ACTION: PURGE NODE? This will delete this user identity and all their data."
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      if (error) throw error;
      toast.success("Identity Purged from Registry");
      if (onUpdateUsers) onUpdateUsers();
    } catch (err: any) {
      toast.error("Purge Failed: " + err.message);
    }
  };

  const runSqlCommand = async () => {
    if (!sqlCommand.trim()) return;
    setTerminalOutput((prev) => [...prev, `> ${sqlCommand}`]);
    try {
      const { error } = await (supabase as any).rpc("exec_sql", {
        sql_query: sqlCommand,
      });
      if (error)
        setTerminalOutput((prev) => [...prev, `[ERROR] ${error.message}`]);
      else {
        setTerminalOutput((prev) => [
          ...prev,
          `[SUCCESS] SQL executed. Refreshing registry...`,
        ]);
        forceResync();
      }
    } catch (err: any) {
      setTerminalOutput((prev) => [...prev, `[FATAL] ${err.message}`]);
    }
    setSqlCommand("");
  };

  const filteredArticles = useMemo(() => {
    return localArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.author_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localArticles, searchTerm]);

  const filteredUsers = useMemo(() => {
    return localUsers.filter(
      (u) =>
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.serial_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localUsers, searchTerm]);

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-24 md:py-32 space-y-12">
      {/* Admin Header (Matches your image layout) */}
      <div className="flex flex-col items-start justify-between gap-8 pb-10 border-b lg:flex-row border-slate-100 dark:border-slate-800">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 animate-pulse">
            <ShieldAlert size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              ROOT OPERATIONS TERMINAL
            </span>
          </div>
          <h1 className="text-6xl italic font-black leading-none tracking-tighter uppercase sm:text-8xl md:text-9xl dark:text-white">
            COMMAND
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-400">
                Access Verified: Root Level
              </span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Zap size={10} />
              <span className="text-[9px] font-black uppercase text-blue-600">
                Active Sync
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm">
          <TabButton
            active={activeTab === "monitor"}
            onClick={() => setActiveTab("monitor")}
            label="System"
            icon={<Activity size={14} />}
          />
          <TabButton
            active={activeTab === "console"}
            onClick={() => setActiveTab("console")}
            label="Signals"
            icon={<Code size={14} />}
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

          <div className="self-center w-px h-8 mx-1 bg-slate-200 dark:bg-slate-800" />

          <button
            onClick={forceResync}
            disabled={isSyncing}
            className="p-3 text-blue-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl"
            title="Sync Registry"
          >
            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex items-center gap-4 px-8 py-5 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-600 transition-all">
        <Search size={20} className="text-slate-300" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-[11px] font-black uppercase tracking-[0.3em] outline-none flex-grow dark:text-white placeholder:text-slate-300"
          placeholder={`FILTERING ${activeTab.toUpperCase()} BY HASH OR SERIAL...`}
        />
      </div>

      {/* Dynamic Main Panel */}
      <div className="min-h-[600px]">
        {activeTab === "articles" && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.length === 0 ? (
              <div className="py-40 space-y-4 text-center col-span-full opacity-30">
                <Newspaper size={48} className="mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Database Empty: No Dispatches Found
                </p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6 group hover:border-red-600 transition-all"
                >
                  <div className="aspect-video rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative">
                    <img
                      src={article.image_url}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute px-3 py-1 border rounded-lg top-4 left-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-white/20">
                      <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">
                      {article.author_name} // {article.author_serial}
                    </p>
                    <h4 className="text-xl italic font-black leading-tight uppercase truncate dark:text-white">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed italic">
                      "{article.content}"
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="w-full py-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/20"
                    >
                      <Trash2 size={14} /> PURGE DISPATCH
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8 flex flex-col justify-between hover:border-red-600/30 transition-all"
              >
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 border rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-300 border-slate-100 dark:border-slate-800">
                        <Fingerprint size={24} />
                      </div>
                      <div>
                        <p className="text-base font-black leading-none tracking-tight uppercase dark:text-white">
                          {user.full_name}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 italic">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border ${
                        user.role === "admin"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-slate-50 text-slate-400 border-slate-100"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="p-4 border bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Live Hardware Permissions
                    </p>
                    <div className="flex gap-2">
                      <PermissionIcon
                        active={user.settings?.camera_access}
                        label="CAM"
                      />
                      <PermissionIcon
                        active={user.settings?.mic_access}
                        label="MIC"
                      />
                      <PermissionIcon
                        active={user.settings?.location_access}
                        label="GEO"
                      />
                      <PermissionIcon
                        active={user.settings?.storage_access}
                        label="FS"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="w-full py-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                    <ShieldCheck size={14} /> TOGGLE CLEARANCE
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="w-full py-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-900/30"
                  >
                    <Trash2 size={14} /> PURGE IDENTITY
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "console" && (
          <div className="bg-slate-950 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <Code size={20} className="text-red-500" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                  Root Direct SQL Access
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-slate-500 uppercase">
                  Remote Execution Enabled
                </span>
              </div>
            </div>
            <div className="h-[400px] overflow-y-auto p-10 font-mono text-[10px] space-y-3 custom-scrollbar">
              {terminalOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.includes("[ERROR]")
                      ? "text-red-500"
                      : line.includes("[SUCCESS]")
                      ? "text-emerald-500"
                      : "text-slate-500"
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
            <div className="flex gap-4 p-8 border-t border-white/10 bg-white/5">
              <textarea
                value={sqlCommand}
                onChange={(e) => setSqlCommand(e.target.value)}
                className="flex-grow h-16 font-mono text-sm text-white bg-transparent border-none outline-none resize-none focus:ring-0"
                placeholder="EXECUTE RAW SQL..."
              />
              <button
                onClick={runSqlCommand}
                className="px-10 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                RUN QUERY
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
      active
        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl border border-slate-100 dark:border-slate-700"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon} {label}
  </button>
);

const PermissionIcon = ({ active, label }: any) => (
  <div
    className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${
      active
        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
        : "bg-slate-50 text-slate-200 border-slate-100 dark:bg-slate-950 dark:border-slate-800"
    }`}
  >
    {label}
  </div>
);

export default AdminPage;
