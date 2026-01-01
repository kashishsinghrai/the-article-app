import React, { useState } from "react";
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
  Fingerprint,
  Info,
  Edit3,
  Save,
  Sliders,
  ArrowLeft,
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
  onSendChatRequest?: (profile: Profile) => void;
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
}) => {
  const [activeTab, setActiveTab] = useState<"intel" | "settings">("intel");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    gender: profile?.gender || "",
  });

  if (!profile || !profile.id)
    return (
      <div className="min-h-[60vh] flex items-center justify-center opacity-30 font-black uppercase tracking-widest text-[10px]">
        Retrieving Identity...
      </div>
    );

  const isOwnProfile = !isExternal || currentUserId === profile.id;

  const handleSave = () => {
    onUpdateProfile?.(editData);
    setIsEditing(false);
  };

  return (
    <main className="max-w-6xl px-6 py-24 mx-auto space-y-12 md:py-32">
      {/* Fixed Back Button Navigation */}
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
            {/* ID Card Wrapper with extra padding to prevent clipping */}
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
            <StatCard label="Standing" value="Verified" />
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
                Profile
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
                    className="text-blue-600 font-black uppercase text-[10px]"
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase text-slate-400">
                      Full Legal Name
                    </label>
                    <input
                      value={editData.full_name}
                      onChange={(e) =>
                        setEditData({ ...editData, full_name: e.target.value })
                      }
                      className="w-full p-4 text-sm font-bold border-none outline-none bg-slate-50 dark:bg-slate-900 rounded-xl focus:ring-1 focus:ring-blue-600 dark:text-white"
                      placeholder="Full Name"
                    />
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
                    <div>
                      <p className="text-[9px] text-slate-300 font-black uppercase mb-1">
                        Name
                      </p>
                      <p className="text-xl italic font-black uppercase text-slate-900 dark:text-white">
                        {profile.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-300 font-black uppercase mb-1">
                        Gender
                      </p>
                      <p className="text-xl italic font-black uppercase text-slate-900 dark:text-white">
                        {profile.gender}
                      </p>
                    </div>
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

const StatCard = ({ label, value }: any) => (
  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 space-y-1">
    <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
    <p className="text-2xl font-black uppercase text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default ProfilePage;
