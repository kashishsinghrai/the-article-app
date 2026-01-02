import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TrendingTicker from "./components/TrendingTicker";
import ChatOverlay from "./components/ChatOverlay";
import ArticleDetail from "./components/ArticleDetail";
import HomePage from "./app/page";
import PostPage from "./app/post/page";
import ProfilePage from "./app/profile/page";
import AdminPage from "./app/admin/page";
import SupportPage from "./app/support/page";
import NetworkPage from "./app/network/page";
import LoginPage from "./app/auth/login";
import RegisterPage from "./app/auth/register";
import SetupProfilePage from "./app/setup-profile/page";
import { Profile, Article, ChatRequest } from "./types";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./lib/supabase";
import { useStore } from "./lib/store";
import { Lock, RefreshCw, Power } from "lucide-react";

const App: React.FC = () => {
  const profile = useStore((s) => s.profile);
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const articles = useStore((s) => s.articles);
  const users = useStore((s) => s.users);
  const chatRequests = useStore((s) => s.chatRequests);
  const isInitialized = useStore((s) => s.isInitialized);
  const error = useStore((s) => s.error);

  const hydrate = useStore((s) => s.hydrate);
  const logout = useStore((s) => s.logout);
  const syncAll = useStore((s) => s.syncAll);
  const setChatRequests = useStore((s) => s.setChatRequests);
  const initAuthListener = useStore((s) => s.initAuthListener);

  const [currentPage, setCurrentPage] = useState("home");
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [editingArticleData, setEditingArticleData] = useState<Article | null>(
    null
  );
  const [activeChat, setActiveChat] = useState<Profile | null>(null);

  // System Boot Sequence
  useEffect(() => {
    // Attempt standard hydration
    hydrate();
    const unsub = initAuthListener();

    // FAIL-SAFE: Automatic bypass after 3.5 seconds
    const bypassTimer = setTimeout(() => {
      const state = useStore.getState();
      if (!state.isInitialized) {
        useStore.setState({ isInitialized: true });
        console.warn("Boot: Auto-bypass triggered due to sync latency.");
      }
    }, 3500);

    return () => {
      if (typeof unsub === "function") unsub();
      clearTimeout(bypassTimer);
    };
  }, []); // Run ONLY once on mount

  // Dark Mode Persistence
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const handleAcceptRequest = async (req: ChatRequest) => {
    const { error: reqError } = await supabase
      .from("chat_requests")
      .update({ status: "accepted" })
      .eq("id", req.id);
    if (!reqError) {
      const sender = users.find((u) => u.id === req.from_id);
      if (sender) setActiveChat(sender);
      if (profile) {
        const { data } = await supabase
          .from("chat_requests")
          .select("*")
          .eq("to_id", profile.id)
          .eq("status", "pending");
        if (data) setChatRequests(data);
      }
      toast.success("Identity Verified.");
    }
  };

  const handleLogoutProtocol = useCallback(async () => {
    try {
      await logout();
      setCurrentPage("home");
      toast.success("Identity Node Disconnected.");
    } catch (e) {
      toast.error("Protocol Breach during disconnection.");
    }
  }, [logout]);

  const handleForceBoot = () => {
    useStore.setState({ isInitialized: true });
    toast.success("Forced Node Bootstrap.");
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center max-w-sm gap-10 text-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 rounded-full border-slate-100 dark:border-slate-800" />
            <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin" />
          </div>
          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">
              Syncing Global Core...
            </p>
            {error && (
              <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
                {error}
              </p>
            )}
          </div>
          <button
            onClick={handleForceBoot}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-950 dark:bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-white dark:text-slate-950 shadow-xl opacity-0 animate-in fade-in duration-700 delay-1000 fill-mode-forwards"
          >
            <Power size={14} /> Skip Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen selection:bg-blue-600 selection:text-white ${
        isDarkMode ? "dark bg-slate-950" : "bg-white"
      }`}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: "1.5rem",
            background: "#0f172a",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          },
        }}
      />

      {showAuth === "login" && (
        <LoginPage
          onBack={() => setShowAuth(null)}
          onSuccess={() => setShowAuth(null)}
          onGoToRegister={() => setShowAuth("register")}
        />
      )}
      {showAuth === "register" && (
        <RegisterPage
          onBack={() => setShowAuth(null)}
          onSuccess={() => setShowAuth(null)}
          onGoToLogin={() => setShowAuth("login")}
        />
      )}

      {!showAuth && (
        <>
          <Navbar
            onNavigate={setCurrentPage}
            onLogin={() => setShowAuth("login")}
            onLogout={handleLogoutProtocol}
            currentPage={currentPage}
            isLoggedIn={isLoggedIn}
            userRole={profile?.role || "user"}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            chatRequests={chatRequests}
            onAcceptRequest={handleAcceptRequest}
            profileAvatar={profile?.avatar_url}
          />

          <div className="min-h-screen pt-24">
            {currentPage === "home" && (
              <HomePage
                articles={articles}
                isLoggedIn={isLoggedIn}
                onLogin={() => setShowAuth("login")}
                userRole={profile?.role || "user"}
                onDelete={() => syncAll()}
                onEdit={(a) => {
                  setEditingArticleData(a);
                  setCurrentPage("post");
                }}
                onReadArticle={setActiveArticle}
                onRefresh={syncAll}
              />
            )}

            {currentPage === "post" && (
              <PostPage
                profile={profile}
                editData={editingArticleData}
                onBack={() => {
                  setEditingArticleData(null);
                  setCurrentPage("home");
                }}
                onPublish={async (d) => {
                  if (!profile) return;
                  const method = editingArticleData
                    ? supabase
                        .from("articles")
                        .update(d)
                        .eq("id", editingArticleData.id)
                    : supabase
                        .from("articles")
                        .insert({
                          ...d,
                          author_id: profile.id,
                          author_name: profile.full_name,
                          author_serial: profile.serial_id,
                        });

                  const { error: pubError } = await method;
                  if (pubError) {
                    toast.error("Dispatch Failed.");
                    return;
                  }
                  await syncAll();
                  setEditingArticleData(null);
                  setCurrentPage("home");
                  toast.success("Dispatch Published.");
                }}
              />
            )}

            {(currentPage === "profile" || currentPage === "settings") &&
              (isLoggedIn ? (
                profile ? (
                  <ProfilePage
                    profile={viewingProfile || profile}
                    onLogout={handleLogoutProtocol}
                    isExternal={!!viewingProfile}
                    onCloseExternal={() => {
                      setViewingProfile(null);
                      setCurrentPage("home");
                    }}
                    isLoggedIn={isLoggedIn}
                    currentUserId={profile.id}
                    currentUserProfile={profile}
                    onUpdateProfile={async (d) => {
                      const { error: updError } = await supabase
                        .from("profiles")
                        .update(d)
                        .eq("id", profile.id);
                      if (updError) toast.error("Identity update failure.");
                      else {
                        toast.success("Identity Updated.");
                        hydrate();
                      }
                    }}
                  />
                ) : (
                  <SetupProfilePage
                    onComplete={async (d) => {
                      const { error: setpError } = await supabase
                        .from("profiles")
                        .upsert(d);
                      if (setpError) {
                        toast.error("Establishment failed.");
                        return;
                      }
                      hydrate();
                      toast.success("Identity Established.");
                      setCurrentPage("home");
                    }}
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center gap-8 py-60">
                  <div className="p-8 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-300">
                    <Lock size={48} />
                  </div>
                  <button
                    onClick={() => setShowAuth("login")}
                    className="px-12 py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.4em] shadow-2xl hover:scale-105 transition-all"
                  >
                    Identity Required
                  </button>
                </div>
              ))}

            {currentPage === "network" && (
              <NetworkPage
                onBack={() => setCurrentPage("home")}
                users={users}
                currentUserId={profile?.id}
                currentUserProfile={profile}
                onViewProfile={(u) => {
                  setViewingProfile(u);
                  setCurrentPage("profile");
                }}
                onChat={(u) => {
                  setActiveChat(u);
                }}
                onRefresh={syncAll}
              />
            )}

            {currentPage === "support" && (
              <SupportPage onBack={() => setCurrentPage("home")} />
            )}
            {currentPage === "admin" && profile?.role === "admin" && (
              <AdminPage
                articles={articles}
                users={users}
                currentUserId={profile.id}
                onUpdateArticles={syncAll}
                onUpdateUsers={syncAll}
                onLogout={handleLogoutProtocol}
              />
            )}
          </div>

          {activeArticle && (
            <ArticleDetail
              article={activeArticle}
              onClose={() => setActiveArticle(null)}
              isLoggedIn={isLoggedIn}
              currentUserId={profile?.id}
              currentUserProfile={profile}
              onUpdateArticles={syncAll}
            />
          )}
          {activeChat && (
            <ChatOverlay
              recipient={activeChat}
              currentUserId={profile?.id || ""}
              onClose={() => setActiveChat(null)}
            />
          )}
          <TrendingTicker />
          <Footer onNavigate={setCurrentPage} />
        </>
      )}
    </div>
  );
};

export default App;
