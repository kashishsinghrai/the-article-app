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
  Eye,
} from "lucide-react";
import { Article, Profile, LiveMessage } from "../../types";
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
    "monitor" | "articles" | "users" | "intercept" | "console"
  >("articles");
  const [searchTerm, setSearchTerm] = useState("");
  const [sqlCommand, setSqlCommand] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "[SYSTEM] Root established...",
    "[INFO] Protocol V4.5 Active",
  ]);

  const [localArticles, setLocalArticles] =
    useState<Article[]>(initialArticles);
  const [localUsers, setLocalUsers] = useState<Profile[]>(initialUsers);

  // Edit States
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLocalArticles(initialArticles);
    setLocalUsers(initialUsers);
  }, [initialArticles, initialUsers]);

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
          `[SUCCESS] SQL operation completed.`,
        ]);
        if (onUpdateUsers) onUpdateUsers();
        if (onUpdateArticles) onUpdateArticles();
      }
    } catch (err: any) {
      setTerminalOutput((prev) => [...prev, `[FATAL] ${err.message}`]);
    }
    setSqlCommand("");
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUserId)
      return toast.error("ROOT PROTECTION: Self-termination blocked.");
    if (!confirm("DELETE USER? This is irreversible.")) return;
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
      toast.error("SYNC FAILED");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("PURGE DISPATCH? This will delete the article forever."))
      return;
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
      toast.success("DISPATCH DELETED");
      if (onUpdateArticles) onUpdateArticles();
    } catch (err: any) {
      toast.error("MODERATION FAILED");
    }
  };

  const handleUpdateArticle = async () => {
    if (!editingArticle) return;
    setIsUpdating(true);
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
      setIsUpdating(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return localUsers.filter(
      (u) =>
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-12">
      {/* Admin Header */}
      <div className="flex flex-col items-start justify-between gap-8 pb-10 border-b lg:flex-row border-slate-100 dark:border-slate-800">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 animate-pulse">
            <ShieldAlert size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              SYSTEM MODERATOR V4.5
            </span>
          </div>
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase sm:text-7xl md:text-8xl dark:text-white">
            OVERRIDE
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
          <TabButton
            active={activeTab === "articles"}
            onClick={() => setActiveTab("articles")}
            label="Moderation"
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
            label="Pulse"
            icon={<Activity size={14} />}
          />
          <TabButton
            active={activeTab === "console"}
            onClick={() => setActiveTab("console")}
            label="Terminal"
            icon={<Code size={14} />}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 px-8 py-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-red-600 transition-all">
        <Search size={20} className="text-slate-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-[11px] font-black uppercase tracking-[0.2em] outline-none flex-grow dark:text-white"
          placeholder="QUERYING DATABASE..."
        />
      </div>

      {/* Content Tabs */}
      <div className="pb-20 space-y-12">
        {activeTab === "articles" && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.length === 0 ? (
              <div className="col-span-full py-20 text-center opacity-30 text-[10px] font-black uppercase">
                No Dispatches Found
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-red-500 transition-all"
                >
                  <div className="overflow-hidden aspect-video rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <img
                      src={article.image_url}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-blue-600 uppercase">
                        {article.category}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase italic">
                        {article.author_serial}
                      </span>
                    </div>
                    <h4 className="text-lg italic font-black leading-tight uppercase truncate dark:text-white">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 italic line-clamp-2">
                      "{article.content}"
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setEditingArticle(article)}
                      className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="p-3 text-red-500 transition-all bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 size={14} />
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
                className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6"
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
                        {user.serial_id}
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
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-3 text-red-400 transition-all bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "console" && (
          <div className="bg-slate-950 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-4 p-8 border-b border-white/10 bg-white/5">
              <Code size={20} className="text-blue-500" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                Direct SQL Console
              </h3>
            </div>
            <div className="h-80 overflow-y-auto p-10 font-mono text-[10px] space-y-2">
              {terminalOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.includes("[ERROR]")
                      ? "text-red-500"
                      : line.includes("[SUCCESS]")
                      ? "text-emerald-500"
                      : "text-slate-500"
                  }
                >
                  {line}
                </div>
              ))}
            </div>
            <div className="flex gap-4 p-8 border-t border-white/10">
              <textarea
                value={sqlCommand}
                onChange={(e) => setSqlCommand(e.target.value)}
                className="flex-grow h-12 font-mono text-xs text-white bg-transparent border-none outline-none resize-none focus:ring-0"
                placeholder="EXECUTE DATABASE MODIFICATION..."
              />
              <button
                onClick={runSqlCommand}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
              >
                Execute
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setEditingArticle(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl italic font-black uppercase dark:text-white">
                Edit Dispatch
              </h3>
              <button onClick={() => setEditingArticle(null)}>
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Headline
                </label>
                <input
                  value={editingArticle.title}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-4 text-sm font-bold border-none outline-none bg-slate-50 dark:bg-slate-950 rounded-xl dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
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
                  className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-[10px] font-black uppercase border-none outline-none dark:text-white"
                >
                  <option value="Investigative">Investigative</option>
                  <option value="Economic">Economic</option>
                  <option value="Regional">Regional</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Content
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
                  className="w-full p-4 text-sm font-medium border-none outline-none bg-slate-50 dark:bg-slate-950 rounded-xl dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={handleUpdateArticle}
              disabled={isUpdating}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
            >
              {isUpdating ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setEditingUser(null)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl italic font-black uppercase dark:text-white">
                Edit Node
              </h3>
              <button onClick={() => setEditingUser(null)}>
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
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
                  className="w-full p-4 text-sm font-bold border-none outline-none bg-slate-50 dark:bg-slate-950 rounded-xl dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
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
                    className="w-full p-4 text-sm font-bold border-none outline-none bg-slate-50 dark:bg-slate-950 rounded-xl dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
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
                    className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-[10px] font-black uppercase border-none outline-none dark:text-white"
                  >
                    <option value="user">User Node</option>
                    <option value="admin">Root Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={handleUpdateUser}
              disabled={isUpdating}
              className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
            >
              {isUpdating ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <>
                  <Save size={16} /> Synchronize Node
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
  <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <div className="text-slate-200 dark:text-slate-800">{icon}</div>
    </div>
    <p
      className={`text-4xl font-black dark:text-white uppercase italic tracking-tighter ${
        color || ""
      }`}
    >
      {value}
    </p>
    <p className="text-[9px] font-bold text-slate-400 italic uppercase tracking-widest">
      {desc}
    </p>
  </div>
);

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
      active
        ? "bg-white dark:bg-slate-800 text-red-600 shadow-xl border border-slate-100 dark:border-slate-700"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon} {label}
  </button>
);

export default AdminPage;
