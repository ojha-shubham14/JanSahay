import type { Scheme } from '@/lib/types';

export const schemes: Scheme[] = [
  {
    scheme_id: 'micro_finance',
    name: 'Micro Finance Scheme',
    purpose: 'business_project',
    maximum_project_cost: 140000,
    maximum_financing_percent: 90,
    interest_rate_min: 6.5,
    interest_rate_max: 8.0,
    moratorium_months_min: 3,
    moratorium_months_max: 6,
    data_status: 'illustrative_demo',
  },
  {
    scheme_id: 'term_loan',
    name: 'Term Loan Scheme',
    purpose: 'business_project',
    maximum_project_cost: 5000000,
    maximum_financing_percent: 90,
    interest_rate_min: 8.0,
    interest_rate_max: 15.0,
    moratorium_months_min: 6,
    moratorium_months_max: 12,
    data_status: 'illustrative_demo',
  },
  {
    scheme_id: 'education_loan',
    name: 'Educational Loan Scheme',
    purpose: 'education',
    maximum_project_cost: 2000000,
    maximum_financing_percent: 90,
    interest_rate_min: 6.5,
    interest_rate_max: 10.0,
    moratorium_months_min: 6,
    moratorium_months_max: 12,
    data_status: 'illustrative_demo',
  },
];

export function getSchemeById(id: string): Scheme | undefined {
  return schemes.find((s) => s.scheme_id === id);
}
