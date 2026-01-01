import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Zap,
  Lock,
  MoreVertical,
  Phone,
  Video,
  Info,
  ChevronLeft,
  User2,
} from "lucide-react";
import { LiveMessage, Profile } from "../types";
import { supabase } from "../lib/supabase";

interface ChatOverlayProps {
  recipient: Profile;
  currentUserId: string;
  onClose: () => void;
  messages: LiveMessage[];
  onSendMessage: (text: string) => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({
  recipient,
  currentUserId,
  onClose,
  messages,
  onSendMessage,
}) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<LiveMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages]);

  useEffect(() => {
    if (!currentUserId || !recipient.id) return;

    const ids = [currentUserId, recipient.id].sort();
    const roomName = `room_${ids[0]}_${ids[1]}`;
    const channel = supabase.channel(roomName);

    channel
      .on("broadcast", { event: "message" }, (p) => {
        const msg = p.payload as LiveMessage;
        setLocalMessages((prev) =>
          prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
        );
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUserId, recipient.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 z-[200] flex flex-col md:w-96 md:h-[600px] animate-in slide-in-from-bottom-10 md:slide-in-from-right-10 duration-500">
      {/* Container - Full screen on mobile, floating box on desktop */}
      <div className="flex-grow flex flex-col bg-white dark:bg-slate-950 md:rounded-[2.5rem] shadow-2xl border-none md:border md:border-white/20 dark:md:border-slate-800 overflow-hidden h-full">
        {/* Modern Header */}
        <div className="px-4 py-3 md:px-6 md:py-4 bg-[#075e54] dark:bg-slate-900 text-white flex justify-between items-center shadow-lg relative z-10">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Back Button */}
            <button
              onClick={onClose}
              className="p-2 -ml-2 transition-colors rounded-full hover:bg-white/10"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="relative">
              <div className="overflow-hidden border rounded-full w-9 h-9 md:w-11 md:h-11 bg-white/10 border-white/20">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.username}`}
                  className="object-cover w-full h-full"
                  alt={recipient.username}
                />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#075e54] dark:border-slate-900" />
            </div>

            <div className="cursor-pointer max-w-[120px] xs:max-w-none">
              <h4 className="text-[14px] md:text-sm font-bold truncate flex items-center gap-2">
                {recipient.full_name}
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-emerald-300 font-medium">
                  Verified Online
                </p>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white/90">
                  <User2 size={8} />
                  {recipient.gender || "Node"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 opacity-80">
            <span
              title="Phase 3 Release"
              className="hidden cursor-not-allowed xs:block text-slate-400/50"
            >
              <Video size={18} />
            </span>
            <span
              title="Phase 3 Release"
              className="hidden cursor-not-allowed xs:block text-slate-400/50"
            >
              <Phone size={16} />
            </span>
            <button
              onClick={onClose}
              className="hidden p-1 transition-colors rounded-full md:block hover:bg-white/10"
            >
              <X size={20} />
            </button>
            <MoreVertical size={18} className="cursor-pointer" />
          </div>
        </div>

        {/* Encrypted Notice Banner */}
        <div className="relative z-10 flex items-center justify-center gap-2 px-4 py-2 border-b bg-slate-100/50 dark:bg-slate-900/50 border-slate-100 dark:border-white/5">
          <Lock size={10} className="text-slate-400" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
            P2P encrypted channel active
          </span>
        </div>

        {/* Dynamic Chat Surface */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 bg-[#e5ddd5] dark:bg-slate-950/50 custom-scrollbar pattern-whatsapp relative"
        >
          {localMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center opacity-40">
              <div className="p-4 border shadow-sm bg-amber-100 dark:bg-amber-900/20 rounded-2xl border-amber-200 dark:border-amber-900/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-500 max-w-[200px]">
                  Secure Handshake Established. Begin exchange.
                </p>
              </div>
            </div>
          )}
          {localMessages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-1 duration-300`}
              >
                <div
                  className={`relative max-w-[85%] px-3 py-1.5 md:px-4 md:py-2 shadow-sm ${
                    isMe ? "whatsapp-bubble-out" : "whatsapp-bubble-in"
                  }`}
                >
                  <p className="text-[14px] md:text-[15px] leading-relaxed break-words">
                    {msg.text}
                  </p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 ${
                      isMe ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-tighter">
                      {formatTime(msg.timestamp)}
                    </span>
                    {isMe && <Zap size={8} fill="currentColor" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / Input Area */}
        <form
          onSubmit={handleSend}
          className="p-3 md:p-4 bg-[#f0f2f5] dark:bg-slate-900 flex items-center gap-2 md:gap-3 relative z-10 pb-[env(safe-area-inset-bottom)] md:pb-4"
        >
          <button
            type="button"
            className="hidden p-2 transition-colors text-slate-500 hover:text-blue-600 xs:block"
          >
            <Info size={20} />
          </button>
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-white dark:bg-slate-800 border-none rounded-2xl px-4 py-3 md:py-2 text-[15px] md:text-[14px] focus:ring-2 focus:ring-blue-600 transition-all dark:text-white shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`w-12 h-12 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 flex-shrink-0 ${
              input.trim()
                ? "bg-[#00a884] text-white"
                : "bg-slate-300 dark:bg-slate-700 text-slate-400"
            }`}
          >
            <Send
              size={20}
              className="ml-1"
              fill={input.trim() ? "white" : "transparent"}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatOverlay;
