import React from "react";
import {
  Globe,
  Users,
  Zap,
  ShieldCheck,
  Map,
  Search,
  MessageSquare,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { Profile } from "../../types";

interface NetworkPageProps {
  users?: Profile[];
  onViewProfile?: (u: Profile) => void;
  onChat?: (u: Profile) => void;
}

const NetworkPage: React.FC<NetworkPageProps> = ({
  users = [],
  onViewProfile,
  onChat,
}) => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-32 space-y-40">
      <section className="text-center space-y-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 text-blue-600">
          <Globe size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Global Node Directory
          </span>
        </div>
        <h1 className="text-8xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none transition-colors">
          The <span className="text-blue-600">Correspondents</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed uppercase tracking-tight italic transition-colors">
          A real-time index of verified citizen journalists maintaining the
          network's integrity.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Stat icon={<Globe />} label="Active Regions" val="142" />
        <Stat
          icon={<Users />}
          label="Nodes Syncing"
          val={users.length.toString()}
        />
        <Stat icon={<Zap />} label="Handshakes" val="1.2m" />
        <Stat icon={<ShieldCheck />} label="Trust Level" val="99.4%" />
      </div>

      {/* Users Directory */}
      <div className="space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
              Global <br />
              Directory
            </h2>
          </div>
          <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-full border border-slate-100 dark:border-slate-800 flex items-center gap-4 w-full max-w-md shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input
              className="bg-transparent border-none focus:ring-0 text-xs font-black uppercase tracking-widest w-full dark:text-white"
              placeholder="QUERY SERIAL ID OR NAME..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {users.map((user) => (
            <div
              key={user.id}
              className="group p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center space-y-6 relative overflow-hidden"
            >
              {user.is_online && (
                <div className="absolute top-8 right-8 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">
                    LIVE
                  </span>
                </div>
              )}

              <div className="w-24 h-24 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-300 group-hover:border-blue-600 transition-all duration-500">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  className="w-full h-full object-cover p-2"
                  alt={user.username}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
                  {user.full_name}
                </h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                  {user.serial_id}
                </p>
              </div>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic leading-relaxed line-clamp-2 px-4">
                "{user.bio}"
              </p>

              <div className="flex gap-3 pt-4 w-full">
                <button
                  onClick={() => onViewProfile?.(user)}
                  className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-50 transition-all"
                >
                  <ExternalLink size={12} /> View File
                </button>
                <button
                  onClick={() => onChat?.(user)}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[4rem] p-20 text-white flex flex-col lg:flex-row items-center gap-24 overflow-hidden relative">
        <Map className="absolute -left-20 -bottom-20 w-[600px] h-[600px] text-white/[0.02] rotate-12" />
        <div className="flex-1 space-y-10 relative z-10">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">
            Peer-to-Peer <br />
            Handshake Protocol
          </h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
            The directory utilizes a high-frequency polling service to maintain
            node presence. Communications are ephemeral and encrypted at the
            network layer.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-full border border-white/10">
              <UserCheck size={14} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {users.length} Nodes Online
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-6 relative z-10 w-full">
          <div className="aspect-square bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center space-y-2">
            <span className="text-4xl font-black italic tracking-tighter tabular-nums text-white">
              1.2s
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Sync Latency
            </span>
          </div>
          <div className="aspect-square bg-blue-600 rounded-[2.5rem] flex flex-col items-center justify-center space-y-2 shadow-2xl">
            <span className="text-4xl font-black italic tracking-tighter tabular-nums text-white">
              24/7
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">
              Live Uptime
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

const Stat = ({ icon, label, val }: any) => (
  <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 group hover:border-blue-200 transition-all">
    <div className="text-blue-600">{icon}</div>
    <div>
      <div className="text-4xl font-black tracking-tighter italic tabular-nums text-slate-900 dark:text-white transition-colors">
        {val}
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">
        {label}
      </div>
    </div>
  </div>
);

export default NetworkPage;
