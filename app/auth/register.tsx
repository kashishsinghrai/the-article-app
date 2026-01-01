import React, { useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  Mail,
  CheckCircle2,
  Loader2,
  Zap,
  Newspaper,
  Fingerprint,
  Network,
  Lock,
  User,
  UserCircle2,
  Info,
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

  // All fields integrated into Register
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

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
      toast.error("प्रोटोकॉल त्रुटि: सभी जानकारी भरना अनिवार्य है।");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("अमान्य ईमेल पता।");
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

      setRegisteredUser(data.user);
      setShowWelcome(true);

      // Notify about credential email
      toast.success(`क्रेडेंशियल ईमेल ${email} पर भेज दिया गया है।`, {
        duration: 8000,
        icon: "📧",
        style: { background: "#0f172a", color: "#fff", borderRadius: "15px" },
      });
    } catch (err: any) {
      toast.error("सिस्टम त्रुटि: " + err.message);
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
            <h2 className="text-3xl italic font-black leading-tight tracking-tighter uppercase md:text-5xl text-slate-900 dark:text-white">
              पंजीकरण सफल
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              आपका संवाददाता प्रोफाइल नेटवर्क पर सक्रिय कर दिया गया है।
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2">
            <div className="p-5 space-y-2 border bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-slate-100 dark:border-white/5">
              <ShieldCheck size={20} className="text-emerald-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest dark:text-white">
                Security Pass
              </h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                आपका सीरियल आईडी और पासवर्ड आपके ईमेल पर सुरक्षित भेज दिया गया
                है।
              </p>
            </div>
            <div className="p-5 space-y-2 border bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-slate-100 dark:border-white/5">
              <Network size={20} className="text-blue-600" />
              <h4 className="text-[10px] font-black uppercase tracking-widest dark:text-white">
                Full Access
              </h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                अब आप लेख पोस्ट कर सकते हैं और नेटवर्क के अन्य सदस्यों से जुड़
                सकते हैं।
              </p>
            </div>
          </div>
          <button
            onClick={() => onSuccess(registeredUser)}
            className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-transform"
          >
            नेटवर्क में प्रवेश करें
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
          <ArrowLeft size={16} /> वापस जाएं
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
        <div className="w-full max-w-[480px] space-y-10">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-semibold leading-none tracking-tight text-slate-900 dark:text-white">
              रजिस्टर करें
            </h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              प्रोटोकॉल चरण {step} / 2
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6 duration-500 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <User size={12} /> पूरा नाम
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                    placeholder="Alexander Pierce"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <UserCircle2 size={12} /> यूजरनेम
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                    placeholder="@alex_reports"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    लिंग (Gender)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white appearance-none"
                  >
                    <option value="">चुनें</option>
                    <option value="Male">पुरुष (Male)</option>
                    <option value="Female">महिला (Female)</option>
                    <option value="Other">अन्य (Other)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Smartphone size={12} /> संपर्क नंबर
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                    placeholder="+91 0000-0000"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (fullName && username && gender && phone) setStep(2);
                  else toast.error("कृपया सभी विवरण भरें।");
                }}
                className="w-full py-4 text-xs font-bold tracking-widest text-white uppercase transition-all shadow-lg bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl hover:opacity-90"
              >
                अगला: सुरक्षित क्रेडेंशियल्स
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 duration-500 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Info size={12} /> बायो / पत्रकारिता उद्देश्य
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium outline-none dark:text-white"
                  placeholder="आप किस विषय पर रिपोर्टिंग करना चाहते हैं?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Mail size={12} /> ईमेल पता
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-bold outline-none dark:text-white"
                  placeholder="name@domain.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Lock size={12} /> सुरक्षित पासवर्ड
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
                  disabled={loading}
                  className="flex items-center justify-center w-full gap-3 py-5 text-xs font-black tracking-widest text-white uppercase transition-all shadow-xl bg-slate-950 dark:bg-white dark:text-slate-950 rounded-2xl disabled:opacity-30"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "अकाउंट सुरक्षित करें और शामिल हों"
                  )}
                  <Fingerprint size={18} />
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  विवरण बदलें
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-slate-400">
            अकाउंट है?{" "}
            <button
              onClick={onGoToLogin}
              className="font-bold text-slate-900 dark:text-white hover:underline"
            >
              लॉगिन करें
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
