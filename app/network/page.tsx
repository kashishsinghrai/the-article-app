import React, { useState, useMemo } from "react";
import {
  Search,
  MessageSquare,
  Fingerprint,
  ArrowLeft,
  RefreshCcw,
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

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.serial_id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchTerm]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  return (
    <main className="max-w-6xl px-6 py-16 mx-auto space-y-12 md:py-32">
      <section className="space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold uppercase text-[10px] tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Exit Registry
        </button>

        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-2">
            <h1 className="text-4xl italic font-black tracking-tighter uppercase md:text-7xl text-slate-900 dark:text-white">
              Registry
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Verified Correspondents Network
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 p-4 border shadow-sm bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800 text-slate-600 dark:text-white"
          >
            <RefreshCcw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isRefreshing ? "Syncing..." : "Refresh Registry"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4 px-6 py-4 border bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Locate by Name or Serial ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm font-bold bg-transparent border-none outline-none focus:ring-0 text-slate-900 dark:text-white"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => {
          const isMe = user.id === currentUserId;
          return (
            <div
              key={user.id}
              className="group bg-white dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-all shadow-sm"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 overflow-hidden border shadow-inner rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Fingerprint size={28} className="m-4 text-slate-300" />
                    )}
                  </div>
                  {user.is_online && (
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase truncate text-slate-900 dark:text-white">
                    {user.full_name} {isMe && "(Self)"}
                  </h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {user.serial_id}
                  </p>
                </div>

                <div className="flex gap-6 py-4 border-y border-slate-50 dark:border-white/5">
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase">
                      Reputation
                    </p>
                    <p className="text-sm font-black dark:text-white">
                      {user.budget || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase">
                      Status
                    </p>
                    <p className="text-sm italic font-black text-blue-600 uppercase">
                      {user.role}
                    </p>
                  </div>
                </div>

                <p className="h-8 text-xs italic font-medium leading-relaxed text-slate-500 line-clamp-2">
                  "{user.bio}"
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-6 mt-8 border-t border-slate-50 dark:border-white/5">
                <button
                  onClick={() => onViewProfile(user)}
                  className="flex-1 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase text-slate-600 dark:text-white hover:bg-slate-100 transition-all"
                >
                  Identity
                </button>
                {!isMe && (
                  <button
                    onClick={() => onChat(user)}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                  >
                    <MessageSquare size={16} /> Handshake
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default NetworkPage;
