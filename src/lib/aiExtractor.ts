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
 * JanSahay local rule-based NLP layer.
 *
 * The goal here is NOT exact keyword matching. A beneficiary can type a
 * complete sentence such as:
 *
 *   "I want to open a small tailoring shop and need around 3 lakh"
 *
 * and the extractor should still identify business + tailoring + amount.
 *
 * It deliberately stays deterministic and local so scheme eligibility does
 * not depend on an external LLM or API call.
 */

const keywordMap = {
  purpose: {
    business: [
      'business',
      'businesses',
      'enterprise',
      'entrepreneur',
      'entrepreneurship',
      'startup',
      'start up',
      'small business',
      'new business',
      'business project',
      'project',
      'shop',
      'store',
      'dukaan',
      'दुकान',
      'व्यापार',
      'व्यवसाय',
      'उद्यम',
      'उद्योग',
      'प्रोजेक्ट',
      'काम शुरू',
      'व्यापार शुरू',
      'business start',
      'business expand',
      'expand my business',
      'open a shop',
      'start a shop',
      'start a business',
      'ಹೊಸ ವ್ಯಾಪಾರ',
      'ವ್ಯಾಪಾರ',
      'ಉದ್ಯಮ',
      'ಅಂಗಡಿ',
      'ವ್ಯವಹಾರ',
      'தொழில்',
      'வணிகம்',
      'கடை',
      'தொழில் தொடங்க',
    ],

    education: [
      'education',
      'educational',
      'education loan',
      'study',
      'studies',
      'studying',
      'student',
      'students',
      'school',
      'college',
      'university',
      'degree',
      'diploma',
      'course',
      'tuition',
      'fees',
      'college fees',
      'course fees',
      'admission',
      'enroll',
      'enrollment',
      'btech',
      'b.tech',
      'mtech',
      'm.tech',
      'mba',
      'engineering',
      'medical',
      'nursing',
      'shiksha',
      'padhai',
      'पढ़ाई',
      'शिक्षा',
      'छात्र',
      'कॉलेज',
      'स्कूल',
      'डिग्री',
      'कोर्स',
      'फीस',
      'प्रवेश',
      'दाखिला',
      'शिक्षण',
      'ಶಿಕ್ಷಣ',
      'ಓದು',
      'ಓದುತ್ತಿದ್ದೇನೆ',
      'ವಿದ್ಯಾರ್ಥಿ',
      'ಕಾಲೇಜು',
      'ವಿಶ್ವವಿದ್ಯಾಲಯ',
      'ಪದವಿ',
      'ಕೋರ್ಸ್',
      'ಶುಲ್ಕ',
      'ಪ್ರವೇಶ',
      'படிப்பு',
      'கல்வி',
      'மாணவர்',
      'கல்லூரி',
      'பல்கலைக்கழகம்',
      'பட்டம்',
      'பாடநெறி',
      'கட்டணம்',
      'சேர்க்கை',
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
      'student now',
      'currently enrolled',
      'already enrolled',
      'अभी पढ़ रहा',
      'अभी पढ़ रही',
      'अभी पढ़ाई',
      'वर्तमान में पढ़',
      'अध्ययन कर रहा',
      'अध्ययन कर रही',
      'पहले से पढ़',
      'ಈಗ ಓದುತ್ತಿದ್ದೇನೆ',
      'ಓದುತ್ತಿದ್ದೇನೆ',
      'ಈಗ ಅಧ್ಯಯನ',
      'படித்து வருகிறேன்',
      'தற்போது படிக்கிறேன்',
    ],

    planning: [
      'planning to study',
      'planning to pursue',
      'planning to join',
      'want to study',
      'want to pursue',
      'want to join',
      'will study',
      'going to study',
      'planning',
      'admission',
      'enroll',
      'enrolling',
      'join college',
      'दाखिला',
      'प्रवेश',
      'योजना',
      'पढ़ना चाहता',
      'पढ़ना चाहती',
      'योजना बना रहा',
      'योजना बना रही',
      'प्रवेश लेना',
      'ಯೋಜಿಸುತ್ತಿದ್ದೇನೆ',
      'ಪ್ರವೇಶ',
      'ಕಾಲೇಜಿಗೆ ಸೇರಲು',
      'படிக்க திட்டமிட்டுள்ளேன்',
      'சேர திட்டமிட்டுள்ளேன்',
    ],
  },

  projectTypes: {
    tailoring: [
      'tailoring',
      'tailor',
      'stitching',
      'stitching shop',
      'sewing',
      'garment',
      'garments',
      'boutique',
      'silai',
      'सिलाई',
      'दर्जी',
      'कपड़ा',
      'गारमेंट',
      'ಹೊಲಿಗೆ',
      'ಹೋಲಿಗೆ',
      'ಬಟ್ಟೆ',
      'தையல்',
      'தையல் கடை',
      'ஆடை',
    ],

    retail: [
      'retail',
      'shop',
      'store',
      'grocery',
      'groceries',
      'kirana',
      'supermarket',
      'general store',
      'medical shop',
      'stationery',
      'dukaan',
      'दुकान',
      'किराना',
      'खुदरा',
      'स्टोर',
      'जनरल स्टोर',
      'ಅಂಗಡಿ',
      'ಚಿಲ್ಲರೆ',
      'ಕಿರಾಣಿ',
      'மளிகை',
      'கடை',
      'சில்லறை',
    ],

    transport: [
      'transport',
      'transportation',
      'vehicle',
      'vehicles',
      'auto',
      'autorickshaw',
      'auto rickshaw',
      'taxi',
      'cab',
      'truck',
      'car',
      'van',
      'delivery vehicle',
      'gadi',
      'गाड़ी',
      'वाहन',
      'ऑटो',
      'टैक्सी',
      'ट्रक',
      'ವಾಹನ',
      'ಸಾರಿಗೆ',
      'ಆಟೋ',
      'ಟ್ಯಾಕ್ಸಿ',
      'வாகனம்',
      'போக்குவரத்து',
      'ஆட்டோ',
      'டாக்ஸி',
    ],

    food: [
      'food',
      'food stall',
      'food shop',
      'stall',
      'restaurant',
      'hotel',
      'cafe',
      'café',
      'bakery',
      'tea shop',
      'tea stall',
      'tiffin',
      'catering',
      'dhaba',
      'खाना',
      'खाने',
      'खाद्य',
      'ढाबा',
      'रेस्टोरेंट',
      'बेकरी',
      'आहार',
      'ಹೋಟೆಲ್',
      'ಹೋಟೇಲು',
      'ಆಹಾರ',
      'ಬೇಕರಿ',
      'ಊಟ',
      'உணவு',
      'உணவகம்',
      'பேக்கரி',
      'தேநீர் கடை',
      'கேட்டரிங்',
    ],

    agriculture: [
      'agriculture',
      'agricultural',
      'farming',
      'farm',
      'farmer',
      'dairy',
      'poultry',
      'livestock',
      'kheti',
      'खेती',
      'कृषि',
      'किसान',
      'डेयरी',
      'पशुपालन',
      'मुर्गी पालन',
      'कृषि व्यवसाय',
      'ಕೃಷಿ',
      'ಬೇಸಾಯ',
      'ರೈತ',
      'ಹೈನುಗಾರಿಕೆ',
      'ಕೋಳಿ ಸಾಕಣೆ',
      'விவசாயம்',
      'விவசாயி',
      'பால் பண்ணை',
      'கால்நடை',
    ],
  },
};

