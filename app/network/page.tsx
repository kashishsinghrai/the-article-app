import React, { useState, useMemo } from "react";
import {
  Globe,
  Users,
  Zap,
  Search,
  MessageSquare,
  ShieldCheck,
  Fingerprint,
  Network as NetworkIcon,
  ArrowLeft,
} from "lucide-react";
import { Profile } from "../../types";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

interface NetworkPageProps {
  users: Profile[];
  currentUserId?: string;
  onViewProfile: (user: Profile) => void;
  onChat: (user: Profile) => void;
  onBack: () => void;
  currentUserProfile?: Profile | null;
}

const NetworkPage: React.FC<NetworkPageProps> = ({
  users,
  currentUserId,
  onViewProfile,
  onChat,
  onBack,
  currentUserProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const canSeeAdmin = currentUser?.role === "admin";
      const isVisibleByRole = canSeeAdmin || u.role !== "admin";

      const matchesSearch =
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.serial_id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch && isVisibleByRole;
    });
  }, [users, searchTerm, currentUser]);

  const initiateHandshake = async (targetUser: Profile) => {
    if (!currentUserProfile) {
      toast.error("Establish identity first.");
      return;
    }

    toast.loading(`Requesting Link with ${targetUser.full_name}...`, {
      id: "handshake",
    });

    const payload = {
      id: Math.random().toString(36).substr(2, 9),
      fromId: currentUserProfile.id,
      fromName: currentUserProfile.full_name,
      toId: targetUser.id,
      timestamp: Date.now(),
    };

    const channel = supabase.channel(`inbox_${targetUser.id}`);
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.send({
          type: "broadcast",
          event: "handshake",
          payload: payload,
        });
        toast.success("Request Broadcasted.", { id: "handshake" });
      }
    });
  };

  return (
    <main className="max-w-6xl px-6 py-16 mx-auto space-y-12 md:py-32">
      <section className="space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold uppercase text-[10px] tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-black leading-none tracking-tighter uppercase md:text-7xl text-slate-900 dark:text-white">
              Network
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Registry of Verified Correspondents
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Active Members
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {filteredUsers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 px-6 py-4 border bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Locate members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm font-bold bg-transparent border-none outline-none focus:ring-0 text-slate-900 dark:text-white"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.length === 0 ? (
          <div className="py-24 text-center col-span-full opacity-30">
            <p className="text-xl font-black tracking-widest uppercase text-slate-400">
              Searching Registry...
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group bg-white dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-all flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center justify-center w-12 h-12 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800">
                    <Fingerprint size={24} />
                  </div>
                  {user.is_online && (
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase truncate text-slate-900 dark:text-white">
                    {user.full_name} {user.id === currentUserId && "(You)"}
                  </h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {user.serial_id}
                  </p>
                </div>

                <p className="h-8 text-xs italic font-medium leading-relaxed text-slate-500 line-clamp-2">
                  "{user.bio}"
                </p>
              </div>

              <div className="flex gap-2 pt-6 mt-8 border-t border-slate-50 dark:border-white/5">
                <button
                  onClick={() => onViewProfile(user)}
                  className="flex-1 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-slate-100 transition-all"
                >
                  Profile
                </button>
                <button
                  onClick={() => initiateHandshake(user)}
                  disabled={user.id === currentUserId}
                  className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white disabled:opacity-20 transition-all flex items-center justify-center gap-2"
                >
                  Request Talk
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default NetworkPage;
