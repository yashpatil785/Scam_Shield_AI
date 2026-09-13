import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LanguageOption } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageDropdownProps {
  idPrefix?: string;
  compact?: boolean;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  idPrefix = 'header',
  compact = false,
}) => {
  const { language, setLanguage, currentLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: LanguageOption) => {
    setLanguage(lang.code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} id={`${idPrefix}-language-container`}>
      <button
        id={`${idPrefix}-language-dropdown-btn`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select application and analysis language"
        className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono font-medium text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span className="font-semibold text-white">
          {compact ? currentLanguage.shortCode : currentLanguage.nativeLabel}
        </span>
        {!compact && (
          <span className="text-[10px] text-slate-400 hidden lg:inline">
            ({currentLanguage.label})
          </span>
        )}
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          id={`${idPrefix}-language-menu`}
          className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-2.5 py-1.5 border-b border-slate-800/80 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
              Analysis Language
            </span>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Reports & explanations translated
            </span>
          </div>

          <div className="space-y-0.5">
            {languages.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  id={`${idPrefix}-lang-opt-${item.code}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  role="menuitem"
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-5 text-center text-[11px] font-bold text-slate-400 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">
                      {item.shortCode}
                    </span>
                    <div>
                      <span className="block text-slate-100 font-medium">
                        {item.nativeLabel}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