const cityAliases: Record<string, string[]> = {
  bengaluru: ['bengaluru', 'bangalore', 'बेंगलुरु', 'ಬेंगलುರು', 'ಬೆಂಗಳೂರು', 'ಬೆಂಗಳೂರಿನಲ್ಲಿ', 'ಬೆಂಗಳೂರುನಲ್ಲಿ', 'ಬೆಂಗಳೂರು ನಗರ'],
  hyderabad: ['hyderabad', 'ஹைதராபாத்', 'हैदराबाद', 'ಹೈದರಾಬಾದ್'],
  chennai: ['chennai', 'சென்னை', 'चेन्नई', 'ಚೆನ್ನೈ'],
  pune: ['pune', 'पुणे', 'ಪುಣೆ'],
  delhi: ['delhi', 'new delhi', 'दिल्ली', 'नई दिल्ली', 'ದೆಹಲಿ'],
  kolkata: ['kolkata', 'calcutta', 'कोलकाता', 'ಕೋಲ್ಕತಾ'],
  patna: ['patna', 'पटना', 'ಪಾಟ್ನಾ'],
};

const incomeWords = [
  'income',
  'annual income',
  'family income',
  'family earns',
  'family earning',
  'household income',
  'earn',
  'earns',
  'earning',
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

const costWords = [
  'cost',
  'costs',
  'need',
  'needed',
  'require',
  'required',
  'loan',
  'loan amount',
  'funding',
  'finance',
  'financing',
  'investment',
  'invest',
  'budget',
  'project cost',
  'expense',
  'capital',
  'खर्च',
  'लागत',
  'चाहिए',
  'chahiye',
  'chaahiye',
  'जरूरत',
  'निवेश',
  'परियोजना लागत',
  'ಬೆಲೆ',
  'ವೆಚ್ಚ',
  'ಹೂಡಿಕೆ',
  'ಬೇಕಾಗಿದೆ',
  'ಬೇಕಿದೆ',
  'ಬೇಕು',
  'தேவை',
  'வேண்டும்',
  'வேணும்',
  'செலவு',
  'முதலீடு',
];

function normalizeText(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[₹,]/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^\p{L}\p{M}\p{N}.]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(' ').filter(Boolean);
}

