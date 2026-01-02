import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Fingerprint,
  ArrowLeft,
  RefreshCcw,
  Loader2,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Profile } from "../../types";

interface NetworkPageProps {
  users: Profile[];
  currentUserId?: string;
  onViewProfile: (user: Profile) => void;
  onChat: (user: Profile) => void;
  onBack: () => void;
  currentUserProfile?: Profile | null;
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-sync on mount to ensure we have the latest registry from the global store
  useEffect(() => {
    if (onRefresh) onRefresh();
  }, [onRefresh]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchTerm.toLowerCase();
      return (
        u.full_name?.toLowerCase().includes(query) ||
        u.serial_id?.toLowerCase().includes(query) ||
        u.username?.toLowerCase().includes(query)
      );
    });
  }, [users, searchTerm]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 800);
      }
    }
  };

  return (
    <main className="px-6 py-16 mx-auto space-y-12 duration-700 max-w-7xl md:py-32 animate-in fade-in">
      <section className="space-y-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />{" "}
          Exit Registry Shard
        </button>

        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-blue-600">
              <Globe size={24} />
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                Global Node Registry
              </span>
            </div>
            <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-8xl text-slate-900 dark:text-white">
              Registry
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-md">
              Index of all verified correspondents and intelligence nodes active
              within the network sector.
            </p>
          </div>

          <div className="flex flex-col w-full gap-4 sm:flex-row lg:w-auto">
            <div className="flex items-center flex-grow gap-4 px-6 py-4 transition-all border shadow-sm lg:w-80 bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-600/20">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="LOCATE IDENTITY..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
              />
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-3 px-8 py-4 transition-all bg-white border shadow-sm dark:bg-slate-950 rounded-2xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50"
            >
              <RefreshCcw
                size={16}
                className={isRefreshing ? "animate-spin" : ""}
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isRefreshing ? "Syncing..." : "Sync Registry"}
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 pb-32 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.length === 0 ? (
          <div className="space-y-6 text-center col-span-full py-60">
            <div className="relative inline-block">
              <Fingerprint
                size={80}
                className="mx-auto text-slate-100 dark:text-slate-900"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Search size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-300">
                No Nodes Detected
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                Try adjusting your identification filters.
              </p>
            </div>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isMe = user.id === currentUserId;
            return (
              <div
                key={user.id}
                className="group bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-all shadow-sm hover:shadow-2xl relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-4 transition-opacity opacity-5 group-hover:opacity-20">
                  <ShieldCheck size={40} />
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <div className="w-20 h-20 overflow-hidden transition-transform duration-500 border shadow-inner rounded-3xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 group-hover:scale-105">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Fingerprint
                            size={32}
                            className="m-6 text-slate-200"
                          />
                        )}
                      </div>
                      {user.is_online && (
                        <div className="absolute w-5 h-5 border-4 border-white rounded-full shadow-lg -bottom-1 -right-1 bg-emerald-500 dark:border-slate-950 animate-pulse" />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">
                        Status
                      </p>
                      <p
                        className={`text-[10px] font-black uppercase italic ${
                          user.is_online ? "text-emerald-500" : "text-slate-400"
                        }`}
                      >
                        {user.is_online ? "ACTIVE" : "IDLE"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl italic font-black leading-none tracking-tighter uppercase truncate text-slate-900 dark:text-white">
                      {user.full_name} {isMe && "(SELF)"}
                    </h3>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">
                      {user.serial_id}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 dark:border-white/5">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Reputation
                      </p>
                      <p className="text-xl italic font-black tracking-tighter dark:text-white">
                        {user.budget || 0}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Protocol
                      </p>
                      <p className="text-sm font-black tracking-widest uppercase text-slate-900 dark:text-white">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <p className="h-10 text-xs italic font-medium leading-relaxed text-slate-500 line-clamp-2">
                    "{user.bio || "Verified correspondent node in the sector."}"
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => onViewProfile(user)}
                      className="flex-1 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase text-slate-600 dark:text-white hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all shadow-sm"
                    >
                      Audit Identity
                    </button>
                    {!isMe && (
                      <button
                        onClick={() => onChat(user)}
                        className="flex-1 py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                      >
                        <MessageSquare size={16} /> Handshake
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
};

export default NetworkPage;
