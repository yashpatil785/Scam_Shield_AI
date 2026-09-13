import React from 'react';
import {
  Brain,
  Shield,
  Layers,
  Cpu,
  Lock,
  AlertTriangle,
  FileCode,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  QrCode,
  CreditCard,
  Briefcase,
  Gift,
} from 'lucide-react';

interface HowItWorksViewProps {
  onNavigateToAnalyze: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigateToAnalyze }) => {
  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto" id="how-it-works-view">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-slate-800 pb-5">
        <div className="inline-flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
          <Brain className="w-4 h-4" />
          <span>Forensic Architecture & Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
          How Scam Shield AI Works
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          A behind-the-scenes look at how we combine Google Gemini 2.5 Flash, psychological threat heuristics, and strict structured intelligence formatting to safeguard users.
        </p>
      </div>

      {/* 4-STEP AI PIPELINE */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold font-mono text-white tracking-wide flex items-center space-x-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>The 4-Stage Detection Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="text-base font-bold text-white">Payload Ingestion & Redaction</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When you paste an SMS, WhatsApp message, or email, our Express gateway sanitizes the string and isolates any embedded web URLs or phone numbers. No personal identification credentials or passwords are ever stored or cached.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="text-base font-bold text-white">Social Engineering Dissection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cyberattacks exploit human psychology rather than software flaws. Scam Shield checks for high-pressure psychological levers: synthetic urgency (e.g. "within 24 hours"), authority impersonation (police, banks, tax departments), and fear of account suspension.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="text-base font-bold text-white">Gemini 2.5 Flash Deep Inference</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Using the modern <code>@google/genai</code> SDK, our backend executes structured reasoning with Gemini 2.5 Flash. The model evaluates whether the text matches known criminal playbooks (UPI reverse QR scams, task fraud, advance-fee lotteries, crypto Ponzi setups).
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-sm flex items-center justify-center">
              04
            </div>
            <h3 className="text-base font-bold text-white">Structured Threat Synthesis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gemini returns a strict JSON payload mapping Risk Scores (0-100), red flags, and tailored protective actions. The frontend renders this as a clean, actionable Scam Intelligence Report in English, Hindi, or Marathi.
            </p>
          </div>
        </div>
      </section>

      {/* RISK LEVEL STANDARDS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-white tracking-wide">
          Standardized Risk Severity Tiers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 block uppercase">
              Score: 0 – 29
            </span>
            <h4 className="text-sm font-bold text-white uppercase">LOW RISK</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Legitimate notification or routine transactional advisory. No coercive language, no credential harvesting links, standard contact avenues.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 block uppercase">
              Score: 30 – 59
            </span>
            <h4 className="text-sm font-bold text-white uppercase">MEDIUM RISK</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unsolicited marketing, unverified claims, or vague promotional links. Not overtly malicious, but warrants healthy caution.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5 space-y-2">
            <span className="text-xs font-mono font-bold text-orange-400 block uppercase">
              Score: 60 – 79
            </span>
            <h4 className="text-sm font-bold text-white uppercase">HIGH RISK</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strong indicators of deception: unrealistic earnings, unverified Telegram groups, advance fee solicitations, spoofed sender IDs.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
            <span className="text-xs font-mono font-bold text-rose-400 block uppercase">
              Score: 80 – 100
            </span>
            <h4 className="text-sm font-bold text-white uppercase">CRITICAL THREAT</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Confirmed fraud attack: fake KYC suspension, QR code refund trap, APK installation demand, or credential/OTP theft. Immediate danger.
            </p>
          </div>
        </div>
      </section>

      {/* COMMON ATTACK ANATOMY */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono text-white tracking-wide">
          Anatomy of Dominant Attack Vectors
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start space-x-4">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">1. Bank KYC Deactivation Phishing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Attackers send SMS claiming your SBI, HDFC, or ICICI account will be suspended within 24 hours. The link leads to a clone page harvesting PAN card, Aadhaar number, and NetBanking passwords to authorize fraudulent fund transfers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start space-x-4">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">2. Mistaken UPI Transfer & "Refund" QR Codes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A scammer claims they accidentally transferred money to your PhonePe/GPay and sends a QR code or payment request to "refund" them. Victims assume they are receiving money, but scanning a QR code and entering a UPI PIN always DEBITS your account.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start space-x-4">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">3. YouTube Like / Task Scams (Part-time Jobs)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Victims are paid small amounts (₹150–₹500) for liking YouTube videos or hotel ratings. Once trust is established, victims are placed in a Telegram "VIP task group" where they must deposit large sums to "unlock high-commission crypto tasks".
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-start space-x-4">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">4. Advance-Fee Lottery & Prize Scams</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unsolicited emails or WhatsApp messages claiming you won millions in a lottery you never entered. Attackers demand an "advance clearance fee", "customs tax", or "banking conversion charge" that is stolen without any prize ever existing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold font-mono text-white">
          Ready to verify a suspicious message?
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Test Scam Shield AI now with our pre-built real-world demo scenarios or paste your own message.
        </p>
        <button
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
        >
          <Shield className="w-4 h-4" />
          <span>Launch Analyzer Now</span>
        </button>
      </div>
    </div>
  );
};
