import React, { useState, useRef } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import {
  TrendingUp,
  Globe,
  Loader2,
  Zap,
  ShieldCheck,
  X,
  ArrowLeft,
  ShieldAlert,
  Cpu,
  Clock,
  Newspaper,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Topic {
  title: string;
  description: string;
  region: string;
  heat: number;
}

interface DetailedBriefing {
  context: string;
  key_players: string[];
  investigative_angle: string;
  reliability_score: number;
}

const CACHE_KEY = "the_articles_trending_cache";
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

const TrendingTopics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [briefing, setBriefing] = useState<DetailedBriefing | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  const fetchLock = useRef(false);

  const getFallbackData = () => [
    {
      title: "Global Technology Trends",
      description:
        "How artificial intelligence is changing local businesses in India.",
      region: "Global",
      heat: 95,
    },
    {
      title: "Local Market Prices",
      description:
        "Changes in daily commodity prices across major Indian cities.",
      region: "India",
      heat: 88,
    },
    {
      title: "Public Education Update",
      description:
        "New digital learning tools introduced in rural government schools.",
      region: "India",
      heat: 82,
    },
    {
      title: "Clean Energy News",
      description: "Solar power growth reaching new records in North India.",
      region: "India",
      heat: 79,
    },
    {
      title: "Global Health Policy",
      description: "Updated guidelines for community healthcare workers.",
      region: "Global",
      heat: 91,
    },
    {
      title: "New Job Opportunities",
      description: "Rise in demand for skilled labor in manufacturing sectors.",
      region: "India",
      heat: 86,
    },
  ];

  React.useEffect(() => {
    if (fetchLock.current) return;
    fetchLock.current = true;

    const fetchTrendingTopics = async () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setTopics(data);
          setLoading(false);
          fetchLock.current = false;
          return;
        }
      }

      try {
        if (!process.env.API_KEY) throw new Error("API Key Missing");

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents:
            "Provide 6 major ongoing news topics. Include a title, a 1-sentence description, region (India or Global), and a heat level (0-100). Use simple, everyday language.",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  region: { type: Type.STRING },
                  heat: { type: Type.NUMBER },
                },
                required: ["title", "description", "region", "heat"],
              },
            },
          },
        });

        const data = JSON.parse(response.text || "[]");
        const finalData = data.length > 0 ? data : getFallbackData();

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: finalData, timestamp: Date.now() })
        );
        setTopics(finalData);
      } catch (err: any) {
        setTopics(getFallbackData());
        setIsMock(true);
      } finally {
        setLoading(false);
        fetchLock.current = false;
      }
    };

    fetchTrendingTopics();
  }, []);

  const handleOpenBriefing = (topic: Topic) => {
    setSelectedTopic(topic);
    setBriefingLoading(false);
    setBriefing({
      context: `The story about ${topic.title} is trending across the network. Currently, ${topic.heat}% of readers are interested in this topic in ${topic.region}. Our community reporters are gathering more details to provide a full report.`,
      key_players: [
        "Local Community Leaders",
        "Industry Experts",
        "Public Representatives",
      ],
      investigative_angle:
        "Looking into the long-term impact on everyday citizens.",
      reliability_score: 90,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2
          className="w-12 h-12 text-blue-600 animate-spin"
          strokeWidth={3}
        />
        <p className="text-xs font-black tracking-widest uppercase text-slate-500">
          Loading Latest News...
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="py-24 duration-1000 animate-in fade-in">
        <div className="flex flex-col items-end justify-between gap-6 pb-10 mb-16 border-b-4 md:flex-row border-slate-950 dark:border-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-blue-600" strokeWidth={3} />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">
                Trending Now
              </span>
            </div>
            <h2 className="text-6xl font-black text-slate-950 dark:text-white uppercase italic tracking-tighter leading-[0.85]">
              Global <br /> Headlines
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <div
              key={i}
              onClick={() => handleOpenBriefing(topic)}
              className="group p-10 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-white/5 shadow-lg hover:shadow-2xl hover:border-blue-600 transition-all duration-500 relative overflow-hidden cursor-pointer"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-start justify-between">
                  <div
                    className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${
                      topic.region === "India"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {topic.region}
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="fill-current text-amber-500" />
                    <span className="text-sm font-black text-slate-950 dark:text-white">
                      {topic.heat}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl italic font-black leading-none tracking-tight uppercase transition-colors text-slate-950 dark:text-white group-hover:text-blue-600">
                    {topic.title}
                  </h3>
                  <p className="text-sm font-bold leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                    {topic.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full transition-all duration-1000 bg-blue-600"
                      style={{ width: `${topic.heat}%` }}
                    />
                  </div>
                  <button className="text-[11px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                    DETAILS <ArrowLeft size={14} className="rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedTopic && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl"
            onClick={() => setSelectedTopic(null)}
          />
          <div className="relative w-full max-w-3xl overflow-hidden bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl border-2 border-slate-100 dark:border-white/10 flex flex-col">
            <div className="flex items-center justify-between px-10 py-8 border-b-2 border-slate-100 dark:border-white/10">
              <button
                onClick={() => setSelectedTopic(null)}
                className="flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-colors text-[11px] font-black uppercase tracking-widest"
              >
                <ArrowLeft size={20} /> Back to News
              </button>
              <ShieldCheck className="text-blue-600" size={24} />
            </div>

            <div className="p-12 space-y-12 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="px-6 py-2 text-xs font-black text-white uppercase bg-blue-600 rounded-full">
                    {selectedTopic.region}
                  </span>
                  <span className="text-sm font-black text-slate-400">
                    Heat Level: {selectedTopic.heat}%
                  </span>
                </div>
                <h2 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-6xl text-slate-950 dark:text-white">
                  {selectedTopic.title}
                </h2>
              </div>

              {briefing && (
                <div className="space-y-12">
                  <div className="space-y-4">
                    <label className="text-xs font-black tracking-widest text-blue-600 uppercase">
                      Story Context
                    </label>
                    <p className="text-xl italic font-bold leading-relaxed text-slate-700 dark:text-slate-300">
                      "{briefing.context}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-10 pt-10 border-t-2 md:grid-cols-2 border-slate-100 dark:border-white/10">
                    <div className="space-y-4">
                      <label className="text-xs font-black tracking-widest text-blue-600 uppercase">
                        Key Information
                      </label>
                      <div className="space-y-3">
                        {briefing.key_players.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-2xl"
                          >
                            <div className="w-3 h-3 bg-blue-600 rounded-full" />
                            <span className="text-sm font-black uppercase text-slate-950 dark:text-white">
                              {p}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black tracking-widest text-blue-600 uppercase">
                          Our Perspective
                        </label>
                        <p className="text-sm font-bold leading-relaxed text-slate-500 dark:text-slate-400">
                          {briefing.investigative_angle}
                        </p>
                      </div>
                      <div className="p-8 bg-slate-950 rounded-[2.5rem] flex justify-between items-center shadow-xl">
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                            Trust Score
                          </p>
                          <p className="text-4xl italic font-black text-white">
                            {briefing.reliability_score}%
                          </p>
                        </div>
                        <ShieldCheck className="text-emerald-500" size={40} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrendingTopics;
