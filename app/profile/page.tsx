import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  LogOut,
  TrendingUp,
  Download,
  X,
  MessageSquare,
  Loader2,
  ShieldCheck,
  UserCheck,
  User,
  Fingerprint,
  Info,
  Edit3,
  Save,
  Sliders,
  ArrowLeft,
  Mail,
  Smartphone,
  Camera,
  Lock,
  UserPlus,
  UserMinus,
} from "lucide-react";
import IDCard from "../../components/IDCard";
import SettingsTerminal from "../../components/SettingsTerminal";
import { Profile } from "../../types";
import { toast } from "react-hot-toast";
import { supabase } from "../../lib/supabase";

interface ProfilePageProps {
  profile: Profile;
  onLogout: () => void;
  onUpdateProfile?: (data: Partial<Profile>) => void;
  isExternal?: boolean;
  onCloseExternal: () => void;
  isLoggedIn?: boolean;
  currentUserId?: string;
  currentUserProfile?: Profile | null;
  onFollow?: (id: string) => void;
  onChat?: (user: Profile) => void;
  initialTab?: "intel" | "settings";
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onLogout,
  onUpdateProfile,
  isExternal = false,
  onCloseExternal,
  isLoggedIn = false,
  currentUserId,
  currentUserProfile,
  onFollow,
  onChat,
  initialTab = "intel",
}) => {
  const [activeTab, setActiveTab] = useState<"intel" | "settings">(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editData, setEditData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    gender: profile?.gender || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    avatar_url: profile?.avatar_url || "",
  });

  const isOwnProfile = !isExternal || currentUserId === profile.id;
  const isFollowing = currentUserProfile?.following?.includes(profile.id);
  const canSeeDetails = isOwnProfile || !profile.is_private || isFollowing;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSave = async () => {
    if (onUpdateProfile) onUpdateProfile(editData);
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024)
        return toast.error("Avatar exceeds 1MB threshold.");
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditData((prev) => ({ ...prev, avatar_url: base64 }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile || !profile.id) return null;

  return (
    <main className="max-w-6xl px-6 py-24 mx-auto space-y-12 duration-700 md:py-32 animate-in fade-in">
      <button
        onClick={onCloseExternal}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase text-[10px] tracking-widest transition-all"
      >
        <ArrowLeft size={16} /> Exit Identity
      </button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
        <div className="space-y-12 lg:col-span-5">
          <div className="flex flex-col items-center space-y-8">
            {canSeeDetails ? (
              <IDCard
                profile={{
                  ...profile,
                  avatar_url: editData.avatar_url || profile.avatar_url,
                }}
              />
            ) : (
              <div className="w-full aspect-[1.6/1] bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-10 space-y-4">
                <Lock size={40} className="text-slate-300" />
                <p className="text-xs font-black tracking-widest uppercase text-slate-400">
                  Locked Identity Node
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Follow to verify credentials
                </p>
              </div>
            )}

            <div className="flex w-full gap-3">
              {!isOwnProfile && (
                <>
                  <button
                    onClick={() => onFollow?.(profile.id)}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl ${
                      isFollowing
                        ? "bg-red-50 text-red-600"
                        : "bg-slate-950 dark:bg-white text-white dark:text-slate-950"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus size={16} /> Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} /> Follow Node
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onChat?.(profile)}
                    className="flex items-center justify-center w-16 text-blue-600 transition-all shadow-xl h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white"
                  >
                    <MessageSquare size={20} />
                  </button>
                </>
              )}
              {isOwnProfile && isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
                >
                  <Camera size={16} /> Update Visual
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Followers" value={profile.followers_count || 0} />
            <StatCard
              label="Following"
              value={profile.following_count || profile.following?.length || 0}
            />
            <StatCard label="Status" value={profile.role.toUpperCase()} />
            <StatCard label="Rep" value={profile.budget} />
          </div>
        </div>

        <div className="space-y-12 lg:col-span-7">
          <div className="flex flex-col items-center justify-between gap-8 pb-8 border-b md:flex-row border-slate-100 dark:border-slate-900">
            <h2 className="text-4xl italic font-black tracking-tighter uppercase md:text-6xl text-slate-900 dark:text-white">
              Identity
            </h2>
            {isOwnProfile && (
              <div className="flex gap-1 p-1 border bg-slate-50 dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab("intel")}
                  className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                    activeTab === "intel"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  Stats
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                    activeTab === "settings"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  Settings
                </button>
              </div>
            )}
          </div>

          {activeTab === "intel" ? (
            <div className="bg-white dark:bg-slate-950 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Identity Details
                </label>
                {isOwnProfile && (
                  <button
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    className="text-blue-600 font-black uppercase text-[10px] hover:underline"
                  >
                    {isEditing ? "Confirm Sync" : "Edit Identity"}
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-2">
                  <EditField
                    icon={<User size={12} />}
                    label="Legal Name"
                    value={editData.full_name}
                    onChange={(v: string) =>
                      setEditData((prev) => ({ ...prev, full_name: v }))
                    }
                  />
                  <EditField
                    icon={<Info size={12} />}
                    label="Network Bio"
                    value={editData.bio}
                    onChange={(v: string) =>
                      setEditData((prev) => ({ ...prev, bio: v }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <EditField
                      icon={<Mail size={12} />}
                      label="Email"
                      value={editData.email}
                      onChange={(v: string) =>
                        setEditData((prev) => ({ ...prev, email: v }))
                      }
                    />
                    <EditField
                      icon={<Smartphone size={12} />}
                      label="Phone"
                      value={editData.phone}
                      onChange={(v: string) =>
                        setEditData((prev) => ({ ...prev, phone: v }))
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  {canSeeDetails ? (
                    <>
                      <div className="grid grid-cols-2 gap-8">
                        <DetailBlock label="Name" val={profile.full_name} />
                        <DetailBlock
                          label="Network handle"
                          val={`@${profile.username}`}
                        />
                        <DetailBlock
                          label="Contact"
                          val={profile.phone || "Classified"}
                        />
                        <DetailBlock label="Gender" val={profile.gender} />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-300 font-black uppercase mb-2">
                          Network Manifesto
                        </p>
                        <p className="text-lg italic font-medium leading-relaxed text-slate-500">
                          "{profile.bio}"
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                      <Lock size={32} className="mb-4" />
                      <p className="text-xs font-black leading-loose tracking-widest uppercase">
                        Detail view restricted.
                        <br />
                        Follow node to unlock manifesto.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <SettingsTerminal
              settings={profile.settings || ({} as any)}
              onUpdate={(s) => onUpdateProfile?.({ settings: s })}
              isPrivate={profile.is_private}
              onTogglePrivate={(p) => onUpdateProfile?.({ is_private: p })}
            />
          )}
        </div>
      </div>
    </main>
  );
};

interface DetailBlockProps {
  label: string;
  val: string | number;
}

const DetailBlock: React.FC<DetailBlockProps> = ({ label, val }) => (
  <div>
    <p className="text-[9px] text-slate-300 font-black uppercase mb-1">
      {label}
    </p>
    <p className="text-xl italic font-black uppercase truncate text-slate-900 dark:text-white">
      {val}
    </p>
  </div>
);

interface EditFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const EditField: React.FC<EditFieldProps> = ({
  icon,
  label,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <label className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
      {icon} {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 text-sm font-bold border-none outline-none bg-slate-50 dark:bg-slate-900 rounded-xl focus:ring-1 focus:ring-blue-600 dark:text-white"
    />
  </div>
);

interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 space-y-1 text-center">
    <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
    <p className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default ProfilePage;
