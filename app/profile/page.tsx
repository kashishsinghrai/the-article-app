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
} from "lucide-react";
import IDCard from "../../components/IDCard";
import { Profile } from "../../types";
import { toast } from "react-hot-toast";

interface ProfilePageProps {
  profile: Profile;
  onLogout: () => void;
  onUpdatePrivacy: (isPrivate: boolean) => void;
  isExternal?: boolean;
  onCloseExternal?: () => void;
  isLoggedIn?: boolean;
  currentUserId?: string;
  onSendChatRequest?: (targetId: string, targetName: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onLogout,
  onUpdatePrivacy,
  isExternal = false,
  onCloseExternal,
  isLoggedIn = false,
  currentUserId,
  onSendChatRequest,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const isOwnProfile = !isExternal || currentUserId === profile.id;

  const handleDownloadCard = async () => {
    const element = document.getElementById("press-pass-capture-area");
    const h2c = (window as any).html2canvas;

    if (!element) {
      toast.error("Identification Module Not Found");
      return;
    }

    if (!h2c) {
      toast.error("Library Error: Protocol not initialized");
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading("Establishing Secure Link & Encoding ID...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const canvas = await h2c(element, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `ThE-ARTICLES-CREDENTIAL-${profile.serial_id}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("Digital Press ID Exported Successfully", { id: toastId });
    } catch (err) {
      console.error("ID Export Error:", err);
      toast.error("Export Error: Protocol Initialization Failed", {
        id: toastId,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 animate-in fade-in duration-700">
      {isExternal && (
        <div className="mb-8 md:mb-12 flex justify-between items-center bg-blue-50 dark:bg-blue-950/30 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-blue-100 dark:border-blue-900/40">
          <div className="flex items-center gap-3 md:gap-6">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 italic">
              Remote Access
            </span>
            {isLoggedIn && currentUserId !== profile.id && (
              <button
                onClick={() =>
                  onSendChatRequest?.(profile.id, profile.full_name)
                }
                className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-full transition-all bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
              >
                <MessageSquare size={14} />
                <span className="text-[10px] font-black tracking-widest uppercase">
                  Link
                </span>
              </button>
            )}
          </div>
          <button
            onClick={onCloseExternal}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full text-blue-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">
        <div className="lg:col-span-5 space-y-10 md:space-y-12">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Identity Status
              </h2>
              {profile.is_online && (
                <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{" "}
                  Active Node
                </div>
              )}
            </div>

            {isOwnProfile ? (
              <div className="space-y-6">
                <div className="relative transform hover:-rotate-1 transition-transform duration-500">
                  <IDCard profile={profile} />
                </div>
                <div className="space-y-4">
                  <button
                    onClick={handleDownloadCard}
                    disabled={isExporting}
                    className="w-full py-4 md:py-5 rounded-2xl md:rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-100 transition-all disabled:opacity-50 shadow-xl"
                  >
                    {isExporting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    {isExporting ? "Encoding..." : "Export Press ID"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-blue-600">
                  <Fingerprint size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                    Verified Identity
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Digital credentials are encrypted for privacy
                  </p>
                </div>
                <div className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center gap-3">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    Member Since 2025
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
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

          {!isExternal && (
            <button
              onClick={onLogout}
              className="w-full py-5 rounded-full border-2 border-red-50 dark:border-red-900/20 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut size={16} /> Disconnect
            </button>
          )}
        </div>

        <div className="lg:col-span-7 space-y-12 md:space-y-20">
          <section className="space-y-8 md:space-y-10">
            <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-8">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                Intelligence <br /> Bio
              </h2>
              {!isExternal && (
                <Settings className="text-slate-200 dark:text-slate-700 hover:text-blue-600 cursor-pointer transition-colors" />
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 md:space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div className="space-y-1.5">
                  <p className="text-[9px] text-slate-300 dark:text-slate-700 font-black uppercase tracking-[0.2em]">
                    Full Name
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-none">
                      {profile.full_name}
                    </p>
                    <UserCheck size={16} className="text-blue-600" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] text-slate-300 dark:text-slate-700 font-black uppercase tracking-[0.2em]">
                    Gender
                  </p>
                  <p className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400 uppercase italic leading-none">
                    {profile.gender || "Global"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">
                  Correspondence Bio
                </label>
                <div className="p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-medium italic border border-slate-100 dark:border-slate-800 leading-relaxed text-base md:text-lg">
                  "{profile.bio}"
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-4 text-slate-400">
                  <Info size={16} />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                    Identity Serial: {profile.serial_id}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-3 md:space-y-4 group hover:border-blue-200 transition-all">
    <div className="flex items-center gap-2 md:gap-3 text-slate-300 dark:text-slate-700 group-hover:text-blue-600 transition-colors">
      {icon}
      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
    <div
      className={`text-2xl md:text-4xl font-black italic tracking-tighter ${color}`}
    >
      {value}
    </div>
  </div>
);

export default ProfilePage;
