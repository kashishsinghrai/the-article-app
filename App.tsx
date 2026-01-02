import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { Profile, Article, ChatRequest, LiveMessage } from "./types";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./lib/supabase";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [editingArticleData, setEditingArticleData] = useState<Article | null>(
    null
  );
  const [nodeCount, setNodeCount] = useState(2540);

  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [activeChat, setActiveChat] = useState<Profile | null>(null);
  const [chatMessages, setChatMessages] = useState<LiveMessage[]>([]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);

  const initializationInProgress = useRef(false);

  const fetchArticles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setArticles(data || []);
    } catch (e) {
      console.error("Articles fetch failed");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (e) {
      console.error("Registry sync failed.");
    }
  }, []);

  const initApp = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        if (prof) {
          setProfile(prof);
          setIsSettingUp(false);
        } else {
          setIsSettingUp(true);
        }
      } else {
        setIsLoggedIn(false);
        setProfile(null);
      }
    } catch (e) {
      console.error("Session sync failed.");
    }
    await fetchArticles();
    await fetchUsers();
  }, [fetchArticles, fetchUsers]);

  useEffect(() => {
    if (initializationInProgress.current) return;
    initializationInProgress.current = true;
    initApp();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session) {
        setIsLoggedIn(true);
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        if (prof) {
          setProfile(prof);
          setIsSettingUp(false);
        } else {
          setIsSettingUp(true);
        }
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setProfile(null);
        setCurrentPage("home");
        setIsSettingUp(false);
      }
    });

    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    return () => subscription.unsubscribe();
  }, [initApp, isDarkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Identity disconnected.");
  };

  const handleNavigate = (page: string) => {
    setViewingProfile(null);
    setEditingArticleData(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("PURGE DISPATCH? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
      toast.success("Dispatch Purged.");
      fetchArticles();
    } catch (e: any) {
      toast.error("Moderation error.");
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticleData(article);
    setCurrentPage("post");
  };

  const handleProfileSetupComplete = async (profileData: Profile) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No session");
      const safeData = {
        id: session.user.id,
        username: profileData.username,
        full_name: profileData.full_name,
        bio: profileData.bio,
        gender: profileData.gender,
        serial_id: profileData.serial_id,
        budget: profileData.budget,
        role: profileData.role || "user",
        is_private: profileData.is_private || false,
        email: session.user.email,
      };
      const { error } = await supabase
        .from("profiles")
        .upsert(safeData, { onConflict: "id" });
      if (error) throw error;
      setProfile(profileData);
      setIsSettingUp(false);
      handleNavigate("home");
      toast.success("Identity Forge Complete.");
      fetchUsers();
    } catch (err: any) {
      toast.error("Setup Error: " + err.message);
    }
  };

  if (isSettingUp) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "dark bg-slate-950" : "bg-slate-50"
        }`}
      >
        <Toaster position="bottom-center" />
        <SetupProfilePage onComplete={handleProfileSetupComplete} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-slate-950" : "bg-slate-50"
      } transition-colors duration-500`}
    >
      <Toaster position="bottom-center" />
      {showAuth === "login" && (
        <LoginPage
          onBack={() => setShowAuth(null)}
          onSuccess={() => {
            setShowAuth(null);
            initApp();
          }}
          onGoToRegister={() => setShowAuth("register")}
        />
      )}
      {showAuth === "register" && (
        <RegisterPage
          onBack={() => setShowAuth(null)}
          onSuccess={() => {
            setShowAuth(null);
            initApp();
          }}
          onGoToLogin={() => setShowAuth("login")}
        />
      )}

      {!showAuth && (
        <div className="relative flex flex-col min-h-screen">
          <Navbar
            onNavigate={handleNavigate}
            onLogin={() => setShowAuth("login")}
            onLogout={handleLogout}
            currentPage={currentPage}
            isLoggedIn={isLoggedIn}
            userRole={profile?.role || "user"}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            chatRequests={chatRequests}
            onAcceptRequest={async (req) => {}}
          />

          <div className="flex-grow pt-24">
            {currentPage === "home" && (
              <HomePage
                articles={articles}
                isLoggedIn={isLoggedIn}
                onLogin={() => setShowAuth("login")}
                userRole={profile?.role || "user"}
                onDelete={handleDeleteArticle}
                onEdit={handleEditArticle}
                onViewProfile={() => {}}
                onReadArticle={setActiveArticle}
              />
            )}
            {currentPage === "post" && (
              <PostPage
                editData={editingArticleData}
                onBack={() => handleNavigate("home")}
                onPublish={async (data) => {
                  if (!profile) return;
                  let error;
                  if (editingArticleData) {
                    const { error: err } = await supabase
                      .from("articles")
                      .update(data)
                      .eq("id", editingArticleData.id);
                    error = err;
                  } else {
                    const { error: err } = await supabase
                      .from("articles")
                      .insert({
                        ...data,
                        author_id: profile.id,
                        author_name: profile.full_name,
                        author_serial: profile.serial_id,
                      });
                    error = err;
                  }
                  if (!error) {
                    toast.success("Dispatch Synced");
                    fetchArticles();
                    handleNavigate("home");
                  }
                }}
              />
            )}
            {currentPage === "admin" && profile?.role === "admin" && (
              <AdminPage
                articles={articles}
                users={users}
                currentUserId={profile.id}
                onUpdateUsers={fetchUsers}
                onUpdateArticles={fetchArticles}
                onLogout={handleLogout}
              />
            )}
            {(currentPage === "profile" || currentPage === "settings") &&
              profile && (
                <ProfilePage
                  profile={viewingProfile || profile}
                  onLogout={handleLogout}
                  isExternal={!!viewingProfile}
                  initialTab={currentPage === "settings" ? "settings" : "intel"}
                  onCloseExternal={() => {
                    if (viewingProfile) setViewingProfile(null);
                    handleNavigate("home");
                  }}
                  isLoggedIn={isLoggedIn}
                  currentUserId={profile.id}
                  onUpdateProfile={async (data) => {
                    const { error } = await supabase
                      .from("profiles")
                      .update(data)
                      .eq("id", profile.id);
                    if (!error) {
                      setProfile({ ...profile, ...data });
                      toast.success("Synced.");
                    }
                  }}
                />
              )}
            {currentPage === "network" && (
              <NetworkPage
                onBack={() => handleNavigate("home")}
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
              />
            )}
            {currentPage === "support" && (
              <SupportPage onBack={() => handleNavigate("home")} />
            )}
          </div>

          <TrendingTicker />
          <Footer nodeCount={nodeCount} onNavigate={handleNavigate} />
          {activeArticle && (
            <ArticleDetail
              article={activeArticle}
              onClose={() => setActiveArticle(null)}
            />
          )}
          {activeChat && (
            <ChatOverlay
              recipient={activeChat}
              currentUserId={profile?.id || ""}
              onClose={() => setActiveChat(null)}
              messages={chatMessages}
              onSendMessage={() => {}}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
