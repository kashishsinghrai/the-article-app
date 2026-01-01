import React from "react";
import { Shield, Fingerprint, Globe, ShieldCheck, QrCode } from "lucide-react";
import { Profile } from "../types";

interface IDCardProps {
  profile: Profile;
}

const IDCard: React.FC<IDCardProps> = ({ profile }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://the-articles.network/verify/${profile.serial_id}&bgcolor=ffffff&color=0f172a`;

  return (
    <div className="w-full flex justify-center overflow-hidden">
      {/* Container with responsive scaling for very small devices */}
      <div
        id="press-pass-capture-area"
        className="relative w-full max-w-[340px] xs:max-w-md aspect-[1.58/1] bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 flex flex-col p-5 md:p-8 transition-all group select-none origin-top transform-gpu scale-95 xs:scale-100"
      >
        {/* Network Stripes */}
        <div className="absolute top-0 left-0 w-full h-1 flex">
          <div className="h-full w-1/3 bg-orange-500" />
          <div className="h-full w-1/3 bg-white" />
          <div className="h-full w-1/3 bg-green-600" />
        </div>

        {/* Background Watermark */}
        <div className="absolute inset-0 india-watermark pointer-events-none opacity-[0.03]" />

        {/* Card Header */}
        <div className="flex justify-between items-start mb-4 md:mb-6 relative z-10">
          <div className="space-y-0.5 md:space-y-1">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Shield size={14} className="text-blue-600" />
              <p className="text-[8px] md:text-[10px] font-black text-blue-600 tracking-[0.3em] md:tracking-[0.4em] uppercase">
                ThE-ARTICLES
              </p>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">
              PRESS <br /> CREDENTIAL
            </h2>
            <p className="text-[6px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">
              AUTHORISED CORRESPONDENT
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-slate-900 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl shadow-lg mb-1 inline-flex items-center gap-1.5 md:gap-2">
              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest">
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="flex gap-4 md:gap-8 items-center flex-grow relative z-10">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-slate-50 border-2 border-slate-100 flex flex-col items-center justify-center relative overflow-hidden transition-all group-hover:border-blue-400">
            <Fingerprint
              size={32}
              className="text-slate-200 group-hover:text-blue-600 transition-all md:size-11"
            />
            <div className="absolute bottom-0 w-full bg-slate-900/5 text-[5px] md:text-[6px] font-black text-slate-400 text-center py-0.5 md:py-1 tracking-tighter uppercase">
              MEMBER ID
            </div>
          </div>

          <div className="flex-grow space-y-2 md:space-y-4">
            <div className="space-y-0.5">
              <p className="text-[7px] md:text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5 md:mb-1">
                NAME
              </p>
              <p className="text-sm md:text-xl font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px] md:max-w-[180px]">
                {profile.full_name || "PENDING"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div>
                <p className="text-[7px] md:text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5 md:mb-1">
                  SERIAL ID
                </p>
                <p className="text-[9px] md:text-[11px] font-black text-blue-600 italic tracking-tighter">
                  {profile.serial_id}
                </p>
              </div>
              <div>
                <p className="text-[7px] md:text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5 md:mb-1">
                  STATUS
                </p>
                <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 inline-flex">
                  <span className="text-[7px] md:text-[9px] font-black uppercase text-emerald-600 tracking-widest">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 md:mt-6 pt-3 md:pt-5 border-t border-slate-100 flex justify-between items-end relative z-10">
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center gap-1.5 md:gap-2 text-slate-400">
              <Globe size={10} className="md:size-3" />
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-400">
                GLOBAL NETWORK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="p-1 bg-white border border-slate-100 rounded-lg md:rounded-xl shadow-sm">
              <img
                src={qrUrl}
                alt="Verification QR"
                className="w-10 h-10 md:w-14 md:h-14 grayscale opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCard;
