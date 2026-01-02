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
      const [artRes, userRes] = await Promise.all([
        supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("*")
          .order("full_name", { ascending: true }),
      ]);

      if (artRes.error) throw artRes.error;
      if (userRes.error) throw userRes.error;

      setArticles(artRes.data || []);
      setUsers(userRes.data || []);

      return { articles: artRes.data, users: userRes.data };
    } catch (e) {
      console.error("Fetch Error:", e);
      toast.error("Network sync failure. Retry recommended.");
    }
  }, []);

  const fetchMyProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setProfile(data);
        return data;
      }
    } catch (e) {
      console.warn("Profile fetch error:", e);
    }
    return null;
  }, []);

  const syncIdentity = useCallback(
    async (user: any) => {
      if (!user) return;
      setIsLoggedIn(true);
      const myProf = await fetchMyProfile(user.id);
      if (myProf) {
        // Realtime handshake listener
        supabase
          .channel(`chat_notifications_${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "chat_requests",
              filter: `to_id=eq.${user.id}`,
            },
            (payload) => {
              setChatRequests((prev) => [...prev, payload.new as ChatRequest]);
              toast("Secure handshake received", { icon: "🤝" });
            }
          )
          .subscribe();

        const { data: reqs } = await supabase
          .from("chat_requests")
          .select("*")
          .eq("to_id", user.id)
          .eq("status", "pending");
        if (reqs) setChatRequests(reqs);
      }
      await fetchGlobalData();
    },
    [fetchMyProfile, fetchGlobalData]
  );

  useEffect(() => {
    if (initializationInProgress.current) return;
    initializationInProgress.current = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await fetchGlobalData();
      if (session?.user) await syncIdentity(session.user);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await syncIdentity(session.user);
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setProfile(null);
        setArticles([]); // Clear specific cache
        setChatRequests([]);
        setActiveChat(null);
        setCurrentPage("home");
      }
    });

    return () => subscription.unsubscribe();
  }, [syncIdentity, fetchGlobalData]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      setIsLoggedIn(false);
      setProfile(null);
      setChatRequests([]);
      setActiveChat(null);
      setCurrentPage("home");
      toast.success("Identity Terminal Disconnected.");
    } catch (e) {
      toast.error("Logout failure.");
    }
  };

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
            syncIdentity(u);
          }}
          onGoToRegister={() => setShowAuth("register")}
        />
      )}
      {showAuth === "register" && (
        <RegisterPage
          onBack={() => setShowAuth(null)}
          onSuccess={(u) => {
            setShowAuth(null);
            syncIdentity(u);
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
              />
            )}

            {currentPage === "post" && (
              <PostPage
                profile={profile}
                editData={editingArticleData}
                onBack={() => setCurrentPage("home")}
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
                  await fetchGlobalData();
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
                    onLogout={handleLogout}
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
                        fetchMyProfile(profile.id);
                        fetchGlobalData();
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
                        toast.error(
                          "Database conflict: Failed to establish identity."
                        );
                        return;
                      }
                      setProfile(d);
                      setIsLoggedIn(true);
                      toast.success("Identity Established.");
                      await fetchGlobalData();
                      setCurrentPage("home");
                    }}
                  />
                )
              ) : (
                <div className="py-40 text-center">
                  <button
                    onClick={() => setShowAuth("login")}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest"
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
