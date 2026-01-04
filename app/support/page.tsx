import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  Send,
  Loader2,
  ArrowLeft,
  LifeBuoy,
  Zap,
  Terminal,
  Cpu,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface SupportPageProps {
  onBack: () => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate P2P network transmission
    setTimeout(() => {
      setLoading(false);
      toast.success("Dispatch Recorded. Support node assigned.");
    }, 1500);
  };

  return (
    <main className="min-h-screen px-4 py-16 mx-auto overflow-x-hidden duration-500 md:py-24 max-w-7xl md:px-8 animate-in fade-in">
      <div className="space-y-12">
        {/* Top Navigation */}
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-white font-black uppercase text-[10px] tracking-[0.4em] transition-all group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Exit Support Shard
        </button>

        {/* Header Section */}
        <div className="flex flex-col justify-between gap-8 pb-12 border-b lg:flex-row lg:items-end border-slate-200 dark:border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#00BFFF]">
              <LifeBuoy size={24} />
              <span className="text-[11px] font-black uppercase tracking-[0.5em]">
                Technical Assistance Protocol
              </span>
            </div>
            <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase text-slate-900 dark:text-white md:text-8xl">
              Support <span className="text-[#00BFFF]">Node</span>
            </h1>
            <p className="max-w-xl text-xs font-bold leading-relaxed tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Network technical assistance and protocol resolution. If a shard
              is locked or identity sync fails, transmit a request.
            </p>
          </div>

          <div className="items-center hidden gap-6 lg:flex">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
                Global Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">
                  Operational
                </span>
              </div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-white/5" />
            <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
              <Cpu size={20} className="text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid items-start grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Inquiry Form */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-white/5 space-y-10 shadow-2xl relative overflow-hidden"
            >
              {/* Security Watermark */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <ShieldCheck size={200} />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">
                  <Terminal size={14} /> 01. Node Identification (Serial ID)
                </label>
                <input
                  required
                  className="w-full text-2xl md:text-3xl italic font-black tracking-tight text-slate-900 dark:text-white uppercase bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 outline-none focus:border-[#00BFFF]/50 transition-all placeholder:text-slate-300 dark:placeholder:text-white/5"
                  placeholder="#ART-XXXXX-IND"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">
                  <Zap size={14} /> 02. Protocol Conflict Vector
                </label>
                <select className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-xs font-black uppercase text-slate-900 dark:text-white outline-none focus:border-[#00BFFF]/50 transition-all appearance-none cursor-pointer">
                  <option>Identity Sync Failure</option>
                  <option>Credential Shard Lock</option>
                  <option>Network Latency / Lag</option>
                  <option>Account Migration</option>
                  <option>Protocol Violation Report</option>
                  <option>Other technical assistance</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">
                  <Send size={14} /> 03. Incident Narrative
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 text-lg font-medium italic leading-relaxed text-slate-700 dark:text-slate-300 outline-none focus:border-[#00BFFF]/40 transition-all resize-none placeholder:text-slate-300 dark:placeholder:text-white/5 no-scrollbar"
                  placeholder="Describe the technical conflict or protocol error in detail..."
                />
              </div>

              <div className="flex flex-col items-center justify-between gap-8 pt-8 border-t md:flex-row md:pt-12 border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-4 text-center text-slate-400 md:text-left">
                  <ShieldCheck
                    size={24}
                    className="text-emerald-500 shrink-0"
                  />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none text-slate-900 dark:text-white">
                      Encrypted Channel Active
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      request hashed & verified by support core.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-12 md:px-20 py-5 md:py-7 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-black uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-30"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Send size={20} /> Transmit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            <div className="flex items-center gap-3 px-6 lg:px-0">
              <Zap size={16} className="text-[#00BFFF]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Direct Signal Channels
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
              <ContactBox
                icon={<Mail size={28} />}
                title="Direct Signal"
                detail="hq@the-articles.org"
                desc="Asynchronous protocol resolution."
              />
              <ContactBox
                icon={<MessageSquare size={28} />}
                title="Live Comms"
                detail="Sector Room #01"
                desc="Real-time support synchronization."
              />

              <div className="bg-blue-600 p-10 rounded-[2.5rem] space-y-6 shadow-2xl text-white group hover:scale-105 transition-all cursor-pointer">
                <ShieldCheck
                  size={40}
                  className="transition-colors text-white/40 group-hover:text-white"
                />
                <div className="space-y-2">
                  <h4 className="text-xl italic font-black leading-none tracking-tighter uppercase">
                    Emergency Shard
                  </h4>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/70">
                    Protocol breach reporting only.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Connect to Root
                  </span>
                  <ArrowLeft size={16} className="rotate-180" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const ContactBox = ({
  icon,
  title,
  detail,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  desc: string;
}) => (
  <div className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 shadow-sm hover:shadow-2xl transition-all border-b-4 hover:border-b-[#00BFFF]">
    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-[#00BFFF]">
      {icon}
    </div>
    <div className="space-y-2">
      <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
        {title}
      </h4>
      <p className="text-xl italic font-black tracking-tight uppercase text-slate-900 dark:text-white">
        {detail}
      </p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {desc}
      </p>
    </div>
  </div>
);

export default SupportPage;
