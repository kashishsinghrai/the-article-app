import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Languages,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Loader2,
  Fingerprint,
  Hash,
  ShieldAlert,
  Trash2,
  Share2,
  Target,
  Zap,
} from "lucide-react";
import { Article, Comment, Profile } from "../types";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabase";

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
  isLoggedIn: boolean;
  currentUserId?: string;
  currentUserProfile?: Profile | null;
  onUpdateArticles?: () => void;
  onInteraction?: (type: "like" | "dislike", id: string) => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onClose,
  isLoggedIn,
  currentUserId,
  currentUserProfile,
  onUpdateArticles,
  onInteraction,
}) => {
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("article_id", article.id)
        .order("created_at", { ascending: false });
      if (data) setComments(data);
    } finally {
      setLoadingComments(false);
    }
  }, [article.id]);

  useEffect(() => {
    const timer = setTimeout(() => setIsDecrypted(true), 400);
    fetchComments();
    return () => clearTimeout(timer);
  }, [fetchComments]);

  const postComment = async () => {
    if (!isLoggedIn || !currentUserProfile)
      return toast.error("Identity verification required.");
    if (!commentText.trim()) return;
    setIsSending(true);
    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          article_id: article.id,
          user_id: currentUserId,
          user_name: currentUserProfile.full_name,
          text: commentText.trim(),
        });
      if (!error) {
        setCommentText("");
        await fetchComments();
        onUpdateArticles?.();
        toast.success("Intelligence Note Shared");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
      <div
        className="absolute inset-0 bg-white/60 dark:bg-[#050505]/95 backdrop-blur-3xl"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl h-full md:h-[95vh] bg-white dark:bg-[#0a0a0a] md:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-slate-200 dark:border-white/5">
        {/* Dossier Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl z-10">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#00BFFF] transition-all text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3"
          >
            <ArrowLeft size={16} /> Close Shard
          </button>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-[#00BFFF]/5 rounded-full border border-[#00BFFF]/10">
              <Target size={14} className="text-[#00BFFF]" />
              <span className="text-[9px] font-black text-[#00BFFF] uppercase tracking-widest">
                Protocol: Investigative
              </span>
            </div>
            <button
              onClick={() => toast.success("Dispatch Hashed")}
              className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-[#00BFFF] transition-all"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="flex-grow p-6 overflow-y-auto md:p-20 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-20">
            <header className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#00BFFF] rounded-full animate-ping" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00BFFF]">
                    Identity Verified: {article.author_serial}
                  </p>
                </div>
                <h1
                  className={`text-4xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] uppercase italic transition-all duration-1000 ${
                    isDecrypted
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  {article.title}
                </h1>
              </div>

              <div className="flex flex-wrap gap-4">
                {article.hashtags?.map((t, i) => (
                  <span
                    key={i}
                    className="px-5 py-2 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border border-slate-100 dark:border-white/5"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </header>

            {/* Main Content Shard */}
            <div className="space-y-16">
              <div className="flex items-center gap-8 py-10 border-y border-slate-100 dark:border-white/5">
                <button
                  onClick={() => onInteraction?.("like", article.id)}
                  className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 hover:text-[#00BFFF] transition-colors group"
                >
                  <ThumbsUp
                    size={24}
                    className="transition-transform group-active:scale-125"
                  />{" "}
                  {article.likes_count || 0} Supports
                </button>
                <button
                  onClick={() => onInteraction?.("dislike", article.id)}
                  className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors group"
                >
                  <ThumbsDown
                    size={24}
                    className="transition-transform group-active:scale-125"
                  />{" "}
                  {article.dislikes_count || 0} Conflicts
                </button>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400">
                  <MessageCircle size={24} /> {article.comments_count || 0}{" "}
                  Analysis Notes
                </div>
              </div>

              <div className="space-y-12">
                <p
                  className={`text-2xl md:text-4xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic transition-opacity duration-1000 ${
                    isDecrypted ? "opacity-100" : "opacity-10"
                  }`}
                >
                  "{article.content}"
                </p>

                {article.image_url && (
                  <div className="aspect-video w-full rounded-[4rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl relative group">
                    <img
                      src={article.image_url}
                      className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                      alt="Evidence Asset"
                    />
                    <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-100" />
                  </div>
                )}
              </div>

              {/* Note Input */}
              <div className="pt-24 pb-20 space-y-12">
                <div className="space-y-3">
                  <h3 className="text-2xl italic font-black uppercase text-slate-900 dark:text-white">
                    Field Intelligence
                  </h3>
                  <p className="text-[10px] font-black text-[#00BFFF] uppercase tracking-[0.4em]">
                    Broadcast your peer-verified analysis
                  </p>
                </div>

                <div className="flex gap-4">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-grow px-8 py-6 text-base font-bold bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-[2.5rem] text-slate-900 dark:text-white focus:border-[#00BFFF]/50 outline-none transition-all shadow-inner"
                    placeholder="Input encrypted node response..."
                    onKeyDown={(e) => e.key === "Enter" && postComment()}
                  />
                  <button
                    onClick={postComment}
                    disabled={isSending || !commentText.trim()}
                    className="w-20 h-20 bg-[#00BFFF] text-white rounded-[2.5rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00BFFF]/20 disabled:opacity-20"
                  >
                    {isSending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Send size={24} />
                    )}
                  </button>
                </div>

                <div className="space-y-8">
                  {loadingComments ? (
                    <div className="flex items-center gap-4 text-[#00BFFF]">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Decrypting Peer Responses...
                      </span>
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-xs italic font-black tracking-widest uppercase text-slate-500 opacity-40">
                      Zero peer analysis recorded for this shard.
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-10 space-y-6 bg-slate-50 dark:bg-[#080808] rounded-[3rem] border border-slate-100 dark:border-white/5 group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex items-center justify-center text-[#00BFFF] shadow-sm">
                              <Fingerprint size={24} />
                            </div>
                            <div>
                              <span className="text-sm font-black uppercase text-slate-900 dark:text-white">
                                {c.user_name}
                              </span>
                              <p className="text-[8px] font-bold text-[#00BFFF] uppercase mt-1 tracking-[0.2em]">
                                Verified_ALPHA_Node
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase">
                            {new Date(c.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-lg italic font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                          "{c.text}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
