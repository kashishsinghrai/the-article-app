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
  const [isInitializing, setIsInitializing] = useState(true);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [editingArticleData, setEditingArticleData] = useState<Article | null>(
    null
  );

  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [activeChat, setActiveChat] = useState<Profile | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);

  const initializationInProgress = useRef(false);

  const fetchGlobalData = useCallback(async () => {
    try {
      const { data: artData } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      const { data: userData } = await supabase.from("profiles").select("*");
      if (artData) setArticles(artData);
      if (userData) setUsers(userData);
    } catch (e) {
      console.error("Hydration Error");
    }
  }, []);

  const fetchMyProfile = useCallback(async (userId: string) => {
    const { data: prof, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (prof && !error) {
      setProfile(prof);
      return prof;
    }
    return null;
  }, []);

  const listenForChatRequests = useCallback((userId: string) => {
    const channel = supabase
      .channel("chat_notifications_global")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_requests",
          filter: `to_id=eq.${userId}`,
        },
        (payload) => {
          const newReq = payload.new as ChatRequest;
          setChatRequests((prev) => {
            if (prev.find((r) => r.id === newReq.id)) return prev;
            return [...prev, newReq];
          });
          toast("📡 New Secure Handshake Request Received");
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_requests",
          filter: `to_id=eq.${userId}`,
        },
        (payload) => {
          const updatedReq = payload.new as ChatRequest;
          if (updatedReq.status !== "pending") {
            setChatRequests((prev) =>
              prev.filter((r) => r.id !== updatedReq.id)
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkUserStatus = useCallback(
    async (user: any) => {
      if (!user) {
        setIsLoggedIn(false);
        setProfile(null);
        return;
      }
      setIsLoggedIn(true);
      try {
        await fetchMyProfile(user.id);
        listenForChatRequests(user.id);

        const { data: reqs } = await supabase
          .from("chat_requests")
          .select("*")
          .eq("to_id", user.id)
          .eq("status", "pending");
        if (reqs) setChatRequests(reqs);
      } catch (err) {
        console.error("Identity sync failure.");
      }
    },
    [listenForChatRequests, fetchMyProfile]
  );

  const initApp = useCallback(async () => {
    setIsInitializing(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) await checkUserStatus(session.user);
      await fetchGlobalData();
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
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) await checkUserStatus(session.user);
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setProfile(null);
        setChatRequests([]);
        setCurrentPage("home");
      }
    });

    return () => subscription.unsubscribe();
  }, [initApp, checkUserStatus]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const handleFollow = async (targetId: string) => {
    if (!profile) return toast.error("Sign in to link identities.");
    const isFollowing = profile.following?.includes(targetId);

    // Update local state optimistically
    const currentFollowing = profile.following || [];
    const newFollowing = isFollowing
      ? currentFollowing.filter((id) => id !== targetId)
      : [...currentFollowing, targetId];

    // 1. Update MY following list
    const { error: pError } = await supabase
      .from("profiles")
      .update({
        following: newFollowing,
        following_count: newFollowing.length,
      })
      .eq("id", profile.id);

    if (pError) return toast.error("Social sync failed.");

    // 2. Update TARGET's followers count
    const targetUser = users.find((u) => u.id === targetId);
    if (targetUser) {
      const newFollowersCount = isFollowing
        ? Math.max(0, (targetUser.followers_count || 1) - 1)
        : (targetUser.followers_count || 0) + 1;
      await supabase
        .from("profiles")
        .update({ followers_count: newFollowersCount })
        .eq("id", targetId);
    }

    toast.success(
      isFollowing ? "Identity Unlinked" : "Node Connection Secured"
    );

    // Forced Refetch
    await fetchMyProfile(profile.id);
    await fetchGlobalData();
  };

  const handleChatInitiate = async (target: Profile) => {
    if (!profile) return toast.error("Auth required.");

    // Check if channel is already open
    const { data: existing } = await supabase
      .from("chat_requests")
      .select("*")
      .or(
        `and(from_id.eq.${profile.id},to_id.eq.${target.id}),and(from_id.eq.${target.id},to_id.eq.${profile.id})`
      )
      .maybeSingle();

    if (existing?.status === "accepted") {
      setActiveChat(target);
    } else if (existing?.status === "pending") {
      toast("Channel Handshake Pending Verification.");
    } else {
      const { error } = await supabase
        .from("chat_requests")
        .insert({ from_id: profile.id, to_id: target.id, status: "pending" });
      if (!error) toast.success("Secure Handshake Dispatched.");
      else toast.error("Channel Establishment Failed.");
    }
  };

  const handleAcceptRequest = async (req: ChatRequest) => {
    const { error } = await supabase
      .from("chat_requests")
      .update({ status: "accepted" })
      .eq("id", req.id);
    if (!error) {
      setChatRequests((prev) => prev.filter((r) => r.id !== req.id));
      const sender = users.find((u) => u.id === req.from_id);
      if (sender) setActiveChat(sender);
      toast.success("Identity Verified. Comm Link: ACTIVE.");
    }
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
      }`}
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
        <>
          <Navbar
            onNavigate={setCurrentPage}
            onLogin={() => setShowAuth("login")}
            onLogout={() => supabase.auth.signOut()}
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
                onDelete={() => fetchGlobalData()}
                onEdit={(a) => {
                  setEditingArticleData(a);
                  setCurrentPage("post");
                }}
                onReadArticle={setActiveArticle}
                onRefresh={fetchGlobalData}
                onInteraction={async (type, id) => {
                  if (!isLoggedIn)
                    return toast.error("Identity verification required.");
                  const art = articles.find((a) => a.id === id);
                  if (!art) return;
                  const col =
                    type === "like" ? "likes_count" : "dislikes_count";
                  const newVal = (art[col] || 0) + 1;
                  await supabase
                    .from("articles")
                    .update({ [col]: newVal })
                    .eq("id", id);
                  fetchGlobalData();
                }}
              />
            )}

            {currentPage === "post" && (
              <PostPage
                editData={editingArticleData}
                onBack={() => setCurrentPage("home")}
                onPublish={async (d) => {
                  const method = editingArticleData
                    ? supabase
                        .from("articles")
                        .update(d)
                        .eq("id", editingArticleData.id)
                    : supabase
                        .from("articles")
                        .insert({
                          ...d,
                          author_id: profile?.id,
                          author_name: profile?.full_name,
                          author_serial: profile?.serial_id,
                        });
                  await method;
                  await fetchGlobalData();
                  setCurrentPage("home");
                }}
              />
            )}

            {(currentPage === "profile" || currentPage === "settings") &&
              (isLoggedIn ? (
                profile ? (
                  <ProfilePage
                    profile={viewingProfile || profile}
                    onLogout={() => supabase.auth.signOut()}
                    isExternal={!!viewingProfile}
                    onCloseExternal={() => {
                      setViewingProfile(null);
                      setCurrentPage("home");
                    }}
                    isLoggedIn={isLoggedIn}
                    currentUserId={profile.id}
                    currentUserProfile={profile}
                    onFollow={handleFollow}
                    onChat={handleChatInitiate}
                    onUpdateProfile={async (d) => {
                      await supabase
                        .from("profiles")
                        .update(d)
                        .eq("id", profile.id);
                      fetchGlobalData();
                    }}
                  />
                ) : (
                  <SetupProfilePage
                    onComplete={async (d) => {
                      await supabase.from("profiles").upsert(d);
                      fetchGlobalData();
                    }}
                  />
                )
              ) : (
                <div className="py-40 text-center">
                  <button
                    onClick={() => setShowAuth("login")}
                    className="px-8 py-3 font-bold text-white bg-slate-900 rounded-xl"
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
                onChat={handleChatInitiate}
                onRefresh={fetchGlobalData}
                onFollow={handleFollow}
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
                onUpdateArticles={fetchGlobalData}
                onUpdateUsers={fetchGlobalData}
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
              onUpdateArticles={fetchGlobalData}
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
