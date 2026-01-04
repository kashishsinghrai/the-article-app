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
  const [currentLang, setCurrentLang] = useState("English");
  const [commentText, setCommentText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const langMap: Record<string, string> = {
    English: "en",
    Hindi: "hi",
    Spanish: "es",
    French: "fr",
    German: "de",
    Bengali: "bn",
    Tamil: "ta",
  };

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", article.id)
      .order("created_at", { ascending: false });
    if (data) setComments(data);
    setLoadingComments(false);
  }, [article.id]);

  useEffect(() => {
    const timer = setTimeout(() => setIsDecrypted(true), 400);
    fetchComments();
    return () => clearTimeout(timer);
  }, [fetchComments]);

  const handleTranslate = (langName: string) => {
    setCurrentLang(langName);
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = langMap[langName];
      combo.dispatchEvent(new Event("change"));
    }
  };

  const postComment = async () => {
    if (!isLoggedIn || !currentUserProfile)
      return toast.error("Identity verification required.");
    if (!commentText.trim()) return;

    setIsSending(true);
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
      toast.success("Contribution recorded.");
    }
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-white/80 dark:bg-slate-950/90 backdrop-blur-3xl"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl h-full md:h-[90vh] bg-white dark:bg-slate-950 md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/10">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Exit
          </button>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 rounded-full px-4 py-1.5 border border-white/5">
            <Languages size={14} className="text-slate-400" />
            <select
              value={currentLang}
              onChange={(e) => handleTranslate(e.target.value)}
              className="bg-transparent border-none text-[9px] font-bold uppercase tracking-widest text-slate-300 outline-none p-0 cursor-pointer"
            >
              {Object.keys(langMap).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-grow p-8 space-y-16 overflow-y-auto md:p-24 custom-scrollbar">
          <header className="max-w-3xl space-y-8">
            <div className="space-y-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-700">
                {article.author_serial} // VERIFIED_NODE
              </p>
              <h1
                className={`text-4xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tighter leading-tight transition-all duration-700 uppercase italic ${
                  isDecrypted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {article.title}
              </h1>
            </div>
            {article.hashtags && (
              <div className="flex flex-wrap gap-4">
                {article.hashtags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1"
                  >
                    <Hash size={12} />
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="flex items-center gap-8 py-6 border-y border-white/5">
            <button
              onClick={() => onInteraction?.("like", article.id)}
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <ThumbsUp size={18} /> {article.likes_count || 0} Support
            </button>
            <button
              onClick={() => onInteraction?.("dislike", article.id)}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <ThumbsDown size={18} /> {article.dislikes_count || 0} Conflict
            </button>
            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
              <MessageCircle size={18} /> {article.comments_count || 0} Notes
            </div>
          </div>

          <article className="max-w-3xl space-y-10">
            <p
              className={`text-xl md:text-2xl font-medium text-slate-400 leading-relaxed italic transition-opacity duration-1000 ${
                isDecrypted ? "opacity-100" : "opacity-0"
              }`}
            >
              {article.content}
            </p>
            <div className="flex items-start gap-6 p-8 border bg-slate-900 border-white/5 rounded-3xl">
              <ShieldAlert className="text-slate-500 shrink-0" size={20} />
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest dark:text-white">
                  Validation Protocol
                </h4>
                <p className="text-[10px] font-medium text-slate-500 uppercase">
                  Intelligence node confirmed via P2P verification. Identity
                  hashed.
                </p>
              </div>
            </div>

            <div className="pt-20 space-y-10">
              <div className="space-y-2">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">
                  Field Contributions
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Registry of Verified Responses
                </p>
              </div>
              <div className="flex gap-4">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-grow px-6 py-4 text-sm font-bold text-white border-none outline-none bg-slate-900 rounded-2xl focus:ring-1 focus:ring-blue-600"
                  placeholder="Enter encrypted note..."
                  onKeyDown={(e) => e.key === "Enter" && postComment()}
                />
                <button
                  onClick={postComment}
                  disabled={isSending}
                  className="flex items-center justify-center transition-all bg-white w-14 h-14 text-slate-950 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
              <div className="space-y-6">
                {loadingComments ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="animate-spin" size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Decrypting Archive...
                    </span>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-[10px] font-bold text-slate-500 uppercase italic">
                    No field notes recorded yet.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-6 space-y-3 border bg-slate-900/50 rounded-3xl border-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-500">
                            <Fingerprint size={16} />
                          </div>
                          <span className="text-[10px] font-black uppercase text-blue-600">
                            {c.user_name}
                          </span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 uppercase">
                          {new Date(c.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm italic font-medium text-slate-300">
                        "{c.text}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
