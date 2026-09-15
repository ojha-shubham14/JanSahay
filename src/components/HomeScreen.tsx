import { useState } from 'react';
import {
  Mic,
  Store,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Info,
  Globe2,
} from 'lucide-react';
import type { Language, Purpose } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface HomeScreenProps {
  lang: Language;
  onLangChange: (newLang: Language) => void;
  onStart: (mode: 'guided' | 'conversation', purpose?: Purpose) => void;
}

export function HomeScreen({ lang, onLangChange, onStart }: HomeScreenProps) {
  const tr = (key: TranslationKey) => t(lang, key);
  const [view, setView] = useState<'flow' | 'main'>('flow');
  const [showLoanIntro, setShowLoanIntro] = useState(false);
  
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(lang);

  const flow = [tr('step1Title'), tr('step2Title'), tr('step3Title'), tr('step4Title')];
  
  const languages: { code: Language; native: string; english: string }[] = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'hi', native: 'हिंदी', english: 'Hindi' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
];
  if (showLanguageModal) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-[2px] px-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 animate-popup-attention">

        {/* Globe icon */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Globe2 className="w-7 h-7" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 dark:text-white">
          {tr('languagePrompt')}
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-center text-slate-500 mt-2 dark:text-slate-400">
          {tr('languagePromptSubtitle')}
        </p>

        {/* Language buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {languages.map((language) => {
            const selected = selectedLanguage === language.code;

            return (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className={`rounded-xl border-2 px-3 py-3 transition-all duration-200 ${
                  selected
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm dark:border-primary-400 dark:bg-primary-950/40 dark:text-primary-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-primary-700'
                }`}
              >
                <div className="font-bold text-base">
                  {language.native}
                </div>

                <div className="text-xs mt-1 opacity-70">
                  {language.english}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={() => {
            onLangChange(selectedLanguage);
            setShowLanguageModal(false);
          }}
          className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3.5 text-white font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all duration-200 shadow-md"
        >
          {tr('continueLanguage')}
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
  if (view === 'flow') {
    return (
            <div key={lang} className="animate-fade-in">
        <section className="max-w-xs mx-auto pt-6">
         <h3 className="text-lg font-bold text-slate-900 mb-6 text-center dark:text-slate-100">{tr('howItWorks')}</h3>
          <div className="flex flex-col items-center">
            {flow.map((title, i) => (
              <div
                key={i}
                className="flex flex-col items-center animate-slide-up [animation-fill-mode:backwards]"
                style={{ animationDelay: `${i * 800}ms` }}
              >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm dark:bg-primary-900/40 dark:text-primary-300">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 font-medium text-center mt-1.5 mb-1.5 dark:text-slate-300">{title}</p>
                {i < flow.length - 1 && <div className="w-px h-4 bg-slate-300 dark:bg-slate-700" />}
              </div>
            ))}
          </div>
        </section>

        <div
          className="mt-8 text-center animate-scale-in [animation-fill-mode:backwards]"
          style={{ animationDelay: `${flow.length * 900}ms` }}
        >
          <button
            onClick={() => {
              setView('main');
              setShowLoanIntro(true);
            }
}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {tr('next')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setView('flow')}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-4 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft className="w-4 h-4" />
        {tr('back')}
      </button>

      {/* Hero */}
      <section className="text-center pb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 max-w-xl mx-auto leading-tight dark:text-slate-100">
          {tr('heroTitle')}
        </h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto text-base dark:text-slate-400">
          {tr('heroSubtitle')}
        </p>
      </section>

      {/* Primary CTA */}
      <div className="space-y-3 max-w-md mx-auto">
                <button
          onClick={() => onStart('conversation')}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 flex-shrink-0 dark:bg-white/10">
            <Mic className="w-4 h-4" />
          </div>
          <p className="flex-1 text-center font-bold text-lg">{tr('tellUs')}</p>
          <ArrowRight className="w-5 h-5 flex-shrink-0" />
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide dark:text-slate-500">{tr('orDivider')}</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onStart('guided', 'business_project')}
            className="flex flex-col items-center gap-2.5 p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-primary-700 dark:hover:bg-primary-950/30"
          >
            <Store className="w-8 h-8 text-accent-600" />
            <span className="text-base font-semibold text-slate-700 text-center dark:text-slate-200">{tr('businessLoan')}</span>
          </button>
          <button
            onClick={() => onStart('guided', 'education')}
            className="flex flex-col items-center gap-2.5 p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-primary-700 dark:hover:bg-primary-950/30"
          >
            <GraduationCap className="w-8 h-8 text-success-600" />
            <span className="text-base font-semibold text-slate-700 text-center dark:text-slate-200">{tr('educationLoan')}</span>
          </button>
        </div>
      </div>

      {/* Trust disclaimer */}
            {/* Trust disclaimer */}
      <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60 dark:bg-slate-900 dark:border-slate-700/60">
        <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5 dark:text-slate-500" />
        <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">{tr('trustDisclaimer')}</p>
      </div>

      {/* Loan introduction popup */}
      {showLoanIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 animate-fade-in">     
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 animate-popup-attention">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                  Disclaimer
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                JanSahay helps you find and understand government schemes. Final eligibility and approval are decided by the concerned authority              </p>

            <button
              onClick={() => setShowLoanIntro(false)}
              className="mt-6 w-full rounded-xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}