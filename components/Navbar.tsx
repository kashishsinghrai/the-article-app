import React, { useState } from "react";
import {
  Shield,
  User,
  Sun,
  Moon,
  MessageSquare,
  X,
  Menu,
  Newspaper,
  PenSquare,
  Users,
  HelpCircle,
  LogIn,
  ShieldAlert,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navTo = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };
  const isAdmin = userRole === "admin";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] px-4 py-4 md:px-8 md:py-8 pointer-events-none">
        <div className="flex items-center justify-between px-6 py-3 mx-auto transition-all border shadow-sm pointer-events-auto max-w-7xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-200 dark:border-slate-800 rounded-2xl">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navTo("home")}
          >
            <Shield size={20} className="text-slate-900 dark:text-white" />
            <span className="text-sm italic font-black tracking-widest uppercase text-slate-900 dark:text-white">
              The Articles
            </span>
          </div>

          <div className="items-center hidden gap-10 lg:flex">
            <NavItem
              label="Home"
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
            <NavItem
              label="Support"
              active={currentPage === "support"}
              onClick={() => navTo("support")}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDarkMode}
              className="flex items-center justify-center transition-colors w-9 h-9 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => navTo("profile")}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                  currentPage === "profile"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    : "border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                <User size={18} />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="hidden sm:block px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 hover:text-white transition-all"
              >
                Join Network
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center lg:hidden w-9 h-9 text-slate-900 dark:text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[70%] bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 p-8 flex flex-col gap-6 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-4 mt-12">
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
    className={`text-[10px] font-black uppercase tracking-widest transition-all relative py-1 ${
      active
        ? "text-slate-900 dark:text-white underline underline-offset-8 decoration-2 decoration-blue-600"
        : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

const MobileNavItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`text-left py-4 border-b border-slate-50 dark:border-slate-900 text-sm font-black uppercase tracking-widest ${
      active ? "text-blue-600" : "text-slate-500"
    }`}
  >
    {label}
  </button>
);

export default Navbar;
