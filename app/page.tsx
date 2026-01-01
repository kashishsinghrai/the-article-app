import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  Tag,
  BookOpen,
  Search,
  BarChart3,
  Map,
  Zap,
  Globe,
  Newspaper,
  Trash2,
  TrendingUp,
  Lock,
  Users,
  Star,
  ShieldCheck,
  PenSquare,
} from "lucide-react";
import { Article, Category } from "../types";
import { toast } from "react-hot-toast";
import TrendingTopics from "../components/TrendingTopics";
import NewsTerminal from "../components/NewsTerminal";

interface HomePageProps {
  articles: Article[];
  isLoggedIn: boolean;
  onLogin: () => void;
  userRole: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onViewProfile: (id: string) => void;
  onReadArticle?: (article: Article) => void;
  isArchive?: boolean;
  currentUserId?: string;
}

const HomePage: React.FC<HomePageProps> = ({
  articles,
  isLoggedIn,
  onLogin,
  userRole,
  onDelete,
  onViewProfile,
  onReadArticle,
  isArchive = false,
  currentUserId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All"
  );

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "All") return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  if (!isLoggedIn && !isArchive) {
    return (
      <main className="flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* Simplified Hero */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center py-24 px-6 max-w-7xl mx-auto text-center animate-in fade-in duration-1000">
          <div className="inline-flex items-center gap-2 px-6 py-3 mb-10 text-white bg-blue-600 rounded-full shadow-xl shadow-blue-600/30">
            <Star size={16} className="fill-current" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">
              Verified News for Everyone
            </span>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black text-slate-950 dark:text-white tracking-tighter mb-10 leading-[0.85] italic uppercase transition-all">
            The News <br /> <span className="text-blue-600">You Trust.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl font-bold leading-relaxed text-slate-700 dark:text-slate-400 md:text-2xl mb-14">
            Read stories shared by real people. No fake news, no corporate bias.
            Just facts.
          </p>

          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <button
              onClick={onLogin}
              className="relative inline-flex items-center gap-4 px-12 py-6 text-lg font-black tracking-widest text-white uppercase transition-all rounded-full shadow-2xl group bg-slate-950 dark:bg-white dark:text-slate-950 hover:bg-blue-600 hover:text-white active:scale-95"
            >
              Start Reading
              <ArrowRight size={24} />
            </button>
            <button
              onClick={() => onLogin()}
              className="px-12 py-6 font-black tracking-widest uppercase transition-all border-4 rounded-full border-slate-900 dark:border-white text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900"
            >
              Join Us
            </button>
          </div>
        </section>

        <section className="w-full px-6 mx-auto mb-32 space-y-32 max-w-7xl">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] shadow-2xl border border-slate-200 dark:border-white/5">
            <NewsTerminal />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="px-6 py-12 mx-auto space-y-24 max-w-7xl md:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[4rem] shadow-2xl border border-slate-200 dark:border-white/5">
        <NewsTerminal />
      </div>

      <div id="latest-stories" className="scroll-mt-32">
        <div className="flex flex-col items-start justify-between gap-10 mb-20 border-b-4 md:flex-row md:items-end border-slate-950 dark:border-white pb-14">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp size={24} strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-[0.4em]">
                Latest Stories
              </span>
            </div>
            <h2 className="text-6xl italic font-black leading-none tracking-tighter uppercase md:text-8xl text-slate-950 dark:text-white">
              {isArchive ? "Archives" : "News Feed"}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-xl border border-slate-200 dark:border-white/5">
            <FilterTag
              label="All Stories"
              active={selectedCategory === "All"}
              onClick={() => setSelectedCategory("All")}
            />
            <FilterTag
              label="Investigative"
              active={selectedCategory === "Investigative"}
              onClick={() => setSelectedCategory("Investigative")}
            />
            <FilterTag
              label="Economics"
              active={selectedCategory === "Economic"}
              onClick={() => setSelectedCategory("Economic")}
            />
            <FilterTag
              label="Regional"
              active={selectedCategory === "Regional"}
              onClick={() => setSelectedCategory("Regional")}
            />
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="py-40 text-center">
            <Newspaper
              size={80}
              className="mx-auto mb-8 text-slate-200 dark:text-slate-800"
            />
            <p className="text-2xl font-black tracking-widest uppercase text-slate-400">
              No news articles found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border-2 border-slate-100 dark:border-white/5 hover:border-blue-600 transition-all duration-500 flex flex-col shadow-lg hover:shadow-2xl"
                onClick={() => onReadArticle?.(article)}
              >
                <div className="aspect-video overflow-hidden rounded-[2.5rem] mb-8 relative border border-slate-100 dark:border-white/10">
                  <img
                    src={
                      article.image_url ||
                      "https://images.unsplash.com/photo-1585829365234-781fcd04c83e?auto=format&fit=crop&q=80&w=800"
                    }
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                    alt={article.title}
                  />
                  <div className="absolute top-6 left-6 bg-blue-600 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl">
                    {article.category}
                  </div>
                </div>

                <div className="flex flex-col flex-grow space-y-6">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(article.author_id);
                      }}
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      <Users size={14} /> {article.author_name}
                    </button>
                    <span className="flex items-center gap-2">
                      <Zap size={14} className="text-amber-500" />{" "}
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-3xl italic font-black leading-tight tracking-tight uppercase transition-colors md:text-4xl text-slate-950 dark:text-white group-hover:text-blue-600">
                    {article.title}
                  </h3>

                  <p className="text-lg font-bold leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                    {article.content}
                  </p>

                  <div className="flex items-center justify-between pt-8 mt-auto border-t-2 border-slate-100 dark:border-white/5">
                    <span className="flex items-center gap-2 text-xs font-black tracking-widest text-blue-600 uppercase transition-all group-hover:gap-4">
                      Read Full Story <ArrowRight size={18} />
                    </span>

                    {(userRole === "admin" ||
                      currentUserId === article.author_id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure? This cannot be undone."))
                            onDelete(article.id);
                        }}
                        className="p-3 text-white transition-all bg-red-600 shadow-lg rounded-2xl hover:bg-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

const FilterTag = ({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-blue-600 text-white shadow-xl"
        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default HomePage;
