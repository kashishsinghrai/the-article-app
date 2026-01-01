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
  const [nodeCount, setNodeCount] = useState(1204);

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
    if (!profile?.id) return;
    if (profile.settings && profile.settings.presence_visible === false) return;

    const channel = supabase.channel("global_presence", {
      config: { presence: { key: profile.id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        setOnlineUsers(channel.presenceState());
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: profile.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [profile?.id, profile?.settings?.presence_visible]);

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
        if (prof) setProfile(prof);
        else setNeedsOnboarding(true);
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

  const sendNotification = (title: string, body: string) => {
    if (profile?.settings?.notifications_enabled === false) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  };

  useEffect(() => {
    if (!profile?.id) return;

    const inboxChannel = supabase.channel(`inbox_${profile.id}`);
    inboxChannel
      .on("broadcast", { event: "handshake" }, (p) => {
        const req = p.payload as ChatRequest;
        setChatRequests((prev) =>
          prev.some((r) => r.fromId === req.fromId) ? prev : [...prev, req]
        );
        toast(`Handshake Signal from ${req.fromName}`, {
          icon: "📡",
          style: {
            borderRadius: "15px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "bold",
          },
        });
        sendNotification(
          "Network Handshake",
          `${req.fromName} is requesting a secure link.`
        );
      })
      .on("broadcast", { event: "handshake_accepted" }, async (p) => {
        // This is triggered when SOMEONE ELSE accepts your request
        const { acceptorId, acceptorName } = p.payload;
        const acceptorProfile = users.find((u) => u.id === acceptorId);

        if (acceptorProfile) {
          setActiveChat(acceptorProfile);
          setChatMessages([]);
          toast.success(`Secure link established with ${acceptorName}`, {
            icon: "⚡",
          });
        } else {
          // Fetch profile if not in cache
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", acceptorId)
            .maybeSingle();
          if (data) setActiveChat(data);
        }
      })
      .subscribe();

    const notifyChannel = supabase.channel(`notify_${profile.id}`);
    notifyChannel
      .on("broadcast", { event: "new_message" }, (p) => {
        const msg = p.payload as LiveMessage & { senderProfile: Profile };
        if (activeChatIdRef.current !== msg.senderId) {
          toast(`Message from ${msg.senderName}`, {
            icon: "💬",
            onClick: () => {
              setActiveChat(msg.senderProfile);
            },
          } as any);
          sendNotification(`Intel from ${msg.senderName}`, msg.text);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(inboxChannel);
      supabase.removeChannel(notifyChannel);
    };
  }, [profile?.id, profile?.settings?.notifications_enabled, users]);

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

      // Also notify active status
      supabase.channel(`notify_${activeChat.id}`).subscribe((status) => {
        if (status === "SUBSCRIBED") {
          supabase
            .channel(`notify_${activeChat.id}`)
            .send({
              type: "broadcast",
              event: "new_message",
              payload: { ...message, senderProfile: profile },
            });
        }
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
      toast.success("System Configuration Updated");
      fetchUsers();
    } else {
      toast.error("Sync failed");
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
      // 1. Open chat for local user
      setActiveChat(sender);
      setChatRequests((prev) => prev.filter((r) => r.id !== req.id));
      setChatMessages([]);
      toast.success(`Secure link established with ${sender.full_name}`);

      // 2. Broadcast acceptance to the sender's inbox channel
      const senderInbox = supabase.channel(`inbox_${req.fromId}`);
      senderInbox.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          senderInbox.send({
            type: "broadcast",
            event: "handshake_accepted",
            payload: {
              acceptorId: profile.id,
              acceptorName: profile.full_name,
            },
          });
        }
      });
    } else {
      toast.error("Node identity missing from registry.");
    }
  };

  const visibleArticles = useMemo(() => {
    return articles.filter((art) => {
      if (art.is_private === false) return true;
      if (profile?.role === "admin") return true;
      if (profile?.id === art.author_id) return true;
      return false;
    });
  }, [articles, profile]);

  const usersWithPresence = useMemo(() => {
    return users.map((u) => ({
      ...u,
      is_online: u.settings?.presence_visible !== false && !!onlineUsers[u.id],
    }));
  }, [users, onlineUsers]);

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (!error) {
      fetchArticles();
      toast.success("Intel Expunged");
    } else toast.error("Purge failed");
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (!error) {
      fetchUsers();
      toast.success("Node Terminated");
    } else toast.error("Expulsion failed");
  };

  if (needsOnboarding) {
    return (
      <SetupProfilePage
        onComplete={async (p) => {
          const {
            data: { session },
          } = await (supabase.auth as any).getSession();
          if (session?.user) {
            const defaultSettings: UserSettings = {
              notifications_enabled: true,
              presence_visible: true,
              data_sharing: false,
              ai_briefings: true,
              secure_mode: true,
            };
            const finalP = {
              ...p,
              id: session.user.id,
              settings: defaultSettings,
            };
            await supabase.from("profiles").upsert(finalP);
            setProfile(finalP);
            setNeedsOnboarding(false);
            if ("Notification" in window) Notification.requestPermission();
          }
        }}
      />
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-slate-950" : "bg-slate-50"
      } transition-colors duration-500`}
    >
      <Navbar
        onNavigate={handleNavigate}
        onLogin={() => setShowAuth("login")}
        onSearch={setSearchQuery}
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        userRole={profile?.role || "user"}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        chatRequests={chatRequests}
        onAcceptRequest={handleAcceptHandshake}
      />

      <div className="pt-24 md:pt-32">
        {["home", "all-posts"].includes(currentPage) && (
          <HomePage
            articles={visibleArticles}
            isLoggedIn={isLoggedIn}
            onLogin={() => setShowAuth("login")}
            userRole={profile?.role || "user"}
            onDelete={deleteArticle}
            onEdit={() => {}}
            onViewProfile={(id) => {
              const u = usersWithPresence.find((x) => x.id === id);
              if (u) setViewingProfile(u);
              setCurrentPage("profile");
            }}
            onReadArticle={setActiveArticle}
            isArchive={currentPage === "all-posts"}
            currentUserId={profile?.id}
          />
        )}
        {currentPage === "post" && (
          <PostPage
            onPublish={async (data) => {
              if (!profile) return;
              const payload = {
                ...data,
                author_id: profile.id,
                author_name: profile.full_name,
                author_serial: profile.serial_id,
              };
              const { error } = await supabase.from("articles").insert(payload);
              if (!error) {
                toast.success("Transmission Successful");
                fetchArticles();
                handleNavigate("home");
              } else toast.error("Network sync failed");
            }}
          />
        )}
        {currentPage === "profile" && (
          <ProfilePage
            profile={viewingProfile || profile || ({} as Profile)}
            onLogout={() => {
              (supabase.auth as any).signOut();
              setIsLoggedIn(false);
              setProfile(null);
              handleNavigate("home");
            }}
            onUpdateProfile={handleUpdateProfile}
            isLoggedIn={isLoggedIn}
            onSendChatRequest={(tid, tname) => {
              if (!profile) return;
              const req = {
                id: Math.random().toString(36).substr(2, 9),
                fromId: profile.id,
                fromName: profile.full_name,
                toId: tid,
                timestamp: Date.now(),
              };
              supabase.channel(`inbox_${tid}`).subscribe((status) => {
                if (status === "SUBSCRIBED") {
                  supabase
                    .channel(`inbox_${tid}`)
                    .send({
                      type: "broadcast",
                      event: "handshake",
                      payload: req,
                    });
                  toast.success(`Signal sent to ${tname}`);
                }
              });
            }}
            isExternal={!!viewingProfile}
            onCloseExternal={() => {
              setViewingProfile(null);
              setCurrentPage("home");
            }}
            currentUserId={profile?.id}
          />
        )}
        {currentPage === "network" && (
          <NetworkPage
            users={usersWithPresence}
            currentUserId={profile?.id}
            onViewProfile={(u) => {
              setViewingProfile(u);
              setCurrentPage("profile");
            }}
            onChat={(u) => {
              if (!profile) {
                setShowAuth("login");
                return;
              }
              const req = {
                id: Math.random().toString(36).substr(2, 9),
                fromId: profile.id,
                fromName: profile.full_name,
                toId: u.id,
                timestamp: Date.now(),
              };
              supabase.channel(`inbox_${u.id}`).subscribe((status) => {
                if (status === "SUBSCRIBED") {
                  supabase
                    .channel(`inbox_${u.id}`)
                    .send({
                      type: "broadcast",
                      event: "handshake",
                      payload: req,
                    });
                  toast.success(`Signal sent to ${u.full_name}`);
                }
              });
            }}
          />
        )}
        {currentPage === "support" && <SupportPage />}
        {currentPage === "admin" && profile?.role === "admin" && (
          <AdminPage
            articles={articles}
            users={users}
            onDeleteArticle={deleteArticle}
            onDeleteUser={deleteUser}
            onRefreshData={initApp}
          />
        )}
      </div>

      <TrendingTicker />
      <Footer nodeCount={nodeCount} onNavigate={handleNavigate} />

      {showAuth && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            onClick={() => setShowAuth(null)}
          />
          {showAuth === "login" ? (
            <LoginPage
              onBack={() => setShowAuth(null)}
              onSuccess={(u) => {
                setIsLoggedIn(true);
                setShowAuth(null);
                initApp();
              }}
              onGoToRegister={() => setShowAuth("register")}
            />
          ) : (
            <RegisterPage
              onBack={() => setShowAuth(null)}
              onSuccess={(u) => {
                setIsLoggedIn(true);
                setShowAuth(null);
                initApp();
              }}
              onGoToLogin={() => setShowAuth("login")}
            />
          )}
        </div>
      )}

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
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
