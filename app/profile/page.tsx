import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  ArrowLeft,
  Lock,
  Unlock,
  User,
  Info,
  MessageSquare,
  LogOut,
  ShieldAlert,
  Fingerprint,
  Mail,
  Smartphone,
  Globe,
  Shield,
  Activity,
  Calendar,
  Binary,
} from "lucide-react";
import { Profile } from "../../types";
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
  onChat?: (user: Profile) => void;
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
  const [editData, setEditData] = useState({
    full_name: profile.full_name,
    bio: profile.bio,
    avatar_url: profile.avatar_url || "",
    gender: profile.gender || "Masked",
    phone: profile.phone || "",
    email: profile.email || "",
    is_private: profile.is_private || false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Strict check if this profile belongs to the logged-in user
  const isOwn = currentUserId === profile.id;
  const canSeeDetails = isOwn || !profile.is_private;

  useEffect(() => {
    setEditData({
      full_name: profile.full_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url || "",
      gender: profile.gender || "Masked",
      phone: profile.phone || "",
      email: profile.email || "",
      is_private: profile.is_private || false,
    });
  }, [profile]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Asset size exceeds 1MB protocol.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () =>
        setEditData((p) => ({ ...p, avatar_url: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (onUpdateProfile) {
      await onUpdateProfile(editData);
      setIsEditing(false);
    }
  };

  return (
    <main className="max-w-6xl px-4 py-10 mx-auto space-y-12 duration-500 md:px-6 md:py-16 animate-in fade-in">
      <div className="flex flex-col items-start justify-between gap-6 pb-10 border-b md:flex-row md:items-center border-slate-100 dark:border-white/5">
        <div className="space-y-4">
          <button
            onClick={onCloseExternal}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 uppercase text-[9px] font-black tracking-[0.3em] transition-all group"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />{" "}
            {isExternal ? "Back to Registry" : "Return to Hub"}
          </button>
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
              <Shield size={22} className="text-white" />
            </div>
            <h1 className="text-3xl italic font-black tracking-tighter uppercase md:text-4xl text-slate-950 dark:text-white">
              Node_Identity
            </h1>
          </div>
        </div>

        <div className="flex items-center w-full gap-3 md:w-auto">
          {!isOwn && (
            <button
              onClick={() => onChat?.(profile)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
            >
              <MessageSquare size={14} /> Establish Signal
            </button>
          )}
          {isOwn && (
            <button
              onClick={onLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-red-600 dark:bg-red-500/10 dark:text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-red-100 dark:border-red-500/20 hover:bg-red-600 hover:text-white transition-all"
            >
              <LogOut size={14} /> Terminate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 md:gap-12">
        <div className="space-y-8 lg:col-span-4">
          <IDCard profile={{ ...profile, ...editData }} isOwn={isOwn} />

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 space-y-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Network Pulse
                </span>
                <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500 italic">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                  Active_Node
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 text-center border bg-slate-50 dark:bg-slate-950/50 rounded-3xl border-slate-100 dark:border-white/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                    Clearance
                  </p>
                  <p className="text-lg font-black text-blue-600 uppercase">
                    {profile.role}
                  </p>
                </div>
                <div className="p-5 text-center border bg-slate-50 dark:bg-slate-950/50 rounded-3xl border-slate-100 dark:border-white/5">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                    Reputation
                  </p>
                  <p className="text-lg font-black text-blue-600">
                    {profile.budget || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 dark:border-white/5">
              <div className="flex items-center gap-3 mb-4 text-slate-400">
                <Activity size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Sync Integrity
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: "92%" }}
                />
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-3">
                Node Alpha Verification: 92%
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden min-h-[500px]">
            <div className="flex flex-col items-start justify-between gap-4 px-8 py-8 border-b md:px-10 border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-slate-950/50 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Binary size={18} className="text-blue-600" />
                <h3 className="text-xl italic font-black tracking-tighter uppercase dark:text-white">
                  Dossier_Files
                </h3>
              </div>
              {isOwn && (
                <button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  {isEditing ? "Sync Data" : "Edit Dossier"}
                </button>
              )}
            </div>

            <div className="p-8 md:p-10">
              {isEditing ? (
                <div className="space-y-10 duration-500 animate-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                        <User size={12} /> Handle Name
                      </label>
                      <input
                        value={editData.full_name}
                        onChange={(e) =>
                          setEditData((p) => ({
                            ...p,
                            full_name: e.target.value,
                          }))
                        }
                        className="w-full px-6 py-4 font-bold transition-all border shadow-inner outline-none bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-600/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                        <Globe size={12} /> Assigned Sector
                      </label>
                      <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
                        {["Male", "Female", "Masked"].map((g) => (
                          <button
                            key={g}
                            onClick={() =>
                              setEditData((p) => ({ ...p, gender: g }))
                            }
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${
                              editData.gender === g
                                ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm"
                                : "text-slate-400"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                        <Mail size={12} /> Signal Inbox
                      </label>
                      <input
                        value={editData.email}
                        onChange={(e) =>
                          setEditData((p) => ({ ...p, email: e.target.value }))
                        }
                        className="w-full px-6 py-4 font-bold transition-all border shadow-inner outline-none bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-600/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                        <Smartphone size={12} /> Comms ID
                      </label>
                      <input
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="w-full px-6 py-4 font-bold transition-all border shadow-inner outline-none bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-600/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                      <Info size={12} /> Operational Manifesto
                    </label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, bio: e.target.value }))
                      }
                      rows={5}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-[2rem] px-6 py-5 text-slate-900 dark:text-white font-bold outline-none focus:ring-1 focus:ring-blue-600/50 transition-all resize-none shadow-inner"
                      placeholder="Node professional goals..."
                    />
                  </div>

                  <div className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-white/5">
                    <button
                      onClick={() =>
                        setEditData((p) => ({
                          ...p,
                          is_private: !p.is_private,
                        }))
                      }
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
                        editData.is_private
                          ? "bg-red-600 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {editData.is_private ? (
                        <Lock size={22} />
                      ) : (
                        <Unlock size={22} />
                      )}
                    </button>
                    <div className="flex-grow">
                      <p className="text-[11px] font-black uppercase dark:text-white">
                        {editData.is_private
                          ? "Stealth Protocol Enabled"
                          : "Public Transmission Active"}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Hide dossier from the network registry index.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {canSeeDetails ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                        <DossierItem
                          icon={Fingerprint}
                          label="Node Alias"
                          value={`@${profile.username}`}
                        />
                        <DossierItem
                          icon={Calendar}
                          label="Registered"
                          value={new Date(
                            profile.last_seen || Date.now()
                          ).toLocaleDateString()}
                        />
                        <DossierItem
                          icon={Mail}
                          label="Signal Hub"
                          value={profile.email || "CLASSIFIED"}
                        />
                        <DossierItem
                          icon={Smartphone}
                          label="Direct Comms"
                          value={profile.phone || "OFFLINE"}
                        />
                      </div>

                      <div className="pt-10 space-y-5 border-t border-slate-50 dark:border-white/5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Info size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Node Manifesto
                          </span>
                        </div>
                        <p className="text-lg italic font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                          "
                          {profile.bio ||
                            "This node has not provided an operational mission statement."}
                          "
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20 space-y-6 text-center opacity-30">
                      <ShieldAlert size={64} className="text-slate-400" />
                      <div className="space-y-2">
                        <p className="text-xl font-black uppercase tracking-[0.2em] dark:text-white">
                          Dossier Locked
                        </p>
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-500">
                          Access requires stealth-clearance handshake.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const DossierItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-white/5">
      <Icon size={18} className="text-slate-400" />
    </div>
    <div className="overflow-hidden">
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">
        {label}
      </p>
      <p className="text-base italic font-black tracking-tight uppercase truncate dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

export default ProfilePage;
