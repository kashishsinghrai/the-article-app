import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCcw,
  ArrowUpRight,
  Loader2,
  Star,
  ChevronDown,
} from "lucide-react";

interface NewsItem {
  title: string;
  source: string;
  link: string;
  og?: string;
}

const COUNTRIES = [
  { id: "World", name: "Global Wire" },
  { id: "India", name: "India Intelligence" },
  { id: "US", name: "United States" },
  { id: "Technology", name: "Tech / AI" },
  { id: "Business", name: "Economy" },
];

const NewsTerminal: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("World");

  const fetchRealNews = useCallback(async (region: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://ok.surf/api/v1/cors/news-feed");
      const data = await response.json();
      const pool = data[region] || data["World"] || [];
      setNews(pool.slice(0, 6));
    } catch (err) {
      console.warn("News feed sync interrupted.");
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRealNews(selectedRegion);
  }, [selectedRegion, fetchRealNews]);

  return (
    <section className="duration-1000 animate-in fade-in">
      <div className="flex flex-col items-center justify-between gap-8 mb-12 md:flex-row">
        <div className="space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center gap-3 text-blue-600 md:justify-start">
            <Star size={20} className="fill-current" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">
              Live Intelligence Feed
            </span>
          </div>
          <h2 className="text-4xl italic font-black leading-none tracking-tighter uppercase md:text-6xl text-slate-900 dark:text-white">
            Global Dispatch
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 p-2 border shadow-xl bg-slate-50 dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-white/5">
          <div className="relative group">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white dark:bg-slate-800 border-none rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white cursor-pointer outline-none shadow-sm appearance-none pr-12 min-w-[180px]"
            >
              {COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute -translate-y-1/2 pointer-events-none right-4 top-1/2 text-slate-400"
            />
          </div>
          <button
            onClick={() => fetchRealNews(selectedRegion)}
            disabled={loading}
            className="p-3 text-white transition-all shadow-md bg-slate-950 dark:bg-white dark:text-slate-950 rounded-2xl hover:bg-blue-600 hover:text-white group disabled:opacity-50"
          >
            <RefreshCcw
              size={18}
              className={`${
                loading
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 animate-pulse"
                />
              ))
          : news.map((item: any, i: number) => (
              <div
                key={i}
                className="group p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-500 flex flex-col justify-between shadow-sm hover:shadow-2xl"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-[9px] font-black text-blue-600 uppercase tracking-widest rounded-full">
                      {selectedRegion}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        Verified
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl italic font-black leading-tight tracking-tight transition-colors md:text-2xl text-slate-900 dark:text-white group-hover:text-blue-600 line-clamp-3">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100 dark:border-white/5">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                      Bureau
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate max-w-[120px]">
                      {item.source}
                    </p>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 transition-all shadow-inner rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950"
                  >
                    <ArrowUpRight size={20} />
                  </a>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default NewsTerminal;
