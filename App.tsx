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
import { Profile, Article, ChatRequest, LiveMessage } from "./types";
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
  const initializationInProgress = useRef(false);

  // Refs for real-time listeners to avoid closure staleness
  const activeChatRef = useRef<Profile | null>(null);
  useEffect(() => {
    activeChatRef.current = activeChat;
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
      console.error("Error fetching articles:", e);
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
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (initializationInProgress.current) return;
    initializationInProgress.current = true;

    const initApp = async () => {
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
    };

    initApp();
    const ticker = setInterval(
      () => setNodeCount((p) => p + (Math.random() > 0.5 ? 1 : -1)),
      15000
    );
    return () => clearInterval(ticker);
  }, [fetchArticles, fetchUsers]);

  // SINGLE PERSISTENT CHAT CHANNEL (The "WhatsApp" style central hub)
  useEffect(() => {
    if (!profile?.id) return;

    // Subscribe to a profile-specific inbox channel
    const channel = supabase.channel(`realtime_inbox_${profile.id}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "handshake" }, (p) => {
        const req = p.payload as ChatRequest;
        setChatRequests((prev) =>
          prev.some((r) => r.id === req.id) ? prev : [...prev, req]
        );
        toast(`Incoming Signal: ${req.fromName}`, { icon: "📡" });
      })
      .on("broadcast", { event: "chat_message" }, (p) => {
        // Fix: Use the LiveMessage interface which now includes senderName
        const msg = p.payload as LiveMessage & { recipientId: string };
        // Check if message is for us AND if the chat box with this sender is open
        if (activeChatRef.current?.id === msg.senderId) {
          setChatMessages((prev) => [...prev, msg]);
        } else {
          // Fix: Ensure senderName is checked and remove unsupported onClick property
          toast(`Message from ${msg.senderName || "Node"}`, {
            icon: "💬",
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, users]);

  const handleNavigate = useCallback((page: string) => {
    setViewingProfile(null);
    setSearchQuery("");
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLoginTrigger = useCallback(() => {
    setShowAuth("login");
  }, []);

  const handleLogout = useCallback(async () => {
    await (supabase.auth as any).signOut();
    setIsLoggedIn(false);
    setProfile(null);
    setNeedsOnboarding(false);
    setCurrentPage("home");
    toast.error("Session Revoked");
  }, []);

  const handleAuthSuccess = useCallback(
    async (user: any) => {
      if (!user) return;
      setIsLoggedIn(true);
      setShowAuth(null);
      const { data: prof } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .maybeSingle();
      if (!prof) setNeedsOnboarding(true);
      else setProfile(prof);
      toast.success("Identity Authorized");
      await fetchArticles();
      await fetchUsers();
    },
    [fetchArticles, fetchUsers]
  );

  const handleDeleteArticle = useCallback(
    async (id: string) => {
      const toastId = toast.loading("Purging Record...");
      try {
        const { error } = await supabase.from("articles").delete().eq("id", id);
        if (error) throw error;
        await fetchArticles();
        toast.success("Record Erased", { id: toastId });
      } catch (err) {
        toast.error("Failed to Purge Record", { id: toastId });
      }
    },
    [fetchArticles]
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      const toastId = toast.loading("Revoking Correspondent Status...");
      try {
        const { error } = await supabase.from("profiles").delete().eq("id", id);
        if (error) throw error;
        await fetchUsers();
        toast.success("Identity Purged", { id: toastId });
      } catch (err) {
        toast.error("Purge Failed", { id: toastId });
      }
    },
    [fetchUsers]
  );

  const handleSendChatRequest = useCallback(
    (tid: string, tname: string) => {
      if (!profile) {
        toast.error("Login to establish link");
        return;
      }
      const req: ChatRequest = {
        id: Math.random().toString(36).substr(2, 9),
        fromId: profile.id,
        fromName: profile.full_name,
        toId: tid,
        timestamp: Date.now(),
      };

      // Broadcast to target's inbox channel
      supabase.channel(`realtime_inbox_${tid}`).subscribe((status) => {
        if (status === "SUBSCRIBED") {
          supabase.channel(`realtime_inbox_${tid}`).send({
            type: "broadcast",
            event: "handshake",
            payload: req,
          });
          toast.success(`Request Sent to ${tname}`);
        }
      });
    },
    [profile]
  );

  const handleAcceptChat = useCallback(
    (req: ChatRequest) => {
      const sender = users.find((u) => u.id === req.fromId);
      if (sender) {
        setActiveChat(sender);
        setChatRequests((prev) => prev.filter((r) => r.id !== req.id));
        setChatMessages([]);
        toast.success("Link Secured");
      }
    },
    [users]
  );

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!profile || !activeChat) return;

      const message = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: profile.id,
        senderName: profile.full_name,
        text: text,
        timestamp: Date.now(),
      };

      // 1. Show in our own UI
      setChatMessages((prev) => [...prev, message]);

      // 2. Transmit to recipient's persistent inbox channel
      const channel = supabase.channel(`realtime_inbox_${activeChat.id}`);
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.send({
            type: "broadcast",
            event: "chat_message",
            payload: message,
          });
        }
      });
    },
    [profile, activeChat]
  );

  const displayedArticles = useMemo(() => {
    if (!searchQuery) return articles;
    return articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  if (needsOnboarding) {
    return (
      <SetupProfilePage
        onComplete={async (p) => {
          const {
            data: { session },
          } = await (supabase.auth as any).getSession();
          if (!session?.user) return;
          const finalProfile = { ...p, id: session.user.id };
          const { error } = await supabase
            .from("profiles")
            .upsert(finalProfile);
          if (error) {
            toast.error("Profile Setup Failed");
            return;
          }
          setProfile(finalProfile);
          setNeedsOnboarding(false);
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
        onLogin={handleLoginTrigger}
        onSearch={setSearchQuery}
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        userRole={profile?.role || "user"}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        chatRequests={chatRequests}
        onAcceptRequest={handleAcceptChat}
      />

      <div className="pt-24 md:pt-32">
        {["home", "all-posts"].includes(currentPage) && (
          <HomePage
            articles={displayedArticles}
            isLoggedIn={isLoggedIn}
            onLogin={handleLoginTrigger}
            userRole={profile?.role || "user"}
            onDelete={handleDeleteArticle}
            onEdit={() => {}}
            onViewProfile={(id) => {
              const u = users.find((x) => x.id === id);
              if (u) setViewingProfile(u);
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
              const id = crypto.randomUUID();
              const payload = {
                ...data,
                id,
                author_id: profile.id,
                author_name: profile.full_name,
                author_serial: profile.serial_id,
                created_at: new Date().toISOString(),
              };
              const { error } = await supabase.from("articles").insert(payload);
              if (!error) {
                toast.success("Intel Synchronized");
                fetchArticles();
                handleNavigate("home");
              } else toast.error("Sync Error");
            }}
          />
        )}

        {currentPage === "profile" && profile && (
          <ProfilePage
            profile={viewingProfile || profile}
            onLogout={handleLogout}
            onUpdatePrivacy={() => {}}
            isLoggedIn={isLoggedIn}
            onSendChatRequest={handleSendChatRequest}
            isExternal={!!viewingProfile}
            onCloseExternal={() => setViewingProfile(null)}
          />
        )}

        {currentPage === "network" && (
          <NetworkPage
            users={users}
            onViewProfile={(u) => {
              setViewingProfile(u);
              setCurrentPage("profile");
            }}
            onChat={(u) => handleSendChatRequest(u.id, u.full_name)}
          />
        )}

        {currentPage === "support" && <SupportPage />}

        {currentPage === "admin" && profile?.role === "admin" && (
          <AdminPage
            articles={articles}
            users={users}
            onDeleteArticle={handleDeleteArticle}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </div>

      <TrendingTicker />
      <Footer nodeCount={nodeCount} onNavigate={handleNavigate} />

      {showAuth === "login" && (
        <div className="fixed inset-0 z-[500] animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            onClick={() => setShowAuth(null)}
          />
          <div className="relative h-full flex items-center justify-center p-6">
            <LoginPage
              onBack={() => setShowAuth(null)}
              onSuccess={handleAuthSuccess}
              onGoToRegister={() => setShowAuth("register")}
            />
          </div>
        </div>
      )}

      {showAuth === "register" && (
        <div className="fixed inset-0 z-[500] animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            onClick={() => setShowAuth(null)}
          />
          <div className="relative h-full flex items-center justify-center p-6">
            <RegisterPage
              onBack={() => setShowAuth(null)}
              onSuccess={handleAuthSuccess}
              onGoToLogin={() => setShowAuth("login")}
            />
          </div>
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
