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
  Newspaper,
  PenSquare,
  Users,
  HelpCircle,
  LogIn,
  LayoutDashboard,
  Sliders,
  Zap,
  Smartphone,
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

  const navTo = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] px-3 py-3 md:px-6 md:py-6">
        <div className="relative flex items-center justify-between px-5 py-3 mx-auto transition-all duration-300 border shadow-2xl max-w-7xl glass rounded-2xl md:rounded-full md:px-10 md:py-4 border-slate-200 dark:border-white/10">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navTo("home")}
          >
            <div className="bg-blue-600 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/30">
              <Shield size={20} strokeWidth={3} />
            </div>
            <span className="text-lg italic font-black tracking-tighter uppercase md:text-2xl text-slate-900 dark:text-white">
              ThE-ARTICLES
            </span>
          </div>

          {/* Desktop Navigation - Simple Labels */}
          <div className="items-center hidden gap-8 lg:flex">
            <NavItem
              icon={<Newspaper size={16} />}
              label="Home"
              active={currentPage === "home"}
              onClick={() => navTo("home")}
            />
            <NavItem
              icon={<Users size={16} />}
              label="Reporters"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <NavItem
                icon={<PenSquare size={16} />}
                label="Write News"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            <NavItem
              icon={<HelpCircle size={16} />}
              label="Help"
              active={currentPage === "support"}
              onClick={() => navTo("support")}
            />

            {isLoggedIn && userRole === "admin" && (
              <button
                onClick={() => navTo("admin")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                  currentPage === "admin"
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white"
                }`}
              >
                <LayoutDashboard size={14} /> Admin
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {isLoggedIn && (
              <button
                onClick={() => setShowRequests(!showRequests)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  chatRequests.length > 0
                    ? "bg-blue-600 text-white animate-pulse shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <MessageSquare size={18} />
              </button>
            )}

            <button
              onClick={onToggleDarkMode}
              className="flex items-center justify-center w-10 h-10 transition-all rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => navTo("profile")}
                className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                  currentPage === "profile"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                }`}
              >
                <User size={20} />
                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 shadow-sm" />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="hidden sm:flex px-6 py-2.5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 transition-all items-center gap-2 shadow-xl shadow-blue-600/20"
              >
                <LogIn size={14} /> LOGIN
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 transition-transform rounded-full lg:hidden text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 active:scale-95"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Message Requests - Simple Label */}
      {showRequests && isLoggedIn && (
        <div className="fixed top-[100px] right-4 md:right-10 w-80 glass dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4 animate-in fade-in slide-in-from-top-4 z-[200]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
              New Message Requests
            </span>
            <button
              onClick={() => setShowRequests(false)}
              className="transition-colors text-slate-400 hover:text-red-500"
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-60 custom-scrollbar">
            {chatRequests.length === 0 ? (
              <p className="text-[10px] text-center font-bold text-slate-400 py-6">
                No new requests
              </p>
            ) : (
              chatRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-4 transition-all border border-transparent bg-slate-50 dark:bg-white/5 rounded-2xl hover:border-blue-500/20"
                >
                  <span className="text-xs font-black truncate text-slate-900 dark:text-white">
                    {req.fromName}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onAcceptRequest?.(req);
                        setShowRequests(false);
                      }}
                      className="p-2 text-white transition-all rounded-lg shadow-md bg-emerald-500 hover:scale-105"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setShowRequests(false)}
                      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu - Simple Labels */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 p-8 flex flex-col gap-10 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b dark:border-white/5">
            <span className="text-2xl italic font-black tracking-tighter uppercase dark:text-white">
              Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 dark:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <MobileNavItem
              icon={<Newspaper size={20} />}
              label="Home"
              active={currentPage === "home"}
              onClick={() => navTo("home")}
            />
            <MobileNavItem
              icon={<Users size={20} />}
              label="Reporters"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <MobileNavItem
                icon={<PenSquare size={20} />}
                label="Write News"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            <MobileNavItem
              icon={<User size={20} />}
              label="My Profile"
              active={currentPage === "profile"}
              onClick={() => navTo("profile")}
            />
            <MobileNavItem
              icon={<HelpCircle size={20} />}
              label="Help & Support"
              active={currentPage === "support"}
              onClick={() => navTo("support")}
            />
          </div>

          {!isLoggedIn && (
            <button
              onClick={() => {
                onLogin();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-5 mt-auto font-black tracking-widest text-white uppercase bg-blue-600 shadow-2xl rounded-2xl"
            >
              Establish Account
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-widest transition-all relative py-1 ${
      active
        ? "text-blue-600"
        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {icon}
    {label}
    {active && (
      <span className="absolute left-0 right-0 h-1 bg-blue-600 rounded-full -bottom-2" />
    )}
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-5 p-5 rounded-[1.5rem] transition-all border ${
      active
        ? "bg-blue-600 text-white border-blue-500 shadow-xl"
        : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-transparent"
    }`}
  >
    {icon}
    <span className="text-sm font-black tracking-widest uppercase">
      {label}
    </span>
  </button>
);

export default Navbar;
