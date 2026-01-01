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
          <ArrowLeft size={16} /> Back
        </button>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold leading-none tracking-tighter md:text-7xl text-slate-900 dark:text-white">
            Creator
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">
            Publishing operational intelligence to the network
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-8 md:p-14 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-12">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-0 text-3xl font-bold tracking-tight bg-transparent border-none outline-none md:text-5xl placeholder:text-slate-100 dark:placeholder:text-slate-900 focus:ring-0 text-slate-950 dark:text-white"
            placeholder="Headline..."
          />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Subject Group
              </label>
              <div className="flex flex-wrap gap-2">
                {["Investigative", "Economic", "Regional"].map((cat: any) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Visibility
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                    isPublic
                      ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      : "text-slate-300 border-slate-50 dark:border-slate-800"
                  }`}
                >
                  <Unlock size={14} /> Public
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                    !isPublic
                      ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950"
                      : "text-slate-300 border-slate-50 dark:border-slate-800"
                  }`}
                >
                  <Lock size={14} /> Private
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Hash size={12} /> Tags (Comma separated)
            </label>
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl px-6 py-3.5 text-sm font-bold text-slate-950 dark:text-white outline-none focus:ring-1 focus:ring-slate-300 transition-all"
              placeholder="news, reporting, youth"
            />
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[16/6] bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-slate-300 transition-all overflow-hidden"
          >
            {imageUrl ? (
              <img src={imageUrl} className="object-cover w-full h-full" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center opacity-30">
                <Camera size={24} />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Attach Media
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

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full p-0 text-lg font-medium leading-relaxed bg-transparent border-none outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800 focus:ring-0 text-slate-600 dark:text-slate-400"
            placeholder="Report details..."
          />

          <div className="flex justify-end pt-10 border-t border-slate-50 dark:border-slate-900">
            <button
              onClick={handleSubmit}
              disabled={isSyncing || isEncoding}
              className="w-full sm:w-auto px-12 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-all shadow-sm"
            >
              {isSyncing ? "Syncing..." : "Publish Report"}
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
