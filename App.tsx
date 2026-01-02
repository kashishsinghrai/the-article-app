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
import {
  Profile,
  Article,
  ChatRequest,
  LiveMessage,
  UserSettings,
} from "./types";
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
  const [nodeCount, setNodeCount] = useState(2540);

  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [activeChat, setActiveChat] = useState<Profile | null>(null);
  const [chatMessages, setChatMessages] = useState<LiveMessage[]>([]);
  const [adminIntercepts, setAdminIntercepts] = useState<any[]>([]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);

  const initializationInProgress = useRef(false);

  const fetchArticles = useCallback(async () => {
    try {
      const { data: arts, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (arts) {
        setArticles([...arts]);
      }
    } catch (e: any) {
      console.error("Article fetch failed");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      if (data) setUsers(data);
    } catch (e) {
      console.error("Registry sync failed.");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const initApp = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const { data: prof, error } = await supabase
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
    } catch (e: any) {
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

    return () => subscription.unsubscribe();
  }, [initApp]);

  useEffect(() => {
    if (!profile?.id) return;

    const inboxChannel = supabase.channel(`inbox_${profile.id}`);
    inboxChannel
      .on("broadcast", { event: "handshake" }, (p) => {
        const req = p.payload as ChatRequest;
        setChatRequests((prev) =>
          prev.some((r) => r.fromId === req.fromId) ? prev : [...prev, req]
        );
        toast(`Signal Detected: ${req.fromName}`, { icon: "🤝" });
      })
      .on("broadcast", { event: "handshake_accepted" }, async (p) => {
        const { acceptorId, acceptorName } = p.payload;
        const acceptorProfile = users.find((u) => u.id === acceptorId);
        if (acceptorProfile) {
          setActiveChat(acceptorProfile);
          setChatMessages([]);
          toast.success(`Secure link with ${acceptorName}`, { icon: "⚡" });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(inboxChannel);
    };
  }, [profile?.id, users]);

  const handleAcceptRequest = useCallback(
    async (req: ChatRequest) => {
      if (!profile) return;
      const senderProfile = users.find((u) => u.id === req.fromId);
      if (senderProfile) {
        setActiveChat(senderProfile);
        setChatMessages([]);
        const confirmChannel = supabase.channel(`inbox_${req.fromId}`);
        confirmChannel.subscribe((status) => {
          if (status === "SUBSCRIBED") {
            confirmChannel.send({
              type: "broadcast",
              event: "handshake_accepted",
              payload: {
                acceptorId: profile.id,
                acceptorName: profile.full_name,
              },
            });
            setTimeout(() => supabase.removeChannel(confirmChannel), 2000);
          }
        });
        setChatRequests((prev) => prev.filter((r) => r.id !== req.id));
      }
    },
    [profile, users]
  );

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!profile || !activeChat) return;
      const message: LiveMessage = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: profile.id,
        senderName: profile.full_name,
        text: text,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, message]);
      const ids = [profile.id, activeChat.id].sort();
      const roomName = `room_${ids[0]}_${ids[1]}`;
      supabase
        .channel(roomName)
        .send({ type: "broadcast", event: "message", payload: message });
    },
    [profile, activeChat]
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setProfile(null);
    setCurrentPage("home");
    setIsSettingUp(false);
    toast.success("Identity disconnected.");
  };

  const handleNavigate = (page: string) => {
    setViewingProfile(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProfileSetupComplete = async (profileData: Profile) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("Protocol Error: Re-authentication required.");
        return;
      }

      // Defensively only send columns usually present in profiles table to avoid Error 400
      const safeData = {
        id: session.user.id,
        username: profileData.username,
        full_name: profileData.full_name,
        bio: profileData.bio,
        gender: profileData.gender,
        serial_id: profileData.serial_id,
        budget: profileData.budget,
        role: profileData.role,
        is_private: profileData.is_private,
        email: profileData.email,
        phone: profileData.phone,
        is_online: profileData.is_online,
        settings: profileData.settings,
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(safeData, { onConflict: "id" });

      if (error) {
        console.error("Profile sync error:", error);
        throw error;
      }

      setProfile(profileData);
      setIsSettingUp(false);
      handleNavigate("home");
      toast.success("Identity Synchronized.");
      fetchUsers();
    } catch (err: any) {
      toast.error(
        "SYNC FAILED: Run the SQL Fix provided in the prompt instructions. " +
          (err.message || "Unknown error")
      );
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
            onAcceptRequest={handleAcceptRequest}
          />

          <div className="flex-grow pt-24">
            {currentPage === "home" && (
              <HomePage
                articles={articles}
                isLoggedIn={isLoggedIn}
                onLogin={() => setShowAuth("login")}
                userRole={profile?.role || "user"}
                onDelete={() => {}}
                onEdit={() => {}}
                onViewProfile={() => {}}
                onReadArticle={setActiveArticle}
              />
            )}
            {currentPage === "post" && (
              <PostPage
                onBack={() => handleNavigate("home")}
                onPublish={async (data) => {
                  if (!profile) return;
                  const payload = {
                    ...data,
                    author_id: profile.id,
                    author_name: profile.full_name,
                    author_serial: profile.serial_id,
                  };
                  const { error } = await supabase
                    .from("articles")
                    .insert(payload);
                  if (!error) {
                    toast.success("Dispatch Published");
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
                    if (viewingProfile) {
                      setViewingProfile(null);
                      setCurrentPage("network");
                    } else handleNavigate("home");
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
                  setChatMessages([]);
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
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
