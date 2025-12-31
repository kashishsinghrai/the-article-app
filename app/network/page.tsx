
import React from 'react';
import { Globe, Users, Zap, ShieldCheck, Map } from 'lucide-react';

const NetworkPage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-32 space-y-40">
       <section className="text-center space-y-10">
          <h1 className="text-8xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">The <span className="text-blue-600">Protocol</span></h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed uppercase tracking-tight">
            ThE-ARTICLES is not just a platform; it's a global agreement on factual integrity.
          </p>
       </section>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat icon={<Globe />} label="Nations" val="142" />
          <Stat icon={<Users />} label="Reporters" val="82.4k" />
          <Stat icon={<Zap />} label="Reports" val="1.2m" />
          <Stat icon={<ShieldCheck />} label="Verified" val="99.4%" />
       </div>

       <div className="bg-slate-900 rounded-[4rem] p-20 text-white flex flex-col lg:flex-row items-center gap-24 overflow-hidden relative">
          <Map className="absolute -left-20 -bottom-20 w-[600px] h-[600px] text-white/[0.02] rotate-12" />
          <div className="flex-1 space-y-10 relative z-10">
             <h2 className="text-5xl font-black uppercase italic tracking-tighter">Global Authority Index</h2>
             <p className="text-slate-400 text-lg font-medium leading-relaxed">
               Our decentralized consensus algorithm ensures that no single entity can censor or manipulate the truth. Every report is cross-referenced by a network of peer-validators.
             </p>
             <button className="px-10 py-4 border-2 border-white/20 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                Download Operational Whitepaper
             </button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-6 relative z-10">
             <div className="aspect-square bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center space-y-2">
                <span className="text-4xl font-black italic tracking-tighter tabular-nums">1.2s</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sync Latency</span>
             </div>
             <div className="aspect-square bg-blue-600 rounded-[2.5rem] flex flex-col items-center justify-center space-y-2 shadow-2xl">
                <span className="text-4xl font-black italic tracking-tighter tabular-nums">24/7</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Live Uptime</span>
             </div>
          </div>
       </div>
    </main>
  );
};

const Stat = ({ icon, label, val }: any) => (
  <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-4">
     <div className="text-blue-600">{icon}</div>
     <div>
        <div className="text-4xl font-black tracking-tighter italic tabular-nums text-slate-900">{val}</div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{label}</div>
     </div>
  </div>
);

export default NetworkPage;
