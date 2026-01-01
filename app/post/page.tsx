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
    onPublish({
      title: title.trim(),
      content: content.trim(),
      category,
      image_url: imageUrl,
      is_private: !isPublic,
    });
  };

  return (
    <main className="flex flex-col max-w-6xl min-h-screen gap-12 px-6 py-24 mx-auto md:py-32 lg:flex-row">
      <div className="flex-1 space-y-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold uppercase text-[10px] tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="space-y-2">
          <h1 className="text-4xl font-black leading-none tracking-tighter uppercase md:text-7xl text-slate-900 dark:text-white">
            Creator
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Publish your perspective to the network
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-12">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-0 text-3xl italic font-black tracking-tighter uppercase bg-transparent border-none outline-none md:text-5xl placeholder:text-slate-200 focus:ring-0 text-slate-900 dark:text-white"
            placeholder="Article Headline"
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {["Investigative", "Economic", "Regional"].map((cat: any) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      category === cat
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900"
                        : "bg-transparent text-slate-300 border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Visibility
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                    isPublic
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "text-slate-300 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <Unlock size={14} /> Public
                </button>
                <button
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                    !isPublic
                      ? "bg-slate-900 text-white border-slate-900"
                      : "text-slate-300 border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <Lock size={14} /> Private
                </button>
              </div>
            </div>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 transition-all overflow-hidden relative"
          >
            {imageUrl ? (
              <img src={imageUrl} className="object-cover w-full h-full" />
            ) : (
              <div className="text-center opacity-30">
                <Camera size={32} className="mx-auto mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Add Image
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
            rows={12}
            className="w-full p-0 text-lg font-medium leading-relaxed bg-transparent border-none outline-none placeholder:text-slate-200 focus:ring-0 text-slate-600 dark:text-slate-400"
            placeholder="Start writing the story..."
          />

          <div className="flex justify-end pt-8 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleSubmit}
              disabled={isSyncing || isEncoding}
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              {isSyncing ? "Syncing..." : "Publish Story"}
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
