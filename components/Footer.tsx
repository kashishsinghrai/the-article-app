import React from "react";
import { Globe, Cpu } from "lucide-react";
import { toast } from "react-hot-toast";

interface FooterProps {
  nodeCount?: number;
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ nodeCount = 1204, onNavigate }) => {
  const handleLinkClick = (link: string) => {
    if (!onNavigate) return;

    const lowerLink = link.toLowerCase();

    // Mapping footer labels to existing routes
    switch (lowerLink) {
      case "explore":
      case "global wire":
        onNavigate("home");
        break;
      case "mission":
      case "transparency":
      case "global ops":
        onNavigate("network");
        break;
      case "reporting":
        onNavigate("post");
        break;
      case "credentialing":
        onNavigate("profile");
        break;
      case "admin terminal":
        onNavigate("admin");
        break;
      case "support":
        onNavigate("support");
        break;
      default:
        toast("Node transmission pending: Feature in beta.", {
          icon: "📡",
          style: {
            borderRadius: "20px",
            background: "#1e293b",
            color: "#fff",
            fontSize: "10px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          },
        });
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/5 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
              ThE-ARTICLES
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-medium italic">
              A decentralized organization committed to the restoration of
              factual authority through citizen-led investigations and
              peer-to-peer verification.
            </p>
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Active Nodes: {nodeCount.toLocaleString()}
                </span>
              </div>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <Cpu size={12} className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Latency: 1.2s
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
            links={[
              "Ethics Charter",
              "Verification",
              "Budget Rewards",
              "Security",
            ]}
            onLinkClick={handleLinkClick}
          />
          <FooterSection
            title="Operational"
            links={["Reporting", "Credentialing", "Admin Terminal", "Support"]}
            onLinkClick={handleLinkClick}
          />
          <FooterSection
            title="Legal"
            links={["Privacy Policy", "Press Kit", "Terms of Use", "Contact"]}
            onLinkClick={handleLinkClick}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-100 dark:border-white/5 gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2025 THE ARTICLES ORG. ALL ASSETS PROTECTED VIA BLOCKCHAIN HASH.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {["London", "New Delhi", "Singapore", "New York"].map((city) => (
              <span
                key={city}
                onClick={() => handleLinkClick(city)}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterSection = ({
  title,
  links,
  onLinkClick,
}: {
  title: string;
  links: string[];
  onLinkClick: (link: string) => void;
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
          className="text-xs font-medium text-slate-400 hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-wider"
        >
          {link}
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
