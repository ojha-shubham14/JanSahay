import type { Purpose, EducationStatus, SchemeMatch, Scheme } from '@/lib/types';
import { schemes } from '@/data/schemes';

const INCOME_LIMIT = 500000;
const MICRO_FINANCE_THRESHOLD = 140000;

function matchScheme(scheme: Scheme, cost: number, income: number, purpose: Purpose): SchemeMatch {
  const loanAmount = Math.min(cost * (scheme.maximum_financing_percent / 100), scheme.maximum_project_cost);
  return {
    eligible: true,
    scheme_name: scheme.name,
    scheme_id: scheme.scheme_id,
    loan_amount: Math.round(loanAmount),
    funding_cap_pct: scheme.maximum_financing_percent,
    interest_rate_range: [scheme.interest_rate_min, scheme.interest_rate_max],
    moratorium_range: [scheme.moratorium_months_min, scheme.moratorium_months_max],
    reasoning: `Project cost ₹${cost.toLocaleString('en-IN')} falls within the ${scheme.name} band.`,
    checks: [
      { label: 'Family income is within the stated income criterion', passed: income <= INCOME_LIMIT },
      { label: 'Your purpose matches the scheme', passed: true },
      { label: 'Your project cost falls within the applicable project range', passed: cost <= scheme.maximum_project_cost },
      { label: 'Requested financing is within the calculated limit', passed: loanAmount <= scheme.maximum_project_cost },
    ],
  };
}

function buildComparisons(matchedId: string, income: number, purpose: Purpose, cost: number) {
  return schemes.map((s) => {
    if (s.scheme_id === matchedId) {
      return { scheme_id: s.scheme_id, scheme_name: s.name, status: 'best', reason: 'Meets current demo rules' };
    }
    if (s.purpose !== purpose) {
      return { scheme_id: s.scheme_id, scheme_name: s.name, status: 'not_applicable', reason: 'Purpose does not match' };
    }
    if (cost > s.maximum_project_cost) {
      return { scheme_id: s.scheme_id, scheme_name: s.name, status: 'not_suitable', reason: 'Exceeds configured limit' };
    }
    return { scheme_id: s.scheme_id, scheme_name: s.name, status: 'not_suitable', reason: 'Exceeds configured limit' };
  });
}

export function recommendScheme(
  income: number,
  purpose: Purpose,
  cost: number,
  educationStatus?: EducationStatus,
): SchemeMatch {
  if (income <= 0 || cost <= 0) {
    return {
      eligible: false,
      reason: 'Income and cost must be positive values.',
    };
  }

  if (income > INCOME_LIMIT) {
    return {
      eligible: false,
      reason: `Family income ₹${income.toLocaleString('en-IN')} exceeds the ₹5,00,000 SC eligibility limit.`,
    };
  }

  if (purpose === 'education') {
    if (!educationStatus) {
      return {
        eligible: false,
        reason: 'Education status is required for education loans.',
      };
    }
    const educationScheme = schemes.find((s) => s.scheme_id === 'education_loan')!;
    const match = matchScheme(educationScheme, cost, income, purpose);
    match.comparisons = buildComparisons('education_loan', income, purpose, cost);
    return match;
  }

  // business_project — boundary at ₹1,40,000 is inclusive for micro finance
  let matchedScheme: Scheme;
  if (cost <= MICRO_FINANCE_THRESHOLD) {
    matchedScheme = schemes.find((s) => s.scheme_id === 'micro_finance')!;
  } else if (cost <= 5000000) {
    matchedScheme = schemes.find((s) => s.scheme_id === 'term_loan')!;
  } else {
    return {
      eligible: false,
      reason: `Project cost ₹${cost.toLocaleString('en-IN')} exceeds the maximum scheme coverage of ₹50,00,000.`,
    };
  }

  const match = matchScheme(matchedScheme, cost, income, purpose);
  match.comparisons = buildComparisons(matchedScheme.scheme_id, income, purpose, cost);
  return match;
}
