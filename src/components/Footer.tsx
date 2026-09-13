import React from 'react';
import { Shield, Lock, AlertCircle, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 mt-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-mono font-bold tracking-wider text-sm">
                SCAM SHIELD AI
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs">
              Next-generation cyber fraud intelligence powered by Google Gemini 2.5 Flash.
              Designed to dismantle social engineering tactics, verify suspicious messages,
              and protect users from digital extortion, phishing, and UPI fraud.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero Credential Retention • Server-Side API Defense</span>
            </div>
          </div>

          {/* Direct Navigation */}
          <div className="space-y-2">
            <span className="font-mono font-bold text-slate-200 uppercase tracking-wider block text-xs">
              Navigation
            </span>
            <ul className="space-y-1.5 font-mono">
              {['Home', 'Analyze', 'Dashboard', 'History', 'How It Works', 'About'].map((link) => {
                const id = link.toLowerCase().replace(/\s+/g, '-');
                return (
                  <li key={id}>
                    <button
                      onClick={() => {
                        setActiveTab(id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-cyan-400 transition-colors cursor-pointer text-xs"
                    >
                      {link}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Emergency Portals */}
          <div className="space-y-2">
            <span className="font-mono font-bold text-slate-200 uppercase tracking-wider block text-xs">
              Official Reporting
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-cyan-400 flex items-center space-x-1"
                >
                  <span>India Cyber Crime (1930)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://reportfraud.ftc.gov"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-cyan-400 flex items-center space-x-1"
                >
                  <span>US FTC ReportFraud</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.actionfraud.police.uk"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-cyan-400 flex items-center space-x-1"
                >
                  <span>UK Action Fraud</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              Disclaimer: Scam Shield AI is an educational cybersecurity prototype providing AI-assisted risk assessments. Always verify sensitive matters via official banking or authority channels.
            </span>
          </div>
          <span className="font-mono text-slate-400 whitespace-nowrap">
            v1.0.0 • Hackathon Edition
          </span>
        </div>
      </div>
    </footer>
  );
};
