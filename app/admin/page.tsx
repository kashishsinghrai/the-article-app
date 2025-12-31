import React, { useState } from "react";
import {
  ShieldAlert,
  Trash2,
  Search,
  AlertCircle,
  FileText,
  Users,
  Fingerprint,
} from "lucide-react";
import { Article, Profile } from "../../types";

interface AdminPageProps {
  articles: Article[];
  users: Profile[];
  onDeleteArticle: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({
  articles,
  users,
  onDeleteArticle,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState<"articles" | "users">("articles");
  const [searchTerm, setSearchTerm] = useState("");

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
    <main className="max-w-7xl mx-auto px-6 py-32">
      <div className="bg-slate-900 rounded-[3.5rem] p-16 text-white shadow-[0_64px_128px_-24px_rgba(15,23,42,0.4)] relative overflow-hidden min-h-[700px]">
        <ShieldAlert
          size={400}
          className="absolute -bottom-20 -right-20 text-white/[0.03] rotate-12"
        />

        <div className="relative z-10 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={20} />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">
                  Authority Terminal
                </span>
              </div>
              <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">
                Database <br />
                Management
              </h1>
            </div>

            <div className="flex gap-4">
              <TabButton
                active={activeTab === "articles"}
                onClick={() => setActiveTab("articles")}
                icon={<FileText size={14} />}
                label="Reports"
                count={articles.length}
              />
              <TabButton
                active={activeTab === "users"}
                onClick={() => setActiveTab("users")}
                icon={<Users size={14} />}
                label="Correspondents"
                count={users.length}
              />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/10 space-y-8">
            <div className="flex items-center gap-6 bg-slate-950/50 px-8 py-4 rounded-full border border-white/5">
              <Search className="text-slate-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium"
                placeholder={`Search ${
                  activeTab === "articles" ? "Reports" : "Correspondents"
                }...`}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
              {activeTab === "articles" ? (
                filteredArticles.length === 0 ? (
                  <div className="text-center py-20 opacity-20">
                    <p className="text-4xl font-black italic uppercase">
                      No Records Match Query
                    </p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex flex-col md:flex-row justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-red-500 transition-all group"
                    >
                      <div className="flex gap-6 items-center">
                        <img
                          src={article.image_url}
                          className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                        <div>
                          <h4 className="text-lg font-bold uppercase italic tracking-tight">
                            {article.title}
                          </h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Source: {article.author_name} • ID:{" "}
                            {article.author_serial}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteArticle(article.id)}
                        className="mt-4 md:mt-0 flex items-center gap-2 px-8 py-3 bg-red-600/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={14} /> Purge Record
                      </button>
                    </div>
                  ))
                )
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20 opacity-20">
                  <p className="text-4xl font-black italic uppercase">
                    No Identities Found
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-red-500 transition-all group"
                  >
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
                        <Fingerprint size={32} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold uppercase italic tracking-tight">
                          {user.full_name}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Serial: {user.serial_id} • Budget: ${user.budget}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {user.role === "admin" && (
                        <span className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center">
                          Admin Node
                        </span>
                      )}
                      <button
                        disabled={user.role === "admin"}
                        onClick={() => onDeleteUser(user.id)}
                        className="mt-4 md:mt-0 flex items-center gap-2 px-8 py-3 bg-red-600/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-red-600/20 disabled:hover:text-red-400"
                      >
                        <Trash2 size={14} /> Purge Identity
                      </button>
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
    className={`flex items-center gap-3 px-6 py-4 rounded-3xl transition-all border ${
      active
        ? "bg-white text-slate-900 border-white"
        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
    }`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">
      {label}
    </span>
    <span
      className={`text-[10px] font-black ml-2 ${
        active ? "text-blue-600" : "text-slate-600"
      }`}
    >
      ({count})
    </span>
  </button>
);

export default AdminPage;
