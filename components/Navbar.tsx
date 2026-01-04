import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  User,
  Globe,
  Users,
  LifeBuoy,
  Bell,
  Sun,
  Moon,
  Search,
  ChevronDown,
  LayoutGrid,
  Radio,
  LogOut,
  Menu,
  X,
  Binary,
  FileText,
  Terminal,
  Lock,
  Zap,
  // Fix: Added missing PenSquare import
  PenSquare,
} from "lucide-react";
import { ChatRequest, Profile } from "../types";
import { useStore } from "../lib/store";

interface NavbarProps {
  onNavigate: (page: string, id?: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  currentPage: string;
  isLoggedIn: boolean;
  userRole: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  chatRequests: ChatRequest[];
  onAcceptRequest: (req: ChatRequest) => void;
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
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const users = useStore((s) => s.users);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const navTo = (page: string, id?: string) => {
    onNavigate(page, id);
    setIsNavDropdownOpen(false);
    setIsSidebarOpen(false);
    setIsNotificationsOpen(false);
  };

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const filtered = users
        .filter(
          (u) =>
            u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.serial_id?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, users]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[150] px-4 py-3 md:px-8 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navTo("home")}
            >
              <div className="p-2 bg-[#00BFFF] rounded-xl shadow-lg shadow-[#00BFFF]/20">
                <Shield size={18} className="text-white" />
              </div>
              <span className="hidden text-xs font-black tracking-widest uppercase sm:block text-slate-900 dark:text-white">
                ThE-ARTICLES
              </span>
            </div>
          </div>

