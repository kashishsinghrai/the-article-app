import React, { useRef } from "react";
import { Shield, Fingerprint, Globe, Download } from "lucide-react";
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
    const canvas = await html2canvas(cardRef.current, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `PRESS_PASS_${profile.serial_id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={cardRef}
        className="relative w-[340px] aspect-[1.6/1] bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col p-6 transition-all group select-none"
      >
        {/* Anti-Counterfeit Background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none overflow-hidden text-[6px] font-black uppercase rotate-[-15deg] leading-none whitespace-pre">
          {Array(50)
            .fill("THE ARTICLES PRESS PASS VERIFIED IDENTITY ")
            .join("\n")}
        </div>

        {/* Minimal Header */}
        <div className="relative z-10 flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-blue-600" />
              <p className="text-[8px] font-black text-slate-400 tracking-[0.2em] uppercase">
                Global Correspondent
              </p>
            </div>
            <h2 className="text-base italic font-black leading-none tracking-tighter uppercase text-slate-950 dark:text-white">
              ThE-ARTICLES
            </h2>
          </div>
          <div className="bg-slate-950 dark:bg-white px-2 py-0.5 rounded-sm">
            <span className="text-[7px] font-black uppercase tracking-widest text-white dark:text-slate-950">
              ID# {profile.serial_id?.split("-")[1]}
            </span>
          </div>
        </div>

        {/* Identity Section */}
        <div className="relative z-10 flex items-center flex-grow gap-4">
          <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 border shadow-inner rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700">
            <Fingerprint
              size={28}
              className="transition-all duration-500 text-slate-200 group-hover:text-blue-600"
            />
          </div>

          <div className="flex-grow space-y-2.5 overflow-hidden">
            <div className="space-y-0.5">
              <p className="text-[7px] text-slate-300 font-bold uppercase tracking-widest">
                Operator Name
              </p>
              <p className="text-[13px] font-black text-slate-900 dark:text-white uppercase truncate tracking-tight">
                {profile.full_name || "PENDING"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[7px] text-slate-300 font-bold uppercase tracking-widest">
                  Serial ID
                </p>
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-300 italic tracking-tighter">
                  {profile.serial_id}
                </p>
              </div>
              <div>
                <p className="text-[7px] text-slate-300 font-bold uppercase tracking-widest">
                  Status
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[8px] font-black text-emerald-500 tracking-widest uppercase italic">
                    Verified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-end justify-between pt-4 mt-4 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-600">
            <Globe size={10} />
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">
              P2P Justice Network
            </span>
          </div>
          <img
            src={qrUrl}
            alt="QR"
            className="w-8 h-8 opacity-40 dark:invert"
          />
        </div>
      </div>

      <button
        onClick={downloadPass}
        className="flex items-center gap-2 px-8 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
      >
        <Download size={14} /> Download Press Pass
      </button>
    </div>
  );
};

export default IDCard;
