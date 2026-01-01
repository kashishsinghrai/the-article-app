import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  ShieldAlert,
  Zap,
  Lock,
  MoreVertical,
  Phone,
  Video,
  Info,
} from "lucide-react";
import { LiveMessage, Profile } from "../types";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 z-[200] flex flex-col md:w-96 md:h-[600px] animate-in slide-in-from-bottom-10 duration-500">
      <div className="flex-grow flex flex-col bg-white dark:bg-slate-950 md:rounded-[2.5rem] shadow-2xl border-none md:border md:border-white/20 dark:md:border-slate-800 overflow-hidden">
        {/* Modern WhatsApp-style Header */}
        <div className="px-4 py-3 md:px-6 md:py-4 bg-[#075e54] dark:bg-slate-900 text-white flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="md:hidden p-1 mr-1">
              <X size={20} />
            </button>
            <div className="relative">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 overflow-hidden border border-white/20">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.username}`}
                  className="w-full h-full object-cover"
                  alt={recipient.username}
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#075e54] dark:border-slate-900" />
            </div>
            <div className="cursor-pointer">
              <h4 className="text-sm font-bold truncate w-24 md:w-40">
                {recipient.full_name}
              </h4>
              <p className="text-[10px] text-emerald-300 font-medium">online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 opacity-80">
            <Video
              size={18}
              className="hidden sm:block cursor-not-allowed text-slate-400"
            />
            <Phone
              size={16}
              className="hidden sm:block cursor-not-allowed text-slate-400"
            />
            <button
              onClick={onClose}
              className="hidden md:block p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <MoreVertical size={18} className="cursor-pointer" />
          </div>
        </div>

        {/* Encrypted Notice Banner */}
        <div className="bg-slate-100/50 dark:bg-slate-900/50 px-4 py-2 flex items-center justify-center gap-2 border-b border-slate-100 dark:border-white/5">
          <Lock size={10} className="text-slate-400" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
            Messages are end-to-end encrypted
          </span>
        </div>

        {/* Dynamic Chat Surface */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-4 md:p-6 space-y-3 bg-[#e5ddd5] dark:bg-slate-950/50 custom-scrollbar pattern-whatsapp"
          style={{
            backgroundImage:
              "radial-gradient(circle, #00000005 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {messages.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-900/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-500 max-w-[200px]">
                  P2P handshake verified. Secure data transmission established.
                </p>
              </div>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-1 duration-300`}
              >
                <div
                  className={`relative max-w-[85%] px-3 py-2 shadow-sm ${
                    isMe ? "whatsapp-bubble-out" : "whatsapp-bubble-in"
                  }`}
                >
                  <p className="text-[13px] leading-relaxed break-words">
                    {msg.text}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                    <span className="text-[9px] font-medium">
                      {formatTime(msg.timestamp)}
                    </span>
                    {isMe && <Zap size={8} fill="currentColor" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modern WhatsApp-style Footer */}
        <form
          onSubmit={handleSend}
          className="p-3 md:p-4 bg-[#f0f2f5] dark:bg-slate-900 flex items-center gap-3"
        >
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-blue-600 transition-colors hidden sm:block"
          >
            <Info size={20} />
          </button>
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-white dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-[14px] focus:ring-2 focus:ring-blue-600 transition-all dark:text-white shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 ${
              input.trim()
                ? "bg-[#00a884] text-white"
                : "bg-slate-300 dark:bg-slate-700 text-slate-400"
            }`}
          >
            <Send size={18} fill={input.trim() ? "white" : "transparent"} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatOverlay;
