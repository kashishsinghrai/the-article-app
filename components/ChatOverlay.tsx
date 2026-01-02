import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Lock,
  ShieldAlert,
  ChevronLeft,
  Fingerprint,
} from "lucide-react";
import { LiveMessage, Profile } from "../types";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

interface ChatOverlayProps {
  recipient: Profile;
  currentUserId: string;
  onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({
  recipient,
  currentUserId,
  onClose,
}) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<LiveMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},recipient_id.eq.${recipient.id}),and(sender_id.eq.${recipient.id},recipient_id.eq.${currentUserId})`
      )
      .order("created_at", { ascending: true });
    if (data) setLocalMessages(data);
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel(`chat_${recipient.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMsg = payload.new as LiveMessage;
          if (
            (newMsg.sender_id === currentUserId &&
              newMsg.recipient_id === recipient.id) ||
            (newMsg.sender_id === recipient.id &&
              newMsg.recipient_id === currentUserId)
          ) {
            setLocalMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [recipient.id, currentUserId]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [localMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const { error } = await supabase
      .from("chat_messages")
      .insert({
        sender_id: currentUserId,
        recipient_id: recipient.id,
        text: input.trim(),
      });
    if (!error) setInput("");
    else toast.error("Bypass failed. Message dropped.");
  };

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 z-[200] flex flex-col md:w-96 md:h-[600px] animate-in slide-in-from-bottom-10">
      <div className="flex-grow flex flex-col bg-white dark:bg-slate-950 md:rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 text-white bg-slate-900">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="md:hidden">
              <ChevronLeft size={24} />
            </button>
            <div className="w-10 h-10 overflow-hidden border rounded-full bg-slate-800 border-white/10">
              {recipient.avatar_url ? (
                <img
                  src={recipient.avatar_url}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Fingerprint className="m-2 text-slate-500" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase truncate">
                {recipient.full_name}
              </h4>
              <p className="text-[8px] font-black uppercase text-emerald-400">
                Encrypted Line
              </p>
            </div>
          </div>
          <button onClick={onClose} className="hidden md:block">
            <X size={20} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-grow p-6 space-y-4 overflow-y-auto bg-slate-50 dark:bg-slate-950/50"
        >
          {localMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm font-medium ${
                  msg.sender_id === currentUserId
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-800 dark:text-white rounded-tl-none shadow-sm"
                }`}
              >
                {msg.text}
                <div className="text-[8px] mt-1 opacity-50 uppercase font-black">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSend}
          className="flex gap-2 p-4 bg-white dark:bg-slate-900"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Secure message..."
            className="flex-grow px-4 py-2 text-sm font-bold outline-none bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white"
          />
          <button
            type="submit"
            className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-xl"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatOverlay;
