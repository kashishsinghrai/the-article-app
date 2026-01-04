import React, { useState } from "react";
import {
  Shield,
  User,
  Sun,
  Moon,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Terminal,
  Globe,
  PenSquare,
  LifeBuoy,
  Zap,
  Fingerprint,
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

const NavItem = ({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all py-2 px-1 border-b-2 ${
      active
        ? "text-blue-600 border-blue-600"
        : "text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    <Icon size={14} className={active ? "animate-pulse" : ""} />
    <span className="hidden xl:inline">{label}</span>
  </button>
);

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
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navTo = (page: string) => {
    onNavigate(page);
    setIsInboxOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl border border-slate-100 dark:border-white/5 px-4 md:px-8 py-3.5 rounded-[1.5rem] shadow-2xl">
            {/* Logo */}
            <div
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => navTo("home")}
            >
              <div className="p-2 transition-transform bg-blue-600 shadow-lg rounded-xl group-hover:rotate-12 shadow-blue-600/20">
                <Shield size={18} className="text-white" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] dark:text-white italic">
                ThE-ARTICLES
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="items-center hidden gap-8 lg:flex">
              <NavItem
                icon={Globe}
                label="Explore"
                active={currentPage === "home"}
                onClick={() => navTo("home")}
              />
              <NavItem
                icon={Zap}
                label="Network"
                active={currentPage === "network"}
                onClick={() => navTo("network")}
              />
              {isLoggedIn && (
                <NavItem
                  icon={PenSquare}
                  label="Broadcast"
                  active={currentPage === "post"}
                  onClick={() => navTo("post")}
                />
              )}
              <NavItem
                icon={LifeBuoy}
                label="Support"
                active={currentPage === "support"}
                onClick={() => navTo("support")}
              />
              {isLoggedIn && userRole === "admin" && (
                <NavItem
                  icon={Terminal}
                  label="Root"
                  active={currentPage === "admin"}
                  onClick={() => navTo("admin")}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {isLoggedIn && (
                <div className="relative">
                  <button
                    onClick={() => setIsInboxOpen(!isInboxOpen)}
                    className={`relative p-2 transition-colors ${
                      chatRequests.length > 0
                        ? "text-blue-600"
                        : "text-slate-400 hover:text-blue-600"
                    }`}
                  >
                    <MessageSquare size={18} />
                    {chatRequests.length > 0 && (
                      <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1 animate-pulse" />
                    )}
                  </button>
                  {isInboxOpen && (
                    <div className="absolute right-0 p-4 mt-4 space-y-4 duration-200 bg-white border shadow-2xl dark:bg-slate-900 w-72 border-slate-100 dark:border-white/10 rounded-2xl animate-in zoom-in-95">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 dark:border-white/5 pb-2">
                        Incoming Signals
                      </p>
                      {chatRequests.length === 0 ? (
                        <div className="py-4 text-center">
                          <p className="text-[10px] text-slate-400 italic">
                            No handshake requests detected.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2 overflow-y-auto max-h-60 custom-scrollbar">
                          {chatRequests.map((req) => (
                            <div
                              key={req.id}
                              className="p-3 space-y-3 border bg-slate-50 dark:bg-white/5 rounded-xl border-slate-100 dark:border-white/5"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-blue-600/10 rounded-lg text-blue-600">
                                  <Fingerprint size={16} />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">
                                    Handshake Protocol
                                  </p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                                    Validation Required
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  onAcceptRequest(req);
                                  setIsInboxOpen(false);
                                }}
                                className="w-full py-2 bg-blue-600 text-white text-[9px] font-black rounded-lg hover:bg-blue-700 transition-all uppercase tracking-widest shadow-lg shadow-blue-600/20"
                              >
                                Accept Signal
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={onToggleDarkMode}
                className="p-2 transition-colors text-slate-400 hover:text-blue-600"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2 pl-4 ml-2 border-l border-slate-100 dark:border-white/10">
                  <button
                    onClick={() => navTo("profile")}
                    className="w-10 h-10 overflow-hidden transition-all border-2 shadow-sm rounded-2xl border-slate-200 dark:border-white/10 hover:border-blue-600"
                  >
                    {profileAvatar ? (
                      <img
                        src={profileAvatar}
                        className="object-cover w-full h-full"
                        alt="Avatar"
                      />
                    ) : (
                      <User size={18} className="m-auto text-slate-400" />
                    )}
                  </button>
                  <button
                    onClick={onLogout}
                    className="hidden p-2 text-red-500 transition-colors hover:text-red-700 sm:block"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-6 py-2.5 text-[10px] font-bold uppercase rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                  Initialize
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 lg:hidden text-slate-400 hover:text-blue-600"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[140] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl lg:hidden flex flex-col p-8 pt-32 gap-6 animate-in slide-in-from-top duration-300">
          <button
            onClick={() => navTo("home")}
            className={`text-2xl font-black uppercase italic ${
              currentPage === "home" ? "text-blue-600" : "text-slate-400"
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => navTo("network")}
            className={`text-2xl font-black uppercase italic ${
              currentPage === "network" ? "text-blue-600" : "text-slate-400"
            }`}
          >
            Registry
          </button>
          {isLoggedIn && (
            <button
              onClick={() => navTo("post")}
              className={`text-2xl font-black uppercase italic ${
                currentPage === "post" ? "text-blue-600" : "text-slate-400"
              }`}
            >
              Broadcast
            </button>
          )}
          <button
            onClick={() => navTo("support")}
            className={`text-2xl font-black uppercase italic ${
              currentPage === "support" ? "text-blue-600" : "text-slate-400"
            }`}
          >
            Support
          </button>
          {isLoggedIn && userRole === "admin" && (
            <button
              onClick={() => navTo("admin")}
              className={`text-2xl font-black uppercase italic ${
                currentPage === "admin" ? "text-blue-600" : "text-slate-400"
              }`}
            >
              Root Terminal
            </button>
          )}
          {isLoggedIn && (
            <button
              onClick={() => navTo("profile")}
              className="text-2xl italic font-black uppercase text-slate-400"
            >
              My Identity
            </button>
          )}
          <div className="flex flex-col gap-4 mt-auto">
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="flex items-center justify-center w-full gap-3 py-5 text-sm font-black tracking-widest text-red-500 uppercase bg-red-500/10 rounded-2xl"
              >
                <LogOut size={20} /> Terminate Protocol
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="w-full py-5 text-sm font-black tracking-widest text-white uppercase bg-blue-600 rounded-2xl"
              >
                Initialize Node
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
