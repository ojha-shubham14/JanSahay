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
    { id: 2, label: tr('step3Title') },
    { id: 3, label: tr('step4Title') },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm transition-all duration-300 ${
                step.id < currentStep
                  ? 'bg-success-500 text-white'
                  : step.id === currentStep
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                    : 'bg-slate-200 text-slate-400'
              }`}
            >
              {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={`text-sm font-medium hidden sm:inline ${
                step.id <= currentStep ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-0.5 w-6 sm:w-12 rounded-full transition-all duration-300 ${
              step.id < currentStep ? 'bg-success-500' : 'bg-slate-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}
