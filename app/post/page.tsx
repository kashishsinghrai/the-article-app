import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Send,
  Search,
  BarChart3,
  Map,
  TrendingUp,
  Globe,
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
  X,
  Loader2,
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
    }
  }, [editData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit to 1.5MB for base64 storage efficiency
      if (file.size > 1.5 * 1024 * 1024) {
        toast.error("File too large. Max 1.5MB for secure transmission.");
        return;
      }

      setIsEncoding(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setIsEncoding(false);
        toast.success("Evidence Assets Encoded");
      };
      reader.onerror = () => {
        setIsEncoding(false);
        toast.error("Protocol Error: Encoding Failed");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Operational Headline & Transmission Body Required");
      return;
    }
    setIsSyncing(true);
    onPublish({
      title: title.trim(),
      content: content.trim(),
      category,
      image_url: imageUrl,
    });
  };

  const categories: Category[] = ["Investigative", "Economic", "Regional"];

  return (
    <main className="max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row gap-16 relative">
      <div className="flex-1 space-y-16">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <TrendingUp size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Protocol Version 2.5
              </span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none transition-colors">
              {editData ? "Edit <br/>Transmission" : "File New <br/>Report"}
            </h1>
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] max-w-[200px] text-left md:text-right border-l md:border-l-0 md:border-r border-slate-200 dark:border-slate-800 pl-4 md:pl-0 md:pr-4 leading-relaxed">
            Verified citizen journalism strengthens global transparency through
            peer-to-peer verification.
          </p>
        </div>

        <div className="space-y-12">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">
              01. Operational Headline
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-5xl font-black uppercase italic tracking-tighter placeholder:text-slate-100 dark:placeholder:text-slate-900 border-none focus:ring-0 p-0 bg-transparent text-slate-900 dark:text-white transition-colors"
              placeholder="Headline of discovery..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">
              02. Intelligence Category
            </label>
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.15em] border transition-all duration-300 ${
                    category === cat
                      ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                      : "bg-transparent text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">
              03. Field Evidence
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[21/9] bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-all overflow-hidden relative"
            >
              {isEncoding ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 size={32} className="animate-spin text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Encoding Evidence...
                  </span>
                </div>
              ) : imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl("");
                    }}
                    className="absolute top-6 right-6 p-3 bg-red-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="p-6 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-4 border dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Camera size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Click to Upload Evidence Assets
                  </span>
                  <span className="text-[8px] font-bold uppercase text-slate-300 mt-2">
                    Max Size: 1.5MB
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
            <label className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">
              04. Transmission Body
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full text-xl font-medium leading-relaxed placeholder:text-slate-200 dark:placeholder:text-slate-900 border-none focus:ring-0 p-0 bg-transparent text-slate-600 dark:text-slate-400 selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors"
              placeholder="Detailed investigative findings..."
            />
          </div>

          <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 px-8 py-5 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border dark:border-slate-700">
                <Globe size={20} />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none mb-1">
                  Global Node Sync
                </span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Active Status
                </span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSyncing || isEncoding}
              className={`flex items-center gap-5 px-14 py-7 rounded-full text-lg font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${
                isSyncing
                  ? "bg-slate-300"
                  : "bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-blue-600"
              }`}
            >
              {isSyncing
                ? "Syncing..."
                : editData
                ? "Update Record"
                : "Transmit Report"}
              {!isSyncing && <Send size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 flex-shrink-0">
        <AiAssistant currentHeadline={title} currentContent={content} />
      </div>
    </main>
  );
};

export default PostPage;
