import React from 'react';
import { ScamAnalysisReport } from '../types';
import { ThreatCharts } from '../components/ThreatCharts';
import { RiskTrendChart } from '../components/RiskTrendChart';
import {
  Activity,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  history: ScamAnalysisReport[];
  onSelectReport: (report: ScamAnalysisReport) => void;
  onNavigateToAnalyze: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  onSelectReport,
  onNavigateToAnalyze,
}) => {
  // Baseline demo intelligence dataset combined with real history
  const baselineScans = 1420;
  const totalAnalyses = baselineScans + history.length;

  const baselineHighRisk = 1084;
  const userHighRisk = history.filter(
    (h) => h.riskLevel === 'CRITICAL' || h.riskLevel === 'HIGH'
  ).length;
  const totalHighRisk = baselineHighRisk + userHighRisk;

  const averageScore =
    history.length > 0
      ? Math.round(
          (76 * baselineScans +
            history.reduce((acc, curr) => acc + curr.riskScore, 0)) /
            totalAnalyses
        )
      : 76;

  // Category distributions
  const categoryData = [
    { category: 'KYC / Banking Phishing', count: 540, percentage: 38, riskLevel: 'CRITICAL' as const },
    { category: 'UPI / QR Code Fraud', count: 320, percentage: 22, riskLevel: 'CRITICAL' as const },
    { category: 'Fake Task & Job Offers', count: 260, percentage: 18, riskLevel: 'HIGH' as const },
    { category: 'Crypto / Ponzi Investment', count: 180, percentage: 13, riskLevel: 'HIGH' as const },
    { category: 'Lottery / Prize Scams', count: 120, percentage: 9, riskLevel: 'CRITICAL' as const },
  ];

  // Risk distribution
  const riskDistribution = {
    critical: 780 + history.filter((h) => h.riskLevel === 'CRITICAL').length,
    high: 340 + history.filter((h) => h.riskLevel === 'HIGH').length,
    medium: 180 + history.filter((h) => h.riskLevel === 'MEDIUM').length,
    low: 120 + history.filter((h) => h.riskLevel === 'LOW').length,
    total: totalAnalyses,
  };

  // Recent analyses list (combines history or demo recent items)
  const defaultRecent: ScamAnalysisReport[] = [
    {
      id: 'rpt_demo_101',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      inputMessage: 'Your SBI account is blocked due to KYC. Click http://sbi-kyc.in to update now.',
      communicationType: 'SMS',
      language: 'en',
      riskScore: 94,
      riskLevel: 'CRITICAL',
      scamProbability: 98,
      scamCategory: 'KYC / Banking Phishing',
      confidence: 96,
      summary: 'High-risk banking phishing smishing exploiting fake account suspension threat.',
      redFlags: ['Urgent 24hr threat', 'Deceptive subdomain'],
      socialEngineeringTactics: ['Fear of Account Block', 'Artificial Urgency'],
      suspiciousPhrases: ['blocked due to KYC'],
      requestedSensitiveInfo: ['PAN', 'Aadhaar', 'NetBanking Password'],
      financialRisk: { level: 'SEVERE', description: 'Complete bank account takeover', potentialImpact: 'Loss of funds' },
      urlRisk: { detected: true, domainAnalysis: 'Unverified spoofing portal', risks: ['Phishing domain'] },
      recommendedActions: ['Block sender', 'Verify via official bank branch'],
      thingsNotToDo: ['Do not click link', 'Do not share OTP'],
      explainableReasoning: 'Phishing attack mimicking official bank communications.',
      disclaimer: 'AI-assisted threat assessment.',
    },
    {
      id: 'rpt_demo_102',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      inputMessage: 'Earn ₹8000 daily by watching and liking short YouTube videos. Join our Telegram!',
      communicationType: 'WhatsApp',
      language: 'en',
      riskScore: 84,
      riskLevel: 'HIGH',
      scamProbability: 86,
      scamCategory: 'Fake Task & Job Offers',
      confidence: 92,
      summary: 'Task scam with synthetic early incentives leading to prepayment advance fee demands.',
      redFlags: ['Unrealistic salary for simple task', 'Telegram recruitment'],
      socialEngineeringTactics: ['Easy Money Lure', 'Social Proof'],
      suspiciousPhrases: ['Earn ₹8000 daily'],
      requestedSensitiveInfo: ['Prepayment deposit'],
      financialRisk: { level: 'HIGH', description: 'Advance fee loss', potentialImpact: 'Deposits not refunded' },
      urlRisk: { detected: false, domainAnalysis: 'Telegram handle used', risks: ['External chat redirection'] },
      recommendedActions: ['Ignore and report message to WhatsApp'],
      thingsNotToDo: ['Do not pay registration fee'],
      explainableReasoning: 'Standard task fraud playbook.',
      disclaimer: 'AI-assisted threat assessment.',
    },
    {
      id: 'rpt_demo_103',
      timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      inputMessage: 'HDFC Bank: INR 450.00 debited from a/c **9812 to zomato@icici. If not you, call 18002586161.',
      communicationType: 'Banking',
      language: 'en',
      riskScore: 12,
      riskLevel: 'LOW',
      scamProbability: 10,
      scamCategory: 'Legitimate Banking Notification',
      confidence: 95,
      summary: 'Standard genuine bank transaction alert with verified customer care line.',
      redFlags: [],
      socialEngineeringTactics: ['Standard Transaction Advisory'],
      suspiciousPhrases: [],
      requestedSensitiveInfo: [],
      financialRisk: { level: 'NONE', description: 'Normal debit alert', potentialImpact: 'None' },
      urlRisk: { detected: false, domainAnalysis: 'No link present', risks: [] },
      recommendedActions: ['Verify against bank statement'],
      thingsNotToDo: ['None'],
      explainableReasoning: 'Legitimate transactional SMS with standard masked identifiers.',
      disclaimer: 'AI-assisted threat assessment.',
    },
  ];

  const recentItems = [...history, ...defaultRecent].slice(0, 6);

  return (
    <div className="space-y-10 py-4 max-w-7xl mx-auto" id="dashboard-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4" />
            <span>Cyber Threat Intelligence Hub</span>
          </div>
          <h1 className="text-3xl font-black font-mono text-white tracking-tight">
            Threat Landscape Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated statistics, attack vector breakdown, and active digital fraud telemetry.
          </p>
        </div>

        <button
          id="dashboard-new-scan-btn"
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer self-start sm:self-auto"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>New Analysis Scan</span>
        </button>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metric-cards">
        {/* Total Analyses */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total Analyses</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-white">
              {totalAnalyses.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 block mt-2">
            +{(history.length + 18)} live scans today
          </span>
        </div>

        {/* High-Risk Threats */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
              High-Risk Threats
            </span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-rose-300">
              {totalHighRisk.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] font-mono text-rose-400/80 block mt-2">
            {Math.round((totalHighRisk / totalAnalyses) * 100)}% dangerous fraud rate
          </span>
        </div>

        {/* Average Risk Score */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Average Risk Score
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black font-mono text-amber-300">
              {averageScore}
            </span>
            <span className="text-xs font-mono text-slate-500">/100</span>
          </div>
          <span className="text-[11px] font-mono text-amber-400/80 block mt-2">
            High Severity Baseline
          </span>
        </div>

        {/* Most Common Scam Type */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Top Vector
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold font-mono text-white truncate">
              KYC / Banking Phishing
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 block mt-2">
            38% of detected attacks
          </span>
        </div>
      </div>

      {/* Historical Risk Score Trends (Recharts Line Chart) */}
      <RiskTrendChart history={history} onSelectReport={onSelectReport} />

      {/* Threat Visualizer Charts (Categories & Distribution) */}
      <ThreatCharts categories={categoryData} riskDistribution={riskDistribution} />

      {/* RECENT ANALYSES FEED */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4" id="recent-analyses-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold font-mono text-white tracking-wide">
              Recent Threat Activity Stream
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing latest {recentItems.length} scans
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="recent-scans-table">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Channel</th>
                <th className="pb-3 font-semibold">Scam Category</th>
                <th className="pb-3 font-semibold">Risk Score</th>
                <th className="pb-3 font-semibold">Severity</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {recentItems.map((item) => {
                const isCritical = item.riskLevel === 'CRITICAL';
                const isHigh = item.riskLevel === 'HIGH';
                const isMed = item.riskLevel === 'MEDIUM';
                const isLow = item.riskLevel === 'LOW';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectReport(item)}
                  >
                    <td className="py-3 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {item.communicationType}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-slate-200">
                      <div className="max-w-[280px] truncate">{item.scamCategory}</div>
                    </td>
                    <td className="py-3 font-mono font-bold">
                      <span
                        className={
                          isCritical
                            ? 'text-rose-400'
                            : isHigh
                            ? 'text-orange-400'
                            : isMed
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {item.riskScore}/100
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                          isCritical
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : isHigh
                            ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                            : isMed
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReport(item);
                        }}
                        className="p-1 rounded text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="View Full Threat Report"
                      >
                        <ArrowUpRight className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cyber Advisory / High Threat Alert Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold font-mono text-amber-300 uppercase tracking-wide">
              Active Threat Advisory: QR Code & UPI Refund Traps
            </h4>
            <p className="text-slate-300 mt-0.5 leading-relaxed">
              Scammers are systematically claiming to have sent accidental funds on PhonePe/GPay and requesting QR code scans. Remember: <strong>Entering a UPI PIN always deducts money from your account</strong>; you NEVER enter a PIN to receive money.
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateToAnalyze}
          className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold whitespace-nowrap cursor-pointer"
        >
          Scan a QR / UPI Message →
        </button>
      </div>
    </div>
  );
};
