import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCcw,
  ArrowUpRight,
  Loader2,
  Star,
  ChevronDown,
  Newspaper,
  Globe,
  Zap,
} from "lucide-react";

interface NewsItem {
  title: string;
  source: string;
  link: string;
  og?: string;
  category?: string;
}

const NewsTerminal: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("World");

  const fetchRealNews = useCallback(async (region: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://ok.surf/api/v1/cors/news-feed");
      const data = await response.json();
      const pool = data[region] || data["World"] || [];
      const processed = pool.map((item: any) => ({
        title: item.title,
        source: item.source,
        link: item.link,
        category: region,
      }));
      setNews(processed);
    } catch (err) {
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRealNews(selectedRegion);
  }, [selectedRegion, fetchRealNews]);

  return (
    <section className="space-y-6 duration-1000 animate-in fade-in">
      <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white outline-none p-2 cursor-pointer w-full"
        >
          {["World", "Technology", "Business", "Science"].map((r) => (
            <option
              key={r}
              value={r}
              className="bg-white dark:bg-[#0a0a0a] text-black dark:text-white"
            >
              {r} WIRE
            </option>
          ))}
        </select>
        <button
          onClick={() => fetchRealNews(selectedRegion)}
          className="p-2 text-[#00BFFF] hover:rotate-180 transition-transform duration-500"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="space-y-4">
        {loading
          ? Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-24 border rounded-3xl bg-slate-50 dark:bg-white/5 animate-pulse border-slate-100 dark:border-white/5"
                />
              ))
          : news.slice(0, 15).map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 hover:border-[#00BFFF]/40 transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-[#00BFFF] uppercase tracking-[0.2em]">
                      {item.source}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-slate-300 group-hover:text-[#00BFFF] transition-colors"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight tracking-tight line-clamp-2 italic group-hover:text-[#00BFFF] transition-colors">
                    "{item.title}"
                  </h3>
                  <div className="flex items-center gap-1.5 opacity-40">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7px] font-black uppercase text-slate-500">
                      Verified_Signal
                    </span>
                  </div>
                </div>
              </a>
            ))}
      </div>
    </section>
  );
};

export default NewsTerminal;
