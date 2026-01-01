import React, { useState } from "react";
import {
  Shield,
  User,
  Sun,
  Moon,
  MessageSquare,
  Check,
  X,
  Menu,
  Globe2,
  FileText,
  Network,
  LogIn,
  TrendingUp,
  Info,
  LayoutDashboard,
  Sliders,
  Zap,
  Smartphone,
  Download,
} from "lucide-react";
import { ChatRequest } from "../types";
import { toast } from "react-hot-toast";

interface NavbarProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
  onSearch: (query: string) => void;
  currentPage: string;
  isLoggedIn: boolean;
  userRole: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  chatRequests?: ChatRequest[];
  onAcceptRequest?: (req: ChatRequest) => void;
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
  chatRequests = [],
  onAcceptRequest,
}) => {
  const [showRequests, setShowRequests] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTranslate = (lang: string) => {
    const googleCombo = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;
    if (googleCombo) {
      googleCombo.value = lang;
      googleCombo.dispatchEvent(new Event("change"));
    }
  };

  const notifyAppStatus = () => {
    toast(
      "Android Terminal: Project in Beta Development. APK release expected in Phase 2.",
      {
        icon: "📱",
        style: {
          borderRadius: "20px",
          background: "#0f172a",
          color: "#fff",
          fontSize: "10px",
          fontWeight: "900",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        },
      }
    );
  };

  const navTo = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] px-3 py-2 md:px-6 md:py-5">
        <div className="relative flex items-center justify-between px-4 py-2 mx-auto transition-all duration-300 shadow-xl max-w-7xl glass rounded-2xl md:rounded-full md:px-8 md:py-3 ring-1 ring-black/5 dark:ring-white/5">
          <div
            className="flex items-center gap-2 cursor-pointer md:gap-3 group"
            onClick={() => navTo("home")}
          >
            <div className="bg-blue-600 p-2 md:p-2.5 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/20">
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <span className="text-[14px] xs:text-base md:text-xl font-black tracking-[-0.05em] text-slate-900 dark:text-white uppercase block italic">
              ThE-ARTICLES
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-6 mx-4 lg:flex">
            <NavItem
              label="Wire"
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
                label="Dispatch"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            <NavItem
              label="Terminal"
              active={currentPage === "support"}
              onClick={() => navTo("support")}
            />

            {/* Download Android Feature */}
            <button
              onClick={notifyAppStatus}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <Smartphone size={12} /> Node Mobile
            </button>

            {isLoggedIn && userRole === "admin" && (
              <button
                onClick={() => navTo("admin")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentPage === "admin"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : "bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white"
                }`}
              >
                <LayoutDashboard size={12} /> Authority
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 md:gap-3">
            {isLoggedIn && (
              <div className="flex items-center gap-1 mr-1 md:gap-2">
                <button
                  onClick={() => setShowRequests(!showRequests)}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
                    chatRequests.length > 0
                      ? "bg-blue-600 text-white animate-pulse shadow-lg shadow-blue-600/40"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
                  }`}
                >
                  <MessageSquare size={16} />
                </button>
                <button
                  onClick={() => navTo("profile")}
                  className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center transition-all bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600`}
                >
                  <Sliders size={16} />
                </button>
              </div>
            )}

            <button
              onClick={onToggleDarkMode}
              className="flex items-center justify-center transition-transform rounded-full w-9 h-9 md:w-10 md:h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 active:scale-90"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isLoggedIn ? (
              <div className="relative group">
                <button
                  onClick={() => navTo("profile")}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center relative ${
                    currentPage === "profile"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  }`}
                >
                  <User size={18} />
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="hidden sm:flex px-5 md:px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-blue-600 transition-all items-center gap-2 shadow-lg"
              >
                <Zap size={14} className="fill-current" /> LOGIN
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center transition-transform rounded-full lg:hidden w-9 h-9 md:w-10 md:h-10 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 active:scale-90"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Handshake Acceptance Overlay */}
      {showRequests && isLoggedIn && (
        <div className="fixed top-[85px] right-4 md:right-10 w-80 glass dark:bg-slate-950 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/10 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 z-[200]">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Handshake Signals
            </span>
            <button
              onClick={() => setShowRequests(false)}
              className="p-1 transition-colors text-slate-300 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
          <div className="pr-1 space-y-3 overflow-y-auto max-h-60 custom-scrollbar">
            {chatRequests.length === 0 ? (
              <p className="text-[9px] text-center font-black uppercase tracking-[0.2em] text-slate-300 py-6">
                No signals detected
              </p>
            ) : (
              chatRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 transition-all border border-transparent bg-slate-50 dark:bg-white/5 rounded-2xl hover:border-blue-500/20"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-[10px] font-black uppercase">
                      {req.fromName[0]}
                    </div>
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">
                      {req.fromName}
                    </span>
                  </div>
                  <div className="flex gap-1.5 ml-2">
                    <button
                      onClick={() => {
                        onAcceptRequest?.(req);
                        setShowRequests(false);
                      }}
                      className="p-2 text-white transition-all rounded-lg shadow-md bg-emerald-500 hover:scale-110 active:scale-90"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => {
                        // Filter out manually if needed
                        setShowRequests(false);
                      }}
                      className="p-2 transition-colors rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 p-6 flex flex-col gap-8 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-blue-600" />
              <span className="text-xl italic font-black tracking-tighter uppercase">
                Terminal
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-2 pr-2 overflow-y-auto custom-scrollbar">
            <MobileNavItem
              icon={<TrendingUp size={18} />}
              label="Wire Feed"
              active={currentPage === "home"}
              onClick={() => navTo("home")}
            />
            <MobileNavItem
              icon={<Network size={18} />}
              label="The Network"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <MobileNavItem
                icon={<FileText size={18} />}
                label="File Dispatch"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            <MobileNavItem
              icon={<User size={18} />}
              label="My Identity"
              active={currentPage === "profile"}
              onClick={() => navTo("profile")}
            />

            {/* Mobile App Download Link */}
            <MobileNavItem
              icon={<Download size={18} className="text-blue-600" />}
              label="Download App"
              active={false}
              onClick={() => {
                notifyAppStatus();
                setIsMobileMenuOpen(false);
              }}
            />

            <MobileNavItem
              icon={<Info size={18} />}
              label="Support Node"
              active={currentPage === "support"}
              onClick={() => navTo("support")}
            />
            {isLoggedIn && userRole === "admin" && (
              <MobileNavItem
                icon={<LayoutDashboard size={18} />}
                label="Database Authority"
                active={currentPage === "admin"}
                onClick={() => navTo("admin")}
              />
            )}
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-3 p-4 border bg-slate-50 dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-white/5">
              <Globe2 size={16} className="text-blue-600" />
              <select
                onChange={(e) => handleTranslate(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest w-full dark:text-white focus:ring-0"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="es">Español</option>
                <option value="bn">বাংলা</option>
              </select>
            </div>
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  onLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center w-full gap-3 py-4 font-black tracking-widest text-white uppercase bg-blue-600 shadow-xl rounded-2xl"
              >
                Establish Identity
                <LogIn size={18} />
              </button>
            ) : (
              <div className="flex items-center justify-between p-4 border bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border-emerald-100 dark:border-emerald-900/30">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Active Node
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${
      active
        ? "text-blue-600"
        : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {label}
    {active && (
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
    )}
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
      active
        ? "bg-blue-600 text-white border-blue-500 shadow-lg"
        : "bg-slate-50 dark:bg-slate-900 text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className="text-[11px] font-black uppercase tracking-widest">
      {label}
    </span>
  </button>
);

export default Navbar;
