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
import { Profile, Article, ChatRequest } from "./types";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./lib/supabase";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
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
      console.warn("Background Sync: Data fetch skipped (check network/keys).");
    }
  }, []);

  const fetchMyProfile = useCallback(async (userId: string) => {
    try {
      const { data: prof, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (prof && !error) {
        setProfile(prof);
        return prof;
      }
    } catch (e) {
      console.warn("Profile background sync skipped.");
    }
    return null;
  }, []);

  const listenForChatRequests = useCallback((userId: string) => {
    try {
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
            setChatRequests((prev) =>
              prev.find((r) => r.id === newReq.id) ? prev : [...prev, newReq]
            );
            toast("📡 New Secure Handshake Received");
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.error("Realtime communications disabled.");
    }
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
        console.warn("Identity context re-syncing...");
      }
    },
    [listenForChatRequests, fetchMyProfile]
  );

  const initApp = useCallback(async () => {
    try {
      const [
        {
          data: { session },
        },
      ] = await Promise.all([supabase.auth.getSession(), fetchGlobalData()]);

      if (session?.user) {
        await checkUserStatus(session.user);
      }
    } catch (e) {
      console.log("App initialized in offline/guest mode.");
    }
  }, [fetchGlobalData, checkUserStatus]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Force immediate UI update
      setIsLoggedIn(false);
      setProfile(null);
      setChatRequests([]);
      setActiveChat(null);
      setCurrentPage("home");
      toast.success("Disconnected from Network");
    } catch (e) {
      console.error("Logout error", e);
      toast.error("Logout failed.");
    }
  };

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

  const handleChatInitiate = async (target: Profile) => {
    if (!profile) return toast.error("Identity verification required.");
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
      toast("Handshake Pending.");
    } else {
      const { error } = await supabase
        .from("chat_requests")
        .insert({ from_id: profile.id, to_id: target.id, status: "pending" });
      if (!error) toast.success("Handshake Dispatched.");
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
      toast.success("Identity Verified.");
    }
  };

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
                  if (!isLoggedIn) return toast.error("Verification required.");
                  const col =
                    type === "like" ? "likes_count" : "dislikes_count";
                  const targetArt = articles.find((a) => a.id === id);
                  if (targetArt) {
                    await supabase
                      .from("articles")
                      .update({ [col]: ((targetArt as any)[col] || 0) + 1 })
                      .eq("id", id);
                    fetchGlobalData();
                  }
                }}
              />
            )}

            {currentPage === "post" && (
              <PostPage
                profile={profile}
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
                    onLogout={handleLogout}
                    isExternal={!!viewingProfile}
                    onCloseExternal={() => {
                      setViewingProfile(null);
                      setCurrentPage("home");
                    }}
                    isLoggedIn={isLoggedIn}
                    currentUserId={profile.id}
                    currentUserProfile={profile}
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
                onLogout={handleLogout}
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
