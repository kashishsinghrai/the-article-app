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
} from "lucide-react";
import { ChatRequest } from "../types";

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

  const navTo = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] px-3 py-2 md:px-6 md:py-5">
        <div className="max-w-7xl mx-auto glass rounded-2xl md:rounded-full px-4 md:px-8 py-2 md:py-3 flex items-center justify-between shadow-xl relative ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300">
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            onClick={() => navTo("home")}
          >
            <div className="bg-blue-600 p-2 md:p-2.5 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/20">
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <span className="text-base md:text-xl font-black tracking-[-0.05em] text-slate-900 dark:text-white uppercase hidden xs:block">
              ThE-ARTICLES
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8 mx-6">
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
                label="File Report"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
          </div>

          <div className="flex items-center gap-1.5 md:gap-4">
            {isLoggedIn && (
              <div className="relative">
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
                {showRequests && (
                  <div className="fixed sm:absolute top-[80px] sm:top-14 left-4 right-4 sm:left-auto sm:right-0 sm:w-80 glass dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/10 p-5 md:p-6 space-y-4 animate-in fade-in slide-in-from-top-4 z-[200]">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Handshake Signals
                      </span>
                      <button
                        onClick={() => setShowRequests(false)}
                        className="text-slate-300 hover:text-red-500 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                      {chatRequests.length === 0 ? (
                        <p className="text-[9px] text-center font-black uppercase tracking-[0.2em] text-slate-300 py-6">
                          No active signals found
                        </p>
                      ) : (
                        chatRequests.map((req) => (
                          <div
                            key={req.id}
                            className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl flex items-center justify-between border border-transparent"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-[10px] font-black">
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
                                className="p-2 bg-blue-600 text-white rounded-lg hover:scale-105 transition-transform"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => setShowRequests(false)}
                                className="p-2 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-lg"
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
              </div>
            )}

            <button
              onClick={onToggleDarkMode}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 transition-transform active:scale-90"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => navTo("profile")}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                  currentPage === "profile"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
                }`}
              >
                <User size={18} />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="hidden sm:block px-5 md:px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-blue-600 transition-all"
              >
                LOGIN
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

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
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-white/5">
            <span className="text-xl font-black uppercase italic tracking-tighter">
              Terminal Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <MobileNavItem
              icon={<Network size={18} />}
              label="The Network"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <MobileNavItem
                icon={<FileText size={18} />}
                label="File Report"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            <MobileNavItem
              icon={<User size={18} />}
              label="My Profile"
              active={currentPage === "profile"}
              onClick={() => navTo("profile")}
            />
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <Globe2 size={16} className="text-blue-600" />
              <select
                onChange={(e) => handleTranslate(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest w-full dark:text-white focus:ring-0"
              >
                <option value="en">English (Global)</option>
                <option value="hi">हिन्दी (India)</option>
                <option value="es">Español</option>
                <option value="bn">বাংলা</option>
              </select>
            </div>
            {!isLoggedIn && (
              <button
                onClick={() => {
                  onLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
              >
                <LogIn size={18} /> Establish Identity
              </button>
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
        : "bg-slate-50 dark:bg-slate-900 text-slate-500 border-transparent hover:text-slate-900"
    }`}
  >
    {icon}
    <span className="text-[11px] font-black uppercase tracking-widest">
      {label}
    </span>
  </button>
);

export default Navbar;
