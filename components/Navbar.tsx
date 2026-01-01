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
  ShieldAlert,
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

  const isAdmin = userRole === "admin";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] px-3 py-3 md:px-6 md:py-6">
        <div className="relative flex items-center justify-between px-5 py-3 mx-auto transition-all duration-300 bg-white border-2 shadow-2xl max-w-7xl glass rounded-2xl md:rounded-full md:px-8 md:py-4 border-slate-900/10 dark:border-white/20 dark:bg-slate-950">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navTo("home")}
          >
            <div className="bg-blue-600 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/30">
              <Shield size={22} strokeWidth={3} />
            </div>
            <span className="text-lg italic font-black tracking-tighter uppercase md:text-xl text-slate-950 dark:text-white">
              ThE-ARTICLES
            </span>
          </div>

          {/* Centered Navigation Items */}
          <div className="items-center hidden gap-8 lg:flex">
            <NavItem
              icon={<Newspaper size={18} strokeWidth={3} />}
              label="Home"
              active={currentPage === "home"}
              onClick={() => navTo("home")}
            />
            <NavItem
              icon={<Users size={18} strokeWidth={3} />}
              label="People"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <NavItem
                icon={<PenSquare size={18} strokeWidth={3} />}
                label="Post"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            {isLoggedIn && isAdmin && (
              <NavItem
                icon={<ShieldAlert size={18} strokeWidth={3} />}
                label="Admin"
                active={currentPage === "admin"}
                onClick={() => navTo("admin")}
              />
            )}
            <NavItem
              icon={<HelpCircle size={18} strokeWidth={3} />}
              label="Support"
              active={currentPage === "support"}
              onClick={() => navTo("support")}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {isLoggedIn && (
              <button
                onClick={() => setShowRequests(!showRequests)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all relative ${
                  chatRequests.length > 0
                    ? "bg-blue-600 text-white animate-pulse shadow-lg"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white"
                }`}
              >
                <MessageSquare size={20} strokeWidth={3} />
                {chatRequests.length > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full dark:border-slate-950" />
                )}
              </button>
            )}

            <button
              onClick={onToggleDarkMode}
              className="flex items-center justify-center transition-all rounded-full w-11 h-11 bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white hover:bg-blue-600 hover:text-white"
            >
              {isDarkMode ? (
                <Sun size={20} strokeWidth={3} />
              ) : (
                <Moon size={20} strokeWidth={3} />
              )}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => navTo("profile")}
                className={`w-11 h-11 rounded-full flex items-center justify-center relative border-2 transition-all ${
                  currentPage === "profile"
                    ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                    : "border-slate-950 dark:border-white bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                }`}
              >
                <User size={20} strokeWidth={3} />
                <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 shadow-md" />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="hidden sm:flex px-6 py-2.5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 transition-all items-center gap-2 shadow-xl"
              >
                <LogIn size={14} strokeWidth={3} /> JOIN
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center transition-transform border rounded-full lg:hidden w-11 h-11 text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-800 active:scale-95 border-slate-950/10 dark:border-white/10"
            >
              {isMobileMenuOpen ? (
                <X size={24} strokeWidth={3} />
              ) : (
                <Menu size={24} strokeWidth={3} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 p-8 flex flex-col gap-6 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10">
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

          <div className="flex flex-col gap-2">
            <MobileNavItem
              icon={<Newspaper size={20} strokeWidth={3} />}
              label="Home Feed"
              active={currentPage === "home"}
              onClick={() => navTo("home")}
            />
            <MobileNavItem
              icon={<Users size={20} strokeWidth={3} />}
              label="People Network"
              active={currentPage === "network"}
              onClick={() => navTo("network")}
            />
            {isLoggedIn && (
              <MobileNavItem
                icon={<PenSquare size={20} strokeWidth={3} />}
                label="Publish Story"
                active={currentPage === "post"}
                onClick={() => navTo("post")}
              />
            )}
            {isLoggedIn && isAdmin && (
              <MobileNavItem
                icon={<ShieldAlert size={20} strokeWidth={3} />}
                label="Admin Terminal"
                active={currentPage === "admin"}
                onClick={() => navTo("admin")}
              />
            )}
            <MobileNavItem
              icon={<User size={20} strokeWidth={3} />}
              label="My Profile"
              active={currentPage === "profile"}
              onClick={() => navTo("profile")}
            />
            <MobileNavItem
              icon={<HelpCircle size={20} strokeWidth={3} />}
              label="Help Center"
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
              className="mt-auto w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl text-base"
            >
              START NOW
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
        : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
    }`}
  >
    {icon}
    {label}
    {active && (
      <span className="absolute -bottom-1.5 left-0 right-0 h-1 bg-blue-600 rounded-full" />
    )}
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${
      active
        ? "bg-blue-600 text-white border-blue-500 shadow-lg"
        : "bg-transparent text-slate-700 dark:text-slate-300 border-transparent"
    }`}
  >
    {icon}
    <span className="text-sm font-black tracking-widest uppercase">
      {label}
    </span>
  </button>
);

export default Navbar;
