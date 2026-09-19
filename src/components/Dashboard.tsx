import {
  BarChart3,
  ArrowLeft,
  TrendingUp,
  MapPin,
  Building2,
  PieChart,
  Activity,
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

  // Simulated demo data
  const totalApplications = 1284;

  const applicationsByCity: Record<string, number> = {
    Bengaluru: 312,
    Hyderabad: 218,
    Chennai: 195,
    Delhi: 189,
    Pune: 167,
    Kolkata: 112,
    Patna: 91,
  };

  const schemeDemand: Record<string, number> = {
    'Micro Finance Scheme': 542,
    'Term Loan Scheme': 398,
    'Educational Loan Scheme': 344,
  };

  const sortedApplicationsByCity = Object.entries(applicationsByCity).sort(
    ([, countA], [, countB]) => countB - countA
  );

  const sortedSchemeDemand = Object.entries(schemeDemand).sort(
    ([, countA], [, countB]) => countB - countA
  );

  const maxCityCount = Math.max(
    ...Object.values(applicationsByCity)
  );

  const maxSchemeCount = Math.max(
    ...Object.values(schemeDemand)
  );

  const acceptingPartners = partners.filter(
    (p) => p.accepting_applications
  ).length;

  const fundsAvailable = partners.filter(
    (p) => p.funds_available
  ).length;

  const totalCapacity = partners.length;

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

      {/* Demo notice */}
      <div className="portal-notice mb-6 border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-900/20">
        <p className="text-xs sm:text-sm text-warning-800 dark:text-warning-300 leading-relaxed">
          {tr('simulatedData')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Applications */}
        <div className="border border-slate-200 rounded-md p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary-700 dark:text-primary-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('totalApplications')}
            </p>
          </div>

          <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {totalApplications.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Capacity */}
        <div className="border border-slate-200 rounded-md p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-success-600 dark:text-success-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('availableCapacity')}
            </p>
          </div>

          <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {fundsAvailable}/{totalCapacity}
          </p>
        </div>

        {/* Workload */}
        <div className="border border-slate-200 rounded-md p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent-600 dark:text-accent-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('partnerWorkload')}
            </p>
          </div>

          <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {acceptingPartners}/{totalCapacity}
          </p>
        </div>

        {/* Schemes */}
        <div className="border border-slate-200 rounded-md p-4 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-primary-700 dark:text-primary-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tr('schemeDistribution')}
            </p>
          </div>

          <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {schemes.length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scheme demand */}
        <div className="border border-slate-200 rounded-md p-5 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {tr('schemeDemand')}
            </h3>

            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {sortedSchemeDemand.map(
              ([name, count]) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5 gap-3">
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      {name}
                    </span>

                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {count}
                    </span>
                  </div>

                  <div className="h-2 rounded-sm bg-slate-100 overflow-hidden dark:bg-slate-800">
                    <div
                      className="h-full bg-primary-600 transition-all duration-500"
                      style={{
                        width: `${(count / maxSchemeCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Applications by city */}
        <div className="border border-slate-200 rounded-md p-5 bg-white dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {tr('applicationsByCity')}
            </h3>

            <MapPin className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {sortedApplicationsByCity.map(
              ([city, count]) => (
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
                      className="h-full bg-accent-500 transition-all duration-500"
                      style={{
                        width: `${(count / maxCityCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-400 text-center dark:text-slate-500">
          {tr('simulatedData')}
        </p>
      </div>
    </div>
  );
}