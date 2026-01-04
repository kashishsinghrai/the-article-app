import React, { useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Mail,
  Lock,
  Fingerprint,
  Loader2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

const RegisterPage: React.FC<{
  onBack: () => void;
  onSuccess: (u: any) => void;
  onGoToLogin: () => void;
}> = ({ onBack, onSuccess, onGoToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Security weak: 6 chars min.");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user && !data.session) {
        toast.success("Node identity reserved. Verify email.");
        onGoToLogin();
      } else if (data.user) {
        toast.success("Access Granted.");
        onSuccess(data.user);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-slate-950 animate-in fade-in duration-300 overflow-y-auto p-8 text-white">
      <div className="flex items-center justify-between w-full max-w-5xl py-10 mx-auto">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white uppercase text-[11px] font-bold flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Exit
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-white" size={20} />
          <span className="text-xs font-black text-white uppercase">
            ThE-ARTICLES
          </span>
        </div>
        <div className="w-10" />
      </div>
      <div className="flex items-center justify-center flex-grow">
        <div className="w-full max-w-[340px] space-y-12">
          <div className="space-y-3">
            <h1 className="text-4xl italic font-black leading-none text-white uppercase">
              Identity Forge
            </h1>
            <p className="text-sm text-slate-500">
              Initialize node registration protocols.
            </p>
          </div>
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500">
                <Mail size={12} className="inline mr-2" />
                Email Shard
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 text-sm text-white border-none rounded-lg outline-none bg-slate-900 focus:ring-1 focus:ring-blue-600"
                placeholder="node@network.org"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500">
                <Lock size={12} className="inline mr-2" />
                Security Key
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 text-sm text-white border-none rounded-lg outline-none bg-slate-900 focus:ring-1 focus:ring-blue-600"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-3 py-4 text-sm font-black uppercase transition-all bg-white rounded-lg shadow-xl text-slate-950 hover:scale-105 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Fingerprint />}{" "}
              Forge Identity
            </button>
          </form>
          <p className="text-xs text-center text-slate-500">
            Identity exists?{" "}
            <button
              onClick={onGoToLogin}
              className="font-bold text-white hover:underline"
            >
              Sign into shard
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
