import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
  const activeChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeChatIdRef.current = activeChat?.id || null;
  }, [activeChat]);

  const fetchArticles = useCallback(async () => {
    try {
      const { data: arts, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (arts) setArticles([...arts]);
    } catch (e: any) {
      console.error(e);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      if (data) setUsers(data);
    } catch (e) {
      console.error(e);
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
      } = await (supabase.auth as any).getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (prof) {
          setProfile(prof);
        }
      }
    } catch (e: any) {
      console.error(e);
    }
    await fetchArticles();
    await fetchUsers();
  }, [fetchArticles, fetchUsers]);

  useEffect(() => {
    if (initializationInProgress.current) return;
    initializationInProgress.current = true;
    initApp();
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
        toast(`New Link Request from ${req.fromName}`, {
          icon: "💬",
          style: {
            borderRadius: "20px",
            background: isDarkMode ? "#1e293b" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#0f172a",
            fontSize: "11px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "16px 24px",
            border: "1px solid rgba(37, 99, 235, 0.2)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          },
        });
      })
      .on("broadcast", { event: "handshake_accepted" }, async (p) => {
        const { acceptorId, acceptorName } = p.payload;
        const acceptorProfile = users.find((u) => u.id === acceptorId);
        if (acceptorProfile) {
          setActiveChat(acceptorProfile);
          setChatMessages([]);
          toast.success(`Secure link connected with ${acceptorName}`, {
            icon: "⚡",
            style: {
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "900",
              textTransform: "uppercase",
            },
          });
        }
      })
      .subscribe();

    if (profile.role === "admin") {
      const adminMonitor = supabase.channel("admin_oversight");
      adminMonitor
        .on("broadcast", { event: "intercept_pulse" }, (p) => {
          setAdminIntercepts((prev) => {
            const exists = prev.some((i) => i.room === p.payload.room);
            if (exists) return prev;

            toast(
              `Live Node Pulse Detected: ${p.payload.node1} <-> ${p.payload.node2}`,
              {
                icon: "👁️",
                duration: 4000,
                style: {
                  background: "#000",
                  color: "#fff",
                  border: "1px solid #dc2626",
                  fontSize: "10px",
                  fontWeight: "bold",
                  borderRadius: "15px",
                },
              }
            );
            return [...prev, p.payload];
          });
        })
        .subscribe();
    }

    return () => {
      supabase.removeChannel(inboxChannel);
    };
  }, [profile?.id, profile?.role, users, isDarkMode]);

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

      supabase.channel("admin_oversight").send({
        type: "broadcast",
        event: "intercept_pulse",
        payload: {
          node1: profile.full_name,
          node2: activeChat.full_name,
          room: roomName,
          message: text,
        },
      });
    },
    [profile, activeChat]
  );

  const handleAcceptHandshake = async (req: ChatRequest) => {
    if (!profile) return;
    let sender = users.find((u) => u.id === req.fromId);
    if (!sender) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", req.fromId)
        .maybeSingle();
      if (data) sender = data;
    }

    if (sender) {
      setActiveChat(sender);
      setChatRequests((prev) => prev.filter((r) => r.id !== req.id));
      setChatMessages([]);

      const confirmationChannel = supabase.channel(`inbox_${req.fromId}`);
      confirmationChannel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          confirmationChannel.send({
            type: "broadcast",
            event: "handshake_accepted",
            payload: {
              acceptorId: profile.id,
              acceptorName: profile.full_name,
            },
          });
        }
      });
      toast.success(`Handshake Complete: ${sender.full_name}`, {
        style: {
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: "900",
          textTransform: "uppercase",
        },
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setProfile(null);
    setCurrentPage("home");
    toast.success("Session Terminated Safely.");
  };

  const handleNavigate = (page: string) => {
    setViewingProfile(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-slate-950" : "bg-slate-50"
      } transition-colors duration-500`}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "notranslate",
          style: {
            marginBottom: "24px",
          },
        }}
      />
      {showAuth === "login" && (
        <LoginPage
          onBack={() => setShowAuth(null)}
          onSuccess={() => {
            setIsLoggedIn(true);
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
            setIsLoggedIn(true);
            setShowAuth(null);
            initApp();
          }}
          onGoToLogin={() => setShowAuth("login")}
        />
      )}

      {!showAuth && (
        <>
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
            onAcceptRequest={handleAcceptHandshake}
            adminIntercepts={adminIntercepts}
          />

          <div className="pt-24">
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
                    toast.success("Published");
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
              />
            )}
            {currentPage === "profile" && (viewingProfile || profile) && (
              <ProfilePage
                profile={viewingProfile || profile!}
                onLogout={handleLogout}
                isExternal={!!viewingProfile}
                onCloseExternal={() => {
                  if (viewingProfile) {
                    setViewingProfile(null);
                    setCurrentPage("network");
                  } else handleNavigate("home");
                }}
                isLoggedIn={isLoggedIn}
                currentUserId={profile?.id}
                onSendChatRequest={(u) => {
                  setActiveChat(u);
                  setChatMessages([]);
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
        </>
      )}
    </div>
  );
};

export default App;
