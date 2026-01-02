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
  LogOut,
  Binary,
} from "lucide-react";
import { ChatRequest } from "../types";

interface NavbarProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  currentPage: string;
  isLoggedIn: boolean;
  userRole: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  chatRequests: ChatRequest[];
  onAcceptRequest: (req: ChatRequest) => Promise<void>;
  profileAvatar?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onLogin,
  onLogout,
  currentPage,
  isLoggedIn,
  userRole,
  isDarkMode,
  onToggleDarkMode,
  chatRequests,
  onAcceptRequest,
  profileAvatar,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  const navTo = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setIsInboxOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl border border-slate-100 dark:border-slate-800 px-4 md:px-8 py-3.5 rounded-[1.5rem] shadow-2xl">
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navTo("home")}
            >
              <Shield size={18} className="text-blue-600" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] dark:text-white italic">
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
            </div>

            <div className="flex items-center gap-4">
              {isLoggedIn && (
                <div className="relative">
                  <button
                    onClick={() => setIsInboxOpen(!isInboxOpen)}
                    className="relative p-2 text-slate-400 hover:text-blue-600"
                  >
                    <MessageSquare size={18} />
                    {chatRequests.length > 0 && (
                      <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1 animate-pulse" />
                    )}
                  </button>
                  {isInboxOpen && (
                    <div className="absolute right-0 p-4 mt-4 space-y-4 bg-white border shadow-2xl w-72 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl">
                      <p className="text-[10px] font-black uppercase text-slate-400">
                        Incoming Handshakes
                      </p>
                      {chatRequests.length === 0 ? (
                        <p className="text-[10px] text-slate-300 italic">
                          No pending requests.
                        </p>
                      ) : (
                        chatRequests.map((req) => (
                          <div
                            key={req.id}
                            className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                          >
                            <span className="text-[10px] font-bold dark:text-white truncate">
                              Node Request
                            </span>
                            <button
                              onClick={() => onAcceptRequest(req)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-[9px] font-black rounded-lg"
                            >
                              Accept
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={onToggleDarkMode}
                className="text-slate-400 hover:text-blue-600"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navTo("profile")}
                    className="w-10 h-10 overflow-hidden border rounded-full border-slate-200"
                  >
                    {profileAvatar ? (
                      <img
                        src={profileAvatar}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User size={18} className="m-auto text-slate-400" />
                    )}
                  </button>
                  <button onClick={onLogout} className="p-2 text-red-500">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 py-2.5 text-[10px] font-bold uppercase rounded-lg"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

const NavItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all py-1 ${
      active
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-slate-400 hover:text-slate-950 dark:hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default Navbar;
