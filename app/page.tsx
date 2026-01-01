import React, { useState, useMemo } from "react";
// Added ShieldCheck to fix the missing icon name error
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
        {/* Hero Section - Redesigned for clarity */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center py-20 px-6 max-w-7xl mx-auto text-center animate-in fade-in duration-1000">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400">
            <Star size={14} className="fill-current animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
              Trusted Global News Network
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-[0.9] transition-all">
            Real Stories. <br />{" "}
            <span className="italic text-blue-600">Real People.</span>
          </h1>

          <p className="max-w-2xl mx-auto mb-12 text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:text-xl">
            Join a community of honest reporters sharing news from around the
            world. No fake news, just the truth.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <button
              onClick={onLogin}
              className="relative inline-flex items-center gap-4 px-10 py-5 text-base font-bold tracking-widest text-white uppercase transition-all rounded-full shadow-2xl group bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-blue-600 hover:text-white hover:shadow-blue-500/25 active:scale-95"
            >
              Start Reading Now
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-2"
              />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("news-ticker")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-10 py-5 font-bold tracking-widest uppercase transition-all border rounded-full border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-20 opacity-50 md:grid-cols-3 md:gap-16">
            <div className="flex flex-col items-center gap-2">
              <Users size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Global Community
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Verified Content
              </span>
            </div>
            <div className="flex-col items-center hidden gap-2 md:flex">
              <Zap size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Instant Updates
              </span>
            </div>
          </div>
        </section>

        <section
          id="news-ticker"
          className="px-4 mx-auto mb-24 space-y-16 max-w-7xl md:px-6 md:mb-32 md:space-y-32"
        >
          <div className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl">
            <NewsTerminal />
          </div>
          <div className="pt-16 md:pt-20">
            <TrendingTopics />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 py-12 mx-auto space-y-16 max-w-7xl md:px-6 md:py-24 md:space-y-24">
      {/* Featured News Section */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl">
        <NewsTerminal />
      </div>

      <div id="latest-stories" className="scroll-mt-32">
        <div className="flex flex-col items-start justify-between gap-6 pb-8 mb-12 border-b md:flex-row md:items-center md:gap-8 md:mb-16 border-slate-100 dark:border-white/5 md:pb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Latest Stories
              </span>
            </div>
            <h2 className="text-4xl font-black leading-none tracking-tight uppercase md:text-6xl text-slate-900 dark:text-white">
              {isArchive ? "Archive" : "Recent News"}
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full overflow-x-auto max-w-full">
            <FilterTag
              label="All"
              active={selectedCategory === "All"}
              onClick={() => setSelectedCategory("All")}
            />
            <FilterTag
              label="Deep Dives"
              active={selectedCategory === "Investigative"}
              onClick={() => setSelectedCategory("Investigative")}
            />
            <FilterTag
              label="Business"
              active={selectedCategory === "Economic"}
              onClick={() => setSelectedCategory("Economic")}
            />
            <FilterTag
              label="Local"
              active={selectedCategory === "Regional"}
              onClick={() => setSelectedCategory("Regional")}
            />
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="py-32 text-center opacity-30">
            <Newspaper size={48} className="mx-auto mb-6 text-slate-300" />
            <p className="text-xl font-bold tracking-widest uppercase text-slate-400">
              No news to show yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-blue-500 transition-all duration-500 relative flex flex-col overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10"
                onClick={() => onReadArticle?.(article)}
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={
                      article.image_url ||
                      "https://images.unsplash.com/photo-1585829365234-781fcd04c83e?auto=format&fit=crop&q=80&w=800"
                    }
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                    alt={article.title}
                  />

                  <div className="absolute flex gap-2 top-4 left-4">
                    <div
                      className={`${getCategoryColor(
                        article.category
                      )} text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg`}
                    >
                      {getCategoryIcon(article.category, 12)}{" "}
                      {article.category === "Investigative"
                        ? "Deep Dive"
                        : article.category}
                    </div>
                  </div>

                  {article.is_private && (
                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <Lock size={12} /> Only You
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-grow p-8 space-y-6 md:p-10">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(article.author_id);
                      }}
                      className="flex items-center gap-2 transition-colors hover:text-blue-600"
                    >
                      <Users size={12} /> By {article.author_name}
                    </button>
                    <span>
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black leading-tight tracking-tight transition-colors md:text-3xl text-slate-900 dark:text-white group-hover:text-blue-600">
                    {article.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 md:text-base line-clamp-3">
                    {article.content}
                  </p>

                  <div className="flex items-center justify-between pt-6 mt-auto border-t border-slate-50 dark:border-white/5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      Read More <ArrowRight size={14} />
                    </span>

                    {(userRole === "admin" ||
                      currentUserId === article.author_id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              "Are you sure you want to delete this story?"
                            )
                          )
                            onDelete(article.id);
                        }}
                        className="p-2.5 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={16} />
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
    className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
      active
        ? "bg-white dark:bg-slate-700 text-blue-600 shadow-md"
        : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default HomePage;
