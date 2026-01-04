import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  ChevronLeft,
  ShieldCheck,
  User,
  Globe,
  Radio,
} from "lucide-react";
import { LiveMessage, Profile } from "../types";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

interface ChatOverlayProps {
  recipient: Profile;
  currentUserId: string;
  onClose: () => void;
  handshakeId: string;
  isAdminMode?: boolean;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({
  recipient,
  currentUserId,
  onClose,
  handshakeId,
  isAdminMode = false,
}) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Join an ephemeral broadcast channel unique to this handshake
    const channel = supabase.channel(`live_signal_${handshakeId}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on("broadcast", { event: "message" }, ({ payload }) => {
        setLocalMessages((prev) => [...prev, payload]);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          if (!isAdminMode) {
            toast.success("Secure Broadcast Line Active", { icon: "📡" });
          }
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [handshakeId, isAdminMode]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [localMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAdminMode) return;

    const msgPayload = {
      sender_id: currentUserId,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // Broadcast the message without saving to Postgres
    channelRef.current.send({
      type: "broadcast",
      event: "message",
      payload: msgPayload,
    });

    setInput("");
  };

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 z-[200] flex flex-col md:w-[400px] md:h-[600px] animate-in slide-in-from-bottom-10">
      <div className="flex-grow flex flex-col bg-white dark:bg-slate-950 md:rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-5 text-white ${
            isAdminMode ? "bg-red-900" : "bg-slate-900"
          } border-b border-white/5`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 overflow-hidden border-2 rounded-2xl bg-slate-800 border-white/10">
                {recipient.avatar_url ? (
                  <img
                    src={recipient.avatar_url}
                    className="object-cover w-full h-full"
                    alt="Avatar"
                  />
                ) : (
                  <User className="m-3 text-slate-500" />
                )}
              </div>
              <div className="absolute w-4 h-4 border-2 rounded-full -bottom-1 -right-1 bg-emerald-500 border-slate-900" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase truncate">
                {isAdminMode
                  ? `INTERCEPT: ${recipient.full_name}`
                  : recipient.full_name}
              </h4>
              <p className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">
                {isAdminMode ? "Surveillance Active" : "Ephemeral Live Line"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-colors hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-grow p-6 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 custom-scrollbar"
        >
          <div className="flex flex-col items-center justify-center mb-6 opacity-40">
            <Radio size={16} className="mb-2 text-blue-600 animate-pulse" />
            <span className="px-4 py-1 rounded-full text-[7px] font-black uppercase text-slate-500 tracking-widest text-center">
              Signals are not recorded.
              <br />
              Memory purge on disconnect.
            </span>
          </div>

          {localMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender_id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                  msg.sender_id === currentUserId
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-800 dark:text-slate-100 rounded-tl-none border border-white/5"
                }`}
              >
                {msg.text}
                <div className="text-[7px] mt-2 opacity-50 uppercase font-black text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input (Disabled for Admin) */}
        {!isAdminMode && (
          <form
            onSubmit={handleSend}
            className="p-5 bg-white border-t dark:bg-slate-900 border-white/5"
          >
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type ephemeral message..."
                className="flex-grow px-6 py-3.5 text-sm font-bold outline-none bg-slate-100 dark:bg-slate-800 rounded-2xl dark:text-white border border-transparent focus:border-blue-600/50 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex items-center justify-center text-white transition-all bg-blue-600 shadow-xl w-14 h-14 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatOverlay;
