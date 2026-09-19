import { useState } from 'react';
import {
  ClipboardCheck,
  Download,
  RotateCcw,
  Check,
  FileText,
} from 'lucide-react';

import type {
  Language,
  SchemeMatch,
  ApplicantProfile,
  RankedPartner,
} from '@/lib/types';

import { t, type TranslationKey } from '@/i18n/translations';

interface ReadinessChecklistProps {
  lang: Language;
  match: SchemeMatch;
  profile: ApplicantProfile;
  selectedPartner: RankedPartner | null;
  onReset: () => void;
}

export function ReadinessChecklist({
  lang,
  match,
  profile,
  selectedPartner,
  onReset,
}: ReadinessChecklistProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const checklistItems =
    match.scheme_id === 'education_loan'
      ? [
          'identityProof',
          'incomeDocument',
          'categoryCertificate',
          'educationProof',
        ]
      : [
          'identityProof',
          'incomeDocument',
          'categoryCertificate',
          'projectDetails',
        ];

  const toggleItem = (item: string) => {
    setChecked((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
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

    if (profile.applicant_name) {
      lines.push(
        `${tr('questionName')}: ${profile.applicant_name}`
      );
    }

    if (profile.applicant_age) {
      lines.push(
        `${tr('questionAge')}: ${profile.applicant_age}`
      );
    }

    lines.push(
      `${tr('questionIncome')}: ₹${
        profile.annual_family_income?.toLocaleString('en-IN') ?? 'N/A'
      }`
    );

    lines.push(
      `${tr('questionPurpose')}: ${
        profile.purpose === 'business_project'
          ? tr('purposeBusiness')
          : tr('purposeEducation')
      }`
    );

    lines.push(
      `${tr('questionCost')}: ₹${
        profile.estimated_cost?.toLocaleString('en-IN') ?? 'N/A'
      }`
    );

    if (profile.project_type) {
      lines.push(
        `${tr('questionProjectType')}: ${profile.project_type}`
      );
    }

    if (profile.education_status) {
      lines.push(
        `${tr('questionEducationStatus')}: ${
          profile.education_status === 'pursuing'
            ? tr('statusPursuing')
            : tr('statusPlanning')
        }`
      );
    }

    if (profile.location.display_name) {
      lines.push(
        `${tr('questionLocation')}: ${profile.location.display_name}`
      );
    }

    lines.push('');

    lines.push(`--- ${tr('recommendedScheme')} ---`);

    lines.push(
      `${tr('scheme')}: ${match.scheme_name ?? 'N/A'}`
    );

    lines.push(
      `${tr('potentialFinancing')}: ${
        match.funding_cap_pct ?? 'N/A'
      }%`
    );

    lines.push(
      `${tr('interestRate')}: ${
        match.interest_rate_range?.[0]
      }–${match.interest_rate_range?.[1]}% ${tr('perAnnum')}`
    );

    lines.push(
      `${tr('moratorium')}: ${
        match.moratorium_range?.[0]
      }–${match.moratorium_range?.[1]} ${tr('months')}`
    );

    lines.push('');

    lines.push(`--- ${tr('loanEstimate')} ---`);

    lines.push(
      `${tr('loanAmount')}: ₹${
        match.loan_amount?.toLocaleString('en-IN') ?? 'N/A'
      }`
    );

    lines.push('');

    if (selectedPartner) {
      lines.push(`--- ${tr('partnerDetails')} ---`);

      lines.push(
        `${tr('recommendedPartner')}: ${selectedPartner.name}`
      );

      lines.push(
        `${tr('kmAway')}: ${selectedPartner.distance_km}`
      );

      lines.push(
        `${tr('status')}: ${selectedPartner.type}`
      );

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

    const blob = new Blob([summary], {
      type: 'text/plain',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'jansahay-application-summary.txt';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const completedCount = checklistItems.filter(
    (item) => checked[item]
  ).length;

  const allCompleted =
    completedCount === checklistItems.length;

  return (
    <div className="portal-section p-5 sm:p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="flex items-center justify-center w-11 h-11 rounded-md bg-primary-50 flex-shrink-0 dark:bg-primary-900/30">
          <ClipboardCheck className="w-6 h-6 text-primary-700 dark:text-primary-400" />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {tr('beforeYouApply')}
          </h2>

          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
            {tr('readinessSubtitle')}
          </p>
        </div>
      </div>

      {/* Checklist progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {completedCount} / {checklistItems.length} completed
          </p>

          {allCompleted && (
            <span className="text-xs font-semibold text-success-700 dark:text-success-400">
              Ready to proceed
            </span>
          )}
        </div>

        <div className="h-2 bg-slate-100 rounded-sm overflow-hidden dark:bg-slate-800">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{
              width: `${
                checklistItems.length > 0
                  ? (completedCount / checklistItems.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3 mb-6">
        {checklistItems.map((item) => {
          const isChecked = Boolean(checked[item]);

          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleItem(item)}
              className={`w-full flex items-center gap-3 p-4 rounded-md border text-left transition-colors duration-150 ${
                isChecked
                  ? 'border-success-300 bg-success-50 dark:border-success-700 dark:bg-success-900/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
              }`}
            >
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-sm flex-shrink-0 border transition-colors ${
                  isChecked
                    ? 'bg-success-600 border-success-600'
                    : 'bg-white border-slate-300 dark:bg-slate-900 dark:border-slate-600'
                }`}
              >
                {isChecked && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>

              <span
                className={`text-sm font-medium ${
                  isChecked
                    ? 'text-success-700 dark:text-success-400'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {tr(item as TranslationKey)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Summary preview */}
      <div className="mb-6 portal-notice">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-slate-500" />

          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {tr('summaryTitle')}
          </p>
        </div>

        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p>
            {tr('recommendedScheme')}:{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {match.scheme_name}
            </span>
          </p>

          <p>
            {tr('loanAmount')}:{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              ₹{match.loan_amount?.toLocaleString('en-IN') ?? 'N/A'}
            </span>
          </p>

          {selectedPartner && (
            <p>
              {tr('recommendedPartner')}:{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedPartner.name}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 border border-warning-200 bg-warning-50 rounded-md p-4 dark:border-warning-800 dark:bg-warning-900/20">
        <p className="text-xs sm:text-sm text-warning-800 dark:text-warning-300 leading-relaxed">
          {tr('summaryDisclaimer')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="btn-primary flex-1"
        >
          <Download className="w-5 h-5" />
          {tr('downloadSummary')}
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