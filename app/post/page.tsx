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
      if (file.size > 1.5 * 1024 * 1024) {
        toast.error("File too large (Max 1.5MB)");
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
      toast.error("Fields required for secure transmission");
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
    <main className="flex flex-col gap-10 px-4 py-24 mx-auto max-w-7xl md:px-6 md:py-32 lg:flex-row md:gap-16">
      <div className="flex-1 space-y-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Verified Correspondent Terminal
              </span>
            </div>
            <h1 className="text-4xl italic font-black leading-none tracking-tighter uppercase transition-colors md:text-6xl text-slate-900 dark:text-white">
              {editData ? "Modify Record" : "Log New Report"}
            </h1>
          </div>
          <p className="hidden md:block text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] max-w-[200px] border-r border-slate-200 dark:border-slate-800 pr-4 leading-relaxed">
            Every submission is logged to the network's immutable archive for
            transparency.
          </p>
        </div>

        <div className="space-y-10 bg-white dark:bg-slate-900 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">
              Operational Headline
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-0 text-2xl italic font-black tracking-tighter uppercase transition-all bg-transparent border-none outline-none md:text-5xl placeholder:text-slate-100 dark:placeholder:text-slate-800 focus:ring-0 text-slate-900 dark:text-white"
              placeholder="Primary Intel Headline..."
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
                Select Intelligence Category
              </label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      category === cat
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg"
                        : "bg-transparent text-slate-400 dark:text-slate-600 border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
                Visibility Level
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    isPublic
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-lg"
                      : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <Unlock size={14} /> Public Record
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    !isPublic
                      ? "bg-amber-600 text-white border-amber-600 shadow-lg"
                      : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <Lock size={14} /> Encrypted
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
              Evidence Asset Upload
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[16/7] md:aspect-[21/9] bg-slate-50 dark:bg-slate-950 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative"
            >
              {isEncoding ? (
                <Loader2 size={32} className="text-blue-600 animate-spin" />
              ) : imageUrl ? (
                <>
                  <img src={imageUrl} className="object-cover w-full h-full" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl("");
                    }}
                    className="absolute p-2 text-white transition-transform bg-red-600 rounded-full shadow-xl top-4 right-4 hover:scale-110"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="p-6 text-center">
                  <Camera
                    size={32}
                    className="mx-auto mb-3 transition-colors text-slate-300 group-hover:text-blue-500"
                  />
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Click to upload photo evidence
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
            <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">
              Comprehensive Report Body
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full p-0 text-base font-medium leading-relaxed transition-all bg-transparent border-none outline-none md:text-xl placeholder:text-slate-100 dark:placeholder:text-slate-800 focus:ring-0 text-slate-700 dark:text-slate-300 selection:bg-blue-100 dark:selection:bg-blue-900"
              placeholder="Describe your investigative findings in detail here..."
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-6 pt-8 border-t border-slate-100 dark:border-slate-800 sm:flex-row">
            <div className="flex items-center w-full gap-3 px-6 py-4 rounded-full bg-slate-50 dark:bg-slate-950 sm:w-auto">
              <Globe size={16} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Global Node Active
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSyncing || isEncoding}
              className={`w-full sm:w-auto px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                isSyncing
                  ? "bg-slate-200 text-slate-400 dark:bg-slate-800"
                  : "bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-blue-600 hover:text-white"
              }`}
            >
              {isSyncing ? "Syncing..." : "Transmit Intel"}
              {!isSyncing && <Send size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 w-full lg:w-96">
        <div className="lg:sticky lg:top-32">
          <AiAssistant currentHeadline={title} currentContent={content} />
        </div>
      </div>
    </main>
  );
};

export default PostPage;
