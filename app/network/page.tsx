import React, { useState, useMemo } from "react";
import {
  Search,
  MessageSquare,
  Fingerprint,
  ArrowLeft,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { Profile } from "../../types";
import { useStore } from "../../lib/store";

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
  const { followingIds, toggleFollow } = useStore();

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
    <main className="max-w-6xl px-4 py-16 mx-auto space-y-12 animate-in fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-3 text-slate-500 hover:text-white uppercase text-[10px] font-black tracking-widest group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1" /> Exit
        Registry
      </button>

      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="space-y-2">
          <h1 className="text-4xl italic font-black uppercase text-slate-900 dark:text-white">
            Registry <span className="text-[#00BFFF]">Matrix</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            Authorized Global Correspondents
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute -translate-y-1/2 left-5 top-1/2 text-slate-400"
          />
          <input
            placeholder="Identity Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase text-white outline-none focus:border-[#00BFFF]/40 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 pb-32 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((user) => {
          const isMe = user.id === currentUserId;
          const isFollowing = followingIds.includes(user.id);

          return (
            <div
              key={user.id}
              className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col group hover:border-[#00BFFF]/40 transition-all shadow-xl"
            >
              <div className="h-24 bg-gradient-to-r from-[#00BFFF]/5 to-transparent p-6 flex justify-between items-start relative">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#111] border-4 border-white dark:border-[#0a0a0a] overflow-hidden shadow-xl flex items-center justify-center">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Fingerprint size={28} className="text-slate-800" />
                  )}
                </div>
                {!isMe && (
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`p-3 rounded-xl transition-all ${
                      isFollowing
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-white/10 text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {isFollowing ? (
                      <UserMinus size={18} />
                    ) : (
                      <UserPlus size={18} />
                    )}
                  </button>
                )}
              </div>

              <div className="p-8 pt-10 space-y-6">
                <div>
                  <h3 className="text-xl font-black leading-none uppercase truncate text-slate-950 dark:text-white">
                    {user.full_name} {isMe && "(SELF)"}
                  </h3>
                  <p className="text-[9px] font-black text-[#00BFFF] uppercase tracking-widest mt-2">
                    {user.serial_id}
                  </p>
                </div>

                <p className="text-xs italic leading-relaxed text-slate-500 line-clamp-2">
                  "{user.bio || "Observing network integrity."}"
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewProfile(user)}
                    className="flex-1 py-3 bg-slate-50 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all"
                  >
                    Audit
                  </button>
                  {!isMe && (
                    <button
                      onClick={() => onChat(user)}
                      className="flex-1 py-3 bg-[#00BFFF] text-white rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#00BFFF]/20 active:scale-95 transition-all"
                    >
                      <MessageSquare size={14} /> Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default NetworkPage;
