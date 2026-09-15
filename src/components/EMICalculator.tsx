import { useState, useMemo } from 'react';
import { Calculator, ArrowRight, RotateCcw, TrendingDown, Wallet, CalendarClock, Info } from 'lucide-react';
import type { Language, SchemeMatch, EMIResult } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';
import { calculateEMI } from '@/lib/emi';

interface EMICalculatorProps {
  lang: Language;
  match: SchemeMatch;
  onProceed: () => void;
  onReset: () => void;
}

export function EMICalculator({ lang, match, onProceed, onReset }: EMICalculatorProps) {
  const tr = (key: TranslationKey) => t(lang, key);
  const [rateMin, rateMax] = match.interest_rate_range ?? [6.5, 10];
  const [morMin, morMax] = match.moratorium_range ?? [6, 12];
  const defaultRate = ((rateMin + rateMax) / 2).toFixed(1);

  const [loanAmount, setLoanAmount] = useState(String(match.loan_amount ?? 0));
  const [interestRate, setInterestRate] = useState(defaultRate);
  const [tenureMonths, setTenureMonths] = useState('60');
  const [moratoriumMonths, setMoratoriumMonths] = useState(String(morMin));

  const result: EMIResult | null = useMemo(() => {
    const principal = Number(loanAmount);
    const rate = Number(interestRate);
    const tenure = Number(tenureMonths);
    const moratorium = Number(moratoriumMonths);
    if (!principal || !rate || !tenure || principal <= 0 || tenure <= moratorium) return null;
    return calculateEMI(principal, rate, tenure, moratorium);
  }, [loanAmount, interestRate, tenureMonths, moratoriumMonths]);

  const showSchedule = result && result.schedule.length <= 24;

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50">
          <Calculator className="w-7 h-7 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{tr('emiCalculator')}</h2>
          <p className="text-sm text-slate-500">Adjust the values to estimate your monthly EMI and total repayment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{tr('loanAmount')} (₹)</label>
            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="input-field" min="1" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
             Interest rate used for estimate (%)
            </label>            <div className="flex items-center gap-3">
              <input type="range" min={rateMin} max={rateMax} step="0.1" value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)} className="flex-1 accent-primary-600" />
              <span className="text-sm font-bold text-slate-900 w-14 text-right">{Number(interestRate).toFixed(1)}%</span>
            </div>
              <p className="text-xs text-slate-400 mt-1"> Move the slider to see how your EMI changes · {rateMin}% – {rateMax}% {tr('perAnnum')}</p>
              <p className="text-xs text-slate-500 mt-2">Your actual interest rate will be decided by the authorized Channel Partner.</p>
            </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{tr('repaymentPeriod')}</label>
            <input type="number" value={tenureMonths} onChange={(e) => setTenureMonths(e.target.value)} className="input-field" min="1" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{tr('moratoriumLabel')}</label>
            <div className="flex items-center gap-3">
              <input type="range" min={morMin} max={morMax} step="1" value={moratoriumMonths}
                onChange={(e) => setMoratoriumMonths(e.target.value)} className="flex-1 accent-primary-600" />
              <span className="text-sm font-bold text-slate-900 w-14 text-right">{moratoriumMonths}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{morMin} – {morMax} {tr('months')}</p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white animate-scale-in">
                <p className="text-sm text-primary-100 mb-1">{tr('monthlyEMI')}</p>
                <p className="text-4xl font-bold">₹{result.emi.toLocaleString('en-IN')}</p>
                <p className="text-xs text-primary-200 mt-2">{tr('estimatedRepayment')}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning-100">
                    <CalendarClock className="w-5 h-5 text-warning-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{tr('principal')} ({tr('afterMoratorium')})</p>
                    <p className="text-base font-bold text-slate-900">₹{result.principal_after_moratorium.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-100">
                    <TrendingDown className="w-5 h-5 text-accent-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{tr('totalInterest')}</p>
                    <p className="text-base font-bold text-slate-900">₹{result.total_interest.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success-100">
                    <Wallet className="w-5 h-5 text-success-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{tr('totalRepayment')}</p>
                    <p className="text-base font-bold text-slate-900">₹{result.total_repayment.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-slate-400 p-8 text-center">
              {tr('tenure')} {tr('moratorium')}
            </div>
          )}
        </div>
      </div>

      {/* Moratorium note */}
      <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-warning-50 border border-warning-200">
        <Info className="w-4 h-4 text-warning-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-warning-700">{tr('moratoriumNote')}</p>
      </div>

      {/* Schedule */}
      {result && showSchedule && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-sm font-bold text-slate-700 mb-3">{tr('repaymentSchedule')}</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-64">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">{tr('month')}</th>
                  <th className="px-3 py-2 text-right font-semibold">{tr('opening')}</th>
                  <th className="px-3 py-2 text-right font-semibold">EMI</th>
                  <th className="px-3 py-2 text-right font-semibold">{tr('interestCol')}</th>
                  <th className="px-3 py-2 text-right font-semibold">{tr('principalCol')}</th>
                  <th className="px-3 py-2 text-right font-semibold">{tr('closing')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.schedule.map((row) => (
                  <tr key={row.month} className={row.phase === 'moratorium' ? 'bg-warning-50/40' : ''}>
                    <td className="px-3 py-1.5 text-slate-700 font-medium">{row.month}</td>
                    <td className="px-3 py-1.5 text-right text-slate-600 text-xs">₹{row.opening_balance.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-slate-600 text-xs">{row.emi ? `₹${row.emi.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-3 py-1.5 text-right text-slate-600 text-xs">₹{row.interest.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-slate-600 text-xs">{row.principal_component ? `₹${row.principal_component.toLocaleString('en-IN')}` : '—'}</td>
                    <td className="px-3 py-1.5 text-right text-slate-600 text-xs">₹{row.closing_balance.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button onClick={onProceed} className="btn-primary flex-1">
          {tr('findPartners')}
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
