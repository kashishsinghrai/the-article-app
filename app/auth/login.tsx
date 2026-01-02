import React, { useState } from "react";
import {
  Shield,
  ArrowLeft,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCcw,
} from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error("Invalid credentials.");
      } else {
        onSuccess(data.user);
      }
    } catch (err) {
      toast.error("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your registered email.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      toast.success("Recovery link dispatched to your inbox.");
      setIsRecovering(false);
    } catch (err: any) {
      toast.error(err.message || "Recovery failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google") => {
    try {
      const redirectTo = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Failed to initiate Google login.`);
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
          <Shield className="text-slate-900 dark:text-white" size={20} />
          <span className="text-xs font-black tracking-[0.2em] uppercase dark:text-white">
            ThE-ARTICLES
          </span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex items-center justify-center flex-grow px-6 pb-20">
        <div className="w-full max-w-[340px] space-y-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">
              {isRecovering ? "Protocol Recovery" : "Welcome back"}
            </h1>
            <p className="text-sm text-slate-400">
              {isRecovering
                ? "Enter email to reset credentials."
                : "Access your correspondent identity."}
            </p>
          </div>

          {!isRecovering ? (
            <>
              <div className="space-y-4">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="flex items-center justify-center w-full gap-3 py-3 text-xs font-semibold transition-all border rounded-lg border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg"
                    className="w-4 h-4"
                  />
                  Continue with Google
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

              <form onSubmit={handleLogin} className="space-y-5">
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
                    placeholder="email@domain.com"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsRecovering(true)}
                      className="text-[9px] font-black uppercase text-blue-600 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 text-sm font-medium transition-all bg-transparent border rounded-lg outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-slate-400 dark:text-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-lg font-bold text-sm tracking-wide hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Sign In"}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Your Registered Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-medium transition-all bg-transparent border rounded-lg outline-none border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-slate-400 dark:text-white"
                  placeholder="email@domain.com"
                />
              </div>
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold text-sm tracking-wide hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCcw size={16} className="animate-spin" />
                ) : (
                  "Send Recovery Link"
                )}
              </button>
              <button
                onClick={() => setIsRecovering(false)}
                className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}

          <p className="text-xs text-center text-slate-400">
            No identity?{" "}
            <button
              onClick={onGoToRegister}
              className="font-bold text-slate-900 dark:text-white hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
