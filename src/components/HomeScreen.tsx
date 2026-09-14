import { useState } from 'react';
import { Mic, Store, GraduationCap, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import type { Language, Purpose } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface HomeScreenProps {
  lang: Language;
  onStart: (mode: 'guided' | 'conversation', purpose?: Purpose) => void;
}

export function HomeScreen({ lang, onStart }: HomeScreenProps) {
  const tr = (key: TranslationKey) => t(lang, key);
  const [view, setView] = useState<'flow' | 'main'>('flow');

  const flow = [tr('step1Title'), tr('step2Title'), tr('step3Title'), tr('step4Title')];

  if (view === 'flow') {
    return (
      <div className="animate-fade-in">
        <section className="max-w-xs mx-auto pt-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">{tr('howItWorks')}</h3>
          <div className="flex flex-col items-center">
            {flow.map((title, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 font-medium text-center mt-1.5 mb-1.5">{title}</p>
                {i < flow.length - 1 && <div className="w-px h-4 bg-slate-300" />}
              </div>
            ))}
          </div>
        </section>

                        <div className="mt-8 max-w-md mx-auto">
          <button
            onClick={() => setView('main')}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {tr('next')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setView('flow')}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {tr('back')}
      </button>

      {/* Hero */}
      <section className="text-center pb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 max-w-xl mx-auto leading-tight">
          {tr('heroTitle')}
        </h2>
        <p className="text-slate-500 mt-3 max-w-lg mx-auto text-base">
          {tr('heroSubtitle')}
        </p>
      </section>

      {/* Primary CTA */}
      <div className="space-y-3 max-w-md mx-auto">
                <button
          onClick={() => onStart('conversation')}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 flex-shrink-0">
            <Mic className="w-4 h-4" />
          </div>
          <p className="flex-1 text-center font-bold text-lg">{tr('tellUs')}</p>
          <ArrowRight className="w-5 h-5 flex-shrink-0" />
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{tr('orDivider')}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onStart('guided', 'business_project')}
            className="flex flex-col items-center gap-2.5 p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
          >
            <Store className="w-8 h-8 text-accent-600" />
            <span className="text-base font-semibold text-slate-700 text-center">{tr('businessLoan')}</span>
          </button>
          <button
            onClick={() => onStart('guided', 'education')}
            className="flex flex-col items-center gap-2.5 p-6 rounded-xl bg-white border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
          >
            <GraduationCap className="w-8 h-8 text-success-600" />
            <span className="text-base font-semibold text-slate-700 text-center">{tr('educationLoan')}</span>
          </button>
        </div>
      </div>

      {/* Trust disclaimer */}
      <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
        <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-500 leading-relaxed">{tr('trustDisclaimer')}</p>
      </div>
    </div>
  );
}