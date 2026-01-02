import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  ArrowLeft,
  Lock,
  User,
  Info,
  Mail,
  Smartphone,
  MessageSquare,
  LogOut,
  ShieldAlert,
  Fingerprint,
} from "lucide-react";
import IDCard from "../../components/IDCard";
import SettingsTerminal from "../../components/SettingsTerminal";
import { Profile } from "../../types";
import { toast } from "react-hot-toast";

interface ProfilePageProps {
  profile: Profile;
  onLogout: () => void;
  onUpdateProfile?: (data: Partial<Profile>) => void;
  isExternal?: boolean;
  onCloseExternal: () => void;
  isLoggedIn?: boolean;
  currentUserId?: string;
  currentUserProfile?: Profile | null;
  onChat?: (user: Profile) => void;
  initialTab?: "intel" | "settings";
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onLogout,
  onUpdateProfile,
  isExternal = false,
  onCloseExternal,
  currentUserId,
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
  const canSeeDetails = isOwnProfile || !profile.is_private;

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
      <div className="flex items-center justify-between">
        <button
          onClick={onCloseExternal}
          className="flex items-center gap-3 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />{" "}
          Exit Identity
        </button>

        {isOwnProfile && (
          <button
            onClick={() => {
              if (
                confirm(
                  "TERMINATE SESSION: This will disconnect your identity node. Continue?"
                )
              )
                onLogout();
            }}
            className="flex items-center gap-3 px-6 py-3 bg-red-50 dark:bg-red-950 text-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 dark:border-red-900/20"
          >
            <LogOut size={16} /> Terminate Protocol
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
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
              <div className="w-full aspect-[1.6/1] bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-12 space-y-6">
                <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <Lock size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                    Locked Node
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase italic">
                    Identity is currently private
                  </p>
                </div>
              </div>
            )}

            <div className="flex w-full gap-3">
              {!isOwnProfile && (
                <button
                  onClick={() => onChat?.(profile)}
                  className="flex-1 py-5 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl hover:bg-blue-700 shadow-blue-600/20"
                >
                  <MessageSquare size={18} /> Secure Handshake
                </button>
              )}
              {isOwnProfile && (isEditing || !profile.avatar_url) && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-5 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
                >
                  <Camera size={18} />{" "}
                  {isUploading ? "Syncing..." : "Update Visual"}
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
            <StatCard
              label="Protocol"
              value={profile.role?.toUpperCase() || "USER"}
            />
            <StatCard label="Reputation" value={profile.budget || 0} />
          </div>
        </div>

        <div className="space-y-12 lg:col-span-7">
          <div className="flex flex-col items-center justify-between gap-8 pb-10 border-b md:flex-row border-slate-100 dark:border-slate-900">
            <h2 className="text-4xl italic font-black leading-none tracking-tighter uppercase md:text-7xl text-slate-900 dark:text-white">
              Identity
            </h2>
            {isOwnProfile && (
              <div className="flex gap-1 p-1.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab("intel")}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === "intel"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  Node Stats
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === "settings"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  Protocol
                </button>
              </div>
            )}
          </div>

          {activeTab === "intel" ? (
            <div className="bg-white dark:bg-slate-950 p-8 md:p-14 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-12">
              <div className="flex items-center justify-between pb-6 border-b border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-3 text-slate-400">
                  <Fingerprint size={18} />
                  <label className="text-[10px] font-black uppercase tracking-widest">
                    Metadata Registry
                  </label>
                </div>
                {isOwnProfile && (
                  <button
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline"
                  >
                    {isEditing ? "Sync Changes" : "Update Identity"}
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                  <EditField
                    icon={<User size={14} />}
                    label="Node Designation (Name)"
                    value={editData.full_name}
                    onChange={(v: string) =>
                      setEditData((prev) => ({ ...prev, full_name: v }))
                    }
                  />
                  <EditField
                    icon={<Info size={14} />}
                    label="Operational Manifesto (Bio)"
                    value={editData.bio}
                    onChange={(v: string) =>
                      setEditData((prev) => ({ ...prev, bio: v }))
                    }
                  />
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <EditField
                      icon={<Mail size={14} />}
                      label="Signal Hub (Email)"
                      value={editData.email}
                      onChange={(v: string) =>
                        setEditData((prev) => ({ ...prev, email: v }))
                      }
                    />
                    <EditField
                      icon={<Smartphone size={14} />}
                      label="Comms Link (Phone)"
                      value={editData.phone}
                      onChange={(v: string) =>
                        setEditData((prev) => ({ ...prev, phone: v }))
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {canSeeDetails ? (
                    <>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                        <DetailBlock
                          label="Node Operator"
                          val={profile.full_name}
                        />
                        <DetailBlock
                          label="Network Hash"
                          val={`@${profile.username}`}
                        />
                        <DetailBlock
                          label="Signal Link"
                          val={profile.phone || "Classified"}
                        />
                        <DetailBlock
                          label="Registry Gender"
                          val={profile.gender}
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">
                          Operational Manifesto
                        </p>
                        <p className="text-xl italic font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                          "{profile.bio || "Verified correspondent node."}"
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center opacity-30">
                      <ShieldAlert size={48} className="text-slate-300" />
                      <p className="text-xs font-black uppercase tracking-[0.5em] leading-loose">
                        Access Restricted.
                        <br />
                        Identity Masked.
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

const DetailBlock: React.FC<{ label: string; val: string | number }> = ({
  label,
  val,
}) => (
  <div className="space-y-1.5 overflow-hidden">
    <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">
      {label}
    </p>
    <p className="text-2xl italic font-black leading-none tracking-tighter uppercase truncate text-slate-900 dark:text-white">
      {val || "PENDING"}
    </p>
  </div>
);

const EditField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ icon, label, value, onChange }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 text-sm font-bold border-none outline-none bg-slate-50 dark:bg-slate-900/50 rounded-xl focus:ring-2 focus:ring-blue-600/20 dark:text-white placeholder:text-slate-400"
    />
  </div>
);

const StatCard: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-2 text-center shadow-sm">
    <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
      {label}
    </p>
    <p className="text-3xl italic font-black tracking-tighter uppercase text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default ProfilePage;
