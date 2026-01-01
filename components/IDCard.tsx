import React from "react";
import { Shield, Fingerprint, Globe, QrCode } from "lucide-react";
import { Profile } from "../types";

interface IDCardProps {
  profile: Profile;
}

const IDCard: React.FC<IDCardProps> = ({ profile }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://the-articles.network/verify/${profile.serial_id}&bgcolor=ffffff&color=000000`;

  return (
    <div className="flex justify-center w-full py-4">
      <div className="relative w-full max-w-[320px] aspect-[1.6/1] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col p-6 transition-all group select-none">
        {/* Minimal Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-slate-900 dark:text-white" />
              <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                Press Pass
              </p>
            </div>
            <h2 className="text-lg font-black leading-none tracking-tighter uppercase text-slate-950 dark:text-white">
              The Articles
            </h2>
          </div>
          <div className="px-2 py-1 rounded-md bg-slate-950 dark:bg-white">
            <span className="text-[7px] font-bold uppercase tracking-widest text-white dark:text-slate-950">
              Verified
            </span>
          </div>
        </div>

        {/* Identity Section */}
        <div className="flex items-center flex-grow gap-4">
          <div className="flex items-center justify-center flex-shrink-0 border w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700">
            <Fingerprint
              size={24}
              className="transition-all text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
            />
          </div>

          <div className="flex-grow space-y-2 overflow-hidden">
            <div className="space-y-0.5">
              <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">
                Name
              </p>
              <p className="text-sm font-bold uppercase truncate text-slate-900 dark:text-white">
                {profile.full_name || "PENDING"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">
                  Serial
                </p>
                <p className="text-[9px] font-bold text-slate-600 dark:text-slate-300 italic tracking-tighter">
                  {profile.serial_id}
                </p>
              </div>
              <div>
                <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">
                  Node
                </p>
                <p className="text-[9px] font-bold text-emerald-500 tracking-widest">
                  ACTIVE
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between pt-4 mt-4 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-300 dark:text-slate-600">
            <Globe size={10} />
            <span className="text-[7px] font-bold uppercase tracking-widest">
              Global Ops Network
            </span>
          </div>
          <img
            src={qrUrl}
            alt="QR"
            className="w-8 h-8 transition-opacity opacity-50 dark:invert group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
};

export default IDCard;
