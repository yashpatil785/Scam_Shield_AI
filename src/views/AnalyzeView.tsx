import React, { useState, useEffect } from 'react';
import {
  CommunicationType,
  SupportedLanguage,
  ScamAnalysisReport,
  DemoScamExample,
} from '../types';
import { DEMO_SCAM_EXAMPLES } from '../data/demoScams';
import { ReportView } from '../components/ReportView';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Shield,
  Zap,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  AlertCircle,
  FileSearch,
  CheckCircle,
  Cpu,
  Globe2,
} from 'lucide-react';

interface AnalyzeViewProps {
  initialDemo?: DemoScamExample | null;
  onSaveToHistory: (report: ScamAnalysisReport) => void;
  onClearInitialDemo?: () => void;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  initialDemo,
  onSaveToHistory,
  onClearInitialDemo,
}) => {
  const { user, openAuthModal } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [message, setMessage] = useState('');
  const [communicationType, setCommunicationType] = useState<CommunicationType>('SMS');
  const [url, setUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<ScamAnalysisReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load demo example if passed from home/presets
  useEffect(() => {
    if (initialDemo) {
      setMessage(initialDemo.message);
      setCommunicationType(initialDemo.communicationType);
      setUrl(initialDemo.url || '');
      setReport(null);
      setErrorMessage(null);
      if (onClearInitialDemo) onClearInitialDemo();
    }
  }, [initialDemo, onClearInitialDemo]);

  // Loading animation sequence
  const loadingStages = [
    'Vectorizing linguistic payload and token structure...',
    'Evaluating social engineering & urgency pressure vectors...',
    'Checking domain reputation, redirects & credential lures...',
    'Performing deep multi-vector analysis with Gemini 2.5 Flash...',
    'Synthesizing actionable forensic intelligence report...',
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
      }, 1100);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleSelectDemo = (demo: DemoScamExample) => {
    setMessage(demo.message);
    setCommunicationType(demo.communicationType);
    setUrl(demo.url || '');
    setReport(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setMessage('');
    setUrl('');
    setReport(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) {
      setErrorMessage('Please paste or type the message you wish to scan.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          communicationType,
          url: url.trim(),
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const analyzedReport: ScamAnalysisReport = await response.json();
      setReport(analyzedReport);
      onSaveToHistory(analyzedReport);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred while communicating with the threat engine.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const communicationTypes: CommunicationType[] = [
    'SMS',
    'WhatsApp',
    'Email',
    'Job Offer',
    'Banking',
    'UPI',
    'Investment',
    'Social Media',
    'Other',
  ];

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto" id="analyze-view">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
            <FileSearch className="w-4 h-4" />
            <span>Deep Threat Forensics Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
            Analyze Suspicious Communication
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Paste any doubtful text message, WhatsApp forward, email body, job solicitation, UPI payment request, or investment offer for instant AI threat analysis.
          </p>
        </div>

        {/* Auth status pill */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
          {user ? (
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Authenticated Analyst</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1 justify-end">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Cloud Sync Active</span>
              </span>
            </div>
          ) : (
            <div className="text-right space-y-1">
              <span className="text-[10px] text-slate-400 block">Guest Session</span>
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer text-xs"
              >
                Sign In to Save Scans
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Scam Quick-Selector Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm space-y-3" id="try-demo-scam-box">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Try Demo Scam & Legitimate Test Cases:
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Select an example to populate the analyzer
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {DEMO_SCAM_EXAMPLES.map((demo) => {
            const isSelected = message === demo.message;
            return (
              <button
                key={demo.id}
                id={`demo-btn-${demo.id}`}
                type="button"
                onClick={() => handleSelectDemo(demo)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : demo.isLegitimate
                    ? 'bg-slate-950/60 text-emerald-300 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-slate-900'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span>{demo.isLegitimate ? '✅ ' : '⚠️ '}</span>
                <span>{demo.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Analyzer Form */}
      <form onSubmit={handleAnalyze} className="space-y-6" id="scam-analyzer-form">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-6 shadow-xl">
          {/* Top Options Row: Communication Type & Multilingual Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Communication Type */}
            <div className="space-y-2">
              <label
                htmlFor="communication-type-select"
                className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
              >
                Communication Type:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5" id="comm-type-pill-selector">
                {communicationTypes.map((type) => {
                  const isSelected = communicationType === type;
                  return (
                    <button
                      type="button"
                      key={type}
                      id={`comm-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setCommunicationType(type)}
                      className={`px-2 py-1.5 rounded-md text-xs font-mono font-medium transition-all text-center truncate cursor-pointer border ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center space-x-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Analysis & Report Language:</span>
              </label>
              <div className="grid grid-cols-3 gap-2" id="language-selector-buttons">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'hi', label: 'Hindi (हिंदी)' },
                  { id: 'mr', label: 'Marathi (मराठी)' },
                ].map((lang) => {
                  const isSelected = language === lang.id;
                  return (
                    <button
                      type="button"
                      key={lang.id}
                      id={`lang-btn-${lang.id}`}
                      onClick={() => setLanguage(lang.id as SupportedLanguage)}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500">
                Gemini will inspect original words and output explainable findings in the chosen language.
              </p>
            </div>
          </div>

          {/* Large Message Input Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="suspicious-message-input"
                className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
              >
                Paste suspicious message here...
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {message.length} characters
              </span>
            </div>
            <textarea
              id="suspicious-message-input"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste SMS text, WhatsApp forward, deceptive lottery win alert, Telegram job offer, UPI refund request..."
              className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all resize-y"
            />
          </div>

          {/* Optional URL input */}
          <div className="space-y-2">
            <label
              htmlFor="suspicious-url-input"
              className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center space-x-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Optional Link or Domain (e.g., http://...):</span>
            </label>
            <input
              id="suspicious-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. http://sbi-kyc-update-net.in/login.php or https://t.me/fake_signals"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
            />
          </div>

          {/* Error Message if Any */}
          {errorMessage && (
            <div
              id="analyze-error-banner"
              className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5 font-mono"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="button"
              id="reset-inputs-btn"
              onClick={handleReset}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Inputs</span>
            </button>

            <button
              type="submit"
              id="analyze-for-scam-btn"
              disabled={isLoading || !message.trim()}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>🛡️ Analyze for Scam</span>
            </button>
          </div>
        </div>
      </form>

      {/* ANIMATED LOADING STATE */}
      {isLoading && (
        <div
          id="analysis-loading-state"
          className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-8 text-center space-y-6 shadow-2xl backdrop-blur-md"
        >
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            {/* Pulsing concentric rings */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-400 animate-spin" />
            <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/40">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold font-mono text-white tracking-wide">
              Analyzing Security Vectors with Gemini 2.5 Flash
            </h3>
            <p className="text-xs font-mono text-cyan-400 h-6 transition-all duration-300">
              {loadingStages[loadingStep]}
            </p>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="flex items-center justify-center space-x-2 max-w-xs mx-auto">
            {loadingStages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx <= loadingStep ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* DETAILED RESULTS: SCAM INTELLIGENCE REPORT */}
      {report && !isLoading && (
        <div className="pt-4 animate-fade-in" id="report-anchor">
          <ReportView
            report={report}
            onAnalyzeAnother={() => {
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
};
