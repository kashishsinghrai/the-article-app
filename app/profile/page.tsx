import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  ArrowLeft,
  User,
  Info,
  MessageSquare,
  LogOut,
  Fingerprint,
  Globe,
  Activity,
  Calendar,
  Image as ImageIcon,
  Cpu,
  Terminal,
  Edit2,
  Share2,
  Check,
  Target,
  ShieldAlert,
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
    <main className="px-4 py-6 pt-20 pb-40 mx-auto duration-500 max-w-7xl animate-in fade-in">
      <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="relative h-40 md:h-52 bg-slate-100 dark:bg-slate-900 group">
              {editData.cover_url ? (
                <img
                  src={editData.cover_url}
                  className="object-cover w-full h-full"
                  alt="Cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-[#00BFFF] opacity-40 flex items-center justify-center">
                  <Globe size={60} className="text-white opacity-20" />
                </div>
              )}
              {isOwn && (
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute p-2 text-white transition-all border rounded-full opacity-0 top-4 right-4 bg-white/10 backdrop-blur-md border-white/20 group-hover:opacity-100 hover:bg-white/20"
                >
                  <Camera size={18} />
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

            <div className="relative px-6 pb-6">
              <div className="flex flex-col justify-between gap-4 -mt-12 md:flex-row md:items-end md:-mt-16">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl bg-white dark:bg-[#0a0a0a] border-4 border-white dark:border-[#0a0a0a] overflow-hidden shadow-md flex items-center justify-center relative">
                    {editData.avatar_url ? (
                      <img
                        src={editData.avatar_url}
                        className="object-cover w-full h-full"
                        alt="Avatar"
                      />
                    ) : (
                      <Fingerprint size={40} className="text-slate-200" />
                    )}
                  </div>
                  {isOwn && (
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 cursor-pointer bg-black/40 hover:opacity-100 rounded-xl md:rounded-2xl"
                    >
                      <Camera size={24} className="text-white" />
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

                <div className="flex gap-2">
                  {isOwn ? (
                    <>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex-1 md:flex-none px-6 py-2 bg-[#00BFFF] text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
                      >
                        {isEditing ? <Check size={14} /> : <Edit2 size={14} />}
                        {isEditing ? "Save" : "Edit Profile"}
                      </button>
                      <button
                        onClick={onLogout}
                        className="p-2.5 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-white/10 rounded-full transition-all"
                      >
                        <LogOut size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onChat?.(profile)}
                        className="px-8 py-2 bg-[#00BFFF] text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
                      >
                        <MessageSquare size={14} /> Connect
                      </button>
                      <button className="p-2.5 text-slate-400 border border-slate-200 dark:border-white/10 rounded-full transition-all">
                        <Share2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
                    {profile.full_name}
                  </h1>
                  <div className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800/30 text-[8px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                    <Target size={8} /> Verified Node
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  {profile.serial_id} • Sector_{profile.gender}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="text-[11px] font-bold text-[#00BFFF] hover:underline cursor-pointer">
                    {profile.followers_count || 0} Connections
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black tracking-widest uppercase text-slate-900 dark:text-white">
                Manifesto
              </h3>
              {isOwn && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-slate-400 hover:text-[#00BFFF]"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 duration-300 animate-in fade-in">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Full Name
                  </label>
                  <input
                    value={editData.full_name}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, full_name: e.target.value }))
                    }
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white font-bold outline-none focus:border-[#00BFFF]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Operational Brief
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, bio: e.target.value }))
                    }
                    rows={5}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-slate-700 dark:text-slate-300 font-medium outline-none focus:border-[#00BFFF] resize-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (onUpdateProfile) onUpdateProfile(editData);
                    setIsEditing(false);
                    toast.success("Identity Sync Successful");
                  }}
                  className="w-full py-3 bg-[#00BFFF] text-white rounded-lg font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all"
                >
                  Sync Identity Shards
                </button>
              </div>
            ) : (
              <p className="text-sm italic font-medium leading-relaxed md:text-base text-slate-600 dark:text-slate-400">
                "
                {profile.bio ||
                  "Observing network integrity and factual dispatches across the local sector shards."}
                "
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black tracking-widest uppercase text-slate-900 dark:text-white">
                Dispatch Archive
              </h3>
              <button className="text-[10px] font-black uppercase text-[#00BFFF] hover:underline">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 transition-all border cursor-pointer bg-slate-50 dark:bg-white/5 rounded-xl border-slate-100 dark:border-white/5 group hover:border-blue-500/50"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0">
                    <Terminal size={20} className="text-slate-400" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-[11px] font-black uppercase text-slate-800 dark:text-white truncate">
                      Sector Intelligence Report #{i}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 truncate italic">
                      Protocol verification in progress...
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[8px] font-black text-blue-500 uppercase">
                        Analysis
                      </span>
                      <span className="text-[8px] font-bold text-slate-300">
                        3d ago
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <IDCard profile={{ ...profile, ...editData }} isOwn={isOwn} />

          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b text-slate-400 border-slate-100 dark:border-white/10">
              <Activity size={16} className="text-[#00BFFF]" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">
                Node Analytics
              </h4>
            </div>
            <div className="space-y-6">
              <MetricItem
                icon={<Activity size={16} />}
                label="Reputation index"
                val={`${profile.budget || 0}% Accuracy`}
              />
              <MetricItem
                icon={<Calendar size={16} />}
                label="Registration Date"
                val={new Date(
                  profile.last_seen || Date.now()
                ).toLocaleDateString()}
              />
              <MetricItem
                icon={<Cpu size={16} />}
                label="Protocol Tier"
                val={profile.role === "admin" ? "ROOT_CORE" : "ALPHA_NODE"}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">
              Handshake Registry
            </h4>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-center w-8 h-8 border rounded-full bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10"
                >
                  <Fingerprint size={14} className="text-slate-300" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/20 flex items-center justify-center text-[8px] font-black text-[#00BFFF] cursor-pointer hover:bg-[#00BFFF]/20">
                +12
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const MetricItem = ({ icon, label, val }: any) => (
  <div className="flex items-center gap-4 group">
    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl text-[#00BFFF] group-hover:bg-[#00BFFF] group-hover:text-white transition-all border border-slate-100 dark:border-white/5">
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-xs font-black uppercase truncate text-slate-900 dark:text-white">
        {val}
      </p>
    </div>
  </div>
);

export default ProfilePage;
