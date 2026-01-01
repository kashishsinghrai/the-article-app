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
  ArrowLeft,
} from "lucide-react";
import { Profile } from "../../types";

interface NetworkPageProps {
  users: Profile[];
  currentUserId?: string;
  onViewProfile: (user: Profile) => void;
  onChat: (user: Profile) => void;
  onBack: () => void;
}

const NetworkPage: React.FC<NetworkPageProps> = ({
  users,
  currentUserId,
  onViewProfile,
  onChat,
  onBack,
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
    <main className="px-6 py-16 mx-auto space-y-12 max-w-7xl md:py-32">
      <section className="space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] tracking-widest transition-all"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <NetworkIcon size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Connect & Voice Network
              </span>
            </div>
            <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-9xl text-slate-900 dark:text-white">
              Network
            </h1>
          </div>
          <div className="flex w-full gap-4 md:w-auto">
            <StatSmall
              label="Active"
              value={users.length}
              icon={<Users size={16} />}
            />
            <StatSmall
              label="Verified"
              value={users.filter((u) => u.role === "admin").length}
              icon={<ShieldCheck size={16} />}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-2 bg-white border shadow-xl lg:flex-row dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-white/5">
          <div className="flex items-center flex-grow gap-3 px-5 py-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Locate people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-full text-[14px] font-bold text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2 p-1 overflow-x-auto">
            <FilterButton
              label="All People"
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

      <section className="grid grid-cols-1 gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-10">
        {filteredUsers.length === 0 ? (
          <div className="py-24 space-y-4 text-center col-span-full opacity-30">
            <Zap size={48} className="mx-auto text-slate-300" />
            <p className="text-xl italic font-black tracking-widest uppercase text-slate-400">
              Searching for connections...
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`group bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-2 border-slate-100 dark:border-white/5 hover:border-blue-600 transition-all duration-500 flex flex-col justify-between h-full shadow-lg hover:shadow-2xl ${
                user.id === currentUserId ? "ring-4 ring-blue-600/10" : ""
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Fingerprint size={32} />
                    </div>
                    {user.is_online && (
                      <div className="absolute w-5 h-5 border-4 border-white rounded-full shadow-md -top-1 -right-1 bg-emerald-500 dark:border-slate-900 animate-pulse" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      user.role === "admin"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {user.role === "admin" ? "Authority" : "User"}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl italic font-black tracking-tighter uppercase truncate transition-colors text-slate-950 dark:text-white group-hover:text-blue-600">
                    {user.full_name} {user.id === currentUserId && "(You)"}
                  </h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {user.serial_id}
                  </p>
                </div>

                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[3rem]">
                  {user.bio ||
                    "Professional reporter on the global voice network."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 mt-8 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={() => onViewProfile(user)}
                  className="py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-slate-200 transition-all flex items-center justify-center"
                >
                  {user.id === currentUserId ? "Profile" : "About"}
                </button>
                <button
                  onClick={() => onChat(user)}
                  disabled={user.id === currentUserId}
                  className="py-4 rounded-2xl bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-950 shadow-xl disabled:opacity-20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} /> Talk
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
  <div className="flex items-center gap-4 px-6 py-4 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-white/5">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">
        {label}
      </p>
      <p className="text-base font-black text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const FilterButton = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${
      active
        ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 shadow-lg"
        : "bg-transparent text-slate-400 border-slate-100 hover:border-slate-300"
    }`}
  >
    {label}
  </button>
);

export default NetworkPage;
