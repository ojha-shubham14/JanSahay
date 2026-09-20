import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type { Language, SchemeMatch } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface SchemeResultProps {
  lang: Language;
  match: SchemeMatch;
  onProceed: () => void;
  onReset: () => void;
}

export function SchemeResult({
  lang,
  match,
  onProceed,
  onReset,
}: SchemeResultProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  const schemeDisplayName = (schemeId?: string, fallback?: string) => {
    switch (schemeId) {
      case 'micro_finance':
        return tr('microFinanceScheme');
      case 'term_loan':
        return tr('termLoanScheme');
      case 'education_loan':
        return tr('educationLoanScheme');
      default:
        return fallback ?? 'N/A';
    }
  };

  const checkLabel = (index: number, fallback: string) => {
    const keys: TranslationKey[] = [
      'familyIncomeCheck',
      'purposeCheck',
      'projectCostCheck',
      'financingCheck',
    ];
    return index < keys.length ? tr(keys[index]) : fallback;
  };

  const comparisonReason = (reason: string) => {
    if (reason === 'Meets current demo rules') return tr('meetsRules');
    if (reason === 'Purpose does not match') return tr('purposeMismatch');
    if (reason === 'Exceeds configured limit') return tr('exceedsLimit');
    return reason;
  };

  if (!match.eligible) {
    return (
      <div className="portal-section p-5 sm:p-6 animate-slide-up">
        <div className="flex flex-col items-center text-center py-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-error-50 mb-4">
            <XCircle className="w-8 h-8 text-error-500" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {tr('notEligible')}
          </h2>

          <p className="text-sm text-slate-600 max-w-md mb-6">
            {match.reason}
          </p>

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
    <div className="portal-section p-5 sm:p-6 animate-slide-up">
      {/* Result heading */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary-700 mb-1">
          {tr('bestMatch')}
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          {schemeDisplayName(match.scheme_id, match.scheme_name)}
        </h2>
      </div>

      {/* Why this scheme */}
      <div className="mb-6">
        <div className="portal-notice border-primary-200 bg-primary-50/60">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary-100 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary-700" />
            </div>

            <div>
              <h3 className="font-semibold text-primary-900 mb-1">
                {tr('whyScheme')}
              </h3>

              <p className="text-sm text-primary-800 leading-relaxed">
                {tr('schemeMatchReason')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility checks */}
      {match.checks && match.checks.length > 0 && (
        <div className="mb-6">
          <h3 className="portal-section-title mb-3">
            {tr('whyScheme')}
          </h3>

          <div className="border border-slate-200 rounded-md divide-y divide-slate-200">
            {match.checks.map((check, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5"
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 ${
                    check.passed
                      ? 'bg-success-100'
                      : 'bg-error-100'
                  }`}
                >
                  {check.passed ? (
                    <Check className="w-3.5 h-3.5 text-success-600" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-error-500" />
                  )}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {checkLabel(i, check.label)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loan summary */}
      <div className="mb-6">
        <h3 className="portal-section-title mb-3">
          {tr('loanSummary')}
        </h3>

        <div className="border border-slate-200 rounded-md divide-y divide-slate-200">
          {/* Project cost */}
          <div className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-slate-500">
              {tr('projectCost')}
            </p>

            <p className="text-base font-semibold text-slate-900 text-right">
              ₹{match.loan_amount?.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Financing */}
          <div className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-slate-500">
              {tr('potentialFinancing')}
            </p>

            <p className="text-base font-semibold text-slate-900 text-right">
              {match.funding_cap_pct}%
            </p>
          </div>

          {/* Interest */}
          <div className="flex items-start justify-between gap-4 p-4">
            <p className="text-sm text-slate-500">
              {tr('interestRate')}
            </p>

            <div className="text-right">
              <p className="text-base font-semibold text-slate-900">
                {match.interest_rate_range?.[0]}–
                {match.interest_rate_range?.[1]}%
                <span className="text-xs font-normal text-slate-400 ml-1">
                  {tr('perAnnum')}
                </span>
              </p>

              <p className="text-xs text-slate-500 mt-1">
                * {tr('illustrativeRange')}
              </p>
            </div>
          </div>

          {/* Moratorium */}
          <div className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-slate-500">
              {tr('moratorium')}
            </p>

            <p className="text-base font-semibold text-slate-900 text-right">
              {match.moratorium_range?.[0]}–
              {match.moratorium_range?.[1]}
              <span className="text-sm font-normal text-slate-400 ml-1">
                {tr('months')}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Compare schemes */}
      {match.comparisons && (
        <div className="mb-6">
          <h3 className="portal-section-title mb-3">
            {tr('compareSchemes')}
          </h3>

          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    {tr('scheme')}
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    {tr('status')}
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    {tr('reason')}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {match.comparisons.map((c) => (
                  <tr
                    key={c.scheme_id}
                    className={
                      c.status === 'best'
                        ? 'bg-primary-50/50'
                        : 'bg-white'
                    }
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {schemeDisplayName(c.scheme_id, c.scheme_name)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          c.status === 'best'
                            ? 'bg-primary-100 text-primary-700'
                            : c.status === 'not_applicable'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-warning-100 text-warning-700'
                        }`}
                      >
                        {statusLabel(c.status)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-500 text-xs leading-relaxed">
                      {comparisonReason(c.reason)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Important notes */}
      <div className="space-y-3 mb-6">
        <div className="portal-notice border-warning-200 bg-warning-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning-600 flex-shrink-0 mt-0.5" />

            <p className="text-xs text-warning-800 leading-relaxed">
              {tr('finalSanctionNote')}
            </p>
          </div>
        </div>

        <div className="portal-notice">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />

            <p className="text-xs text-slate-600 leading-relaxed">
              {tr('prototypeData')}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onProceed}
          className="btn-primary flex-1"
        >
          {tr('proceedEMI')}
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onReset}
          className="btn-secondary"
        >
          <RotateCcw className="w-4 h-4" />
          {tr('startOver')}
        </button>
      </div>
    </div>
  );
}