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
  Activity,
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
    <div className="sticky top-32 bg-white dark:bg-slate-950 rounded-[3rem] p-10 border border-slate-200 dark:border-white/5 shadow-2xl space-y-10 animate-in slide-in-from-right-10 duration-700">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 text-white shadow-lg bg-slate-900 dark:bg-white rounded-2xl dark:text-slate-950">
            <Terminal size={22} />
          </div>
          <div>
            <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">
              Node Ledger
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[8px] font-bold uppercase text-emerald-500 tracking-widest">
                Active_Core_Link
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            Sector
          </p>
          <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic">
            Alpha_Node
          </p>
        </div>
      </div>

      {/* Operator ID */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">
          Operator Identity
        </label>
        <div className="flex items-center gap-4 p-5 overflow-hidden border shadow-inner bg-slate-50 dark:bg-white/5 rounded-3xl border-slate-100 dark:border-white/5 group">
          <div className="p-3 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-white/5">
            <Fingerprint
              size={28}
              className="text-[#00BFFF] group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-[13px] font-black text-slate-900 dark:text-white uppercase truncate tracking-tight">
              {profile.full_name}
            </p>
            <p className="text-[9px] font-black text-[#00BFFF] uppercase tracking-[0.2em]">
              {profile.serial_id}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 text-center bg-slate-50 dark:bg-slate-900 border rounded-[2rem] border-slate-100 dark:border-white/5 shadow-sm group hover:border-[#00BFFF]/30 transition-all">
          <Newspaper
            size={20}
            className="mx-auto mb-3 transition-colors text-slate-300 dark:text-slate-700 group-hover:text-white"
          />
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Dispatches
          </p>
          <p className="text-3xl italic font-black tracking-tighter text-slate-900 dark:text-white">
            {personalArticles.length}
          </p>
        </div>
        <div className="p-6 text-center bg-slate-50 dark:bg-slate-900 border rounded-[2rem] border-slate-100 dark:border-white/5 shadow-sm group hover:border-[#00BFFF]/30 transition-all">
          <Zap size={20} className="mx-auto mb-3 text-[#00BFFF]" />
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Reputation
          </p>
          <p className="text-3xl italic font-black text-[#00BFFF] tracking-tighter">
            {profile.budget || 0}
          </p>
        </div>
      </div>

      {/* Local Log Archive */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-50 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-slate-400" />
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Shard Local Archive
            </label>
          </div>
          <span className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase italic">
            Entry_Logs
          </span>
        </div>

        <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-3 pr-1">
          {personalArticles.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed opacity-20 border-slate-300 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center">
              <HardDrive size={32} className="mb-4 text-slate-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Empty_Buffer_Stream
              </p>
            </div>
          ) : (
            personalArticles.slice(0, 5).map((art) => (
              <div
                key={art.id}
                className="p-5 bg-white dark:bg-slate-900 border rounded-2xl border-slate-100 dark:border-white/5 hover:border-[#00BFFF]/40 group transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-[#00BFFF] rounded-full shadow-[0_0_8px_rgba(0,191,255,0.5)] group-hover:animate-ping" />
                  <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase truncate tracking-tight">
                    {art.title}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1.5 italic">
                    <Clock size={10} />{" "}
                    {new Date(art.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-[9px] font-black text-[#00BFFF] uppercase tracking-widest group-hover:translate-x-1 transition-transform cursor-pointer">
                    View_Archive
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Network Verification Seal */}
      <div className="p-8 bg-slate-950 dark:bg-white rounded-[2.5rem] flex items-center justify-between shadow-2xl group transition-all hover:scale-105 active:scale-95">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">
            Protocol_Verify
          </p>
          <p className="text-lg italic font-black leading-none tracking-tighter text-white uppercase dark:text-slate-950">
            Verified_ALPHA
          </p>
        </div>
        <div className="p-2 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          <ShieldCheck className="text-white" size={28} />
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitor;
