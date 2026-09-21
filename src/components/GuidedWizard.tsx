import { useState } from 'react';

import {
  ArrowRight,
  ArrowLeft,
  IndianRupee,
  Briefcase,
  GraduationCap,
  MapPin,
  AlertCircle,
  User,
  XCircle,
} from 'lucide-react';

import type {
  Language,
  Purpose,
  EducationStatus,
  ApplicantProfile,
} from '@/lib/types';

import { t, type TranslationKey } from '@/i18n/translations';
import { cityCoordinates } from '@/data/partners';
import { verifyEducation } from '@/lib/educationVerifier';

interface GuidedWizardProps {
  lang: Language;
  initialProfile: ApplicantProfile;
  onComplete: (profile: ApplicantProfile) => void;
  onBack: () => void;
}

type WizardStep =
  | 'details'
  | 'income'
  | 'purpose'
  | 'cost'
  | 'education_status'
  | 'course'
  | 'institution'
  | 'education_verification'
  | 'project_type'
  | 'location';

export function GuidedWizard({
  lang,
  initialProfile,
  onComplete,
  onBack,
}: GuidedWizardProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  const [step, setStep] = useState<WizardStep>('details');

  const [name, setName] = useState(
    initialProfile.applicant_name ?? ''
  );

  const [age, setAge] = useState(
    initialProfile.applicant_age?.toString() ?? ''
  );

  const [income, setIncome] = useState(
    initialProfile.annual_family_income?.toString() ?? ''
  );

  const [purpose, setPurpose] = useState<Purpose | ''>(
    initialProfile.purpose ?? ''
  );

  const [cost, setCost] = useState(
    initialProfile.estimated_cost?.toString() ?? ''
  );

  const [educationStatus, setEducationStatus] =
    useState<EducationStatus | ''>(
      initialProfile.education_status ?? ''
    );

  const [course, setCourse] = useState('');
  const [institution, setInstitution] = useState('');

  const [educationVerification, setEducationVerification] =
    useState<ReturnType<typeof verifyEducation> | null>(null);

  const [projectType, setProjectType] = useState(
    initialProfile.project_type ?? ''
  );

  const [city, setCity] = useState(
    initialProfile.location.display_name ?? ''
  );

  const [error, setError] = useState('');

  const [showIncomeLimitPopup, setShowIncomeLimitPopup] =
    useState(false);

  const stepOrder: WizardStep[] = [
    'details',
    'income',
    'purpose',
    'cost',
    'education_status',
    'course',
    'institution',
    'education_verification',
    'project_type',
    'location',
  ];

  /*
   * If Business/Education was already selected from the
   * Home page, do not ask the user for it again.
   */
  const purposePreselected = Boolean(initialProfile.purpose);

  const isEducationFlow = purpose === 'education';

  const effectiveStepOrder = stepOrder.filter((s) => {
    if (s === 'purpose' && purposePreselected) {
      return false;
    }

    if (
      s === 'education_status' &&
      !isEducationFlow
    ) {
      return false;
    }

    if (s === 'course' && !isEducationFlow) {
      return false;
    }

    if (
      s === 'institution' &&
      !isEducationFlow
    ) {
      return false;
    }

    if (
      s === 'education_verification' &&
      !isEducationFlow
    ) {
      return false;
    }

    if (
      s === 'project_type' &&
      isEducationFlow
    ) {
      return false;
    }

    return true;
  });

  const getStepIndex = () =>
    effectiveStepOrder.indexOf(step);

  /*
   * Move to the next wizard step.
   */
  const nextStep = () => {
    const idx = getStepIndex();

    setError('');

    /*
     * NAME + AGE VALIDATION
     */
    if (
      step === 'details' &&
      (!name.trim() ||
        !age ||
        Number(age) <= 0)
    ) {
      setError(tr('personalDetails'));
      return;
    }

    /*
     * INCOME VALIDATION
     */
    if (step === 'income') {
      const incomeValue = Number(income);

      if (!income || incomeValue <= 0) {
        setError(tr('questionIncome'));
        return;
      }

      if (incomeValue > 500000) {
        setShowIncomeLimitPopup(true);
        return;
      }
    }

    /*
     * PURPOSE VALIDATION
     */
    if (
      step === 'purpose' &&
      !purpose
    ) {
      setError(tr('questionPurpose'));
      return;
    }

    /*
     * COST VALIDATION
     */
    if (
      step === 'cost' &&
      (!cost || Number(cost) <= 0)
    ) {
      setError(tr('questionCost'));
      return;
    }

    /*
     * COURSE VALIDATION
     */
    if (
      step === 'course' &&
      !course.trim()
    ) {
      setError('Please enter your course');
      return;
    }

    /*
     * INSTITUTION VALIDATION
     */
    if (
      step === 'institution' &&
      !institution.trim()
    ) {
      setError('Please enter your institution');
      return;
    }

    /*
     * EDUCATION VERIFICATION
     */
    if (
      step === 'institution' &&
      isEducationFlow
    ) {
      const result = verifyEducation(
        course,
        institution
      );

      setEducationVerification(result);
    }

    const next =
      effectiveStepOrder[idx + 1];

    if (next) {
      setStep(next);
    } else {
      complete();
    }
  };

  /*
   * Go to previous wizard step.
   */
  const prevStep = () => {
    const idx = getStepIndex();

    setError('');

    if (idx === 0) {
      onBack();
      return;
    }

    const prev =
      effectiveStepOrder[idx - 1];

    setStep(prev);
  };

  /*
   * Complete the wizard and create
   * the ApplicantProfile.
   */
  const complete = () => {
    if (
      !name.trim() ||
      !income ||
      !purpose ||
      !cost ||
      !city
    ) {
      setError('Please fill all fields');
      return;
    }

    const profile: ApplicantProfile = {
      applicant_name: name.trim(),

      applicant_age:
        Number(age) || null,

      annual_family_income:
        Number(income),

      purpose:
        purpose as Purpose,

      estimated_cost:
        Number(cost),

      requested_loan_amount:
        null,

      education_status:
        educationStatus || null,

      course:
        course || null,

      institution:
        institution || null,

      project_type:
        projectType || null,

      location: {
        latitude:
          cityCoordinates[city]?.lat ??
          null,

        longitude:
          cityCoordinates[city]?.lon ??
          null,

        display_name:
          city,
      },

      language:
        lang,
    };

    onComplete(profile);
  };

  const isLastStep =
    step === 'location';

  const visibleSteps =
    effectiveStepOrder;

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">

      {/* =====================================================
          PROGRESS BAR
          ===================================================== */}

      <div className="flex items-center gap-1.5 mb-6">
        {visibleSteps.map((s) => {
          const isActive =
            s === step;

          const isPast =
            effectiveStepOrder.indexOf(s) <
            getStepIndex();

          return (
            <div
              key={s}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${
                  isActive
                    ? 'bg-primary-600 flex-1'
                    : isPast
                      ? 'bg-primary-300 flex-1'
                      : 'bg-slate-200 w-6'
                }
              `}
            />
          );
        })}
      </div>

      {/* =====================================================
          DETAILS STEP
          ===================================================== */}

      {step === 'details' && (
        <div className="animate-fade-in">

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {tr('personalDetails')}
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            {tr('personalDetailsHint')}
          </p>

          <div className="space-y-4">

            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {tr('questionName')}
              </label>

              <div className="relative">

                <User
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    w-5
                    h-5
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }

                  /*
                   * IMPORTANT:
                   *
                   * Pressing Enter in the NAME field
                   * should NOT go to the next wizard step.
                   *
                   * It only moves focus to AGE.
                   */
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();

                      document
                        .getElementById(
                          'age-input'
                        )
                        ?.focus();
                    }
                  }}

                  placeholder={tr(
                    'namePlaceholder'
                  )}

                  className="
                    input-field
                    pl-10
                  "
                />

              </div>
            </div>

            {/* AGE */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {tr('questionAge')}
              </label>

              <input
                id="age-input"
                type="number"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value)
                }

                /*
                 * Pressing Enter in AGE
                 * performs the normal Next action.
                 */
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    nextStep();
                  }
                }}

                placeholder={tr(
                  'agePlaceholder'
                )}

                className="input-field"

                min="1"
              />

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          INCOME STEP
          ===================================================== */}

      {step === 'income' && (
        <div className="animate-fade-in">

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {tr('questionIncome')}
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            {tr('incomeHint')}
          </p>

          <div className="relative">

            <IndianRupee
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-5
                h-5
                text-slate-400
              "
            />

            <input
              type="number"
              autoFocus
              value={income}
              onChange={(e) =>
                setIncome(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  nextStep();
                }
              }}
              placeholder={tr(
                'incomePlaceholder'
              )}
              className="
                input-field
                pl-10
              "
              min="1"
            />

          </div>
        </div>
      )}

      {/* =====================================================
          PURPOSE STEP
          ===================================================== */}

      {step === 'purpose' && (
        <div className="animate-fade-in">

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            {tr('questionPurpose')}
          </h2>

          <div className="space-y-3">

            {/* BUSINESS */}
            <button
              type="button"
              onClick={() =>
                setPurpose(
                  'business_project'
                )
              }
              className={`
                w-full
                flex
                items-center
                gap-4
                p-5
                rounded-xl
                border-2
                transition-all
                duration-200
                ${
                  purpose ===
                  'business_project'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300'
                }
              `}
            >

              <div
                className={`
                  flex
                  items-center
                  justify-center
                  w-12
                  h-12
                  rounded-xl
                  ${
                    purpose ===
                    'business_project'
                      ? 'bg-accent-100'
                      : 'bg-slate-100'
                  }
                `}
              >
                <Briefcase
                  className={`
                    w-6
                    h-6
                    ${
                      purpose ===
                      'business_project'
                        ? 'text-accent-600'
                        : 'text-slate-400'
                    }
                  `}
                />
              </div>

              <span
                className={`
                  font-semibold
                  text-base
                  ${
                    purpose ===
                    'business_project'
                      ? 'text-primary-900'
                      : 'text-slate-600'
                  }
                `}
              >
                {tr('purposeBusiness')}
              </span>

            </button>

            {/* EDUCATION */}
            <button
              type="button"
              onClick={() =>
                setPurpose('education')
              }
              className={`
                w-full
                flex
                items-center
                gap-4
                p-5
                rounded-xl
                border-2
                transition-all
                duration-200
                ${
                  purpose ===
                  'education'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300'
                }
              `}
            >

              <div
                className={`
                  flex
                  items-center
                  justify-center
                  w-12
                  h-12
                  rounded-xl
                  ${
                    purpose ===
                    'education'
                      ? 'bg-success-100'
                      : 'bg-slate-100'
                  }
                `}
              >
                <GraduationCap
                  className={`
                    w-6
                    h-6
                    ${
                      purpose ===
                      'education'
                        ? 'text-success-600'
                        : 'text-slate-400'
                    }
                  `}
                />
              </div>

              <span
                className={`
                  font-semibold
                  text-base
                  ${
                    purpose ===
                    'education'
                      ? 'text-primary-900'
                      : 'text-slate-600'
                  }
                `}
              >
                {tr('purposeEducation')}
              </span>

            </button>

          </div>
        </div>
      )}

      {/* =====================================================
          COST STEP
          ===================================================== */}

      {step === 'cost' && (
        <div className="animate-fade-in">

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {tr('questionCost')}
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            {isEducationFlow
              ? tr('costEducationHint')
              : tr('costBusinessHint')}
          </p>

          <div className="relative">

            <IndianRupee
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-5
                h-5
                text-slate-400
              "
            />

            <input
              type="number"
              autoFocus
              value={cost}
              onChange={(e) =>
                setCost(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  nextStep();
                }
              }}
              placeholder={
                isEducationFlow
                  ? 'e.g. 500000'
                  : 'e.g. 120000'
              }
              className="
                input-field
                pl-10
              "
              min="1"
            />

          </div>
        </div>
      )}

      {/* =====================================================
          EDUCATION STATUS
          ===================================================== */}

      {step === 'education_status' && (
        <div className="animate-fade-in">

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            {tr(
              'questionEducationStatus'
            )}
          </h2>

          <div className="space-y-3">

            <button
              type="button"
              onClick={() =>
                setEducationStatus(
                  'pursuing'
                )
              }
              className={`
                w-full
                p-5
                rounded-xl
                border-2
                text-left
                font-semibold
                text-base
                transition-all
                duration-200
                ${
                  educationStatus ===
                  'pursuing'
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }
              `}
            >
              {tr('statusPursuing')}
            </button>

            <button
              type="button"
              onClick={() =>
                setEducationStatus(
                  'planning'
                )
              }
              className={`
                w-full
                p-5
                rounded-xl
                border-2
                text-left
                font-semibold
                text-base
                transition-all
                duration-200
                ${
                  educationStatus ===
                  'planning'
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }
              `}
            >
              {tr('statusPlanning')}
            </button>

          </div>
        </div>
      )}

      {/* =====================================================
          COURSE
          ===================================================== */}

      {step === 'course' && (
        <div className="animate-fade-in">

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            What course are you studying?
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            Enter the name of your course or program.
          </p>

          <input
            type="text"
            autoFocus
            value={course}
            onChange={(e) =>
              setCourse(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                nextStep();
              }
            }}
            placeholder="e.g. B.Tech, MBA, B.Sc Nursing"
            className="input-field"
          />

        </div>
      )}

      {/* =====================================================
          INSTITUTION
          ===================================================== */}

      {step === 'institution' && (
        <div className="animate-fade-in">

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Which college or institution?
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            Enter the name of your college or educational institution.
          </p>

          <input
            type="text"
            autoFocus
            value={institution}
            onChange={(e) =>
              setInstitution(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                nextStep();
              }
            }}
            placeholder="e.g. Government Engineering College"
            className="input-field"
          />

        </div>
      )}

      {/* =====================================================
          EDUCATION VERIFICATION
          ===================================================== */}

      {step === 'education_verification' &&
        educationVerification && (
          <div className="animate-fade-in">

            <div className="flex items-center gap-3 mb-4">

              <div className="
                flex
                items-center
                justify-center
                w-12
                h-12
                rounded-xl
                bg-primary-50
              ">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Education recognition check
                </h2>

                <p className="text-sm text-slate-500">
                  We checked the course and institution information you provided.
                </p>

              </div>

            </div>

            <div className="
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              p-4
              space-y-3
            ">

              <div>
                <p className="text-xs text-slate-500">
                  Course
                </p>

                <p className="font-semibold text-slate-900">
                  {course}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Institution
                </p>

                <p className="font-semibold text-slate-900">
                  {institution}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Recognition authority
                </p>

                <p className="font-semibold text-slate-900">
                  {educationVerification.authority}
                </p>
              </div>

            </div>

            <div
              className={`
                mt-4
                rounded-xl
                border
                p-4
                ${
                  educationVerification.status ===
                  'verified'
                    ? 'bg-success-50 border-success-200'
                    : educationVerification.status ===
                        'manual_review'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-error-50 border-error-200'
                }
              `}
            >

              <p className="font-semibold text-slate-900">

                {educationVerification.status ===
                'verified'
                  ? '✓ Recognition found'
                  : educationVerification.status ===
                      'manual_review'
                    ? '⚠ Manual verification recommended'
                    : '✕ Institution not found'}

              </p>

              <p className="text-sm text-slate-600 mt-1">
                {educationVerification.message}
              </p>

            </div>

            <p className="text-xs text-slate-400 mt-4">
              This check is for guidance only. Final recognition and loan eligibility are determined by the relevant authority and authorized Channel Partner.
            </p>

          </div>
        )}

      {/* =====================================================
          PROJECT TYPE
          ===================================================== */}

      {step === 'project_type' && (
        <div className="animate-fade-in">

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {tr('questionProjectType')}
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            {tr('projectTypeHint')}
          </p>

          <input
            type="text"
            autoFocus
            value={projectType}
            onChange={(e) =>
              setProjectType(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                nextStep();
              }
            }}
            placeholder="tailoring, retail, transport..."
            className="input-field"
          />

        </div>
      )}

      {/* =====================================================
          LOCATION
          ===================================================== */}

      {step === 'location' && (
        <div className="animate-fade-in">

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {tr('questionLocation')}
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            {tr('locationHint')}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

            {Object.entries(
              cityCoordinates
            ).map(([key, cityData]) => (

              <button
                type="button"
                key={key}
                onClick={() =>
                  setCity(key)
                }
                className={`
                  flex
                  items-center
                  gap-2
                  p-4
                  rounded-xl
                  border-2
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    city === key
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }
                `}
              >

                <MapPin
                  className={`
                    w-4
                    h-4
                    ${
                      city === key
                        ? 'text-primary-600'
                        : 'text-slate-400'
                    }
                  `}
                />

                {cityData.label}

              </button>

            ))}

          </div>
        </div>
      )}

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="
          flex
          items-start
          gap-2
          mt-4
          p-3
          rounded-xl
          bg-error-50
          border
          border-error-200
          animate-fade-in
        ">

          <AlertCircle
            className="
              w-5
              h-5
              text-error-500
              flex-shrink-0
              mt-0.5
            "
          />

          <p className="text-sm text-error-700">
            {error}
          </p>

        </div>
      )}

      {/* =====================================================
          INCOME LIMIT POPUP
          ===================================================== */}

      {showIncomeLimitPopup && (
        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/40
          px-4
          animate-fade-in
        ">

          <div className="
            w-full
            max-w-2xl
            rounded-2xl
            bg-white
            p-6
            shadow-2xl
            dark:bg-slate-900
            animate-popup-attention
          ">

            <div className="flex justify-center mb-4">

              <div className="
                flex
                items-center
                justify-center
                w-16
                h-16
                rounded-full
                bg-error-50
              ">

                <XCircle className="
                  w-9
                  h-9
                  text-error-500
                " />

              </div>

            </div>

            <h3 className="
              text-xl
              font-bold
              text-center
              text-error-600
              dark:text-error-400
            ">
              Not eligible
            </h3>

            <p className="
              mt-3
              text-sm
              leading-6
              text-center
              text-slate-600
              dark:text-slate-300
            ">
              Family income ₹
              {Number(income).toLocaleString(
                'en-IN'
              )}{' '}
              exceeds the ₹5,00,000 SC eligibility limit.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowIncomeLimitPopup(false);
                setIncome('');
              }}
              className="
                mt-6
                mx-auto
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border-2
                border-slate-300
                px-6
                py-3
                font-semibold
                text-slate-700
                hover:bg-slate-50
                transition
                dark:border-slate-600
                dark:text-slate-200
                dark:hover:bg-slate-800
              "
            >

              <ArrowLeft className="w-4 h-4" />

              Try again

            </button>

          </div>
        </div>
      )}

      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <div className="
        flex
        items-center
        gap-3
        mt-6
        sm:justify-between
      ">

        {/* BACK */}

        <button
          type="button"
          onClick={prevStep}
          className="
            btn-secondary
            sm:!justify-center
            sm:!gap-2
          "
        >

          <ArrowLeft
            className="
              w-5
              h-5
              shrink-0
            "
          />

          <span>
            {tr('back')}
          </span>

        </button>

        {/* NEXT */}

        <button
          type="button"
          onClick={nextStep}
          className="
            btn-primary
            flex-1
            sm:!justify-center
            sm:!gap-2
          "
        >

          <span>
            {isLastStep
              ? tr('seeResults')
              : tr('next')}
          </span>

          <ArrowRight
            className="
              w-5
              h-5
              shrink-0
            "
          />

        </button>

      </div>

    </div>
  );
}