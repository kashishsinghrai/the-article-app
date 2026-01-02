import React, { useState } from "react";
import {
  Bell,
  Eye,
  EyeOff,
  Shield,
  Database,
  Cpu,
  Lock,
  ToggleLeft,
  ToggleRight,
  Fingerprint,
  Globe,
  Camera,
  Mic,
  MapPin,
  HardDrive,
  Users as UsersIcon,
  ShieldAlert,
  Zap,
  Key,
  Mail,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { UserSettings } from "../types";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabase";

interface SettingsTerminalProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
  isPrivate: boolean;
  onTogglePrivate: (val: boolean) => void;
}

const SettingsTerminal: React.FC<SettingsTerminalProps> = ({
  settings,
  onUpdate,
  isPrivate,
  onTogglePrivate,
}) => {
  const [activeTab, setActiveTab] = useState<
    "privacy" | "hardware" | "security"
  >("privacy");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSetting = async (key: keyof UserSettings) => {
    const newVal = !settings[key];

    if (newVal) {
      try {
        if (key === "camera_access")
          await navigator.mediaDevices.getUserMedia({ video: true });
        if (key === "mic_access")
          await navigator.mediaDevices.getUserMedia({ audio: true });
        if (key === "location_access")
          await new Promise((res, rej) =>
            navigator.geolocation.getCurrentPosition(res, rej)
          );
        if (key === "notifications_enabled") {
          if ("Notification" in window) await Notification.requestPermission();
        }
      } catch (err) {
        toast.error(`Permission denied by system.`);
        return;
      }
    }

    onUpdate({ ...settings, [key]: newVal });
    toast.success(`Protocol ${key.replace("_", " ").toUpperCase()} updated`);
  };

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast.success("Security Credentials Updated.");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Credential update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 duration-500 animate-in slide-in-from-right-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/50">
          <TabButton
            active={activeTab === "privacy"}
            onClick={() => setActiveTab("privacy")}
            label="Privacy"
            icon={<Lock size={12} />}
          />
          <TabButton
            active={activeTab === "hardware"}
            onClick={() => setActiveTab("hardware")}
            label="Hardware"
            icon={<Camera size={12} />}
          />
          <TabButton
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
            label="Security"
            icon={<Key size={12} />}
          />
        </div>

        <div className="p-8 space-y-12 md:p-12">
          {activeTab === "privacy" && (
            <section className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                <ShieldAlert size={18} className="text-blue-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
                  Privacy Thresholds
                </h3>
              </div>

              <SettingToggle
                icon={<EyeOff size={18} />}
                label="Stealth Mode"
                description="Profile will not be indexed in public registry."
                active={isPrivate}
                onClick={() => onTogglePrivate(!isPrivate)}
              />

              <SettingToggle
                icon={<Globe size={18} />}
                label="Presence Pulse"
                description="Show live online status to verified network nodes."
                active={settings.presence_visible}
                onClick={() => toggleSetting("presence_visible")}
              />
            </section>
          )}

          {activeTab === "hardware" && (
            <section className="space-y-8 duration-300 animate-in fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                <Zap size={18} className="text-blue-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
                  Operational Access
                </h3>
              </div>

              <SettingToggle
                icon={<Camera size={18} />}
                label="Visual Capture"
                active={settings.camera_access}
                onClick={() => toggleSetting("camera_access")}
              />

              <SettingToggle
                icon={<Mic size={18} />}
                label="Audio Interface"
                active={settings.mic_access}
                onClick={() => toggleSetting("mic_access")}
              />
            </section>
          )}

          {activeTab === "security" && (
            <section className="space-y-8 duration-300 animate-in fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                <Key size={18} className="text-blue-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
                  Credential Management
                </h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Update Password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="flex-grow px-4 py-3 text-sm font-bold border outline-none bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-xl dark:text-white"
                    />
                    <button
                      onClick={handlePasswordUpdate}
                      disabled={loading || !newPassword}
                      className="px-6 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6 border bg-amber-50 dark:bg-amber-950/20 rounded-2xl border-amber-100 dark:border-amber-900/30">
                  <div className="flex gap-3">
                    <ShieldAlert
                      size={16}
                      className="text-amber-600 shrink-0"
                    />
                    <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase leading-relaxed">
                      Security Warning: Disconnect all active sessions after
                      credential update. Password changes are permanent.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-white dark:bg-slate-900 text-blue-600 border-b-2 border-blue-600"
        : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
    }`}
  >
    {icon} {label}
  </button>
);

const SettingToggle = ({ icon, label, description, active, onClick }: any) => (
  <div className="flex items-start justify-between gap-6 group">
    <div className="flex gap-4">
      <div
        className={`p-3 rounded-2xl transition-all ${
          active
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-slate-50 dark:bg-slate-800 text-slate-400"
        }`}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
          {label}
        </h4>
        {description && (
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 italic">
            {description}
          </p>
        )}
      </div>
    </div>
    <button
      onClick={onClick}
      className={`p-1 rounded-full transition-all flex-shrink-0 active:scale-90 ${
        active ? "text-blue-600" : "text-slate-200 dark:text-slate-800"
      }`}
    >
      {active ? (
        <ToggleRight size={48} strokeWidth={1} />
      ) : (
        <ToggleLeft size={48} strokeWidth={1} />
      )}
    </button>
  </div>
);

export default SettingsTerminal;
