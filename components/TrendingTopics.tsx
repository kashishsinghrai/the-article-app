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
  const [isThrottled, setIsThrottled] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [briefing, setBriefing] = useState<DetailedBriefing | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);

  const fetchLock = useRef(false);

  const getFallbackData = () => [
    {
      title: "Supply Chain Resilience",
      description:
        "Global shifts in semiconductor manufacturing to South Asia.",
      region: "Global",
      heat: 92,
    },
    {
      title: "Urban Water Policy",
      description: "New legislation on groundwater management in Mumbai.",
      region: "India",
      heat: 85,
    },
    {
      title: "AI Integrity Act",
      description:
        "Proposals for verifiable journalism standards in the age of generative AI.",
      region: "Global",
      heat: 98,
    },
    {
      title: "Renewable Grid Expansion",
      description:
        "Solar initiatives across the Thar Desert reaching record output.",
      region: "India",
      heat: 77,
    },
    {
      title: "Privacy Protocol 4.0",
      description: "New end-to-end standards for whistleblower protection.",
      region: "Global",
      heat: 89,
    },
    {
      title: "Port Infrastructure",
      description: "Deep-sea port development in Kerala hitting phase 3.",
      region: "India",
      heat: 64,
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
        if (!process.env.API_KEY) {
          throw new Error("API Key Missing");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents:
            "Analyze current global news cycles and Indian journalism trends. Provide 6 major ongoing journalism topics. Include a title, a 1-sentence description, region (India or Global), and a heat level (0-100).",
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
        console.warn(
          "AI Node Warning: Switching to local archive due to key restrictions."
        );
        setTopics(getFallbackData());
        setIsMock(true);
        // Removed the technical toast error message as requested
      } finally {
        setLoading(false);
        fetchLock.current = false;
      }
    };

    fetchTrendingTopics();
  }, []);

  const handleOpenBriefing = async (topic: Topic) => {
    setSelectedTopic(topic);
    setBriefingLoading(true);
    setBriefing(null);

    try {
      if (!process.env.API_KEY) throw new Error("Skip API");

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a detailed investigative briefing for: "${topic.title}". Context: ${topic.description}. Region: ${topic.region}. JSON format: context (100 words), key_players (list of 3), investigative_angle, reliability_score.`,
        config: { responseMimeType: "application/json" },
      });

      const data = JSON.parse(response.text || "{}");
      setBriefing(data);
    } catch (err) {
      setBriefing({
        context: `The topic of ${topic.title} is currently being monitored by our regional nodes. Preliminary intel suggests a ${topic.heat}% public interest surge in ${topic.region}. Investigative teams are advised to proceed with verified sources only.`,
        key_players: [
          "Local Regulatory Bodies",
          "Regional Media Consortia",
          "Independent Watchdogs",
        ],
        investigative_angle:
          "Focus on the transparency of local stakeholders over the next 12 months.",
        reliability_score: 75,
      });
    } finally {
      setBriefingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Synchronizing News Nodes...
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="py-24 animate-in fade-in duration-1000">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              <span
                className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                  isMock ? "text-amber-500" : "text-blue-600"
                }`}
              >
                {isMock ? "PROTOCOL: LOCAL ARCHIVE" : "LIVE INTELLIGENCE"}
              </span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter transition-colors leading-[0.9]">
              Wire <br /> Intelligence
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, i) => (
            <div
              key={i}
              onClick={() => handleOpenBriefing(topic)}
              className="group p-8 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-600/30 transition-all duration-500 relative overflow-hidden backdrop-blur-sm cursor-pointer"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      topic.region === "India"
                        ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                        : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {topic.region}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap size={12} className="text-yellow-500" />
                    <span className="text-[10px] font-black text-slate-900 dark:text-white tracking-widest">
                      {topic.heat}{" "}
                      <span className="text-slate-300 dark:text-slate-700">
                        HEAT
                      </span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-none tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight leading-relaxed line-clamp-2">
                    {topic.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-1000 ease-out"
                      style={{ width: `${topic.heat}%` }}
                    />
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                    VIEW <Globe size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedTopic && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl"
            onClick={() => setSelectedTopic(null)}
          />
          <div className="relative w-full max-w-4xl max-h-full overflow-hidden bg-white dark:bg-slate-950 rounded-[4rem] shadow-2xl border border-white/10 flex flex-col">
            <div className="flex items-center justify-between px-10 py-6 border-b border-slate-100 dark:border-white/5">
              <button
                onClick={() => setSelectedTopic(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                <ArrowLeft size={16} /> Close Briefing
              </button>
              <div className="flex items-center gap-2 text-blue-600">
                <ShieldAlert size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest italic">
                  Node Intelligence Feed
                </span>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-10 md:p-16 space-y-12">
              <header className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest">
                    {selectedTopic.region}
                  </div>
                  <div className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                    Heat Level: {selectedTopic.heat}%
                  </div>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                  {selectedTopic.title}
                </h2>
              </header>

              {briefingLoading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 opacity-40">
                  <Cpu size={48} className="text-blue-600 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                    Establishing Node Link...
                  </p>
                </div>
              ) : briefing ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                      Tactical Context
                    </label>
                    <p className="text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      {briefing.context}
                    </p>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-100 dark:border-white/5">
                    <section className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Stakeholders
                      </label>
                      <div className="space-y-2">
                        {briefing.key_players.map((player, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5"
                          >
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                            <span className="text-xs font-black uppercase tracking-tight text-slate-700 dark:text-slate-300">
                              {player}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                          Analysis Angle
                        </label>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase italic leading-relaxed">
                          "{briefing.investigative_angle}"
                        </p>
                      </div>
                      <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                            Reliability Score
                          </p>
                          <p className="text-2xl font-black italic text-white">
                            {briefing.reliability_score}%
                          </p>
                        </div>
                        <ShieldCheck className="text-emerald-500" size={24} />
                      </div>
                    </section>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrendingTopics;
