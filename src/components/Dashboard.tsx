import {
  BarChart3,
  ArrowLeft,
  Building2,
  MapPin,
  PieChart,
  Database,
  CheckCircle2,
  WalletCards,
} from 'lucide-react';

import type { Language } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';
import { schemes } from '@/data/schemes';
import { partners } from '@/data/partners';

interface DashboardProps {
  lang: Language;
  onBack: () => void;
}

export function Dashboard({ lang, onBack }: DashboardProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  const schemeDisplayName = (schemeId: string, fallback: string) => {
    switch (schemeId) {
      case 'micro_finance':
        return tr('microFinanceScheme');
      case 'term_loan':
        return tr('termLoanScheme');
      case 'education_loan':
        return tr('educationLoanScheme');
      default:
        return fallback;
    }
  };

  /*
   * IMPORTANT:
   *
   * This dashboard intentionally contains NO invented application numbers,
   * loan amounts, success rates, or demand percentages.
   *
   * Every number below is calculated from the actual prototype datasets:
   *   - src/data/schemes.ts
   *   - src/data/partners.ts
   *
   * This makes the dashboard defensible during an SIH demo.
   */

  const totalSchemes = schemes.length;
  const totalPartners = partners.length;

  const cities = Array.from(
    new Set(partners.map((partner) => partner.city))
  ).sort((a, b) => a.localeCompare(b));

  const acceptingPartners = partners.filter(
    (partner) => partner.accepting_applications
  ).length;

  const fundedPartners = partners.filter(
    (partner) => partner.funds_available
  ).length;

  const acceptingAndFunded = partners.filter(
    (partner) =>
      partner.accepting_applications && partner.funds_available
  ).length;

  const partnersByCity = cities
    .map((city) => ({
      city,
      count: partners.filter((partner) => partner.city === city).length,
    }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));

  const schemeCoverage = schemes.map((scheme) => ({
    id: scheme.scheme_id,
    name: schemeDisplayName(scheme.scheme_id, scheme.name),
    count: partners.filter((partner) =>
      partner.schemes_handled.includes(scheme.scheme_id)
    ).length,
  }));

  const maxCityCount = Math.max(
    1,
    ...partnersByCity.map((item) => item.count)
  );

  const maxSchemeCoverage = Math.max(
    1,
    ...schemeCoverage.map((item) => item.count)
  );

  return (
    <div className="portal-section p-5 sm:p-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-md bg-primary-50 flex-shrink-0 dark:bg-primary-900/30">
            <BarChart3 className="w-6 h-6 text-primary-700 dark:text-primary-400" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {tr('dashboard')}
            </h2>

            <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
              {tr('dashboardSubtitle')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="btn-secondary self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          {tr('backToHome')}
        </button>
      </div>

      {/* Dataset notice */}
      <div className="portal-notice mb-6 border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-950/30">
        <div className="flex items-start gap-3">
          <Database className="w-4 h-4 mt-0.5 text-primary-700 dark:text-primary-400 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-primary-800 dark:text-primary-300 leading-relaxed">
            {tr('datasetNote')}
          </p>
        </div>
      </div>

      {/* Dataset-derived stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="border border-slate-200 rounded-md p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-primary-700 dark:text-primary-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('configuredSchemes')}
            </p>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {totalSchemes}
          </p>
        </div>

        <div className="border border-slate-200 rounded-md p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-primary-700 dark:text-primary-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('partnerRecords')}
            </p>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {totalPartners}
          </p>
        </div>

        <div className="border border-slate-200 rounded-md p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-accent-600 dark:text-accent-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('citiesCovered')}
            </p>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {cities.length}
          </p>
        </div>

        <div className="border border-slate-200 rounded-md p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('acceptingPartnerRecords')}
            </p>
          </div>
          <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {acceptingPartners}/{totalPartners}
          </p>
        </div>
      </div>

      {/* Partner records by city + scheme coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-slate-200 rounded-md p-5 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {tr('partnersByCity')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
                {tr('datasetDerived')}
              </p>
            </div>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {partnersByCity.map(({ city, count }) => (
              <div key={city}>
                <div className="flex items-center justify-between mb-1.5 gap-3">
                  <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {city}
                  </span>

                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {count}
                  </span>
                </div>

                <div className="h-2 rounded-sm bg-slate-100 overflow-hidden dark:bg-slate-800">
                  <div
                    className="h-full bg-primary-600 transition-all duration-500"
                    style={{
                      width: `${(count / maxCityCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 rounded-md p-5 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {tr('schemeCoverage')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
                {tr('datasetDerived')}
              </p>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {schemeCoverage.map(({ id, name, count }) => (
              <div key={id}>
                <div className="flex items-center justify-between mb-1.5 gap-3">
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {name}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {count}/{totalPartners}
                  </span>
                </div>

                <div className="h-2 rounded-sm bg-slate-100 overflow-hidden dark:bg-slate-800">
                  <div
                    className="h-full bg-accent-500 transition-all duration-500"
                    style={{
                      width: `${(count / maxSchemeCoverage) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner availability */}
      <div className="mt-4 border border-slate-200 rounded-md p-5 bg-white dark:bg-slate-900 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {tr('partnerStatus')}
            </h3>
            <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">
              {tr('datasetDerived')}
            </p>
          </div>
          <WalletCards className="w-4 h-4 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('acceptingPartnerRecords')}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {acceptingPartners}/{totalPartners}
            </p>
          </div>

          <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('fundsAvailableLabel')}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {fundedPartners}/{totalPartners}
            </p>
          </div>

          <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('acceptingAndFunded')}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {acceptingAndFunded}/{totalPartners}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-400 text-center dark:text-slate-500">
          {tr('datasetNote')}
        </p>
      </div>
    </div>
  );
}
