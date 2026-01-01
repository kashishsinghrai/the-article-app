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
  MessageSquare,
  Shield,
  HelpCircle,
  Clock,
  Volume2,
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
  allUsers?: Profile[];
  onChat?: (user: Profile) => void;
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
      toast.error("No one is available for a chat right now. Try again soon!", {
        icon: "📡",
        style: {
          background: "#0f172a",
          color: "#fff",
          borderRadius: "15px",
          fontWeight: "bold",
        },
      });
      return;
    }
    const randomUser =
      otherUsers[Math.floor(Math.random() * otherUsers.length)];
    onChat?.(randomUser);
    toast.success(`Securely connecting to ${randomUser.full_name}...`, {
      icon: "⚡",
    });
  };

  if (!isLoggedIn && !isArchive) {
    return (
      <main className="flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* Pivoted Hero: Voice + Connection */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center py-20 px-6 max-w-7xl mx-auto text-center animate-in fade-in duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-8 text-white rounded-full shadow-xl bg-slate-900 dark:bg-white dark:text-slate-900">
            <Volume2 size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              The Platform for Your Voice
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[9rem] font-black text-slate-950 dark:text-white tracking-tighter mb-10 leading-[0.9] italic uppercase">
            Voice Truth. <br />{" "}
            <span className="text-blue-600">Connect Now.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg font-bold leading-relaxed text-slate-600 dark:text-slate-400 md:text-2xl mb-14">
            Publish your stories and chat with people worldwide. <br />A secure
            space where anyone can speak and everyone can listen.
          </p>

          <div className="flex flex-col items-center w-full max-w-xl gap-6 sm:flex-row">
            <button
              onClick={onLogin}
              className="w-full sm:flex-1 group flex items-center justify-center gap-4 bg-blue-600 text-white px-10 py-6 rounded-[2rem] text-lg font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl active:scale-95"
            >
              Start Your Story
              <PenSquare size={22} strokeWidth={3} />
            </button>
            <button
              onClick={startRandomChat}
              className="w-full sm:flex-1 flex items-center justify-center gap-4 px-10 py-6 rounded-[2rem] border-4 border-slate-900 dark:border-white text-slate-900 dark:text-white text-lg font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all"
            >
              <MessageSquare size={22} strokeWidth={3} /> Random Chat
            </button>
          </div>
        </section>

        <section className="w-full px-6 mx-auto mb-32 space-y-24 max-w-7xl">
          <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-200 dark:border-white/5">
            <NewsTerminal />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FeatureCard
              icon={<ShieldCheck size={40} className="text-emerald-500" />}
              title="Private Chat"
              desc="Talk to anyone, anytime. You have 100% control over who sees your data. Encrypted and safe."
            />
            <FeatureCard
              icon={<Newspaper size={40} className="text-blue-600" />}
              title="Be a Reporter"
              desc="Witnessed something? Write about it. Anyone can publish news and gain a following."
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="px-6 py-12 mx-auto space-y-20 max-w-7xl md:py-24 bg-slate-50 dark:bg-slate-950">
      {/* News Ticker Component for users */}
      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-slate-200 dark:border-white/5">
        <NewsTerminal />
      </div>

      {/* Chat Promotion Section */}
      <div className="bg-blue-600 p-10 md:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-48 -mr-48 rounded-full w-96 h-96 bg-white/10 blur-3xl" />
        <div className="relative z-10 max-w-xl space-y-4">
          <h2 className="text-4xl italic font-black leading-none tracking-tighter uppercase md:text-6xl">
            Talk to Anyone <br /> Right Now.
          </h2>
          <p className="text-lg font-bold leading-relaxed opacity-90">
            Connect with people around the world for a private, secure talk.
            Your privacy, your rules.
          </p>
        </div>
        <button
          onClick={startRandomChat}
          className="relative z-10 flex items-center gap-3 px-12 py-6 text-lg font-black tracking-widest text-blue-600 uppercase transition-all bg-white rounded-full shadow-2xl hover:scale-105 active:scale-95"
        >
          Connect Randomly <Zap size={24} strokeWidth={3} />
        </button>
      </div>

      <div id="latest-stories" className="scroll-mt-32">
        <div className="flex flex-col items-start justify-between gap-10 pb-12 mb-16 border-b-4 md:flex-row md:items-end border-slate-950 dark:border-white">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600">
              <TrendingUp size={24} strokeWidth={4} />
              <span className="text-[12px] font-black uppercase tracking-[0.4em]">
                Voices of the People
              </span>
            </div>
            <h2 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-8xl text-slate-950 dark:text-white">
              {isArchive ? "Archives" : "Feed"}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5">
            <FilterTag
              label="Latest"
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
              label="Regional"
              active={selectedCategory === "Regional"}
              onClick={() => setSelectedCategory("Regional")}
            />
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="py-40 text-center opacity-40">
            <Newspaper
              size={80}
              className="mx-auto mb-6 text-slate-300 dark:text-slate-700"
              strokeWidth={1.5}
            />
            <p className="text-2xl italic font-black tracking-widest uppercase text-slate-400">
              No stories published yet.
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
                <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-8 relative border border-slate-100 dark:border-white/10 shadow-inner">
                  <img
                    src={
                      article.image_url ||
                      "https://images.unsplash.com/photo-1585829365234-781fcd04c83e?auto=format&fit=crop&q=80&w=800"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms]"
                    alt={article.title}
                  />
                  <div className="absolute top-6 left-6 bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    {article.category}
                  </div>
                </div>

                <div className="flex flex-col flex-grow space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(article.author_id);
                      }}
                      className="flex items-center gap-2 transition-colors hover:text-blue-600"
                    >
                      <div className="flex items-center justify-center text-blue-600 rounded-full w-7 h-7 bg-slate-100 dark:bg-slate-800">
                        <Users size={14} strokeWidth={3} />
                      </div>
                      {article.author_name}
                    </button>
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-amber-500" />{" "}
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white leading-[1.1] tracking-tighter uppercase italic group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-lg italic font-bold leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2 opacity-80">
                    {article.content}
                  </p>

                  <div className="flex items-center justify-between pt-8 mt-auto border-t border-slate-100 dark:border-white/5">
                    <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-3 group-hover:gap-5 transition-all">
                      Read Story <ArrowRight size={18} strokeWidth={3} />
                    </span>

                    {(userRole === "admin" ||
                      currentUserId === article.author_id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Permanently delete this?"))
                            onDelete(article.id);
                        }}
                        className="p-3 text-white transition-all bg-red-600 shadow-xl rounded-2xl hover:bg-slate-950"
                      >
                        <Trash2 size={20} strokeWidth={3} />
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

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-white/10 shadow-xl space-y-6 text-center group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-500">
    <div className="mx-auto w-20 h-20 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-3xl italic font-black tracking-tighter uppercase text-slate-950 dark:text-white">
      {title}
    </h3>
    <p className="font-bold leading-relaxed text-slate-500 dark:text-slate-400">
      {desc}
    </p>
  </div>
);

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
    className={`px-8 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-blue-600 text-white shadow-xl"
        : "text-slate-500 hover:text-slate-950 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default HomePage;
