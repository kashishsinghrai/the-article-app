import React, { useState, useMemo } from "react";
/* Added Clock to the lucide-react imports */
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
  MessageSquare,
  Shield,
  HelpCircle,
  Clock,
} from "lucide-react";
import { Article, Category, Profile } from "../types";
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
  allUsers?: Profile[]; // Added to find random chat partners
  onChat?: (user: Profile) => void; // Added for random chat action
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
  allUsers = [],
  onChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All"
  );

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "All") return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  const startRandomChat = () => {
    if (!isLoggedIn) {
      onLogin();
      return;
    }
    const otherUsers = allUsers.filter(
      (u) => u.id !== currentUserId && u.is_online
    );
    if (otherUsers.length === 0) {
      toast.error("No other reporters are online right now. Try again later!", {
        icon: "📡",
        style: { background: "#0f172a", color: "#fff", borderRadius: "15px" },
      });
      return;
    }
    const randomUser =
      otherUsers[Math.floor(Math.random() * otherUsers.length)];
    onChat?.(randomUser);
    toast.success(`Connecting to ${randomUser.full_name}...`, { icon: "⚡" });
  };

  if (!isLoggedIn && !isArchive) {
    return (
      <main className="flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* Bold Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center py-24 px-6 max-w-7xl mx-auto text-center animate-in fade-in duration-1000">
          <div className="inline-flex items-center gap-3 px-8 py-3 mb-10 text-white bg-blue-600 rounded-full shadow-2xl shadow-blue-600/40">
            <Star
              size={20}
              className="fill-current animate-pulse"
              strokeWidth={3}
            />
            <span className="text-[12px] font-black uppercase tracking-[0.3em]">
              Verified Global News Network
            </span>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-[11rem] font-black text-slate-950 dark:text-white tracking-tighter mb-12 leading-[0.85] italic uppercase">
            The World <br /> <span className="text-blue-600">Untangled.</span>
          </h1>

          <p className="max-w-3xl mx-auto mb-16 text-xl font-bold leading-relaxed text-slate-700 dark:text-slate-400 md:text-3xl">
            Real news shared by real people. Join the community of trusted
            reporters and get the truth directly.
          </p>

          <div className="flex flex-col items-center w-full max-w-2xl gap-8 sm:flex-row">
            <button
              onClick={onLogin}
              className="flex-1 group relative inline-flex items-center justify-center gap-5 bg-slate-950 dark:bg-white dark:text-slate-950 text-white px-12 py-7 rounded-[2.5rem] text-xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] active:scale-95"
            >
              Start Reading
              <ArrowRight
                size={28}
                strokeWidth={3}
                className="transition-transform group-hover:translate-x-2"
              />
            </button>
            <button
              onClick={startRandomChat}
              className="flex-1 flex items-center justify-center gap-4 px-12 py-7 rounded-[2.5rem] border-4 border-slate-950 dark:border-white text-slate-950 dark:text-white text-xl font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all shadow-xl"
            >
              <MessageSquare size={24} strokeWidth={3} /> Chat Now
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-12 mt-24 opacity-60">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-blue-600" />{" "}
              <span className="font-black uppercase tracking-widest text-[11px]">
                Secure Connection
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-emerald-500" />{" "}
              <span className="font-black uppercase tracking-widest text-[11px]">
                Private Chat
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-amber-500" />{" "}
              <span className="font-black uppercase tracking-widest text-[11px]">
                Real-time News
              </span>
            </div>
          </div>
        </section>

        <section className="w-full px-6 mx-auto mb-32 space-y-32 max-w-7xl">
          <div className="bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[4rem] shadow-2xl border-4 border-slate-900/5 dark:border-white/5">
            <NewsTerminal />
          </div>

          <div className="bg-blue-600 p-12 md:p-24 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_32px_64px_rgba(37,99,235,0.3)]">
            <div className="max-w-xl space-y-6">
              <h2 className="text-4xl italic font-black leading-none tracking-tighter uppercase md:text-7xl">
                Instant <br /> Connections
              </h2>
              <p className="text-lg font-bold leading-relaxed md:text-xl opacity-90">
                Connect with any reporter worldwide instantly. Private,
                encrypted, and completely anonymous if you choose. Full control
                in your hands.
              </p>
            </div>
            <button
              onClick={startRandomChat}
              className="px-12 text-lg font-black tracking-widest text-blue-600 uppercase transition-all bg-white rounded-full shadow-2xl py-7 hover:scale-105"
            >
              Quick Chat{" "}
              <MessageSquare
                size={24}
                className="inline ml-2"
                strokeWidth={3}
              />
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="px-6 py-12 mx-auto space-y-24 max-w-7xl md:py-24 bg-slate-50 dark:bg-slate-950">
      {/* Featured News Section */}
      <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[4rem] shadow-2xl border-2 border-slate-900/5 dark:border-white/5">
        <NewsTerminal />
      </div>

      {/* Random Connection Banner for Logged-In Users */}
      <div className="bg-slate-950 dark:bg-white p-10 md:p-14 rounded-[4.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
            <Globe size={40} strokeWidth={3} />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl italic font-black tracking-tighter text-white uppercase md:text-4xl dark:text-slate-950">
              Global Connection
            </h3>
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Connect with a random reporter for a private secure discussion.
            </p>
          </div>
        </div>
        <button
          onClick={startRandomChat}
          className="relative z-10 w-full px-12 py-5 text-sm font-black tracking-widest text-white uppercase transition-all bg-blue-600 rounded-full shadow-xl md:w-auto dark:text-white hover:bg-blue-700 shadow-blue-600/30 active:scale-95"
        >
          Connect Securely{" "}
          <Zap size={18} className="inline ml-2" strokeWidth={3} />
        </button>
      </div>

      <div id="latest-stories" className="scroll-mt-32">
        <div className="flex flex-col items-start justify-between gap-10 mb-20 border-b-8 md:flex-row md:items-end border-slate-950 dark:border-white pb-14">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-600">
              <TrendingUp size={32} strokeWidth={4} />
              <span className="text-[14px] font-black uppercase tracking-[0.4em]">
                Hot Stories
              </span>
            </div>
            <h2 className="text-6xl italic font-black leading-none tracking-tighter uppercase md:text-9xl text-slate-950 dark:text-white">
              {isArchive ? "Archives" : "News Feed"}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-[2.5rem] shadow-xl border-2 border-slate-100 dark:border-white/5">
            <FilterTag
              label="All Stories"
              active={selectedCategory === "All"}
              onClick={() => setSelectedCategory("All")}
            />
            <FilterTag
              label="Deep Dive"
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
          <div className="py-40 text-center">
            <Newspaper
              size={100}
              className="mx-auto mb-10 text-slate-200 dark:text-slate-800"
              strokeWidth={1}
            />
            <p className="text-3xl italic font-black tracking-widest uppercase text-slate-400">
              No stories published yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer bg-white dark:bg-slate-900 p-10 rounded-[4rem] border-4 border-slate-100 dark:border-white/5 hover:border-blue-600 transition-all duration-500 flex flex-col shadow-lg hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)]"
                onClick={() => onReadArticle?.(article)}
              >
                <div className="aspect-[16/10] overflow-hidden rounded-[3rem] mb-10 relative border-2 border-slate-100 dark:border-white/10 shadow-inner">
                  <img
                    src={
                      article.image_url ||
                      "https://images.unsplash.com/photo-1585829365234-781fcd04c83e?auto=format&fit=crop&q=80&w=800"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]"
                    alt={article.title}
                  />
                  <div className="absolute top-8 left-8 bg-blue-600 text-white px-6 py-2.5 rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl">
                    {article.category}
                  </div>
                </div>

                <div className="flex flex-col flex-grow space-y-8">
                  <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-widest text-slate-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(article.author_id);
                      }}
                      className="flex items-center gap-3 transition-colors hover:text-blue-600"
                    >
                      <div className="flex items-center justify-center w-8 h-8 text-blue-600 rounded-full bg-slate-100 dark:bg-slate-800">
                        <Users size={16} strokeWidth={3} />
                      </div>
                      {article.author_name}
                    </button>
                    <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-1.5 rounded-full">
                      <Clock
                        size={16}
                        className="text-amber-500"
                        strokeWidth={3}
                      />{" "}
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xl italic font-bold leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3 opacity-80">
                    {article.content}
                  </p>

                  <div className="flex items-center justify-between pt-10 mt-auto border-t-4 border-slate-100 dark:border-white/5">
                    <span className="flex items-center gap-3 text-sm font-black tracking-widest text-blue-600 uppercase transition-all group-hover:gap-6">
                      Read Full News <ArrowRight size={22} strokeWidth={3} />
                    </span>

                    {(userRole === "admin" ||
                      currentUserId === article.author_id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this story forever?"))
                            onDelete(article.id);
                        }}
                        className="p-4 text-white transition-all bg-red-600 shadow-xl rounded-3xl hover:bg-slate-950 dark:hover:bg-white dark:hover:text-slate-950"
                      >
                        <Trash2 size={24} strokeWidth={3} />
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
    className={`px-10 py-4 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-blue-600 text-white shadow-2xl scale-105"
        : "text-slate-500 hover:text-slate-950 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default HomePage;
