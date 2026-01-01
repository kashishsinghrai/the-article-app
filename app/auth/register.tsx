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
  Info,
  Zap,
  MessageSquare,
  Newspaper,
  Star,
  Fingerprint,
  Network,
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
  const [showWelcome, setShowWelcome] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);

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
    if (!fullName || !username || !email || !password) {
      toast.error("Please complete all mandatory fields.");
      return;
    }
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

      // Registration successful
      setRegisteredUser(data.user);
      setShowWelcome(true);
      toast.success("Identity established! Dispatching welcome briefing.", {
        icon: "📧",
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-[700] bg-white dark:bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100 dark:border-slate-800 my-auto animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl mb-8">
            <Zap size={40} fill="white" />
          </div>

          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl italic font-black tracking-tighter uppercase md:text-5xl text-slate-900 dark:text-white">
              Welcome to the Bureau
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Thank you for joining ThE-ARTICLES Network.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2">
            <UtilityBox
              icon={<Newspaper size={20} />}
              title="Field Reporting"
              desc="Publish investigative reports with zero censorship. Your voice reaches the global pulse immediately."
            />
            <UtilityBox
              icon={<Network size={20} />}
              title="Secure P2P Link"
              desc="Establish direct, encrypted connections with other correspondents for private intel exchange."
            />
            <UtilityBox
              icon={<Fingerprint size={20} />}
              title="Digital Credentials"
              desc="Generate your verified Press Pass. Use it to gain access to exclusive operational zones."
            />
            <UtilityBox
              icon={<Star size={20} />}
              title="Earn Standing"
              desc="Gain reputation for factual accuracy. High-standing nodes receive premium network benefits."
            />
          </div>

          <div className="p-6 mb-10 border bg-slate-50 dark:bg-slate-950/50 rounded-2xl border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck size={14} /> Usage Protocol
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
              "Use the 'Network' tab to find nodes. Use 'Publish' to broadcast
              intelligence. Use 'Explore' to monitor the global wire. Stay
              objective. Stay verified."
            </p>
          </div>

          <button
            onClick={() => onSuccess(registeredUser)}
            className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            Initialize Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-white dark:bg-slate-950 animate-in fade-in duration-300 overflow-y-auto">
      <div className="flex items-center justify-between w-full max-w-5xl px-6 py-8 mx-auto">
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
            <h1 className="text-4xl font-semibold leading-none tracking-tight text-slate-900 dark:text-white">
              Create Identity
            </h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              Protocol Step {step} of 3
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6 duration-500 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Phone Number (Operational Link)
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
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-sm font-bold focus:ring-1 focus:ring-blue-600 outline-none dark:text-white transition-all"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
              <button
                onClick={handleRequestOtp}
                className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
              >
                Send Verification OTP
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 duration-500 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center block">
                  Enter 4-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-center text-4xl font-black tracking-[0.5em] focus:ring-1 focus:ring-blue-600 outline-none dark:text-white"
                  placeholder="0000"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
              >
                Verify & Continue
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Change Number
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 duration-500 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white focus:ring-1 focus:ring-blue-600"
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Handle
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white focus:ring-1 focus:ring-blue-600"
                    placeholder="@handle"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white focus:ring-1 focus:ring-blue-600"
                  placeholder="name@domain.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Secure Passcode
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white focus:ring-1 focus:ring-blue-600"
                  placeholder="Min 6 characters"
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Establish Identity"
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

const UtilityBox = ({ icon, title, desc }: any) => (
  <div className="p-5 space-y-3 transition-colors border bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 rounded-2xl hover:bg-white dark:hover:bg-slate-800">
    <div className="flex items-center gap-3 text-blue-600">
      {icon}
      <h4 className="text-[10px] font-black uppercase tracking-widest">
        {title}
      </h4>
    </div>
    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
      {desc}
    </p>
  </div>
);

export default RegisterPage;