function stemLatin(token: string): string {
  let value = token.toLowerCase();

  if (value.length > 6 && value.endsWith('ing')) {
    value = value.slice(0, -3);
  } else if (value.length > 5 && value.endsWith('ed')) {
    value = value.slice(0, -2);
  } else if (value.length > 5 && value.endsWith('es')) {
    value = value.slice(0, -2);
  } else if (value.length > 4 && value.endsWith('s')) {
    value = value.slice(0, -1);
  }

  return value;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];

    for (let j = 1; j <= b.length; j += 1) {
      const insertCost = current[j - 1] + 1;
      const deleteCost = previous[j] + 1;
      const replaceCost = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      current[j] = Math.min(insertCost, deleteCost, replaceCost);
    }

    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
}

function isLatinToken(value: string): boolean {
  return /^[a-z0-9.]+$/i.test(value);
}

function fuzzyLatinMatch(token: string, keyword: string): boolean {
  if (!isLatinToken(token) || !isLatinToken(keyword)) return false;

  const a = stemLatin(token.replace(/\./g, ''));
  const b = stemLatin(keyword.replace(/\./g, ''));

  if (a === b) return true;

  // Avoid fuzzy-matching tiny words such as "i", "a", or "in".
  if (Math.min(a.length, b.length) < 4) return false;

  if (a.includes(b) || b.includes(a)) return true;

  if (Math.min(a.length, b.length) < 5) return false;

  const distance = levenshtein(a, b);
  const maxDistance = Math.max(a.length, b.length) >= 8 ? 2 : 1;

  return distance <= maxDistance;
}

/**
 * Returns a score rather than a boolean. This lets us choose the strongest
 * intent when a sentence contains several words.
 */
function keywordScore(text: string, keywords: string[]): number {
  const normalized = normalizeText(text);
  const tokens = tokenize(text);
  let score = 0;

  for (const rawKeyword of keywords) {
    const keyword = normalizeText(rawKeyword);
    if (!keyword) continue;

    if (normalized.includes(keyword)) {
      score += keyword.includes(' ') ? 3 : 2;
      continue;
    }

    const keywordTokens = keyword.split(' ');
    if (keywordTokens.length !== 1) continue;

    const exactToken = tokens.some((token) => token === keyword);
    if (exactToken) {
      score += 2;
      continue;
    }

    if (tokens.some((token) => fuzzyLatinMatch(token, keyword))) {
      score += 1;
    }
  }

  return score;
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywordScore(text, keywords) > 0;
}

interface AmountMatch {
  value: number;
  index: number;
  raw: string;
}

