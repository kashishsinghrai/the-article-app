import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  Info,
  ShieldCheck,
  Send,
  Loader2,
  ArrowLeft,
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
    setTimeout(() => {
      setLoading(false);
      toast.success("Inquiry Submitted");
    }, 1500);
  };

  return (
    <main className="px-6 py-16 mx-auto space-y-12 max-w-7xl md:py-32">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] tracking-widest transition-all"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="max-w-3xl mx-auto space-y-16 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
              Secure Channel
            </span>
          </div>
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-8xl text-slate-900 dark:text-white">
            Support
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
            Need help? We're here for the community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl space-y-8 text-left"
        >
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Your Serial ID
            </label>
            <input
              required
              className="w-full px-6 py-4 italic font-black tracking-tighter uppercase border-none outline-none bg-slate-50 dark:bg-slate-950 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
              placeholder="#ART-XXXXX"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              What do you need?
            </label>
            <select className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-2xl px-6 py-4 font-black uppercase tracking-widest text-[10px] dark:text-white cursor-pointer outline-none">
              <option>General Help</option>
              <option>Report a User</option>
              <option>Tech Issue</option>
              <option>Account Sync</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Details
            </label>
            <textarea
              required
              rows={5}
              className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-[2rem] px-6 py-4 font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Describe your issue..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full gap-3 py-6 font-black tracking-widest text-white uppercase transition-all bg-blue-600 rounded-full shadow-2xl hover:bg-slate-950 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={20} /> Send Inquiry
              </>
            )}
          </button>
        </form>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ContactBox
            icon={<Mail size={24} />}
            title="Email Support"
            detail="support@the-articles.org"
          />
          <ContactBox
            icon={<MessageSquare size={24} />}
            title="Community Chat"
            detail="General Room #01"
          />
        </div>
      </div>
    </main>
  );
};

const ContactBox = ({ icon, title, detail }: any) => (
  <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center space-y-4 shadow-sm">
    <div className="text-blue-600">{icon}</div>
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
        {title}
      </h4>
      <p className="text-lg italic font-black tracking-tight uppercase text-slate-900 dark:text-white">
        {detail}
      </p>
    </div>
  </div>
);

export default SupportPage;
