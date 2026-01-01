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
  Edit3,
} from "lucide-react";
import { Profile } from "../../types";

interface NetworkPageProps {
  users: Profile[];
  currentUserId?: string;
  onViewProfile: (user: Profile) => void;
  onChat: (user: Profile) => void;
}

const NetworkPage: React.FC<NetworkPageProps> = ({
  users,
  currentUserId,
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
      <section className="space-y-6 md:space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <NetworkIcon size={16} />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">
                Node Connectivity Terminal
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-[0.85] transition-all">
              The <br className="hidden md:block" /> Network
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
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

        <div className="flex flex-col lg:flex-row gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl">
          <div className="flex-grow flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl md:rounded-2xl">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes by name or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-xs font-medium text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto px-1">
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

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 pb-10">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30">
            <Zap size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-black uppercase italic tracking-widest text-slate-400 px-4">
              Awaiting Signal Synchronization
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`group bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 hover:border-blue-600 transition-all duration-500 relative flex flex-col justify-between h-full ${
                user.id === currentUserId ? "ring-2 ring-blue-600/20" : ""
              }`}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Fingerprint size={24} />
                    </div>
                    {user.is_online && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div
                      className={`px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest ${
                        user.role === "admin"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {user.role === "admin" ? "Authority" : "Reporter"}
                    </div>
                    {user.is_online && (
                      <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">
                        Online Now
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base md:text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter truncate group-hover:text-blue-600 transition-colors">
                    {user.full_name} {user.id === currentUserId && "(You)"}
                  </h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {user.serial_id}
                  </p>
                </div>

                <p className="text-[11px] md:text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                  {user.bio ||
                    "Professional correspondence node within the global network."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => onViewProfile(user)}
                  className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
                >
                  {user.id === currentUserId ? (
                    <>
                      <Edit3 size={10} /> Edit
                    </>
                  ) : (
                    "Intel"
                  )}
                </button>
                <button
                  onClick={() => onChat(user)}
                  disabled={user.id === currentUserId}
                  className="py-3 rounded-xl bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg disabled:opacity-30 disabled:hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={10} /> Link
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
  <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3 shadow-sm">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest mb-1">
        {label}
      </p>
      <p className="text-xs font-black text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const FilterButton = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
      active
        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 shadow-lg"
        : "bg-transparent text-slate-400 border-slate-100 hover:border-slate-300"
    }`}
  >
    {label}
  </button>
);

export default NetworkPage;
