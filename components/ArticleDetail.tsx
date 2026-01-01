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
    const timer = setTimeout(() => setIsDecrypted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTranslate = (langName: string) => {
    const langCode = langMap[langName];
    if (!langCode) return;

    setCurrentLang(langName);

    const triggerTranslation = () => {
      const googleCombo = document.querySelector(
        ".goog-te-combo"
      ) as HTMLSelectElement;
      if (googleCombo) {
        googleCombo.value = langCode;
        googleCombo.dispatchEvent(new Event("change"));
        toast.success(`Broadcasting Intel: ${langName}`, {
          icon: "🌐",
          style: {
            borderRadius: "20px",
            background: "#0f172a",
            color: "#fff",
            fontSize: "10px",
            fontWeight: "900",
            textTransform: "uppercase",
          },
        });
      } else {
        setTimeout(triggerTranslation, 500);
      }
    };

    triggerTranslation();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center animate-in fade-in duration-500">
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl h-[100dvh] md:h-[90vh] bg-white dark:bg-slate-950 rounded-none md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col border border-white/10">
        {/* Header Strip */}
        <div className="notranslate flex items-center justify-between px-6 md:px-10 py-4 md:py-6 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-[9px] md:text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={16} className="hidden xs:block" /> CLOSE
            </button>
            <div className="hidden xs:block w-px h-4 bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2 text-emerald-500">
              <Shield size={12} />
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                VERIFIED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-3 md:px-4 py-1 md:py-1.5 border border-slate-200 dark:border-slate-700">
              <Languages size={14} className="text-blue-600" />
              <select
                value={currentLang}
                onChange={(e) => handleTranslate(e.target.value)}
                className="bg-transparent border-none text-[8px] md:text-[9px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer text-slate-600 dark:text-slate-300"
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

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-20 space-y-10 md:space-y-16">
          <header className="space-y-6 md:space-y-10 max-w-3xl">
            <div className="space-y-4">
              <div className="notranslate flex items-center gap-3 text-blue-600 dark:text-blue-400">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] italic truncate max-w-[200px]">
                  SOURCE ID: {article.author_serial}
                </span>
              </div>
              <h1
                className={`text-4xl md:text-7xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-[0.9] transition-all duration-1000 ${
                  isDecrypted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {article.title}
              </h1>
            </div>

            <div className="notranslate flex flex-col xs:flex-row gap-6 xs:gap-10 border-y border-slate-100 dark:border-white/5 py-6 md:py-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    BY CORRESPONDENT
                  </p>
                  <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase italic">
                    {article.author_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    PUBLISHED ON
                  </p>
                  <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase italic">
                    {new Date(article.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="aspect-video w-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-slate-100 dark:bg-slate-800">
            <img
              src={article.image_url}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>

          <article className="max-w-3xl space-y-8 md:space-y-10">
            <div
              className={`prose prose-lg md:prose-2xl dark:prose-invert text-slate-600 dark:text-slate-400 font-medium leading-[1.8] italic transition-opacity duration-1000 ${
                isDecrypted ? "opacity-100" : "opacity-20"
              }`}
            >
              {article.content}
            </div>

            <div className="notranslate p-6 md:p-10 bg-slate-50 dark:bg-white/5 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex gap-4 md:gap-6 items-start">
              <ShieldAlert className="text-blue-600 flex-shrink-0" size={20} />
              <div className="space-y-2">
                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  JOURNALISTIC INTEGRITY
                </h4>
                <p className="text-[10px] md:text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                  This report is stored on our decentralized ledger.
                  Translations are handled by your browser's local engine to
                  protect privacy.
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
