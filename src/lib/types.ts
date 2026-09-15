export type Purpose = 'business_project' | 'education';
export type EducationStatus = 'pursuing' | 'planning';
export type Language = 'en' | 'hi' | 'kn' | 'ta';
export type InputMode = 'guided' | 'conversation';
export type Step = 'home' | 'input' | 'scheme' | 'emi' | 'partner' | 'readiness';

export interface Scheme {
  scheme_id: string;
  name: string;
  purpose: Purpose;
  maximum_project_cost: number;
  maximum_financing_percent: number;
  interest_rate_min: number;
  interest_rate_max: number;
  moratorium_months_min: number;
  moratorium_months_max: number;
  data_status: string;
  source_name?: string;
  source_url?: string;
  last_verified?: string;
}

export interface SchemeMatch {
  eligible: boolean;
  reason?: string;
  scheme_name?: string;
  scheme_id?: string;
  loan_amount?: number;
  funding_cap_pct?: number;
  interest_rate_range?: [number, number];
  moratorium_range?: [number, number];
  reasoning?: string;
  checks?: { label: string; passed: boolean }[];
  comparisons?: { scheme_id: string; scheme_name: string; status: string; reason: string }[];
}

export interface Partner {
  partner_id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  city: string;
  schemes_handled: string[];
  npa_ratio: number;
  funds_available: boolean;
  accepting_applications: boolean;
  data_status: string;
}

export interface RankedPartner extends Partner {
  distance_km: number;
}

export interface EMIResult {
  emi: number;
  total_interest: number;
  total_repayment: number;
  principal_after_moratorium: number;
  schedule: ScheduleRow[];
}

export interface ScheduleRow {
  month: number;
  phase: 'moratorium' | 'repayment';
  opening_balance: number;
  emi: number;
  interest: number;
  principal_component: number;
  closing_balance: number;
}

export interface ApplicantProfile {
  applicant_name: string | null;
  applicant_age: number | null;
  annual_family_income: number | null;
  purpose: Purpose | null;
  estimated_cost: number | null;
  requested_loan_amount: number | null;
  education_status: EducationStatus | null;
  course: string | null;
  institution: string | null;
  project_type: string | null;
  location: {
    latitude: number | null;
    longitude: number | null;
    display_name: string | null;
  };
  language: Language;
}

export function createEmptyProfile(): ApplicantProfile {
  return {
    applicant_name: null,
    applicant_age: null,
    annual_family_income: null,
    purpose: null,
    estimated_cost: null,
    requested_loan_amount: null,
    education_status: null,
    course: null,
    institution: null,
    project_type: null,
    location: { latitude: null, longitude: null, display_name: null },
    language: 'en',
  };
}
