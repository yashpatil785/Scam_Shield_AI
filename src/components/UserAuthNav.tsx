import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  LogIn,
  LogOut,
  Shield,
  CheckCircle,
  ChevronDown,
  Mail,
  UserCheck,
} from 'lucide-react';

export const UserAuthNav: React.FC = () => {
  const { user, loading, signOut, openAuthModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-500">
        <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span>Authenticating...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <button
          id="nav-signin-btn"
          type="button"
          onClick={() => openAuthModal('signin')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm hover:border-cyan-400"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
        <button
          id="nav-signup-btn"
          type="button"
          onClick={() => openAuthModal('signup')}
          className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-medium transition-colors cursor-pointer"
        >
          <span>Register</span>
        </button>
      </div>
    );
  }

  // Authenticated user avatar or initial
  const displayName = user.displayName || user.email?.split('@')[0] || 'Analyst';
  const photoURL = user.photoURL;

  return (
    <div className="relative" ref={dropdownRef} id="user-profile-menu">
      <button
        id="user-profile-button"
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all text-left cursor-pointer group"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full border border-cyan-400/60 object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold uppercase">
            {displayName.charAt(0)}
          </div>
        )}

        <div className="hidden sm:block text-left">
          <span className="block text-xs font-mono font-bold text-white max-w-[110px] truncate leading-tight">
            {displayName}
          </span>
          <span className="block text-[10px] font-mono text-emerald-400 leading-none">
            Verified
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
      </button>

      {/* Profile dropdown card */}
      {dropdownOpen && (
        <div
          id="user-profile-dropdown"
          className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-xl space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* User info box */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-cyan-400 text-xs font-mono font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              <span className="truncate">{displayName}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-mono truncate">
              <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span className="truncate">{user.email || 'Google Account'}</span>
            </div>
          </div>

          <div className="space-y-1 text-xs font-mono text-slate-300">
            <div className="px-2 py-1.5 rounded-lg bg-slate-800/40 text-[11px] flex items-center justify-between text-slate-400">
              <span>Cloud Sync:</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              id="sign-out-btn"
              type="button"
              onClick={async () => {
                setDropdownOpen(false);
                await signOut();
              }}
              className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
