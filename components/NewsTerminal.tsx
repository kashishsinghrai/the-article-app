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
      // Using a reliable, free, CORS-friendly public news aggregator (ok.surf)
      // This gives REAL news without needing an API key.
      const response = await fetch("https://ok.surf/api/v1/cors/news-feed");
      const data = await response.json();

      const processedNews: NewsItem[] = [];

      // Extract Indian News if available, else generic World/Business
      if (data.India) {
        data.India.slice(0, 3).forEach((item: any) => {
          processedNews.push({
            title: item.title,
            summary: item.title, // Aggregator often doesn't give full body, so we use title as teaser
            source: item.source,
            url: item.link,
            region: "India",
          });
        });
      }

      // Add World/Global News
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
      console.error("Real-time feed failed, using fallback logic.", err);
      setNews(getFallbackNews());
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, []);

  const getFallbackNews = (): NewsItem[] => [
    {
      title: "Global Market Shift",
      summary: "Supply chains adjusting to new digital trade protocols.",
      source: "Reuters",
      url: "#",
      region: "Global",
    },
    {
      title: "India Tech Expansion",
      summary: "New data centers being established in southern states.",
      source: "TOI",
      url: "#",
      region: "India",
    },
    {
      title: "Privacy Law Updates",
      summary: "Nations agree on new whistleblower protection standards.",
      source: "Guardian",
      url: "#",
      region: "Global",
    },
    {
      title: "Infrastructure Audit",
      summary: "Mumbai Metro Phase 3 progress report released.",
      source: "Hindu",
      url: "#",
      region: "India",
    },
  ];

  useEffect(() => {
    fetchRealNews();
    const interval = setInterval(fetchRealNews, 900000); // Refresh every 15 mins
    return () => clearInterval(interval);
  }, [fetchRealNews]);

  return (
    <section className="py-24 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2 text-blue-600">
            <Globe size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Node Protocol: Active
            </span>
            <span className="flex items-center gap-1 ml-4 text-emerald-500">
              <ShieldCheck size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest">
                Live Feed Enabled
              </span>
            </span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-[0.9]">
            Wire Intelligence <br /> Terminal
          </h2>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-full shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 pl-4 pr-2">
            <Clock size={12} className="text-slate-400" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Last Sync:{" "}
              {lastRefreshed.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <button
            onClick={() => fetchRealNews()}
            disabled={loading}
            className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:bg-blue-600 transition-all shadow-lg group disabled:opacity-50"
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
        {loading && news.length === 0
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-[3rem] bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center"
                >
                  <Loader2 className="animate-spin text-slate-300" />
                </div>
              ))
          : news.map((item, i) => (
              <div
                key={i}
                className="group p-10 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between text-left relative overflow-hidden backdrop-blur-sm"
              >
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        item.region === "India"
                          ? "bg-orange-50 text-orange-600 border border-orange-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {item.region}
                    </span>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <Zap size={10} className="text-blue-600" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-tight tracking-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-50 dark:border-white/5 flex justify-between items-center relative z-10">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Newspaper size={10} /> {item.source}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 hover:tracking-[0.2em] transition-all"
                  >
                    VIEW WIRE <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default NewsTerminal;
