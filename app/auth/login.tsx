import React, { useState } from "react";
import { Shield, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

const LoginPage: React.FC<{
  onBack: () => void;
  onSuccess: (u: any) => void;
  onGoToRegister: () => void;
}> = ({ onBack, onSuccess, onGoToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) toast.error("Credentials Rejected.");
      else onSuccess(data.user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-slate-950 animate-in fade-in duration-300 overflow-y-auto p-8">
      <div className="flex items-center justify-between w-full max-w-5xl py-10 mx-auto">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white uppercase text-[11px] font-bold flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Exit
        </button>
        <div className="flex items-center gap-2">
          <Shield className="text-white" size={20} />
          <span className="text-xs font-black text-white uppercase">
            ThE-ARTICLES
          </span>
        </div>
        <div className="w-10" />
      </div>
      <div className="flex items-center justify-center flex-grow text-white">
        <div className="w-full max-w-[340px] space-y-12">
          <div className="space-y-3">
            <h1 className="text-4xl italic font-black leading-none text-white uppercase">
              Access Shard
            </h1>
            <p className="text-sm text-slate-500">
              Validate correspondent credentials.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500">
                <Mail size={12} className="inline mr-2" />
                Email
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
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 text-sm text-white border-none rounded-lg outline-none bg-slate-900 focus:ring-1 focus:ring-blue-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-sm font-black uppercase transition-all bg-white rounded-lg shadow-xl text-slate-950 hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Initialize Session"}
            </button>
          </form>
          <p className="text-xs text-center text-slate-500">
            Missing Node?{" "}
            <button
              onClick={onGoToRegister}
              className="font-bold text-white hover:underline"
            >
              Establish identity
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
