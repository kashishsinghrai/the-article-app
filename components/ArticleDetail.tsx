import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { Article } from "../types";
import { toast } from "react-hot-toast";

interface ArticleDetailProps {
  article: Article;
  onClose: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onClose }) => {
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");

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

  useEffect(() => {
    const timer = setTimeout(() => setIsDecrypted(true), 400);
    return () => clearTimeout(timer);
  }, []);

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

        <div className="flex-grow p-8 space-y-16 overflow-y-auto md:p-24">
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

          {hasImage && (
            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <img
                src={article.image_url}
                alt={article.title}
                className="object-cover w-full h-full transition-opacity duration-1000"
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
          </article>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
