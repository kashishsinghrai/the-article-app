import React, { useRef } from "react";
import {
  Shield,
  Fingerprint,
  Globe,
  Download,
  CheckCircle2,
} from "lucide-react";
import { Profile } from "../types";
import html2canvas from "html2canvas";

interface IDCardProps {
  profile: Profile;
}

const IDCard: React.FC<IDCardProps> = ({ profile }) => {
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
        x: -4, // Larger safety offset
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
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-8 px-4 overflow-visible">
      {/* Container that ensures scaling on mobile */}
      <div className="flex justify-center w-full p-4 overflow-visible bg-transparent">
        <div
          ref={cardRef}
          className="relative w-full max-w-[340px] md:max-w-[360px] aspect-[1.6/1] bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col p-6 md:p-8 select-none transition-transform active:scale-[0.98]"
        >
          {/* Security Watermark */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden text-[7px] font-black uppercase rotate-[-12deg] leading-none whitespace-pre italic">
            {Array(40).fill("VERIFIED PRESS PASS NETWORK NODE ").join("\n")}
          </div>

          <div className="relative z-10 flex items-start justify-between mb-4 md:mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-blue-600" />
                <p className="text-[8px] md:text-[9px] font-bold text-slate-400 tracking-[0.25em] uppercase">
                  Operations Node
                </p>
              </div>
              <h2 className="text-lg italic font-black leading-none tracking-tighter uppercase md:text-xl text-slate-950 dark:text-white">
                ThE-ARTICLES
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                Serial Index
              </p>
              <p className="text-[10px] md:text-[12px] font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {profile.serial_id?.split("-")[1] || "00000"}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center flex-grow gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.2rem] md:rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
              <Fingerprint size={28} className="text-slate-200" />
            </div>

            <div className="flex-grow space-y-2 overflow-hidden md:space-y-3">
              <div className="space-y-0.5">
                <p className="text-[7px] md:text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                  Operator Name
                </p>
                <p className="text-[14px] md:text-[16px] font-black text-slate-950 dark:text-white uppercase truncate tracking-tight">
                  {profile.full_name || "PENDING IDENTITY"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 md:gap-4">
                <div className="space-y-0.5">
                  <p className="text-[7px] md:text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                    UID
                  </p>
                  <p className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 italic tracking-tighter">
                    {profile.serial_id}
                  </p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[7px] md:text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                    Status
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <p className="text-[8px] md:text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">
                      Live
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-end justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-600">
                <Globe size={10} />
                <span className="text-[7px] font-black uppercase tracking-[0.2em]">
                  Verified Correspondent
                </span>
              </div>
              <p className="text-[6px] font-medium text-slate-300 uppercase truncate max-w-[120px]">
                Hash: {profile.id?.substring(0, 16)}
              </p>
            </div>
            <img
              src={qrUrl}
              alt="QR"
              className="w-8 h-8 rounded-md md:w-10 md:h-10 opacity-60 dark:invert"
            />
          </div>
        </div>
      </div>

      <button
        onClick={downloadPass}
        className="flex items-center gap-3 px-8 md:px-10 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
      >
        <Download size={16} /> Export Digital Pass
      </button>
    </div>
  );
};

export default IDCard;
