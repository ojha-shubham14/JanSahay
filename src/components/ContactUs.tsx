import { ArrowLeft, Mail, Phone, Info } from 'lucide-react';
import type { Language } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface ContactUsProps {
  lang: Language;
  onBack: () => void;
}

export function ContactUs({ lang, onBack }: ContactUsProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  return (
    <div className="portal-section p-5 sm:p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="flex items-center justify-center w-11 h-11 rounded-md bg-primary-50 flex-shrink-0 dark:bg-primary-900/30">
          <Mail className="w-6 h-6 text-primary-700 dark:text-primary-400" />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {tr('contactTitle')}
          </h2>

          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            {tr('contactSubtitle')}
          </p>
        </div>
      </div>

      {/* Contact options */}
      <div className="space-y-3">
        {/* Email */}
        <div className="border border-slate-200 rounded-md p-4 sm:p-5 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary-50 flex-shrink-0 dark:bg-primary-900/30">
              <Mail className="w-5 h-5 text-primary-700 dark:text-primary-400" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                {tr('contactEmailTitle')}
              </h3>

              <p className="text-sm text-slate-500 mt-1 dark:text-slate-400 leading-relaxed">
                {tr('contactEmailText')}
              </p>

              <a
                href="mailto:support@jansahay.in"
                className="inline-block mt-2 text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline dark:text-primary-400"
              >
                support@jansahay.in
              </a>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="border border-slate-200 rounded-md p-4 sm:p-5 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-slate-100 flex-shrink-0 dark:bg-slate-800">
              <Phone className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                {tr('contactHelpTitle')}
              </h3>

              <p className="text-sm text-slate-500 mt-1 leading-relaxed dark:text-slate-400">
                {tr('contactHelpText')}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border border-slate-200 bg-slate-50 rounded-md p-4 dark:bg-slate-950 dark:border-slate-700">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {tr('contactDisclaimer')}
            </p>
          </div>
        </div>
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