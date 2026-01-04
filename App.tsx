import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import ChatOverlay from "./components/ChatOverlay.tsx";
import ArticleDetail from "./components/ArticleDetail.tsx";
import HomePage from "./app/page.tsx";
import ProfilePage from "./app/profile/page.tsx";
import NetworkPage from "./app/network/page.tsx";
import SupportPage from "./app/support/page.tsx";
import PostPage from "./app/post/page.tsx";
import LoginPage from "./app/auth/login.tsx";
import RegisterPage from "./app/auth/register.tsx";
import SetupProfilePage from "./app/setup-profile/page.tsx";
import AdminPage from "./app/admin/page.tsx";
import { Profile, ChatRequest, Article } from "./types.ts";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./lib/supabase.ts";
import { useStore } from "./lib/store.ts";
import { Lock, ShieldAlert, Key } from "lucide-react";

const App: React.FC = () => {
  const profile = useStore((s) => s.profile);
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const users = useStore((s) => s.users);
  const chatRequests = useStore((s) => s.chatRequests);
  const articles = useStore((s) => s.articles);
  const isInitialized = useStore((s) => s.isInitialized);

  const hydrate = useStore((s) => s.hydrate);
  const logout = useStore((s) => s.logout);
  const syncAll = useStore((s) => s.syncAll);
  const initAuthListener = useStore((s) => s.initAuthListener);

  const [currentPage, setCurrentPage] = useState("home");
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activeChat, setActiveChat] = useState<{
    profile: Profile;
    handshakeId: string;
  } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Parse Hash for Routing
  const handleRouting = () => {
    const hash = window.location.hash.replace("#/", "");
    if (!hash || hash === "") {
      setCurrentPage("home");
      return;
    }

    const segments = hash.split("/");
    const page = segments[0];
    const id = segments[1];

    setCurrentPage(page);

    // Handle Profile Deep Linking
    if (page === "profile" && id) {
      const targetUser = users.find((u) => u.id === id || u.username === id);
      if (targetUser) {
        setViewingProfile(targetUser);
      }
    } else if (page === "profile" && !id) {
      setViewingProfile(null); // Own profile
    }
  };

  useEffect(() => {
    hydrate();
    const unsub = initAuthListener();

    // Initial Route
    handleRouting();

    // Listen for hash changes
    window.addEventListener("hashchange", handleRouting);

    return () => {
      if (unsub) unsub();
      window.removeEventListener("hashchange", handleRouting);
    };
  }, [users.length]); // Dependency on users to ensure profile lookup works on deep link

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const navigate = (page: string, id?: string) => {
    const target = id ? `#/${page}/${id}` : `#/${page}`;
    window.location.hash = target;
  };

  const handleUpdateProfile = async (data: Partial<Profile>) => {
    if (!profile) return;
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", profile.id);
    if (!error) {
      toast.success("Identity Updated");
      hydrate();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("home");
    setViewingProfile(null);
    toast.success("Disconnected");
  };

  const personalArticles = useMemo(() => {
    if (!profile) return [];
    return articles.filter((a) => a.author_id === profile.id);
  }, [articles, profile]);

  const handleInteraction = async (type: "like" | "dislike", id: string) => {
    if (!isLoggedIn) return setShowAuth("login");
    const field = type === "like" ? "likes_count" : "dislikes_count";
    const { data } = await supabase
      .from("articles")
      .select(field)
      .eq("id", id)
      .maybeSingle();
    await supabase
      .from("articles")
      .update({ [field]: (data?.[field] || 0) + 1 })
      .eq("id", id);
    syncAll();
    toast.success("Signal Interacted", { id: "interact" });
  };

  const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full animate-pulse" />
        <div className="relative p-10 bg-slate-900/50 rounded-[3rem] border border-red-500/30 shadow-2xl">
          <ShieldAlert
            size={80}
            className="mx-auto text-red-500"
            strokeWidth={1.5}
          />
        </div>
      </div>
      <div className="max-w-md space-y-4">
        <h2 className="text-4xl italic font-black tracking-tighter uppercase text-slate-950 dark:text-white">
          Access_Denied
        </h2>
        <p className="text-sm font-bold leading-relaxed tracking-widest uppercase text-slate-500 dark:text-slate-400">
          The requested shard requires verified identity credentials. Initialize
          your node session to continue.
        </p>
      </div>
      <button
        onClick={() => setShowAuth("login")}
        className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4"
      >
        <Key size={18} /> Initialize Session
      </button>
    </div>
  );

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="w-12 h-12 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-[#e5e7eb] font-sans selection:bg-[#00BFFF]/30">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            borderRadius: "1.5rem",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "10px",
            textTransform: "uppercase",
            fontWeight: "900",
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
            onNavigate={navigate}
            onLogin={() => setShowAuth("login")}
            onLogout={handleLogout}
            currentPage={currentPage}
            isLoggedIn={isLoggedIn}
            userRole={profile?.role || "user"}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            chatRequests={chatRequests}
            onAcceptRequest={(req) => toast.success("Handshake Accepted")}
            profileAvatar={profile?.avatar_url}
          />

          <main className="pt-20">
            {currentPage === "home" && (
              <HomePage
                articles={articles}
                isLoggedIn={isLoggedIn}
                onLogin={() => setShowAuth("login")}
                onReadArticle={setActiveArticle}
                onRefresh={syncAll}
              />
            )}

            {currentPage === "network" &&
              (isLoggedIn ? (
                <NetworkPage
                  onBack={() => window.history.back()}
                  users={users}
                  currentUserId={profile?.id}
                  onViewProfile={(u) => navigate("profile", u.id)}
                  onChat={(u) => toast.success("Handshake established")}
                />
              ) : (
                <AccessDenied />
              ))}

            {currentPage === "post" &&
              (isLoggedIn ? (
                <PostPage
                  profile={profile}
                  personalArticles={personalArticles}
                  onBack={() => window.history.back()}
                  onPublish={async (data) => {
                    const { error } = await supabase
                      .from("articles")
                      .insert([
                        {
                          ...data,
                          author_id: profile?.id,
                          author_serial: profile?.serial_id,
                          author_name: profile?.full_name,
                        },
                      ]);
                    if (!error) {
                      toast.success("Transmission Dispatched");
                      syncAll();
                      navigate("home");
                    }
                  }}
                />
              ) : (
                <AccessDenied />
              ))}

            {currentPage === "profile" &&
              (isLoggedIn ? (
                profile ? (
                  <ProfilePage
                    profile={viewingProfile || profile}
                    onLogout={handleLogout}
                    isExternal={!!viewingProfile}
                    onCloseExternal={() => window.history.back()}
                    currentUserId={profile.id}
                    onUpdateProfile={handleUpdateProfile}
                    onChat={(u) => toast.success("Handshake established")}
                  />
                ) : (
                  <SetupProfilePage
                    onComplete={async () => {
                      hydrate();
                      navigate("home");
                    }}
                  />
                )
              ) : (
                <AccessDenied />
              ))}

            {currentPage === "support" && (
              <SupportPage onBack={() => window.history.back()} />
            )}

            {currentPage === "admin" &&
              (isLoggedIn && profile?.role === "admin" ? (
                <AdminPage
                  articles={articles}
                  users={users}
                  currentUserId={profile.id}
                  onUpdateUsers={syncAll}
                  onUpdateArticles={syncAll}
                  onLogout={handleLogout}
                />
              ) : (
                <AccessDenied />
              ))}
          </main>

          {activeArticle && (
            <ArticleDetail
              article={activeArticle}
              onClose={() => setActiveArticle(null)}
              isLoggedIn={isLoggedIn}
              currentUserId={profile?.id}
              currentUserProfile={profile}
              onUpdateArticles={syncAll}
              onInteraction={handleInteraction}
            />
          )}

          {activeChat && (
            <ChatOverlay
              recipient={activeChat.profile}
              currentUserId={profile?.id || ""}
              handshakeId={activeChat.handshakeId}
              onClose={() => setActiveChat(null)}
            />
          )}
          <Footer onNavigate={navigate} />
        </>
      )}
    </div>
  );
};

export default App;
