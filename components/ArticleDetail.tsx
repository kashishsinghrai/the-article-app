import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  Shield,
  Clock,
  User,
  Share2,
  Bookmark,
  ArrowLeft,
  ShieldAlert,
  Languages,
  Zap,
  Hash,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Loader2,
  Fingerprint,
} from "lucide-react";
import { Article, Comment, Profile } from "../types";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabase";

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
  isLoggedIn: boolean;
  onInteraction?: (type: "like" | "dislike", id: string) => void;
  currentUserId?: string;
  currentUserProfile?: Profile | null;
  onUpdateArticles?: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onClose,
  isLoggedIn,
  onInteraction,
  currentUserId,
  currentUserProfile,
  onUpdateArticles,
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
    Marathi: "mr",
    Gujarati: "gu",
  };

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", article.id)
      .order("created_at", { ascending: false });

    if (!error) setComments(data || []);
    setLoadingComments(false);
  }, [article.id]);

  useEffect(() => {
    const timer = setTimeout(() => setIsDecrypted(true), 400);
    fetchComments();
    return () => clearTimeout(timer);
  }, [fetchComments]);

  const handleTranslate = (langName: string) => {
    const langCode = langMap[langName];
    if (!langCode) return;
    setCurrentLang(langName);
    const googleCombo = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;
    if (googleCombo) {
      googleCombo.value = langCode;
      googleCombo.dispatchEvent(new Event("change"));
    }
  };

  const postComment = async () => {
    if (!isLoggedIn || !currentUserProfile)
      return toast.error("Identity verification required to contribute.");
    if (!commentText.trim()) return;

    setIsSending(true);
    const { error } = await supabase.from("comments").insert({
      article_id: article.id,
      user_id: currentUserId,
      user_name: currentUserProfile.full_name,
      text: commentText.trim(),
    });

    if (!error) {
      // Update article comment count locally and globally
      const newCount = (article.comments_count || 0) + 1;
      await supabase
        .from("articles")
        .update({ comments_count: newCount })
        .eq("id", article.id);

      setCommentText("");
      await fetchComments();
      if (onUpdateArticles) onUpdateArticles();
      toast.success("Contribution recorded.");
    } else {
      toast.error("Network conflict: Failed to post note.");
    }
    setIsSending(false);
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1504711432869-efd597cdd0bf?auto=format&fit=crop&q=80&w=1000";
  };

  const hasImage = article.image_url && article.image_url.trim() !== "";

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-white/80 dark:bg-slate-950/90 backdrop-blur-3xl"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl h-[100dvh] md:h-[90vh] bg-white dark:bg-slate-950 rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800">
        <div className="z-20 flex items-center justify-between px-8 py-6 border-b notranslate border-slate-50 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Exit
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 rounded-full px-4 py-1.5 border border-slate-100 dark:border-slate-800">
              <Languages size={14} className="text-slate-400" />
              <select
                value={currentLang}
                onChange={(e) => handleTranslate(e.target.value)}
                className="bg-transparent border-none text-[9px] font-bold uppercase tracking-widest focus:ring-0 cursor-pointer text-slate-600 dark:text-slate-300 p-0"
              >
                {Object.keys(langMap).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-grow p-8 pb-40 space-y-16 overflow-y-auto custom-scrollbar md:p-24">
          <header className="max-w-3xl space-y-8">
            <div className="space-y-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-300 dark:text-slate-700">
                {article.author_serial} // VERIFIED_NODE
              </p>
              <h1
                className={`text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] transition-all duration-700 uppercase italic ${
                  isDecrypted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {article.title}
              </h1>
            </div>

            {article.hashtags && article.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {article.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1"
                  >
                    <Hash size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-10 py-10 notranslate border-y border-slate-50 dark:border-slate-900">
              <div className="space-y-1">
                <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">
                  Source
                </p>
                <p className="text-sm italic font-black uppercase dark:text-white">
                  {article.author_name}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">
                  Released
                </p>
                <p className="text-sm italic font-black uppercase dark:text-white">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </header>

          {/* Engagement Bar */}
          <div className="flex items-center max-w-3xl gap-8 py-6 border-y border-slate-50 dark:border-slate-900">
            <button
              onClick={() => onInteraction?.("like", article.id)}
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-widest group"
            >
              <ThumbsUp
                size={18}
                className="transition-transform group-active:scale-125"
              />{" "}
              {article.likes_count || 0} Supports
            </button>
            <button
              onClick={() => onInteraction?.("dislike", article.id)}
              className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest group"
            >
              <ThumbsDown
                size={18}
                className="transition-transform group-active:scale-125"
              />{" "}
              {article.dislikes_count || 0} Conflicts
            </button>
            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
              <MessageCircle size={18} /> {article.comments_count || 0} Notes
            </div>
          </div>

          {hasImage && (
            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <img
                src={article.image_url}
                alt={article.title}
                className="object-cover w-full h-full transition-opacity duration-1000"
                onError={handleImgError}
              />
            </div>
          )}

          <article className="max-w-3xl space-y-10">
            <div
              className={`text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic transition-opacity duration-1000 ${
                isDecrypted ? "opacity-100" : "opacity-10"
              }`}
            >
              {article.content}
            </div>

            <div className="flex items-start gap-6 p-8 border bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-3xl">
              <ShieldAlert className="flex-shrink-0 text-slate-300" size={20} />
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                  Validation Protocol
                </h4>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                  Intelligence node confirmed via P2P verification. Identity
                  hashed.
                </p>
              </div>
            </div>

            {/* Real Comments Section */}
            <div className="pt-20 space-y-10">
              <div className="space-y-2">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">
                  Field Contributions
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Registry of Verified Responses
                </p>
              </div>

              <div className="flex gap-4">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-grow px-6 py-4 text-sm font-bold border outline-none bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-600"
                  placeholder="Enter encrypted note..."
                  onKeyDown={(e) => e.key === "Enter" && postComment()}
                />
                <button
                  onClick={postComment}
                  disabled={isSending}
                  className="flex items-center justify-center text-white transition-all shadow-lg w-14 h-14 bg-slate-950 dark:bg-white dark:text-slate-950 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50"
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
                  <div className="flex items-center gap-3 text-slate-400">
                    <Loader2 className="animate-spin" size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Decrypting Archive...
                    </span>
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                    No field notes recorded yet.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-6 space-y-3 border shadow-sm bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 overflow-hidden border rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700">
                            <Fingerprint size={16} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                            {c.user_name}
                          </span>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">
                          {new Date(c.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm italic font-medium leading-relaxed text-slate-600 dark:text-slate-300">
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
