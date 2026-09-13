import React from 'react';
import { X, PhoneCall, AlertTriangle, ExternalLink, ShieldAlert, CreditCard } from 'lucide-react';

interface HelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelplineModal: React.FC<HelplineModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      id="emergency-helpline-modal"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3 text-rose-400">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white">
                Emergency Cyber Fraud Helplines
              </h3>
              <p className="text-xs text-slate-400">
                Critical response hotlines if money or credentials were stolen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Immediate First Steps */}
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 space-y-1.5 font-mono">
          <span className="font-bold text-rose-400 flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>CRITICAL GOLDEN HOUR PROTOCOL:</span>
          </span>
          <p>
            If you entered your UPI PIN or transferred funds within the last 2 hours, immediately dial <strong>1930</strong> (India) or call your bank to freeze transactions and request a chargeback before the fraudster liquidates the funds.
          </p>
        </div>

        {/* Directory List */}
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">🇮🇳 India Cyber Crime Helpline</span>
              <span className="text-slate-400 font-mono">Toll-free 24x7 Citizen Portal</span>
            </div>
            <a
              href="tel:1930"
              className="px-3 py-1.5 rounded-lg bg-rose-500 text-slate-950 font-mono font-bold hover:bg-rose-400 transition-colors"
            >
              Call 1930
            </a>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">🇮🇳 National Cyber Crime Portal</span>
              <span className="text-slate-400 font-mono">Official Police FIR Registration</span>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 font-mono hover:bg-slate-700 transition-colors flex items-center space-x-1"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">🇺🇸 US Federal Trade Commission</span>
              <span className="text-slate-400 font-mono">Report Fraud & Identity Theft</span>
            </div>
            <a
              href="https://reportfraud.ftc.gov"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 font-mono hover:bg-slate-700 transition-colors flex items-center space-x-1"
            >
              <span>reportfraud.ftc.gov</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">🇬🇧 UK Action Fraud</span>
              <span className="text-slate-400 font-mono">Police Fraud Reporting Service</span>
            </div>
            <a
              href="https://www.actionfraud.police.uk"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 font-mono hover:bg-slate-700 transition-colors flex items-center space-x-1"
            >
              <span>actionfraud.police.uk</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer close */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
