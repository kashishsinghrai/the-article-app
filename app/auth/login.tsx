
import React, { useState } from 'react';
import { Shield, ArrowLeft, Key, X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface LoginPageProps {
  onBack: () => void;
  onSuccess: (user: any) => void;
  onGoToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onSuccess, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await (supabase.auth as any).signInWithPassword({ email, password });
      if (error) {
        toast.error("Invalid login details. Please check your email and password.");
      } else {
        onSuccess(data.user);
      }
    } catch (err) {
      toast.error("Connection failed. Please try again.");
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
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Go Back
        </button>
        <div className="flex items-center gap-2">
          <Shield className="text-blue-600" size={24} />
          <span className="text-lg italic font-black tracking-tighter uppercase dark:text-white">ThE-ARTICLES</span>
        </div>
        <button onClick={onBack} className="p-2 transition-colors rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-red-500">
          <X size={20} />
        </button>
      </div>

      <div className="flex items-center justify-center flex-grow p-6">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl italic font-black tracking-tighter uppercase md:text-5xl text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Please enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-4 pl-12 pr-6 text-sm font-bold transition-all bg-white border shadow-sm outline-none dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Password</label>
                <button 
                  type="button"
                  onClick={() => toast.error("Password recovery system is currently being updated.")}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-4 pl-12 pr-12 text-sm font-bold transition-all bg-white border shadow-sm outline-none dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-300 hover:text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-50 hover:text-white transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Verifying...' : 'Sign In'}
              {!loading && <Key size={18} />}
            </button>
          </form>

          <div className="pt-8 space-y-4 text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Don't have an account yet?
            </p>
            <button 
              onClick={onGoToRegister}
              className="px-8 py-3 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all"
            >
              Create New Account
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-10 opacity-30">
            <Shield size={14} className="text-slate-400" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Secure AES-256 Auth Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
