import React, { useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  Key,
  X,
  Mail,
  User,
  ShieldAlert,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

interface RegisterPageProps {
  onBack: () => void;
  onSuccess: (user: any) => void;
  onGoToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onBack,
  onSuccess,
  onGoToLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isAttemptingAdmin = email
      .toLowerCase()
      .endsWith("@the-articles.admin");
    const SYSTEM_ADMIN_SECRET = "ARTICLES_2025_ROOT_ACCESS";

    if (isAttemptingAdmin && masterKey !== SYSTEM_ADMIN_SECRET) {
      toast.error("Incorrect Master Key. Admin registration denied.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase.auth as any).signUp({
        email,
        password,
        options: {
          data: {
            role: isAttemptingAdmin ? "admin" : "user",
            serial_id: isAttemptingAdmin
              ? "#ROOT-ADMIN"
              : `#ART-${Math.floor(1000 + Math.random() * 9000)}-IND`,
          },
        },
      });

      if (error) toast.error(error.message);
      else {
        toast.success("Identity established. Redirecting...");
        onSuccess(data.user);
      }
    } catch (err: any) {
      toast.error("Registration node unreachable. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500 overflow-y-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between w-full px-6 py-8 mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all group text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          Go Back
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={24} />
          <span className="text-lg italic font-black tracking-tighter uppercase dark:text-white">
            ThE-ARTICLES
          </span>
        </div>
        <button
          onClick={onBack}
          className="p-2 transition-colors rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-red-500"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex items-center justify-center flex-grow p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl italic font-black tracking-tighter uppercase md:text-5xl text-slate-900 dark:text-white">
              Join the Network
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Establish your identity as a verified global correspondent.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 px-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-300"
                  size={18}
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-4 pl-12 pr-6 text-sm font-bold transition-all bg-white border shadow-sm outline-none dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-2 focus:ring-blue-600"
                  placeholder="your.email@agency.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 px-1">
                Create Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-300"
                  size={18}
                />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-4 pl-12 pr-6 text-sm font-bold transition-all bg-white border shadow-sm outline-none dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-2 focus:ring-blue-600"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            {email.toLowerCase().endsWith("@the-articles.admin") && (
              <div className="p-6 space-y-2 duration-300 border border-blue-100 animate-in slide-in-from-top-4 bg-blue-50 dark:bg-blue-900/10 rounded-3xl dark:border-blue-900/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={14} className="text-blue-600" />
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                    Master Key Verification
                  </label>
                </div>
                <input
                  required
                  type="password"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="w-full p-4 text-sm font-bold bg-white border border-blue-100 outline-none dark:bg-slate-950 dark:border-blue-900/40 rounded-xl text-slate-900 dark:text-white"
                  placeholder="System Passcode Required"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-50 hover:text-white transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? "Creating Identity..." : "Register Account"}
              {!loading && <Key size={18} />}
            </button>
          </form>

          <div className="pt-8 space-y-4 text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Already have an account?
            </p>
            <button
              onClick={onGoToLogin}
              className="px-8 py-3 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all"
            >
              Login to Terminal
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-10 opacity-30">
            <ShieldCheck size={14} className="text-slate-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">
              P2P Verified Registry
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
