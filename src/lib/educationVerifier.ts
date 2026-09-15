import { educationInstitutions } from '@/data/educationInstitutions';

export type EducationVerificationStatus =
  | 'verified'
  | 'manual_review'
  | 'not_found';

export interface EducationVerificationResult {
  status: EducationVerificationStatus;
  authority: string;
  message: string;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function detectAuthority(course: string): string {
  const normalizedCourse = normalize(course);

  if (
    normalizedCourse.includes('b.tech') ||
    normalizedCourse.includes('btech') ||
    normalizedCourse.includes('m.tech') ||
    normalizedCourse.includes('mtech') ||
    normalizedCourse.includes('engineering') ||
    normalizedCourse.includes('computer science')
  ) {
    return 'AICTE';
  }

  if (
    normalizedCourse.includes('nursing') ||
    normalizedCourse.includes('b.sc nursing') ||
    normalizedCourse.includes('gnm')
  ) {
    return 'Indian Nursing Council (INC)';
  }

  if (
    normalizedCourse.includes('pharmacy') ||
    normalizedCourse.includes('b.pharm') ||
    normalizedCourse.includes('d.pharm')
  ) {
    return 'Pharmacy Council of India (PCI)';
  }

  if (
    normalizedCourse.includes('law') ||
    normalizedCourse.includes('llb') ||
    normalizedCourse.includes('ll.m') ||
    normalizedCourse.includes('llm')
  ) {
    return 'Bar Council of India (BCI)';
  }

  if (
    normalizedCourse.includes('medical') ||
    normalizedCourse.includes('mbbs') ||
    normalizedCourse.includes('bds')
  ) {
    return 'National Medical Commission (NMC)';
  }

  if (
    normalizedCourse.includes('b.ed') ||
    normalizedCourse.includes('bed') ||
    normalizedCourse.includes('d.ed') ||
    normalizedCourse.includes('teacher')
  ) {
    return 'National Council for Teacher Education (NCTE)';
  }

  return 'UGC / Relevant University Authority';
}

export function verifyEducation(
  course: string,
  institution: string
): EducationVerificationResult {
  const normalizedInstitution = normalize(institution);
  const authority = detectAuthority(course);

  const match = educationInstitutions.some((item) => {
    return normalize(item.name) === normalizedInstitution;
  });

  if (match) {
    return {
      status: 'verified',
      authority,
      message:
        'The institution was found in the JanSahay demonstration dataset. Final recognition should be confirmed with the relevant authority.',
    };
  }

  if (normalizedInstitution.length > 3) {
    return {
      status: 'manual_review',
      authority,
      message:
        'The institution was not found in the demonstration dataset. Please verify its recognition with the relevant authority before applying.',
    };
  }

  return {
    status: 'not_found',
    authority,
    message:
      'We could not identify the institution from the information provided.',
  };
}