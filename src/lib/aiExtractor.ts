import type {
  ApplicantProfile,
  Purpose,
  EducationStatus,
} from '@/lib/types';

export interface ExtractResult {
  profile: Partial<ApplicantProfile>;
  missingFields: string[];
  reply: string;
}

/*
 * JanSahay conversation extractor
 *
 * This is a local rule-based NLP layer.
 * It accepts natural sentences instead of requiring
 * rigid true/false or single-word answers.
 */

const keywordMap = {
  purpose: {
    business: [
      'business',
      'businesses',
      'vyapar',
      'व्यापार',
      'project',
      'shop',
      'dukaan',
      'दुकान',
      'tailoring',
      'silai',
      'सिलाई',
      'startup',
      'start a business',
      'small business',
      'enterprise',
      'ವ್ಯಾಪಾರ',
      'ಉದ್ಯಮ',
      'ಅಂಗಡಿ',
      'ಹೊಲಿಗೆ',
      'தொழில்',
      'கடை',
    ],

    education: [
      'education',
      'shiksha',
      'शिक्षा',
      'study',
      'studies',
      'studying',
      'padhai',
      'पढ़ाई',
      'course',
      'college',
      'school',
      'degree',
      'btech',
      'mtech',
      'mba',
      'engineering',
      'विद्या',
      'शिक्षण',
      'ಶಿಕ್ಷಣ',
      'ಓದು',
      'ಕಾಲೇಜು',
      'படிப்பு',
      'கல்லூரி',
    ],
  },

  educationStatus: {
    pursuing: [
      'currently studying',
      'currently pursuing',
      'i am studying',
      'i am currently studying',
      'studying now',
      'already studying',
      'pursuing',
      'studying',
      'currently',
      'अभी पढ़ रहा',
      'अभी पढ़ रही',
      'अभी पढ़ाई',
      'वर्तमान में पढ़',
      'अध्ययन कर रहा',
      'अध्ययन कर रही',
      'ಈಗ ಓದುತ್ತಿದ್ದೇನೆ',
      'ಓದುತ್ತಿದ್ದೇನೆ',
      'படித்து வருகிறேன்',
    ],

    planning: [
      'planning to study',
      'planning to pursue',
      'planning to join',
      'want to study',
      'want to pursue',
      'will study',
      'going to study',
      'planning',
      'admission',
      'enroll',
      'enrolling',
      'दाखिला',
      'प्रवेश',
      'योजना',
      'पढ़ना चाहता',
      'पढ़ना चाहती',
      'योजना बना रहा',
      'योजना बना रही',
      'ಯೋಜಿಸುತ್ತಿದ್ದೇನೆ',
      'ಪ್ರವೇಶ',
      'படிக்க திட்டமிட்டுள்ளேன்',
    ],
  },

  projectTypes: {
    tailoring: [
      'tailoring',
      'tailor',
      'silai',
      'सिलाई',
      'ಹೊಲಿಗೆ',
      'ಹೋಲಿಗೆ',
      'தையல்',
    ],

    retail: [
      'retail',
      'shop',
      'store',
      'dukaan',
      'दुकान',
      'ಅಂಗಡಿ',
      'கடை',
    ],

    transport: [
      'transport',
      'vehicle',
      'auto',
      'taxi',
      'truck',
      'car',
      'gadi',
      'गाड़ी',
      'वाहन',
      'ವಾಹನ',
      'ಸಾರಿಗೆ',
      'வாகனம்',
    ],

    food: [
      'food',
      'food stall',
      'stall',
      'restaurant',
      'hotel',
      'cafe',
      'tea shop',
      'खाना',
      'खाने',
      'ढाबा',
      'ಆಹಾರ',
      'ಹೋಟೇಲು',
      'உணவு',
      'உணவகம்',
    ],

    agriculture: [
      'agriculture',
      'farming',
      'farm',
      'farmer',
      'kheti',
      'खेती',
      'कृषि',
      'किसान',
      'ಕೃಷಿ',
      'ಬೇಸಾಯ',
      'விவசாயம்',
    ],
  },
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[₹,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractAmount(text: string): number | null {
  const normalized = text.toLowerCase();

  // Examples:
  // 3 lakh
  // 3 lakhs
  // 3 lac
  // 3.5 lakh
  // 3.5 lakhs
  const lakhMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|लाख|लक्ष|ಲಕ್ಷ|லட்சம்)/i,
  );

  if (lakhMatch) {
    return Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  // Examples:
  // 1 crore
  // 1.5 crore
  // 2 cr
  const croreMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*(?:crore|crores|cr|करोड़|करोड|ಕೋಟಿ|கோடி)/i,
  );

  if (croreMatch) {
    return Math.round(parseFloat(croreMatch[1]) * 10000000);
  }

  // Examples:
  // ₹300000
  // Rs 300000
  // Rs. 3,00,000
  // 300000
  // 3,00,000
  const rupeeMatch = normalized.match(
    /(?:₹|rs\.?|रु\.?|रुपये|ರೂ\.?|ரூ\.?)?\s*(\d[\d\s,]*)/i,
  );

  if (rupeeMatch) {
    const number = parseInt(
      rupeeMatch[1].replace(/[\s,]/g, ''),
      10,
    );

    if (number > 0) {
      return number;
    }
  }

  return null;
}

