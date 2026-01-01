import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  Info,
  ShieldCheck,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const SupportPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Operational Inquiry Transmitted");
    }, 1500);
  };

  return (
    <main className="px-4 py-20 mx-auto max-w-7xl md:px-6 md:py-32">
      <div className="max-w-3xl mx-auto space-y-12 md:space-y-24">
        <div className="space-y-4 text-center md:space-y-6">
          <h1 className="text-4xl italic font-black leading-none tracking-tighter uppercase sm:text-5xl md:text-7xl text-slate-900 dark:text-white">
            Operational <br className="hidden sm:block" />
            Support
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-xs">
            Filing an inquiry with Command Central
          </p>
        </div>

        <div className="space-y-8 md:space-y-12">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-xl space-y-6 md:space-y-10"
          >
            <div className="space-y-2 md:space-y-4">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">
                Identity Serial
              </label>
              <input
                required
                className="w-full px-5 py-4 text-sm italic font-black tracking-tighter uppercase border-none bg-slate-50 dark:bg-slate-950 rounded-xl md:rounded-2xl md:px-8 md:py-5 text-slate-900 dark:text-white md:text-base"
                placeholder="#ART-XXXXX"
              />
            </div>
            <div className="space-y-2 md:space-y-4">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">
                Operational Category
              </label>
              <select className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl md:rounded-2xl px-5 py-4 md:px-8 md:py-5 font-black uppercase tracking-widest text-[10px] md:text-xs dark:text-white cursor-pointer">
                <option>Technical Anomaly</option>
                <option>Credential Reset</option>
                <option>Budget Discrepancy</option>
                <option>Ethical Violation</option>
              </select>
            </div>
            <div className="space-y-2 md:space-y-4">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">
                Details
              </label>
              <textarea
                required
                rows={5}
                className="w-full px-5 py-4 text-sm font-medium border-none bg-slate-50 dark:bg-slate-950 rounded-xl md:rounded-3xl md:px-8 md:py-5 text-slate-600 dark:text-slate-300 md:text-base"
                placeholder="Provide full context..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-3 py-5 font-black tracking-widest text-white uppercase transition-all rounded-full shadow-2xl md:py-6 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-100 hover:text-white disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={18} /> Transmit Ticket
                </>
              )}
            </button>
          </form>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <ContactBox
              icon={<Mail size={20} />}
              title="E-Mail"
              detail="command@the-articles.org"
            />
            <ContactBox
              icon={<MessageSquare size={20} />}
              title="Secure Chat"
              detail="Internal Channel #09"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

const ContactBox = ({ icon, title, detail }: any) => (
  <div className="p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center space-y-3 md:space-y-4 shadow-sm">
    <div className="text-blue-600">{icon}</div>
    <div>
      <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">
        {title}
      </h4>
      <p className="text-sm italic font-black tracking-tight uppercase md:text-lg text-slate-900 dark:text-white">
        {detail}
      </p>
    </div>
  </div>
);

export default SupportPage;
