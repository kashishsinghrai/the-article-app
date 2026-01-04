import React, { useState, useEffect } from "react";
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
import { ShieldAlert } from "lucide-react";

const App: React.FC = () => {
  const {
    profile,
    isLoggedIn,
    users,
    chatRequests,
    activeHandshake,
    isInitialized,
    hydrate,
    initAuthListener,
    logout,
    syncAll,
    setActiveHandshake,
  } = useStore();

  const [currentPage, setCurrentPage] = useState("home");
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    hydrate();
    const unsub = initAuthListener();
    return () => unsub?.();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleNavigate = (page: string, id?: string) => {
    if (id) {
      const targetUser = users.find((u) => u.id === id || u.username === id);
      if (targetUser) setViewingProfile(targetUser);
    } else {
      setViewingProfile(null);
    }
    setActiveArticle(null); // Reset article when navigating away
    setCurrentPage(page);
  };

  const handleReadArticle = (article: Article) => {
    setActiveArticle(article);
    setCurrentPage("article-view");
  };

  const handleAcceptRequest = async (req: ChatRequest) => {
    const t = toast.loading("Syncing Peer Shards...");
    const { error } = await supabase
      .from("chat_requests")
      .update({ status: "accepted" })
      .eq("id", req.id);
    if (error) toast.error("Sync Failed", { id: t });
    else toast.success("Connected", { id: t, icon: "🤝" });
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">
            Initializing Core Protocol...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-[#e5e7eb] font-sans selection:bg-[#00BFFF]/20">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            fontSize: "10px",
            textTransform: "uppercase",
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
            onNavigate={handleNavigate}
            onLogin={() => setShowAuth("login")}
            onLogout={async () => {
              await logout();
              handleNavigate("home");
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
                articles={useStore.getState().articles}
                isLoggedIn={isLoggedIn}
                onLogin={() => setShowAuth("login")}
                onReadArticle={handleReadArticle}
                onRefresh={syncAll}
              />
            )}

            {currentPage === "article-view" && activeArticle && (
              <ArticleDetail
                article={activeArticle}
                onClose={() => handleNavigate("home")}
                isLoggedIn={isLoggedIn}
                currentUserId={profile?.id}
                currentUserProfile={profile}
                onUpdateArticles={syncAll}
              />
            )}

            {currentPage === "network" &&
              (isLoggedIn ? (
                <NetworkPage
                  onBack={() => handleNavigate("home")}
                  users={users}
                  currentUserId={profile?.id}
                  onViewProfile={(u) => handleNavigate("profile", u.id)}
                  onChat={async (u) => {
                    if (u.id === profile?.id) return;
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
                      toast.success("Signal Dispatched", { icon: "📡" });
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                  <ShieldAlert size={80} className="mb-6 text-red-500" />
                  <h2 className="text-2xl font-black tracking-tighter uppercase">
                    Access Denied
                  </h2>
                  <button
                    onClick={() => setShowAuth("login")}
                    className="mt-6 px-10 py-4 bg-white text-black rounded-full font-black uppercase text-[10px]"
                  >
                    Login
                  </button>
                </div>
              ))}

            {currentPage === "post" &&
              (isLoggedIn ? (
                <PostPage
                  profile={profile}
                  personalArticles={[]}
                  onBack={() => handleNavigate("home")}
                  onPublish={async (d) => {
                    await supabase
                      .from("articles")
                      .insert([
                        {
                          ...d,
                          author_id: profile?.id,
                          author_serial: profile?.serial_id,
                          author_name: profile?.full_name,
                        },
                      ]);
                    syncAll();
                    handleNavigate("home");
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[70vh] font-black uppercase">
                  Unauthorized
                </div>
              ))}

            {currentPage === "profile" &&
              (profile ? (
                <ProfilePage
                  profile={viewingProfile || profile}
                  onLogout={logout}
                  isExternal={!!viewingProfile}
                  onCloseExternal={() => handleNavigate("home")}
                  currentUserId={profile.id}
                  onChat={(u) => {
                    supabase
                      .from("chat_requests")
                      .insert([
                        {
                          from_id: profile?.id,
                          to_id: u.id,
                          status: "pending",
                        },
                      ]);
                    toast.success("Handshake Sent");
                  }}
                />
              ) : (
                <SetupProfilePage
                  onComplete={async () => {
                    await hydrate();
                    handleNavigate("home");
                  }}
                />
              ))}

            {currentPage === "support" && (
              <SupportPage onBack={() => handleNavigate("home")} />
            )}
            {currentPage === "admin" &&
              (profile?.role === "admin" ? (
                <AdminPage
                  articles={useStore.getState().articles}
                  users={users}
                  currentUserId={profile?.id || ""}
                  onLogout={logout}
                />
              ) : (
                <div className="flex items-center justify-center min-h-screen italic font-black uppercase">
                  Forbidden Shard
                </div>
              ))}
          </main>

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
          <Footer onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
};

export default App;
