import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  Globe,
  Newspaper,
  Zap,
  ShieldCheck,
  PenSquare,
  MessageSquare,
  Volume2,
  Info,
  Lock,
  ChevronDown,
  CheckCircle2,
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

  if (!isLoggedIn && !isArchive) {
    return (
      <main className="flex flex-col bg-white dark:bg-slate-950">
        {/* Minimal Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-6 max-w-5xl mx-auto text-center animate-in fade-in duration-1000">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <Volume2 size={14} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              The Global Voice Initiative
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-[1.05]">
            Where the youth <br /> finds its{" "}
            <span className="text-blue-600">expression.</span>
          </h1>

          <p className="max-w-2xl mx-auto mb-12 text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400 md:text-xl">
            A minimalist space for publishing your perspective and connecting
            with people worldwide through secure, private dialogue.
          </p>

          <div className="flex flex-col items-center w-full max-w-md gap-4 sm:flex-row">
            <button
              onClick={onLogin}
              className="flex items-center justify-center w-full gap-2 px-8 py-4 text-sm font-black tracking-widest text-white uppercase transition-all sm:flex-1 bg-slate-900 dark:bg-white dark:text-slate-950 rounded-xl hover:bg-blue-600 hover:text-white active:scale-95"
            >
              Get Started <ArrowRight size={18} />
            </button>
            <a
              href="#how-it-works"
              className="flex items-center justify-center w-full gap-2 px-8 py-4 text-sm font-black tracking-widest uppercase transition-all border sm:flex-1 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Informational Blocks */}
        <section
          id="how-it-works"
          className="w-full max-w-6xl px-6 py-32 mx-auto space-y-40"
        >
          {/* Use Case Grid */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <InfoBlock
              icon={<PenSquare size={24} />}
              title="Voice Your Story"
              desc="Publish articles that matter. From local updates to global perspectives, your voice is indexed and verified."
            />
            <InfoBlock
              icon={<MessageSquare size={24} />}
              title="Secure Talk"
              desc="Connect with random members across the network. Full end-to-end encryption ensures your dialogue is yours alone."
            />
            <InfoBlock
              icon={<ShieldCheck size={24} />}
              title="Identity First"
              desc="Your anonymity and security are our priority. We provide the tools; you provide the truth."
            />
          </div>

          {/* Mission Statement */}
          <div className="bg-slate-50 dark:bg-slate-900 p-12 md:p-20 rounded-[3rem] flex flex-col items-center text-center space-y-8 border border-slate-100 dark:border-slate-800">
            <div className="max-w-3xl space-y-6">
              <h2 className="text-3xl font-black tracking-tighter uppercase md:text-5xl text-slate-900 dark:text-white">
                Our motive is your empowerment.
              </h2>
              <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                The Articles was built to bridge the gap between information and
                connection. In an age of noise, we provide the silence needed
                for real conversations and the platform needed for real impact.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <Step label="Join" />
              <div className="self-center w-8 h-px bg-slate-200 dark:bg-slate-800" />
              <Step label="Verify" />
              <div className="self-center w-8 h-px bg-slate-200 dark:bg-slate-800" />
              <Step label="Publish" />
              <div className="self-center w-8 h-px bg-slate-200 dark:bg-slate-800" />
              <Step label="Talk" />
            </div>
          </div>

          <NewsTerminal />
        </section>

        {/* Footer Promotion */}
        <section className="py-32 text-center border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20">
          <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.4em] mb-12">
            Built for the next generation.
          </h3>
          <button
            onClick={onLogin}
            className="px-12 py-5 text-sm font-black tracking-widest text-white uppercase transition-all bg-blue-600 rounded-full shadow-xl hover:scale-105 shadow-blue-600/20"
          >
            Join the Network Now
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="max-w-6xl px-6 py-12 mx-auto space-y-24 md:py-24">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
        <NewsTerminal />
      </div>

      <div id="latest-stories">
        <div className="flex flex-col items-start justify-between gap-8 pb-12 mb-16 border-b md:flex-row md:items-center border-slate-200 dark:border-slate-800">
          <h2 className="text-4xl font-black tracking-tighter uppercase md:text-6xl text-slate-900 dark:text-white">
            Latest Feed
          </h2>

          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
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
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="py-40 text-center opacity-40">
            <Newspaper size={60} className="mx-auto mb-6 text-slate-300" />
            <p className="text-xl font-bold tracking-widest uppercase text-slate-400">
              Feed is currently silent.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:border-blue-600 transition-all flex flex-col"
                onClick={() => onReadArticle?.(article)}
              >
                <div className="aspect-[16/9] overflow-hidden rounded-[1.5rem] mb-8 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={article.image_url}
                    className="object-cover w-full h-full transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    alt={article.title}
                  />
                </div>

                <div className="flex flex-col flex-grow space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(article.author_id);
                      }}
                      className="hover:text-blue-600"
                    >
                      {article.author_name}
                    </button>
                    <span>
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black leading-tight uppercase transition-colors text-slate-900 dark:text-white group-hover:text-blue-600">
                    {article.title}
                  </h3>

                  <p className="text-base italic font-medium leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {article.content}
                  </p>

                  <div className="flex items-center justify-between pt-6 mt-auto border-t border-slate-100 dark:border-white/5">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                      Read More <ArrowRight size={14} />
                    </span>
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

const InfoBlock = ({ icon, title, desc }: any) => (
  <div className="p-2 space-y-6 text-left">
    <div className="flex items-center justify-center w-12 h-12 text-blue-600 border rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      {icon}
    </div>
    <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
      {title}
    </h3>
    <p className="font-medium leading-relaxed text-slate-500 dark:text-slate-400">
      {desc}
    </p>
  </div>
);

const Step = ({ label }: any) => (
  <div className="flex items-center gap-2">
    <CheckCircle2 size={16} className="text-blue-600" />
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
      {label}
    </span>
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
    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
  </button>
);

export default HomePage;
