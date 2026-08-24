'use client';

import React from 'react';
import { Globe, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

export interface StoryLanguageBarProps {
  currentLang: string;
  isTranslating: boolean;
  onLanguageChange: (langCode: string) => void;
  className?: string;
}

export const StoryLanguageBar: React.FC<StoryLanguageBarProps> = ({
  currentLang,
  isTranslating,
  onLanguageChange,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-borderLight rounded-xl shadow-soft my-4 text-xs',
        className
      )}
    >
      <div className="flex items-center gap-2 text-inkMuted font-medium">
        <Globe className="w-4 h-4 text-forestPrimary" aria-hidden="true" />
        <span className="font-semibold text-inkPrimary">Read in your language:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Select Story Language">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              disabled={isTranslating}
              onClick={() => onLanguageChange(lang.code)}
              aria-pressed={isActive}
              className={cn(
                'min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forestPrimary',
                isActive
                  ? 'bg-forestPrimary text-white shadow-soft ring-1 ring-forestPrimary'
                  : 'bg-cardMuted hover:bg-forestLight hover:text-forestPrimary text-inkMuted border border-borderLight',
                isTranslating && !isActive ? 'opacity-50 cursor-not-allowed' : ''
              )}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {isActive && isTranslating && (
                <Loader2 className="w-3 h-3 animate-spin ml-1 text-white" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StoryLanguageBar;
