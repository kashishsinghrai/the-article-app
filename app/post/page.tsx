import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Send,
  X,
  Loader2,
  Lock,
  Unlock,
  PenSquare,
  ArrowLeft,
  Hash,
  Type,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Article, Category } from "../../types";
import AiAssistant from "../../components/AiAssistant";

interface PostPageProps {
  onPublish: (data: Partial<Article>) => void;
  editData?: Article | null;
  onBack: () => void;
}

const PostPage: React.FC<PostPageProps> = ({ onPublish, editData, onBack }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
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
      setHashtags(editData.hashtags?.join(", ") || "");
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Headline and content are mandatory.");
      return;
    }
    setIsSyncing(true);
    const tagArray = hashtags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);
    onPublish({
      title: title.trim(),
      content: content.trim(),
      category,
      image_url: imageUrl,
      is_private: !isPublic,
      hashtags: tagArray,
    });
  };

  return (
    <main className="flex flex-col min-h-screen gap-16 px-8 py-24 mx-auto max-w-7xl md:py-32 lg:flex-row">
      <div className="flex-1 space-y-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold uppercase text-[10px] tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Exit to Feed
        </button>

        <div className="space-y-4">
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-7xl text-slate-900 dark:text-white">
            Creator
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">
            Transmission Hub for Verified Intelligence
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-8 md:p-14 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-12 shadow-sm">
          {/* Headline Field */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              <Type size={14} /> Primary Headline
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-0 text-3xl font-black tracking-tight bg-transparent border-none outline-none md:text-5xl placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 text-slate-950 dark:text-white"
              placeholder="ENTER BROADCAST TITLE..."
            />
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Category Select */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Report Classification
              </label>
              <div className="flex flex-wrap gap-2">
                {["Investigative", "Economic", "Regional"].map((cat: any) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      category === cat
                        ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950"
                        : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Access Protocol
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${
                    isPublic
                      ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-inner"
                      : "text-slate-300 border-slate-50 dark:border-slate-800"
                  }`}
                >
                  <Unlock size={14} /> Global
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${
                    !isPublic
                      ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950"
                      : "text-slate-300 border-slate-50 dark:border-slate-800"
                  }`}
                >
                  <Lock size={14} /> Encrypted
                </button>
              </div>
            </div>
          </div>

          {/* Hashtags Field */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Hash size={14} /> Search Indexing Tags
            </label>
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-6 py-4 text-sm font-bold transition-all border outline-none bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-950 dark:text-white focus:ring-1 focus:ring-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder="politics, climate, investigative"
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <ImageIcon size={14} /> Visual Evidence
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[16/6] bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-slate-300 transition-all overflow-hidden relative group"
            >
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    className="object-cover w-full h-full transition-opacity group-hover:opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                    <p className="text-[10px] font-black text-white bg-black/50 px-4 py-2 rounded-full uppercase tracking-widest">
                      Replace Media
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center transition-all opacity-20 group-hover:opacity-40">
                  <Camera size={32} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Attach Operational Assets
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

          {/* Content Field */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <FileText size={14} /> Intelligence Narrative
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full p-0 text-lg font-medium leading-relaxed bg-transparent border-none outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-0 text-slate-600 dark:text-slate-300"
              placeholder="Detailed report content goes here. Minimum 200 characters for AI analysis..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-10 border-t border-slate-50 dark:border-slate-900">
            <button
              onClick={handleSubmit}
              disabled={isSyncing || isEncoding}
              className="w-full sm:w-auto px-16 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-full text-[12px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {isSyncing ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Sync with Network"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 w-full lg:w-80">
        <AiAssistant currentHeadline={title} currentContent={content} />
      </div>
    </main>
  );
};

export default PostPage;
