import React, { useMemo } from "react";
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
} from "lucide-react";
import { Article, Category, Profile } from "../types";
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
  onEdit,
  onViewProfile,
  onReadArticle,
  isArchive = false,
  currentUserId,
  allUsers,
  onChat,
}) => {
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

        {/* The Protocol Journey (Dotted Path) */}
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
              {/* Visual Dotted Path (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] border-t-2 border-dashed border-slate-200 dark:border-slate-800 -translate-y-1/2 z-0" />

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

        <section
          id="about"
          className="px-8 py-40 border-t border-slate-50 dark:border-slate-900"
        >
          <div className="grid max-w-6xl grid-cols-1 gap-20 mx-auto md:grid-cols-3">
            <Feature
              icon={<PenSquare size={24} />}
              title="Voice"
              desc="Publish verified articles. Your narrative, unfiltered and globally indexed."
            />
            <Feature
              icon={<MessageSquare size={24} />}
              title="Connect"
              desc="Peer-to-peer secure talk with random correspondents across the network."
            />
            <Feature
              icon={<ShieldCheck size={24} />}
              title="Secure"
              desc="Encryption by default. Your identity and data are strictly your own."
            />
          </div>
        </section>

        <section className="px-8 py-40 text-center border-t border-slate-100 dark:border-slate-900">
          <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-slate-400 mb-12">
            Verified Global Pulse
          </h2>
          <NewsTerminal />
        </section>
      </main>
    );
  }

  return (
    <main className="px-8 py-24 mx-auto space-y-32 max-w-7xl">
      <div className="pt-10">
        <NewsTerminal />
      </div>

      <section className="space-y-16">
        <div className="flex items-end justify-between pb-10 border-b border-slate-50 dark:border-slate-900">
          <h2 className="text-5xl font-bold tracking-tighter dark:text-white">
            Feed
          </h2>
          <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="pb-2 transition-all border-b-2 cursor-pointer text-slate-950 dark:text-white border-slate-950 dark:border-white">
              Latest
            </span>
            <span className="cursor-pointer hover:text-slate-600">
              Regional
            </span>
            <span className="cursor-pointer hover:text-slate-600">Reports</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {articles.map((article) => (
            <div
              key={article.id}
              className="space-y-6 cursor-pointer group"
              onClick={() => onReadArticle?.(article)}
            >
              <div className="aspect-[16/9] overflow-hidden rounded-[2.5rem] bg-slate-100 dark:bg-slate-900 border border-slate-50 dark:border-slate-800 relative">
                <img
                  src={article.image_url}
                  className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                />

                {/* Kinetic Tags Overlay */}
                {article.hashtags && article.hashtags.length > 0 && (
                  <div className="absolute flex overflow-hidden pointer-events-none bottom-4 left-4 right-4">
                    <div className="flex gap-4 animate-[ticker_10s_linear_infinite] whitespace-nowrap">
                      {article.hashtags
                        .concat(article.hashtags)
                        .map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1 border border-white/10"
                          >
                            <Hash size={10} className="text-blue-400" />
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-2 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {article.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-3xl font-bold leading-tight transition-colors dark:text-white group-hover:text-blue-600">
                  {article.title}
                </h3>
                <p className="italic leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                  "{article.content}"
                </p>
              </div>
            </div>
          ))}
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

const Feature = ({ icon, title, desc }: any) => (
  <div className="space-y-6 text-center md:text-left">
    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-white border dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-950 dark:text-white md:mx-0">
      {icon}
    </div>
    <h3 className="text-2xl font-bold dark:text-white">{title}</h3>
    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
      {desc}
    </p>
  </div>
);

export default HomePage;
