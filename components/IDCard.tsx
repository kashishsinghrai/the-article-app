import React, { useRef } from "react";
import { Shield, Fingerprint, Globe, Download } from "lucide-react";
import { Profile } from "../types";
import html2canvas from "html2canvas";
// Fix: Added missing import for toast
import { toast } from "react-hot-toast";

interface IDCardProps {
  profile: Profile;
  isOwn?: boolean;
}

const IDCard: React.FC<IDCardProps> = ({ profile, isOwn = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://the-articles.network/verify/${profile.serial_id}&bgcolor=ffffff&color=000000`;

  const downloadPass = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        x: -4,
        y: -4,
        width: cardRef.current.offsetWidth + 8,
        height: cardRef.current.offsetHeight + 8,
      });
      const link = document.createElement("a");
      link.download = `PRESS_PASS_${profile.serial_id}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (e) {
      console.error("Export failed", e);
      toast.error("Handshake failed. Visual export interrupted.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-6 overflow-visible">
      <div className="flex justify-center w-full overflow-visible bg-transparent">
        <div
          ref={cardRef}
          className="relative w-full max-w-[360px] aspect-[1.6/1] bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col p-6 md:p-7 select-none"
        >
          {/* Security Layer */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden text-[6px] font-black uppercase rotate-[-12deg] leading-none whitespace-pre italic">
            {Array(50).fill("VERIFIED PRESS PASS NETWORK NODE ").join("\n")}
          </div>

          <div className="relative z-10 flex items-start justify-between mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield size={12} className="text-blue-600" />
                <p className="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                  Operations Node
                </p>
              </div>
              <h2 className="text-base italic font-black leading-none tracking-tighter uppercase text-slate-950 dark:text-white">
                ThE-ARTICLES
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                Serial Index
              </p>
              <p className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {profile.serial_id?.split("-")[1] || "00000"}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center flex-grow gap-4">
            <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 overflow-hidden border shadow-inner rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-white/5">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  className="object-cover w-full h-full"
                  alt="Profile"
                />
              ) : (
                <Fingerprint
                  size={24}
                  className="text-slate-300 dark:text-slate-600"
                />
              )}
            </div>
            <div className="flex-grow space-y-2 overflow-hidden">
              <div className="space-y-0.5">
                <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">
                  Node Operator
                </p>
                <p className="text-[14px] font-black text-slate-950 dark:text-white uppercase truncate tracking-tight">
                  {profile.full_name || "PENDING IDENTITY"}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">
                    Hash ID
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 italic tracking-tighter">
                    {profile.serial_id}
                  </p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">
                    Status
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">
                      Live
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-end justify-between pt-3 mt-4 border-t border-slate-100 dark:border-white/5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-600">
                <Globe size={10} />
                <span className="text-[7px] font-black uppercase tracking-[0.2em]">
                  Verified Correspondent
                </span>
              </div>
              <p className="text-[6px] font-medium text-slate-300 dark:text-slate-600 uppercase truncate max-w-[100px]">
                Root: {profile.id?.substring(0, 12)}
              </p>
            </div>
            <img
              src={qrUrl}
              alt="QR"
              className="w-8 h-8 rounded-md opacity-40 dark:invert"
            />
          </div>
        </div>
      </div>

      {isOwn && (
        <button
          onClick={downloadPass}
          className="flex items-center gap-3 px-8 py-3.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <Download size={14} /> Export Digital Pass
        </button>
      )}
    </div>
  );
};

export default IDCard;
