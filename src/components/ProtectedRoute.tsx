import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, Lock, Sparkles, UserPlus } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  featureName?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackTitle = 'Authentication Required',
  fallbackDescription = 'This section contains protected cyber intelligence data. Please sign in or create an account to view and manage your records.',
  featureName = 'Protected Cyber Asset',
}) => {
  const { user, loading, openAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-16 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-slate-400">Verifying secure authentication credentials...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        id="protected-route-guard"
        className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto my-8 backdrop-blur-md shadow-2xl"
      >
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider">
            <ShieldAlert className="w-3 h-3" />
            <span>{featureName}</span>
          </div>
          <h3 className="text-2xl font-bold font-mono text-white tracking-tight">
            {fallbackTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {fallbackDescription}
          </p>
        </div>

        {/* Security Benefits Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <span className="text-cyan-400 font-mono font-bold block text-[11px] mb-1">
              • Cloud Persistence
            </span>
            <span className="text-[11px] text-slate-400">
              Synchronize scan results and threat patterns securely to your profile.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <span className="text-cyan-400 font-mono font-bold block text-[11px] mb-1">
              • Multi-Device Sync
            </span>
            <span className="text-[11px] text-slate-400">
              Access your historical forensic reports from any workstation or device.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <span className="text-cyan-400 font-mono font-bold block text-[11px] mb-1">
              • Audit Trails
            </span>
            <span className="text-[11px] text-slate-400">
              Download formal forensic PDFs and report evidence to law enforcement.
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="protected-guard-signin-btn"
            type="button"
            onClick={() => openAuthModal('signin')}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Access</span>
          </button>

          <button
            id="protected-guard-signup-btn"
            type="button"
            onClick={() => openAuthModal('signup')}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-medium text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Free Account</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
