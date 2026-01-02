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
import { Loader2 } from "lucide-react";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
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
      setNodeCount(data?.length ? 2500 + data.length : 2540);
    } catch (e) {
      console.error("Registry sync failed.");
    }
  }, []);

  const syncAdminProfile = useCallback(
    async (user: any) => {
      const adminProfile: Profile = {
        id: user.id,
        username: "root_" + user.id.substring(0, 5),
        full_name: "Root Administrator",
        gender: "System",
        serial_id: `#ART-ROOT-${user.id.substring(0, 4)}`,
        budget: 9999,
        role: "admin",
        is_private: true,
        bio: "Global Operations Controller. Access Level: Level 5.",
        email: user.email,
        is_online: true,
      };
      // Upsert to ensure record exists in DB for other components to see
      const { error } = await supabase
        .from("profiles")
        .upsert(adminProfile, { onConflict: "id" });
      setProfile(adminProfile);
      await fetchUsers();
      return adminProfile;
    },
    [fetchUsers]
  );

  const checkUserStatus = useCallback(
    async (user: any) => {
      if (!user) {
        setIsLoggedIn(false);
        setProfile(null);
        setIsSettingUp(false);
        return;
      }

      setIsLoggedIn(true);
      // RESTORED ADMIN SHORTCUT: Any email ending in @the-articles.admin is root admin
      const isAdmin =
        user.email?.endsWith("@the-articles.admin") ||
        user.user_metadata?.role === "admin";

      if (isAdmin) {
        // ADMIN BYPASS: Never show setup
        setIsSettingUp(false);
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (prof) {
          setProfile({ ...prof, role: "admin" });
        } else {
          await syncAdminProfile(user);
        }
        toast.success("Terminal Access Authorized.");
      } else {
        // REGULAR USER LOGIC
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (prof) {
          setProfile(prof);
          setIsSettingUp(false);
        } else {
          // If login is successful but profile is missing, it's a new user
          setIsSettingUp(true);
        }
      }
    },
    [syncAdminProfile]
  );

  const initApp = useCallback(async () => {
    setIsInitializing(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await checkUserStatus(session?.user);
      await fetchArticles();
      await fetchUsers();
    } catch (e) {
      console.error("Auth init failure.");
    } finally {
      setIsInitializing(false);
    }
  }, [fetchArticles, fetchUsers, checkUserStatus]);

  useEffect(() => {
    if (initializationInProgress.current) return;
    initializationInProgress.current = true;
    initApp();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        if (session?.user) {
          await checkUserStatus(session.user);
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
  }, [initApp, isDarkMode, checkUserStatus]);

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

      const { error } = await supabase.from("profiles").upsert({
        ...profileData,
        id: session.user.id,
        email: session.user.email,
      });
      if (error) throw error;

      await supabase.auth.updateUser({
        data: { setup_complete: true },
      });

      setProfile(profileData);
      setIsSettingUp(false);
      handleNavigate("home");
      toast.success("Identity Forge Complete.");
      fetchUsers();
    } catch (err: any) {
      toast.error("Setup Error: " + err.message);
    }
  };

  const handleLoginSuccess = async (user: any) => {
    setShowAuth(null);
    await checkUserStatus(user);
    await fetchArticles();
    await fetchUsers();
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <Loader2 className="text-blue-600 animate-spin" size={40} />
      </div>
    );
  }

  // Setup page ONLY shows if user is logged in, needs setup, and is NOT admin
  if (isSettingUp && isLoggedIn && profile?.role !== "admin" && !showAuth) {
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
          onSuccess={handleLoginSuccess}
          onGoToRegister={() => setShowAuth("register")}
        />
      )}
      {showAuth === "register" && (
        <RegisterPage
          onBack={() => setShowAuth(null)}
          onSuccess={handleLoginSuccess}
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
