import React from 'react';
import {
  Shield,
  Lock,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Cpu,
  PhoneCall,
  Globe,
  HeartHandshake,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto" id="about-view">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-slate-800 pb-5">
        <div className="inline-flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
          <Shield className="w-4 h-4" />
          <span>Mission & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
          About Scam Shield AI
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          An AI-powered cybersecurity platform created to detect, deconstruct, and explain digital deception before harm occurs.
        </p>
      </div>

      {/* MISSION STATEMENT & CONTEXT */}
      <section className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-4">
        <h2 className="text-xl font-bold font-mono text-white tracking-wide">
          The Problem: Social Engineering at Scale
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Every day, millions of individuals receive fraudulent SMS messages, WhatsApp lures, fake UPI refund requests, and spoofed bank KYC warnings. Attackers do not hack firewalls; they hack human psychology using false deadlines, authority intimidation, and manufactured panic.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong>Scam Shield AI</strong> levels the playing field. By harnessing <strong>Google Gemini 2.5 Flash</strong> through server-side threat intelligence pipelines, it instantly decodes the linguistic and psychological levers used by cybercriminals, offering actionable containment advice in plain, accessible language.
        </p>
      </section>

      {/* SECURITY & PRIVACY BY DESIGN */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold font-mono text-white tracking-wide flex items-center space-x-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          <span>Security & Privacy Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Server-Side API Proxy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini API keys are strictly retained inside the Node.js/Express environment and never transmitted to client browsers or bundled assets.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Credential Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scam Shield never asks for, records, or caches real OTPs, passwords, or payment PINs. All historical logs remain strictly on your local browser device.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">High-Resilience Fallback</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In addition to Gemini 2.5 Flash, the system features a heuristic rule engine so threat assessments continue to function smoothly under all connectivity conditions.
            </p>
          </div>
        </div>
      </section>

      {/* OFFICIAL REPORTING DIRECTORIES */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-white tracking-wide flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-rose-400" />
          <span>Official Cybercrime Helplines & Reporting Portals</span>
        </h2>
        <p className="text-xs text-slate-400">
          If you have been targeted by or fallen victim to a scam, contact these official government and law enforcement portals immediately:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* India */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                🇮🇳 India
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Helpline: 1930
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">National Cyber Crime Reporting Portal</h4>
              <p className="text-xs text-slate-400 mt-1">
                Operated by the Ministry of Home Affairs for reporting financial cyber fraud, UPI theft, and identity abuse.
              </p>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
            >
              <span>Visit cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* United States */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                🇺🇸 United States
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                FTC / IC3
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">FTC ReportFraud & FBI IC3</h4>
              <p className="text-xs text-slate-400 mt-1">
                The Federal Trade Commission and FBI Internet Crime Complaint Center for reporting consumer frauds.
              </p>
            </div>
            <a
              href="https://reportfraud.ftc.gov"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
            >
              <span>Visit reportfraud.ftc.gov</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* United Kingdom */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                🇬🇧 United Kingdom
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                0300 123 2040
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Action Fraud Police UK</h4>
              <p className="text-xs text-slate-400 mt-1">
                The UK's national reporting centre for fraud and cyber crime.
              </p>
            </div>
            <a
              href="https://www.actionfraud.police.uk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
            >
              <span>Visit actionfraud.police.uk</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Global / Australia */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                🌐 Global / Australia
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Scamwatch / CERT
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">National CERT & Scamwatch Portals</h4>
              <p className="text-xs text-slate-400 mt-1">
                National computer emergency response teams and consumer scamwatch directories.
              </p>
            </div>
            <a
              href="https://www.scamwatch.gov.au"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
            >
              <span>Visit scamwatch.gov.au</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* ETHICAL DISCLAIMER */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80 text-xs text-slate-400 leading-relaxed space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold uppercase">
          <AlertCircle className="w-4 h-4" />
          <span>Notice Regarding AI Threat Assessments</span>
        </div>
        <p>
          Scam Shield AI generates security evaluations using artificial intelligence models. While our analysis employs high-precision cybercrime heuristics and Google Gemini 2.5 Flash, no automated software can guarantee 100% detection of all zero-day social engineering variants.
        </p>
        <p>
          When in doubt regarding banking notifications or official orders, <strong>always verify directly with the issuing institution through their verified customer support phone numbers or official physical branches</strong>.
        </p>
      </div>
    </div>
  );
};
