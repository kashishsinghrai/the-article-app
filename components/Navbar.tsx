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

  const isAiActive =
    !!process.env.API_KEY && process.env.API_KEY !== "undefined";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      setSearchValue("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-5">
      <div className="max-w-7xl mx-auto glass rounded-full px-8 py-3.5 flex items-center justify-between shadow-2xl transition-all duration-500 relative ring-1 ring-black/5 dark:ring-white/5">
        <div
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          onClick={() => onNavigate("home")}
        >
          <div className="bg-blue-600 p-2.5 rounded-xl text-white group-hover:rotate-[360deg] transition-all duration-700 shadow-lg shadow-blue-600/20">
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="hidden sm:inline text-xl font-black tracking-[-0.05em] text-slate-900 dark:text-white uppercase transition-colors">
              ThE-ARTICLES
            </span>
            <div className="flex items-center gap-1.5 mt-[-2px]">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isAiActive
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
              />
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                NETWORK: {isAiActive ? "VERIFIED" : "SYNCING"}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 mx-6">
          <NavItem
            label="Intel"
            active={currentPage === "home"}
            onClick={() => onNavigate("home")}
          />
          <NavItem
            label="Wire"
            active={currentPage === "all-posts" || currentPage === "search"}
            onClick={() => onNavigate("all-posts")}
          />
          <NavItem
            label="Network"
            active={currentPage === "network"}
            onClick={() => onNavigate("network")}
          />
          {isLoggedIn && (
            <NavItem
              label="Publish"
              active={currentPage === "post"}
              onClick={() => onNavigate("post")}
            />
          )}
        </div>

        <div className="flex items-center gap-4 flex-grow justify-end max-w-lg">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-grow max-w-[160px] group hidden sm:block"
          >
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="SEARCH..."
              className="w-full bg-slate-100/50 dark:bg-slate-800/40 border border-transparent focus:border-blue-200 dark:focus:border-blue-600/50 focus:bg-white dark:focus:bg-slate-900 rounded-full py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 transition-all outline-none dark:text-white"
            />
          </form>

          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setShowRequests(!showRequests)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm relative ${
                  chatRequests.length > 0
                    ? "bg-blue-600 text-white animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <MessageSquare size={16} />
              </button>
            </div>
          )}

          <button
            onClick={onToggleDarkMode}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all shadow-sm"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => onNavigate("profile")}
              className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all shadow-sm ${
                currentPage === "profile"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <User size={18} />
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-blue-600 transition-all shadow-lg"
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
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

export default Navbar;
