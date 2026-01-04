import React from "react";
import {
  Fingerprint,
  Newspaper,
  Zap,
  Terminal,
  Database,
  Clock,
  HardDrive,
  ShieldCheck,
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
    <div className="sticky top-32 bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl space-y-8 animate-in slide-in-from-right-10 duration-700">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white text-slate-950 rounded-xl">
            <Terminal size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-white">
              Node Ledger
            </h4>
            <p className="text-[8px] font-bold uppercase text-emerald-500">
              Core_Connected
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 overflow-hidden border shadow-sm bg-slate-950 rounded-2xl border-white/5">
          <Fingerprint size={24} className="text-blue-600 shrink-0" />
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-white uppercase truncate">
              {profile.full_name}
            </p>
            <p className="text-[7px] font-bold text-slate-400 uppercase">
              {profile.serial_id}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 text-center border bg-slate-950 rounded-3xl border-white/5">
          <Newspaper size={16} className="mx-auto mb-2 text-slate-700" />
          <p className="text-[8px] font-black text-slate-500 uppercase">
            Reports
          </p>
          <p className="text-xl italic font-black text-white">
            {personalArticles.length}
          </p>
        </div>
        <div className="p-5 text-center border bg-slate-950 rounded-3xl border-white/5">
          <Zap size={16} className="mx-auto mb-2 text-blue-600" />
          <p className="text-[8px] font-black text-slate-500 uppercase">
            Reputation
          </p>
          <p className="text-xl italic font-black text-blue-600">
            {profile.budget || 0}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={12} className="text-slate-400" />
            <label className="text-[9px] font-black uppercase text-slate-400">
              Local Archive
            </label>
          </div>
          <span className="text-[8px] font-black text-slate-300 uppercase italic">
            Latest_Logs
          </span>
        </div>
        <div className="max-h-[250px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
          {personalArticles.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed opacity-20 border-slate-800 rounded-3xl">
              <HardDrive size={24} className="mx-auto mb-2 text-slate-600" />
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                Empty_Buffer
              </p>
            </div>
          ) : (
            personalArticles.map((art) => (
              <div
                key={art.id}
                className="p-3 transition-all border bg-slate-950/80 rounded-xl border-white/5 hover:border-blue-600/30 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  <p className="text-[9px] font-black text-white uppercase truncate">
                    {art.title}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[7px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Clock size={8} />{" "}
                    {new Date(art.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-[7px] font-black text-blue-600 uppercase group-hover:translate-x-1 transition-transform">
                    Access
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="p-6 bg-white rounded-[2rem] flex items-center justify-between shadow-xl">
        <div className="space-y-0.5">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
            Protocol Status
          </p>
          <p className="text-sm italic font-black uppercase text-slate-950">
            LIVE_NODE_ALPHA
          </p>
        </div>
        <ShieldCheck className="text-emerald-500" size={24} />
      </div>
    </div>
  );
};

export default NetworkMonitor;
