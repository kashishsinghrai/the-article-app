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
  Smartphone,
  LogOut,
  Sliders,
  Globe,
  Cpu,
  Fingerprint,
  Newspaper,
  History,
  Radio,
  Award,
  BookOpen,
} from "lucide-react";
import { ChatRequest, Profile } from "../types";
import { toast } from "react-hot-toast";

interface NavbarProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
  onLogout: () => void;
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
  onLogout,
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
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const inboxRef = useRef<HTMLDivElement>(null);

  const isAdmin = userRole === "admin";
  const notificationCount =
    chatRequests.length + (isAdmin ? adminIntercepts.length : 0);

  const navTo = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setIsInboxOpen(false);
    setHoveredMenu(null);
  };

  const handleDownloadApp = () => {
    toast("Binary Distribution: Mobile launch scheduled for Phase 4.", {
      icon: "📲",
      style: {
        borderRadius: "20px",
        background: "#000",
        color: "#fff",
        fontSize: "10px",
        fontWeight: "900",
        textTransform: "uppercase",
      },
    });
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
      <nav
        className="fixed top-0 left-0 right-0 z-[150] p-4 md:p-6 pointer-events-auto"
        onMouseLeave={() => setHoveredMenu(null)}
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="flex items-center justify-between bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl border border-slate-100 dark:border-slate-800 px-4 md:px-8 py-3.5 rounded-[1.5rem] shadow-2xl transition-all">
            <div
              className="flex items-center gap-2 cursor-pointer md:gap-4 shrink-0"
              onClick={() => navTo("home")}
            >
              <Shield
                size={18}
                className="text-slate-950 dark:text-white shrink-0"
              />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] dark:text-white italic block">
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
                  label="Protocol"
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

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={handleDownloadApp}
                className="items-center hidden gap-2 p-2 transition-all text-slate-400 hover:text-blue-600 xs:flex"
              >
                <Smartphone size={18} />
                <span className="hidden xl:block text-[9px] font-black uppercase tracking-widest">
                  App Download
                </span>
              </button>

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

                  {isInboxOpen && (
                    <div className="fixed left-4 right-4 sm:absolute sm:left-auto sm:right-0 mt-4 sm:w-[380px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[200]">
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
                          <div className="p-12 text-center opacity-30">
                            <Zap size={24} className="mx-auto mb-2" />
                            <p className="text-[9px] font-black uppercase tracking-widest">
                              No active signals
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-50 dark:divide-white/5">
                            {chatRequests.map((req) => (
                              <div
                                key={req.id}
                                className="p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/50"
                              >
                                <div className="flex gap-4">
                                  <div className="flex items-center justify-center w-10 h-10 text-blue-600 rounded-full bg-blue-600/10 shrink-0">
                                    <MessageSquare size={16} />
                                  </div>
                                  <div className="flex-grow space-y-2 overflow-hidden">
                                    <p className="text-[11px] font-black uppercase text-slate-900 dark:text-white">
                                      Handshake Request
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium truncate">
                                      Node:{" "}
                                      <span className="italic font-bold text-slate-700 dark:text-slate-300">
                                        {req.fromName}
                                      </span>
                                    </p>
                                    <button
                                      onClick={() => {
                                        onAcceptRequest(req);
                                        setIsInboxOpen(false);
                                      }}
                                      className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
                                    >
                                      <Check size={10} /> Accept Handshake
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navTo("profile")}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border transition-all ${
                      currentPage === "profile"
                        ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950"
                        : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-950 dark:hover:text-white"
                    }`}
                  >
                    <User size={18} />
                  </button>
                  <button
                    onClick={onLogout}
                    className="hidden p-2 text-red-500 transition-all md:flex hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                    title="Terminate Session"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-80 transition-opacity"
                >
                  Login
                </button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 lg:hidden text-slate-950 dark:text-white"
              >
                <Menu size={22} />
              </button>
            </div>
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
          className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 p-8 space-y-12 flex flex-col ${
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
          <div className="flex flex-col flex-grow gap-8">
            <MobileNavItem
              label="Global Feed"
              active={currentPage === "home"}
              onClick={() => navTo("home")}
            />
            <MobileNavItem
              label="Registry"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <MobileNavItem
                label="New Dispatch"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            {isLoggedIn && isAdmin && (
              <MobileNavItem
                label="Admin Terminal"
                active={currentPage === "admin"}
                onClick={() => navTo("admin")}
              />
            )}
            {isLoggedIn && (
              <MobileNavItem
                label="Identity Control"
                active={currentPage === "profile"}
                onClick={() => navTo("profile")}
              />
            )}
          </div>
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="flex items-center gap-4 pt-10 pb-10 text-xl italic font-black tracking-tighter text-red-600 uppercase border-t border-slate-100 dark:border-white/5"
            >
              <LogOut size={24} /> Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const NavItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-1 ${
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
