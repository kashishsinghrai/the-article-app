import React, { useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  Mail,
  Loader2,
  Fingerprint,
  Lock,
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
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !phone) {
      toast.error("Network entry requires all credentials.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email architecture.");
      return;
    }
    if (password.length < 6) {
      toast.error("Security risk: Weak password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone: phone,
            role: "user",
            setup_complete: false,
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.session) {
        toast.success(
          "Identity reserved. Please verify your email to activate node.",
          { duration: 6000 }
        );
        onGoToLogin();
      } else if (data.user) {
        toast.success("Access granted. Initializing setup.");
        onSuccess(data.user);
      }
    } catch (err: any) {
      toast.error(err.message || "Registration protocol failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-white dark:bg-slate-950 animate-in fade-in duration-300 overflow-y-auto">
      <div className="flex items-center justify-between w-full max-w-5xl px-6 py-8 mx-auto">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Cancel
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-slate-900 dark:text-white" size={20} />
          <span className="text-xs font-black tracking-[0.2em] uppercase dark:text-white">
            ThE-ARTICLES
          </span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex items-center justify-center flex-grow px-6 pb-20">
        <div className="w-full max-w-[380px] space-y-12">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-semibold leading-none tracking-tight text-slate-900 dark:text-white">
              Node Registration
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Phase 01: Auth Shard Creation
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Mail size={12} /> Email Interface
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                placeholder="identity@network.org"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Smartphone size={12} /> Comms Link (Phone)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                placeholder="+1 000 000 000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Lock size={12} /> Security Hash (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-30 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Establish Auth Link"
                )}
                <Fingerprint size={18} />
              </button>
            </div>
          </form>

          <p className="text-xs text-center text-slate-400">
            Registered already?{" "}
            <button
              onClick={onGoToLogin}
              className="font-bold text-slate-900 dark:text-white hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
