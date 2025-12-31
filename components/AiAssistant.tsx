import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import {
  BrainCircuit,
  Loader2,
  ShieldCheck,
  Zap,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

interface AiAssistantProps {
  currentHeadline: string;
  currentContent: string;
}

interface Analysis {
  field_context: string;
  verification_tips: string[];
  bias_score: number;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  currentHeadline,
  currentContent,
}) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastAnalysisTime = useRef(0);

  const runAnalysis = async () => {
    if (!currentHeadline.trim() || currentContent.length < 100) return;
    if (Date.now() - lastAnalysisTime.current < 30000) return;

    setLoading(true);
    setError(null);
    try {
      if (!process.env.API_KEY) throw new Error("Key Missing");

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Act as a senior editor. Analyze report:
        Headline: ${currentHeadline}
        Content: ${currentContent}
        
        Return JSON: field_context (Short), verification_tips (List of 3), bias_score (0-100).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              field_context: { type: Type.STRING },
              verification_tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              bias_score: { type: Type.NUMBER },
            },
            required: ["field_context", "verification_tips", "bias_score"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      setAnalysis(data);
      lastAnalysisTime.current = Date.now();
    } catch (err: any) {
      setError("Network busy. Please retry later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentHeadline.length > 20 && currentContent.length > 200) {
        runAnalysis();
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [currentHeadline, currentContent]);

  return (
    <div className="sticky top-32 glass dark:bg-slate-900/40 rounded-[3rem] p-10 border border-blue-100 dark:border-blue-900/30 shadow-2xl space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
      <div className="flex justify-between items-center border-b border-blue-50 dark:border-blue-900/20 pb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl text-white shadow-lg ${
              error ? "bg-amber-500" : "bg-blue-600"
            }`}
          >
            <BrainCircuit size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
              AI INSIGHTS
            </h4>
            <p
              className={`text-[8px] font-bold uppercase tracking-widest ${
                error ? "text-amber-500" : "text-slate-400"
              }`}
            >
              {error ? "NETWORK BUSY" : "READY TO ANALYSE"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="py-8 text-center animate-in zoom-in duration-300">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/40">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      )}

      {!analysis && !loading && !error && (
        <div className="py-20 text-center space-y-4 opacity-30">
          <Zap size={32} className="text-slate-300 mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            WAITING FOR CONTENT...
          </p>
        </div>
      )}

      {analysis && !error && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-widest text-blue-600">
              EDITORIAL BRIEF
            </label>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-tight italic">
              "{analysis.field_context}"
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-widest text-blue-600">
              VERIFICATION STEPS
            </label>
            <ul className="space-y-3">
              {analysis.verification_tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex gap-3 items-start bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5"
                >
                  <ShieldCheck size={12} className="text-emerald-500 mt-0.5" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-6 border-t border-blue-50 dark:border-blue-900/20">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                SUBJECTIVITY SCORE
              </label>
              <span
                className={`text-[10px] font-black ${
                  analysis.bias_score > 40
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              >
                {analysis.bias_score}%
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={runAnalysis}
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
      >
        {loading ? "PROCESSING..." : "REFRESH INSIGHTS"}
      </button>
    </div>
  );
};

export default AiAssistant;
