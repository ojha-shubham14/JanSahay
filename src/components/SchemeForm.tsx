import { useState } from 'react';
import { AlertCircle, ArrowRight, Briefcase, GraduationCap, IndianRupee } from 'lucide-react';
import type { Purpose, EducationStatus, SchemeMatch } from '@/lib/types';
import { recommendScheme } from '@/lib/recommender';

interface SchemeFormProps {
  onResult: (match: SchemeMatch, formData: FormState) => void;
}

export interface FormState {
  annual_family_income: number;
  purpose: Purpose;
  estimated_cost: number;
  education_status?: EducationStatus;
}

export function SchemeForm({ onResult }: SchemeFormProps) {
  const [income, setIncome] = useState('');
  const [purpose, setPurpose] = useState<Purpose | ''>('');
  const [cost, setCost] = useState('');
  const [educationStatus, setEducationStatus] = useState<EducationStatus | ''>('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!income || !purpose || !cost) {
      setError('Please fill in all required fields.');
      return;
    }

    const incomeNum = Number(income);
    const costNum = Number(cost);

    if (incomeNum <= 0 || costNum <= 0) {
      setError('Income and cost must be positive numbers.');
      return;
    }

    if (purpose === 'education' && !educationStatus) {
      setError('Please select your education status.');
      return;
    }

    const result = recommendScheme(
      incomeNum,
      purpose as Purpose,
      costNum,
      educationStatus || undefined,
    );

    const formData: FormState = {
      annual_family_income: incomeNum,
      purpose: purpose as Purpose,
      estimated_cost: costNum,
      education_status: educationStatus || undefined,
    };

    onResult(result, formData);
  };

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Check Your Eligibility</h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter your details to find the right concessional credit scheme for your family.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Income */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Annual Family Income <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 250000"
              className="input-field pl-10"
              min="1"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Must be ≤ ₹5,00,000 for SC eligibility</p>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Purpose <span className="text-error-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPurpose('business_project')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                purpose === 'business_project'
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <Briefcase className={`w-5 h-5 ${purpose === 'business_project' ? 'text-primary-600' : 'text-slate-400'}`} />
              <span className="font-medium text-sm">Business / Project</span>
            </button>
            <button
              type="button"
              onClick={() => setPurpose('education')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                purpose === 'education'
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <GraduationCap className={`w-5 h-5 ${purpose === 'education' ? 'text-primary-600' : 'text-slate-400'}`} />
              <span className="font-medium text-sm">Education</span>
            </button>
          </div>
        </div>

        {/* Cost */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            {purpose === 'education' ? 'Course Fee' : 'Estimated Project Cost'} <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder={purpose === 'education' ? 'e.g. 500000' : 'e.g. 120000'}
              className="input-field pl-10"
              min="1"
            />
          </div>
        </div>

        {/* Education status (conditional) */}
        {purpose === 'education' && (
          <div className="animate-fade-in">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Education Status <span className="text-error-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEducationStatus('pursuing')}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  educationStatus === 'pursuing'
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                Currently Pursuing
              </button>
              <button
                type="button"
                onClick={() => setEducationStatus('planning')}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  educationStatus === 'planning'
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                Planning to Enroll
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-error-50 border border-error-200 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="btn-primary w-full">
          Find My Scheme
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
