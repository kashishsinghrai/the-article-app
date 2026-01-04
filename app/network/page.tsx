import React, { useState, useMemo } from "react";
import {
  Search,
  MessageSquare,
  Fingerprint,
  ArrowLeft,
  UserPlus,
  UserMinus,
  Users,
  ShieldCheck,
  MoreHorizontal,
  Target,
  Globe,
  Radio,
} from "lucide-react";
import { Profile } from "../../types.ts";
import { useStore } from "../../lib/store.ts";

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
          u.serial_id?.toLowerCase().includes(q)
        );
      }),
    [users, searchTerm]
  );

  return (
    <main className="max-w-5xl px-4 py-8 mx-auto space-y-6 duration-500 md:space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-colors text-slate-500 hover:text-blue-500"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-black tracking-widest uppercase">
            Back
          </span>
        </button>
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-blue-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Node Hub
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/10 p-4 md:p-6 shadow-sm space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-xl font-black tracking-tight uppercase md:text-2xl text-slate-900 dark:text-white">
              <Users size={20} className="text-blue-500" /> Registry Matrix
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
              Authorized Sector Correspondents
            </p>
          </div>

          <div className="relative w-full md:w-72 group">
            <Search
              size={14}
              className="absolute transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-400 group-focus-within:text-blue-500"
            />
            <input
              placeholder="Search by name or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#050505] border border-slate-200 dark:border-white/5 rounded-full py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500/50 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 py-1 overflow-x-auto no-scrollbar">
          {["All Nodes", "Nearby", "High Rep", "Recent"].map((filter, i) => (
            <button
              key={filter}
              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                i === 0
                  ? "bg-blue-500 text-white border-blue-500 shadow-md"
                  : "bg-white dark:bg-transparent text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-400"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-24 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="py-20 space-y-4 text-center col-span-full opacity-30">
            <Globe size={48} className="mx-auto text-slate-400" />
            <p className="text-xs font-black uppercase tracking-[0.4em]">
              Zero Identities Detected
            </p>
          </div>
        ) : (
          filtered.map((user) => {
            const isMe = user.id === currentUserId;
            const isFollowing = followingIds.includes(user.id);
            const mutualCount = Math.floor(Math.random() * 50);

            return (
              <div
                key={user.id}
                className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col group hover:shadow-lg transition-all"
              >
                <div className="h-14 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-[#111] dark:to-blue-900/10 relative p-3">
                  <div className="absolute top-2 right-2">
                    <button className="text-slate-300 hover:text-slate-600 dark:hover:text-white">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>

                <div className="relative flex flex-col items-center px-4 pb-4 space-y-3 text-center -mt-7">
                  <div
                    onClick={() => onViewProfile(user)}
                    className="w-20 h-20 rounded-full bg-white dark:bg-[#111] border-4 border-white dark:border-[#0a0a0a] overflow-hidden shadow-md flex items-center justify-center cursor-pointer hover:brightness-110 transition-all"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        className="object-cover w-full h-full"
                        alt={user.full_name}
                      />
                    ) : (
                      <Fingerprint size={32} className="text-slate-200" />
                    )}
                  </div>

                  <div className="w-full space-y-1 overflow-hidden">
                    <div className="flex items-center justify-center gap-1">
                      <h3 className="text-sm font-black uppercase truncate text-slate-900 dark:text-white">
                        {user.full_name} {isMe && "(You)"}
                      </h3>
                      <ShieldCheck
                        size={12}
                        className="text-blue-500 shrink-0"
                      />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                      {user.serial_id} • Sector_{user.gender}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase">
                      <Users size={10} className="text-blue-500" />{" "}
                      {mutualCount} Mutual Handshakes
                    </div>
                    <p className="text-[10px] italic leading-tight text-slate-500 line-clamp-2 px-2 h-8">
                      "
                      {user.bio ||
                        "Maintaining network integrity and verification protocol."}
                      "
                    </p>
                  </div>

                  <div className="flex w-full gap-2 pt-2">
                    {isMe ? (
                      <button
                        onClick={() => onViewProfile(user)}
                        className="flex-grow py-2 bg-slate-100 dark:bg-white/5 rounded-lg text-[10px] font-black uppercase text-slate-600 dark:text-white hover:bg-slate-200 transition-all border border-slate-200 dark:border-white/5"
                      >
                        Profile
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleFollow(user.id)}
                          className={`flex-grow py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1.5 border ${
                            isFollowing
                              ? "bg-slate-50 dark:bg-transparent text-slate-400 border-slate-200 dark:border-white/10"
                              : "bg-white dark:bg-transparent text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                          }`}
                        >
                          {isFollowing ? "Following" : "Connect"}
                        </button>
                        <button
                          onClick={() => onChat(user)}
                          className="px-3 py-2 transition-all border rounded-lg bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 hover:text-blue-500"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center p-2 mt-auto border-t bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1 text-[7px] font-black uppercase tracking-widest text-slate-400">
                    <Target size={8} /> Reputation Shard: {user.budget || 0}%
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
