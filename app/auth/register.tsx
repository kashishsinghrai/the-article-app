import React, { useState } from "react";
import { ShieldCheck, ArrowLeft, X } from "lucide-react";
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
      toast.error("Admin key mismatch.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
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
      else onSuccess(data.user);
    } catch (err: any) {
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Failed to initiate Google registration.`);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-white dark:bg-slate-950 animate-in fade-in duration-300 overflow-y-auto">
      <div className="flex items-center justify-between w-full max-w-5xl px-8 py-10 mx-auto">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Exit
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
        <div className="w-full max-w-[340px] space-y-12">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Create Identity
            </h1>
            <p className="text-sm text-slate-400">Join the global network.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center w-full gap-3 py-3 text-xs font-semibold transition-all border rounded-lg border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg"
                className="w-4 h-4"
              />
              Sign up with Google
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-slate-900"></div>
            </div>
            <span className="relative px-4 bg-white dark:bg-slate-950 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              or
            </span>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm font-medium transition-all bg-transparent border rounded-lg outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-slate-400 dark:text-white"
                placeholder="correspondent@network.org"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm font-medium transition-all bg-transparent border rounded-lg outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-slate-400 dark:text-white"
                placeholder="6+ characters"
              />
            </div>

            {email.toLowerCase().endsWith("@the-articles.admin") && (
              <div className="p-4 space-y-2 border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <label className="text-[9px] font-black uppercase text-blue-600">
                  Master Authorization Key
                </label>
                <input
                  required
                  type="password"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="w-full p-2 text-xs bg-white border rounded dark:bg-slate-950"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400">
            Already have an identity?{" "}
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
