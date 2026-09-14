import type { ApplicantProfile, Purpose, EducationStatus } from '@/lib/types';

export interface ExtractResult {
  profile: Partial<ApplicantProfile>;
  missingFields: string[];
  reply: string;
}

const keywordMap = {
  purpose: {
    business: ['business', 'vyapar', 'व्यापार', 'व्यापार', 'project', 'dukaan', 'दुकान', 'shop', 'tailoring', 'silai', 'सिलाई', 'vyāpāra', 'ವ್ಯಾಪಾರ', 'ಉದ್ಯಮ', 'ಅಂಗಡಿ'],
    education: ['education', 'shiksha', 'शिक्षा', 'study', 'padhai', 'पढ़ाई', 'course', 'college', 'school', 'vidyā', 'ಶಿಕ್ಷಣ', 'ಓದು', 'ಕಾಲೇಜು'],
  },
  educationStatus: {
    pursuing: ['pursuing', 'studying', 'padhai', 'पढ़', 'अभी', 'currently', 'ಈಗ', 'ಓದುತ್ತಿದ್ದೇನೆ'],
    planning: ['planning', 'enroll', 'admission', 'दाखिला', 'योजना', 'barna', 'ಯೋಜಿಸುತ್ತಿದ್ದೇನೆ', 'ಪ್ರವೇಶ'],
  },
  projectTypes: {
    tailoring: ['tailoring', 'silai', 'सिलाई', 'होलिगೆ', 'ಹೊಲಿಗೆ'],
    retail: ['retail', 'shop', 'dukaan', 'दुकान', 'अंगडಿ', 'ಅಂಗಡಿ'],
    transport: ['transport', 'vehicle', 'गाड़ी', 'ವಾಹನ', 'ಸಾರಿಗೆ'],
    food: ['food', 'stall', 'restaurant', 'खाना', 'ಆಹಾರ', 'ಹೋಟೇಲು'],
    agriculture: ['agriculture', 'farming', 'kheti', 'खेती', 'ಕೃಷಿ', 'ಬೇಸಾಯ'],
  },
};

function extractAmount(text: string): number | null {
  // Match patterns like "3 lakh", "5 lac", "300000", "3,00,000", "50000"
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख|ಲಕ್ಷ)/i);
  if (lakhMatch) {
    return Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  const croreMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:crore|cr|करोड|ಕೋಟಿ)/i);
  if (croreMatch) {
    return Math.round(parseFloat(croreMatch[1]) * 10000000);
  }

  const numMatch = text.match(/(?:₹|rs\.?|रु\.?|ರೂ\.)?\s*(\d[\d,]*)/i);
  if (numMatch) {
    const num = parseInt(numMatch[1].replace(/,/g, ''), 10);
    if (num > 0) return num;
  }
  return null;
}

function matchKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

export function extractFromMessage(
  text: string,
  currentProfile: ApplicantProfile,
  pendingField?: string,
): ExtractResult {
  const extracted: Partial<ApplicantProfile> = {};
  const lower = text.toLowerCase();

  // Extract purpose
  if (!currentProfile.purpose) {
    if (matchKeywords(text, keywordMap.purpose.business)) {
      extracted.purpose = 'business_project' as Purpose;
    } else if (matchKeywords(text, keywordMap.purpose.education)) {
      extracted.purpose = 'education' as Purpose;
    }
  }

    // Extract income — a bare number answers this directly if income is what we just asked for
  if (currentProfile.annual_family_income === null) {
    const incomeKeywords = ['income', 'aay', 'आय', 'kamai', 'कमाई', 'ಆದಾಯ', 'salary', 'वेतन', 'ಸಂಬಳ'];
    const mentionsIncome = incomeKeywords.some((kw) => lower.includes(kw.toLowerCase()));
    if (pendingField === 'income' || mentionsIncome) {
      const amount = extractAmount(text);
      if (amount) extracted.annual_family_income = amount;
    }
  }

  // Extract cost/amount — only from a bare number if cost is what we asked for,
  // or this is the first free-form message (so a stray number can't steal the income answer)
  if (currentProfile.estimated_cost === null && !extracted.annual_family_income) {
    if (pendingField === 'cost' || pendingField === undefined) {
      const amount = extractAmount(text);
      if (amount) extracted.estimated_cost = amount;
    }
  }

  // Extract cost/amount
  if (currentProfile.estimated_cost === null) {
    const amount = extractAmount(text);
    if (amount) extracted.estimated_cost = amount;
  }

  // Extract education status
  if (currentProfile.purpose === 'education' || extracted.purpose === 'education') {
    if (!currentProfile.education_status) {
      if (matchKeywords(text, keywordMap.educationStatus.pursuing)) {
        extracted.education_status = 'pursuing' as EducationStatus;
      } else if (matchKeywords(text, keywordMap.educationStatus.planning)) {
        extracted.education_status = 'planning' as EducationStatus;
      }
    }
  }

  // Extract project type
  if (!currentProfile.project_type) {
    for (const [type, keywords] of Object.entries(keywordMap.projectTypes)) {
      if (matchKeywords(text, keywords)) {
        extracted.project_type = type;
        break;
      }
    }
  }

  // Extract location
  if (!currentProfile.location.display_name) {
    const cities = ['bengaluru', 'bangalore', 'hyderabad', 'chennai', 'pune', 'delhi', 'kolkata', 'patna',
      'बेंगलुरु', 'हैदराबाद', 'चेन्नई', 'पुणे', 'दिल्ली', 'कोलकाता', 'पटना',
      'ಬೆಂಗಳೂರು', 'ಹೈದರಾಬಾದ್', 'ಚೆನ್ನೈ', 'ಪುಣೆ', 'ದೆಹಲಿ', 'ಕೋಲ್ಕತಾ', 'ಪಾಟ್ನಾ'];
    for (const city of cities) {
      if (lower.includes(city.toLowerCase())) {
        const cityMap: Record<string, string> = {
          bengaluru: 'bengaluru', bangalore: 'bengaluru', 'बेंगलुरु': 'bengaluru', 'ಬೆಂಗಳೂರು': 'bengaluru',
          hyderabad: 'hyderabad', 'हैदराबाद': 'hyderabad', 'ಹೈದರಾಬಾದ್': 'hyderabad',
          chennai: 'chennai', 'चेन्नई': 'chennai', 'ಚೆನ್ನೈ': 'chennai',
          pune: 'pune', 'पुणे': 'pune', 'ಪುಣೆ': 'pune',
          delhi: 'delhi', 'दिल्ली': 'delhi', 'ದೆಹಲಿ': 'delhi',
          kolkata: 'kolkata', 'कोलकाता': 'kolkata', 'ಕೋಲ್ಕತಾ': 'kolkata',
          patna: 'patna', 'पटना': 'patna', 'ಪಾಟ್ನಾ': 'patna',
        };
        const mapped = cityMap[city] || city;
        extracted.location = { latitude: null, longitude: null, display_name: mapped };
        break;
      }
    }
  }

  // Merge with current profile
  const merged: ApplicantProfile = { ...currentProfile, ...extracted } as ApplicantProfile;

  // Determine missing fields
  const missing: string[] = [];
  if (merged.annual_family_income === null) missing.push('income');
  if (merged.purpose === null) missing.push('purpose');
  if (merged.estimated_cost === null) missing.push('cost');
  if (merged.purpose === 'education' && merged.education_status === null) missing.push('education_status');
  if (merged.purpose === 'business_project' && !merged.project_type) missing.push('project_type');
  if (!merged.location.display_name) missing.push('location');

  return {
    profile: extracted,
    missingFields: missing,
    reply: '',
  };
}
