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
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32">
      <div className="bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-16 text-white shadow-[0_64px_128px_-24px_rgba(15,23,42,0.4)] relative overflow-hidden min-h-[700px]">
        <ShieldAlert
          size={400}
          className="absolute -bottom-20 -right-20 text-white/[0.03] rotate-12 hidden lg:block"
        />

        <div className="relative z-10 space-y-8 md:space-y-12">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 md:gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={20} />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] italic">
                  Authority Terminal
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                Database <br />
                Management
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4">
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

          <div className="bg-white/5 backdrop-blur-3xl rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/10 space-y-6 md:space-y-8">
            <div className="flex items-center gap-4 md:gap-6 bg-slate-950/50 px-5 md:px-8 py-3 md:py-4 rounded-full border border-white/5">
              <Search size={18} className="text-slate-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-xs md:text-sm font-medium"
                placeholder={`Search ${
                  activeTab === "articles" ? "Reports" : "Correspondents"
                }...`}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 md:pr-4">
              {activeTab === "articles" ? (
                filteredArticles.length === 0 ? (
                  <div className="text-center py-20 opacity-20">
                    <p className="text-2xl md:text-4xl font-black italic uppercase">
                      No Records Match Query
                    </p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border border-white/5 hover:border-red-500 transition-all group gap-4"
                    >
                      <div className="flex gap-4 md:gap-6 items-center w-full">
                        <img
                          src={article.image_url}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all flex-shrink-0"
                        />
                        <div className="truncate flex-grow">
                          <h4 className="text-sm md:text-lg font-bold uppercase italic tracking-tight truncate">
                            {article.title}
                          </h4>
                          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">
                            Source: {article.author_name} • ID:{" "}
                            {article.author_serial}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteArticle(article.id)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-red-600/20 text-red-400 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all whitespace-nowrap"
                      >
                        <Trash2 size={14} /> Purge Record
                      </button>
                    </div>
                  ))
                )
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20 opacity-20">
                  <p className="text-2xl md:text-4xl font-black italic uppercase">
                    No Identities Found
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border border-white/5 hover:border-red-500 transition-all group gap-4"
                  >
                    <div className="flex gap-4 md:gap-6 items-center w-full">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                        <Fingerprint size={28} />
                      </div>
                      <div className="truncate flex-grow">
                        <h4 className="text-sm md:text-lg font-bold uppercase italic tracking-tight truncate">
                          {user.full_name}
                        </h4>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">
                          Serial: {user.serial_id} • Budget: ${user.budget}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2 w-full md:w-auto">
                      {user.role === "admin" && (
                        <span className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center">
                          Admin Node
                        </span>
                      )}
                      <button
                        disabled={user.role === "admin"}
                        onClick={() => onDeleteUser(user.id)}
                        className="flex items-center justify-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-red-600/20 text-red-400 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-red-600/20 disabled:hover:text-red-400 whitespace-nowrap"
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
    className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-3xl transition-all border ${
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
