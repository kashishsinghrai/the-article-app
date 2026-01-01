import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Send,
  Search,
  BarChart3,
  Map,
  TrendingUp,
  Globe,
  ShieldCheck,
  Zap,
  X,
  Loader2,
  ArrowLeft,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Article, Category } from "../../types";
import AiAssistant from "../../components/AiAssistant";

interface PostPageProps {
  onPublish: (data: Partial<Article>) => void;
  editData?: Article | null;
}

const PostPage: React.FC<PostPageProps> = ({ onPublish, editData }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("Investigative");
  const [isPublic, setIsPublic] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEncoding, setIsEncoding] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setContent(editData.content);
      setCategory(editData.category);
      setImageUrl(editData.image_url);
      setIsPublic(editData.is_private === false);
    }
  }, [editData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large (Max 2MB)");
        return;
      }
      setIsEncoding(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setIsEncoding(false);
        toast.success("Evidence Encoding Complete");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Headline and Content are required.");
      return;
    }
    setIsSyncing(true);
    onPublish({
      title: title.trim(),
      content: content.trim(),
      category,
      image_url: imageUrl,
      is_private: !isPublic,
    });
  };

  const categories: Category[] = ["Investigative", "Economic", "Regional"];

  return (
    <main className="flex flex-col gap-8 px-4 py-20 mx-auto max-w-7xl md:px-6 md:py-32 lg:flex-row md:gap-16">
      <div className="flex-1 space-y-8 md:space-y-12">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <ShieldCheck size={16} />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">
                Verified Terminal
              </span>
            </div>
            <h1 className="text-3xl italic font-black leading-none tracking-tighter uppercase md:text-6xl text-slate-900 dark:text-white">
              {editData ? "Update Record" : "File Dispatch"}
            </h1>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] max-w-xs md:border-r border-slate-200 dark:border-slate-800 md:pr-4">
            Authorized correspondence for the global truth ledger.
          </p>
        </div>

        <div className="space-y-8 md:space-y-10 bg-white dark:bg-slate-900 p-5 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl">
          <div className="space-y-2 md:space-y-4">
            <label className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
              Operational Headline
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-0 text-xl italic font-black tracking-tighter uppercase bg-transparent border-none outline-none md:text-5xl placeholder:text-slate-100 dark:placeholder:text-slate-800 focus:ring-0 text-slate-900 dark:text-white"
              placeholder="Record Headline..."
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <div className="space-y-3">
              <label className="text-[8px] md:text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
                Intel Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${
                      category === cat
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900"
                        : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[8px] md:text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
                Visibility Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${
                    isPublic
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <Unlock size={12} /> Public
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${
                    !isPublic
                      ? "bg-amber-600 text-white border-amber-600 shadow-md"
                      : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <Lock size={12} /> Private
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[8px] md:text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
              Asset Upload
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[16/9] md:aspect-[21/9] bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative"
            >
              {isEncoding ? (
                <Loader2 size={24} className="text-blue-600 animate-spin" />
              ) : imageUrl ? (
                <>
                  <img src={imageUrl} className="object-cover w-full h-full" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl("");
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-red-600 text-white rounded-lg shadow-xl"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="p-4 text-center">
                  <Camera
                    size={24}
                    className="mx-auto mb-2 transition-colors text-slate-300 group-hover:text-blue-500"
                  />
                  <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Upload Evidence
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

          <div className="space-y-2">
            <label className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
              Dispatch Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full p-0 text-sm font-medium leading-relaxed bg-transparent border-none outline-none md:text-xl placeholder:text-slate-100 dark:placeholder:text-slate-800 focus:ring-0 text-slate-700 dark:text-slate-300"
              placeholder="Begin intelligence transmission..."
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 sm:flex-row">
            <div className="flex items-center w-full gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-950 sm:w-auto">
              <Globe size={14} className="text-blue-600" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                Live Sync Ready
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSyncing || isEncoding}
              className={`w-full sm:w-auto px-8 py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isSyncing
                  ? "bg-slate-200 text-slate-400"
                  : "bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-blue-600 hover:text-white"
              }`}
            >
              {isSyncing ? "Synchronizing..." : "Sync Dispatch"}
              {!isSyncing && <Send size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 w-full lg:w-80">
        <div className="lg:sticky lg:top-32">
          <AiAssistant currentHeadline={title} currentContent={content} />
        </div>
      </div>
    </main>
  );
};

export default PostPage;
