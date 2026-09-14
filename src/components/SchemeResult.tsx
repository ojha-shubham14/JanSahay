import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Check, X, AlertTriangle, Info } from 'lucide-react';
import type { Language, SchemeMatch } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface SchemeResultProps {
  lang: Language;
  match: SchemeMatch;
  onProceed: () => void;
  onReset: () => void;
}

export function SchemeResult({ lang, match, onProceed, onReset }: SchemeResultProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  if (!match.eligible) {
    return (
      <div className="card p-6 sm:p-8 animate-slide-up">
        <div className="flex flex-col items-center text-center py-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-error-50 mb-4">
            <XCircle className="w-8 h-8 text-error-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{tr('notEligible')}</h2>
          <p className="text-sm text-slate-600 max-w-md mb-6">{match.reason}</p>
          <button onClick={onReset} className="btn-secondary">
            <RotateCcw className="w-4 h-4" />
            {tr('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = (status: string): string => {
    if (status === 'best') return tr('bestMatchStatus');
    if (status === 'not_suitable') return tr('notSuitable');
    return tr('notApplicable');
  };

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      {/* Best match banner */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-primary-600 mb-2">{tr('bestMatch')}</p>
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-5 border border-primary-200/60">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success-100">
              <CheckCircle2 className="w-6 h-6 text-success-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary-900">{match.scheme_name}</h2>
          </div>
          <p className="text-sm text-primary-700">{match.reasoning}</p>
        </div>
      </div>

      {/* Why this scheme */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900 mb-3">{tr('whyScheme')}</h3>
        <div className="space-y-2">
          {match.checks?.map((check, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${
                check.passed ? 'bg-success-100' : 'bg-error-100'
              }`}>
                {check.passed
                  ? <Check className="w-3.5 h-3.5 text-success-600" />
                  : <X className="w-3.5 h-3.5 text-error-500" />}
              </div>
              <p className="text-sm text-slate-600">{check.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Loan summary */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900 mb-3">{tr('loanSummary')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-1">{tr('projectCost')}</p>
            <p className="text-lg font-bold text-slate-900">₹{match.loan_amount?.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-1">{tr('potentialFinancing')}</p>
            <p className="text-lg font-bold text-slate-900">{match.funding_cap_pct}%</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-1">{tr('interestRate')}</p>
            <p className="text-lg font-bold text-slate-900">
              {match.interest_rate_range?.[0]}–{match.interest_rate_range?.[1]}%
              <span className="text-xs font-normal text-slate-400 ml-1">{tr('perAnnum')}</span>
            </p>
            <p className="text-xs text-accent-600 mt-0.5">* {tr('illustrativeRange')}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-1">{tr('moratorium')}</p>
            <p className="text-lg font-bold text-slate-900">
              {match.moratorium_range?.[0]}–{match.moratorium_range?.[1]}
              <span className="text-sm font-normal text-slate-400 ml-1">{tr('months')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Compare schemes */}
      {match.comparisons && (
        <div className="mb-5">
          <h3 className="text-base font-bold text-slate-900 mb-3">{tr('compareSchemes')}</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold">{tr('scheme')}</th>
                  <th className="px-4 py-2.5 text-left font-semibold">{tr('status')}</th>
                  <th className="px-4 py-2.5 text-left font-semibold">{tr('reason')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {match.comparisons.map((c) => (
                  <tr key={c.scheme_id} className={c.status === 'best' ? 'bg-primary-50/50' : ''}>
                    <td className="px-4 py-3 font-medium text-slate-700">{c.scheme_name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        c.status === 'best'
                          ? 'bg-primary-100 text-primary-700'
                          : c.status === 'not_applicable'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-warning-100 text-warning-700'
                      }`}>
                        {statusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2 mb-6">
        <div className="flex items-start gap-2 p-3 rounded-xl bg-warning-50 border border-warning-200">
          <AlertTriangle className="w-4 h-4 text-warning-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-warning-700">{tr('finalSanctionNote')}</p>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">{tr('prototypeData')}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onProceed} className="btn-primary flex-1">
          {tr('proceedEMI')}
          <ArrowRight className="w-5 h-5" />
        </button>
        <button onClick={onReset} className="btn-secondary">
          <RotateCcw className="w-4 h-4" />
          {tr('startOver')}
        </button>
      </div>
    </div>
  );
}
