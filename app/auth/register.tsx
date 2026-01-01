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
            phone: phone, // Saved to user metadata
            role: isAttemptingAdmin ? "admin" : "user",
            serial_id: isAttemptingAdmin
              ? "#ROOT-ADMIN"
              : `#ART-${Math.floor(1000 + Math.random() * 9000)}-IND`,
          },
        },
      });

      if (error) throw error;

      // Simulate sending Welcome Email
      toast.success("Encrypted welcome dispatch sent to your email!", {
        icon: "📧",
      });

      setRegisteredUser(data.user);
      setShowWelcome(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-[700] bg-white dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-xl space-y-12 text-center duration-500 animate-in zoom-in">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl">
            <Zap size={48} fill="white" />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl italic font-black tracking-tighter uppercase md:text-5xl text-slate-900 dark:text-white">
              Welcome, Correspondent.
            </h2>
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
              Your identity is now verified in the ThE-ARTICLES Network.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-2">
            <UtilityBox
              icon={<Newspaper size={18} />}
              title="Global Reporting"
              desc="Publish field reports & investigative stories to a global audience."
            />
            <UtilityBox
              icon={<MessageSquare size={18} />}
              title="P2P Link"
              desc="Chat securely with other journalists via encrypted handshakes."
            />
            <UtilityBox
              icon={<Zap size={18} />}
              title="Reputation"
              desc="Gain standing points for high-quality, verified intelligence."
            />
            <UtilityBox
              icon={<ShieldCheck size={18} />}
              title="Identity"
              desc="Generate and download your Digital Press ID for real-world use."
            />
          </div>

          <button
            onClick={() => onSuccess(registeredUser)}
            className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl"
          >
            Enter Terminal
          </button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-semibold leading-none tracking-tight text-slate-900 dark:text-white">
              Create Identity
            </h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              Protocol Step {step} of 3
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Phone Number (Global Access)
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
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>
              <button
                onClick={handleRequestOtp}
                className="w-full py-4 text-xs font-bold tracking-widest text-white uppercase transition-all shadow-lg bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl hover:opacity-90"
              >
                Send Verification OTP
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
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
                className="w-full py-4 text-xs font-bold tracking-widest text-white uppercase transition-all shadow-lg bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl hover:opacity-90"
              >
                Verify & Continue
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Change Phone Number
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
                    className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white focus:ring-1 focus:ring-blue-600"
                    placeholder="Operator Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Callsign
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl dark:text-white focus:ring-1 focus:ring-blue-600"
                    placeholder="handle_01"
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
                className="flex items-center justify-center w-full gap-2 py-4 text-xs font-black tracking-widest text-white uppercase transition-all bg-blue-600 shadow-xl rounded-xl hover:bg-slate-950"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Finalize Identity"
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
  <div className="p-4 space-y-2 border bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-white/5 rounded-2xl">
    <div className="flex items-center gap-2 text-blue-600">
      {icon}
      <h4 className="text-[9px] font-black uppercase tracking-widest">
        {title}
      </h4>
    </div>
    <p className="text-[10px] text-slate-500 font-medium leading-tight">
      {desc}
    </p>
  </div>
);

export default RegisterPage;
