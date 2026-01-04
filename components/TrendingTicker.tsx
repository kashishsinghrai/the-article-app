import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Hash } from "lucide-react";

const TrendingTicker: React.FC = () => {
  const [hashtags, setHashtags] = useState<string[]>([
    "GlobalWire",
    "ThE-ARTICLES",
    "Decentralized",
    "Verified",
    "RootAccess",
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchTags = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("hashtags")
          .limit(10);
        if (error) {
          // Silent fallback for schema sync lag
          return;
        }
        if (data && isMounted) {
          const allTags = data.flatMap((d) => (d.hashtags as string[]) || []);
          const uniqueTags = Array.from(new Set(allTags)) as string[];
          if (uniqueTags.length > 0) {
            setHashtags(uniqueTags);
          }
        }
      } catch (e) {
        // Silently catch network or schema errors
      }
    };

    fetchTags();
    const interval = setInterval(fetchTags, 600000); // Check every 10 mins
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative py-4 overflow-hidden bg-slate-950 border-y border-white/5">
      <div className="absolute top-0 bottom-0 left-0 z-10 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
      <div className="absolute top-0 bottom-0 right-0 z-10 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
      <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap">
        {Array(4)
          .fill(hashtags)
          .flat()
          .map((tag, i) => (
            <div key={i} className="flex items-center gap-2 px-12">
              <Hash size={12} className="text-blue-600" />
              <span className="text-white font-black italic text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-blue-500">
                {tag}
              </span>
              <div className="w-1.5 h-1.5 bg-white/10 rounded-full mx-4" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default TrendingTicker;
