import { BarChart3, ArrowLeft, TrendingUp, MapPin, Building2, PieChart, Activity } from 'lucide-react';
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

  // Simulated data
  const totalApplications = 1284;
  const applicationsByCity: Record<string, number> = {
    Bengaluru: 312,
    Hyderabad: 218,
    Chennai: 195,
    Pune: 167,
    Delhi: 189,
    Kolkata: 112,
    Patna: 91,
  };
  const schemeDemand: Record<string, number> = {
    'Micro Finance Scheme': 542,
    'Term Loan Scheme': 398,
    'Educational Loan Scheme': 344,
  };
  const maxCityCount = Math.max(...Object.values(applicationsByCity));
  const maxSchemeCount = Math.max(...Object.values(schemeDemand));

  const acceptingPartners = partners.filter((p) => p.accepting_applications).length;
  const fundsAvailable = partners.filter((p) => p.funds_available).length;
  const totalCapacity = partners.length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50">
            <BarChart3 className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{tr('dashboard')}</h2>
            <p className="text-sm text-slate-500">{tr('dashboardSubtitle')}</p>
          </div>
        </div>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          {tr('backToHome')}
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary-600" />
            <p className="text-xs text-slate-500">{tr('totalApplications')}</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalApplications.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-success-600" />
            <p className="text-xs text-slate-500">{tr('availableCapacity')}</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{fundsAvailable}/{totalCapacity}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent-600" />
            <p className="text-xs text-slate-500">{tr('partnerWorkload')}</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{acceptingPartners}/{totalCapacity}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-primary-600" />
            <p className="text-xs text-slate-500">{tr('schemeDistribution')}</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{schemes.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scheme demand */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">{tr('schemeDemand')}</h3>
          <div className="space-y-3">
            {Object.entries(schemeDemand).map(([name, count]) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{name}</span>
                  <span className="text-xs font-bold text-slate-700">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all duration-500"
                    style={{ width: `${(count / maxSchemeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications by city */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">{tr('applicationsByCity')}</h3>
          <div className="space-y-3">
            {Object.entries(applicationsByCity).map(([city, count]) => (
              <div key={city}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {city}
                  </span>
                  <span className="text-xs font-bold text-slate-700">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-500 transition-all duration-500"
                    style={{ width: `${(count / maxCityCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated data label */}
      <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
        <p className="text-xs text-slate-400">{tr('simulatedData')}</p>
      </div>
    </div>
  );
}
