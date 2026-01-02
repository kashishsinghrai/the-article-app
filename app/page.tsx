import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Globe,
  ShieldCheck,
  PenSquare,
  MessageSquare,
  Volume2,
  Newspaper,
  Hash,
  UserPlus,
  Fingerprint,
  Network as NetworkIcon,
  Trash2,
  Edit,
  RefreshCcw,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Filter,
} from "lucide-react";
import { Article, Category, Profile } from "../types";
import NewsTerminal from "../components/NewsTerminal";

interface HomePageProps {
  articles: Article[];
  isLoggedIn: boolean;
  onLogin: () => void;
  userRole: string;
  onDelete: (id: string) => void;
  onEdit: (article: Article) => void;
  onViewProfile?: (id: string) => void;
  onReadArticle?: (article: Article) => void;
  isArchive?: boolean;
  onRefresh?: () => void;
  onInteraction?: (type: "like" | "dislike", articleId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  articles,
  isLoggedIn,
  onLogin,
  userRole,
  onDelete,
  onEdit,
  onViewProfile,
  onReadArticle,
  isArchive = false,
  onRefresh,
  onInteraction,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isAdmin = userRole === "admin";

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1504711432869-efd597cdd0bf?auto=format&fit=crop&q=80&w=1000";
  };

  if (!isLoggedIn && !isArchive) {
    return (
      <main className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
        <section className="flex flex-col items-center max-w-5xl px-8 pt-40 pb-32 mx-auto space-y-12 text-center">
          <div className="flex items-center gap-2 px-3 py-1 border rounded-full border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <Volume2 size={12} className="text-slate-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Restoring Authority Through Presence
            </span>
          </div>
          <h1 className="text-6xl md:text-9xl font-bold text-slate-950 dark:text-white tracking-tight leading-[0.9]">
            The platform <br /> for{" "}
            <span className="text-slate-400">truth.</span>
          </h1>
          <p className="max-w-xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:text-xl">
            A high-end, minimal space where the youth publishes perspectives and
            connects through private, secure dialogue.
          </p>
          <div className="flex w-full max-w-sm gap-4">
            <button
              onClick={onLogin}
              className="flex-1 py-4 text-sm font-bold tracking-widest text-white uppercase transition-all bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl hover:opacity-90"
            >
              Join Now
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("journey")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Instruction
            </button>
          </div>
        </section>

        <section
          id="journey"
          className="px-8 py-40 overflow-hidden bg-slate-50/50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900"
        >
          <div className="max-w-6xl mx-auto space-y-24">
            <div className="space-y-4 text-center">
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-blue-600">
                The Operations Cycle
              </h2>
              <h3 className="text-4xl italic font-black tracking-tighter uppercase md:text-6xl dark:text-white">
                How it works
              </h3>
            </div>
            <div className="relative flex flex-col items-center justify-between gap-16 md:flex-row md:gap-4">
              <JourneyStep
                num="01"
                icon={<UserPlus size={24} />}
                label="Register"
                desc="Establish your node in the network via encrypted signup."
              />
              <JourneyStep
                num="02"
                icon={<Fingerprint size={24} />}
                label="Identify"
                desc="Download your unique Digital Press ID to verify presence."
              />
              <JourneyStep
                num="03"
                icon={<PenSquare size={24} />}
                label="Publish"
                desc="Release field reports with AI-powered objectivity checks."
              />
              <JourneyStep
                num="04"
                icon={<NetworkIcon size={24} />}
                label="Connect"
                desc="Establish secure P2P links for private correspondence."
              />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="px-8 py-24 mx-auto space-y-24 max-w-7xl">
      <div className="pt-10">
        <NewsTerminal />
      </div>

      <section className="space-y-12">
        <div className="flex flex-col items-start justify-between gap-8 pb-10 border-b md:flex-row md:items-end border-slate-50 dark:border-slate-900">
          <div className="space-y-6">
            <h2 className="text-5xl italic font-bold tracking-tighter uppercase dark:text-white">
              Feed
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {(
                ["All", "Investigative", "Economic", "Regional"] as Category[]
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    activeCategory === cat
                      ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950"
                      : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-slate-100 transition-all shadow-sm"
          >
            <RefreshCcw
              size={14}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "Syncing..." : "Refresh Feed"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {filteredArticles.length === 0 ? (
            <div className="py-40 text-center col-span-full opacity-20">
              <p className="text-xs font-black tracking-widest uppercase">
                No dispatches found in this sector.
              </p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div key={article.id} className="relative space-y-6 group">
                {article.image_url && article.image_url.trim() !== "" ? (
                  <div
                    className="aspect-[16/9] overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 relative cursor-pointer"
                    onClick={() => onReadArticle?.(article)}
                  >
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                      onError={handleImgError}
                    />

                    {isAdmin && (
                      <div
                        className="absolute flex gap-2 top-4 right-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onEdit(article)}
                          className="p-3 text-blue-600 transition-all shadow-xl bg-white/90 dark:bg-slate-950/90 rounded-2xl backdrop-blur-md hover:scale-110"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(article.id)}
                          className="p-3 text-red-600 transition-all shadow-xl bg-white/90 dark:bg-slate-950/90 rounded-2xl backdrop-blur-md hover:scale-110"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  isAdmin && (
                    <div className="flex justify-end gap-2 mb-2">
                      <button
                        onClick={() => onEdit(article)}
                        className="p-2 text-blue-600 border bg-slate-50 dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(article.id)}
                        className="p-2 text-red-600 border bg-slate-50 dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )
                )}

                <div className="px-2 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                        {article.category}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 text-[9px] font-black">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInteraction?.("like", article.id);
                        }}
                        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUp size={12} /> {article.likes_count || 0}
                      </button>
                      <div
                        className="flex items-center gap-1.5 cursor-pointer"
                        onClick={() => onReadArticle?.(article)}
                      >
                        <MessageCircle size={12} />{" "}
                        {article.comments_count || 0}
                      </div>
                    </div>
                  </div>

                  <div
                    className="space-y-4 cursor-pointer"
                    onClick={() => onReadArticle?.(article)}
                  >
                    <h3 className="text-3xl italic font-black leading-tight tracking-tighter uppercase transition-colors md:text-4xl dark:text-white group-hover:text-blue-600">
                      {article.title}
                    </h3>
                    <p className="italic font-medium leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
                      "{article.content}"
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

const JourneyStep = ({ num, icon, label, desc }: any) => (
  <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-[200px]">
    <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-center text-slate-900 dark:text-white">
      {icon}
    </div>
    <div className="space-y-2">
      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
        {num} // {label}
      </h4>
      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase leading-relaxed">
        {desc}
      </p>
    </div>
  </div>
);

export default HomePage;
