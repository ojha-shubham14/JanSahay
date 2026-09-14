import { useState } from 'react';
import { ArrowRight, ArrowLeft, IndianRupee, Briefcase, GraduationCap, MapPin, AlertCircle, User } from 'lucide-react';
import type { Language, Purpose, EducationStatus, ApplicantProfile } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';
import { cityCoordinates } from '@/data/partners';

interface GuidedWizardProps {
  lang: Language;
  initialProfile: ApplicantProfile;
  onComplete: (profile: ApplicantProfile) => void;
  onBack: () => void;
}

type WizardStep = 'details' | 'income' | 'purpose' | 'cost' | 'education_status' | 'project_type' | 'location';

export function GuidedWizard({ lang, initialProfile, onComplete, onBack }: GuidedWizardProps) {
  const tr = (key: TranslationKey) => t(lang, key);
  const [step, setStep] = useState<WizardStep>('details');
  const [name, setName] = useState(initialProfile.applicant_name ?? '');
  const [age, setAge] = useState(initialProfile.applicant_age?.toString() ?? '');
  const [income, setIncome] = useState(initialProfile.annual_family_income?.toString() ?? '');
  const [purpose, setPurpose] = useState<Purpose | ''>(initialProfile.purpose ?? '');
  const [cost, setCost] = useState(initialProfile.estimated_cost?.toString() ?? '');
  const [educationStatus, setEducationStatus] = useState<EducationStatus | ''>(initialProfile.education_status ?? '');
  const [projectType, setProjectType] = useState(initialProfile.project_type ?? '');
  const [city, setCity] = useState(initialProfile.location.display_name ?? '');
  const [error, setError] = useState('');

  const stepOrder: WizardStep[] = ['details', 'income', 'purpose', 'cost', 'education_status', 'project_type', 'location'];

  const getStepIndex = () => stepOrder.indexOf(step);
  const isEducationFlow = purpose === 'education';

  const nextStep = () => {
    const idx = getStepIndex();
    setError('');

    if (step === 'details' && (!name.trim() || !age || Number(age) <= 0)) {
      setError(tr('personalDetails'));
      return;
    }
    if (step === 'income' && (!income || Number(income) <= 0)) {
      setError(tr('questionIncome'));
      return;
    }
    if (step === 'purpose' && !purpose) {
      setError(tr('questionPurpose'));
      return;
    }
    if (step === 'cost' && (!cost || Number(cost) <= 0)) {
      setError(tr('questionCost'));
      return;
    }

    let next = stepOrder[idx + 1];
    if (next === 'education_status' && !isEducationFlow) next = 'project_type';
    if (next === 'project_type' && isEducationFlow) next = 'location';

    if (next) {
      setStep(next);
    } else {
      complete();
    }
  };

  const prevStep = () => {
    const idx = getStepIndex();
    setError('');
    if (idx === 0) {
      onBack();
      return;
    }
    let prev = stepOrder[idx - 1];
    if (prev === 'education_status' && !isEducationFlow) prev = 'purpose';
    if (prev === 'project_type' && isEducationFlow) prev = 'cost';
    setStep(prev);
  };

  const complete = () => {
    if (!name.trim() || !income || !purpose || !cost || !city) {
      setError('Please fill all fields');
      return;
    }
    const profile: ApplicantProfile = {
      applicant_name: name.trim(),
      applicant_age: Number(age) || null,
      annual_family_income: Number(income),
      purpose: purpose as Purpose,
      estimated_cost: Number(cost),
      requested_loan_amount: null,
      education_status: educationStatus || null,
      project_type: projectType || null,
      location: {
        latitude: cityCoordinates[city]?.lat ?? null,
        longitude: cityCoordinates[city]?.lon ?? null,
        display_name: city,
      },
      language: lang,
    };
    onComplete(profile);
  };

  const isLastStep = step === 'location';

  const visibleSteps = stepOrder.filter((s) => {
    if (s === 'education_status' && !isEducationFlow) return false;
    if (s === 'project_type' && isEducationFlow) return false;
    return true;
  });

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-6">
        {visibleSteps.map((s) => {
          const isActive = s === step;
          const isPast = stepOrder.indexOf(s) < getStepIndex();
          return (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'bg-primary-600 flex-1' : isPast ? 'bg-primary-300 flex-1' : 'bg-slate-200 w-6'
              }`}
            />
          );
        })}
      </div>

      {/* Details step (name + age) */}
      {step === 'details' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{tr('personalDetails')}</h2>
          <p className="text-sm text-slate-500 mb-5">{tr('personalDetailsHint')}</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{tr('questionName')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                  placeholder={tr('namePlaceholder')}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{tr('questionAge')}</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                placeholder={tr('agePlaceholder')}
                className="input-field"
                min="1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Income step */}
      {step === 'income' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{tr('questionIncome')}</h2>
          <p className="text-sm text-slate-500 mb-5">{tr('incomeHint')}</p>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              autoFocus
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && nextStep()}
              placeholder={tr('incomePlaceholder')}
              className="input-field pl-10"
              min="1"
            />
          </div>
        </div>
      )}

      {/* Purpose step */}
      {step === 'purpose' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-5">{tr('questionPurpose')}</h2>
          <div className="space-y-3">
            <button
              onClick={() => setPurpose('business_project')}
              className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 ${
                purpose === 'business_project'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                purpose === 'business_project' ? 'bg-accent-100' : 'bg-slate-100'
              }`}>
                <Briefcase className={`w-6 h-6 ${purpose === 'business_project' ? 'text-accent-600' : 'text-slate-400'}`} />
              </div>
              <span className={`font-semibold text-base ${purpose === 'business_project' ? 'text-primary-900' : 'text-slate-600'}`}>
                {tr('purposeBusiness')}
              </span>
            </button>
            <button
              onClick={() => setPurpose('education')}
              className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 ${
                purpose === 'education'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                purpose === 'education' ? 'bg-success-100' : 'bg-slate-100'
              }`}>
                <GraduationCap className={`w-6 h-6 ${purpose === 'education' ? 'text-success-600' : 'text-slate-400'}`} />
              </div>
              <span className={`font-semibold text-base ${purpose === 'education' ? 'text-primary-900' : 'text-slate-600'}`}>
                {tr('purposeEducation')}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Cost step */}
      {step === 'cost' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{tr('questionCost')}</h2>
          <p className="text-sm text-slate-500 mb-5">
            {isEducationFlow ? tr('costEducationHint') : tr('costBusinessHint')}
          </p>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              autoFocus
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && nextStep()}
              placeholder={isEducationFlow ? 'e.g. 500000' : 'e.g. 120000'}
              className="input-field pl-10"
              min="1"
            />
          </div>
        </div>
      )}

      {/* Education status step */}
      {step === 'education_status' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-5">{tr('questionEducationStatus')}</h2>
          <div className="space-y-3">
            <button
              onClick={() => setEducationStatus('pursuing')}
              className={`w-full p-5 rounded-xl border-2 text-left font-semibold text-base transition-all duration-200 ${
                educationStatus === 'pursuing'
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {tr('statusPursuing')}
            </button>
            <button
              onClick={() => setEducationStatus('planning')}
              className={`w-full p-5 rounded-xl border-2 text-left font-semibold text-base transition-all duration-200 ${
                educationStatus === 'planning'
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {tr('statusPlanning')}
            </button>
          </div>
        </div>
      )}

      {/* Project type step */}
      {step === 'project_type' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{tr('questionProjectType')}</h2>
          <p className="text-sm text-slate-500 mb-5">{tr('projectTypeHint')}</p>
          <input
            type="text"
            autoFocus
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && nextStep()}
            placeholder="tailoring, retail, transport..."
            className="input-field"
          />
        </div>
      )}

      {/* Location step */}
      {step === 'location' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{tr('questionLocation')}</h2>
          <p className="text-sm text-slate-500 mb-5">{tr('locationHint')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(cityCoordinates).map(([key, cityData]) => (
              <button
                key={key}
                onClick={() => setCity(key)}
                className={`flex items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  city === key
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <MapPin className={`w-4 h-4 ${city === key ? 'text-primary-600' : 'text-slate-400'}`} />
                {cityData.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-error-50 border border-error-200 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-6">
        <button onClick={prevStep} className="btn-secondary">
          <ArrowLeft className="w-5 h-5" />
          {tr('back')}
        </button>
        <button onClick={nextStep} className="btn-primary flex-1">
          {isLastStep ? tr('seeResults') : tr('next')}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
