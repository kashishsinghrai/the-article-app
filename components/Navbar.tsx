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

  const isAiActive =
    !!process.env.API_KEY && process.env.API_KEY !== "undefined";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      setSearchValue("");
      setIsMobileMenuOpen(false);
    }
  };

  const navTo = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] px-4 py-4 md:px-6 md:py-5">
      <div className="max-w-7xl mx-auto glass rounded-full px-4 md:px-8 py-3 flex items-center justify-between shadow-2xl relative ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 md:gap-3 cursor-pointer group flex-shrink-0"
          onClick={() => navTo("home")}
        >
          <div className="bg-blue-600 p-2 md:p-2.5 rounded-xl text-white group-hover:rotate-[360deg] transition-all duration-700 shadow-lg shadow-blue-600/20">
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-xl font-black tracking-[-0.05em] text-slate-900 dark:text-white uppercase transition-colors">
              ThE-ARTICLES
            </span>
            <div className="flex items-center gap-1 mt-[-2px]">
              <div
                className={`w-1 h-1 rounded-full ${
                  isAiActive
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : "bg-slate-300"
                }`}
              />
              <span className="text-[6px] font-black uppercase tracking-[0.2em] text-slate-400">
                {isAiActive ? "VERIFIED" : "SYNC"}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 mx-6">
          <NavItem
            label="Intel"
            active={currentPage === "home"}
            onClick={() => navTo("home")}
          />
          <NavItem
            label="Wire"
            active={currentPage === "all-posts"}
            onClick={() => navTo("all-posts")}
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
          {isLoggedIn && userRole === "admin" && (
            <button
              onClick={() => navTo("admin")}
              className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                currentPage === "admin"
                  ? "text-red-500"
                  : "text-slate-400 hover:text-red-500"
              }`}
            >
              <Lock size={12} /> Terminal
            </button>
          )}
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search (Desktop Only Inline) */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden xl:block w-40"
          >
            <Search
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="SEARCH..."
              className="w-full bg-slate-100 dark:bg-slate-800/40 rounded-full py-2 pl-9 pr-4 text-[9px] font-black uppercase tracking-widest outline-none dark:text-white"
            />
          </form>

          {/* Inbox Dropdown */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowRequests(!showRequests);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all relative ${
                  chatRequests.length > 0
                    ? "bg-blue-600 text-white animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
                }`}
              >
                <MessageSquare size={16} />
                {chatRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {chatRequests.length}
                  </span>
                )}
              </button>

              {showRequests && (
                <div className="absolute top-14 right-0 w-72 md:w-80 glass dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/10 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center border-b border-slate-50 dark:border-white/5 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Inbound Links
                    </span>
                    <button
                      onClick={() => setShowRequests(false)}
                      className="text-slate-300 hover:text-slate-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {chatRequests.length === 0 ? (
                      <div className="py-8 text-center opacity-20">
                        <MessageSquare size={24} className="mx-auto mb-2" />
                        <p className="text-[9px] font-black uppercase tracking-widest">
                          No Active Handshakes
                        </p>
                      </div>
                    ) : (
                      chatRequests.map((req) => (
                        <div
                          key={req.id}
                          className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-blue-100 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 font-black text-[10px]">
                              {req.fromName[0]}
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate w-24">
                                {req.fromName}
                              </p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                Wants to link
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                onAcceptRequest?.(req);
                                setShowRequests(false);
                              }}
                              className="w-7 h-7 bg-emerald-500 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Check size={14} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() => setShowRequests(false)}
                              className="w-7 h-7 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-lg flex items-center justify-center"
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

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User / Login */}
          {isLoggedIn ? (
            <button
              onClick={() => navTo("profile")}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
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
              className="px-4 md:px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-blue-600 transition-all shadow-lg"
            >
              LOGIN
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-900 dark:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-24 left-4 right-4 glass dark:bg-slate-950 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/10 p-8 flex flex-col gap-6 animate-in slide-in-from-top-8 duration-500">
          <div className="flex flex-col gap-4">
            <MobileNavItem
              label="Intelligence"
              active={currentPage === "home"}
              onClick={() => navTo("home")}
            />
            <MobileNavItem
              label="Global Wire"
              active={currentPage === "all-posts"}
              onClick={() => navTo("all-posts")}
            />
            <MobileNavItem
              label="Correspondents"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <MobileNavItem
                label="File Report"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            {isLoggedIn && userRole === "admin" && (
              <MobileNavItem
                label="Admin Terminal"
                active={currentPage === "admin"}
                onClick={() => navTo("admin")}
                color="text-red-500"
              />
            )}
          </div>

          <div className="pt-6 border-t border-slate-50 dark:border-white/5">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="SEARCH DATABASE..."
                className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none dark:text-white border border-transparent focus:border-blue-600"
              />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
      active
        ? "text-blue-600 dark:text-blue-400"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

const MobileNavItem = ({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) => (
  <button
    onClick={onClick}
    className={`text-2xl font-black uppercase italic tracking-tighter text-left transition-all ${
      active ? color || "text-blue-600" : "text-slate-400 dark:text-slate-600"
    }`}
  >
    {label}
  </button>
);

export default Navbar;
