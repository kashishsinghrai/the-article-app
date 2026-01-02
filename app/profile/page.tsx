import React, { useState, useEffect } from "react";
// Fix: Added missing 'User' to the lucide-react imports
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
  onSendChatRequest?: (profile: Profile) => void;
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
  onSendChatRequest,
  initialTab = "intel",
}) => {
  const [activeTab, setActiveTab] = useState<"intel" | "settings">(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    gender: profile?.gender || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!profile || !profile.id)
    return (
      <div className="min-h-[60vh] flex items-center justify-center opacity-30 font-black uppercase tracking-widest text-[10px]">
        Retrieving Identity...
      </div>
    );

  const isOwnProfile = !isExternal || currentUserId === profile.id;

  const handleSave = async () => {
    if (onUpdateProfile) {
      // Sync with Auth if email changed (Note: usually requires confirmation)
      if (editData.email !== profile.email) {
        const { error: authErr } = await supabase.auth.updateUser({
          email: editData.email,
        });
        if (authErr) toast.error("Auth sync failed: " + authErr.message);
      }
      onUpdateProfile(editData);
    }
    setIsEditing(false);
  };

  return (
    <main className="max-w-6xl px-6 py-24 mx-auto space-y-12 md:py-32">
      <button
        onClick={onCloseExternal}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase text-[10px] tracking-widest transition-all group"
      >
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-1"
        />
        Back to Feed
      </button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
        <div className="space-y-12 lg:col-span-5">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-center w-full py-4 overflow-visible">
              <IDCard profile={profile} />
            </div>

            {isOwnProfile && (
              <button
                onClick={() =>
                  toast.success("Pass rendering for high-res export...")
                }
                className="w-full py-4 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
              >
                <Download size={14} /> Refresh Credentials
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Reputation" value={profile.budget} />
            <StatCard label="Standing" value={profile.role.toUpperCase()} />
          </div>

          {isOwnProfile && (
            <button
              onClick={onLogout}
              className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all border border-transparent hover:border-red-100"
            >
              Disconnect Identity
            </button>
          )}
        </div>

        <div className="space-y-12 lg:col-span-7">
          <div className="flex flex-col items-center justify-between gap-8 pb-8 border-b md:flex-row border-slate-100 dark:border-slate-900">
            <h2 className="text-4xl italic font-black leading-none tracking-tighter uppercase md:text-6xl text-slate-900 dark:text-white">
              Control
            </h2>
            <div className="flex gap-1 p-1 border bg-slate-50 dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTab("intel")}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                  activeTab === "intel"
                    ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                    : "text-slate-400"
                }`}
              >
                Identity
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
                    {isEditing ? "Sync Changes" : "Edit Credentials"}
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Fix: 'User' icon is now available from imports */}
                    <EditField
                      icon={<User size={12} />}
                      label="Full Name"
                      value={editData.full_name}
                      onChange={(v) =>
                        setEditData({ ...editData, full_name: v })
                      }
                    />
                    <EditField
                      icon={<Mail size={12} />}
                      label="Primary Email"
                      value={editData.email}
                      onChange={(v) => setEditData({ ...editData, email: v })}
                    />
                    <EditField
                      icon={<Smartphone size={12} />}
                      label="Contact Phone"
                      value={editData.phone}
                      onChange={(v) => setEditData({ ...editData, phone: v })}
                    />
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase text-slate-400">
                        Gender
                      </label>
                      <select
                        value={editData.gender}
                        onChange={(e) =>
                          setEditData({ ...editData, gender: e.target.value })
                        }
                        className="w-full p-4 text-sm font-bold border-none outline-none appearance-none bg-slate-50 dark:bg-slate-900 rounded-xl focus:ring-1 focus:ring-blue-600 dark:text-white"
                      >
                        {[
                          "Male",
                          "Female",
                          "Non-Binary",
                          "Prefer not to say",
                        ].map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-slate-400">
                      Identity Manifesto
                    </label>
                    <textarea
                      rows={4}
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      className="w-full p-4 text-sm font-medium border-none outline-none bg-slate-50 dark:bg-slate-900 rounded-xl focus:ring-1 focus:ring-blue-600 dark:text-white"
                      placeholder="What is your mission?"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <DetailBlock label="Name" val={profile.full_name} />
                    <DetailBlock
                      label="Network Email"
                      val={profile.email || "N/A"}
                    />
                    <DetailBlock label="Contact" val={profile.phone || "N/A"} />
                    <DetailBlock label="Gender" val={profile.gender} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-300 font-black uppercase mb-2">
                      Manifesto
                    </p>
                    <p className="text-lg italic font-medium leading-relaxed text-slate-500">
                      "{profile.bio}"
                    </p>
                  </div>
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

const DetailBlock = ({ label, val }: any) => (
  <div>
    <p className="text-[9px] text-slate-300 font-black uppercase mb-1">
      {label}
    </p>
    <p className="text-xl italic font-black uppercase truncate text-slate-900 dark:text-white">
      {val}
    </p>
  </div>
);

const EditField = ({ icon, label, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
      {icon} {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 text-sm font-bold border-none outline-none bg-slate-50 dark:bg-slate-900 rounded-xl focus:ring-1 focus:ring-blue-600 dark:text-white"
      placeholder={label}
    />
  </div>
);

const StatCard = ({ label, value }: any) => (
  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 space-y-1">
    <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
    <p className="text-2xl font-black uppercase text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default ProfilePage;