          <div className="items-center hidden gap-6 lg:flex">
            <div className="relative">
              <button
                onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all text-slate-700 dark:text-white"
              >
                <LayoutGrid size={14} className="text-[#00BFFF]" />
                Explore
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    isNavDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isNavDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setIsNavDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-3 w-[280px] bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-6">
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-400 mb-3 px-3 tracking-[0.2em]">
                          Discovery
                        </p>
                        <DropdownItem
                          icon={Globe}
                          label="Discovery Wire"
                          desc="Global news dispatches"
                          active={currentPage === "home"}
                          onClick={() => navTo("home")}
                        />
                        <DropdownItem
                          icon={Users}
                          label="Node Registry"
                          desc="Find correspondents"
                          active={currentPage === "network"}
                          onClick={() => navTo("network")}
                        />
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-400 mb-3 px-3 tracking-[0.2em]">
                          Operations
                        </p>
                        <DropdownItem
                          icon={Radio}
                          label="Broadcast dispatch"
                          desc="Publish intelligence"
                          active={currentPage === "post"}
                          onClick={() => navTo("post")}
                        />
                        <DropdownItem
                          icon={LifeBuoy}
                          label="Technical Support"
                          desc="Protocol assistance"
                          active={currentPage === "support"}
                          onClick={() => navTo("support")}
                        />
                        {userRole === "admin" && (
                          <DropdownItem
                            icon={Terminal}
                            label="Root Access"
                            desc="System core control"
                            active={currentPage === "admin"}
                            onClick={() => navTo("admin")}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {isLoggedIn ? (
              <div className="relative w-64 group xl:w-96" ref={searchRef}>
                <Search
                  size={14}
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400 group-focus-within:text-[#00BFFF]"
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search dossiers (Serial, Email, Phone)..."
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-full py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#00BFFF]/50 transition-all dark:text-white"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                    {searchResults.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          setSearchTerm("");
                          navTo("profile", u.id);
                        }}
                        className="flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <div className="flex items-center justify-center w-8 h-8 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Terminal size={14} className="text-slate-400" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">
                            {u.full_name}
                          </p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                            {u.serial_id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-50 px-6">
                <Lock size={12} /> Registry Locked
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
            >
              {isDarkMode ? (
                <Sun size={20} className="text-[#00BFFF]" />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all relative"
                >
                  <Bell size={20} />
                  {chatRequests.length > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-[#0a0a0a]" />
                  )}
                </button>
                {isNotificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-3 w-[320px] bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                          Active Handshaks
                        </h4>
                        <span className="text-[8px] font-black uppercase text-[#00BFFF] bg-[#00BFFF]/10 px-2 py-1 rounded-full">
                          {chatRequests.length} Signals
                        </span>
                      </div>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                        {chatRequests.length === 0 ? (
                          <div className="py-10 space-y-3 text-center opacity-30">
                            <Zap size={24} className="mx-auto" />
                            <p className="text-[9px] font-black uppercase tracking-widest">
                              Buffer Empty
                            </p>
                          </div>
                        ) : (
                          chatRequests.map((req) => (
                            <div
                              key={req.id}
                              className="p-4 space-y-4 border bg-slate-50 dark:bg-white/5 rounded-2xl border-slate-100 dark:border-white/5"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
                                  {req.from_node?.avatar_url ? (
                                    <img
                                      src={req.from_node.avatar_url}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <User
                                      className="m-2.5 text-slate-400"
                                      size={20}
                                    />
                                  )}
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-[11px] font-black uppercase text-slate-900 dark:text-white truncate">
                                    {req.from_node?.full_name}
                                  </p>
                                  <p className="text-[8px] font-bold text-[#00BFFF] uppercase tracking-tighter">
                                    {req.from_node?.serial_id}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  onAcceptRequest(req);
                                  setIsNotificationsOpen(false);
                                }}
                                className="w-full py-2.5 bg-[#00BFFF] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#00BFFF]/20 hover:brightness-110 active:scale-95 transition-all"
                              >
                                Accept Handshake
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => navTo("profile")}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 dark:border-white/10 hover:border-[#00BFFF] transition-all"
                >
                  {profileAvatar ? (
                    <img
                      src={profileAvatar}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User size={18} className="m-auto text-slate-500" />
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="bg-[#00BFFF] text-white px-5 py-2 text-[10px] font-black uppercase rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-[300] lg:hidden transition-all duration-500 ${
          isSidebarOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 h-full w-[280px] bg-white dark:bg-[#0a0a0a] border-r border-slate-200 dark:border-white/5 shadow-2xl transition-transform duration-500 flex flex-col ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#00BFFF]" />
              <span className="text-xs font-black tracking-widest uppercase text-slate-900 dark:text-white">
                Navigation
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-grow p-4 space-y-2 overflow-y-auto">
            <SidebarItem
              icon={Globe}
              label="Discovery Wire"
              onClick={() => navTo("home")}
              active={currentPage === "home"}
            />
            <SidebarItem
              icon={Users}
              label="Node Registry"
              onClick={() => navTo("network")}
              active={currentPage === "network"}
            />
            <SidebarItem
              icon={Radio}
              label="Broadcast Dispatch"
              onClick={() => navTo("post")}
              active={currentPage === "post"}
            />
            <SidebarItem
              icon={LifeBuoy}
              label="Technical Support"
              onClick={() => navTo("support")}
              active={currentPage === "support"}
            />
            <SidebarItem
              icon={FileText}
              label="Identity Dossier"
              onClick={() => navTo("profile")}
              active={currentPage === "profile"}
            />
          </div>
          <div className="p-6 border-t border-slate-200 dark:border-white/5">
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-600 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-red-500/20"
              >
                <LogOut size={16} /> Disconnect
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="w-full py-4 bg-[#00BFFF] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-[140] lg:hidden bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 flex items-center justify-around py-2.5 pb-6 px-4">
        <BottomTab
          icon={Globe}
          label="Wire"
          active={currentPage === "home"}
          onClick={() => navTo("home")}
        />
        <BottomTab
          icon={Users}
          label="People"
          active={currentPage === "network"}
          onClick={() => navTo("network")}
        />
        <div className="relative -top-5">
          <button
            onClick={() => navTo("post")}
            className="w-14 h-14 bg-[#00BFFF] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#00BFFF]/30 active:scale-90 transition-all border-[6px] border-white dark:border-[#0a0a0a]"
          >
            {isLoggedIn ? <PenSquare size={24} /> : <Lock size={24} />}
          </button>
        </div>
        <BottomTab
          icon={LifeBuoy}
          label="Help"
          active={currentPage === "support"}
          onClick={() => navTo("support")}
        />
        <BottomTab
          icon={User}
          label="Me"
          active={currentPage === "profile"}
          onClick={() => navTo("profile")}
        />
      </nav>
    </>
  );
};

const DropdownItem = ({
  icon: Icon,
  label,
  desc,
  onClick,
  active,
  locked,
}: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all text-left group ${
      active
        ? "bg-[#00BFFF]/10 border border-[#00BFFF]/20"
        : "hover:bg-slate-50 dark:hover:bg-white/5"
    } ${locked ? "opacity-40" : ""}`}
  >
    <div
      className={`p-2 rounded-xl transition-colors ${
        active
          ? "bg-[#00BFFF] text-white shadow-md"
          : "bg-slate-100 dark:bg-white/10 text-slate-500 group-hover:text-[#00BFFF]"
      }`}
    >
      {locked ? <Lock size={16} /> : <Icon size={16} />}
    </div>
    <div>
      <p
        className={`text-[10px] font-black uppercase tracking-tight ${
          active ? "text-[#00BFFF]" : "text-slate-900 dark:text-white"
        }`}
      >
        {label} {locked && "(LOCKED)"}
      </p>
      <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
        {locked ? "Credentials required" : desc}
      </p>
    </div>
  </button>
);

const SidebarItem = ({ icon: Icon, label, onClick, active, locked }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
      active
        ? "bg-[#00BFFF]/10 text-[#00BFFF] border border-[#00BFFF]/20"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
    } ${locked ? "opacity-30" : ""}`}
  >
    {locked ? <Lock size={20} /> : <Icon size={20} />}
    <span className="text-xs font-bold tracking-widest uppercase">{label}</span>
  </button>
);

const BottomTab = ({ icon: Icon, label, active, onClick, locked }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 group w-14 ${
      locked ? "opacity-30" : ""
    }`}
  >
    <div
      className={`p-1.5 rounded-xl transition-all ${
        active ? "bg-[#00BFFF]/10 text-[#00BFFF]" : "text-slate-400"
      }`}
    >
      {locked ? <Lock size={22} /> : <Icon size={22} />}
    </div>
    <span
      className={`text-[8px] font-black uppercase tracking-widest ${
        active ? "text-[#00BFFF]" : "text-slate-400"
      }`}
    >
      {label}
    </span>
  </button>
);

export default Navbar;
