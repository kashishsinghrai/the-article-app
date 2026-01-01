import React, { useState, useMemo } from "react";
import {
  Globe,
  Users,
  Zap,
  Search,
  MessageSquare,
  ShieldCheck,
  Fingerprint,
  Network as NetworkIcon,
  Filter,
} from "lucide-react";
import { Profile } from "../../types";

interface NetworkPageProps {
  users: Profile[];
  onViewProfile: (user: Profile) => void;
  onChat: (user: Profile) => void;
}

const NetworkPage: React.FC<NetworkPageProps> = ({
  users,
  onViewProfile,
  onChat,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.serial_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 space-y-12 md:space-y-24">
      {/* Header Section */}
      <section className="space-y-8 md:space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <NetworkIcon size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Node Connectivity Terminal
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-[0.85] transition-all">
              The <br className="hidden md:block" /> Network
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <StatSmall
              label="Active Nodes"
              value={users.length}
              icon={<Users size={14} />}
            />
            <StatSmall
              label="Verified"
              value={users.filter((u) => u.role === "admin").length}
              icon={<ShieldCheck size={14} />}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-900 p-3 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl">
          <div className="flex-grow flex items-center gap-4 bg-slate-50 dark:bg-slate-950 px-6 py-3 rounded-2xl border border-slate-100 dark:border-white/5">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes by name or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
            <FilterButton
              label="All Nodes"
              active={filterRole === "all"}
              onClick={() => setFilterRole("all")}
            />
            <FilterButton
              label="Authority"
              active={filterRole === "admin"}
              onClick={() => setFilterRole("admin")}
            />
            <FilterButton
              label="Correspondents"
              active={filterRole === "user"}
              onClick={() => setFilterRole("user")}
            />
          </div>
        </div>
      </section>

      {/* Network Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30">
            <Zap size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-xl font-black uppercase italic tracking-widest text-slate-400">
              No matching nodes found in directory
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-blue-600 dark:hover:border-blue-600 transition-all duration-500 relative flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="relative">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 border border-slate-100 dark:border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Fingerprint size={28} />
                    </div>
                    {user.is_online && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 animate-pulse" />
                    )}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      user.role === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {user.role === "admin" ? "Authority Node" : "Correspondent"}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter truncate group-hover:text-blue-600 transition-colors">
                    {user.full_name}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {user.serial_id}
                  </p>
                </div>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-8">
                  {user.bio ||
                    "Journalistic node specializing in regional investigations and global data integrity."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => onViewProfile(user)}
                  className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  View Intel
                </button>
                <button
                  onClick={() => onChat(user)}
                  className="py-3 rounded-xl bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={12} /> Link
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

const StatSmall = ({ label, value, icon }: any) => (
  <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
        {value}
      </p>
    </div>
  </div>
);

const FilterButton = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
      active
        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg"
        : "bg-transparent text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
    }`}
  >
    {label}
  </button>
);

export default NetworkPage;
