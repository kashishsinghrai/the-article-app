import React, { useState } from "react";
import {
  Shield,
  User,
  Search,
  Sun,
  Moon,
  MessageSquare,
  Check,
  X,
  Lock,
  Menu,
  Globe2,
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
  const [searchValue, setSearchValue] = useState("");
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      setSearchValue("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] px-4 py-4 md:px-6 md:py-5">
      <div className="max-w-7xl mx-auto glass rounded-full px-4 md:px-8 py-3 flex items-center justify-between shadow-2xl relative ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate("home")}
        >
          <div className="bg-blue-600 p-2.5 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/20">
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-[-0.05em] text-slate-900 dark:text-white uppercase hidden xs:block">
            ThE-ARTICLES
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8 mx-6">
          <NavItem
            label="Wire"
            active={currentPage === "home"}
            onClick={() => onNavigate("home")}
          />
          <NavItem
            label="Network"
            active={currentPage === "network"}
            onClick={() => onNavigate("network")}
          />
          {isLoggedIn && (
            <NavItem
              label="File Report"
              active={currentPage === "post"}
              onClick={() => onNavigate("post")}
            />
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Global Translation Selector */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700">
            <Globe2 size={12} className="text-blue-600" />
            <select
              onChange={(e) => handleTranslate(e.target.value)}
              className="bg-transparent border-none text-[8px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 cursor-pointer focus:ring-0"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>

          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setShowRequests(!showRequests)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  chatRequests.length > 0
                    ? "bg-blue-600 text-white animate-pulse shadow-lg shadow-blue-600/40"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
                }`}
              >
                <MessageSquare size={16} />
              </button>

              {showRequests && (
                <div className="absolute top-14 right-0 w-80 glass dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/10 p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Incoming Links
                    </span>
                    <button
                      onClick={() => setShowRequests(false)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                    {chatRequests.length === 0 ? (
                      <div className="py-12 text-center">
                        <MessageSquare
                          size={32}
                          className="mx-auto mb-4 opacity-10"
                        />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
                          Secure: No Handshakes
                        </p>
                      </div>
                    ) : (
                      chatRequests.map((req) => (
                        <div
                          key={req.id}
                          className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl flex items-center justify-between border border-transparent hover:border-blue-100 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase shadow-sm">
                              {req.fromName[0]}
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate w-24">
                                {req.fromName}
                              </p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                Active Signal
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onAcceptRequest?.(req)}
                              className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-600/20"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setShowRequests(false)}
                              className="w-8 h-8 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center"
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
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 transition-transform active:scale-90"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => onNavigate("profile")}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentPage === "profile"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <User size={18} />
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-blue-600 transition-all"
            >
              LOGIN
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
      active
        ? "text-blue-600"
        : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default Navbar;
