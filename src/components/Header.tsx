import { useState } from 'react';
import {
  Landmark,
  BarChart3,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Home,
} from 'lucide-react';

import type { Language } from '@/lib/types';
import type { ThemeMode } from '@/hooks/useThemes';
import { t, type TranslationKey } from '@/i18n/translations';

interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  onHomeClick: () => void;
  onDashboardClick: () => void;
  onFAQClick: () => void;
  onContactClick: () => void;
  showDashboard: boolean;
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

const langLabels: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'தமிழ்' },
];

const themeOptions: {
  mode: ThemeMode;
  icon: typeof Sun;
  labelKey: TranslationKey;
}[] = [
  { mode: 'light', icon: Sun, labelKey: 'lightMode' },
  { mode: 'dark', icon: Moon, labelKey: 'darkMode' },
  { mode: 'system', icon: Monitor, labelKey: 'systemTheme' },
];

export function Header({
  lang,
  onLangChange,
  onHomeClick,
  onDashboardClick,
  onFAQClick,
  onContactClick,
  showDashboard,
  themeMode,
  onThemeChange,
}: HeaderProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLanguageChange = (newLang: Language) => {
    onLangChange(newLang);
  };

  const handleHome = () => {
    closeMobileMenu();
    onHomeClick();
  };

  const handleFAQ = () => {
    closeMobileMenu();
    onFAQClick();
  };

  const handleContact = () => {
    closeMobileMenu();
    onContactClick();
  };

  const handleDashboard = () => {
    closeMobileMenu();
    onDashboardClick();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 dark:bg-slate-950/95 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-3 sm:py-3.5">
          <button
            type="button"
            onClick={handleHome}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 text-left rounded-md transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 cursor-pointer group"
            aria-label={`${tr('appName')} - ${tr('home')}`}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary-600 text-white flex-shrink-0 group-hover:bg-primary-700 transition-colors shadow-sm">
              <Landmark className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                {tr('appName')}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-tight dark:text-slate-400 truncate max-w-[180px] sm:max-w-none">
                {tr('tagline')}
              </p>
            </div>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center border border-slate-200 rounded-md bg-white dark:bg-slate-900 dark:border-slate-700 overflow-hidden">
              {langLabels.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    lang === language.code
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                  aria-label={`${tr('language')}: ${language.label}`}
                >
                  {language.label}
                </button>
              ))}
            </div>

            <div className="flex items-center border border-slate-200 rounded-md bg-white dark:bg-slate-900 dark:border-slate-700 overflow-hidden">
              {themeOptions.map(({ mode, icon: Icon, labelKey }) => (
                <button
                  key={mode}
                  onClick={() => onThemeChange(mode)}
                  className={`flex items-center justify-center w-7 h-7 transition-colors ${
                    themeMode === mode
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                  aria-label={tr(labelKey)}
                  title={tr(labelKey)}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>

            <button
              onClick={onFAQClick}
              className="px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors dark:text-slate-300 dark:hover:text-primary-400"
            >
              {tr('faqs')}
            </button>

            <button
              onClick={onContactClick}
              className="px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors dark:text-slate-300 dark:hover:text-primary-400"
            >
              {tr('contact')}
            </button>

            {!showDashboard && (
              <button
                onClick={onDashboardClick}
                className="btn-ghost"
                aria-label={tr('dashboardLabel')}
                title={tr('dashboardLabel')}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label={mobileMenuOpen ? tr('closeMenu') : tr('openMenu')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 py-3 animate-fade-in">
            <div className="space-y-3">
              <div>
                <p className="px-1 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {tr('language')}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {langLabels.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`px-3 py-2.5 rounded-md border text-sm font-medium text-left transition-colors ${
                        lang === language.code
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950/40 dark:text-primary-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="px-1 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {tr('appearance')}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map(({ mode, icon: Icon, labelKey }) => (
                    <button
                      key={mode}
                      onClick={() => onThemeChange(mode)}
                      className={`flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-md border text-xs font-medium transition-colors ${
                        themeMode === mode
                          ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950/40 dark:text-primary-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tr(labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-1">
                <button
                  onClick={handleHome}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    {tr('home')}
                  </span>
                  <span className="text-slate-400">→</span>
                </button>

                <button
                  onClick={handleFAQ}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span>{tr('faqs')}</span>
                  <span className="text-slate-400">→</span>
                </button>

                <button
                  onClick={handleContact}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span>{tr('contact')}</span>
                  <span className="text-slate-400">→</span>
                </button>

                {!showDashboard && (
                  <button
                    onClick={handleDashboard}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      {tr('dashboardLabel')}
                    </span>
                    <span className="text-slate-400">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
