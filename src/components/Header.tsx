import { Landmark, BarChart3, Sun, Moon, Monitor } from 'lucide-react';
import type { Language } from '@/lib/types';
import type { ThemeMode } from '@/hooks/useThemes';
import { t, type TranslationKey } from '@/i18n/translations';

interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
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
  label: string;
}[] = [
  { mode: 'light', icon: Sun, label: 'Light mode' },
  { mode: 'dark', icon: Moon, label: 'Dark mode' },
  { mode: 'system', icon: Monitor, label: 'System theme' },
];

export function Header({
  lang,
  onLangChange,
  onDashboardClick,
  onFAQClick,
  onContactClick,
  showDashboard,
  themeMode,
  onThemeChange,
}: HeaderProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">

          {/* JanSahay identity */}
          <div className="flex items-center gap-3 min-w-0">

            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary-600 text-white flex-shrink-0">
              <Landmark className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 leading-tight dark:text-slate-100">
                {tr('appName')}
              </h1>

              <p className="text-xs text-slate-500 leading-tight dark:text-slate-400">
                {tr('tagline')}
              </p>
            </div>

          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-2">

            {/* Languages */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
              {langLabels.map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLangChange(l.code)}
                  className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    lang === l.code
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                  aria-label={`Switch to ${l.label}`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Theme */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-md bg-white dark:bg-slate-900 dark:border-slate-700">
              {themeOptions.map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => onThemeChange(mode)}
                  className={`flex items-center justify-center w-7 h-7 transition-colors ${
                    themeMode === mode
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                  aria-label={label}
                  title={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>

            {/* FAQ */}
            <button
              onClick={onFAQClick}
              className="hidden sm:block px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors dark:text-slate-300 dark:hover:text-primary-400"
            >
              FAQs
            </button>

            {/* Contact */}
            <button
              onClick={onContactClick}
              className="hidden sm:block px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors dark:text-slate-300 dark:hover:text-primary-400"
            >
              Contact
            </button>

            {/* Dashboard */}
            {!showDashboard && (
              <button
                onClick={onDashboardClick}
                className="btn-ghost hidden sm:flex"
                aria-label="Demo Dashboard"
                title="Demo Dashboard"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>
      </div>

    </header>
  );
}