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
        <section className="min-h-[70vh] flex flex-col items-center justify-center py-16 md:py-20 px-4 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-blue-600 border border-blue-100 rounded-full bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400">
            <Zap size={14} className="animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
              Decentralized News Network
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-slate-900 dark:text-white tracking-[-0.05em] md:tracking-[-0.07em] mb-6 md:mb-8 uppercase italic leading-[0.9] md:leading-[0.85] transition-all">
            Uncover <br className="hidden md:block" />{" "}
            <span className="text-blue-600">Truth</span>
          </h1>
          <p className="max-w-md px-4 mx-auto mb-10 text-sm italic font-medium md:max-w-xl text-slate-500 dark:text-slate-400 md:text-base md:mb-12">
            A global network of verified nodes delivering transparent,
            peer-to-peer authenticated reporting.
          </p>
          <button
            onClick={onLogin}
            className="group relative inline-flex items-center gap-3 md:gap-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 md:px-14 py-4 md:py-6 rounded-full text-sm md:text-lg font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
          >
            Access Network Terminal
            <ArrowRight
              size={18}
              className="transition-transform md:w-5 md:h-5 group-hover:translate-x-2"
            />
          </button>
        </section>

        <section className="px-4 mx-auto mb-24 space-y-16 max-w-7xl md:px-6 md:mb-32 md:space-y-32">
          <NewsTerminal />
          <div className="pt-16 border-t border-slate-100 dark:border-white/5 md:pt-20">
            <TrendingTopics />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 py-16 mx-auto space-y-16 max-w-7xl md:px-6 md:py-32 md:space-y-32">
      <NewsTerminal />

      <div id="global-wire" className="scroll-mt-32">
        <div className="flex flex-col items-start justify-between gap-6 pb-8 mb-12 border-b md:flex-row md:items-end md:gap-8 md:mb-24 border-slate-100 dark:border-white/5 md:pb-12">
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp size={16} />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                Dispatch Feed
              </span>
            </div>
            <h2 className="text-3xl italic font-black leading-none tracking-tighter uppercase md:text-7xl text-slate-900 dark:text-white">
              {isArchive ? "Archive" : "Global Wire"}
            </h2>
          </div>
          <div className="flex gap-1.5 md:gap-2 flex-wrap">
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
              label="Regional"
              active={selectedCategory === "Regional"}
              onClick={() => setSelectedCategory("Regional")}
            />
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="py-20 text-center md:py-40 opacity-30">
            <Globe
              size={40}
              className="mx-auto mb-6 md:w-12 md:h-12 text-slate-300"
            />
            <p className="text-lg italic font-black tracking-widest uppercase md:text-2xl text-slate-400">
              Awaiting Dispatch
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-16">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer bg-white dark:bg-slate-900/40 p-3 md:p-8 rounded-3xl md:rounded-[3rem] border border-slate-100 dark:border-white/5 hover:border-blue-600 dark:hover:border-blue-600 transition-all duration-500 relative flex flex-col overflow-hidden"
                onClick={() => onReadArticle?.(article)}
              >
                <div className="aspect-[16/10] rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-5 md:mb-8 relative shadow-sm">
                  <img
                    src={
                      article.image_url ||
                      "https://images.unsplash.com/photo-1585829365234-781fcd04c83e?auto=format&fit=crop&q=80&w=800"
                    }
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105 grayscale md:group-hover:grayscale-0"
                    alt={article.title}
                  />

                  <div className="absolute flex gap-2 top-3 left-3 md:top-6 md:left-6">
                    <div
                      className={`${getCategoryColor(
                        article.category
                      )} text-white px-3 py-1 md:py-1.5 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 shadow-lg`}
                    >
                      {getCategoryIcon(article.category, 10)} {article.category}
                    </div>
                    {article.is_private && (
                      <div className="bg-amber-600 text-white px-3 py-1 md:py-1.5 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 shadow-lg">
                        <Lock size={10} /> Private
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center transition-colors bg-slate-900/0 group-hover:bg-slate-900/20">
                    <div className="flex items-center justify-center w-10 h-10 transition-all scale-90 bg-white rounded-full shadow-2xl opacity-0 text-slate-900 md:w-16 md:h-16 group-hover:opacity-100 group-hover:scale-100">
                      <BookOpen size={18} className="md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col flex-grow px-1 space-y-3 md:space-y-4 md:px-0">
                  <div className="flex justify-between items-center text-[7px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(article.author_id);
                      }}
                      className="cursor-pointer hover:text-blue-600"
                    >
                      NODE: {article.author_name}
                    </span>
                    <span>
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-3xl font-black text-slate-900 dark:text-white leading-[1.2] md:leading-[1.1] uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs italic font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:text-sm line-clamp-2">
                    {article.content}
                  </p>
                </div>

                {(userRole === "admin" ||
                  currentUserId === article.author_id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Purge this record?")) onDelete(article.id);
                    }}
                    className="absolute z-10 p-2 text-red-600 transition-all opacity-0 bottom-4 right-4 md:bottom-6 md:right-6 md:p-3 bg-red-600/10 rounded-xl md:rounded-2xl hover:bg-red-600 hover:text-white group-hover:opacity-100"
                  >
                    <Trash2 size={14} className="md:w-4 md:h-4" />
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
    className={`px-4 py-2 md:px-8 md:py-3 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${
      active
        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg"
        : "bg-transparent text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default HomePage;
