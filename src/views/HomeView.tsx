import React from 'react';
import {
  Shield,
  ShieldAlert,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Globe,
  MessageSquare,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { DEMO_SCAM_EXAMPLES } from '../data/demoScams';
import { DemoScamExample } from '../types';

interface HomeViewProps {
  onAnalyzeNow: () => void;
  onTryDemo: (demo: DemoScamExample) => void;
  setActiveTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onAnalyzeNow, onTryDemo, setActiveTab }) => {
  return (
    <div className="space-y-16 py-6" id="home-view">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 sm:p-12 lg:p-16 backdrop-blur-md shadow-2xl">
        {/* Glow ambient meshes */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Tagline / System Status Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">Powered by Google Gemini 2.5 Flash</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-bold">Threat Defense v2.5</span>
          </div>

          {/* Hero Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-white uppercase">
              SCAM SHIELD <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">AI</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold font-mono tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
              Think Before You Click.
            </p>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered analysis of suspicious messages, links and digital communication.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              id="hero-analyze-now-btn"
              onClick={onAnalyzeNow}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Analyze Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-try-demo-btn"
              onClick={() => onTryDemo(DEMO_SCAM_EXAMPLES[0])}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700 font-mono font-bold text-sm tracking-wider uppercase transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Try Demo</span>
            </button>
          </div>

          {/* Security Guarantee Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero Credential Retention</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>English • हिन्दी • मराठी</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sub-second Forensic Scoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* MODERN CYBERSECURITY DASHBOARD PREVIEW */}
      <section className="space-y-6" id="cybersecurity-dashboard-preview">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Live Threat Simulation</span>
            </div>
            <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
              Forensic Intelligence Dashboard Preview
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>View Full Analytics Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dashboard Preview Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-6">
          {/* Top Live Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Total Threat Scans
              </span>
              <span className="text-2xl font-black font-mono text-white mt-1 block">
                1,482
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">+18% this week</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 block">
                High-Risk Blocked
              </span>
              <span className="text-2xl font-black font-mono text-rose-300 mt-1 block">
                1,124
              </span>
              <span className="text-[10px] text-rose-400/80 font-mono">75.8% malicious</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block">
                Avg Risk Score
              </span>
              <span className="text-2xl font-black font-mono text-amber-300 mt-1 block">
                78.4<span className="text-xs text-slate-500">/100</span>
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">High Severity</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 block">
                Top Vector
              </span>
              <span className="text-base font-bold font-mono text-cyan-300 mt-1 block truncate">
                Banking Phishing
              </span>
              <span className="text-[10px] text-slate-400 font-mono">42% of detected frauds</span>
            </div>
          </div>

          {/* Interactive Threat Sample Card */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/90 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-mono uppercase text-rose-400 font-semibold tracking-wider">
                  Critical Threat Simulation (KYC Smishing)
                </span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  94/100 CRITICAL
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Confidence: 96%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-8 space-y-3">
                <p className="text-xs font-mono text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-500">Payload: </span>
                  "Dear Customer, Your SBI account ending in 4920 is suspended due to pending KYC verification. Click http://sbi-kyc-update-net.in/login.php within 24 hours..."
                </p>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    🚩 Artificial Urgency (24 hr deadline)
                  </span>
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    🚩 Deceptive Subdomain Spoofing
                  </span>
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    🚩 Targeted PAN & Aadhaar Harvesting
                  </span>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-center space-y-2 text-xs font-mono">
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200">
                  <span className="font-bold block text-rose-400">🚫 DO NOT DO:</span>
                  Never click unofficial KYC links or disclose OTPs.
                </div>
                <button
                  onClick={() => onTryDemo(DEMO_SCAM_EXAMPLES[0])}
                  className="w-full py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-semibold transition-colors cursor-pointer text-center"
                >
                  Analyze This Sample Live →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK DEMO PRESETS BAR */}
      <section className="space-y-4" id="quick-demo-presets">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-mono text-white tracking-tight">
              Test Real-World Attack & Legitimate Scenarios
            </h3>
            <p className="text-xs text-slate-400">
              Click any scenario to immediately load and analyze with Gemini 2.5 Flash
            </p>
          </div>
          <button
            onClick={onAnalyzeNow}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hidden sm:block cursor-pointer"
          >
            Custom Message Scan →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_SCAM_EXAMPLES.slice(0, 6).map((demo) => {
            const isCritical = demo.expectedRisk === 'CRITICAL';
            const isHigh = demo.expectedRisk === 'HIGH';
            const isLegit = demo.isLegitimate;

            return (
              <div
                key={demo.id}
                onClick={() => onTryDemo(demo)}
                className="group relative p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {demo.communicationType}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                      isLegit
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : isCritical
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                    }`}
                  >
                    {demo.expectedRisk} RISK
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {demo.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {demo.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>Load in Analyzer</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CORE WORKFLOW BREAKDOWN */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Engine Pipeline
          </span>
          <h3 className="text-2xl font-bold font-mono text-white">
            How Scam Shield AI Protects You
          </h3>
          <p className="text-xs text-slate-400">
            From user input to structured cyber threat intelligence in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="text-sm font-bold text-white">Paste Content</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit SMS, WhatsApp, UPI prompts, job offers, or URLs without risking credentials.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="text-sm font-bold text-white">Secure Proxy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Express backend sanitizes payload and proxies safely to Google Gemini 2.5 Flash.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="text-sm font-bold text-white">Gemini Forensic Scan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes urgency levers, domain spoofing, UPI frauds, and targeted financial risks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="text-sm font-bold text-white">Actionable Intelligence</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant breakdown of Red Flags, Do Not Do mandates, and explainable safety steps.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
