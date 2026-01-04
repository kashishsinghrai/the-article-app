import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Loader2,
  Lock,
  Unlock,
  ArrowLeft,
  Hash,
  Type,
  FileText,
  Image as ImageIcon,
  Terminal,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Article, Category, Profile } from "../../types.ts";
import NetworkMonitor from "../../components/NetworkMonitor.tsx";

interface PostPageProps {
  onPublish: (data: Partial<Article>) => Promise<void>;
  editData?: Article | null;
  onBack: () => void;
  profile: Profile | null;
  personalArticles: Article[];
}

const PostPage: React.FC<PostPageProps> = ({
  onPublish,
  editData,
  onBack,
  profile,
  personalArticles,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [category, setCategory] = useState<Category>("Investigative");
  const [isPublic, setIsPublic] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setContent(editData.content);
      setCategory(editData.category);
      setImageUrl(editData.image_url || "");
      setHashtags(editData.hashtags?.join(", ") || "");
      setIsPublic(!editData.is_private);
    }
  }, [editData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024)
        return toast.error("Asset threshold exceeded (Max 2MB).");
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim())
      return toast.error(
        "Critical: Headline and intelligence narrative required."
      );
    setIsSyncing(true);
    try {
      const tags = hashtags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter((t) => t.length > 0);
      await onPublish({
        title: title.trim(),
        content: content.trim(),
        category,
        image_url: imageUrl,
        is_private: !isPublic,
        hashtags: tags,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <main className="flex flex-col gap-8 px-4 py-24 mx-auto overflow-x-hidden duration-500 md:gap-12 max-w-7xl md:px-8 lg:flex-row animate-in fade-in">
      <div className="flex-1 space-y-8 md:space-y-12">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-white font-black uppercase text-[10px] tracking-[0.4em] transition-all group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Exit Transmission
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#00BFFF]">
            <Terminal size={20} className="md:w-6 md:h-6" />
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em]">
              Dispatch Interface v2.0
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl italic font-black leading-[0.9] tracking-tighter uppercase text-slate-900 dark:text-white">
            Transmission <span className="text-[#00BFFF]">Forge</span>
          </h1>
          <p className="max-w-xl text-[11px] md:text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 leading-relaxed">
            establishing factual documentation corridors bypassing central
            narrative control.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-10 lg:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-white/5 space-y-10 md:space-y-12 shadow-2xl relative">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">
              <Type size={14} /> 01. Primary Headline
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl italic font-black leading-tight tracking-tight uppercase bg-transparent border-none outline-none md:text-4xl lg:text-5xl text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-white/5 focus:ring-0"
              placeholder="ENTER BROADCAST TITLE..."
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">
                02. Sector
              </label>
              <div className="flex flex-wrap gap-2">
                {["Investigative", "Economic", "Regional"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat as Category)}
                    className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${
                      category === cat
                        ? "bg-slate-900 dark:bg-white text-white dark:text-black border-transparent shadow-xl"
                        : "bg-slate-50 dark:bg-transparent text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">
                03. Protocol
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex gap-2 py-3.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase border items-center justify-center transition-all ${
                    isPublic
                      ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border-slate-300 dark:border-white/20 shadow-inner"
                      : "text-slate-400 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-transparent"
                  }`}
                >
                  <Unlock size={14} /> Global
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex gap-2 py-3.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase border items-center justify-center transition-all ${
                    !isPublic
                      ? "bg-slate-900 dark:bg-white text-white dark:text-black border-transparent shadow-xl"
                      : "text-slate-400 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-transparent"
                  }`}
                >
                  <Lock size={14} /> Encrypted
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">
              <ImageIcon size={14} /> 04. Media Shard
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video md:aspect-[21/9] bg-slate-50 dark:bg-[#080808] rounded-[2rem] md:rounded-[3.5rem] border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#00BFFF]/30 transition-all overflow-hidden relative group"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  className="object-cover w-full h-full transition-opacity group-hover:opacity-40"
                  alt="Asset Preview"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 transition-colors text-slate-400 dark:text-slate-700 group-hover:text-[#00BFFF] p-6 text-center">
                  <Camera
                    size={40}
                    className="md:w-12 md:h-12"
                    strokeWidth={1}
                  />
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] leading-relaxed">
                    Attach raw media <br className="md:hidden" /> evidence asset
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">
              <Hash size={14} /> 05. Indexing Hash Tags
            </label>
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 md:py-5 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-[#00BFFF]/40 transition-all placeholder:text-slate-300"
              placeholder="e.g. corruption, evidence, regional_sector"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em] border-b border-slate-100 dark:border-white/5 pb-2">
              <FileText size={14} /> 06. Intelligence Narrative
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 text-lg md:text-xl font-medium italic leading-relaxed text-slate-700 dark:text-slate-300 outline-none focus:border-[#00BFFF]/40 transition-all resize-none placeholder:text-slate-300 dark:placeholder:text-white/5 no-scrollbar"
              placeholder="DECRYPT RAW INTELLIGENCE DATA HERE..."
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-8 pt-8 border-t md:pt-12 border-slate-200 dark:border-white/10 md:flex-row">
            <div className="flex items-center gap-4 text-center text-slate-400 md:text-left">
              <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none text-slate-900 dark:text-white">
                  Signal Encryption Layer Active
                </p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                  identity verified by platform core.
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSyncing}
              className="w-full md:w-auto px-12 md:px-20 py-5 md:py-7 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-black uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-30 relative z-20"
            >
              {isSyncing ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Terminal size={24} /> Transmit dispatch
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[420px] shrink-0 pt-0 lg:pt-32">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-6 lg:px-0">
            <Zap size={16} className="text-[#00BFFF]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              Personal Node Ledger
            </span>
          </div>
          <NetworkMonitor
            profile={profile}
            personalArticles={personalArticles}
          />
        </div>
      </div>
    </main>
  );
};

export default PostPage;
