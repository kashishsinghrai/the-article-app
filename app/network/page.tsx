import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Fingerprint,
  ArrowLeft,
  Globe,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { Profile } from "../../types";

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
    <main className="px-6 py-16 mx-auto space-y-12 duration-500 max-w-7xl animate-in fade-in">
      <section className="space-y-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-950 dark:hover:text-white font-black uppercase text-[10px] tracking-widest group transition-all"
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
            <h1 className="text-5xl italic font-black tracking-tighter uppercase md:text-8xl text-slate-900 dark:text-white">
              Registry
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-md">
              Index of verified correspondent nodes active within the network.
            </p>
          </div>

          <div className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 w-full lg:w-96 shadow-sm focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="LOCATE IDENTITY..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-[11px] font-black uppercase text-slate-900 dark:text-white outline-none w-full"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 pb-32 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="py-40 text-center col-span-full opacity-20">
            <Fingerprint size={64} className="mx-auto" />
            <p className="mt-4 text-sm font-black uppercase">
              No Nodes Detected
            </p>
          </div>
        ) : (
          filtered.map((user) => {
            const isMe = user.id === currentUserId;
            return (
              <div
                key={user.id}
                className="group bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 hover:border-blue-600 transition-all shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <ShieldCheck size={120} className="dark:text-white" />
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center justify-center w-20 h-20 overflow-hidden border shadow-inner rounded-3xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-white/5">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          className="object-cover w-full h-full"
                          alt=""
                        />
                      ) : (
                        <Fingerprint size={32} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-widest italic border border-emerald-500/20">
                        Online
                      </span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl italic font-black tracking-tight uppercase truncate text-slate-900 dark:text-white">
                      {user.full_name}{" "}
                      {isMe && (
                        <span className="ml-1 text-blue-600">(SELF)</span>
                      )}
                    </h3>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                      {user.serial_id}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 dark:border-white/5">
                    <div className="space-y-1">
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
                        Reputation
                      </p>
                      <p className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
                        {user.budget || 0}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
                        Dossier Access
                      </p>
                      <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic">
                        {user.is_private ? "Encrypted" : "Public"}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs italic text-slate-500 line-clamp-2 leading-relaxed min-h-[40px]">
                    "
                    {user.bio ||
                      "No professional manifesto recorded for this node."}
                    "
                  </p>
                </div>

                <div className="relative z-10 flex gap-3 pt-8">
                  <button
                    onClick={() => onViewProfile(user)}
                    className="flex-1 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase text-slate-600 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all border border-slate-100 dark:border-white/5 shadow-sm"
                  >
                    Audit Dossier
                  </button>
                  {!isMe && (
                    <button
                      onClick={() => onChat(user)}
                      className="flex-1 py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                      <MessageSquare size={16} /> Handshake
                    </button>
                  )}
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
