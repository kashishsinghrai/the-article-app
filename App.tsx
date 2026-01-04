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
import { Profile, ChatRequest, Article } from "./types.ts";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./lib/supabase.ts";
import { useStore } from "./lib/store.ts";

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

  const personalArticles = useMemo(() => {
    if (!profile) return [];
    return articles.filter((a) => a.author_id === profile.id);
  }, [articles, profile]);

  useEffect(() => {
    hydrate();
    const unsub = initAuthListener();
    return () => {
      if (unsub) unsub();
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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
    setCurrentPage("home");
    setViewingProfile(null);
    toast.success("Disconnected");
  };

  const handleAcceptRequest = (req: ChatRequest) => {
    toast.success("Handshake established");
  };

  const handleInteraction = async (type: "like" | "dislike", id: string) => {
    if (!isLoggedIn) return setShowAuth("login");
    const field = type === "like" ? "likes_count" : "dislikes_count";
    const { data } = await supabase
      .from("articles")
      .select(field)
      .eq("id", id)
      .single();
    await supabase
      .from("articles")
      .update({ [field]: (data?.[field] || 0) + 1 })
      .eq("id", id);
    syncAll();
    toast.success("Protocol Interaction Hashed");
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
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
            onNavigate={setCurrentPage}
            onLogin={() => setShowAuth("login")}
            onLogout={handleLogout}
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
            {currentPage === "network" && (
              <NetworkPage
                onBack={() => setCurrentPage("home")}
                users={users}
                currentUserId={profile?.id}
                onViewProfile={(u) => {
                  setViewingProfile(u);
                  setCurrentPage("profile");
                }}
                onChat={(u) => toast.success("Connecting...")}
              />
            )}
            {currentPage === "post" && (
              <PostPage
                profile={profile}
                personalArticles={personalArticles}
                onBack={() => setCurrentPage("home")}
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
                    toast.success("Dispatch Transmitted");
                    syncAll();
                    setCurrentPage("home");
                  } else {
                    toast.error("Transmission Failure");
                  }
                }}
              />
            )}
            {currentPage === "profile" &&
              (profile ? (
                <ProfilePage
                  profile={viewingProfile || profile}
                  onLogout={handleLogout}
                  isExternal={!!viewingProfile}
                  onCloseExternal={() => {
                    setViewingProfile(null);
                    setCurrentPage("home");
                  }}
                  currentUserId={profile.id}
                  onUpdateProfile={handleUpdateProfile}
                  onChat={(u) => toast.success("Handshake Pending...")}
                />
              ) : (
                <SetupProfilePage
                  onComplete={async () => {
                    hydrate();
                    setCurrentPage("home");
                  }}
                />
              ))}
            {currentPage === "support" && (
              <SupportPage onBack={() => setCurrentPage("home")} />
            )}
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
          <Footer onNavigate={setCurrentPage} />
        </>
      )}
    </div>
  );
};

export default App;