function containsAny(text: string, keywords: string[]): boolean {
  const normalized = normalizeText(text);

  return keywords.some((keyword) =>
    normalized.includes(normalizeText(keyword)),
  );
}

function extractIncome(text: string): number | null {
  const normalized = normalizeText(text);

  const incomeWords = [
    'income',
    'annual income',
    'family income',
    'family earns',
    'family earning',
    'earn',
    'earns',
    'salary',
    'aay',
    'आय',
    'कमाई',
    'वेतन',
    'परिवार की आय',
    'परिवार कमाता',
    'आदाय',
    'ಆದಾಯ',
    'ಕುಟುಂಬದ ಆದಾಯ',
    'ಸಂಬಳ',
    'வருமானம்',
    'குடும்ப வருமானம்',
  ];

  if (!containsAny(normalized, incomeWords)) {
    return null;
  }

  return extractAmount(normalized);
}

function extractCost(text: string): number | null {
  const normalized = normalizeText(text);

  const costWords = [
    'cost',
    'costs',
    'need',
    'needed',
    'loan',
    'loan amount',
    'investment',
    'invest',
    'budget',
    'project cost',
    'expense',
    'खर्च',
    'लागत',
    'चाहिए',
    'निवेश',
    'परियोजना लागत',
    'ಬೆಲೆ',
    'ವೆಚ್ಚ',
    'ಹೂಡಿಕೆ',
    'தேவை',
    'செலவு',
    'முதலீடு',
  ];

  if (!containsAny(normalized, costWords)) {
    return null;
  }

  return extractAmount(normalized);
}

function extractLocation(text: string) {
  const lower = text.toLowerCase();

  const cityMap: Record<string, string> = {
    bengaluru: 'bengaluru',
    bangalore: 'bengaluru',
    'बेंगलुरु': 'bengaluru',
    'ಬೆಂಗಳೂರು': 'bengaluru',

    hyderabad: 'hyderabad',
    'हैदराबाद': 'hyderabad',
    'ಹೈದರಾಬಾದ್': 'hyderabad',

    chennai: 'chennai',
    'चेन्नई': 'chennai',
    'ಚೆನ್ನೈ': 'chennai',
    'சென்னை': 'chennai',

    pune: 'pune',
    'पुणे': 'pune',
    'ಪುಣೆ': 'pune',

    delhi: 'delhi',
    'दिल्ली': 'delhi',
    'ದೆಹಲಿ': 'delhi',

    kolkata: 'kolkata',
    'कोलकाता': 'kolkata',
    'ಕೋಲ್ಕತಾ': 'kolkata',

    patna: 'patna',
    'पटना': 'patna',
    'ಪಾಟ್ನಾ': 'patna',
  };

  for (const [city, mappedCity] of Object.entries(cityMap)) {
    if (lower.includes(city.toLowerCase())) {
      return {
        latitude: null,
        longitude: null,
        display_name: mappedCity,
      };
    }
  }

  return null;
}

