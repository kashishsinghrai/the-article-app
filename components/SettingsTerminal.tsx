import React from "react";
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
} from "lucide-react";
import { UserSettings } from "../types";
import { toast } from "react-hot-toast";

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
  const toggleSetting = (key: keyof UserSettings) => {
    const newVal = !settings[key];
    onUpdate({ ...settings, [key]: newVal });

    if (key === "notifications_enabled" && newVal) {
      if ("Notification" in window) {
        Notification.requestPermission();
      }
    }

    toast.success(`Protocol ${key.replace("_", " ").toUpperCase()} updated`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-12">
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
            <Lock size={18} className="text-blue-600" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
              Privacy Protocols
            </h3>
          </div>

          <SettingToggle
            icon={<EyeOff size={18} />}
            label="Stealth Mode (Private Profile)"
            description="Hide your bio and identity from users who are not linked."
            active={isPrivate}
            onClick={() => {
              onTogglePrivate(!isPrivate);
              toast.success(
                `Profile set to ${!isPrivate ? "PRIVATE" : "PUBLIC"}`
              );
            }}
          />

          <SettingToggle
            icon={<Globe size={18} />}
            label="Real-time Presence"
            description="Allow other correspondents to see when you are active on the terminal."
            active={settings.presence_visible}
            onClick={() => toggleSetting("presence_visible")}
          />
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
            <Bell size={18} className="text-blue-600" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
              Network Communication
            </h3>
          </div>

          <SettingToggle
            icon={<Fingerprint size={18} />}
            label="Signal Notifications"
            description="Receive browser notifications for new messages and connection signals."
            active={settings.notifications_enabled}
            onClick={() => toggleSetting("notifications_enabled")}
          />

          <SettingToggle
            icon={<Cpu size={18} />}
            label="AI Intelligence Briefings"
            description="Automated AI reports on trending global news cycles delivered to your terminal."
            active={settings.ai_briefings}
            onClick={() => toggleSetting("ai_briefings")}
          />
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
            <Database size={18} className="text-blue-600" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
              Data Management
            </h3>
          </div>

          <SettingToggle
            icon={<Shield size={18} />}
            label="Secure Session Mode"
            description="Enhanced encryption for all outgoing transmissions and handshakes."
            active={settings.secure_mode}
            onClick={() => toggleSetting("secure_mode")}
          />

          <SettingToggle
            icon={<Database size={18} />}
            label="Operational Data Sharing"
            description="Share anonymous usage patterns to improve global network stability."
            active={settings.data_sharing}
            onClick={() => toggleSetting("data_sharing")}
          />
        </section>

        <div className="pt-6 border-t border-slate-50 dark:border-white/5 flex items-center gap-4 text-slate-400">
          <Shield size={16} className="text-emerald-500" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Protocol Version: 1.1.0-STABLE
          </span>
        </div>
      </div>
    </div>
  );
};

const SettingToggle = ({ icon, label, description, active, onClick }: any) => (
  <div className="flex items-start justify-between gap-6 group">
    <div className="flex gap-4">
      <div
        className={`p-3 rounded-2xl transition-all ${
          active
            ? "bg-blue-600 text-white"
            : "bg-slate-50 dark:bg-slate-800 text-slate-400"
        }`}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
          {label}
        </h4>
        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm italic">
          {description}
        </p>
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
