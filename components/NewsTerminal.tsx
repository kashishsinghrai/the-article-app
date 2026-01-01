import React, { useState, useEffect, useCallback } from "react";
import {
  Globe,
  RefreshCcw,
  Newspaper,
  ArrowUpRight,
  Clock,
  Zap,
  ShieldCheck,
  Loader2,
  Star,
} from "lucide-react";

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  region: "India" | "Global";
}

const NewsTerminal: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchRealNews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("https://ok.surf/api/v1/cors/news-feed");
      const data = await response.json();

      const processedNews: NewsItem[] = [];

      if (data.India) {
        data.India.slice(0, 3).forEach((item: any) => {
          processedNews.push({
            title: item.title,
            summary: item.title,
            source: item.source,
            url: item.link,
            region: "India",
          });
        });
      }

      const globalPool = data.World || data.Business || data.Technology;
      if (globalPool) {
        globalPool.slice(0, 3).forEach((item: any) => {
          processedNews.push({
            title: item.title,
            summary: item.title,
            source: item.source,
            url: item.link,
            region: "Global",
          });
        });
      }

      setNews(processedNews.length > 0 ? processedNews : getFallbackNews());
    } catch (err) {
      setNews(getFallbackNews());
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, []);

  const getFallbackNews = (): NewsItem[] => [
    {
      title: "Global Market Updates",
      summary: "Supply chains adjusting to new digital trade protocols.",
      source: "Reuters",
      url: "#",
      region: "Global",
    },
    {
      title: "India Technology Boom",
      summary: "New data centers being established in southern states.",
      source: "TOI",
      url: "#",
      region: "India",
    },
    {
      title: "New Privacy Protection",
      summary: "Nations agree on new whistleblower protection standards.",
      source: "Guardian",
      url: "#",
      region: "Global",
    },
    {
      title: "Local Projects Update",
      summary: "Mumbai Metro Phase 3 progress report released.",
      source: "Hindu",
      url: "#",
      region: "India",
    },
  ];

  useEffect(() => {
    fetchRealNews();
    const interval = setInterval(fetchRealNews, 900000); // 15 mins
    return () => clearInterval(interval);
  }, [fetchRealNews]);

  return (
    <section className="duration-1000 animate-in fade-in">
      <div className="flex flex-col items-center justify-between gap-6 mb-12 md:flex-row">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 text-blue-600 md:justify-start">
            <Star size={18} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Live News Updates
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase md:text-5xl text-slate-900 dark:text-white">
            Top Headline Feed
          </h2>
        </div>

        <div className="flex items-center gap-4 p-2 border rounded-full bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2 pl-4 pr-2">
            <Clock size={12} className="text-slate-400" />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              Updated:{" "}
              {lastRefreshed.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <button
            onClick={() => fetchRealNews()}
            disabled={loading}
            className="p-3 transition-all bg-white rounded-full shadow-md dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white group disabled:opacity-50"
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && news.length === 0
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-[2rem] bg-slate-50 dark:bg-slate-800 animate-pulse"
                />
              ))
          : news.map((item, i) => (
              <div
                key={i}
                className="group p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-transparent hover:border-blue-200 dark:hover:border-blue-900/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                        item.region === "India"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {item.region}
                    </span>
                    <Zap size={12} className="text-amber-500" />
                  </div>

                  <h3 className="text-lg font-bold leading-tight transition-colors text-slate-900 dark:text-white group-hover:text-blue-600 line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-200 dark:border-white/5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Newspaper size={10} /> {item.source}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 transition-transform bg-white rounded-full shadow-sm dark:bg-slate-700 hover:scale-110"
                  >
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default NewsTerminal;
