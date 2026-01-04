import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Loader2,
  Fingerprint,
  Share2,
  Target,
  MoreHorizontal,
  Bookmark,
  // Added missing User icon import
  User,
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
      const { error } = await supabase.from("comments").insert({
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
    <div className="max-w-3xl mx-auto min-h-screen bg-white dark:bg-[#050505] animate-in fade-in duration-300 flex flex-col pb-20">
      {/* Top sticky navigation bar - LinkedIn Style */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5 sticky top-[4rem] z-40 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl">
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-[#00BFFF] transition-all flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span className="hidden text-xs font-bold tracking-widest uppercase md:font-black sm:inline">
            Back
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success("Dispatch Saved")}
            className="p-2 text-slate-400 hover:text-blue-500"
          >
            <Bookmark size={20} />
          </button>
          <button
            onClick={() => toast.success("Asset Hash Copied")}
            className="p-2 text-slate-400 hover:text-blue-500"
          >
            <Share2 size={20} />
          </button>
          <button className="p-2 text-slate-400">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <article className="px-4 mt-6 space-y-6 md:px-8">
        {/* Post Header (Author Info) */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 overflow-hidden border rounded-full shadow-inner md:w-12 md:h-12 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/10 shrink-0">
              <Fingerprint size={24} className="text-slate-400" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs font-black leading-none tracking-tight uppercase truncate md:text-sm text-slate-900 dark:text-white">
                {article.author_name}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1">
                {article.author_serial} •{" "}
                {new Date(article.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-[#00BFFF]/5 rounded-md border border-[#00BFFF]/10 shrink-0">
            <Target size={10} className="text-[#00BFFF]" />
            <span className="text-[8px] font-black text-[#00BFFF] uppercase tracking-widest">
              VERIFIED
            </span>
          </div>
        </header>

        {/* Content Section */}
        <div className="space-y-4">
          <h1
            className={`text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight uppercase italic transition-all duration-700 ${
              isDecrypted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {article.title}
          </h1>

          <p
            className={`text-sm md:text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic transition-opacity duration-700 ${
              isDecrypted ? "opacity-100" : "opacity-20"
            }`}
          >
            "{article.content}"
          </p>

          {article.image_url && (
            <div className="rounded-xl md:rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-lg bg-slate-50 dark:bg-[#111]">
              <img
                src={article.image_url}
                className="object-cover w-full h-auto"
                alt="Evidence Asset"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 pt-2">
            {article.hashtags?.map((t, i) => (
              <span
                key={i}
                className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Interaction Statistics */}
        <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-white/5">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[6px] text-white ring-1 ring-white dark:ring-black">
                <ThumbsUp size={8} />
              </div>
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[6px] text-white ring-1 ring-white dark:ring-black">
                <ThumbsDown size={8} />
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-400">
              {(article.likes_count || 0) + (article.dislikes_count || 0)}{" "}
              signals
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {article.comments_count || 0} analyses
          </span>
        </div>

        {/* LinkedIn-style Interaction Row */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-slate-50 dark:border-white/5">
          <button
            onClick={() => onInteraction?.("like", article.id)}
            className="flex flex-1 items-center justify-center gap-1.5 py-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-colors text-slate-500 hover:text-blue-500"
          >
            <ThumbsUp size={18} />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              Like
            </span>
          </button>
          <button
            onClick={() => onInteraction?.("dislike", article.id)}
            className="flex flex-1 items-center justify-center gap-1.5 py-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-colors text-slate-500 hover:text-red-500"
          >
            <ThumbsDown size={18} />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              Dislike
            </span>
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 py-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-colors text-slate-500">
            <MessageCircle size={18} />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              Note
            </span>
          </button>
          <button
            onClick={() => toast.success("Signal Relayed")}
            className="flex flex-1 items-center justify-center gap-1.5 py-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-colors text-slate-500"
          >
            <Share2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              Relay
            </span>
          </button>
        </div>

        {/* Comment Input Section */}
        <div className="pt-4 space-y-6">
          <div className="flex gap-3">
            <div className="flex items-center justify-center w-8 h-8 overflow-hidden border rounded-full md:w-10 md:h-10 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-white/10 shrink-0">
              <User size={18} className="text-slate-400" />
            </div>
            <div className="flex flex-col flex-grow gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-bold bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-full text-slate-900 dark:text-white focus:border-[#00BFFF]/50 outline-none transition-all shadow-sm"
                placeholder="Add an intelligence note..."
                onKeyDown={(e) => e.key === "Enter" && postComment()}
              />
              {commentText.trim() && (
                <button
                  onClick={postComment}
                  disabled={isSending}
                  className="w-fit px-4 py-1.5 bg-[#00BFFF] text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="animate-spin" size={12} />
                  ) : (
                    "Post Dispatch"
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {loadingComments ? (
              <div className="flex items-center gap-2 py-8 text-slate-400">
                <Loader2 className="animate-spin" size={14} />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">
                  Decrypting Shards...
                </span>
              </div>
            ) : comments.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[9px] font-black text-slate-300 dark:text-white/10 uppercase tracking-[0.5em] italic">
                  Buffer_Void
                </p>
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="flex gap-3 duration-300 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-[#00BFFF] shrink-0 border border-slate-100 dark:border-white/5">
                    <Fingerprint size={14} />
                  </div>
                  <div className="flex-grow p-3 border bg-slate-50 dark:bg-white/5 rounded-2xl md:p-4 border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white truncate">
                        {c.user_name}
                      </span>
                      <span className="text-[7px] font-black text-slate-400 uppercase">
                        {new Date(c.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs italic font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                      "{c.text}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
