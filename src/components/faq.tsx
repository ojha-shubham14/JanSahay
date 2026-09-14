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
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {tr('backToHome')}
      </button>

      <section className="text-center mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 text-primary-600 mx-auto mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {tr('faqTitle')}
        </h2>

        <p className="text-slate-500 mt-2">
          {tr('faqSubtitle')}
        </p>
      </section>

      <div className="space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.question}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="flex-1 font-semibold text-slate-800">
                  {tr(item.question)}
                </span>

                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {tr(item.answer)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}