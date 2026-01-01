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
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [nodeCount, setNodeCount] = useState(2540);

  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [activeChat, setActiveChat] = useState<Profile | null>(null);
  const [chatMessages, setChatMessages] = useState<LiveMessage[]>([]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});

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
          setNeedsOnboarding(false);
        } else {
          const meta = session.user.user_metadata;
          if (meta?.full_name || meta?.name) {
            const autoProfile: Profile = {
              id: session.user.id,
              full_name: meta.full_name || meta.name,
              username: (meta.full_name || meta.name || "user")
                .toLowerCase()
                .replace(/\s/g, "_"),
              gender: "Not specified",
              serial_id: `#ART-${Math.floor(1000 + Math.random() * 9000)}-IND`,
              budget: 150,
              role: "user",
              is_private: false,
              bio: "Identity automatically established via secure link.",
              settings: {
                notifications_enabled: true,
                presence_visible: true,
                data_sharing: false,
                ai_briefings: true,
                secure_mode: true,
              },
            };
            const { error } = await supabase
              .from("profiles")
              .upsert(autoProfile);
            if (!error) {
              setProfile(autoProfile);
              setNeedsOnboarding(false);
            } else {
              setNeedsOnboarding(true);
            }
          } else {
            setNeedsOnboarding(true);
          }
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
            borderRadius: "15px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "bold",
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
          });
        }
      })
      .subscribe();

    // Admin Monitor Channel
    if (profile.role === "admin") {
      const adminMonitor = supabase.channel("admin_oversight");
      adminMonitor
        .on("broadcast", { event: "intercept_pulse" }, (p) => {
          toast(
            `Live Chat Intercepted: ${p.payload.node1} <-> ${p.payload.node2}`,
            {
              icon: "👁️",
              duration: 5000,
              style: {
                background: "#000",
                color: "#fff",
                border: "1px solid #1e293b",
              },
            }
          );
        })
        .subscribe();
    }

    return () => {
      supabase.removeChannel(inboxChannel);
    };
  }, [profile?.id, profile?.role, users]);

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

      // Broadcast metadata to Admins
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

  const handleNavigate = (page: string) => {
    setViewingProfile(null);
    setSearchQuery("");
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateProfile = async (updatedData: Partial<Profile>) => {
    if (!profile) return;
    const { error } = await supabase
      .from("profiles")
      .update(updatedData)
      .eq("id", profile.id);
    if (!error) {
      setProfile({ ...profile, ...updatedData });
      toast.success("Identity Sync Completed");
      fetchUsers();
    }
  };

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
      supabase.channel(`inbox_${req.fromId}`).subscribe((status) => {
        if (status === "SUBSCRIBED") {
          supabase.channel(`inbox_${req.fromId}`).send({
            type: "broadcast",
            event: "handshake_accepted",
            payload: {
              acceptorId: profile.id,
              acceptorName: profile.full_name,
            },
          });
        }
      });
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-slate-950" : "bg-slate-50"
      } transition-colors duration-500`}
    >
      <Toaster position="top-center" />
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
            currentPage={currentPage}
            isLoggedIn={isLoggedIn}
            userRole={profile?.role || "user"}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            chatRequests={chatRequests}
            onAcceptRequest={handleAcceptHandshake}
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
            {currentPage === "profile" && profile && (
              <ProfilePage
                profile={profile}
                onLogout={() => {
                  supabase.auth.signOut();
                  setIsLoggedIn(false);
                  setProfile(null);
                  handleNavigate("home");
                }}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
            {currentPage === "network" && (
              <NetworkPage
                onBack={() => handleNavigate("home")}
                users={users}
                currentUserId={profile?.id}
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
