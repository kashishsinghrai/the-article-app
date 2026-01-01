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
        x: -2,
        y: -2,
        width: cardRef.current.offsetWidth + 4,
        height: cardRef.current.offsetHeight + 4,
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
    <div className="flex flex-col items-center w-full max-w-full gap-8 overflow-visible">
      <div className="flex justify-center w-full p-4 overflow-visible bg-transparent">
        <div
          ref={cardRef}
          className="relative w-full max-w-[360px] aspect-[1.6/1] bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col p-8 select-none transition-transform hover:scale-[1.02]"
        >
          {/* Security Watermark */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden text-[7px] font-black uppercase rotate-[-12deg] leading-none whitespace-pre italic">
            {Array(40).fill("VERIFIED PRESS PASS NETWORK NODE ").join("\n")}
          </div>

          <div className="relative z-10 flex items-start justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-blue-600" />
                <p className="text-[9px] font-bold text-slate-400 tracking-[0.25em] uppercase">
                  Operations Node
                </p>
              </div>
              <h2 className="text-xl italic font-black leading-none tracking-tighter uppercase text-slate-950 dark:text-white">
                ThE-ARTICLES
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                Serial Index
              </p>
              <p className="text-[12px] font-black text-slate-950 dark:text-white uppercase tracking-tight">
                {profile.serial_id?.split("-")[1] || "00000"}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center flex-grow gap-6">
            <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
              <Fingerprint size={32} className="text-slate-200" />
            </div>

            <div className="flex-grow space-y-3 overflow-hidden">
              <div className="space-y-0.5">
                <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                  Operator Name
                </p>
                <p className="text-[16px] font-black text-slate-950 dark:text-white uppercase truncate tracking-tight">
                  {profile.full_name || "PENDING IDENTITY"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                    UID
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 italic tracking-tighter">
                    {profile.serial_id}
                  </p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                    Status
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">
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
              <p className="text-[6px] font-medium text-slate-300 uppercase">
                Hash: {profile.id?.substring(0, 16)}
              </p>
            </div>
            <img
              src={qrUrl}
              alt="QR"
              className="w-10 h-10 rounded-md opacity-60 dark:invert"
            />
          </div>
        </div>
      </div>

      <button
        onClick={downloadPass}
        className="flex items-center gap-3 px-10 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
      >
        <Download size={16} /> Export High-Res Pass
      </button>
    </div>
  );
};

export default IDCard;
