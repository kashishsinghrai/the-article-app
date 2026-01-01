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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-32 space-y-10 md:space-y-24">
      {/* Header Section */}
      <section className="space-y-6 md:space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              {/* Fix: removed md:size, added responsive tailwind class */}
              <NetworkIcon size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
                Node Connectivity Terminal
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-[0.85] transition-all">
              The <br className="hidden md:block" /> Network
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:w-auto">
            <StatSmall
              label="Active Nodes"
              value={users.length}
              icon={<Users size={12} />}
            />
            <StatSmall
              label="Verified"
              value={users.filter((u) => u.role === "admin").length}
              icon={<ShieldCheck size={12} />}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 bg-white dark:bg-slate-900 p-2 md:p-3 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl">
          <div className="flex-grow flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl border border-slate-100 dark:border-white/5">
            {/* Fix: removed md:size, added responsive tailwind class */}
            <Search
              size={16}
              className="md:w-[18px] md:h-[18px] text-slate-400"
            />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-xs md:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 lg:pb-0 px-1">
            <FilterButton
              label="All"
              active={filterRole === "all"}
              onClick={() => setFilterRole("all")}
            />
            <FilterButton
              label="Authority"
              active={filterRole === "admin"}
              onClick={() => setFilterRole("admin")}
            />
            <FilterButton
              label="Reporters"
              active={filterRole === "user"}
              onClick={() => setFilterRole("user")}
            />
          </div>
        </div>
      </section>

      {/* Network Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 pb-10">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30">
            <Zap size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg md:text-xl font-black uppercase italic tracking-widest text-slate-400 px-4">
              No matching nodes found
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group bg-white dark:bg-slate-900/50 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-blue-600 dark:hover:border-blue-600 transition-all duration-500 relative flex flex-col justify-between h-full"
            >
              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-start">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 border border-slate-100 dark:border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {/* Fix: removed md:size, added responsive tailwind class */}
                      <Fingerprint size={24} className="md:w-7 md:h-7" />
                    </div>
                    {user.is_online && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                    )}
                  </div>
                  <div
                    className={`px-2 md:px-3 py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest ${
                      user.role === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {user.role === "admin" ? "Authority" : "Reporter"}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base md:text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter truncate group-hover:text-blue-600 transition-colors">
                    {user.full_name}
                  </h3>
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {user.serial_id}
                  </p>
                </div>

                <p className="text-[11px] md:text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                  {user.bio ||
                    "Journalistic node specializing in regional investigations and global data integrity."}
                </p>
              </div>

              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-50 dark:border-white/5 grid grid-cols-2 gap-2 md:gap-3">
                <button
                  onClick={() => onViewProfile(user)}
                  className="py-2.5 md:py-3 rounded-lg md:rounded-xl bg-slate-50 dark:bg-slate-800 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  Intel
                </button>
                <button
                  onClick={() => onChat(user)}
                  className="py-2.5 md:py-3 rounded-lg md:rounded-xl bg-blue-600 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 md:gap-2"
                >
                  {/* Fix: removed md:size, added responsive tailwind class */}
                  <MessageSquare size={10} className="md:w-3 md:h-3" /> Link
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
  <div className="bg-white dark:bg-slate-900 px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-2 md:gap-3 shadow-sm">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-[7px] md:text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white leading-none">
        {value}
      </p>
    </div>
  </div>
);

const FilterButton = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
      active
        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg"
        : "bg-transparent text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
    }`}
  >
    {label}
  </button>
);

export default NetworkPage;
