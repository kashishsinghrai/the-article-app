import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Fingerprint,
  ShieldCheck,
  Zap,
  UserCheck,
  Award,
  MapPin,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { Profile } from "../../types";
import { toast } from "react-hot-toast";

interface NetworkPageProps {
  users: Profile[];
  currentUserId?: string;
  onViewProfile: (user: Profile) => void;
  onChat: (user: Profile) => void;
  onBack: () => void;
  onRefresh?: () => void;
}

const NetworkPage: React.FC<NetworkPageProps> = ({
  users,
  currentUserId,
  onViewProfile,
  onChat,
  onBack,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (onRefresh) onRefresh();
  }, []);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = searchTerm.toLowerCase();
        return (
          u.full_name?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.serial_id?.includes(q)
        );
      }),
    [users, searchTerm]
  );

  return (
    <main className="max-w-6xl px-4 py-12 pt-16 pb-40 mx-auto space-y-12 transition-all duration-300 md:px-6 animate-in fade-in lg:pb-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-white font-black uppercase text-[10px] tracking-[0.4em] transition-all group mb-8"
      >
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-1"
        />
        Exit Registry Shard
      </button>

      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[#00BFFF] mb-1">
            <ShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Global Node Registry
            </span>
          </div>
          <h1 className="text-4xl italic font-black tracking-tighter uppercase md:text-5xl text-slate-900 dark:text-white">
            Directory <span className="text-[#00BFFF]">Archive</span>
          </h1>
          <p className="text-xs font-bold leading-loose tracking-widest uppercase text-slate-400 dark:text-slate-500">
            Verified correspondent directory across the intelligence sector.
          </p>
        </div>

        <div className="relative w-full group md:w-80">
          <Search
            size={16}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00BFFF] transition-colors"
          />
          <input
            placeholder="Search by alias or serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs text-slate-900 dark:text-white outline-none focus:border-[#00BFFF]/30 transition-all shadow-xl dark:shadow-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="py-20 text-center col-span-full opacity-20">
            <Zap size={48} className="mx-auto text-[#00BFFF]" />
            <p className="text-xs font-black uppercase mt-4 tracking-[0.3em]">
              No Active Signals Found
            </p>
          </div>
        ) : (
          filtered.map((user) => {
            const isMe = user.id === currentUserId;
            return (
              <div
                key={user.id}
                className="group bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-[#00BFFF]/40 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl flex flex-col"
                onClick={() => onViewProfile(user)}
              >
                {/* Profile Cover Asset */}
                <div className="h-24 bg-gradient-to-r from-[#00BFFF]/20 to-slate-200 dark:to-slate-800 relative">
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-3xl bg-white dark:bg-[#0a0a0a] overflow-hidden border-4 border-white dark:border-[#1A1A1A] flex items-center justify-center shadow-xl">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Fingerprint
                          size={32}
                          className="text-slate-200 dark:text-slate-800"
                        />
                      )}
                    </div>
                    {user.is_online && (
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-[#1A1A1A] animate-pulse" />
                    )}
                  </div>
                  <div className="absolute top-4 right-6">
                    <span className="px-3 py-1 bg-black/10 dark:bg-black/40 backdrop-blur-md rounded-full text-[7px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em] border border-white/10">
                      Sector_A1
                    </span>
                  </div>
                </div>

                <div className="pt-12 space-y-6 p-7">
                  <div className="flex items-start justify-between">
                    <div className="overflow-hidden">
                      <h4 className="text-lg font-black leading-tight tracking-tight uppercase truncate text-slate-900 dark:text-white">
                        {user.full_name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Award size={10} className="text-[#00BFFF]" />
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Verified Correspondent
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs italic font-medium leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                      "
                      {user.bio ||
                        "Observing network integrity and factual dispatches across the local shard."}
                      "
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-black/30 rounded-xl border border-slate-100 dark:border-white/5">
                        <Activity size={10} className="text-emerald-500" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          Trust_{user.budget || 0}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-black/30 rounded-xl border border-slate-100 dark:border-white/5">
                        <MapPin size={10} className="text-[#00BFFF]" />
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          {user.serial_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-5 border-t border-slate-50 dark:border-white/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(user);
                      }}
                      className="flex-1 py-3 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                    >
                      Audit
                    </button>
                    {!isMe && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onChat(user);
                        }}
                        className="flex-1 py-3 bg-[#00BFFF] text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#00BFFF]/20 flex items-center justify-center gap-2"
                      >
                        <MessageSquare size={14} /> Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
};

export default NetworkPage;
