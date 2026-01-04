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
  const activeHandshake = useStore((s) => s.activeHandshake);
  const setActiveHandshake = useStore((s) => s.setActiveHandshake);
  const setChatRequests = useStore((s) => s.setChatRequests);
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
  const [isDarkMode, setIsDarkMode] = useState(true);

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
    if (page === "profile" && id) {
      const targetUser = users.find((u) => u.id === id || u.username === id);
      if (targetUser) setViewingProfile(targetUser);
    } else if (page === "profile" && !id) {
      setViewingProfile(null);
    }
  };

  useEffect(() => {
    hydrate();
    const unsub = initAuthListener();
    handleRouting();
    window.addEventListener("hashchange", handleRouting);
    return () => {
      if (unsub) unsub();
      window.removeEventListener("hashchange", handleRouting);
    };
  }, [users.length]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const navigate = (page: string, id?: string) => {
    const target = id ? `#/${page}/${id}` : `#/${page}`;
    window.location.hash = target;
  };

  const handleAcceptRequest = async (req: ChatRequest) => {
    const { error } = await supabase
      .from("chat_requests")
      .update({ status: "accepted" })
      .eq("id", req.id);

    if (!error) {
      toast.success("Handshake Established", { icon: "🤝" });
      // Remove from notifications
      setChatRequests(chatRequests.filter((r) => r.id !== req.id));
    } else {
      toast.error("Handshake Protocol Failure");
    }
  };

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
  };

  const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center space-y-8">
      <div className="relative p-10 bg-slate-900/50 rounded-[3rem] border border-red-500/30">
        <ShieldAlert size={80} className="mx-auto text-red-500" />
      </div>
      <h2 className="text-4xl italic font-black text-white uppercase">
        Access_Denied
      </h2>
      <button
        onClick={() => setShowAuth("login")}
        className="px-12 py-5 text-xs font-black tracking-widest text-black uppercase bg-white rounded-full"
      >
        Initialize Session
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-[#e5e7eb] font-sans">
      <Toaster position="top-right" />

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
            onLogout={async () => {
              await logout();
              navigate("home");
            }}
            currentPage={currentPage}
            isLoggedIn={isLoggedIn}
            userRole={profile?.role || "user"}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            chatRequests={chatRequests}
            onAcceptRequest={handleAcceptRequest}
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
                  onChat={async (u) => {
                    const { error } = await supabase
                      .from("chat_requests")
                      .insert([
                        {
                          from_id: profile?.id,
                          to_id: u.id,
                          status: "pending",
                        },
                      ]);
                    if (!error)
                      toast.success(
                        "Handshake Dispatched. Waiting for node response...",
                        { icon: "📡" }
                      );
                  }}
                />
              ) : (
                <AccessDenied />
              ))}

            {currentPage === "post" &&
              (isLoggedIn ? (
                <PostPage
                  profile={profile}
                  personalArticles={articles.filter(
                    (a) => a.author_id === profile?.id
                  )}
                  onBack={() => window.history.back()}
                  onPublish={async (data) => {
                    await supabase
                      .from("articles")
                      .insert([
                        {
                          ...data,
                          author_id: profile?.id,
                          author_serial: profile?.serial_id,
                          author_name: profile?.full_name,
                        },
                      ]);
                    syncAll();
                    navigate("home");
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
                    onLogout={async () => {
                      await logout();
                      navigate("home");
                    }}
                    isExternal={!!viewingProfile}
                    onCloseExternal={() => window.history.back()}
                    currentUserId={profile.id}
                    onUpdateProfile={async (d) => {
                      await supabase
                        .from("profiles")
                        .update(d)
                        .eq("id", profile.id);
                      hydrate();
                    }}
                    onChat={async (u) => {
                      await supabase
                        .from("chat_requests")
                        .insert([
                          {
                            from_id: profile?.id,
                            to_id: u.id,
                            status: "pending",
                          },
                        ]);
                      toast.success("Handshake Dispatched");
                    }}
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
                  onLogout={async () => {
                    await logout();
                    navigate("home");
                  }}
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

          {activeHandshake && (
            <ChatOverlay
              recipient={
                activeHandshake.from_id === profile?.id
                  ? activeHandshake.to_node!
                  : activeHandshake.from_node!
              }
              currentUserId={profile?.id || ""}
              handshakeId={activeHandshake.id}
              onClose={() => setActiveHandshake(null)}
            />
          )}
          <Footer onNavigate={navigate} />
        </>
      )}
    </div>
  );
};

export default App;
