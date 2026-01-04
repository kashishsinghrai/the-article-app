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
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Article, Category, Profile } from "../../types";
import NetworkMonitor from "../../components/NetworkMonitor";

interface PostPageProps {
  onPublish: (data: Partial<Article>) => Promise<void>;
  editData?: Article | null;
  onBack: () => void;
  profile: Profile | null;
}

const PostPage: React.FC<PostPageProps> = ({
  onPublish,
  editData,
  onBack,
  profile,
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
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else if (file) toast.error("Max 2MB threshold exceeded.");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim())
      return toast.error("Headline and narrative required.");
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
    <main className="flex flex-col min-h-screen gap-16 px-8 py-24 mx-auto max-w-7xl lg:flex-row animate-in fade-in">
      <div className="flex-1 space-y-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Exit Terminal
        </button>
        <div className="space-y-4">
          <h1 className="text-5xl italic font-black text-white uppercase md:text-7xl">
            Creator
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            Transmission Hub for Intelligence
          </p>
        </div>
        <div className="bg-slate-950 p-8 md:p-14 rounded-[2.5rem] border border-white/5 space-y-12 shadow-sm text-white">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
              <Type size={14} /> Headline
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl italic font-black tracking-tight text-white bg-transparent border-none outline-none md:text-5xl placeholder:text-slate-700"
              placeholder="ENTER DISPATCH TITLE..."
            />
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-500">
                Classification
              </label>
              <div className="flex flex-wrap gap-2">
                {["Investigative", "Economic", "Regional"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat as Category)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase border transition-all ${
                      category === cat
                        ? "bg-white text-slate-950 border-white"
                        : "text-slate-400 border-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-500">
                Protocol
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex gap-2 py-3 rounded-xl text-[10px] font-black uppercase border items-center justify-center ${
                    isPublic
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 border-white/5"
                  }`}
                >
                  <Unlock size={14} /> Global
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex gap-2 py-3 rounded-xl text-[10px] font-black uppercase border items-center justify-center ${
                    !isPublic
                      ? "bg-white text-slate-950"
                      : "text-slate-500 border-white/5"
                  }`}
                >
                  <Lock size={14} /> Masked
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
              <ImageIcon size={14} /> Assets
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-slate-900/50 rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-all overflow-hidden relative group"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  className="object-cover w-full h-full transition-opacity group-hover:opacity-60"
                  alt=""
                />
              ) : (
                <Camera size={32} className="text-slate-700" />
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
            <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
              <Hash size={14} /> Indexing Tags
            </label>
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-5 py-3 text-sm text-white border outline-none bg-slate-950 border-white/5 rounded-xl"
              placeholder="evidence, truth, corruption"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2">
              <FileText size={14} /> Narrative
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full text-lg bg-transparent border-none outline-none placeholder:text-slate-700 text-slate-300"
              placeholder="Decrypt narrative here..."
            />
          </div>
          <div className="flex justify-end pt-10 border-t border-white/5">
            <button
              onClick={handleSubmit}
              disabled={isSyncing}
              className="w-full sm:w-auto px-16 py-5 bg-white text-slate-950 rounded-full text-[12px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-30"
            >
              {isSyncing ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Transmit"
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-80 shrink-0">
        <NetworkMonitor profile={profile} personalArticles={[]} />
      </div>
    </main>
  );
};

export default PostPage;
