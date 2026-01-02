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
import { Profile, Article, ChatRequest, LiveMessage, Comment } from "./types";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./lib/supabase";
import { Loader2 } from "lucide-react";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
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
  const isFetchingProfile = useRef(false);

  const fetchGlobalData = useCallback(async () => {
    try {
      const { data: artData, error: artErr } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      const { data: userData, error: userErr } = await supabase
        .from("profiles")
        .select("*");

      if (!artErr) setArticles(artData || []);
      if (!userErr) {
        setUsers(userData || []);
        setNodeCount(userData?.length ? 2500 + userData.length : 2540);
      }
    } catch (e) {
      console.error("Hydration Error:", e);
    }
  }, []);

  const checkUserStatus = useCallback(async (user: any) => {
    if (!user) {
      setIsLoggedIn(false);
      setProfile(null);
      return;
    }

    setIsLoggedIn(true);

    if (isFetchingProfile.current) return;
    isFetchingProfile.current = true;

    try {
      const { data: prof, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (prof) {
        const isAdmin =
          user.user_metadata?.role === "admin" ||
          user.email?.endsWith("@the-articles.admin");
        setProfile({ ...prof, role: isAdmin ? "admin" : prof.role });
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Identity check failure.");
    } finally {
      isFetchingProfile.current = false;
    }
  }, []);

  const initApp = useCallback(async () => {
    setIsInitializing(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await checkUserStatus(session.user);
      }
      await fetchGlobalData();
    } catch (e) {
      console.error("Boot failure");
    } finally {
      setIsInitializing(false);
    }
  }, [fetchGlobalData, checkUserStatus]);

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
          await fetchGlobalData();
        }
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setProfile(null);
        setViewingProfile(null);
        setCurrentPage("home");
      }
    });

    return () => subscription.unsubscribe();
  }, [initApp, checkUserStatus, fetchGlobalData]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setProfile(null);
      setViewingProfile(null);
      setActiveArticle(null);
      setEditingArticleData(null);
      setCurrentPage("home");
      toast.success("Identity Disconnected.");
      setTimeout(() => (window.location.href = "/"), 100);
    } catch (e) {
      window.location.reload();
    }
  };

  const handleNavigate = (page: string) => {
    setViewingProfile(null);
    setEditingArticleData(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInteraction = async (
    type: "like" | "dislike",
    articleId: string
  ) => {
    if (!isLoggedIn) return toast.error("Sign in to engage.");

    const art = articles.find((a) => a.id === articleId);
    if (!art) return;

    const column = type === "like" ? "likes_count" : "dislikes_count";
    const newVal = (art[column] || 0) + 1;

    const { error } = await supabase
      .from("articles")
      .update({ [column]: newVal })
      .eq("id", articleId);

    if (!error) {
      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? { ...a, [column]: newVal } : a))
      );
      if (activeArticle?.id === articleId) {
        setActiveArticle({ ...activeArticle, [column]: newVal });
      }
      toast.success(
        type === "like" ? "Dispatch Supported" : "Dispatch Contested"
      );
    }
  };

  const handleFollow = async (targetId: string) => {
    if (!profile) return toast.error("Identity verification required.");
    const isFollowing = profile.following?.includes(targetId);

    // 1. Update Current User Following Array
    let newFollowing = isFollowing
      ? profile.following?.filter((id) => id !== targetId)
      : [...(profile.following || []), targetId];

    const { error: followErr } = await supabase
      .from("profiles")
      .update({
        following: newFollowing,
        following_count: newFollowing.length,
      })
      .eq("id", profile.id);

    if (followErr) return toast.error("Sync Failure: Social Graph busy.");

    // 2. Atomic Increment/Decrement for Target Followers
    const targetUser = users.find((u) => u.id === targetId);
    if (targetUser) {
      const newFollowersCount = isFollowing
        ? (targetUser.followers_count || 1) - 1
        : (targetUser.followers_count || 0) + 1;
      await supabase
        .from("profiles")
        .update({ followers_count: Math.max(0, newFollowersCount) })
        .eq("id", targetId);
    }

    setProfile({
      ...profile,
      following: newFollowing,
      following_count: newFollowing.length,
    });
    toast.success(isFollowing ? "Link Dissolved" : "Follower Link Locked");
    await fetchGlobalData();
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <Loader2 className="text-blue-600 animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-slate-950" : "bg-white"
      } transition-colors duration-500`}
    >
      <Toaster position="bottom-center" />

      {showAuth === "login" && (
        <LoginPage
          onBack={() => setShowAuth(null)}
          onSuccess={(u) => {
            setShowAuth(null);
            checkUserStatus(u);
          }}
          onGoToRegister={() => setShowAuth("register")}
        />
      )}
      {showAuth === "register" && (
        <RegisterPage
          onBack={() => setShowAuth(null)}
          onSuccess={(u) => {
            setShowAuth(null);
            checkUserStatus(u);
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
            onAcceptRequest={async () => {}}
            profileAvatar={profile?.avatar_url}
          />

          <div className="flex-grow pt-24">
            {currentPage === "home" && (
              <HomePage
                articles={articles}
                isLoggedIn={isLoggedIn}
                onLogin={() => setShowAuth("login")}
                userRole={profile?.role || "user"}
                onDelete={async (id) => {
                  const { error } = await supabase
                    .from("articles")
                    .delete()
                    .eq("id", id);
                  if (!error) {
                    toast.success("Dispatch Purged");
                    fetchGlobalData();
                  }
                }}
                onEdit={(a) => {
                  setEditingArticleData(a);
                  handleNavigate("post");
                }}
                onReadArticle={setActiveArticle}
                onRefresh={fetchGlobalData}
                onInteraction={handleInteraction}
              />
            )}

            {currentPage === "post" && (
              <PostPage
                editData={editingArticleData}
                onBack={() => handleNavigate("home")}
                onPublish={async (data) => {
                  if (!profile) {
                    toast.error("Forge Identity first.");
                    handleNavigate("profile");
                    return;
                  }
                  const method = editingArticleData
                    ? supabase
                        .from("articles")
                        .update(data)
                        .eq("id", editingArticleData.id)
                    : supabase.from("articles").insert({
                        ...data,
                        author_id: profile.id,
                        author_name: profile.full_name,
                        author_serial: profile.serial_id,
                        likes_count: 0,
                        dislikes_count: 0,
                        comments_count: 0,
                      });

                  const { error } = await method;
                  if (!error) {
                    toast.success("Transmission Successful");
                    await fetchGlobalData();
                    handleNavigate("home");
                  } else {
                    toast.error(`Broadcast failed: ${error.message}`);
                  }
                }}
              />
            )}

            {(currentPage === "profile" || currentPage === "settings") &&
              (isLoggedIn ? (
                profile ? (
                  <ProfilePage
                    profile={viewingProfile || profile}
                    onLogout={handleLogout}
                    isExternal={!!viewingProfile}
                    initialTab={
                      currentPage === "settings" ? "settings" : "intel"
                    }
                    onCloseExternal={() => {
                      setViewingProfile(null);
                      handleNavigate("home");
                    }}
                    isLoggedIn={isLoggedIn}
                    currentUserId={profile.id}
                    currentUserProfile={profile}
                    onUpdateProfile={async (data) => {
                      const { error } = await supabase
                        .from("profiles")
                        .update(data)
                        .eq("id", profile.id);
                      if (!error) {
                        setProfile({ ...profile, ...data });
                        toast.success("Identity Synced");
                        fetchGlobalData();
                      }
                    }}
                    onFollow={handleFollow}
                    onChat={(u) => setActiveChat(u)}
                  />
                ) : (
                  <SetupProfilePage
                    onComplete={async (data) => {
                      const { error } = await supabase
                        .from("profiles")
                        .upsert(data);
                      if (!error) {
                        setProfile(data);
                        await fetchGlobalData();
                        toast.success("Identity Forged");
                      }
                    }}
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-40">
                  <button
                    onClick={() => setShowAuth("login")}
                    className="px-12 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                  >
                    Identify to Continue
                  </button>
                </div>
              ))}

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
                onChat={(u) => setActiveChat(u)}
                onRefresh={fetchGlobalData}
                onFollow={handleFollow}
              />
            )}

            {currentPage === "support" && (
              <SupportPage onBack={() => handleNavigate("home")} />
            )}
            {currentPage === "admin" && profile?.role === "admin" && (
              <AdminPage
                articles={articles}
                users={users}
                currentUserId={profile.id}
                onUpdateArticles={fetchGlobalData}
                onUpdateUsers={fetchGlobalData}
                onLogout={handleLogout}
              />
            )}
          </div>

          <TrendingTicker />
          <Footer nodeCount={nodeCount} onNavigate={handleNavigate} />
          {activeArticle && (
            <ArticleDetail
              article={activeArticle}
              onClose={() => setActiveArticle(null)}
              isLoggedIn={isLoggedIn}
              onInteraction={handleInteraction}
              currentUserId={profile?.id}
              currentUserProfile={profile}
              onUpdateArticles={fetchGlobalData}
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
