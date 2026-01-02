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
  >("articles");
  const [searchTerm, setSearchTerm] = useState("");
  const [sqlCommand, setSqlCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "[SYSTEM] Root established...",
    "[INFO] Protocol V6.0 Active",
  ]);

  const [localArticles, setLocalArticles] =
    useState<Article[]>(initialArticles);
  const [localUsers, setLocalUsers] = useState<Profile[]>(initialUsers);

  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync with initial props
  useEffect(() => {
    setLocalArticles(initialArticles);
    setLocalUsers(initialUsers);
  }, [initialArticles, initialUsers]);

  const forceRefresh = async () => {
    setIsSyncing(true);
    const id = toast.loading("Resyncing Global Database...");
    try {
      if (onUpdateArticles) await onUpdateArticles();
      if (onUpdateUsers) await onUpdateUsers();
      toast.success("Network Desynchronized & Rebuilt", { id });
    } catch (e) {
      toast.error("Sync Failed", { id });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("🚨 PURGE DISPATCH? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
      toast.success("DISPATCH PERMANENTLY ERASED");
      if (onUpdateArticles) onUpdateArticles();
    } catch (err: any) {
      toast.error("PURGE FAILED: " + err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUserId)
      return toast.error("ROOT PROTECTION: You cannot delete yourself.");
    if (
      !confirm(
        "🧨 PURGE NODE? This will delete this user identity and all associated data forever."
      )
    )
      return;
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      if (error) throw error;
      toast.success("IDENTITY PURGED FROM REGISTRY");
      if (onUpdateUsers) onUpdateUsers();
    } catch (err: any) {
      toast.error("PURGE FAILED: " + err.message);
    }
  };

  const handleUpdateArticle = async () => {
    if (!editingArticle) return;
    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from("articles")
        .update({
          title: editingArticle.title,
          content: editingArticle.content,
          category: editingArticle.category,
        })
        .eq("id", editingArticle.id);
      if (error) throw error;
      toast.success("DISPATCH UPDATED");
      setEditingArticle(null);
      if (onUpdateArticles) onUpdateArticles();
    } catch (err: any) {
      toast.error("UPDATE FAILED");
    } finally {
      setIsSyncing(false);
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
          `[SUCCESS] Remote SQL operation completed.`,
        ]);
        forceRefresh();
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
        u.serial_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localUsers, searchTerm]);

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-24 md:py-32 space-y-12">
      {/* Admin Header (Matches your image but with more power) */}
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
              <span className="text-[9px] font-black uppercase">
                Active Database Sync
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem]">
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
          <TabButton
            active={activeTab === "monitor"}
            onClick={() => setActiveTab("monitor")}
            label="Signals"
            icon={<Activity size={14} />}
          />
          <TabButton
            active={activeTab === "console"}
            onClick={() => setActiveTab("console")}
            label="Terminal"
            icon={<Code size={14} />}
          />
          <button
            onClick={forceRefresh}
            disabled={isSyncing}
            className="p-3 text-red-600 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl"
            title="Force Global Refresh"
          >
            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Modern Search */}
      <div className="flex items-center gap-4 px-8 py-5 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-red-600 transition-all">
        <Search size={20} className="text-slate-300" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-[11px] font-black uppercase tracking-[0.3em] outline-none flex-grow dark:text-white placeholder:text-slate-300"
          placeholder={`QUERYING ${activeTab.toUpperCase()} DATABASE...`}
        />
      </div>

      {/* Main Panel Content */}
      <div className="min-h-[500px]">
        {activeTab === "articles" && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.length === 0 ? (
              <div className="flex flex-col items-center py-32 space-y-4 text-center col-span-full">
                <Newspaper
                  size={48}
                  className="text-slate-100 dark:text-slate-800"
                />
                <p className="opacity-30 text-[10px] font-black uppercase tracking-[0.2em]">
                  No Dispatches Found in Archive
                </p>
                <button
                  onClick={forceRefresh}
                  className="text-blue-600 text-[10px] font-black uppercase underline"
                >
                  Try Global Resync
                </button>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6 group hover:border-red-600 transition-all shadow-sm"
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
                    <div className="flex items-center justify-between">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">
                        {article.author_name} // {article.author_serial}
                      </p>
                      <ShieldCheck size={12} className="text-emerald-500" />
                    </div>
                    <h4 className="text-xl italic font-black leading-tight uppercase truncate dark:text-white">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed italic">
                      "{article.content}"
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setEditingArticle(article)}
                      className="flex-1 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={12} /> Modify Dispatch
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="p-3 text-red-500 transition-all border border-red-100 bg-red-50 dark:bg-red-950/20 rounded-xl hover:bg-red-600 hover:text-white dark:border-red-900/30"
                    >
                      <Trash2 size={16} />
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
                className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8 flex flex-col justify-between hover:border-red-600/30 transition-all shadow-sm"
              >
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 border shadow-inner rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-300 border-slate-100 dark:border-slate-800">
                        <Fingerprint size={24} />
                      </div>
                      <div>
                        <p className="text-base font-black leading-none tracking-tight uppercase dark:text-white">
                          {user.full_name}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 italic">
                          @{user.username} // {user.serial_id}
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
                      Node Permissions Overlay
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

                <div className="flex gap-2">
                  <button className="flex-1 py-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                    <ShieldCheck size={14} /> Toggle Clearance
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-900/30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "console" && (
          <div className="bg-slate-950 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
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
                placeholder="EXECUTE RAW SQL COMMANDS..."
              />
              <button
                onClick={runSqlCommand}
                className="px-10 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                EXECUTE QUERY
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={() => setEditingArticle(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl italic font-black uppercase dark:text-white">
                Admin Dispatch Edit
              </h3>
              <button onClick={() => setEditingArticle(null)}>
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Headline Overlay
                </label>
                <input
                  value={editingArticle.title}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-5 text-base font-bold border outline-none bg-slate-50 dark:bg-slate-950 rounded-2xl dark:text-white border-slate-100 dark:border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Classification
                </label>
                <select
                  value={editingArticle.category}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl text-[11px] font-black uppercase outline-none dark:text-white border border-slate-100 dark:border-slate-800"
                >
                  <option value="Investigative">Investigative</option>
                  <option value="Economic">Economic</option>
                  <option value="Regional">Regional</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Content Modification
                </label>
                <textarea
                  rows={6}
                  value={editingArticle.content}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      content: e.target.value,
                    })
                  }
                  className="w-full p-5 text-sm font-medium border outline-none bg-slate-50 dark:bg-slate-950 rounded-2xl dark:text-white border-slate-100 dark:border-slate-800"
                />
              </div>
            </div>
            <button
              onClick={handleUpdateArticle}
              disabled={isSyncing}
              className="w-full py-6 bg-red-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-950 transition-all"
            >
              {isSyncing ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <>
                  <Save size={16} /> Override & Sync
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

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