export function extractFromMessage(
  text: string,
  currentProfile: ApplicantProfile,
  pendingField?: string,
): ExtractResult {
  const extracted: Partial<ApplicantProfile> = {};
  const normalized = normalizeText(text);

  /*
   * ---------------------------------------------------------
   * PURPOSE
   * ---------------------------------------------------------
   */

  if (!currentProfile.purpose) {
    if (containsAny(normalized, keywordMap.purpose.business)) {
      extracted.purpose = 'business_project' as Purpose;
    } else if (
      containsAny(normalized, keywordMap.purpose.education)
    ) {
      extracted.purpose = 'education' as Purpose;
    }
  }

  /*
   * ---------------------------------------------------------
   * EDUCATION STATUS
   * ---------------------------------------------------------
   */

  const purpose =
    currentProfile.purpose ?? extracted.purpose;

  if (purpose === 'education') {
    if (!currentProfile.education_status) {
      if (
        containsAny(
          normalized,
          keywordMap.educationStatus.pursuing,
        )
      ) {
        extracted.education_status =
          'pursuing' as EducationStatus;
      } else if (
        containsAny(
          normalized,
          keywordMap.educationStatus.planning,
        )
      ) {
        extracted.education_status =
          'planning' as EducationStatus;
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * INCOME
   * ---------------------------------------------------------
   *
   * If JanSahay specifically asked for income, then a bare
   * number is accepted.
   *
   * Example:
   * "2.5 lakh"
   */

  if (currentProfile.annual_family_income === null) {
    const income =
      extractIncome(normalized);

    if (income) {
      extracted.annual_family_income = income;
    } else if (pendingField === 'income') {
      const amount = extractAmount(normalized);

      if (amount) {
        extracted.annual_family_income = amount;
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * PROJECT COST
   * ---------------------------------------------------------
   */

  if (currentProfile.estimated_cost === null) {
    const cost = extractCost(normalized);

    if (cost) {
      extracted.estimated_cost = cost;
    } else if (pendingField === 'cost') {
      const amount = extractAmount(normalized);

      if (amount) {
        extracted.estimated_cost = amount;
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * PROJECT TYPE
   * ---------------------------------------------------------
   */

  if (
    !currentProfile.project_type &&
    (purpose === 'business_project' || pendingField === 'project_type')
  ) {
    for (const [type, keywords] of Object.entries(
      keywordMap.projectTypes,
    )) {
      if (containsAny(normalized, keywords)) {
        extracted.project_type = type;
        break;
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * LOCATION
   * ---------------------------------------------------------
   */

  if (!currentProfile.location.display_name) {
    const location = extractLocation(normalized);

    if (location) {
      extracted.location = location;
    }
  }

  /*
   * ---------------------------------------------------------
   * MERGE EVERYTHING
   * ---------------------------------------------------------
   */

  const merged: ApplicantProfile = {
    ...currentProfile,
    ...extracted,
  } as ApplicantProfile;

  /*
   * ---------------------------------------------------------
   * FIND WHAT IS STILL MISSING
   * ---------------------------------------------------------
   */

  const missing: string[] = [];

  if (merged.annual_family_income === null) {
    missing.push('income');
  }

  if (merged.purpose === null) {
    missing.push('purpose');
  }

  if (merged.estimated_cost === null) {
    missing.push('cost');
  }

  if (
    merged.purpose === 'education' &&
    merged.education_status === null
  ) {
    missing.push('education_status');
  }

  if (
    merged.purpose === 'business_project' &&
    !merged.project_type
  ) {
    missing.push('project_type');
  }

  if (!merged.location.display_name) {
    missing.push('location');
  }

  return {
    profile: extracted,
    missingFields: missing,
    reply: '',
  };
}