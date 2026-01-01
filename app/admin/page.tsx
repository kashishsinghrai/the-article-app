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
  ChevronRight,
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
    toast(`Node Intercepted: Room ${room.substring(0, 8)}`, {
      icon: "🎧",
      style: {
        background: "#000",
        color: "#fff",
        fontSize: "10px",
        textTransform: "uppercase",
        fontWeight: "bold",
      },
    });
  };

  return (
    <main className="max-w-6xl px-4 py-24 mx-auto space-y-12 md:px-8 md:py-32 md:y-20">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Operations Control
            </span>
          </div>
          <h1 className="text-5xl italic font-black leading-none tracking-tighter uppercase md:text-7xl dark:text-white">
            TERMINAL
          </h1>
        </div>

        {/* Scrollable Tabs for Mobile */}
        <div className="w-full px-4 pb-2 -mx-4 overflow-x-auto lg:w-auto scrollbar-hide lg:p-0 lg:overflow-visible">
          <div className="flex gap-2 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl min-w-max">
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
      </div>

      <div className="space-y-8 md:space-y-12">
        {activeTab === "monitor" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
            <MonitorCard label="Reports Index" value={articles.length} />
            <MonitorCard label="Verified Nodes" value={users.length} />
            <MonitorCard
              label="Link Status"
              value="ONLINE"
              color="text-emerald-500"
            />
          </div>
        )}

        {activeTab === "intercept" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 md:gap-12">
            <div className="space-y-4 lg:col-span-5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Secure Peer Links
              </h3>
              {intercepts.length === 0 ? (
                <div className="p-8 md:p-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] md:rounded-[2.5rem] text-center opacity-30">
                  <Radio className="mx-auto mb-4" />
                  <p className="text-[9px] font-black uppercase tracking-widest">
                    Scanning for active linked nodes...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {intercepts.map((i, idx) => (
                    <button
                      key={idx}
                      onClick={() => joinIntercept(i.room)}
                      className={`w-full p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all flex justify-between items-center text-left ${
                        activeInterception === i.room
                          ? "bg-blue-600 border-blue-600 text-white shadow-xl"
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">
                          Signal Index #{idx + 1}
                        </p>
                        <p className="text-[11px] md:text-xs font-black uppercase italic truncate">
                          {i.node1} ↔ {i.node2}
                        </p>
                      </div>
                      <div className="p-2 bg-white/10 rounded-xl">
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 bg-slate-950 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 min-h-[400px] md:min-h-[500px] flex flex-col border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    INTERCEPT FEED
                  </span>
                </div>
                <span className="text-[7px] md:text-[8px] font-mono text-slate-500 uppercase tracking-widest truncate max-w-[100px] md:max-w-none">
                  CHANNEL: {activeInterception?.substring(0, 12) || "NULL"}
                </span>
              </div>

              <div className="flex-grow space-y-4 overflow-y-auto max-h-[350px] md:max-h-[400px] custom-scrollbar px-1">
                {interceptedMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 duration-300 border bg-white/5 rounded-xl md:rounded-2xl border-white/5 animate-in slide-in-from-bottom-2"
                  >
                    <div className="flex justify-between gap-4 mb-1">
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest truncate">
                        {m.senderName}
                      </span>
                      <span className="text-[7px] font-mono text-slate-600 flex-shrink-0">
                        [{new Date(m.timestamp).toLocaleTimeString()}]
                      </span>
                    </div>
                    <p className="text-[11px] md:text-xs text-slate-300 font-medium leading-relaxed">
                      {m.text}
                    </p>
                  </div>
                ))}
                {!activeInterception && (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-20">
                    <Eye size={32} className="mb-4 text-white" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white max-w-[150px]">
                      SELECT ACTIVE SIGNAL FOR LIVE INTERCEPT
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab !== "monitor" && activeTab !== "intercept" && (
          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 space-y-10 min-h-[500px] shadow-sm">
            <div className="flex items-center gap-4 px-6 md:px-8 py-3.5 md:py-4 bg-slate-50 dark:bg-slate-900 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800">
              <Search size={18} className="text-slate-400" />
              <input
                className="bg-transparent border-none text-[11px] md:text-xs font-black uppercase tracking-widest outline-none flex-grow dark:text-white"
                placeholder="SEARCH SYSTEM DATABASE..."
              />
            </div>
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center opacity-20">
              <Activity size={32} className="dark:text-white" />
              <p className="text-[9px] font-black uppercase tracking-widest dark:text-white">
                Query in progress...
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const MonitorCard = ({ label, value, color }: any) => (
  <div className="p-8 md:p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] md:rounded-[2.5rem] space-y-3 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <p
      className={`text-3xl md:text-4xl font-black dark:text-white uppercase italic tracking-tighter ${
        color || ""
      }`}
    >
      {value}
    </p>
  </div>
);

const TabButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-5 md:px-8 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-white dark:bg-slate-800 text-blue-600 shadow-xl scale-105 z-10"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
  </button>
);

export default AdminPage;
