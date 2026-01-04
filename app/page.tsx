import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Globe,
  Radio,
  Fingerprint,
  Users,
  User,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
  UserMinus,
  ShieldCheck,
  Zap,
  Network,
  Activity,
  ArrowRight,
  ShieldAlert,
  Star,
  MessageCircle,
  ExternalLink,
  Share2,
  WifiOff,
  Terminal,
  TrendingUp,
} from "lucide-react";
import { Article, Category, Profile } from "../types.ts";
import { useStore } from "../lib/store.ts";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabase.ts";

interface HomePageProps {
  articles: Article[];
  isLoggedIn: boolean;
  onLogin: () => void;
  onReadArticle?: (article: Article) => void;
  onRefresh?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  articles = [],
  isLoggedIn,
  onLogin,
  onReadArticle,
  onRefresh,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [trendingNews, setTrendingNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const profile = useStore((s) => s.profile);
  const users = useStore((s) => s.users);
  const followingIds = useStore((s) => s.followingIds);
  const syncAll = useStore((s) => s.syncAll);
  const toggleFollow = useStore((s) => s.toggleFollow);

  useEffect(() => {
    const loadSystemSignals = () => {
      if (!isLoggedIn) return;

      const signals = [
        {
          title: "Sector A1: Node connectivity reached 99.8% stability.",
          category: "Network",
          url: "#",
        },
        {
          title: "Investigation: Regional dispatch verify protocol updated.",
          category: "Security",
          url: "#",
        },
        {
          title: "Economic: Global decentralized asset ledger synchronized.",
          category: "Finance",
          url: "#",
        },
        {
          title: "Privacy: Personal shard encryption layer v4.2 active.",
          category: "System",
          url: "#",
        },
        {
          title: "Signal: Incoming high-priority investigative dispatch.",
          category: "Urgent",
          url: "#",
        },
      ];

      setTrendingNews(signals);
      setNewsLoading(false);
    };

    const timer = setTimeout(loadSystemSignals, 1000);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  const handleInteraction = async (
    e: React.MouseEvent,
    type: "likes_count" | "dislikes_count",
    articleId: string
  ) => {
    e.stopPropagation();
    if (!isLoggedIn) return onLogin();

    try {
      const { data: current } = await supabase
        .from("articles")
        .select(type)
        .eq("id", articleId)
        .maybeSingle();
      const newCount = (current?.[type] || 0) + 1;
      const { error } = await supabase
        .from("articles")
        .update({ [type]: newCount })
        .eq("id", articleId);
      if (!error) {
        syncAll();
        toast.success("Signal Updated", { id: "interaction" });
      }
    } catch (err) {
      toast.error("Transmission Failed");
    }
  };

  const onFollowClick = (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    if (!isLoggedIn) return onLogin();
    toggleFollow(targetId);
  };

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? articles
        : articles.filter((a) => a.category === activeCategory),
    [articles, activeCategory]
  );

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-20 space-y-40 animate-in fade-in duration-1000">
        <section className="relative max-w-5xl py-20 mx-auto space-y-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#00BFFF]/10 blur-[120px] rounded-full -z-10" />
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-[#00BFFF]/20 rounded-full bg-[#00BFFF]/5 backdrop-blur-xl">
            <ShieldCheck size={20} className="text-[#00BFFF]" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00BFFF]">
              Root Network Access
            </span>
          </div>
          <h1 className="text-5xl md:text-[9rem] font-black italic uppercase text-slate-950 dark:text-white tracking-tighter leading-[0.85]">
            ThE-ARTICLES <br />
            <span className="text-slate-200 dark:text-slate-800">
              CITIZEN_CORE
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl italic font-bold leading-relaxed text-slate-500">
            "Bypass the narrative. Connect directly to the global intelligence
            wire."
          </p>
          <div className="flex flex-col items-center justify-center gap-6 pt-10 sm:flex-row">
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-16 py-7 bg-white text-black rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl"
            >
              Initialize Identity
            </button>
            <button className="w-full sm:w-auto px-12 py-7 bg-transparent border-2 border-slate-800 text-slate-400 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:border-slate-500">
              Ethics Charter
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT SIDEBAR: Personal Metrics */}
        <aside className="sticky hidden space-y-8 lg:block lg:col-span-3 top-32 h-fit">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl">
            <div className="h-28 bg-gradient-to-br from-[#00BFFF] to-blue-800 relative">
              {profile?.cover_url && (
                <img
                  src={profile.cover_url}
                  className="object-cover w-full h-full opacity-50"
                />
              )}
            </div>
            <div className="relative z-10 px-8 pb-10 text-center -mt-14">
              <div className="w-24 h-24 rounded-[2.5rem] bg-white dark:bg-[#050505] border-[8px] border-white dark:border-[#0a0a0a] mx-auto overflow-hidden shadow-xl flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Fingerprint
                    size={40}
                    className="text-slate-200 dark:text-slate-800"
                  />
                )}
              </div>
              <h3 className="mt-4 text-2xl italic font-black leading-none tracking-tighter uppercase text-slate-900 dark:text-white">
                @{profile?.username}
              </h3>
              <p className="text-[9px] font-black text-[#00BFFF] uppercase tracking-[0.3em] mt-2 italic">
                Node Integrity: {profile?.budget || 0}%
              </p>

              <div className="grid grid-cols-2 gap-4 pt-8 mt-8 border-t border-slate-50 dark:border-white/5">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Followers
                  </p>
                  <p className="text-xl font-black dark:text-white animate-pulse">
                    {profile?.followers_count || 0}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Following
                  </p>
                  <p className="text-xl font-black dark:text-white">
                    {profile?.following_count || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm border-l-4 border-l-[#00BFFF]">
            <div className="flex items-center gap-3 text-[#00BFFF] mb-4">
              <Terminal size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Dispatch Summary
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
              "Access to the root wire is established. All signals verified by
              P2P consensus."
            </p>
          </div>
        </aside>

        {/* CENTER FEED: Reports */}
        <main className="space-y-8 lg:col-span-6">
          <header className="flex items-center justify-between sticky top-24 z-30 bg-white/90 dark:bg-[#050505]/95 backdrop-blur-xl py-4 px-6 border border-slate-100 dark:border-white/5 rounded-[2rem] shadow-xl">
            <h2 className="flex items-center gap-3 text-2xl italic font-black tracking-tighter uppercase dark:text-white">
              <Radio className="text-[#00BFFF] animate-pulse" /> Dispatch
            </h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {(
                ["All", "Investigative", "Economic", "Regional"] as Category[]
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase transition-all shadow-sm ${
                    activeCategory === cat
                      ? "bg-[#00BFFF] text-white"
                      : "bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </header>

          <div className="pb-40 space-y-10 lg:pb-0">
            {filtered.length === 0 ? (
              <div className="py-40 text-center opacity-20">
                <WifiOff size={64} className="mx-auto" />
                <p className="mt-4 text-xs font-black tracking-widest uppercase">
                  Zero Signals Detected
                </p>
              </div>
            ) : (
              filtered.map((article) => {
                const isFollowingAuthor = followingIds.includes(
                  article.author_id
                );
                return (
                  <div
                    key={article.id}
                    className="bg-white dark:bg-[#0a0a0a] rounded-[3.5rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group"
                    onClick={() => onReadArticle?.(article)}
                  >
                    <div className="p-8 space-y-8 md:p-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 overflow-hidden border shadow-inner rounded-2xl bg-slate-900 border-white/5">
                            {users.find((u) => u.id === article.author_id)
                              ?.avatar_url ? (
                              <img
                                src={
                                  users.find((u) => u.id === article.author_id)
                                    ?.avatar_url
                                }
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Fingerprint
                                size={22}
                                className="text-slate-700"
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="text-[12px] font-black uppercase text-slate-900 dark:text-white tracking-tight">
                              {article.author_name}
                            </h4>
                            {article.author_id !== profile?.id && (
                              <button
                                onClick={(e) =>
                                  onFollowClick(e, article.author_id)
                                }
                                className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline mt-1.5 transition-colors ${
                                  isFollowingAuthor
                                    ? "text-red-500"
                                    : "text-[#00BFFF]"
                                }`}
                              >
                                {isFollowingAuthor ? (
                                  <>
                                    <UserMinus size={10} /> Disconnect
                                  </>
                                ) : (
                                  <>
                                    <UserPlus size={10} /> Handshake
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase italic">
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-3xl md:text-4xl font-black italic uppercase leading-none tracking-tighter text-slate-950 dark:text-white group-hover:text-[#00BFFF] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-lg italic font-medium leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
                          "{article.content}"
                        </p>
                      </div>

                      {article.image_url && (
                        <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-[#080808] border border-white/5 relative shadow-inner">
                          <img
                            src={article.image_url}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                          />
                          <div className="absolute inset-0 flex items-end p-8 transition-opacity opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100">
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">
                              Decrypt Full Asset{" "}
                              <ArrowRight size={14} className="inline ml-2" />
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-100 dark:border-white/5">
                        <div className="flex gap-8">
                          <button
                            onClick={(e) =>
                              handleInteraction(e, "likes_count", article.id)
                            }
                            className="flex items-center gap-2.5 text-[10px] font-black uppercase text-slate-400 hover:text-[#00BFFF] transition-colors"
                          >
                            <ThumbsUp
                              size={22}
                              className="transition-transform group-active:scale-125"
                            />{" "}
                            {article.likes_count || 0}
                          </button>
                          <button
                            onClick={(e) =>
                              handleInteraction(e, "dislikes_count", article.id)
                            }
                            className="flex items-center gap-2.5 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <ThumbsDown
                              size={22}
                              className="transition-transform group-active:scale-125"
                            />{" "}
                            {article.dislikes_count || 0}
                          </button>
                          <div className="flex items-center gap-2.5 text-[10px] font-black uppercase text-slate-400">
                            <MessageCircle size={22} />{" "}
                            {article.comments_count || 0}
                          </div>
                        </div>
                        <button className="flex items-center gap-2.5 text-[10px] font-black uppercase text-slate-400 hover:text-[#00BFFF]">
                          <Share2 size={20} /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: Global Stats & Registry */}
        <aside className="sticky hidden space-y-8 lg:block lg:col-span-3 top-32 h-fit">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm flex flex-col max-h-[600px]">
            <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <Globe size={18} className="text-[#00BFFF]" /> Global Wire
              </h4>
              <TrendingUp size={14} className="text-[#00BFFF] animate-pulse" />
            </div>
            <div className="flex-grow p-6 space-y-6 overflow-y-auto no-scrollbar">
              {newsLoading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="h-20 bg-slate-50 dark:bg-white/5 rounded-3xl animate-pulse"
                      />
                    ))
                : trendingNews.map((n, i) => (
                    <a
                      key={i}
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-5 rounded-[2rem] hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[8px] font-black uppercase text-[#00BFFF] bg-[#00BFFF]/5 px-2 py-0.5 rounded">
                          {n.category}
                        </span>
                        <ExternalLink
                          size={14}
                          className="text-slate-300 group-hover:text-[#00BFFF] transition-colors"
                        />
                      </div>
                      <p className="text-[13px] font-bold dark:text-white leading-snug italic group-hover:text-[#00BFFF]">
                        "{n.title}"
                      </p>
                    </a>
                  ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-[3rem] p-10 border border-slate-100 dark:border-white/5 space-y-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-50 dark:border-white/5">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <Users size={16} /> Correspondents
              </h4>
              <span className="text-[9px] font-black text-emerald-500 uppercase italic">
                Online
              </span>
            </div>
            <div className="space-y-6">
              {users.slice(0, 5).map((u) => (
                <div
                  key={u.id}
                  onClick={() => (window.location.hash = `/profile/${u.id}`)}
                  className="flex items-center gap-4 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 dark:border-white/5 group-hover:border-[#00BFFF] transition-all">
                    {u.avatar_url ? (
                      <img
                        src={u.avatar_url}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Fingerprint size={16} className="m-3 text-slate-800" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-black dark:text-white truncate uppercase group-hover:text-[#00BFFF] transition-colors">
                      {u.full_name}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">
                      {u.serial_id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => (window.location.hash = "/network")}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-xl"
            >
              Audit Database
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
