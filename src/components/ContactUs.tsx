import { ArrowLeft, Mail, Phone } from 'lucide-react';
import type { Language } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface ContactUsProps {
  lang: Language;
  onBack: () => void;
}

export function ContactUs({ lang, onBack }: ContactUsProps) {
  const tr = (key: TranslationKey) => t(lang, key);

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
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {tr('contactTitle')}
        </h2>

        <p className="text-slate-500 mt-2">
          {tr('contactSubtitle')}
        </p>
      </section>

      <div className="max-w-xl mx-auto space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                {tr('contactEmailTitle')}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {tr('contactEmailText')}
              </p>
              <a
                href="mailto:support@jansahay.in"
                className="inline-block mt-2 text-sm font-medium text-primary-700 hover:underline"
              >
                support@jansahay.in
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-800">
                {tr('contactHelpTitle')}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {tr('contactHelpText')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-600 leading-relaxed">
          {tr('contactDisclaimer')}
        </div>
      </div>
    </div>
  );
}