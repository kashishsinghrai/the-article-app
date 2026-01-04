import React, { useMemo, useState, useEffect } from "react";
import {
  Globe,
  Radio,
  Fingerprint,
  Users,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
  UserMinus,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Share2,
  Terminal,
  TrendingUp,
  MoreHorizontal,
  Bookmark,
  Send,
  Image as ImageIcon,
  Video,
  Calendar,
  Newspaper,
  Target,
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

  const fakeDispatches: Article[] = [
    {
      id: "fake-1",
      author_name: "Sarah Chen",
      author_serial: "@schen_node",
      author_id: "u1",
      title: "The Rise of Decentralized Identity Shards",
      content:
        "We are seeing a massive shift in how peer nodes handle credential verification. The new v4.2 encryption layer is showing 40% less latency in high-traffic sectors. #Privacy #TechShift",
      category: "Investigative",
      is_private: false,
      image_url:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000",
      likes_count: 142,
      comments_count: 24,
      created_at: new Date().toISOString(),
    },
    {
      id: "fake-2",
      author_name: "Marcus Vane",
      author_serial: "@mv_intel",
      author_id: "u2",
      title: "Regional Economic Analysis: Sector 7",
      content:
        "Market signals indicate a surge in p2p asset transfers within the South Asian corridors. Investigative dispatches suggest node budget increases are imminent. #Finance #GlobalWire",
      category: "Economic",
      is_private: false,
      likes_count: 89,
      comments_count: 12,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  const displayArticles = useMemo(() => {
    const combined = [...articles, ...fakeDispatches];
    return activeCategory === "All"
      ? combined
      : combined.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  useEffect(() => {
    const loadSystemSignals = () => {
      if (!isLoggedIn) return;
      const signals = [
        {
          title: "Node stability reached 99.8% in Sector A1",
          category: "Network",
          url: "#",
        },
        {
          title: "Regional verify protocol update v4.2 active",
          category: "Security",
          url: "#",
        },
        {
          title: "Decentralized asset ledger sync complete",
          category: "Finance",
          url: "#",
        },
        {
          title: "Encryption layer v4.2 rollout successful",
          category: "System",
          url: "#",
        },
        {
          title: "Urgent: High-priority investigative dispatch",
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

  const handleInteraction = async (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    if (!isLoggedIn) return onLogin();
    if (articleId.startsWith("fake")) {
      toast.success("Signal Relayed");
      return;
    }
    try {
      const { data: current } = await supabase
        .from("articles")
        .select("likes_count")
        .eq("id", articleId)
        .maybeSingle();
      const newCount = (current?.likes_count || 0) + 1;
      await supabase
        .from("articles")
        .update({ likes_count: newCount })
        .eq("id", articleId);
      syncAll();
      toast.success("Signal Liked");
    } catch (err) {
      toast.error("Transmission Failed");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-20 animate-in fade-in duration-1000">
        <section className="relative max-w-5xl py-20 mx-auto space-y-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#00BFFF]/5 blur-[120px] rounded-full -z-10" />
          <div className="inline-flex items-center gap-3 px-6 py-2 border border-[#00BFFF]/20 rounded-full bg-[#00BFFF]/5">
            <ShieldCheck size={18} className="text-[#00BFFF]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00BFFF]">
              Citizen Intelligence Network
            </span>
          </div>
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-8xl text-slate-950 dark:text-white">
            BYPASS THE <br />
            <span className="text-slate-300 dark:text-slate-800">
              NARRATIVE.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl italic font-medium leading-relaxed text-slate-500">
            Connect directly to the global intelligence wire. Peer-verified
            dispatches for the modern node.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-10 py-5 bg-[#00BFFF] text-white rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-xl"
            >
              Initialize Identity
            </button>
            <button className="w-full px-10 py-5 text-xs font-black tracking-widest uppercase bg-white border sm:w-auto dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-500 rounded-xl hover:border-slate-400">
              Ethics Charter
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 mx-auto duration-500 max-w-7xl md:px-6 animate-in fade-in">
      <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="sticky hidden space-y-4 lg:block lg:col-span-3 top-24">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="h-16 bg-gradient-to-r from-blue-600 to-[#00BFFF] relative">
              {profile?.cover_url && (
                <img
                  src={profile.cover_url}
                  className="object-cover w-full h-full opacity-60"
                />
              )}
            </div>
            <div className="relative z-10 px-4 pb-6 -mt-8 text-center">
              <div className="w-16 h-16 rounded-xl bg-white dark:bg-[#111] border-4 border-white dark:border-[#0a0a0a] mx-auto overflow-hidden shadow-md flex items-center justify-center mb-3">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Fingerprint size={24} className="text-slate-300" />
                )}
              </div>
              <h3 className="text-sm font-black uppercase truncate text-slate-900 dark:text-white">
                {profile?.full_name}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                @{profile?.username} • {profile?.serial_id}
              </p>
              <div className="pt-4 mt-4 space-y-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                  <span>Connections</span>
                  <span className="text-[#00BFFF]">
                    {profile?.following_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                  <span>Node Integrity</span>
                  <span className="text-[#00BFFF]">
                    {profile?.budget || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">
              Registry Groups
            </h4>
            <div className="space-y-3">
              {[
                "#NetworkSecurity",
                "#EconomicIntelligence",
                "#GlobalRegional",
                "#NodeTech",
              ].map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-[#00BFFF] cursor-pointer transition-colors"
                >
                  <Users size={12} /> {tag}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="space-y-4 lg:col-span-6">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Fingerprint size={18} className="text-slate-400" />
                )}
              </div>
              <button
                onClick={() => (window.location.hash = "#/post")}
                className="flex-grow bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full px-5 py-2.5 text-left text-xs font-bold text-slate-400 transition-all"
              >
                Start a dispatch...
              </button>
            </div>
            <div className="flex items-center justify-between px-2">
              <button className="flex items-center gap-2 p-2 text-xs font-bold rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">
                <ImageIcon size={16} className="text-blue-500" />{" "}
                <span>Photo</span>
              </button>
              <button className="flex items-center gap-2 p-2 text-xs font-bold rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">
                <Video size={16} className="text-emerald-500" />{" "}
                <span>Video</span>
              </button>
              <button className="flex items-center gap-2 p-2 text-xs font-bold rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">
                <Calendar size={16} className="text-amber-500" />{" "}
                <span>Event</span>
              </button>
              <button className="flex items-center gap-2 p-2 text-xs font-bold rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">
                <Newspaper size={16} className="text-rose-500" />{" "}
                <span>Article</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar">
            {(
              ["All", "Investigative", "Economic", "Regional"] as Category[]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#00BFFF] text-white border-[#00BFFF] shadow-md"
                    : "bg-white dark:bg-[#0a0a0a] text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {displayArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                onClick={() => onReadArticle?.(article)}
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 overflow-hidden rounded-lg bg-slate-900 shrink-0">
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
                            size={24}
                            className="m-3 text-slate-600"
                          />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-black uppercase truncate text-slate-900 dark:text-white">
                          {article.author_name}
                        </h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                          {article.author_serial}
                        </p>
                        <p className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">
                          {new Date(article.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black italic uppercase leading-tight tracking-tight text-slate-950 dark:text-white group-hover:text-[#00BFFF] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm italic font-medium leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                      "{article.content}"
                    </p>
                  </div>

                  {article.image_url && (
                    <div className="relative overflow-hidden border rounded-xl border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black">
                      <img
                        src={article.image_url}
                        className="w-full h-auto max-h-[400px] object-cover"
                        alt="Dispatch Asset"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-50 dark:border-white/5 pb-2">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[6px] text-white ring-1 ring-white dark:ring-black">
                          <ThumbsUp size={8} />
                        </div>
                        <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[6px] text-white ring-1 ring-white dark:ring-black">
                          <Zap size={8} />
                        </div>
                      </div>
                      <span>{article.likes_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{article.comments_count || 0} analyses</span>
                      <span>{Math.floor(Math.random() * 10)} relays</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 pt-1">
                    <button
                      onClick={(e) => handleInteraction(e, article.id)}
                      className="flex items-center justify-center flex-1 gap-2 py-2 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 hover:text-blue-500"
                    >
                      <ThumbsUp size={18} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        Like
                      </span>
                    </button>
                    <button className="flex items-center justify-center flex-1 gap-2 py-2 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500">
                      <MessageCircle size={18} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        Note
                      </span>
                    </button>
                    <button className="flex items-center justify-center flex-1 gap-2 py-2 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500">
                      <Share2 size={18} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        Relay
                      </span>
                    </button>
                    <button className="flex items-center justify-center flex-1 gap-2 py-2 transition-colors rounded-md hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500">
                      <Send size={18} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        Send
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="sticky hidden space-y-4 lg:block lg:col-span-3 top-24">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest flex items-center gap-2">
                <TrendingUp size={16} className="text-[#00BFFF]" /> Wire Trends
              </h4>
              <ShieldCheck size={14} className="text-slate-300" />
            </div>
            <div className="space-y-5">
              {newsLoading
                ? Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="h-10 rounded-lg bg-slate-50 dark:bg-white/5 animate-pulse"
                      />
                    ))
                : trendingNews.map((n, i) => (
                    <div key={i} className="cursor-pointer group">
                      <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 group-hover:text-[#00BFFF] transition-colors leading-tight truncate">
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          {n.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          {Math.floor(Math.random() * 500)} Nodes
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-white/10 p-5 shadow-sm text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
              Identity Sync
            </p>
            <div className="flex justify-center mb-6 -space-x-3">
              {users.slice(0, 4).map((u) => (
                <div
                  key={u.id}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0a0a0a] bg-slate-100 dark:bg-[#111] overflow-hidden"
                >
                  {u.avatar_url ? (
                    <img
                      src={u.avatar_url}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Fingerprint size={16} className="m-2.5 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-[11px] font-bold text-slate-500 mb-6 italic leading-relaxed">
              "Connect with verified correspondents in your local sector."
            </p>
            <button
              onClick={() => (window.location.hash = "#/network")}
              className="w-full py-3 bg-slate-950 dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-lg hover:opacity-90 transition-all"
            >
              Handshake Registry
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
