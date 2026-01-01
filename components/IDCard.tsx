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
      // Ensure all images (QR) are loaded before capturing
      const canvas = await html2canvas(cardRef.current, {
        scale: 4, // Ultra-high resolution
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Force visibility of elements in the clone
          const el = clonedDoc.getElementById("downloadable-card");
          if (el) el.style.opacity = "1";
        },
      });
      const link = document.createElement("a");
      link.download = `THE_ARTICLES_PASS_${profile.serial_id}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div
        ref={cardRef}
        id="downloadable-card"
        className="relative w-[360px] aspect-[1.6/1] bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col p-8 transition-all group select-none"
      >
        {/* Security Watermark Overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden text-[7px] font-black uppercase rotate-[-12deg] leading-none whitespace-pre italic">
          {Array(40).fill("VERIFIED PRESS PASS NETWORK NODE ").join("\n")}
        </div>

        {/* Minimal Header */}
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-blue-600" />
              <p className="text-[9px] font-black text-slate-400 tracking-[0.25em] uppercase">
                Operations Node
              </p>
            </div>
            <h2 className="text-xl italic font-black leading-none tracking-tighter uppercase text-slate-950 dark:text-white">
              ThE-ARTICLES
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Digital Serial
            </p>
            <p className="text-[12px] font-black text-slate-950 dark:text-white uppercase">
              ID: {profile.serial_id?.split("-")[1] || "00000"}
            </p>
          </div>
        </div>

        {/* Identity Body */}
        <div className="relative z-10 flex items-center flex-grow gap-6">
          <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
            <Fingerprint
              size={32}
              className="transition-all duration-700 text-slate-200 group-hover:text-blue-600"
            />
          </div>

          <div className="flex-grow space-y-3 overflow-hidden">
            <div className="space-y-0.5">
              <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                Full Name
              </p>
              <p className="text-[15px] font-black text-slate-950 dark:text-white uppercase truncate tracking-tight">
                {profile.full_name || "PENDING IDENTITY"}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                  Network UID
                </p>
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 italic tracking-tighter">
                  {profile.serial_id}
                </p>
              </div>
              <div className="space-y-0.5 text-right">
                <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                  Status
                </p>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">
                    Live
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Footer */}
        <div className="relative z-10 flex items-end justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-600">
              <Globe size={10} />
              <span className="text-[7px] font-black uppercase tracking-[0.2em]">
                Verified Correspondent Platform
              </span>
            </div>
            <p className="text-[6px] font-medium text-slate-300 uppercase">
              Hash: {profile.id?.substring(0, 16)}...
            </p>
          </div>
          <img
            src={qrUrl}
            alt="QR"
            className="w-10 h-10 opacity-60 dark:invert rounded-md border border-slate-50 dark:border-slate-800 p-0.5"
          />
        </div>
      </div>

      <button
        onClick={downloadPass}
        className="flex items-center gap-3 px-10 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl border border-white/10"
      >
        <Download size={16} /> Export Digital Pass (PNG)
      </button>
    </div>
  );
};

export default IDCard;
