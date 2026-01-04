import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import TrendingTicker from "./components/TrendingTicker.tsx";
import ChatOverlay from "./components/ChatOverlay.tsx";
import ArticleDetail from "./components/ArticleDetail.tsx";
import HomePage from "./app/page.tsx";
import PostPage from "./app/post/page.tsx";
import ProfilePage from "./app/profile/page.tsx";
import AdminPage from "./app/admin/page.tsx";
import SupportPage from "./app/support/page.tsx";
import NetworkPage from "./app/network/page.tsx";
import LoginPage from "./app/auth/login.tsx";
import RegisterPage from "./app/auth/register.tsx";
import SetupProfilePage from "./app/setup-profile/page.tsx";
import { Profile, Article, ChatRequest } from "./types.ts";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./lib/supabase.ts";
import { useStore } from "./lib/store.ts";
import { Loader2 } from "lucide-react";

const App: React.FC = () => {
  const profile = useStore((s) => s.profile);
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const articles = useStore((s) => s.articles);
  const users = useStore((s) => s.users);
  const chatRequests = useStore((s) => s.chatRequests);
  const isInitialized = useStore((s) => s.isInitialized);

  const hydrate = useStore((s) => s.hydrate);
  const logout = useStore((s) => s.logout);
  const syncAll = useStore((s) => s.syncAll);
  const initAuthListener = useStore((s) => s.initAuthListener);

  const [currentPage, setCurrentPage] = useState("home");
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Profile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Chat specific state
  const [activeChat, setActiveChat] = useState<{
    profile: Profile;
    handshakeId: string;
  } | null>(null);

  useEffect(() => {
    hydrate();
    const unsub = initAuthListener();
    return () => {
      if (unsub) unsub();
    };
  }, [hydrate, initAuthListener]);

  // Global Signal Monitor for Handshake Acceptance
  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel("handshake_sync")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_requests",
          filter: `from_id=eq.${profile.id}`,
        },
        (payload) => {
          const updatedReq = payload.new as ChatRequest;
          if (updatedReq.status === "accepted") {
            const targetNode = users.find((u) => u.id === updatedReq.to_id);
            if (targetNode) {
              toast.success(`Node ${targetNode.serial_id} Handshake Accepted`, {
                duration: 4000,
              });
              setActiveChat({
                profile: targetNode,
                handshakeId: updatedReq.id,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [profile, users]);

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
      toast.success("Signal Established.");
      const senderProfile = users.find((u) => u.id === req.from_id);
      if (senderProfile)
        setActiveChat({ profile: senderProfile, handshakeId: req.id });
      hydrate();
    } else {
      toast.error("Handshake failure.");
    }
  };

  const handleInitiateHandshake = async (targetProfile: Profile) => {
    if (!profile) return toast.error("Identity required.");

    const { data: existing } = await supabase
      .from("chat_requests")
      .select("*")
      .or(
        `and(from_id.eq.${profile.id},to_id.eq.${targetProfile.id}),and(from_id.eq.${targetProfile.id},to_id.eq.${profile.id})`
      )
      .maybeSingle();

    if (existing) {
      if (existing.status === "accepted") {
        setActiveChat({ profile: targetProfile, handshakeId: existing.id });
      } else {
        toast.error("Handshake pending node validation.");
      }
      return;
    }

    const { error } = await supabase.from("chat_requests").insert({
      from_id: profile.id,
      to_id: targetProfile.id,
      status: "pending",
    });

    if (!error) toast.success("Handshake dispatched.");
    else toast.error("Transmission blocked.");
  };

  const handleLogoutProtocol = async () => {
    await logout();
    setCurrentPage("home");
    setViewingProfile(null);
    setActiveChat(null);
    toast.success("Identity Disconnected.");
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            Syncing Global Core...
          </p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPage === "support")
      return <SupportPage onBack={() => setCurrentPage("home")} />;
    if (
      isLoggedIn &&
      (!profile || !profile.full_name) &&
      currentPage !== "support"
    ) {
      return (
        <SetupProfilePage
          onComplete={async () => {
            await hydrate();
            setCurrentPage("home");
          }}
        />
      );
    }

    switch (currentPage) {
      case "home":
        return (
          <HomePage
            articles={articles}
            isLoggedIn={isLoggedIn}
            onLogin={() => setShowAuth("login")}
            onReadArticle={setActiveArticle}
            onRefresh={syncAll}
          />
        );
      case "network":
        return (
          <NetworkPage
            onBack={() => setCurrentPage("home")}
            users={users}
            currentUserId={profile?.id}
            onViewProfile={(u) => {
              setViewingProfile(u);
              setCurrentPage("profile");
            }}
            onChat={handleInitiateHandshake}
            onRefresh={syncAll}
          />
        );
      case "post":
        return isLoggedIn ? (
          <PostPage
            profile={profile}
            onBack={() => setCurrentPage("home")}
            onPublish={async (d) => {
              if (!profile) return;
              const { error } = await supabase
                .from("articles")
                .insert({
                  ...d,
                  author_id: profile.id,
                  author_name: profile.full_name,
                  author_serial: profile.serial_id,
                });
              if (error) {
                toast.error("Transmission failed.");
                return;
              }
              await syncAll();
              setCurrentPage("home");
              toast.success("Intelligence Transmitted.");
            }}
          />
        ) : (
          <HomePage
            articles={articles}
            isLoggedIn={isLoggedIn}
            onLogin={() => setShowAuth("login")}
            onReadArticle={setActiveArticle}
            onRefresh={syncAll}
          />
        );
      case "profile":
        const profileToDisplay = viewingProfile || profile;
        if (!profileToDisplay && isLoggedIn)
          return (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="text-blue-600 animate-spin" size={32} />
            </div>
          );
        return profileToDisplay ? (
          <ProfilePage
            profile={profileToDisplay}
            onLogout={handleLogoutProtocol}
            isExternal={!!viewingProfile}
            onCloseExternal={() => {
              const prev = viewingProfile ? "network" : "home";
              setViewingProfile(null);
              setCurrentPage(prev);
            }}
            isLoggedIn={isLoggedIn}
            currentUserId={profile?.id}
            onUpdateProfile={async (d) => {
              if (!profile) return;
              const { error } = await supabase
                .from("profiles")
                .update(d)
                .eq("id", profile.id);
              if (!error) {
                toast.success("Identity Synced.");
                await hydrate();
              }
            }}
            onChat={handleInitiateHandshake}
          />
        ) : null;
      case "admin":
        return profile?.role === "admin" ? (
          <AdminPage
            articles={articles}
            users={users}
            currentUserId={profile.id}
            onUpdateArticles={syncAll}
            onUpdateUsers={syncAll}
            onLogout={handleLogoutProtocol}
          />
        ) : (
          <HomePage
            articles={articles}
            isLoggedIn={isLoggedIn}
            onLogin={() => setShowAuth("login")}
            onReadArticle={setActiveArticle}
            onRefresh={syncAll}
          />
        );
      default:
        return (
          <HomePage
            articles={articles}
            isLoggedIn={isLoggedIn}
            onLogin={() => setShowAuth("login")}
            onReadArticle={setActiveArticle}
            onRefresh={syncAll}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen selection:bg-blue-600 selection:text-white ${
        isDarkMode ? "dark bg-slate-950" : "bg-slate-50 text-slate-900"
      }`}
    >
      <Toaster position="bottom-center" />
      {showAuth === "login" && (
        <LoginPage
          onBack={() => setShowAuth(null)}
          onSuccess={() => {
            setShowAuth(null);
            hydrate();
          }}
          onGoToRegister={() => setShowAuth("register")}
        />
      )}
      {showAuth === "register" && (
        <RegisterPage
          onBack={() => setShowAuth(null)}
          onSuccess={() => {
            setShowAuth(null);
            hydrate();
          }}
          onGoToLogin={() => setShowAuth("login")}
        />
      )}
      {!showAuth && (
        <>
          <Navbar
            onNavigate={(p) => {
              if (p !== "profile") setViewingProfile(null);
              setCurrentPage(p);
            }}
            onLogin={() => setShowAuth("login")}
            onLogout={handleLogoutProtocol}
            currentPage={currentPage}
            isLoggedIn={isLoggedIn}
            userRole={profile?.role || "user"}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            chatRequests={chatRequests}
            onAcceptRequest={handleAcceptRequest}
            profileAvatar={profile?.avatar_url}
          />
          <div className="min-h-screen pt-12 md:pt-24">{renderPage()}</div>
          {activeArticle && (
            <ArticleDetail
              article={activeArticle}
              onClose={() => setActiveArticle(null)}
              isLoggedIn={isLoggedIn}
              currentUserId={profile?.id}
              currentUserProfile={profile}
              onUpdateArticles={syncAll}
            />
          )}
          {activeChat && (
            <ChatOverlay
              recipient={activeChat.profile}
              currentUserId={profile?.id || ""}
              handshakeId={activeChat.handshakeId}
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