function extractAmounts(text: string): AmountMatch[] {
  const source = text.normalize('NFKC');
  const results: AmountMatch[] = [];

  const lakhRegex = /(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|लाख|लक्ष|ಲಕ್ಷ|லட்சம்)/gi;
  const croreRegex = /(\d+(?:\.\d+)?)\s*(?:crore|crores|cr|करोड़|करோட|करोड|ಕೋಟಿ|கோடி)/gi;

  for (const match of source.matchAll(lakhRegex)) {
    const number = Number.parseFloat(match[1]);
    if (Number.isFinite(number) && number > 0) {
      results.push({
        value: Math.round(number * 100000),
        index: match.index ?? 0,
        raw: match[0],
      });
    }
  }

  for (const match of source.matchAll(croreRegex)) {
    const number = Number.parseFloat(match[1]);
    if (Number.isFinite(number) && number > 0) {
      results.push({
        value: Math.round(number * 10000000),
        index: match.index ?? 0,
        raw: match[0],
      });
    }
  }

  // Plain rupee amounts. Avoid matching the numeric part of lakh/crore
  // expressions because those are already captured above.
  const rupeeRegex = /(?:₹|rs\.?|रु\.?|रुपये|ರೂ\.?|ரூ\.?)\s*(\d[\d\s,]*)/gi;
  for (const match of source.matchAll(rupeeRegex)) {
    const number = Number.parseInt(match[1].replace(/[\s,]/g, ''), 10);
    if (Number.isFinite(number) && number > 0) {
      results.push({ value: number, index: match.index ?? 0, raw: match[0] });
    }
  }

  // Bare numbers are accepted only when they look like a meaningful money
  // amount. Years and ages are intentionally ignored.
  const bareRegex = /\b\d{2,8}(?:[\s,]\d{2,3})*\b/g;
  for (const match of source.matchAll(bareRegex)) {
    const before = source.slice(Math.max(0, (match.index ?? 0) - 12), match.index ?? 0);
    if (/\b(?:lakh|lakhs|lac|lacs|crore|crores|cr)\s*$/i.test(before)) continue;

    const number = Number.parseInt(match[0].replace(/[\s,]/g, ''), 10);
    if (!Number.isFinite(number) || number <= 0 || number < 1000) continue;

    results.push({ value: number, index: match.index ?? 0, raw: match[0] });
  }

  return results.sort((a, b) => a.index - b.index);
}

function extractAmountNearCue(
  text: string,
  cues: string[],
): number | null {
  const normalized = normalizeText(text);
  const amounts = extractAmounts(text);
  if (!amounts.length) return null;

  let best: { distance: number; amount: number } | null = null;

  for (const cue of cues) {
    const cueNormalized = normalizeText(cue);
    if (!cueNormalized) continue;

    let fromIndex = 0;
    while (fromIndex < normalized.length) {
      const cueIndex = normalized.indexOf(cueNormalized, fromIndex);
      if (cueIndex < 0) break;

      for (const amount of amounts) {
        const distance = Math.abs(amount.index - cueIndex);
        if (distance > 90) continue;

        // Prefer amounts after the cue, but allow a nearby amount before it
        // for natural phrases such as "2 lakh family income".
        const directionPenalty = amount.index < cueIndex ? 8 : 0;
        const weightedDistance = distance + directionPenalty;

        if (!best || weightedDistance < best.distance) {
          best = { distance: weightedDistance, amount: amount.value };
        }
      }

      fromIndex = cueIndex + cueNormalized.length;
    }
  }

  return best?.amount ?? null;
}

function extractAmount(text: string): number | null {
  return extractAmounts(text)[0]?.value ?? null;
}

function extractIncome(text: string): number | null {
  if (!containsAny(text, incomeWords)) return null;
  return extractAmountNearCue(text, incomeWords) ?? extractAmount(text);
}

function extractCost(text: string): number | null {
  if (!containsAny(text, costWords)) return null;
  return extractAmountNearCue(text, costWords) ?? extractAmount(text);
}

function extractLocation(text: string) {
  const normalized = normalizeText(text);

  for (const [mappedCity, aliases] of Object.entries(cityAliases)) {
    if (aliases.some((alias) => normalized.includes(normalizeText(alias)))) {
      return {
        latitude: null,
        longitude: null,
        display_name: mappedCity,
      };
    }
  }

  return null;
}

