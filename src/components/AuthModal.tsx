import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  X,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  Loader2,
  CheckCircle2,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInDemoAnalyst,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleClose = () => {
    setError(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setAuthModalOpen(false);
  };

  const handleToggleMode = () => {
    setError(null);
    setAuthModalMode(authModalMode === 'signin' ? 'signup' : 'signin');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email address and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    setLoading(true);
    try {
      if (authModalMode === 'signup') {
        await signUpWithEmail(email.trim(), password, displayName.trim());
      } else {
        await signInWithEmail(email.trim(), password);
      }
      handleClose();
    } catch (err: any) {
      let msg = err.message || 'Authentication failed. Please try again.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Google Sign-in popup was closed before completing.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      handleClose();
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        // User closed popup; clear error or set friendly message
        setError('Google sign-in was cancelled. You can try again, use email below, or use the 1-Click Demo.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else if (err?.code === 'auth/popup-blocked') {
        setError('Popups were blocked by your browser or iframe. Please allow popups or use email sign-in.');
      } else {
        const msg = err?.message || 'Failed to authenticate with Google.';
        setError(msg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInDemoAnalyst();
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6"
      >
        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Cyber Intelligence Access</span>
          </div>
          <h2 className="text-2xl font-black font-mono text-white tracking-tight">
            {authModalMode === 'signin' ? 'Sign In to Scam Shield' : 'Create Protected Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {authModalMode === 'signin'
              ? 'Access your private threat history, forensic investigations, and security telemetry.'
              : 'Join Scam Shield AI to safeguard communications and maintain persistent forensic audit trails.'}
          </p>
        </div>

        {/* Google Sign-In Button */}
        <div className="space-y-3">
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-xs font-mono font-bold text-white transition-all flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-60 shadow-sm"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Quick 1-Click Demo Sign-in for immediate access without popups */}
          <button
            id="demo-analyst-signin-btn"
            type="button"
            onClick={handleDemoSignIn}
            disabled={googleLoading || loading}
            className="w-full py-2 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 text-xs font-mono font-medium text-cyan-300 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Demo Analyst Sign-In (No Popup)</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono uppercase text-slate-500">
              Or with email
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="email-auth-form">
          {authModalMode === 'signup' && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-displayname-input"
                className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
              >
                Display Name (Optional)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-displayname-input"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Security Analyst / Name"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="auth-email-input"
              className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@domain.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="auth-password-input"
              className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password-input"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono transition-all"
              />
            </div>
            {authModalMode === 'signup' && (
              <span className="text-[10px] font-mono text-slate-500 block">
                Must be at least 6 characters.
              </span>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div
              id="auth-error-banner"
              className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2 font-mono"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : authModalMode === 'signin' ? (
              <LogIn className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span>
              {loading
                ? 'Processing Authentication...'
                : authModalMode === 'signin'
                ? 'Sign In with Email'
                : 'Create Account'}
            </span>
          </button>
        </form>

        {/* Footer Toggle Mode */}
        <div className="pt-2 text-center text-xs font-mono text-slate-400">
          {authModalMode === 'signin' ? (
            <span>
              Don't have an account?{' '}
              <button
                id="switch-to-signup-btn"
                type="button"
                onClick={handleToggleMode}
                className="text-cyan-400 hover:underline font-semibold cursor-pointer"
              >
                Create one now
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                id="switch-to-signin-btn"
                type="button"
                onClick={handleToggleMode}
                className="text-cyan-400 hover:underline font-semibold cursor-pointer"
              >
                Sign in to account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
