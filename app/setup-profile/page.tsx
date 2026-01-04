import React, { useState, useRef } from "react";
import {
  Check,
  User,
  Fingerprint,
  Info,
  Globe,
  Loader2,
  Camera,
} from "lucide-react";
import { supabase } from "../../lib/supabase.ts";
import { toast } from "react-hot-toast";

interface SetupProfilePageProps {
  onComplete: () => Promise<void>;
}

const SetupProfilePage: React.FC<SetupProfilePageProps> = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("Masked");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFinish = async () => {
    if (!name.trim() || !username.trim()) {
      return toast.error("Identity requires name and handle.");
    }
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Verification failed.");

      const serialId = `#ART-${Math.floor(1000 + Math.random() * 9000)}-IND`;

      const { error } = await supabase.from("profiles").upsert({
        id: session.user.id,
        full_name: name.trim(),
        username: username.toLowerCase().trim().replace(/\s/g, "_"),
        gender: gender,
        avatar_url: avatar,
        bio: bio.trim() || "Verified correspondent node.",
        serial_id: serialId,
        budget: 150,
        role: "user",
        is_private: false,
        email: session.user.email,
      });

      if (error) throw error;

      toast.success("Identity Forge Complete.");
      await onComplete();
    } catch (err: any) {
      console.error(err);
      toast.error("Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6 bg-white dark:bg-slate-950">
      <div className="w-full max-w-2xl bg-slate-50 dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-200 dark:border-white/5 animate-in zoom-in duration-500">
        <div className="mb-12 space-y-6 text-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative flex items-center justify-center w-24 h-24 mx-auto overflow-hidden transition-all bg-blue-600 shadow-xl cursor-pointer rounded-3xl hover:scale-105"
          >
            {avatar ? (
              <img
                src={avatar}
                className="object-cover w-full h-full"
                alt="Preview"
              />
            ) : (
              <Camera className="text-white" size={32} />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const r = new FileReader();
                  r.onloadend = () => setAvatar(r.result as string);
                  r.readAsDataURL(f);
                }
              }}
              className="hidden"
              accept="image/*"
            />
          </div>
          <h1 className="text-4xl italic font-black tracking-tighter uppercase text-slate-950 dark:text-white">
            Identity Forge
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Establishing Official Press Credentials
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                <User size={12} /> Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3.5 text-slate-950 dark:text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 shadow-sm"
                placeholder="Full Legal Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
                <Fingerprint size={12} /> Handle
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3.5 text-slate-950 dark:text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 shadow-sm"
                placeholder="alex_report"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
              <Globe size={12} /> Sector
            </label>
            <div className="flex gap-2">
              {["Male", "Female", "Masked"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${
                    gender === g
                      ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-transparent shadow-md"
                      : "text-slate-500 border-slate-200 dark:border-white/5"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
              <Info size={12} /> Manifesto
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3.5 text-slate-950 dark:text-white text-sm outline-none focus:ring-1 focus:ring-blue-600 shadow-sm"
              rows={4}
              placeholder="Your mission statement as a node..."
            />
          </div>

          <button
            onClick={handleFinish}
            disabled={loading}
            className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-30 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Check size={20} />
            )}{" "}
            Establish Identity
          </button>
        </div>
      </div>
    </main>
  );
};

export default SetupProfilePage;
