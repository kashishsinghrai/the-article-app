import React, { useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  X,
  Smartphone,
  Mail,
  User,
  ShieldAlert,
  CheckCircle,
  Loader2,
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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Auth Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Profile Data
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  const [generatedOtp, setGeneratedOtp] = useState("");

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRequestOtp = () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setStep(2);
    toast.success(`Verification code sent to ${phone} (Simulation: ${code})`, {
      duration: 6000,
    });
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setStep(3);
      toast.success("Phone verified.");
    } else {
      toast.error("Invalid OTP code.");
    }
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email address.");
      return;
    }
    setLoading(true);

    try {
      const isAttemptingAdmin = email
        .toLowerCase()
        .endsWith("@the-articles.admin");

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username.toLowerCase().replace(/\s/g, "_"),
            gender: gender,
            phone: phone,
            role: isAttemptingAdmin ? "admin" : "user",
            serial_id: isAttemptingAdmin
              ? "#ROOT-ADMIN"
              : `#ART-${Math.floor(1000 + Math.random() * 9000)}-IND`,
          },
        },
      });

      if (error) throw error;

      // Simulate sending credentials to email
      console.log(`[System] Sending encrypted credentials packet to ${email}`);
      toast.success("Registration success! Credentials sent to your email.");

      onSuccess(data.user);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
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
        <div className="w-full max-w-[400px] space-y-12">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Create Identity
            </h1>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em] text-[9px]">
              Step {step} of 3
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone
                    className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm font-bold focus:ring-1 focus:ring-slate-400 outline-none dark:text-white"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>
              <button
                onClick={handleRequestOtp}
                className="w-full py-4 text-xs font-bold tracking-widest text-white uppercase transition-all bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl hover:opacity-90"
              >
                Send OTP Code
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Enter 4-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-center text-3xl font-black tracking-[0.5em] focus:ring-1 focus:ring-slate-400 outline-none dark:text-white"
                  placeholder="0000"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full py-4 text-xs font-bold tracking-widest text-white uppercase transition-all bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl hover:opacity-90"
              >
                Verify & Proceed
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900"
              >
                Change Phone
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white"
                    placeholder="First Last"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Handle
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white"
                    placeholder="alex_reports"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Email (Verified Credentials Site)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white"
                  placeholder="name@official.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Create Passcode
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white"
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Identity Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-medium border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white"
                  rows={2}
                  placeholder="Briefly state your reporting focus..."
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="flex items-center justify-center w-full gap-2 py-4 text-xs font-black tracking-widest text-white uppercase transition-all bg-blue-600 rounded-xl hover:bg-slate-950"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Finalize Registration"
                )}
              </button>
            </div>
          )}

          <p className="text-xs text-center text-slate-400">
            Already registered?{" "}
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
