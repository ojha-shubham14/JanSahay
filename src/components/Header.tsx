import { Landmark, BarChart3 } from 'lucide-react';
import type { Language } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  onDashboardClick: () => void;
  onFAQClick: () => void;
  onContactClick: () => void;
  showDashboard: boolean;
}

const langLabels: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'தமிழ்' },
];

export function Header({
  lang,
  onLangChange,
  onDashboardClick,
  onFAQClick,
  onContactClick,
  showDashboard,
}: HeaderProps) {
    const tr = (key: TranslationKey) => t(lang, key);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 text-white shadow-sm flex-shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{tr('appName')}</h1>
            <p className="text-xs text-slate-500 leading-tight hidden sm:block">{tr('tagline')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            {langLabels.map((l) => (
              <button
                key={l.code}
                onClick={() => onLangChange(l.code)}
                className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  lang === l.code
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                aria-label={`Switch to ${l.label}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={onFAQClick}
            className="text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors hidden sm:block"
          >
            FAQs
          </button>
          <button
            onClick={onContactClick}
            className="text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors hidden sm:block"
          >
            Contact Us
          </button>
          {!showDashboard && (
            <button
              onClick={onDashboardClick}
              className="btn-ghost hidden sm:flex"
              aria-label="Demo Dashboard"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
