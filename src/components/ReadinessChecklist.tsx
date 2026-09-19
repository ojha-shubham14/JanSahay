import { useState } from 'react';
import { ClipboardCheck, Download, RotateCcw, Check, FileText } from 'lucide-react';
import type { Language, SchemeMatch, ApplicantProfile, RankedPartner } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface ReadinessChecklistProps {
  lang: Language;
  match: SchemeMatch;
  profile: ApplicantProfile;
  selectedPartner: RankedPartner | null;
  onReset: () => void;
}

export function ReadinessChecklist({ lang, match, profile, selectedPartner, onReset }: ReadinessChecklistProps) {
  const tr = (key: TranslationKey) => t(lang, key);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const checklistItems = match.scheme_id === 'education_loan'
    ? ['identityProof', 'incomeDocument', 'categoryCertificate', 'educationProof']
    : ['identityProof', 'incomeDocument', 'categoryCertificate', 'projectDetails'];

  const toggleItem = (item: string) => {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const generateSummary = () => {
    const lines: string[] = [];
    lines.push('=====================================');
    lines.push(`       ${tr('summaryTitle')} — JanSahay`);
    lines.push('=====================================');
    lines.push('');
    lines.push(`Date: ${new Date().toLocaleDateString()}`);
    lines.push('');
    lines.push(`--- ${tr('applicantInfo')} ---`);
    if (profile.applicant_name) lines.push(`${tr('questionName')}: ${profile.applicant_name}`);
    if (profile.applicant_age) lines.push(`${tr('questionAge')}: ${profile.applicant_age}`);
    lines.push(`${tr('questionIncome')}: ₹${profile.annual_family_income?.toLocaleString('en-IN') ?? 'N/A'}`);
    lines.push(`${tr('questionPurpose')}: ${profile.purpose === 'business_project' ? tr('purposeBusiness') : tr('purposeEducation')}`);
    lines.push(`${tr('questionCost')}: ₹${profile.estimated_cost?.toLocaleString('en-IN') ?? 'N/A'}`);
    if (profile.project_type) lines.push(`${tr('questionProjectType')}: ${profile.project_type}`);
    if (profile.education_status) {
      lines.push(`${tr('questionEducationStatus')}: ${profile.education_status === 'pursuing' ? tr('statusPursuing') : tr('statusPlanning')}`);
    }
    if (profile.location.display_name) lines.push(`${tr('questionLocation')}: ${profile.location.display_name}`);
    lines.push('');
    lines.push(`--- ${tr('recommendedScheme')} ---`);
    lines.push(`${tr('scheme')}: ${match.scheme_name ?? 'N/A'}`);
    lines.push(`${tr('potentialFinancing')}: ${match.funding_cap_pct ?? 'N/A'}%`);
    lines.push(`${tr('interestRate')}: ${match.interest_rate_range?.[0]}–${match.interest_rate_range?.[1]}% ${tr('perAnnum')}`);
    lines.push(`${tr('moratorium')}: ${match.moratorium_range?.[0]}–${match.moratorium_range?.[1]} ${tr('months')}`);
    lines.push('');
    lines.push(`--- ${tr('loanEstimate')} ---`);
    lines.push(`${tr('loanAmount')}: ₹${match.loan_amount?.toLocaleString('en-IN') ?? 'N/A'}`);
    lines.push('');
    if (selectedPartner) {
      lines.push(`--- ${tr('partnerDetails')} ---`);
      lines.push(`${tr('recommendedPartner')}: ${selectedPartner.name}`);
      lines.push(`${tr('kmAway')}: ${selectedPartner.distance_km}`);
      lines.push(`${tr('status')}: ${selectedPartner.type}`);
      lines.push('');
    }
    lines.push(`--- ${tr('disclaimer')} ---`);
    lines.push(tr('summaryDisclaimer'));
    lines.push('');
    lines.push('=====================================');

    return lines.join('\n');
  };

  const handleDownload = () => {
    const summary = generateSummary();
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jansahay-application-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50">
          <ClipboardCheck className="w-7 h-7 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{tr('beforeYouApply')}</h2>
          <p className="text-sm text-slate-500">{tr('readinessSubtitle')}</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3 mb-6">
        {checklistItems.map((item) => (
          <button
            key={item}
            onClick={() => toggleItem(item)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              checked[item]
                ? 'border-success-300 bg-success-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0 transition-all duration-200 ${
              checked[item] ? 'bg-success-500' : 'bg-slate-200'
            }`}>
              {checked[item] && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className={`text-sm font-medium ${checked[item] ? 'text-success-700' : 'text-slate-600'}`}>
              {tr(item as TranslationKey)}
            </span>
          </button>
        ))}
      </div>

      {/* Summary preview */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-600">{tr('summaryTitle')}</p>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-600 space-y-1">
          <p>{tr('recommendedScheme')}: <span className="font-medium text-slate-900">
  {match.scheme_name}
</span></p>
          <p>{tr('loanAmount')}: <span className="font-medium text-slate-900">
  ₹{match.loan_amount?.toLocaleString('en-IN')}
</span></p>
          {selectedPartner && (
  <p>
    {tr('recommendedPartner')}:{' '}
    <span className="font-medium text-slate-900">
  {selectedPartner.name}
</span>
  </p>
)}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 mb-6 p-3 rounded-xl bg-warning-50 border border-warning-200">
        <p className="text-xs text-warning-700">{tr('summaryDisclaimer')}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={handleDownload} className="btn-primary flex-1">
          <Download className="w-5 h-5" />
          {tr('downloadSummary')}
        </button>
        <button onClick={onReset} className="btn-secondary">
          <RotateCcw className="w-4 h-4" />
          {tr('startOver')}
        </button>
      </div>
    </div>
  );
}
