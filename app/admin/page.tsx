import React, { useState } from "react";
import {
  ShieldAlert,
  Trash2,
  Search,
  AlertCircle,
  FileText,
  Users,
  Fingerprint,
  TrendingUp,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Coins,
  Loader2,
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
  const [activeTab, setActiveTab] = useState<"articles" | "users">("articles");
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
      toast.success(`Node status: ${newRole.toUpperCase()}`);
      onRefreshData?.();
    } else {
      toast.error("Privilege update failed");
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
      toast.success(`Reputation Adjusted: ${amount > 0 ? "+" : ""}${amount}`);
      onRefreshData?.();
    } else {
      toast.error("Sync failed");
    }
    setProcessingId(null);
  };

  const confirmPurgeArticle = (id: string) => {
    if (
      window.confirm("CRITICAL: Purge this intelligence record permanently?")
    ) {
      onDeleteArticle(id);
      toast.success("Record expunged from ledger");
    }
  };

  const confirmPurgeUser = (id: string) => {
    if (
      window.confirm(
        "CRITICAL: Expel this node from the network? All credentials will be revoked."
      )
    ) {
      onDeleteUser(id);
      toast.success("Node identity terminated");
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.serial_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="px-4 py-24 mx-auto max-w-7xl md:px-6 md:py-32">
      <div className="bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-16 text-white shadow-[0_64px_128px_-24px_rgba(15,23,42,0.4)] relative overflow-hidden min-h-[700px]">
        <ShieldAlert
          size={400}
          className="absolute -bottom-20 -right-20 text-white/[0.03] rotate-12 hidden lg:block"
        />

        <div className="relative z-10 space-y-8 md:space-y-12">
          <div className="flex flex-col items-start justify-between gap-6 xl:flex-row xl:items-end md:gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={20} />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] italic">
                  Authority Command Center
                </span>
              </div>
              <h1 className="text-4xl italic font-black leading-none tracking-tighter uppercase transition-all md:text-7xl">
                Network <br />
                Database
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4">
              <TabButton
                active={activeTab === "articles"}
                onClick={() => setActiveTab("articles")}
                icon={<FileText size={14} />}
                label="Intel Reports"
                count={articles.length}
              />
              <TabButton
                active={activeTab === "users"}
                onClick={() => setActiveTab("users")}
                icon={<Users size={14} />}
                label="Node Manifest"
                count={users.length}
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 space-y-6 md:space-y-8">
            <div className="flex items-center gap-4 px-5 py-3 border rounded-full md:gap-6 bg-slate-950/50 md:px-8 md:py-4 border-white/5">
              <Search size={18} className="text-slate-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs font-medium text-white bg-transparent border-none outline-none focus:ring-0 md:text-sm"
                placeholder={`Locate ${
                  activeTab === "articles" ? "Reports" : "Nodes"
                }...`}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 md:pr-4">
              {activeTab === "articles" ? (
                filteredArticles.length === 0 ? (
                  <div className="py-20 text-center opacity-20">
                    <p className="text-2xl italic font-black tracking-tighter uppercase md:text-4xl">
                      No Records Detected
                    </p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex flex-col items-center justify-between gap-4 p-4 transition-all border md:flex-row md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border-white/5 hover:border-red-500 group"
                    >
                      <div className="flex items-center w-full gap-4 overflow-hidden md:gap-6">
                        <img
                          src={article.image_url}
                          className="flex-shrink-0 object-cover w-12 h-12 transition-all md:w-16 md:h-16 rounded-xl md:rounded-2xl grayscale group-hover:grayscale-0"
                        />
                        <div className="flex-grow truncate">
                          <h4 className="text-sm italic font-bold tracking-tight uppercase truncate md:text-lg">
                            {article.title}
                          </h4>
                          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">
                            Source: {article.author_name} •{" "}
                            {article.author_serial}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => confirmPurgeArticle(article.id)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-red-600/10 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all whitespace-nowrap"
                      >
                        <Trash2 size={14} /> Purge Intel
                      </button>
                    </div>
                  ))
                )
              ) : filteredUsers.length === 0 ? (
                <div className="py-20 text-center opacity-20">
                  <p className="text-2xl italic font-black tracking-tighter uppercase md:text-4xl">
                    No Identity Nodes Found
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col p-4 space-y-4 transition-all border md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border-white/5 group hover:bg-white/10"
                  >
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex items-center w-full gap-4 overflow-hidden md:gap-6">
                        <div className="relative flex items-center justify-center flex-shrink-0 w-12 h-12 text-blue-400 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/10">
                          {processingId === user.id ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Fingerprint size={28} />
                          )}
                        </div>
                        <div className="flex-grow truncate">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm italic font-bold tracking-tight uppercase truncate md:text-lg">
                              {user.full_name}
                            </h4>
                            {user.role === "admin" && (
                              <ShieldCheck
                                size={14}
                                className="text-blue-500"
                              />
                            )}
                          </div>
                          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">
                            Serial: {user.serial_id} • Rep: {user.budget} • @
                            {user.username}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap w-full gap-2 md:w-auto">
                        <button
                          onClick={() =>
                            handleAdjustBudget(user.id, user.budget, 100)
                          }
                          className="flex-1 md:flex-none px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Coins size={12} /> Reward
                        </button>
                        <button
                          onClick={() => handleUpdateRole(user.id, user.role)}
                          className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            user.role === "admin"
                              ? "bg-amber-600/20 text-amber-400 hover:bg-amber-600"
                              : "bg-blue-600/20 text-blue-400 hover:bg-blue-600"
                          } hover:text-white`}
                        >
                          {user.role === "admin" ? (
                            <>
                              <UserMinus size={12} /> Demote
                            </>
                          ) : (
                            <>
                              <UserPlus size={12} /> Promote
                            </>
                          )}
                        </button>
                        <button
                          disabled={user.role === "admin"}
                          onClick={() => confirmPurgeUser(user.id)}
                          className="flex-1 md:flex-none px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Trash2 size={12} /> Purge
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const TabButton = ({ active, onClick, icon, label, count }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-3xl transition-all border ${
      active
        ? "bg-white text-slate-900 border-white"
        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
    }`}
  >
    {icon}
    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
      {label}
    </span>
    <span
      className={`text-[8px] md:text-[10px] font-black ml-1 md:ml-2 ${
        active ? "text-blue-600" : "text-slate-600"
      }`}
    >
      ({count})
    </span>
  </button>
);

export default AdminPage;
