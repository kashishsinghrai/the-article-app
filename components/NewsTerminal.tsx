import React, { useState, useEffect } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import {
  Globe,
  RefreshCcw,
  Languages,
  Loader2,
  Newspaper,
  ArrowUpRight,
  Search,
  Clock,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  region: "India" | "Global";
}

const NEWS_CACHE_KEY = "the_articles_news_terminal_cache";
const NEWS_CACHE_EXPIRY = 60 * 60 * 1000; // 1 Hour

const NewsTerminal: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isCached, setIsCached] = useState(false);

  const languages = [
    "Hindi",
    "English",
    "Spanish",
    "French",
    "Bengali",
    "Tamil",
    "Marathi",
    "Gujarati",
  ];

  const fetchLiveNews = async (force = false) => {
    if (!force) {
      const cached = localStorage.getItem(NEWS_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < NEWS_CACHE_EXPIRY) {
          setNews(data);
          setIsCached(true);
          return;
        }
      }
    }

    setLoading(true);
    try {
      // Fix: Use 'gemini-3-flash-preview' for tasks requiring search grounding
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents:
          "Find 6 trending news stories: 3 from India, 3 Global. Provide JSON: title, summary, source, url, region.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                source: { type: Type.STRING },
                url: { type: Type.STRING },
                region: { type: Type.STRING },
              },
              required: ["title", "summary", "source", "url", "region"],
            },
          },
        },
      });

      const data = JSON.parse(response.text || "[]");
      setNews(data);
      localStorage.setItem(
        NEWS_CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
      setIsCached(false);
    } catch (err: any) {
      console.error("AI Error:", err);
      if (err.message?.includes("403")) {
        toast.error(
          "403 Forbidden: API Key might not support Search Tool or Regional Limits."
        );
      }
      const cached = localStorage.getItem(NEWS_CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        setNews(data);
        setIsCached(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerGlobalTranslate = (langName: string) => {
    const langMap: Record<string, string> = {
      English: "en",
      Hindi: "hi",
      Spanish: "es",
      French: "fr",
      Bengali: "bn",
      Tamil: "ta",
      Marathi: "mr",
      Gujarati: "gu",
    };
    const code = langMap[langName];
    const googleCombo = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;
    if (googleCombo) {
      googleCombo.value = code;
      googleCombo.dispatchEvent(new Event("change"));
      setLanguage(langName);
      toast.success(`Language: ${langName}`);
    }
  };

  useEffect(() => {
    fetchLiveNews();
  }, []);

  return (
    <section className="py-24 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="notranslate space-y-4 text-left">
          <div className="flex items-center gap-2 text-blue-600">
            <Globe size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Live Node Protocol
            </span>
            {isCached && (
              <span className="flex items-center gap-1 ml-4 text-slate-400">
                <Clock size={10} />
                <span className="text-[8px] font-black uppercase">
                  Archive Active
                </span>
              </span>
            )}
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter transition-colors leading-[0.9]">
            Open Intel <br /> Terminal
          </h2>
        </div>

        <div className="notranslate flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-full shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 pl-4">
            <Zap size={12} className="text-blue-600" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              NATIVE TRANSLATE
            </span>
          </div>
          <select
            value={language}
            onChange={(e) => triggerGlobalTranslate(e.target.value)}
            className="bg-transparent border-none px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchLiveNews(true)}
            disabled={loading}
            className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:bg-blue-600 transition-all shadow-lg group"
          >
            <RefreshCcw
              size={16}
              className={`${
                loading
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-[3rem] bg-slate-100 dark:bg-slate-900 animate-pulse"
                />
              ))
          : news.map((item, i) => (
              <div
                key={i}
                className="group p-10 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between text-left relative overflow-hidden"
              >
                <div className="space-y-6 relative z-10">
                  <div className="notranslate flex justify-between items-start">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        item.region === "India"
                          ? "bg-orange-50 text-orange-600 border border-orange-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {item.region}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    {item.summary}
                  </p>
                </div>

                <div className="notranslate mt-10 pt-6 border-t border-slate-50 dark:border-white/5 flex justify-between items-center relative z-10">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Search size={10} /> {item.source}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 hover:tracking-[0.2em] transition-all"
                  >
                    FULL INTEL <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default NewsTerminal;
