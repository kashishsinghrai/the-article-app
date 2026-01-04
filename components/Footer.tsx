import React from "react";
import { Cpu } from "lucide-react";

const FooterSection = ({
  title,
  links,
  onLinkClick,
}: {
  title: string;
  links: string[];
  onLinkClick: (l: string) => void;
}) => (
  <div className="space-y-6">
    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">
      {title}
    </h4>
    <ul className="space-y-4">
      {links.map((link) => (
        <li
          key={link}
          onClick={() => onLinkClick(link)}
          className="text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer text-slate-400 hover:text-blue-600"
        >
          {link}
        </li>
      ))}
    </ul>
  </div>
);

const Footer: React.FC<{ onNavigate: (p: string) => void }> = ({
  onNavigate,
}) => {
  const handleLinkClick = (l: string) => {
    const low = l.toLowerCase();
    if (low === "explore") onNavigate("home");
    else if (low === "mission") onNavigate("network");
    else if (low === "reporting") onNavigate("post");
    else if (low === "credentialing") onNavigate("profile");
    else if (low === "support") onNavigate("support");
  };

  return (
    <footer className="pt-32 pb-16 bg-white border-t dark:bg-slate-950 border-slate-100 dark:border-white/5">
      <div className="px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-12 mb-20 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 space-y-8">
            <h3 className="text-2xl italic font-black tracking-tighter uppercase text-slate-900 dark:text-white">
              ThE-ARTICLES
            </h3>
            <p className="max-w-xs text-sm italic font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              Restoring factual authority through citizen-led investigative
              dispatches and decentralized verification protocols.
            </p>
            <div className="inline-flex items-center gap-4 px-6 py-3 border rounded-full shadow-sm bg-slate-50 dark:bg-white/5 border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Active Nodes: 1.2k
                </span>
              </div>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <Cpu size={12} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Latency: 0.8s
                </span>
              </div>
            </div>
          </div>
          <FooterSection
            title="Network"
            links={["Explore", "Mission", "Global Ops", "Transparency"]}
            onLinkClick={handleLinkClick}
          />
          <FooterSection
            title="Protocol"
            links={["Ethics", "Verification", "Budget", "Security"]}
            onLinkClick={handleLinkClick}
          />
          <FooterSection
            title="Operational"
            links={["Reporting", "Credentialing", "Terminal", "Support"]}
            onLinkClick={handleLinkClick}
          />
          <FooterSection
            title="Legal"
            links={["Privacy", "Press Kit", "Terms", "Contact"]}
            onLinkClick={handleLinkClick}
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-6 pt-12 border-t md:flex-row border-white/5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2025 THE ARTICLES ORG. ALL ASSETS PROTECTED VIA BLOCKCHAIN HASH.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {["London", "Mumbai", "Singapore", "New York"].map((city) => (
              <span key={city} className="cursor-pointer hover:text-blue-600">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
