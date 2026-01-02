import React from "react";
import {
  ShieldCheck,
  Fingerprint,
  Newspaper,
  Zap,
  Database,
  Terminal,
  Clock,
  HardDrive,
} from "lucide-react";
import { Profile, Article } from "../types";

interface NetworkMonitorProps {
  profile: Profile | null;
  personalArticles: Article[];
}

const NetworkMonitor: React.FC<NetworkMonitorProps> = ({
  profile,
  personalArticles,
}) => {
  if (!profile) return null;

  return (
    <div className="sticky top-32 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-2xl space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 text-white shadow-lg bg-slate-950 dark:bg-white rounded-xl dark:text-slate-900">
            <Terminal size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
              Node Ledger
            </h4>
            <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 animate-pulse">
              Syncing User DB...
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-white border shadow-sm dark:bg-slate-950 rounded-2xl border-slate-100 dark:border-white/5">
          <Fingerprint size={24} className="text-blue-600" />
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">
              {profile.full_name}
            </p>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              {profile.serial_id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 text-center bg-white border dark:bg-slate-950 rounded-3xl border-slate-100 dark:border-white/5">
          <Newspaper size={16} className="mx-auto mb-2 text-slate-300" />
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Reports
          </p>
          <p className="text-xl italic font-black dark:text-white">
            {personalArticles.length}
          </p>
        </div>
        <div className="p-5 text-center bg-white border dark:bg-slate-950 rounded-3xl border-slate-100 dark:border-white/5">
          <Zap size={16} className="mx-auto mb-2 text-blue-600" />
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Reputation
          </p>
          <p className="text-xl italic font-black text-blue-600">
            {profile.budget}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={12} className="text-slate-400" />
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Database Records
            </label>
          </div>
          <span className="text-[8px] font-black text-slate-300 uppercase italic">
            Entry History
          </span>
        </div>

        <div className="max-h-[250px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
          {personalArticles.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed opacity-20 border-slate-200 dark:border-slate-800 rounded-3xl">
              <HardDrive size={24} className="mx-auto mb-2" />
              <p className="text-[8px] font-black uppercase tracking-widest">
                Storage Empty
              </p>
            </div>
          ) : (
            personalArticles.map((art) => (
              <div
                key={art.id}
                className="p-3 transition-all bg-white border dark:bg-slate-950 rounded-xl border-slate-50 dark:border-white/5 hover:border-blue-600/30 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  <p className="text-[9px] font-black text-slate-900 dark:text-white uppercase truncate tracking-tight">
                    {art.title}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                    <Clock size={8} />{" "}
                    {new Date(art.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-[7px] font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    View Log
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 bg-slate-950 dark:bg-white rounded-[2rem] flex items-center justify-between shadow-xl">
        <div className="space-y-0.5">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
            Network Status
          </p>
          <p className="text-sm italic font-black text-white uppercase dark:text-slate-950">
            LIVE NODE
          </p>
        </div>
        <ShieldCheck className="text-emerald-500" size={24} />
      </div>
    </div>
  );
};

export default NetworkMonitor;
