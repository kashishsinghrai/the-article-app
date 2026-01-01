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

  const getCategoryIcon = (cat: Category, size = 12) => {
    switch (cat) {
      case "Investigative":
        return <Search size={size} />;
      case "Economic":
        return <BarChart3 size={size} />;
      case "Regional":
        return <Map size={size} />;
      default:
        return <Tag size={size} />;
    }
  };

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case "Investigative":
        return "bg-blue-600";
      case "Economic":
        return "bg-emerald-600";
      case "Regional":
        return "bg-amber-500";
      default:
        return "bg-slate-900";
    }
  };

  if (!isLoggedIn && !isArchive) {
    return (
      <main className="flex flex-col">
        <section className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400">
            <Zap size={14} className="animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">
              Decentralized Journalism Network
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-slate-900 dark:text-white tracking-[-0.07em] mb-8 uppercase italic leading-[0.85] transition-all">
            Uncover <br className="hidden md:block" />{" "}
            <span className="text-blue-600">The News</span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 text-sm md:text-base mb-12 font-medium italic">
            Global network of verified nodes delivering transparent,
            peer-to-peer verified reporting.
          </p>
          <button
            onClick={onLogin}
            className="group relative inline-flex items-center gap-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 md:px-14 py-4 md:py-6 rounded-full text-sm md:text-lg font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95"
          >
            Access Network Terminal
            <ArrowRight
              size={20}
              className="group-hover:translate-x-2 transition-transform"
            />
          </button>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-32 space-y-20 md:space-y-32">
          <NewsTerminal />
          <div className="border-t border-slate-100 dark:border-white/5 pt-20">
            <TrendingTopics />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 space-y-20 md:space-y-32">
      <NewsTerminal />

      <div id="global-wire">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24 border-b border-slate-100 dark:border-white/5 pb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Global Dispatch Feed
              </span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
              {isArchive ? "Network Archive" : "Live Global Wire"}
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            <FilterTag
              label="All"
              active={selectedCategory === "All"}
              onClick={() => setSelectedCategory("All")}
            />
            <FilterTag
              label="Investigative"
              active={selectedCategory === "Investigative"}
              onClick={() => setSelectedCategory("Investigative")}
            />
            <FilterTag
              label="Economic"
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
          <div className="py-24 md:py-40 text-center opacity-30">
            <Globe size={48} className="mx-auto mb-6 text-slate-300" />
            <p className="text-xl md:text-2xl font-black uppercase italic tracking-widest text-slate-400">
              Awaiting Node Dispatch
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer bg-white dark:bg-white/5 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-white/5 hover:border-blue-600 dark:hover:border-blue-600 transition-all duration-500 relative flex flex-col"
                onClick={() => onReadArticle?.(article)}
              >
                <div className="aspect-[16/10] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-6 md:mb-8 relative shadow-sm">
                  <img
                    src={
                      article.image_url ||
                      "https://images.unsplash.com/photo-1585829365234-781fcd04c83e?auto=format&fit=crop&q=80&w=800"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                    alt={article.title}
                  />

                  <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <div
                      className={`${getCategoryColor(
                        article.category
                      )} text-white px-4 py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl`}
                    >
                      {getCategoryIcon(article.category)} {article.category}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                    <div className="bg-white text-slate-900 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-2xl">
                      <BookOpen size={20} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(article.author_id);
                      }}
                      className="hover:text-blue-600 cursor-pointer"
                    >
                      NODE: {article.author_name}
                    </span>
                    <span>
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-[1.1] uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm line-clamp-2 italic leading-relaxed">
                    {article.content}
                  </p>
                </div>

                {userRole === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Purge this record?")) onDelete(article.id);
                    }}
                    className="absolute bottom-6 right-6 p-3 bg-red-600/10 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
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
    className={`px-5 py-2 md:px-8 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${
      active
        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg"
        : "bg-transparent text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default HomePage;
