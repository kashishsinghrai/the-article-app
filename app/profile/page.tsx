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
  Shield,
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
  onCloseExternal?: () => void;
  isLoggedIn?: boolean;
  currentUserId?: string;
  onSendChatRequest?: (targetId: string, targetName: string) => void;
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
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"intel" | "settings">("intel");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    gender: profile?.gender || "",
  });

  if (!profile || !profile.id) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4 opacity-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-[10px] font-black uppercase tracking_widest">
          Retrieving Node Identity...
        </p>
      </div>
    );
  }

  const isOwnProfile = !isExternal || currentUserId === profile.id;

  const handleSave = () => {
    onUpdateProfile?.(editData);
    setIsEditing(false);
  };

  const handleDownloadCard = async () => {
    const element = document.getElementById("press-pass-capture-area");
    const h2c = (window as any).html2canvas;
    if (!element || !h2c) return;
    setIsExporting(true);
    try {
      const canvas = await h2c(element, { scale: 3, useCORS: true });
      const link = document.createElement("a");
      link.download = `CREDENTIAL-${profile.serial_id}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success("ID Exported");
    } catch (err) {
      toast.error("Export Failed");
    }
    setIsExporting(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 animate-in fade-in duration-700">
      {isExternal && (
        <div className="mb-8 md:mb-12 flex justify-between items-center bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40">
          <div className="flex items-center gap-3">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-600 italic">
              Remote Access
            </span>
            {isLoggedIn && currentUserId !== profile.id && (
              <button
                onClick={() =>
                  onSendChatRequest?.(profile.id, profile.full_name)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 shadow-lg"
              >
                <MessageSquare size={14} />
                <span className="text-[10px] font-black uppercase">Link</span>
              </button>
            )}
          </div>
          <button
            onClick={onCloseExternal}
            className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Identity Status
              </h2>
              <div
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                  profile.is_online ? "text-emerald-500" : "text-slate-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    profile.is_online
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-slate-300"
                  }`}
                />
                {profile.is_online ? "Active Node" : "Standby Mode"}
              </div>
            </div>

            <div className="space-y-6 overflow-hidden">
              <IDCard profile={profile} />
              {isOwnProfile && (
                <button
                  onClick={handleDownloadCard}
                  disabled={isExporting}
                  className="w-full py-5 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                >
                  {isExporting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  Export Press ID
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<TrendingUp size={18} />}
              label="Node Rep"
              value={profile.budget}
              color="text-green-600"
            />
            <StatCard
              icon={<ShieldCheck size={18} />}
              label="Trust"
              value="High"
              color="text-blue-600"
            />
          </div>

          {isOwnProfile && (
            <button
              onClick={onLogout}
              className="w-full py-5 rounded-full border-2 border-red-50 dark:border-red-900/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Disconnect
            </button>
          )}
        </div>

        <div className="lg:col-span-7 space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8 gap-6">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
              Intelligence <br /> Control
            </h2>
            {isOwnProfile && (
              <div className="flex gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl">
                <button
                  onClick={() => setActiveTab("intel")}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === "intel"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-md"
                      : "text-slate-400"
                  }`}
                >
                  <Info size={14} className="inline mr-2" /> Bio
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === "settings"
                      ? "bg-white dark:bg-slate-800 text-blue-600 shadow-md"
                      : "text-slate-400"
                  }`}
                >
                  <Sliders size={14} className="inline mr-2" /> Settings
                </button>
              </div>
            )}
          </div>

          {activeTab === "intel" ? (
            <section className="space-y-8 animate-in slide-in-from-left-4 duration-500">
              <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-10">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                    Identity Details
                  </label>
                  {isOwnProfile && (
                    <button
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl text-blue-600"
                    >
                      {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Public Name
                      </label>
                      <input
                        value={editData.full_name}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            full_name: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Mission Bio
                      </label>
                      <textarea
                        rows={4}
                        value={editData.bio}
                        onChange={(e) =>
                          setEditData({ ...editData, bio: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-4 py-3 text-sm font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1.5">
                        <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">
                          Full Name
                        </p>
                        <div className="flex items-center gap-3">
                          <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase italic">
                            {profile.full_name}
                          </p>
                          <UserCheck size={16} className="text-blue-600" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">
                          Gender
                        </p>
                        <p className="text-xl md:text-2xl font-black text-blue-600 uppercase italic">
                          {profile.gender || "Global"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                        Correspondence Bio
                      </label>
                      <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-medium italic border border-slate-100 dark:border-slate-800 leading-relaxed text-lg">
                        "{profile.bio}"
                      </div>
                    </div>
                  </>
                )}
                <div className="pt-6 border-t border-slate-50 dark:border-white/5 flex items-center gap-4 text-slate-400">
                  <Info size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Serial ID: {profile.serial_id}
                  </span>
                </div>
              </div>
            </section>
          ) : (
            <SettingsTerminal
              settings={
                profile.settings || {
                  notifications_enabled: true,
                  presence_visible: true,
                  data_sharing: false,
                  ai_briefings: true,
                  secure_mode: true,
                }
              }
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

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 group">
    <div className="flex items-center gap-2 text-slate-300 group-hover:text-blue-600 transition-colors">
      {icon}
      <span className="text-[8px] font-black uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
    <div className={`text-3xl font-black italic tracking-tighter ${color}`}>
      {value}
    </div>
  </div>
);

export default ProfilePage;
