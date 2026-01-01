import React, { useState, useRef, useEffect } from "react";
import {
  Shield,
  User,
  Sun,
  Moon,
  X,
  Menu,
  Bell,
  MessageSquare,
  Zap,
  ShieldAlert,
  Check,
  ChevronRight,
} from "lucide-react";
import { ChatRequest, Profile } from "../types";

interface NavbarProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
  onSearch?: (query: string) => void;
  currentPage: string;
  isLoggedIn: boolean;
  userRole: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  chatRequests: ChatRequest[];
  onAcceptRequest: (req: ChatRequest) => Promise<void>;
  adminIntercepts?: any[];
}

const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onLogin,
  onSearch,
  currentPage,
  isLoggedIn,
  userRole,
  isDarkMode,
  onToggleDarkMode,
  chatRequests,
  onAcceptRequest,
  adminIntercepts = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const inboxRef = useRef<HTMLDivElement>(null);

  const isAdmin = userRole === "admin";
  const notificationCount =
    chatRequests.length + (isAdmin ? adminIntercepts.length : 0);

  const navTo = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setIsInboxOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inboxRef.current &&
        !inboxRef.current.contains(event.target as Node)
      ) {
        setIsInboxOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] p-4 md:p-6 pointer-events-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 px-6 md:px-8 py-3.5 rounded-2xl shadow-sm transition-all">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navTo("home")}
          >
            <Shield size={18} className="text-slate-950 dark:text-white" />
            <span className="hidden xs:block text-[11px] font-black uppercase tracking-[0.2em] dark:text-white italic">
              ThE-ARTICLES
            </span>
          </div>

          <div className="items-center hidden gap-10 lg:flex">
            <NavItem
              label="Explore"
              active={currentPage === "home"}
              onClick={() => navTo("home")}
            />
            <NavItem
              label="Network"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <NavItem
                label="Publish"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            {isLoggedIn && isAdmin && (
              <NavItem
                label="Terminal"
                active={currentPage === "admin"}
                onClick={() => navTo("admin")}
              />
            )}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={onToggleDarkMode}
              className="transition-colors text-slate-400 hover:text-slate-950 dark:hover:text-white"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isLoggedIn && (
              <div className="relative" ref={inboxRef}>
                <button
                  onClick={() => setIsInboxOpen(!isInboxOpen)}
                  className={`relative p-2 rounded-xl transition-all ${
                    isInboxOpen
                      ? "bg-slate-100 dark:bg-slate-900 text-blue-600"
                      : "text-slate-400 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Responsive Inbox Dropdown */}
                {isInboxOpen && (
                  <div className="absolute right-[-20px] sm:right-0 mt-4 w-[calc(100vw-2rem)] sm:w-[380px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[200]">
                    <div className="flex items-center justify-between p-5 border-b border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Operational Inbox
                      </h4>
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
                        {notificationCount} Signals
                      </span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notificationCount === 0 ? (
                        <div className="p-12 space-y-3 text-center opacity-30">
                          <Zap size={24} className="mx-auto" />
                          <p className="text-[9px] font-black uppercase tracking-widest">
                            No active signals
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50 dark:divide-white/5">
                          {chatRequests.map((req) => (
                            <div
                              key={req.id}
                              className="p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/50 group"
                            >
                              <div className="flex gap-4">
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-blue-600 rounded-full bg-blue-600/10">
                                  <MessageSquare size={16} />
                                </div>
                                <div className="flex-grow space-y-1 overflow-hidden">
                                  <p className="text-[11px] font-black uppercase text-slate-900 dark:text-white">
                                    Handshake Request
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-medium truncate">
                                    Node:{" "}
                                    <span className="italic font-bold text-slate-700 dark:text-slate-300">
                                      {req.fromName}
                                    </span>
                                  </p>
                                  <div className="flex gap-2 pt-2">
                                    <button
                                      onClick={() => {
                                        onAcceptRequest(req);
                                        setIsInboxOpen(false);
                                      }}
                                      className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5"
                                    >
                                      <Check size={10} /> Accept
                                    </button>
                                    <button className="flex-1 border border-slate-100 dark:border-slate-800 text-slate-400 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
                                      Ignore
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {isAdmin &&
                            adminIntercepts.map((intercept, idx) => (
                              <div
                                key={`intercept-${idx}`}
                                className="p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/50 bg-red-50/10 dark:bg-red-900/5"
                              >
                                <div className="flex gap-4">
                                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-red-600 rounded-full bg-red-600/10">
                                    <ShieldAlert size={16} />
                                  </div>
                                  <div className="flex-grow space-y-1 overflow-hidden">
                                    <p className="text-[11px] font-black uppercase text-red-600">
                                      Active Intercept
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium truncate">
                                      Signal: {intercept.node1} ↔{" "}
                                      {intercept.node2}
                                    </p>
                                    <button
                                      onClick={() => navTo("admin")}
                                      className="w-full mt-2 bg-slate-950 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                      Monitor Terminal{" "}
                                      <ChevronRight size={10} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => navTo("profile")}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                  currentPage === "profile"
                    ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white"
                    : "border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                <User size={18} />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-80 transition-all"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-slate-950 dark:text-white"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 p-12 space-y-12 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl italic font-bold tracking-tighter uppercase dark:text-white">
              ThE-ARTICLES
            </span>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} className="dark:text-white" />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <MobileNavItem
              label="Feed"
              active={currentPage === "home"}
              onClick={() => navTo("home")}
            />
            <MobileNavItem
              label="Network"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <MobileNavItem
                label="Publish"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            {isLoggedIn && isAdmin && (
              <MobileNavItem
                label="Terminal"
                active={currentPage === "admin"}
                onClick={() => navTo("admin")}
              />
            )}
            <MobileNavItem
              label="Profile"
              active={currentPage === "profile"}
              onClick={() => navTo("profile")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`text-[10px] font-bold uppercase tracking-widest transition-all relative py-1 ${
      active
        ? "text-slate-950 dark:text-white border-b-2 border-blue-600"
        : "text-slate-400 hover:text-slate-950 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

const MobileNavItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`text-left text-2xl font-bold uppercase tracking-tighter ${
      active ? "text-blue-600" : "text-slate-400 dark:text-slate-600"
    }`}
  >
    {label}
  </button>
);

export default Navbar;
