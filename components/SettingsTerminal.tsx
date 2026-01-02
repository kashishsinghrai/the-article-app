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
  const [activeTab, setActiveTab] = useState<
    "privacy" | "hardware" | "network"
  >("privacy");

  const toggleSetting = async (key: keyof UserSettings) => {
    const newVal = !settings[key];

    // Physical Permission Requests
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

  return (
    <div className="space-y-8 duration-500 animate-in slide-in-from-right-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Tabs */}
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
            active={activeTab === "network"}
            onClick={() => setActiveTab("network")}
            label="System"
            icon={<Cpu size={12} />}
          />
        </div>

        <div className="p-8 space-y-12 md:p-12">
          {activeTab === "privacy" && (
            <section className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                <ShieldAlert size={18} className="text-blue-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
                  Security Thresholds
                </h3>
              </div>

              <SettingToggle
                icon={<EyeOff size={18} />}
                label="Stealth Mode (Private Profile)"
                description="Disable public discovery. Only linked nodes can view your credentials."
                active={isPrivate}
                onClick={() => onTogglePrivate(!isPrivate)}
              />

              <SettingToggle
                icon={<Globe size={18} />}
                label="Real-time Presence"
                description="Broadcast active status to the global registry."
                active={settings.presence_visible}
                onClick={() => toggleSetting("presence_visible")}
              />
            </section>
          )}

          {activeTab === "hardware" && (
            <section className="space-y-8 duration-300 animate-in fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                {/* Fixed missing Zap icon import from lucide-react */}
                <Zap size={18} className="text-blue-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
                  Hardware Authorization
                </h3>
              </div>

              <SettingToggle
                icon={<Camera size={18} />}
                label="Camera Control"
                description="Enable for live visual reporting and press ID verification."
                active={settings.camera_access}
                onClick={() => toggleSetting("camera_access")}
              />

              <SettingToggle
                icon={<Mic size={18} />}
                label="Microphone Interface"
                description="Required for secure voice memos and field audio capture."
                active={settings.mic_access}
                onClick={() => toggleSetting("mic_access")}
              />

              <SettingToggle
                icon={<MapPin size={18} />}
                label="Geolocation Beacon"
                description="Tag your reports with precise regional metadata."
                active={settings.location_access}
                onClick={() => toggleSetting("location_access")}
              />
            </section>
          )}

          {activeTab === "network" && (
            <section className="space-y-8 duration-300 animate-in fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                <Database size={18} className="text-blue-600" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
                  Data Sovereignty
                </h3>
              </div>

              <SettingToggle
                icon={<HardDrive size={18} />}
                label="Local Storage Cache"
                description="Enable high-speed caching of network assets for offline reporting."
                active={settings.storage_access}
                onClick={() => toggleSetting("storage_access")}
              />

              <SettingToggle
                icon={<UsersIcon size={18} />}
                label="Contact Pulse Sync"
                description="Discover known colleagues on the network via secure contact hashing."
                active={settings.contacts_sync}
                onClick={() => toggleSetting("contacts_sync")}
              />

              <SettingToggle
                icon={<Cpu size={18} />}
                label="AI Analysis Engine"
                description="Allow Gemini Pro to pre-process incoming intelligence for your briefing."
                active={settings.ai_briefings}
                onClick={() => toggleSetting("ai_briefings")}
              />
            </section>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Node Compliance: Active
              </span>
            </div>
            <p className="text-[9px] font-mono text-slate-500">
              REV: 1.2.5-STABLE
            </p>
          </div>
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
