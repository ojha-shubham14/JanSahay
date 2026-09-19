import { Check } from 'lucide-react';
import type { Language } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface StepperProps {
  currentStep: number;
  lang: Language;
}

export function Stepper({ currentStep, lang }: StepperProps) {
  const tr = (key: TranslationKey) => t(lang, key);
  const steps = [
    { id: 1, label: tr('step1Title') },
    { id: 2, label: tr('step2Title') },
    { id: 3, label: tr('step3Title') },
    { id: 4, label: tr('step4Title') },
    { id: 5, label: tr('step5Title') },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-6 px-1 max-w-full overflow-x-auto py-1">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 flex-shrink-0 ${
                step.id < currentStep
                  ? 'bg-success-500 text-white'
                  : step.id === currentStep
                    ? 'bg-primary-600 text-white ring-2 sm:ring-4 ring-primary-100 dark:ring-primary-900/50'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {step.id < currentStep ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : step.id}
            </div>
            <span
              className={`text-xs sm:text-sm font-medium hidden md:inline max-w-[110px] truncate ${
                step.id <= currentStep ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
              }`}
              title={step.label}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-0.5 w-3 sm:w-6 lg:w-8 rounded-full transition-all duration-300 ${
              step.id < currentStep ? 'bg-success-500' : 'bg-slate-200 dark:bg-slate-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
