import React, { useState, useEffect, useRef } from "react";
import { X, Send, User, ShieldCheck, Check } from "lucide-react";
import { Profile } from "../types";
import { supabase } from "../lib/supabase";

interface ChatOverlayProps {
  recipient: Profile;
  currentUserId: string;
  onClose: () => void;
  handshakeId: string;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({
  recipient,
  currentUserId,
  onClose,
  handshakeId,
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Zero-Latency Ephemeral Channel (Broadcast only)
    const channel = supabase.channel(`p2p_${handshakeId}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on("broadcast", { event: "signal" }, ({ payload }) => {
        setMessages((prev) => [...prev, payload]);
      })
      .subscribe();

    channelRef.current = channel;
    return () => {
      channel.unsubscribe();
    };
  }, [handshakeId]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !channelRef.current) return;

    const payload = {
      sender_id: currentUserId,
      text: input,
      ts: new Date().toISOString(),
    };

    channelRef.current.send({
      type: "broadcast",
      event: "signal",
      payload,
    });

    setInput("");
  };

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-[250] flex flex-col md:w-[400px] md:h-[600px] animate-slide-up">
      <div className="flex-grow flex flex-col bg-[#080808] md:rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,1)] border border-white/10 overflow-hidden relative">
        <div className="p-4 bg-[#111] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-xl bg-slate-900">
              {recipient.avatar_url ? (
                <img
                  src={recipient.avatar_url}
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="m-2.5 text-slate-700" size={20} />
              )}
            </div>
            <div>
              <h4 className="text-[12px] font-black text-white uppercase">
                {recipient.full_name}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[7px] font-black text-[#00BFFF] uppercase tracking-widest italic leading-none">
                  P2P Ephemeral Shard
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-grow p-4 space-y-4 overflow-y-auto no-scrollbar bg-[#050505]"
        >
          <div className="py-6 text-center opacity-20">
            <ShieldCheck size={14} className="mx-auto text-[#00BFFF] mb-2" />
            <p className="text-[7px] font-black uppercase tracking-[0.3em]">
              Identity Link Verified • Zero Storage
            </p>
          </div>

          {messages.map((m, i) => {
            const isMe = m.sender_id === currentUserId;
            return (
              <div
                key={i}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-2`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-[1.5rem] ${
                    isMe
                      ? "bg-[#00BFFF] text-white rounded-br-none"
                      : "bg-white/5 text-slate-300 rounded-bl-none"
                  }`}
                >
                  <p className="text-[13px] font-medium leading-relaxed">
                    {m.text}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-40">
                    <span className="text-[7px] font-black">
                      {new Date(m.ts).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && <Check size={8} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-[#111] border-t border-white/5">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Secure Signal..."
              className="flex-grow bg-[#151515] border border-white/5 rounded-2xl py-3 px-5 text-sm text-white outline-none focus:border-[#00BFFF]/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-12 h-12 flex items-center justify-center bg-[#00BFFF] text-white rounded-2xl shadow-lg active:scale-90 transition-all disabled:opacity-20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
