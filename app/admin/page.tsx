import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  FileText,
  Users,
  Activity,
  Zap,
  MessageCircle,
  ArrowLeft,
  Radio,
  Eye,
} from "lucide-react";
import { Article, Profile, LiveMessage } from "../../types";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

interface AdminPageProps {
  articles: Article[];
  users: Profile[];
  currentUserId: string;
}

const AdminPage: React.FC<AdminPageProps> = ({
  articles,
  users,
  currentUserId,
}) => {
  const [activeTab, setActiveTab] = useState<
    "articles" | "users" | "monitor" | "intercept"
  >("monitor");
  const [intercepts, setIntercepts] = useState<any[]>([]);
  const [activeInterception, setActiveInterception] = useState<string | null>(
    null
  );
  const [interceptedMessages, setInterceptedMessages] = useState<LiveMessage[]>(
    []
  );

  useEffect(() => {
    const channel = supabase.channel("admin_oversight");
    channel
      .on("broadcast", { event: "intercept_pulse" }, (p) => {
        setIntercepts((prev) => {
          const exists = prev.find((i) => i.room === p.payload.room);
          if (exists) return prev;
          return [...prev, p.payload];
        });

        if (activeInterception === p.payload.room) {
          setInterceptedMessages((prev) => [...prev, p.payload]);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [activeInterception]);

  const joinIntercept = (room: string) => {
    setActiveInterception(room);
    setInterceptedMessages([]);
    toast(`Node Intercepted: Room ${room.substring(0, 8)}`, { icon: "🎧" });
  };

  return (
    <main className="max-w-6xl px-8 py-32 mx-auto space-y-20">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert size={20} />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">
              Bureau Oversight Terminal
            </span>
          </div>
          <h1 className="italic font-bold tracking-tighter uppercase text-7xl dark:text-white">
            ADMIN
          </h1>
        </div>
        <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
          <TabButton
            active={activeTab === "monitor"}
            onClick={() => setActiveTab("monitor")}
            label="Pulse"
          />
          <TabButton
            active={activeTab === "intercept"}
            onClick={() => setActiveTab("intercept")}
            label="Intercept"
          />
          <TabButton
            active={activeTab === "articles"}
            onClick={() => setActiveTab("articles")}
            label="Content"
          />
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            label="Nodes"
          />
        </div>
      </div>

      <div className="space-y-12">
        {activeTab === "monitor" && (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <MonitorCard
              label="Total Intelligence Units"
              value={articles.length}
            />
            <MonitorCard label="Active Nodes" value={users.length} />
            <MonitorCard label="Uptime Status" value="Nominal" />
          </div>
        )}

        {activeTab === "intercept" && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <h3 className="text-xs font-black tracking-widest uppercase text-slate-400">
                Active Channels
              </h3>
              {intercepts.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-center opacity-30">
                  <Radio className="mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    No active secure links detected
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {intercepts.map((i, idx) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-[2rem] border transition-all flex justify-between items-center ${
                        activeInterception === i.room
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                      }`}
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                          Intercept #{idx + 1}
                        </p>
                        <p className="text-xs italic font-black uppercase">
                          {i.node1} ↔ {i.node2}
                        </p>
                      </div>
                      <button
                        onClick={() => joinIntercept(i.room)}
                        className="p-3 transition-all bg-white/10 rounded-xl hover:bg-white/20"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 bg-slate-950 rounded-[3rem] p-10 min-h-[500px] flex flex-col border border-white/5">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    Live Monitor
                  </span>
                </div>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                  Channel: {activeInterception || "NULL"}
                </span>
              </div>

              <div className="flex-grow space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar">
                {interceptedMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 border bg-white/5 rounded-2xl border-white/5"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                        {m.senderName}
                      </span>
                      <span className="text-[8px] font-mono text-slate-600">
                        [{new Date(m.timestamp).toLocaleTimeString()}]
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-300">
                      {m.text}
                    </p>
                  </div>
                ))}
                {!activeInterception && (
                  <div className="flex items-center justify-center h-full opacity-20">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                      Select channel to intercept
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab !== "monitor" && activeTab !== "intercept" && (
          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 space-y-10 min-h-[600px]">
            <div className="flex items-center gap-4 px-8 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <Search size={18} className="text-slate-400" />
              <input
                className="flex-grow text-sm font-bold bg-transparent border-none outline-none dark:text-white"
                placeholder="Search protocol index..."
              />
            </div>
            {/* Articles/Users list goes here - kept minimal as requested */}
          </div>
        )}
      </div>
    </main>
  );
};

const MonitorCard = ({ label, value }: any) => (
  <div className="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] space-y-3 shadow-sm">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <p className="text-4xl italic font-black tracking-tighter uppercase dark:text-white">
      {value}
    </p>
  </div>
);

const TabButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl scale-105"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
  </button>
);

export default AdminPage;
