import React, { useState } from "react";
import { Shield, User, Sun, Moon, X, Menu } from "lucide-react";
import { ChatRequest } from "../types";

interface NavbarProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
  // Fix: Added missing onSearch prop passed from App.tsx
  onSearch?: (query: string) => void;
  currentPage: string;
  isLoggedIn: boolean;
  userRole: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  // Fix: Added missing chatRequests and onAcceptRequest props passed from App.tsx
  chatRequests?: ChatRequest[];
  onAcceptRequest?: (req: ChatRequest) => Promise<void>;
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
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navTo = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };
  const isAdmin = userRole === "admin";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] p-6 pointer-events-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 px-8 py-3.5 rounded-2xl shadow-sm transition-all">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navTo("home")}
          >
            <Shield size={18} className="text-slate-950 dark:text-white" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] dark:text-white italic">
              ThE-ARTICLES
            </span>
          </div>

          <div className="items-center hidden gap-12 lg:flex">
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

          <div className="flex items-center gap-6">
            <button
              onClick={onToggleDarkMode}
              className="transition-colors text-slate-400 hover:text-slate-950 dark:hover:text-white"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => navTo("profile")}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                  currentPage === "profile"
                    ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950"
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
            <span className="text-xl font-bold dark:text-white">Menu</span>
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
