import React, { useState } from "react";
import {
  ShieldAlert,
  Trash2,
  Search,
  AlertCircle,
  FileText,
  Users,
  Fingerprint,
  ShieldCheck,
  Coins,
  Loader2,
  Activity,
  Zap,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { Article, Profile } from "../../types";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

interface AdminPageProps {
  articles: Article[];
  users: Profile[];
  onDeleteArticle: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onRefreshData?: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  articles,
  users,
  onDeleteArticle,
  onDeleteUser,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<"articles" | "users" | "monitor">(
    "articles"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    setProcessingId(userId);
    const newRole = currentRole === "admin" ? "user" : "admin";
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    if (!error) {
      toast.success(`Role updated to ${newRole.toUpperCase()}`);
      onRefreshData?.();
    }
    setProcessingId(null);
  };

  const handleAdjustBudget = async (
    userId: string,
    currentBudget: number,
    amount: number
  ) => {
    setProcessingId(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ budget: currentBudget + amount })
      .eq("id", userId);
    if (!error) {
      toast.success(`Budget adjusted: ${amount}`);
      onRefreshData?.();
    }
    setProcessingId(null);
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.serial_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-6xl px-6 py-24 mx-auto space-y-12 md:py-32">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Authority Control
            </span>
          </div>
          <h1 className="text-4xl font-black leading-none tracking-tighter uppercase md:text-7xl text-slate-900 dark:text-white">
            Terminal
          </h1>
        </div>
        <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          <TabButton
            active={activeTab === "monitor"}
            onClick={() => setActiveTab("monitor")}
            icon={<Activity size={14} />}
            label="Pulse"
          />
          <TabButton
            active={activeTab === "articles"}
            onClick={() => setActiveTab("articles")}
            icon={<FileText size={14} />}
            label="Intel"
          />
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            icon={<Users size={14} />}
            label="Nodes"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm min-h-[500px]">
        {activeTab !== "monitor" && (
          <div className="flex items-center gap-4 px-6 py-4 mb-8 border bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
            <Search size={18} className="text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm font-bold bg-transparent border-none outline-none focus:ring-0 text-slate-900 dark:text-white"
              placeholder={`Search ${
                activeTab === "articles" ? "Reports" : "Profiles"
              }...`}
            />
          </div>
        )}

        <div className="space-y-4">
          {activeTab === "monitor" && (
            <div className="space-y-12 duration-500 animate-in fade-in">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard
                  label="Live Conversations"
                  value="12"
                  icon={
                    <MessageCircle size={20} className="text-emerald-500" />
                  }
                />
                <StatCard
                  label="Pending Syncs"
                  value="04"
                  icon={<Zap size={20} className="text-blue-500" />}
                />
                <StatCard
                  label="Authority Nodes"
                  value={users.filter((u) => u.role === "admin").length}
                  icon={
                    <ShieldCheck
                      size={20}
                      className="text-slate-900 dark:text-white"
                    />
                  }
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Recent Transmission Logs
                </h3>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl space-y-3 font-mono text-[11px] text-slate-500 border border-slate-100 dark:border-slate-800">
                  <p>
                    [{new Date().toLocaleTimeString()}] P2P HANDSHAKE: #ART-1049
                    CONNECTED TO #ART-9902
                  </p>
                  <p>
                    [{new Date().toLocaleTimeString()}] INTEL BROADCAST: "NEW
                    REGIONAL UPDATE" BY #ROOT-ADMIN
                  </p>
                  <p>
                    [{new Date().toLocaleTimeString()}] SECURITY: AES-256
                    ROTATION COMPLETED
                  </p>
                  <p className="animate-pulse">
                    _ LISTENING FOR NEW PACKETS...
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "articles" &&
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col items-center justify-between gap-4 p-5 transition-all border border-transparent md:flex-row bg-slate-50 dark:bg-slate-900 rounded-2xl hover:border-slate-200 dark:hover:border-slate-700 group"
              >
                <div className="flex items-center flex-grow gap-4 truncate">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="truncate">
                    <h4 className="text-sm italic font-black tracking-tight uppercase truncate">
                      {article.title}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {article.author_name} • {article.author_serial}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteArticle(article.id)}
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            ))}

          {activeTab === "users" &&
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col items-center justify-between gap-4 p-5 transition-all border border-transparent md:flex-row bg-slate-50 dark:bg-slate-900 rounded-2xl hover:border-slate-200"
              >
                <div className="flex items-center flex-grow gap-4 truncate">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400">
                    <Fingerprint size={24} />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm italic font-black tracking-tight uppercase truncate">
                      {user.full_name}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {user.serial_id} • {user.role.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleAdjustBudget(user.id, user.budget, 100)
                    }
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-[8px] font-black uppercase"
                  >
                    Reward
                  </button>
                  <button
                    onClick={() => handleUpdateRole(user.id, user.role)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-[8px] font-black uppercase"
                  >
                    Role
                  </button>
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[8px] font-black uppercase hover:bg-red-600 hover:text-white"
                  >
                    Expel
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

const StatCard = ({ label, value, icon }: any) => (
  <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-3">
    <div className="flex items-center justify-between">
      {icon}
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
    <p className="text-4xl font-black text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
      active
        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">
      {label}
    </span>
  </button>
);

export default AdminPage;
