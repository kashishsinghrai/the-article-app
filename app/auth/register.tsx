import React, { useState, useEffect } from "react";
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
  Timer,
  User2,
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
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && step === 2) {
      toast.error("Security code expired. Please request a new transmission.");
      setStep(1);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRequestOtp = () => {
    if (!phone || phone.length < 10) {
      toast.error("Valid contact number is mandatory for network entry.");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setTimer(300); // 5 minutes timer
    setStep(2);
    toast(`Transmission Successful: Code ${code} sent to ${phone}`, {
      icon: "🔐",
      duration: 8000,
      style: {
        background: "#0f172a",
        color: "#fff",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
      },
    });
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp && timer > 0) {
      setStep(3);
      setTimer(0);
      toast.success("Identity Verified. Proceed to Finalize Node Profile.");
    } else {
      toast.error("Incorrect or expired protocol code.");
    }
  };

  const handleRegister = async () => {
    if (!fullName || !username || !email || !password || !gender || !bio) {
      toast.error("All intelligence fields must be populated.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid binary email format.");
      return;
    }
    setLoading(true);

    try {
      const isAttemptingAdmin = email
        .toLowerCase()
        .endsWith("@the-articles.admin");
      const serialId = isAttemptingAdmin
        ? "#ROOT-ADMIN"
        : `#ART-${Math.floor(1000 + Math.random() * 9000)}-IND`;

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
            serial_id: serialId,
            bio: bio,
          },
        },
      });

      if (error) throw error;

      // Simulation of credentials to email
      toast(`Encrypted Transmission: Credentials dispatched to ${email}`, {
        icon: "📧",
        duration: 5000,
      });

      setRegisteredUser(data.user);
      setShowWelcome(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
              desc="Publish reports with zero censorship. Global indexing activated."
            />
            <UtilityBox
              icon={<Network size={20} />}
              title="Secure P2P Link"
              desc="Establish encrypted handshakes with other correspondents."
            />
            <UtilityBox
              icon={<Fingerprint size={20} />}
              title="Digital Pass"
              desc="Generate your Press Pass in your profile to verify your node."
            />
            <UtilityBox
              icon={<Star size={20} />}
              title="Standing"
              desc="High-standing nodes receive exclusive operational tools."
            />
          </div>

          <div className="p-6 mb-10 border bg-slate-50 dark:bg-slate-950/50 rounded-2xl border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck size={14} /> Credentials Status
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
              A copy of your operational serial index and access credentials has
              been transmitted to your email inbox for archive purposes.
            </p>
          </div>

          <button
            onClick={() => onSuccess(registeredUser)}
            className="w-full py-5 font-black tracking-widest text-white uppercase shadow-xl bg-slate-950 dark:bg-white dark:text-slate-950 rounded-2xl"
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
        <div className="w-full max-w-[440px] space-y-12">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-semibold leading-none tracking-tight text-slate-900 dark:text-white">
              Register Node
            </h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              Protocol Phase {step} / 3
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6 duration-500 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Primary Contact (Compulsory)
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
                    placeholder="+91 XXX-XXX-XXXX"
                  />
                </div>
              </div>
              <button
                onClick={handleRequestOtp}
                className="w-full py-4 text-xs font-bold tracking-widest text-white uppercase shadow-lg bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl"
              >
                Request Access Code
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 duration-500 animate-in slide-in-from-right-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Transmission Verification
                  </label>
                  <div className="flex items-center gap-2 text-red-500 text-[10px] font-black">
                    <Timer size={12} /> {formatTimer(timer)}
                  </div>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-5 text-center text-4xl font-black tracking-[0.8em] focus:ring-1 focus:ring-blue-600 outline-none dark:text-white"
                  placeholder="0000"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full py-4 text-xs font-bold tracking-widest text-white uppercase bg-blue-600 shadow-lg rounded-xl"
              >
                Verify Link Code
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest"
              >
                Wrong Number?
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Operator Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl dark:text-white focus:ring-1"
                    placeholder="Full Name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Handle
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl dark:text-white focus:ring-1"
                    placeholder="@handle"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Gender Identity
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Professional Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 text-xs font-medium border outline-none bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl dark:text-white"
                  placeholder="Tell us about your mission..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Transmission Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl dark:text-white"
                  placeholder="name@domain.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Bureau Passcode
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl dark:text-white"
                  placeholder="Min 6 characters"
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="flex items-center justify-center w-full gap-2 py-4 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl hover:opacity-80"
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
            Node exists?{" "}
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
  <div className="p-5 space-y-3 transition-colors border shadow-sm bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 rounded-2xl hover:bg-white dark:hover:bg-slate-800">
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
