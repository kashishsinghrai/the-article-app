import React, { useState, useEffect } from "react";
import {
  Check,
  ShieldCheck,
  User,
  Fingerprint,
  Info,
  Globe,
  Loader2,
} from "lucide-react";
import { Profile } from "../../types";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

interface SetupProfilePageProps {
  onComplete: (data: Profile) => Promise<void>;
}

const SetupProfilePage: React.FC<SetupProfilePageProps> = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useState<{
    id?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    const fetchAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        setAuthData({
          id: user.id,
          email: user.email,
          phone: user.user_metadata?.phone || user.phone,
        });
      }
    };
    fetchAuth();
  }, []);

  const handleFinish = async () => {
    if (!name.trim() || !username.trim() || !gender) {
      toast.error("Identity requires name, handle, and gender.");
      return;
    }

    setLoading(true);
    try {
      let currentId = authData.id;
      if (!currentId) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        currentId = session?.user?.id;
      }

      if (!currentId) {
        toast.error("Auth session expired.");
        setLoading(false);
        return;
      }

      const profile: Profile = {
        id: currentId,
        full_name: name.trim(),
        username: username.toLowerCase().trim().replace(/\s/g, "_"),
        gender: gender,
        serial_id: `#ART-0${Math.floor(1000 + Math.random() * 9000)}-IND`,
        budget: 150,
        role: "user",
        is_private: false,
        bio:
          bio.trim() ||
          "Professional correspondent for the ThE-ARTICLES Global Network.",
        email: authData.email || "",
        phone: authData.phone || "",
        is_online: true,
        settings: {
          notifications_enabled: true,
          presence_visible: true,
          data_sharing: true,
          ai_briefings: true,
          secure_mode: false,
          camera_access: false,
          mic_access: false,
          location_access: false,
          storage_access: false,
          contacts_sync: false,
        },
      };

      await onComplete(profile);
    } catch (err) {
      toast.error("Critical failure in identity forge.");
    } finally {
      setLoading(false);
    }
  };

  const genders = ["Male", "Female", "Non-Binary", "Prefer not to say"];

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6 bg-white dark:bg-slate-950">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500">
        <div className="mb-12 space-y-4 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white bg-blue-600 shadow-xl rounded-2xl">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl italic font-black tracking-tighter uppercase text-slate-900 dark:text-white">
            Identity Forge
          </h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
            Establishing Global Press Credentials
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <User size={12} /> Legal Identity
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-3.5 text-sm font-bold dark:text-white outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Fingerprint size={12} /> Network Alias
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-3.5 text-sm font-bold dark:text-white outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="alex_dispatch"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <Globe size={12} /> Gender Signature
            </label>
            <div className="flex flex-wrap gap-2">
              {genders.map((g) => (
                <button
                  key={g}
                  type="button"
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
              <Info size={12} /> Personal Manifesto
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-5 py-3.5 text-sm font-medium dark:text-white outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Journalistic mission statement..."
              rows={4}
            />
          </div>

          <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
            <button
              onClick={handleFinish}
              disabled={!name.trim() || !username.trim() || !gender || loading}
              className="w-full py-5 bg-slate-950 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Establish Dispatcher Node"
              )}
              {!loading && <Check size={20} />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SetupProfilePage;
