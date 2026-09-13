import React, { useState } from 'react';
import { ScamAnalysisReport, RiskLevel } from '../types';
import { ReportView } from '../components/ReportView';
import { downloadReportAsPdf, downloadReportAsJson } from '../utils/reportExporter';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  Download,
  ExternalLink,
  ShieldAlert,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  FileCheck,
  FileText,
  FileCode,
} from 'lucide-react';

interface HistoryViewProps {
  history: ScamAnalysisReport[];
  onClearHistory: () => void;
  onNavigateToAnalyze: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onClearHistory,
  onNavigateToAnalyze,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [selectedReport, setSelectedReport] = useState<ScamAnalysisReport | null>(null);

  // Filter items based on search and selected risk level
  const filteredItems = history.filter((item) => {
    const matchesRisk = filterRisk === 'ALL' || item.riskLevel === filterRisk;
    const matchesSearch =
      item.scamCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inputMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.communicationType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scam-shield-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto" id="history-view">
      {/* If a report is selected for detail inspection */}
      {selectedReport ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              id="back-to-history-list-btn"
              onClick={() => setSelectedReport(null)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to History Log</span>
            </button>
            <span className="text-xs font-mono text-slate-400">
              Logged on {new Date(selectedReport.timestamp).toLocaleString()}
            </span>
          </div>

          <ReportView report={selectedReport} onAnalyzeAnother={onNavigateToAnalyze} />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
                <HistoryIcon className="w-4 h-4" />
                <span>Forensic Storage</span>
              </div>
              <h1 className="text-3xl font-black font-mono text-white tracking-tight">
                Analysis History Log
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Saved local scans, detected threat classifications, and historical risk scores.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {history.length > 0 && (
                <>
                  <button
                    id="export-history-json-btn"
                    onClick={handleExportJson}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                    title="Export all reports as JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    id="clear-all-history-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your local analysis history?')) {
                        onClearHistory();
                      }
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-mono transition-colors cursor-pointer"
                    title="Clear saved logs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Log</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search & Risk Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="history-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history by category, message snippet, or channel..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-all"
              />
            </div>

            {/* Risk Filter Buttons */}
            <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0" id="history-risk-filters">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => {
                const isSelected = filterRisk === lvl;
                return (
                  <button
                    key={lvl}
                    id={`filter-risk-${lvl.toLowerCase()}`}
                    onClick={() => setFilterRisk(lvl)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* History List or Empty State */}
          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <HistoryIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold font-mono text-white">No Analysis History Yet</h3>
                <p className="text-xs text-slate-400">
                  Perform your first suspicious communication scan to automatically save records here.
                </p>
              </div>
              <button
                id="start-first-scan-btn"
                onClick={onNavigateToAnalyze}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                <span>Run First Scam Scan</span>
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400 font-mono">
              No analyses matching "{searchQuery}" with filter [{filterRisk}].
            </div>
          ) : (
            <div className="space-y-3" id="history-items-list">
              {filteredItems.map((item) => {
                const isCritical = item.riskLevel === 'CRITICAL';
                const isHigh = item.riskLevel === 'HIGH';
                const isMed = item.riskLevel === 'MEDIUM';
                const isLow = item.riskLevel === 'LOW';

                return (
                  <div
                    key={item.id}
                    id={`history-item-${item.id}`}
                    onClick={() => setSelectedReport(item)}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
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
                          {item.riskLevel} • {item.riskScore}/100
                        </span>

                        <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {item.communicationType}
                        </span>

                        <span className="text-[11px] font-mono text-slate-500 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.timestamp).toLocaleString()}</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white truncate">
                        {item.scamCategory}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-1 font-mono">
                        "{item.inputMessage}"
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        title="Download formatted PDF report"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadReportAsPdf(item);
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="Download raw JSON report"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadReportAsJson(item);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs transition-colors cursor-pointer"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
