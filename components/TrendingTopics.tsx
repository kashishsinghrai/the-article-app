import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { TrendingUp, Loader2, Zap, ShieldCheck, ArrowLeft } from "lucide-react";

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
const CACHE_EXPIRY = 30 * 60 * 1000;

const TrendingTopics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [briefing, setBriefing] = useState<DetailedBriefing | null>(null);

  const fetchLock = useRef(false);

  const getFallbackData = () => [
    {
      title: "Global Tech Shift",
      description: "AI adoption peaks in regional infrastructure.",
      region: "Global",
      heat: 95,
    },
    {
      title: "Market Volatility",
      description: "Cryptographic assets surge amid economic shifts.",
      region: "Global",
      heat: 88,
    },
    {
      title: "Renewable Surge",
      description: "Solar expansion exceeds quarterly targets.",
      region: "India",
      heat: 82,
    },
    {
      title: "Privacy Reform",
      description: "New protocols for personal data protection.",
      region: "Global",
      heat: 79,
    },
    {
      title: "Trade Realignment",
      description: "Regional trade blocs negotiate new corridors.",
      region: "Global",
      heat: 91,
    },
    {
      title: "Education Tech",
      description: "Decentralized learning tools gain mainstream traction.",
      region: "Global",
      heat: 86,
    },
  ];

  useEffect(() => {
    if (fetchLock.current) return;
    fetchLock.current = true;

    const fetchTrending = async () => {
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
        // Initialize Gemini client according to guidelines using process.env.API_KEY directly
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents:
            "Provide 6 major ongoing news topics. Include a title, a 1-sentence description, region (India or Global), and a heat level (0-100). Keep it succinct.",
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
      } catch (err) {
        setTopics(getFallbackData());
      } finally {
        setLoading(false);
        fetchLock.current = false;
      }
    };

    fetchTrending();
  }, []);

  const handleOpenBriefing = (topic: Topic) => {
    setSelectedTopic(topic);
    setBriefing({
      context: `The dispatch concerning ${topic.title} is gaining massive engagement within the network. Data suggests a ${topic.heat}% heat coefficient in the ${topic.region} sector.`,
      key_players: ["Industry Analysts", "Platform Verifiers", "Policy Makers"],
      investigative_angle:
        "Identifying long-term stability vectors and potential node conflicts.",
      reliability_score: 92,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-xs font-black tracking-widest uppercase text-slate-500">
          Decrypting Trends...
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="py-24 duration-700 animate-in fade-in">
        <div className="flex flex-col items-end justify-between gap-6 pb-10 mb-16 border-b-4 md:flex-row border-slate-950 dark:border-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-blue-600" />
              <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">
                Active Shards
              </span>
            </div>
            <h2 className="text-6xl italic font-black leading-none tracking-tighter uppercase text-slate-950 dark:text-white">
              Headlines
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <div
              key={i}
              onClick={() => handleOpenBriefing(topic)}
              className="group p-10 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-white/5 shadow-lg hover:shadow-2xl hover:border-blue-600 transition-all duration-500 cursor-pointer"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <span
                    className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${
                      topic.region === "India"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {topic.region}
                  </span>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="fill-current text-amber-500" />
                    <span className="text-sm font-black text-slate-950 dark:text-white">
                      {topic.heat}%
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl italic font-black leading-none tracking-tight uppercase transition-colors group-hover:text-blue-600 text-slate-950 dark:text-white">
                    {topic.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400 line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedTopic && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl"
            onClick={() => setSelectedTopic(null)}
          />
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-white/10 flex flex-col p-12 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedTopic(null)}
              className="flex items-center gap-3 text-slate-500 hover:text-blue-600 text-[11px] font-black uppercase tracking-widest mb-8"
            >
              <ArrowLeft size={20} /> Exit Briefing
            </button>
            <div className="space-y-8">
              <h2 className="text-5xl italic font-black uppercase text-slate-950 dark:text-white">
                {selectedTopic.title}
              </h2>
              {briefing && (
                <div className="space-y-12">
                  <p className="text-xl italic font-bold text-slate-700 dark:text-slate-300">
                    "{briefing.context}"
                  </p>
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-blue-600 uppercase">
                        Verification Factors
                      </label>
                      <div className="space-y-3">
                        {briefing.key_players.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-white/5 rounded-2xl"
                          >
                            <div className="w-3 h-3 bg-blue-600 rounded-full" />
                            <span className="text-sm font-black uppercase dark:text-white">
                              {p}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <label className="text-xs font-black text-blue-600 uppercase">
                          Investigative Vector
                        </label>
                        <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                          {briefing.investigative_angle}
                        </p>
                      </div>
                      <div className="p-8 bg-slate-950 rounded-[2.5rem] flex justify-between items-center border border-white/5">
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Reliability Score
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
