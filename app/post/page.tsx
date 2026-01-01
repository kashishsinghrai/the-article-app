import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Send,
  ShieldCheck,
  Zap,
  X,
  Loader2,
  Lock,
  Unlock,
  PenSquare,
  FileText,
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
        toast.success("Image Uploaded Successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Headline and Story are required.");
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
    <main className="flex flex-col min-h-screen gap-16 px-6 py-24 mx-auto max-w-7xl md:py-32 lg:flex-row bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 space-y-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-blue-600">
            <PenSquare size={24} strokeWidth={3} />
            <span className="text-xs font-black uppercase tracking-[0.4em]">
              Article Editor
            </span>
          </div>
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-8xl text-slate-950 dark:text-white">
            {editData ? "Edit Story" : "Post News"}
          </h1>
          <p className="max-w-lg text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
            Share your verified news with the world. Your voice matters.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3.5rem] shadow-2xl border-2 border-slate-100 dark:border-white/5 space-y-10">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
              News Headline
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-0 text-3xl italic font-black tracking-tighter uppercase bg-transparent border-none outline-none md:text-5xl placeholder:text-slate-200 dark:placeholder:text-slate-800 focus:ring-0 text-slate-950 dark:text-white"
              placeholder="Enter headline here..."
            />
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Category
              </label>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                      category === cat
                        ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950"
                        : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Who can see this?
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase border-2 transition-all ${
                    isPublic
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <Unlock size={16} /> Everyone
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase border-2 transition-all ${
                    !isPublic
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-transparent text-slate-400 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <Lock size={16} /> Only Me
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Add Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-600 transition-all overflow-hidden relative shadow-inner"
            >
              {isEncoding ? (
                <Loader2 size={40} className="text-blue-600 animate-spin" />
              ) : imageUrl ? (
                <>
                  <img src={imageUrl} className="object-cover w-full h-full" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl("");
                    }}
                    className="absolute p-3 text-white transition-transform bg-red-600 shadow-xl top-6 right-6 rounded-2xl hover:scale-110"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <div className="p-10 text-center">
                  <Camera
                    size={48}
                    className="mx-auto mb-4 transition-colors text-slate-300 group-hover:text-blue-600"
                  />
                  <span className="block text-sm font-black tracking-widest uppercase text-slate-400">
                    Click to Upload Photo
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
            <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
              Article Story
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full p-0 text-xl font-bold leading-relaxed bg-transparent border-none outline-none md:text-2xl placeholder:text-slate-100 dark:placeholder:text-slate-800 focus:ring-0 text-slate-800 dark:text-slate-200"
              placeholder="Tell your story here..."
            />
          </div>

          <div className="flex flex-col items-center justify-between gap-6 pt-10 border-t-2 border-slate-100 dark:border-slate-800 sm:flex-row">
            <div className="flex items-center gap-3 px-6 py-3 border rounded-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/5">
              <Zap size={18} className="text-blue-600" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                Auto-Save Enabled
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSyncing || isEncoding}
              className={`w-full sm:w-auto px-12 py-5 rounded-full text-sm font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                isSyncing
                  ? "bg-slate-200 text-slate-400"
                  : "bg-blue-600 text-white hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900"
              }`}
            >
              {isSyncing ? "Posting..." : "Publish Now"}
              {!isSyncing && <Send size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 w-full lg:w-96">
        <div className="lg:sticky lg:top-36">
          <AiAssistant currentHeadline={title} currentContent={content} />
        </div>
      </div>
    </main>
  );
};

export default PostPage;
