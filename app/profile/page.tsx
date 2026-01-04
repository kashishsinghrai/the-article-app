import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  ArrowLeft,
  User,
  Info,
  MessageSquare,
  LogOut,
  ShieldAlert,
  Fingerprint,
  Globe,
  Activity,
  Calendar,
  UserPlus,
  Image as ImageIcon,
  Users,
  Cpu,
  Terminal,
} from "lucide-react";
import { Profile } from "../../types.ts";
import { toast } from "react-hot-toast";
import IDCard from "../../components/IDCard.tsx";

interface ProfilePageProps {
  profile: Profile;
  onLogout: () => void;
  onUpdateProfile?: (data: Partial<Profile>) => void;
  isExternal?: boolean;
  onCloseExternal: () => void;
  isLoggedIn?: boolean;
  currentUserId?: string;
  onChat?: (target: Profile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onLogout,
  onUpdateProfile,
  isExternal,
  onCloseExternal,
  currentUserId,
  onChat,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profile });
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const isOwn = currentUserId === profile.id;

  useEffect(() => {
    setEditData({ ...profile });
  }, [profile]);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar_url" | "cover_url"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024)
        return toast.error("Asset threshold exceeded (Max 2MB).");
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditData((prev) => ({ ...prev, [type]: base64 }));
        if (onUpdateProfile && isOwn) onUpdateProfile({ [type]: base64 });
        toast.success(
          `Identity ${type === "avatar_url" ? "Visual" : "Cover"} Re-hashed`,
          { icon: "🔐" }
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="max-w-6xl px-4 py-16 pb-40 mx-auto space-y-8 overflow-x-hidden transition-all duration-500 md:px-8 md:py-24 animate-in fade-in">
      <div className="relative">
        <button
          onClick={onCloseExternal}
          className="absolute top-4 left-4 md:top-6 md:left-6 z-[30] flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-black/40 backdrop-blur-md text-white rounded-full text-[9px] md:text-[10px] font-black uppercase border border-white/20 hover:bg-black/60 transition-all shadow-xl group"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1 md:w-4 md:h-4"
          />{" "}
          Exit Registry
        </button>

        {/* COVER SHARD */}
        <div className="h-56 md:h-[400px] bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-slate-100 dark:border-white/5 relative group shadow-2xl">
          {editData.cover_url ? (
            <img
              src={editData.cover_url}
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
              alt="Cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-slate-900/40 opacity-30">
              <Globe size={100} strokeWidth={1} />
            </div>
          )}
          {isOwn && (
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute p-3 md:p-4 text-white transition-all border shadow-xl opacity-0 bottom-6 right-6 md:bottom-10 md:right-10 bg-black/40 backdrop-blur-md rounded-2xl border-white/20 group-hover:opacity-100 hover:bg-[#00BFFF]"
            >
              <ImageIcon size={20} className="md:w-6 md:h-6" />
            </button>
          )}
          <input
            type="file"
            ref={coverInputRef}
            onChange={(e) => handleUpload(e, "cover_url")}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* PROFILE HEADER OVERLAY */}
        <div className="px-4 md:px-12 -mt-16 md:-mt-24 relative z-[20] flex flex-col md:flex-row items-center md:items-end justify-between gap-6 md:gap-10">
          <div className="flex flex-col items-center w-full gap-6 md:items-end md:flex-row md:text-left md:w-auto">
            <div className="relative group shrink-0">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] md:rounded-[4rem] bg-white dark:bg-[#0a0a0a] border-[8px] md:border-[12px] border-white dark:border-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center relative">
                {editData.avatar_url ? (
                  <img
                    src={editData.avatar_url}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Fingerprint
                    size={60}
                    className="text-slate-100 dark:text-slate-800 md:w-20 md:h-20"
                  />
                )}
              </div>
              {isOwn && (
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-[2.5rem] md:rounded-[4rem] cursor-pointer"
                >
                  <Camera size={28} className="text-white md:w-8 md:h-8" />
                </button>
              )}
              <input
                type="file"
                ref={avatarInputRef}
                onChange={(e) => handleUpload(e, "avatar_url")}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="pb-2 space-y-2 text-center md:pb-8 md:space-y-4 md:text-left">
              <h1 className="text-3xl italic font-black leading-none tracking-tighter uppercase md:text-5xl text-slate-900 dark:text-white">
                {profile.full_name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[9px] md:text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] md:tracking-[0.4em]">
                <span className="text-[#00BFFF]">{profile.serial_id}</span>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse hidden sm:block" />
                <span>Sector_{profile.gender}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center w-full gap-3 pb-2 md:gap-4 md:pb-8 md:w-auto">
            {isOwn ? (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex-1 md:flex-none px-8 py-4 md:px-12 md:py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[1.5rem] md:rounded-[2rem] font-black uppercase text-[10px] md:text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                >
                  {isEditing ? "Discard" : "Forge Identity"}
                </button>
                <button
                  onClick={onLogout}
                  className="p-4 text-red-600 transition-all border border-red-100 shadow-lg md:p-5 bg-red-50 dark:bg-red-950/20 rounded-2xl dark:border-red-900/20 hover:bg-red-600 hover:text-white"
                >
                  <LogOut size={20} className="md:w-6 md:h-6" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onChat?.(profile)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 md:px-16 md:py-5 bg-[#00BFFF] text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase text-[10px] md:text-xs tracking-widest transition-all hover:scale-105 shadow-xl shadow-[#00BFFF]/20"
                >
                  <MessageSquare size={18} /> Secure Handshake
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* NODE DETAILS GRID */}
      <div className="grid grid-cols-1 gap-8 pt-4 md:pt-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-4">
          <IDCard profile={{ ...profile, ...editData }} isOwn={isOwn} />

          <div className="bg-white dark:bg-slate-950 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 dark:border-white/5 space-y-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b text-slate-400 border-slate-50 dark:border-white/5">
              {/* Fix: Terminal is now correctly imported from lucide-react */}
              <Terminal size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">
                Identity_Metrix
              </h4>
            </div>
            <div className="space-y-8">
              <MetricItem
                icon={<Activity size={20} />}
                label="Reputation index"
                val={`${profile.budget || 0}% Accuracy`}
              />
              <MetricItem
                icon={<Calendar size={20} />}
                label="Registration Date"
                val={new Date(
                  profile.last_seen || Date.now()
                ).toLocaleDateString()}
              />
              <MetricItem
                icon={<Cpu size={20} />}
                label="Protocol Tier"
                val={profile.role === "admin" ? "ROOT_CORE" : "ALPHA_NODE"}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-950 p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 dark:border-white/5 space-y-12 md:space-y-16 min-h-[500px] md:min-h-[600px] shadow-sm">
            {isEditing ? (
              <div className="space-y-10 md:space-y-12 animate-in slide-in-from-bottom-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                    <User size={12} /> Legal Designation
                  </label>
                  <input
                    value={editData.full_name}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, full_name: e.target.value }))
                    }
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-5 md:p-6 text-slate-950 dark:text-white font-black text-xl md:text-2xl outline-none focus:border-[#00BFFF]/50 transition-all uppercase italic tracking-tight"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                    <Info size={12} /> Operational Manifesto
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, bio: e.target.value }))
                    }
                    rows={6}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl p-6 md:p-8 text-slate-600 dark:text-slate-300 font-bold text-base md:text-lg outline-none focus:border-[#00BFFF]/50 transition-all resize-none italic leading-relaxed"
                  />
                </div>
                <button
                  onClick={() => {
                    if (onUpdateProfile) onUpdateProfile(editData);
                    setIsEditing(false);
                  }}
                  className="w-full py-6 md:py-7 bg-[#00BFFF] text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase text-xs md:text-sm tracking-[0.4em] md:tracking-[0.5em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Synchronize Identity Shards
                </button>
              </div>
            ) : (
              <div className="space-y-12 md:space-y-20">
                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3 text-[#00BFFF] border-b-2 border-[#00BFFF]/20 pb-2 w-fit">
                    {/* Fix: Terminal is now correctly imported from lucide-react */}
                    <Terminal size={18} />
                    <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] italic">
                      Intelligence_Brief
                    </h3>
                  </div>
                  <p className="text-2xl italic font-medium leading-relaxed md:text-4xl lg:text-5xl text-slate-500 dark:text-slate-400">
                    "
                    {profile.bio ||
                      "Observing network integrity and factual dispatches across the local sector shards."}
                    "
                  </p>
                </div>

                <div className="pt-10 space-y-10 border-t md:pt-20 border-slate-100 dark:border-white/5 md:space-y-12">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] md:text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em]">
                      Dispatch_Archive
                    </h4>
                    <span className="text-[8px] md:text-[9px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-slate-100 dark:border-white/5">
                      Secured_Vault
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 transition-opacity cursor-not-allowed md:grid-cols-4 md:gap-8 opacity-10 hover:opacity-40">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-slate-50 dark:bg-white/5 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-white/10 flex items-center justify-center shadow-inner group overflow-hidden"
                      >
                        {/* Fix: Terminal is now correctly imported from lucide-react */}
                        <Terminal
                          size={32}
                          className="transition-transform duration-700 md:w-10 md:h-10 text-slate-400 dark:text-slate-600 group-hover:scale-125"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const MetricItem = ({ icon, label, val }: any) => (
  <div className="flex items-center gap-4 md:gap-6 group">
    <div className="p-4 md:p-5 bg-slate-50 dark:bg-white/5 rounded-2xl text-[#00BFFF] group-hover:bg-[#00BFFF] group-hover:text-white transition-all shadow-sm border border-slate-100 dark:border-white/5">
      {icon}
    </div>
    <div>
      <p className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-xs md:text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
        {val}
      </p>
    </div>
  </div>
);

export default ProfilePage;
