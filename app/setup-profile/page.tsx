import React, { useState } from "react";
import {
  Check,
  ShieldCheck,
  User,
  Fingerprint,
  Info,
  Globe,
} from "lucide-react";
import { Profile } from "../../types";

interface SetupProfilePageProps {
  onComplete: (data: Profile) => void;
}

const SetupProfilePage: React.FC<SetupProfilePageProps> = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  const handleFinish = () => {
    if (!name || !username || !gender) return;
    const profile: Profile = {
      id: "", // Set by App.tsx
      full_name: name,
      username: username.toLowerCase().replace(/\s/g, "_"),
      gender: gender,
      serial_id: `#ART-0${Math.floor(1000 + Math.random() * 9000)}-IND`,
      budget: 150,
      role: "user",
      is_private: false,
      bio:
        bio ||
        "Professional correspondent for the ThE-ARTICLES Global Network.",
      is_online: true,
      settings: {
        notifications_enabled: true,
        presence_visible: true,
        data_sharing: false,
        ai_briefings: true,
        secure_mode: true,
      },
    };
    onComplete(profile);
  };

  const genders = ["Male", "Female", "Non-Binary", "Prefer not to say"];

  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-white dark:bg-slate-950">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500">
        <div className="mb-12 space-y-4 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white bg-blue-600 shadow-xl rounded-2xl">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl italic font-black tracking-tighter uppercase text-slate-900 dark:text-white">
            Identify Entry
          </h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
            Step 02: Establish Network Credentials
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <User size={12} /> Legal Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-3.5 text-sm font-bold dark:text-white outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                placeholder="Alexander Pierce"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Fingerprint size={12} /> Network Handle
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-3.5 text-sm font-bold dark:text-white outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                placeholder="alex_reports"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Globe size={12} /> Gender Specification
            </label>
            <div className="flex flex-wrap gap-2">
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                    gender === g
                      ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950"
                      : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Info size={12} /> Professional Manifesto
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-3.5 text-sm font-medium dark:text-white outline-none focus:ring-1 focus:ring-blue-600 transition-all"
              placeholder="What is your journalistic mission?"
              rows={4}
            />
          </div>

          <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
            <button
              onClick={handleFinish}
              disabled={!name || !username || !gender}
              className="w-full py-5 bg-slate-950 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
            >
              Activate Operations Node
              <Check size={20} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SetupProfilePage;
