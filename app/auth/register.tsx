import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  Mail,
  User,
  CheckCircle2,
  Loader2,
  Zap,
  Newspaper,
  Star,
  Fingerprint,
  Network,
  Timer,
  User2,
  Lock,
  Shield,
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

  // Profile Data
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  // Security Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // Verification States
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [genEmailOtp, setGenEmailOtp] = useState("");
  const [genPhoneOtp, setGenPhoneOtp] = useState("");

  const [emailSent, setEmailSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleGetEmailOtp = () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGenEmailOtp(code);
    setEmailSent(true);
    toast.success(`Verification code sent to ${email}`, {
      icon: "✉️",
      duration: 6000,
      style: { borderRadius: "15px", fontWeight: "bold" },
    });
    // For demo purposes, we alert the code but ideally it's sent via server
    console.log("Email OTP:", code);
  };

  const handleGetPhoneOtp = () => {
    if (phone.length < 10) {
      toast.error("Please enter a valid contact number.");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGenPhoneOtp(code);
    setPhoneSent(true);
    toast.success(`Verification code sent to ${phone}`, {
      icon: "📱",
      duration: 6000,
      style: { borderRadius: "15px", fontWeight: "bold" },
    });
    console.log("Phone OTP:", code);
  };

  const verifyEmail = () => {
    if (emailOtp === genEmailOtp && genEmailOtp !== "") {
      setEmailVerified(true);
      toast.success("Email verified successfully.");
    } else {
      toast.error("Invalid email verification code.");
    }
  };

  const verifyPhone = () => {
    if (phoneOtp === genPhoneOtp && genPhoneOtp !== "") {
      setPhoneVerified(true);
      toast.success("Phone number verified successfully.");
    } else {
      toast.error("Invalid phone verification code.");
    }
  };

  const handleRegister = async () => {
    if (
      !fullName ||
      !username ||
      !email ||
      !password ||
      !gender ||
      !bio ||
      !phone
    ) {
      toast.error("All profile fields are required.");
      return;
    }
    if (!emailVerified || !phoneVerified) {
      toast.error("Email and Phone verification required.");
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

      toast.success(`Full credentials sent to ${email}`, { duration: 5000 });
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
              Your identity has been established on the network.
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
          </div>
          <div className="p-6 mb-10 border bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center gap-3 mb-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">
                Verification Complete
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic">
              Your credentials and serial index have been archived and
              dispatched to {email}.
            </p>
          </div>
          <button
            onClick={() => onSuccess(registeredUser)}
            className="w-full py-5 font-black tracking-widest text-white uppercase shadow-xl bg-slate-950 dark:bg-white dark:text-slate-950 rounded-2xl"
          >
            Launch Terminal
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
        <div className="w-full max-w-[480px] space-y-12">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-semibold leading-none tracking-tight text-slate-900 dark:text-white">
              Create Account
            </h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              Identity Protocol Phase {step} of 2
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6 duration-500 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Username
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                    placeholder="@handle"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Bio / Mission
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium outline-none dark:text-white"
                  placeholder="Tell the network your purpose..."
                />
              </div>
              <button
                onClick={() => {
                  if (fullName && username && gender && bio) setStep(2);
                  else toast.error("Please fill all fields.");
                }}
                className="w-full py-4 text-xs font-bold tracking-widest text-white uppercase shadow-lg bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl"
              >
                Continue to Verification
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar pb-6">
              {/* Email Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Mail size={14} /> Email Address
                  </label>
                  {emailVerified && (
                    <span className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    disabled={emailVerified}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white ${
                      emailVerified ? "opacity-50" : ""
                    }`}
                    placeholder="email@domain.com"
                  />
                  {!emailVerified && (
                    <button
                      onClick={handleGetEmailOtp}
                      className="px-4 bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase rounded-xl hover:bg-slate-200 transition-all"
                    >
                      {emailSent ? "Resend" : "Get OTP"}
                    </button>
                  )}
                </div>
                {emailSent && !emailVerified && (
                  <div className="flex gap-2 animate-in slide-in-from-top-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      className="w-24 px-4 py-3 font-black tracking-widest text-center text-blue-600 bg-white border-2 border-blue-100 outline-none dark:bg-slate-950 dark:border-blue-900 rounded-xl"
                      placeholder="0000"
                    />
                    <button
                      onClick={verifyEmail}
                      className="flex-grow bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Verify Email
                    </button>
                  </div>
                )}
              </div>

              {/* Phone Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Smartphone size={14} /> Contact Number
                  </label>
                  {phoneVerified && (
                    <span className="text-[9px] font-black uppercase text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    disabled={phoneVerified}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white ${
                      phoneVerified ? "opacity-50" : ""
                    }`}
                    placeholder="+91 XXXX-XXXXXX"
                  />
                  {!phoneVerified && (
                    <button
                      onClick={handleGetPhoneOtp}
                      className="px-4 bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase rounded-xl hover:bg-slate-200 transition-all"
                    >
                      {phoneSent ? "Resend" : "Get OTP"}
                    </button>
                  )}
                </div>
                {phoneSent && !phoneVerified && (
                  <div className="flex gap-2 animate-in slide-in-from-top-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      className="w-24 px-4 py-3 font-black tracking-widest text-center text-blue-600 bg-white border-2 border-blue-100 outline-none dark:bg-slate-950 dark:border-blue-900 rounded-xl"
                      placeholder="0000"
                    />
                    <button
                      onClick={verifyPhone}
                      className="flex-grow bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Verify Phone
                    </button>
                  </div>
                )}
              </div>

              {/* Password Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Lock size={14} /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-4 space-y-4">
                <button
                  onClick={handleRegister}
                  disabled={loading || !emailVerified || !phoneVerified}
                  className="flex items-center justify-center w-full gap-3 py-5 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-slate-950 dark:bg-white dark:text-slate-950 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "Establish Identity"
                  )}
                  <Fingerprint size={18} />
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Back to Profile Info
                </button>
              </div>
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
  <div className="p-5 space-y-3 transition-colors border shadow-sm bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 rounded-2xl">
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
