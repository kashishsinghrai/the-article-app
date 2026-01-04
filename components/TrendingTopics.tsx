import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Zap,
  ShieldCheck,
  ArrowLeft,
  Terminal,
} from "lucide-react";

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

const TrendingTopics: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [briefing, setBriefing] = useState<DetailedBriefing | null>(null);

  useEffect(() => {
    // Replaced AI fetch with system static intelligence data
    const systemTopics = [
      {
        title: "Global Tech Shift",
        description: "AI adoption peaks in regional infrastructure dispatches.",
        region: "Global",
        heat: 95,
      },
      {
        title: "Market Volatility",
        description: "Cryptographic assets surge amid economic sector shifts.",
        region: "Global",
        heat: 88,
      },
      {
        title: "Renewable Surge",
        description: "Solar expansion exceeds quarterly network targets.",
        region: "India",
        heat: 82,
      },
      {
        title: "Privacy Reform",
        description: "New protocols for personal node data protection.",
        region: "Global",
        heat: 79,
      },
      {
        title: "Trade Realignment",
        description: "Regional trade blocs negotiate new data corridors.",
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
    setTopics(systemTopics);
  }, []);

  const handleOpenBriefing = (topic: Topic) => {
    setSelectedTopic(topic);
    setBriefing({
      context: `The dispatch concerning ${topic.title} is gaining engagement coefficient in the network core. Historical data suggests a ${topic.heat}% heat index in the ${topic.region} sector.`,
      key_players: [
        "Network Verifiers",
        "Platform Correspondents",
        "Policy Nodes",
      ],
      investigative_angle:
        "Identifying node stability vectors and potential dispatch conflicts.",
      reliability_score: 92,
    });
  };

  return (
    <>
      <section className="py-10 space-y-12 duration-700 animate-in fade-in">
        <div className="flex items-center gap-4 pb-8 border-b border-slate-100 dark:border-white/5">
          <div className="p-3 text-blue-600 bg-blue-50 dark:bg-blue-600/10 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="text-3xl italic font-black tracking-tighter uppercase text-slate-900 dark:text-white">
              Active <span className="text-blue-600">Headlines</span>
            </h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Global engagement index across the intelligence shards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <div
              key={i}
              onClick={() => handleOpenBriefing(topic)}
              className="group p-8 bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-blue-600/30 transition-all duration-500 cursor-pointer"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      topic.region === "India"
                        ? "bg-orange-50 dark:bg-orange-950/20 text-orange-600"
                        : "bg-blue-50 dark:bg-blue-950/20 text-blue-600"
                    }`}
                  >
                    {topic.region}
                  </span>
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="fill-current text-amber-500" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {topic.heat}%
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black leading-tight uppercase transition-colors group-hover:text-blue-600 text-slate-950 dark:text-white">
                    {topic.title}
                  </h3>
                  <p className="text-sm italic font-medium leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    "{topic.description}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedTopic && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/80 dark:bg-slate-950/95 backdrop-blur-xl"
            onClick={() => setSelectedTopic(null)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#121212] rounded-[3rem] border border-slate-200 dark:border-white/10 flex flex-col p-10 md:p-14 overflow-y-auto max-h-[90vh] shadow-2xl">
            <button
              onClick={() => setSelectedTopic(null)}
              className="flex items-center gap-3 text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest mb-10"
            >
              <ArrowLeft size={18} /> Return to Feed
            </button>
            <div className="space-y-8 text-center md:text-left">
              <h2 className="text-4xl italic font-black leading-none tracking-tighter uppercase md:text-5xl text-slate-950 dark:text-white">
                {selectedTopic.title}
              </h2>
              {briefing && (
                <div className="space-y-12">
                  <p className="text-xl italic font-bold leading-relaxed md:text-2xl text-slate-700 dark:text-slate-300">
                    "{briefing.context}"
                  </p>
                  <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="space-y-5">
                      <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                        Verification Vectors
                      </label>
                      <div className="space-y-3">
                        {briefing.key_players.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-4 border bg-slate-50 dark:bg-white/5 rounded-2xl border-slate-100 dark:border-white/5"
                          >
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                            <span className="text-xs font-black uppercase text-slate-900 dark:text-white">
                              {p}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                          Investigative Perspective
                        </label>
                        <p className="mt-3 text-sm italic font-bold leading-relaxed text-slate-500 dark:text-slate-400">
                          {briefing.investigative_angle}
                        </p>
                      </div>
                      <div className="p-8 bg-slate-950 rounded-[2.5rem] flex justify-between items-center shadow-xl border border-white/5">
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Trust Rating
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
