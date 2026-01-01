import React, { useState, useEffect, useRef } from "react";
import { X, Send, ShieldAlert, Zap, Lock } from "lucide-react";
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
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[200] w-[calc(100%-2rem)] md:w-full md:max-w-sm">
      <div className="glass dark:bg-slate-900/95 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden flex flex-col h-[480px] md:h-[520px] animate-in slide-in-from-bottom-10 duration-500">
        {/* Header */}
        <div className="p-4 md:p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.username}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-4 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest truncate w-32 md:w-40">
                {recipient.full_name}
              </h4>
              <div className="flex items-center gap-1.5 text-[8px] font-bold text-blue-400 uppercase tracking-widest">
                <Zap size={8} fill="currentColor" /> Live Transmission
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-500/10 dark:bg-amber-900/20 px-4 py-2 border-y border-amber-500/20 flex items-center gap-2">
          <ShieldAlert
            size={10}
            className="text-amber-600 dark:text-amber-400"
          />
          <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
            P2P Broadcast: Ephemeral & Non-Persistent
          </span>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/20 custom-scrollbar"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-30">
              <Lock size={24} className="text-slate-400" />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Handshake Secured <br />
                Awaiting Data...
              </p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`relative max-w-[85%] px-4 py-2.5 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm transition-all ${
                    isMe
                      ? "bg-blue-600 text-white rounded-tr-none font-mono"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none font-mono border border-slate-100 dark:border-slate-700"
                  }`}
                >
                  <p className="mb-1">{msg.text}</p>
                  <p
                    className={`text-[7px] text-right font-black uppercase opacity-60`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2"
        >
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="TYPE INTEL..."
            className="flex-grow bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 transition-all dark:text-white"
          />
          <button
            type="submit"
            className="w-10 h-10 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-100 transition-all active:scale-90 shadow-lg"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatOverlay;
