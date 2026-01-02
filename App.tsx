import React, { useState, useEffect } from "react";
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

const App: React.FC = () => {
  // Selective store hooks to prevent unnecessary re-renders
  const profile = useStore((s) => s.profile);
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const articles = useStore((s) => s.articles);
  const users = useStore((s) => s.users);
  const chatRequests = useStore((s) => s.chatRequests);
  const isInitialized = useStore((s) => s.isInitialized);

  const hydrate = useStore((s) => s.hydrate);
  const logout = useStore((s) => s.logout);
  const syncAll = useStore((s) => s.syncAll);
  const setChatRequests = useStore((s) => s.setChatRequests);

  const [currentPage, setCurrentPage] = useState("home");
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [editingArticleData, setEditingArticleData] = useState<Article | null>(
    null
  );
  const [activeChat, setActiveChat] = useState<Profile | null>(null);

  useEffect(() => {
    hydrate();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        hydrate();
      } else if (event === "SIGNED_OUT") {
        logout();
        setCurrentPage("home");
      }
    });

    return () => subscription.unsubscribe();
  }, [hydrate, logout]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const handleAcceptRequest = async (req: ChatRequest) => {
    const { error } = await supabase
      .from("chat_requests")
      .update({ status: "accepted" })
      .eq("id", req.id);
    if (!error) {
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

  const handleLogoutProtocol = async () => {
    try {
      await logout();
      setCurrentPage("home");
      toast.success("Identity Node Disconnected.");
    } catch (e) {
      toast.error("Protocol Breach during disconnection.");
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 w-16 h-16 border-2 rounded-full border-slate-100 dark:border-slate-800 animate-ping" />
            <div className="relative z-10 w-16 h-16 border-t-4 border-blue-600 rounded-full animate-spin" />
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
            Synchronizing Global Node Registry...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-slate-950" : "bg-white"
      }`}
    >
      <Toaster position="bottom-center" />

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

                  const { error } = await method;
                  if (error) {
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
                      const { error } = await supabase
                        .from("profiles")
                        .update(d)
                        .eq("id", profile.id);
                      if (error) toast.error("Identity update failure.");
                      else {
                        toast.success("Identity Updated.");
                        hydrate();
                      }
                    }}
                  />
                ) : (
                  <SetupProfilePage
                    onComplete={async (d) => {
                      const { error } = await supabase
                        .from("profiles")
                        .upsert(d);
                      if (error) {
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
                <div className="py-40 text-center">
                  <button
                    onClick={() => setShowAuth("login")}
                    className="px-10 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-xl"
                  >
                    IDENTITY REQUIRED
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
