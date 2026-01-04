import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  User,
  Radio,
  ShieldCheck,
  Paperclip,
  Mic,
  Video,
  Phone,
  Check,
  Image as ImageIcon,
  FileText,
  Camera,
} from "lucide-react";
import { Profile } from "../types";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

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
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const channel = supabase.channel(`chat_${handshakeId}`, {
      config: { broadcast: { self: true } },
    });
    channel
      .on("broadcast", { event: "msg" }, ({ payload }) => {
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

  useEffect(() => {
    let interval: any;
    if (isCalling) {
      interval = setInterval(() => setCallTimer((prev) => prev + 1), 1000);
      startCamera();
    } else {
      setCallTimer(0);
      stopCamera();
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("Camera access denied.");
      setIsCalling(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = (text: string, type: "text" | "file" = "text") => {
    if (!text.trim()) return;
    const payload = {
      sender_id: currentUserId,
      text,
      type,
      ts: new Date().toISOString(),
    };
    channelRef.current.send({ type: "broadcast", event: "msg", payload });
    setInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSend(`Asset Uploaded: ${file.name}`, "file");
      toast.success("File sent to recipient's local archive.");
    }
  };

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-[250] flex flex-col md:w-[440px] md:h-[680px] animate-slide-up">
      <div className="flex-grow flex flex-col bg-[#0a0a0a] md:rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,1)] border border-white/10 overflow-hidden relative">
        {/* Call UI Layer */}
        {isCalling && (
          <div className="absolute inset-0 z-[100] bg-[#0a0a0a] flex flex-col animate-in fade-in duration-300">
            <div className="relative flex-grow">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="object-cover w-full h-full opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80" />

              <div className="absolute left-0 right-0 flex flex-col items-center space-y-4 top-12">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-[#00BFFF]/30 shadow-2xl">
                  {recipient.avatar_url ? (
                    <img
                      src={recipient.avatar_url}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User size={40} className="m-auto mt-8 text-slate-700" />
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-black tracking-tighter text-white uppercase">
                    {recipient.full_name}
                  </h2>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center justify-center gap-2 mt-2">
                    <Radio size={10} className="animate-pulse" />{" "}
                    {formatTime(callTimer)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-6 p-12">
              <button
                onClick={() => setIsCalling(false)}
                className="flex items-center justify-center w-16 h-16 text-white transition-all bg-red-600 rounded-full shadow-xl active:scale-90"
              >
                <X size={28} />
              </button>
              <div className="flex items-center justify-center w-16 h-16 text-white border rounded-full bg-white/5 border-white/10">
                <Mic size={24} />
              </div>
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-[#00BFFF]">
                <Camera size={24} />
              </div>
            </div>
          </div>
        )}

        {/* Messenger Header */}
        <div className="p-4 bg-[#111] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden border rounded-xl border-white/10">
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
              <h4 className="text-[13px] font-bold text-white leading-none">
                {recipient.full_name}
              </h4>
              <p className="text-[8px] font-black text-[#00BFFF] uppercase mt-1 tracking-widest italic">
                Encrypted Session
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCalling(true)}
              className="p-2 text-slate-400 hover:text-[#00BFFF]"
            >
              <Video size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-[#00BFFF]">
              <Phone size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div
          ref={scrollRef}
          className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar bg-[#080808]"
        >
          <div className="py-6 text-center opacity-20">
            <ShieldCheck size={16} className="mx-auto text-[#00BFFF] mb-2" />
            <p className="text-[7px] font-black uppercase tracking-[0.3em]">
              Hardware Signal Cryptography Enabled
            </p>
          </div>

          {messages.map((m, i) => {
            const isMe = m.sender_id === currentUserId;
            return (
              <div
                key={i}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 shadow-xl ${
                    isMe ? "chat-bubble-sent" : "chat-bubble-rec"
                  }`}
                >
                  {m.type === "file" ? (
                    <div className="flex items-center gap-3 p-2 border rounded bg-black/30 border-white/5">
                      <FileText size={16} className="text-[#00BFFF]" />
                      <span className="text-[11px] font-bold italic truncate">
                        {m.text}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[13px] font-medium leading-relaxed">
                      {m.text}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-3 mt-2 opacity-30">
                    <span className="text-[7px] font-black uppercase">
                      {new Date(m.ts).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && <Check size={8} className="text-[#00BFFF]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Dock */}
        <div className="p-4 bg-[#111] border-t border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-500 hover:text-[#00BFFF] transition-colors"
            >
              <Paperclip size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex-grow">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Secure dispatch..."
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl py-2.5 px-5 text-sm text-white outline-none focus:border-[#00BFFF]/30 transition-all placeholder:text-slate-700"
              />
            </div>

            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="w-10 h-10 flex items-center justify-center bg-[#00BFFF] text-white rounded-2xl shadow-lg active:scale-90 transition-all disabled:opacity-20"
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
