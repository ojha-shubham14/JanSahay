import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { Language } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface FAQProps {
  lang: Language;
  onBack: () => void;
}

const faqItems: {
  question: TranslationKey;
  answer: TranslationKey;
}[] = [
  {
    question: 'faqWhatIs',
    answer: 'faqWhatIsAnswer',
  },
  {
    question: 'faqWhoCanUse',
    answer: 'faqWhoCanUseAnswer',
  },
  {
    question: 'faqHowMatchingWorks',
    answer: 'faqHowMatchingWorksAnswer',
  },
  {
    question: 'faqIsLoanGuaranteed',
    answer: 'faqIsLoanGuaranteedAnswer',
  },
  {
    question: 'faqWhatDocuments',
    answer: 'faqWhatDocumentsAnswer',
  },
  {
    question: 'faqWhatIsChannelPartner',
    answer: 'faqWhatIsChannelPartnerAnswer',
  },
];

export function FAQ({ lang, onBack }: FAQProps) {
  const tr = (key: TranslationKey) => t(lang, key);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="portal-section p-5 sm:p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="flex items-center justify-center w-11 h-11 rounded-md bg-primary-50 flex-shrink-0 dark:bg-primary-900/30">
          <HelpCircle className="w-6 h-6 text-primary-700 dark:text-primary-400" />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {tr('faqTitle')}
          </h2>

          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            {tr('faqSubtitle')}
          </p>
        </div>
      </div>

      {/* FAQ list */}
      <div className="space-y-2">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.question}
              className={`border rounded-md overflow-hidden transition-colors duration-150 ${
                isOpen
                  ? 'border-primary-200 dark:border-primary-800'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className="w-full flex items-center gap-3 p-4 text-left bg-white hover:bg-slate-50 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800"
                aria-expanded={isOpen}
              >
                <span className="flex-1 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100">
                  {tr(item.question)}
                </span>

                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-primary-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-3 border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tr(item.answer)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Back */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          {tr('backToHome')}
        </button>
      </div>
    </div>
  );
}