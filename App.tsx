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

  useEffect(() => {
    if (!profile?.id) return;

    const inboxChannel = supabase.channel(`inbox_${profile.id}`);
    inboxChannel
      .on("broadcast", { event: "handshake" }, (p) => {
        const req = p.payload as ChatRequest;
        setChatRequests((prev) =>
          prev.some((r) => r.id === req.id) ? prev : [...prev, req]
        );
        toast(`New Link Request: ${req.fromName}`, { icon: "📡" });
      })
      .subscribe();

    const notifyChannel = supabase.channel(`notify_${profile.id}`);
    notifyChannel
      .on("broadcast", { event: "new_message" }, (p) => {
        const msg = p.payload as LiveMessage & { senderProfile: Profile };
        if (activeChatIdRef.current !== msg.senderId) {
          toast(
            `Message from ${msg.senderName}: "${msg.text.substring(0, 20)}..."`,
            {
              icon: "💬",
              duration: 4000,
              onClick: () => {
                setActiveChat(msg.senderProfile);
                setChatMessages((prev) => [...prev, msg]);
              },
            } as any
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(inboxChannel);
      supabase.removeChannel(notifyChannel);
    };
  }, [profile?.id, users]);

  useEffect(() => {
    if (!profile?.id || !activeChat?.id) return;

    const ids = [profile.id, activeChat.id].sort();
    const roomName = `room_${ids[0]}_${ids[1]}`;

    const chatChannel = supabase.channel(roomName, {
      config: { broadcast: { self: false } },
    });

    chatChannel
      .on("broadcast", { event: "message" }, (p) => {
        const msg = p.payload as LiveMessage;
        setChatMessages((prev) => [...prev, msg]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [profile?.id, activeChat?.id]);

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
      supabase.channel(roomName).send({
        type: "broadcast",
        event: "message",
        payload: message,
      });

      supabase.channel(`notify_${activeChat.id}`).subscribe((status) => {
        if (status === "SUBSCRIBED") {
          supabase.channel(`notify_${activeChat.id}`).send({
            type: "broadcast",
            event: "new_message",
            payload: { ...message, senderProfile: profile },
          });
        }
      });
    },
    [profile, activeChat]
  );

  const handleSendChatRequest = useCallback(
    (tid: string, tname: string) => {
      if (!profile) {
        toast.error("Please login first");
        return;
      }
      const req: ChatRequest = {
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
            .send({ type: "broadcast", event: "handshake", payload: req });
          toast.success(`Signal sent to ${tname}`);
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
        toast.success("Connection Active");
      }
    },
    [users]
  );

  const handleNavigate = (page: string) => {
    setViewingProfile(null);
    setSearchQuery("");
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleAuthSuccess = async (user: any) => {
    setIsLoggedIn(true);
    setShowAuth(null);
    const { data: prof } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .maybeSingle();
    if (!prof) setNeedsOnboarding(true);
    else setProfile(prof);
    fetchArticles();
    fetchUsers();
  };

  const displayedArticles = useMemo(() => {
    if (!searchQuery) return articles;
    return articles.filter((a) =>
      a.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  if (needsOnboarding) {
    return (
      <SetupProfilePage
        onComplete={async (p) => {
          const {
            data: { session },
          } = await (supabase.auth as any).getSession();
          if (session?.user) {
            const finalP = { ...p, id: session.user.id };
            await supabase.from("profiles").upsert(finalP);
            setProfile(finalP);
            setNeedsOnboarding(false);
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
        onAcceptRequest={handleAcceptChat}
      />

      <div className="pt-24 md:pt-32">
        {["home", "all-posts"].includes(currentPage) && (
          <HomePage
            articles={displayedArticles}
            isLoggedIn={isLoggedIn}
            onLogin={() => setShowAuth("login")}
            userRole={profile?.role || "user"}
            onDelete={fetchArticles}
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
              const payload = {
                ...data,
                author_id: profile.id,
                author_name: profile.full_name,
                author_serial: profile.serial_id,
              };
              const { error } = await supabase.from("articles").insert(payload);
              if (!error) {
                toast.success("Sync Successful");
                fetchArticles();
                handleNavigate("home");
              }
            }}
          />
        )}
        {currentPage === "profile" && profile && (
          <ProfilePage
            profile={viewingProfile || profile}
            onLogout={() => {
              (supabase.auth as any).signOut();
              setIsLoggedIn(false);
              setProfile(null);
              handleNavigate("home");
            }}
            onUpdatePrivacy={() => {}}
            isLoggedIn={isLoggedIn}
            onSendChatRequest={handleSendChatRequest}
            isExternal={!!viewingProfile}
            onCloseExternal={() => setViewingProfile(null)}
            currentUserId={profile.id}
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
            onDeleteArticle={fetchArticles}
            onDeleteUser={fetchUsers}
          />
        )}
      </div>

      <TrendingTicker />
      <Footer nodeCount={nodeCount} onNavigate={handleNavigate} />

      {showAuth && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            onClick={() => setShowAuth(null)}
          />
          {showAuth === "login" ? (
            <LoginPage
              onBack={() => setShowAuth(null)}
              onSuccess={handleAuthSuccess}
              onGoToRegister={() => setShowAuth("register")}
            />
          ) : (
            <RegisterPage
              onBack={() => setShowAuth(null)}
              onSuccess={handleAuthSuccess}
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
