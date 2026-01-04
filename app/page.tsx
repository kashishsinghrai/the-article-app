import React, { useMemo, useState } from "react";
import {
  Globe,
  RefreshCcw,
  WifiOff,
  Zap,
  Fingerprint,
  Network,
  ShieldCheck,
  ArrowRight,
  Star,
  Loader2,
  Activity,
} from "lucide-react";
import { Article, Category } from "../types";
import TrendingTopics from "../components/TrendingTopics";
import NewsTerminal from "../components/NewsTerminal";

interface HomePageProps {
  articles: Article[];
  isLoggedIn: boolean;
  onLogin: () => void;
  onReadArticle?: (article: Article) => void;
  onRefresh?: () => void;
}

const InstructionBlock = ({
  num,
  icon,
  title,
  desc,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="space-y-10 p-12 bg-slate-50 dark:bg-slate-900 rounded-[3.5rem] border border-white/5 transition-all hover:border-blue-500/50 group hover:shadow-2xl">
    <div className="flex items-start justify-between">
      <div className="text-blue-600 transition-transform duration-700 group-hover:scale-125">
        {icon}
      </div>
      <span className="text-5xl italic font-black text-slate-800">{num}</span>
    </div>
    <div className="space-y-5">
      <h4 className="text-3xl italic font-black tracking-tighter uppercase dark:text-white">
        {title}
      </h4>
      <p className="text-sm font-bold leading-relaxed uppercase text-slate-400">
        {desc}
      </p>
    </div>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({
  articles = [],
  isLoggedIn,
  onLogin,
  onReadArticle,
  onRefresh,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 800);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="px-8 pb-40 space-y-32 duration-1000 animate-in fade-in">
        <div className="max-w-5xl pt-24 space-y-10">
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-5 py-2.5 rounded-full w-fit">
            <ShieldCheck size={16} className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
              Entry Protocol
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] dark:text-white uppercase italic">
            ThE-ARTICLES <br />
            <span className="text-slate-800">CITIZEN FRONT.</span>
          </h1>
          <p className="max-w-2xl text-xl italic font-bold text-slate-400 md:text-2xl">
            The truth is decentralized. Join the global registry of verified
            correspondents bypassing gatekeeper control.
          </p>
          <div className="flex flex-col gap-5 pt-6 sm:flex-row">
            <button
              onClick={onLogin}
              className="px-12 py-6 text-xs font-black tracking-widest transition-all bg-white text-slate-950 rounded-2xl hover:scale-105 active:scale-95"
            >
              Initialize Identity
            </button>
            <button className="px-12 py-6 text-xs font-black tracking-widest uppercase bg-transparent border-2 border-white/10 text-slate-400 rounded-2xl">
              Ethics Charter
            </button>
          </div>
        </div>
        <section className="space-y-16">
          <div className="pb-8 border-b-4 border-white">
            <h2 className="text-4xl italic font-black uppercase md:text-6xl dark:text-white">
              Briefing
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <InstructionBlock
              num="01"
              icon={<Fingerprint size={32} />}
              title="Forge"
              desc="Establish a Node Signature encrypted by the platform core."
            />
            <InstructionBlock
              num="02"
              icon={<Network size={32} />}
              title="Transmit"
              desc="Broadcast directly to the global wire, bypassing gatekeepers."
            />
            <InstructionBlock
              num="03"
              icon={<Zap size={32} />}
              title="Validate"
              desc="Earn reputation through factual peer-reviewed accuracy."
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="px-6 pb-40 space-y-24">
      <header className="flex flex-col items-end justify-between gap-10 pt-12 md:flex-row">
        <div className="space-y-4">
          <h2 className="text-7xl md:text-8xl font-black italic uppercase dark:text-white leading-[0.85]">
            Intelligence <br />
            <span className="text-blue-600">Hub</span>
          </h2>
          <div className="flex items-center gap-5">
            <Activity size={12} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase">
              Network Operational
            </span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-3 px-10 py-5 bg-slate-900 border border-white/5 rounded-2xl transition-all shadow-sm hover:shadow-xl ${
            isRefreshing ? "opacity-50" : ""
          }`}
        >
          <span className="text-[10px] font-black uppercase text-slate-400">
            Sync Shards
          </span>
          {isRefreshing ? (
            <Loader2 size={18} className="text-blue-600 animate-spin" />
          ) : (
            <RefreshCcw
              size={18}
              className="transition-transform text-slate-400"
            />
          )}
        </button>
      </header>
      <TrendingTopics />
      <NewsTerminal />
      <section className="space-y-20">
        <div className="flex flex-col justify-between gap-10 pb-12 border-b-4 border-white md:flex-row">
          <div className="space-y-3">
            <h3 className="text-5xl italic font-black uppercase dark:text-white">
              Field Reports
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase">
              Peer-verified internal documentation
            </p>
          </div>
          <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
            {(
              ["All", "Investigative", "Economic", "Regional"] as Category[]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${
                  activeCategory === cat
                    ? "bg-white text-slate-950 shadow-2xl"
                    : "text-slate-400 border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-32">
          {filteredArticles.length === 0 ? (
            <div className="py-40 text-center col-span-full opacity-20">
              <WifiOff size={64} className="mx-auto" />
              <p className="text-sm font-black uppercase">Local Shard Empty</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="space-y-8 cursor-pointer group"
                onClick={() => onReadArticle?.(article)}
              >
                <div className="relative aspect-[16/10] rounded-[3.5rem] overflow-hidden border border-white/5 bg-slate-900 shadow-sm transition-all duration-700">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                      alt=""
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Globe size={64} className="text-slate-800" />
                    </div>
                  )}
                  <div className="absolute top-10 left-10">
                    <span className="px-6 py-2 bg-slate-950/95 backdrop-blur-xl rounded-full text-[10px] font-black text-blue-600 uppercase border border-white/20">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="px-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      NODE: {article.author_serial}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase italic">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-4xl italic font-black leading-tight uppercase transition-colors md:text-5xl dark:text-white group-hover:text-blue-600">
                    {article.title}
                  </h3>
                  <p className="pl-8 text-xl italic font-medium border-l-4 text-slate-400 line-clamp-2 border-slate-800">
                    "{article.content}"
                  </p>
                  <div className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-2.5">
                      <Star size={16} className="fill-current text-amber-500" />
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        Verified Dispatch
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-600 font-black text-[11px] uppercase opacity-0 group-hover:opacity-100 transition-all">
                      Packet <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
