
import React from 'react';
import { Mail, MessageSquare, Info, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SupportPage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-32">
       <div className="max-w-3xl mx-auto space-y-24">
          <div className="text-center space-y-6">
             <h1 className="text-7xl font-black text-slate-900 uppercase italic tracking-tighter">Operational <br/>Support</h1>
             <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Filing an inquiry with Command Central</p>
          </div>

          <div className="space-y-12">
             <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Identity Serial</label>
                   <input className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black uppercase italic tracking-tighter text-slate-900" placeholder="#ART-XXXXX" />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Operational Category</label>
                   <select className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black uppercase tracking-widest text-xs">
                      <option>Technical Anomaly</option>
                      <option>Credential Reset</option>
                      <option>Budget Discrepancy</option>
                      <option>Ethical Violation</option>
                   </select>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Details</label>
                   <textarea rows={6} className="w-full bg-slate-50 border-none rounded-3xl px-8 py-5 font-medium text-slate-600" placeholder="Provide full context..." />
                </div>
                <button 
                  onClick={() => toast.success('Operational Inquiry Transmitted')}
                  className="w-full py-6 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all"
                >
                  Transmit Ticket
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ContactBox icon={<Mail />} title="E-Mail" detail="command@the-articles.org" />
                <ContactBox icon={<MessageSquare />} title="Secure Chat" detail="Internal Channel #09" />
             </div>
          </div>
       </div>
    </main>
  );
};

const ContactBox = ({ icon, title, detail }: any) => (
  <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col items-center text-center space-y-4">
     <div className="text-blue-600">{icon}</div>
     <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">{title}</h4>
        <p className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{detail}</p>
     </div>
  </div>
);

export default SupportPage;
