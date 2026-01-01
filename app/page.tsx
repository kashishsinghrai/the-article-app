import React, { useMemo } from "react";
import {
  ArrowRight,
  Globe,
  ShieldCheck,
  PenSquare,
  MessageSquare,
  Volume2,
  Newspaper,
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
  // Fix: Added missing props passed from App.tsx to resolve TypeScript errors
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
              Decentralized Journalism Initiative
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-bold text-slate-950 dark:text-white tracking-tight leading-[0.9]">
            The platform <br /> for{" "}
            <span className="text-blue-600">truth.</span>
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
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Explore
            </button>
          </div>
        </section>

        <section
          id="about"
          className="px-8 py-40 border-t border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-950"
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

        <section className="px-8 py-40 border-t border-slate-100 dark:border-slate-900">
          <div className="max-w-4xl mx-auto space-y-12 text-center">
            <h2 className="text-4xl font-bold tracking-tighter md:text-6xl text-slate-950 dark:text-white">
              Empowering the next generation of reporters.
            </h2>
            <p className="text-xl italic font-medium text-slate-500">
              "Real impact starts with real conversation."
            </p>
            <button
              onClick={onLogin}
              className="px-12 py-5 text-sm font-bold tracking-widest text-white uppercase transition-all bg-blue-600 rounded-full hover:scale-105"
            >
              Establish Credentials
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="px-8 py-20 mx-auto space-y-32 max-w-7xl">
      <div className="pt-10">
        <NewsTerminal />
      </div>

      <section className="space-y-16">
        <div className="flex items-end justify-between pb-10 border-b border-slate-100 dark:border-slate-900">
          <h2 className="text-5xl font-bold tracking-tighter dark:text-white">
            Feed
          </h2>
          <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="underline cursor-pointer text-slate-900 dark:text-white underline-offset-8 decoration-2 decoration-blue-600">
              Latest
            </span>
            <span className="cursor-pointer hover:text-slate-600">
              Trending
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {articles.map((article) => (
            <div
              key={article.id}
              className="space-y-6 cursor-pointer group"
              onClick={() => onReadArticle?.(article)}
            >
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <img
                  src={article.image_url}
                  className="object-cover w-full h-full transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3">
                <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{article.category}</span>
                  <span>
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-3xl font-bold leading-tight transition-colors dark:text-white group-hover:text-blue-600">
                  {article.title}
                </h3>
                <p className="italic text-slate-500 dark:text-slate-400 line-clamp-2">
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

const Feature = ({ icon, title, desc }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-center w-12 h-12 bg-white border dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white">
      {icon}
    </div>
    <h3 className="text-2xl font-bold dark:text-white">{title}</h3>
    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
      {desc}
    </p>
  </div>
);

export default HomePage;
