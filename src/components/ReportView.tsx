import React, { useState, useRef, useEffect } from 'react';
import { ScamAnalysisReport } from '../types';
import { RiskGauge } from './RiskGauge';
import { downloadReportAsPdf, downloadReportAsJson } from '../utils/reportExporter';
import {
  AlertTriangle,
  ShieldAlert,
  Brain,
  Search,
  DollarSign,
  Link2,
  ShieldCheck,
  Ban,
  FileText,
  Copy,
  Check,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  FileCode,
  FileType,
  Loader2,
  FileDown,
} from 'lucide-react';

interface ReportViewProps {
  report: ScamAnalysisReport;
  onAnalyzeAnother?: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onAnalyzeAnother }) => {
  const [copied, setCopied] = useState(false);
  const [showOriginalMessage, setShowOriginalMessage] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingJson, setIsDownloadingJson] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyReport = () => {
    const textSummary = `🛡️ SCAM SHIELD AI - THREAT INTELLIGENCE REPORT
------------------------------------------------
Risk Score: ${report.riskScore}/100 [${report.riskLevel}]
Scam Category: ${report.scamCategory}
Confidence: ${report.confidence}%
Scam Probability: ${report.scamProbability}%

SUMMARY:
${report.summary}

RED FLAGS:
${report.redFlags.map((rf) => `• ${rf}`).join('\n')}

SOCIAL ENGINEERING TACTICS:
${report.socialEngineeringTactics.map((se) => `• ${se}`).join('\n')}

CRITICAL - DO NOT DO:
${report.thingsNotToDo.map((dnd) => `❌ ${dnd}`).join('\n')}

RECOMMENDED ACTIONS:
${report.recommendedActions.map((ra) => `✅ ${ra}`).join('\n')}

AI EXPLANATION:
${report.explainableReasoning}

DISCLAIMER:
${report.disclaimer}
------------------------------------------------
Analyzed by Scam Shield AI on ${new Date(report.timestamp).toLocaleString()}
`;
    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    try {
      const ok = downloadReportAsPdf(report);
      if (ok) {
        setDownloadSuccessMessage('PDF Report Downloaded!');
        setTimeout(() => setDownloadSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsDownloadingPdf(false);
      setIsDownloadOpen(false);
    }
  };

  const handleDownloadJson = () => {
    setIsDownloadingJson(true);
    try {
      const ok = downloadReportAsJson(report);
      if (ok) {
        setDownloadSuccessMessage('JSON Report Downloaded!');
        setTimeout(() => setDownloadSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('JSON download error:', err);
    } finally {
      setIsDownloadingJson(false);
      setIsDownloadOpen(false);
    }
  };

  const getRiskBadge = () => {
    switch (report.riskLevel) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          title: 'Critical Threat Detected',
          icon: ShieldAlert,
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          title: 'High-Risk Scam Indicators Detected',
          icon: AlertTriangle,
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          title: 'Moderate Risk Anomaly Identified',
          icon: AlertTriangle,
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          title: 'Low Threat - Legitimate Patterns Observed',
          icon: ShieldCheck,
        };
    }
  };

  const badgeInfo = getRiskBadge();
  const BadgeIcon = badgeInfo.icon;

  return (
    <div className="space-y-6" id="scam-intelligence-report">
      {/* Report Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md shadow-2xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BadgeIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                Official Threat Assessment
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Scam Intelligence Report
              </h2>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Download Report Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="download-report-btn"
                type="button"
                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-950/60 text-xs font-medium text-cyan-300 hover:bg-cyan-900/60 hover:text-cyan-100 transition-colors cursor-pointer shadow-sm"
                title="Download Scam Intelligence Report as PDF or JSON"
              >
                {isDownloadingPdf || isDownloadingJson ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>Download Report</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDownloadOpen && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-slate-700 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                      Export Intelligence Dossier
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Save forensic threat analysis
                    </span>
                  </div>

                  <div className="p-1 space-y-1">
                    <button
                      id="download-pdf-dropdown-btn"
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf}
                      className="w-full flex items-start space-x-2.5 p-2 rounded-lg text-left hover:bg-slate-800 transition-colors group cursor-pointer text-xs"
                    >
                      <div className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20">
                        {isDownloadingPdf ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 group-hover:text-white">
                            Executive PDF
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">.PDF</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Formatted forensic dossier with risk gauges & directives
                        </p>
                      </div>
                    </button>

                    <button
                      id="download-json-dropdown-btn"
                      type="button"
                      onClick={handleDownloadJson}
                      disabled={isDownloadingJson}
                      className="w-full flex items-start space-x-2.5 p-2 rounded-lg text-left hover:bg-slate-800 transition-colors group cursor-pointer text-xs"
                    >
                      <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20">
                        {isDownloadingJson ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileCode className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 group-hover:text-white">
                            Raw Threat JSON
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">.JSON</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Machine-readable schema for SIEM / security logs
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Copy Button */}
            <button
              id="copy-report-btn"
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {onAnalyzeAnother && (
              <button
                id="analyze-another-btn"
                type="button"
                onClick={onAnalyzeAnother}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Scan Another
              </button>
            )}
          </div>
        </div>

        {/* Success notification banner */}
        {downloadSuccessMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{downloadSuccessMessage}</span>
              <span className="text-slate-400 text-[11px]">Saved to your downloads folder.</span>
            </div>
            <button
              onClick={() => setDownloadSuccessMessage(null)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Primary Metrics Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Radial Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <RiskGauge score={report.riskScore} level={report.riskLevel} size="lg" />
            <div className="mt-3 text-center">
              <span className="text-xs text-slate-400 font-mono">
                Scam Probability: <strong className="text-white">{report.scamProbability}%</strong>
              </span>
            </div>
          </div>

          {/* Core Findings Overview */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeInfo.bg}`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{badgeInfo.title}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                Confidence: {report.confidence}%
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-cyan-400 border border-slate-700">
                Type: {report.communicationType}
              </span>
              {report.language && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                  🌐 {report.language === 'hi' ? 'हिंदी' : report.language === 'mr' ? 'मराठी' : 'English'}
                </span>
              )}
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Identified Scam Category
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {report.scamCategory}
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <p className="text-sm text-slate-300 leading-relaxed">
                {report.summary}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
              <span>Report ID: {report.id}</span>
              <span>Scanned: {new Date(report.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Collapsible Original Content Viewer */}
        <div className="mt-6 border-t border-slate-800/80 pt-4">
          <button
            id="toggle-original-message-btn"
            onClick={() => setShowOriginalMessage(!showOriginalMessage)}
            className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer"
          >
            <span className="font-mono">Inspect Submitted Suspicious Payload</span>
            {showOriginalMessage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showOriginalMessage && (
            <div className="mt-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div>
                <span className="text-slate-500">Submitted Message:</span>
                <p className="mt-1 whitespace-pre-wrap text-slate-200 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  {report.inputMessage}
                </p>
              </div>
              {report.inputUrl && (
                <div>
                  <span className="text-slate-500">Submitted URL:</span>
                  <p className="mt-1 text-cyan-300 break-all">{report.inputUrl}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Critical Danger Guidance: Things NOT To Do (Immediate User Safety) */}
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5 backdrop-blur-sm" id="section-things-not-to-do">
        <div className="flex items-center space-x-2.5 mb-3 text-rose-400">
          <Ban className="w-5 h-5 flex-shrink-0" />
          <h4 className="text-base font-bold tracking-wide uppercase">
            🚫 Critical Safety Directives: What You Must NOT Do
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.thingsNotToDo.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-2.5 p-3 rounded-lg bg-slate-900/90 border border-rose-500/20 text-xs text-rose-200/90 leading-relaxed font-medium"
            >
              <span className="text-rose-400 font-bold flex-shrink-0">✕</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Forensic Intelligence Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🚩 Red Flags */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3" id="section-red-flags">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              🚩 Detected Red Flags
            </h4>
          </div>
          <ul className="space-y-2.5">
            {report.redFlags.map((flag, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-2.5 text-xs text-slate-300 leading-relaxed p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🧠 Social Engineering Tactics */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3" id="section-social-engineering">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Brain className="w-5 h-5 flex-shrink-0" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              🧠 Social Engineering Manipulation Tactics
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.socialEngineeringTactics.map((tactic, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
              >
                {tactic}
              </span>
            ))}
          </div>
          {report.requestedSensitiveInfo && report.requestedSensitiveInfo.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Targeted Credentials / Data:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {report.requestedSensitiveInfo.map((info, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  >
                    ⚠️ {info}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suspicious Phrases & Technical Vector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🔍 Suspicious Elements / Phrases */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3" id="section-suspicious-elements">
          <div className="flex items-center space-x-2 text-amber-400">
            <Search className="w-5 h-5 flex-shrink-0" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              🔍 Flagged Forensic Phrases
            </h4>
          </div>
          {report.suspiciousPhrases && report.suspiciousPhrases.length > 0 ? (
            <div className="space-y-2">
              {report.suspiciousPhrases.map((phrase, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-mono flex items-center justify-between"
                >
                  <span className="italic">"{phrase}"</span>
                  <span className="text-[10px] uppercase font-bold text-amber-400 ml-2 flex-shrink-0">
                    High Bias
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No overt keyword manipulation detected.</p>
          )}
        </div>

        {/* 💰 Financial Risk */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3" id="section-financial-risk">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400">
              <DollarSign className="w-5 h-5 flex-shrink-0" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                💰 Financial Exposure Risk
              </h4>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${
                report.financialRisk.level === 'SEVERE'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : report.financialRisk.level === 'HIGH'
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  : report.financialRisk.level === 'MEDIUM'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {report.financialRisk.level} Impact
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-300 space-y-2">
            <p><strong className="text-white">Mechanism:</strong> {report.financialRisk.description}</p>
            <p><strong className="text-rose-400">Potential Impact:</strong> {report.financialRisk.potentialImpact}</p>
          </div>
        </div>
      </div>

      {/* 🔗 URL Risk Section (if present or applicable) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3" id="section-url-risk">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Link2 className="w-5 h-5 flex-shrink-0" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            🔗 Link & Domain Threat Heuristics
          </h4>
        </div>
        <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800 space-y-2 text-xs">
          {report.urlRisk.urlAnalyzed && (
            <div className="font-mono text-cyan-400 flex items-center space-x-1.5 break-all">
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
              <span>{report.urlRisk.urlAnalyzed}</span>
            </div>
          )}
          <p className="text-slate-300 leading-relaxed">{report.urlRisk.domainAnalysis}</p>
          {report.urlRisk.risks && report.urlRisk.risks.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {report.urlRisk.risks.map((r, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  ⚡ {r}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🛡️ Recommended Actions */}
      <div className="rounded-xl border border-emerald-500/20 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3" id="section-recommended-actions">
        <div className="flex items-center space-x-2 text-emerald-400">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            🛡️ Recommended Security Actions
          </h4>
        </div>
        <div className="space-y-2">
          {report.recommendedActions.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3 rounded-lg bg-slate-950/60 border border-emerald-500/15 text-xs text-slate-200 leading-relaxed font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                {idx + 1}
              </div>
              <span className="pt-0.5">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 📋 AI Explainable Reasoning */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm space-y-3" id="section-ai-explanation">
        <div className="flex items-center space-x-2 text-cyan-400">
          <FileText className="w-5 h-5 flex-shrink-0" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            📋 AI Forensic Reasoning & Technical Breakdown
          </h4>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-sm text-slate-300 leading-relaxed space-y-3">
          <p className="whitespace-pre-wrap">{report.explainableReasoning}</p>
        </div>
      </div>

      {/* 📥 Threat Intelligence Export & Offline Archival Section */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/20 p-5 backdrop-blur-sm" id="section-download-report">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-cyan-400">
              <FileDown className="w-5 h-5 flex-shrink-0" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Download & Archival Center
              </h4>
            </div>
            <p className="text-xs text-slate-400">
              Save this threat intelligence report for law enforcement filing (Cyber Crime Cell), institutional compliance, or personal security records.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: PDF */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-400">
                  <FileText className="w-4 h-4" />
                  <span>Executive Threat Dossier</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  PDF
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Color-coded document with risk gauge, flagged phrases, targeted credentials, safety directives, containment steps, and emergency helplines.
              </p>
            </div>
            <button
              id="download-pdf-card-btn"
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="w-full py-2.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Formatted PDF (.pdf)'}</span>
            </button>
          </div>

          {/* Option 2: JSON */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400">
                  <FileCode className="w-4 h-4" />
                  <span>Machine-Readable Intel</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  JSON
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full structured JSON payload including telemetry timestamps, vector analysis, extracted linguistic markers, and classification metrics for SIEM.
              </p>
            </div>
            <button
              id="download-json-card-btn"
              type="button"
              onClick={handleDownloadJson}
              disabled={isDownloadingJson}
              className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 font-semibold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isDownloadingJson ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-cyan-400" />
              )}
              <span>{isDownloadingJson ? 'Exporting JSON...' : 'Download Structured JSON (.json)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800 text-[11px] text-slate-500 leading-relaxed flex items-start space-x-2 font-mono">
        <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <span>{report.disclaimer}</span>
      </div>
    </div>
  );
};