function detectPurpose(text: string): Purpose | null {
  const businessScore = keywordScore(text, keywordMap.purpose.business);
  const educationScore = keywordScore(text, keywordMap.purpose.education);

  if (businessScore === 0 && educationScore === 0) {
    // A concrete business type such as bakery, tailoring, grocery,
    // transport, or farming is itself strong evidence of a business/project flow.
    if (detectProjectType(text)) return 'business_project';
    return null;
  }
  if (businessScore === educationScore) {
    // If the sentence explicitly contains education/college/fees, prefer
    // education; otherwise prefer business for generic "project/shop" terms.
    const educationStrong = keywordScore(text, [
      'education',
      'education loan',
      'college fees',
      'course fees',
      'student',
      'admission',
      'degree',
      'शिक्षा',
      'पढ़ाई',
      'ಶಿಕ್ಷಣ',
      'கல்வி',
    ]);
    return educationStrong > 0 ? 'education' : 'business_project';
  }

  return businessScore > educationScore ? 'business_project' : 'education';
}

function detectEducationStatus(text: string): EducationStatus | null {
  const pursuingScore = keywordScore(text, keywordMap.educationStatus.pursuing);
  const planningScore = keywordScore(text, keywordMap.educationStatus.planning);

  if (pursuingScore === 0 && planningScore === 0) return null;
  return pursuingScore >= planningScore ? 'pursuing' : 'planning';
}

function detectProjectType(text: string): string | null {
  const scored = Object.entries(keywordMap.projectTypes)
    .map(([type, keywords]) => ({ type, score: keywordScore(text, keywords) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.type ?? null;
}

export function extractFromMessage(
  text: string,
  currentProfile: ApplicantProfile,
  pendingField?: string,
): ExtractResult {
  const extracted: Partial<ApplicantProfile> = {};
  const normalized = normalizeText(text);

  if (!normalized) {
    return {
      profile: extracted,
      missingFields: ['income', 'purpose', 'cost', 'location'],
      reply: '',
    };
  }

  /* ---------------------------------------------------------
     PURPOSE
  --------------------------------------------------------- */
  if (!currentProfile.purpose) {
    const purpose = detectPurpose(normalized);
    if (purpose) extracted.purpose = purpose;
  }

  const purpose = currentProfile.purpose ?? extracted.purpose;

  /* ---------------------------------------------------------
     EDUCATION STATUS
  --------------------------------------------------------- */
  if (purpose === 'education' && !currentProfile.education_status) {
    const educationStatus = detectEducationStatus(normalized);
    if (educationStatus) extracted.education_status = educationStatus;
  }

  /* ---------------------------------------------------------
     INCOME
  --------------------------------------------------------- */
  if (currentProfile.annual_family_income === null) {
    const income = extractIncome(normalized);

    if (income) {
      extracted.annual_family_income = income;
    } else if (pendingField === 'income') {
      const amount = extractAmount(normalized);
      if (amount) extracted.annual_family_income = amount;
    }
  }

  /* ---------------------------------------------------------
     PROJECT / COURSE COST
  --------------------------------------------------------- */
  if (currentProfile.estimated_cost === null) {
    const cost = extractCost(normalized);

    if (cost) {
      extracted.estimated_cost = cost;
    } else if (pendingField === 'cost') {
      const amount = extractAmount(normalized);
      if (amount) extracted.estimated_cost = amount;
    }
  }

  /* ---------------------------------------------------------
     PROJECT TYPE
  --------------------------------------------------------- */
  if (
    !currentProfile.project_type &&
    (purpose === 'business_project' || pendingField === 'project_type')
  ) {
    const projectType = detectProjectType(normalized);
    if (projectType) extracted.project_type = projectType;
  }

  /* ---------------------------------------------------------
     LOCATION
  --------------------------------------------------------- */
  if (!currentProfile.location.display_name) {
    const location = extractLocation(normalized);
    if (location) extracted.location = location;
  }

  /* ---------------------------------------------------------
     MERGE + REQUIRED FIELDS
  --------------------------------------------------------- */
  const merged: ApplicantProfile = {
    ...currentProfile,
    ...extracted,
  } as ApplicantProfile;

  const missing: string[] = [];

  if (merged.annual_family_income === null) missing.push('income');
  if (merged.purpose === null) missing.push('purpose');
  if (merged.estimated_cost === null) missing.push('cost');

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

  if (!merged.location.display_name) missing.push('location');

  return {
    profile: extracted,
    missingFields: missing,
    reply: '',
  };
}
