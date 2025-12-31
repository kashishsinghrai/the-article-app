import React, { useState } from "react";
import { Shield, ArrowLeft, Key, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

interface LoginPageProps {
  onBack: () => void;
  onSuccess: (user: any) => void;
  onGoToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onBack,
  onSuccess,
  onGoToRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await (supabase.auth as any).signInWithPassword({
      email,
      password,
    });
    if (error) toast.error(error.message);
    else onSuccess(data.user);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-12 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-start mb-10">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={onBack}
          className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-12">
        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20">
          <Shield size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
          Terminal <br />
          Access
        </h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700 px-1">
            Network Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700 focus:ring-2 focus:ring-blue-600 transition-all"
            placeholder="reporter@agency.org"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700 px-1">
            Access Cipher
          </label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700 focus:ring-2 focus:ring-blue-600 transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-100 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Authorize Session"}
          {!loading && <Key size={18} />}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-slate-50 dark:border-white/5 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          New Correspondent?{" "}
          <button
            onClick={onGoToRegister}
            className="text-blue-600 font-black ml-1 hover:underline"
          >
            Establish Identity
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
