import { useState } from 'react';
import {
  Mic,
  Store,
  GraduationCap,
  ArrowRight,
  Info,
  Globe2,
} from 'lucide-react';

import type { Language, Purpose } from '@/lib/types';
import { t, type TranslationKey } from '@/i18n/translations';

interface HomeScreenProps {
  lang: Language;
  onLangChange: (newLang: Language) => void;
  onStart: (
    mode: 'guided' | 'conversation',
    purpose?: Purpose
  ) => void;
}

export function HomeScreen({
  lang,
  onLangChange,
  onStart,
}: HomeScreenProps) {
  const tr = (key: TranslationKey) => t(lang, key);

  const [showLanguageModal, setShowLanguageModal] =
    useState(true);

  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(lang);

  const languages: {
    code: Language;
    native: string;
    english: string;
  }[] = [
    {
      code: 'en',
      native: 'English',
      english: 'English',
    },
    {
      code: 'hi',
      native: 'हिंदी',
      english: 'Hindi',
    },
    {
      code: 'kn',
      native: 'ಕನ್ನಡ',
      english: 'Kannada',
    },
    {
      code: 'ta',
      native: 'தமிழ்',
      english: 'Tamil',
    },
  ];

  return (
    <div className="relative min-h-full animate-fade-in">

      {/* =====================================================
          LANGUAGE POPUP

          The global background is now controlled by App.tsx.
          This popup sits above it and blurs the background.
          ===================================================== */}

      {showLanguageModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]

            flex
            items-center
            justify-center

            px-4

            bg-slate-950/45
            backdrop-blur-md
          "
        >

          <div
            className="
              relative
              z-[101]

              w-full
              max-w-lg

              rounded-xl

              bg-white
              dark:bg-slate-900

              border
              border-slate-200
              dark:border-slate-700

              p-6
              sm:p-8

              shadow-2xl

              animate-popup-attention
            "
          >

            {/* Globe */}

            <div className="flex justify-center mb-4">

              <div
                className="
                  flex
                  items-center
                  justify-center

                  w-14
                  h-14

                  rounded-full

                  bg-primary-50
                  text-primary-600

                  dark:bg-primary-900/30
                  dark:text-primary-400
                "
              >
                <Globe2 className="w-7 h-7" />
              </div>

            </div>


            {/* Heading */}

            <h2
              className="
                text-xl
                sm:text-2xl

                font-bold
                text-center

                text-slate-900
                dark:text-white
              "
            >
              {tr('languagePrompt')}
            </h2>


            {/* Subtitle */}

            <p
              className="
                text-sm
                text-center

                text-slate-500
                dark:text-slate-400

                mt-2
              "
            >
              {tr('languagePromptSubtitle')}
            </p>


            {/* Languages */}

            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-4

                gap-3

                mt-6
              "
            >

              {languages.map((language) => {
                const selected =
                  selectedLanguage === language.code;

                return (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() =>
                      setSelectedLanguage(language.code)
                    }
                    className={`
                      rounded-lg
                      border-2

                      px-3
                      py-3

                      transition-colors
                      duration-150

                      ${
                        selected
                          ? `
                            border-primary-500
                            bg-primary-50
                            text-primary-700
                            shadow-sm

                            dark:border-primary-400
                            dark:bg-primary-950/40
                            dark:text-primary-300
                          `
                          : `
                            border-slate-200
                            bg-white
                            text-slate-700

                            hover:border-primary-300
                            hover:bg-primary-50/50

                            dark:border-slate-700
                            dark:bg-slate-800
                            dark:text-slate-200

                            dark:hover:border-primary-700
                          `
                      }
                    `}
                  >

                    <div className="font-bold text-base">
                      {language.native}
                    </div>

                    <div className="text-xs mt-1 opacity-70">
                      {language.english}
                    </div>

                  </button>
                );
              })}

            </div>


            {/* Continue */}

            <button
              type="button"
              onClick={() => {
                onLangChange(selectedLanguage);
                setShowLanguageModal(false);
              }}
              className="
                w-full

                mt-6

                inline-flex
                items-center
                justify-center
                gap-2

                rounded-md

                bg-primary-600
                px-5
                py-3.5

                text-white
                font-semibold

                hover:bg-primary-700

                transition-colors
                duration-150

                shadow-sm
              "
            >
              {tr('continueLanguage')}

              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}


      {/* =====================================================
          MAIN JANSAHAY CONTENT
          ===================================================== */}

      <div className="relative z-10">

        {/* ===================================================
            HERO
            =================================================== */}

        <section
          className="
            relative

            min-h-[calc(100vh-80px)]

            flex
            flex-col
            justify-center

            text-center

            pt-6
            sm:pt-10

            pb-8

            px-4
            sm:px-6
          "
        >

          <div className="w-full">

            {/* Heading */}

            <h2
              className="
                text-3xl
                sm:text-4xl

                font-bold

                text-slate-900
                dark:text-white

                max-w-2xl
                mx-auto

                leading-tight

                drop-shadow-sm
              "
            >
              {tr('heroTitle')}
            </h2>


            {/* Subtitle */}

            <p
              className="
                text-slate-700
                dark:text-slate-300

                mt-4

                max-w-xl
                mx-auto

                text-base
                sm:text-lg

                leading-relaxed

                drop-shadow-sm
              "
            >
              {tr('heroSubtitle')}
            </p>


            {/* =================================================
                PRIMARY ACTION
                ================================================= */}

            <div
              className="
                mt-8

                space-y-4

                max-w-xl
                mx-auto
              "
            >

              <button
                type="button"
                onClick={() =>
                  onStart('conversation')
                }
                className="
                  w-full

                  flex
                  items-center
                  gap-4

                  p-4
                  sm:p-5

                  rounded-md

                  bg-primary-700
                  text-white

                  hover:bg-primary-800

                  transition-colors
                  duration-150

                  shadow-md
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-center

                    w-10
                    h-10

                    rounded-md

                    bg-white/15

                    flex-shrink-0
                  "
                >
                  <Mic className="w-5 h-5" />
                </div>


                <div className="flex-1 text-left">

                  <p className="font-bold text-base sm:text-lg">
                    {tr('tellUs')}
                  </p>

                  <p
                    className="
                      text-xs
                      sm:text-sm

                      text-primary-100

                      mt-0.5
                    "
                  >
                    Speak or type in simple language
                  </p>

                </div>


                <ArrowRight
                  className="
                    w-5
                    h-5

                    flex-shrink-0
                  "
                />

              </button>


              {/* OR */}

              <div
                className="
                  flex
                  items-center
                  gap-3

                  py-1
                "
              >

                <div
                  className="
                    flex-1
                    h-px

                    bg-slate-200
                    dark:bg-slate-700
                  "
                />

                <span
                  className="
                    text-xs
                    font-medium

                    text-slate-400

                    uppercase
                    tracking-wide
                  "
                >
                  {tr('orDivider')}
                </span>

                <div
                  className="
                    flex-1
                    h-px

                    bg-slate-200
                    dark:bg-slate-700
                  "
                />

              </div>


              {/* =================================================
                  PURPOSE CHOICES
                  ================================================= */}

              <div
                className="
                  grid
                  grid-cols-2

                  gap-3
                "
              >

                {/* Business */}

                <button
                  type="button"
                  onClick={() =>
                    onStart(
                      'guided',
                      'business_project'
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3

                    p-4
                    sm:p-5

                    rounded-md

                    bg-white/90
                    backdrop-blur-sm

                    border
                    border-slate-300

                    shadow-sm

                    hover:border-primary-400
                    hover:bg-white

                    transition-colors
                    duration-150

                    text-left

                    dark:bg-slate-900/90
                    dark:border-slate-700

                    dark:hover:border-primary-600
                  "
                >

                  <Store
                    className="
                      w-7
                      h-7

                      sm:w-8
                      sm:h-8

                      text-accent-600

                      flex-shrink-0
                    "
                  />

                  <div className="min-w-0">

                    <span
                      className="
                        block

                        text-sm
                        sm:text-base

                        font-semibold

                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      {tr('businessLoan')}
                    </span>

                    <span
                      className="
                        hidden
                        sm:block

                        text-xs

                        text-slate-500

                        mt-1

                        dark:text-slate-400
                      "
                    >
                      For your business needs
                    </span>

                  </div>

                </button>


                {/* Education */}

                <button
                  type="button"
                  onClick={() =>
                    onStart(
                      'guided',
                      'education'
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3

                    p-4
                    sm:p-5

                    rounded-md

                    bg-white/90
                    backdrop-blur-sm

                    border
                    border-slate-300

                    shadow-sm

                    hover:border-primary-400
                    hover:bg-white

                    transition-colors
                    duration-150

                    text-left

                    dark:bg-slate-900/90
                    dark:border-slate-700

                    dark:hover:border-primary-600
                  "
                >

                  <GraduationCap
                    className="
                      w-7
                      h-7

                      sm:w-8
                      sm:h-8

                      text-primary-600

                      flex-shrink-0
                    "
                  />

                  <div className="min-w-0">

                    <span
                      className="
                        block

                        text-sm
                        sm:text-base

                        font-semibold

                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      {tr('educationLoan')}
                    </span>

                    <span
                      className="
                        hidden
                        sm:block

                        text-xs

                        text-slate-500

                        mt-1

                        dark:text-slate-400
                      "
                    >
                      For higher education
                    </span>

                  </div>

                </button>

              </div>

            </div>


            {/* Scroll indicator */}

            <div
              className="
                mt-10

                flex
                flex-col
                items-center

                text-slate-400
                dark:text-slate-500
              "
            >

              <span className="text-xs font-medium">
                Scroll down to know more
              </span>

              <ArrowRight
                className="
                  w-4
                  h-4

                  rotate-90

                  mt-2

                  animate-bounce
                "
              />

            </div>

          </div>

        </section>


        {/* ===================================================
            BELOW THE FOLD
            =================================================== */}

        <section
          className="
            mt-4

            space-y-5

            pb-8

            px-4
            sm:px-6
          "
        >

          {/* =================================================
              KEY BENEFITS
              ================================================= */}

          <div
            className="
              portal-section

              bg-white/80
              backdrop-blur-sm

              dark:bg-slate-900/85
            "
          >

            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-4

                gap-5
              "
            >

              <div className="text-center">

                <div className="text-primary-600 text-xl mb-1">
                  ✓
                </div>

                <p
                  className="
                    font-semibold
                    text-slate-800
                    text-sm
                    dark:text-slate-200
                  "
                >
                  Simple & Easy
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500
                    mt-1
                    dark:text-slate-400
                  "
                >
                  Designed for citizens
                </p>

              </div>


              <div className="text-center">

                <div className="text-primary-600 text-xl mb-1">
                  ◎
                </div>

                <p
                  className="
                    font-semibold
                    text-slate-800
                    text-sm
                    dark:text-slate-200
                  "
                >
                  Multiple Languages
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500
                    mt-1
                    dark:text-slate-400
                  "
                >
                  English, Hindi, Kannada & Tamil
                </p>

              </div>


              <div className="text-center">

                <div className="text-primary-600 text-xl mb-1">
                  ✓
                </div>

                <p
                  className="
                    font-semibold
                    text-slate-800
                    text-sm
                    dark:text-slate-200
                  "
                >
                  Clear Information
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500
                    mt-1
                    dark:text-slate-400
                  "
                >
                  Easy to understand
                </p>

              </div>


              <div className="text-center">

                <div className="text-primary-600 text-xl mb-1">
                  ♙
                </div>

                <p
                  className="
                    font-semibold
                    text-slate-800
                    text-sm
                    dark:text-slate-200
                  "
                >
                  Citizen Friendly
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500
                    mt-1
                    dark:text-slate-400
                  "
                >
                  Built for easy access
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              HOW JANSAHAY HELPS
              ================================================= */}

          <div
            className="
              portal-section

              bg-white/80
              backdrop-blur-sm

              dark:bg-slate-900/85
            "
          >

            <h3 className="portal-section-title mb-5">
              How JanSahay helps you
            </h3>

            <div
              className="
                grid
                gap-5
                sm:grid-cols-4
              "
            >

              {[
                {
                  number: '1',
                  title: tr('step1Title'),
                  description:
                    'Find schemes based on your needs and eligibility.',
                },
                {
                  number: '2',
                  title: tr('step2Title'),
                  description:
                    'Plan your loan with simple calculations.',
                },
                {
                  number: '3',
                  title: tr('step3Title'),
                  description:
                    'Locate nearby banks and channel partners.',
                },
                {
                  number: '4',
                  title: tr('step4Title'),
                  description:
                    'See required documents and next steps.',
                },
              ].map((item) => (

                <div
                  key={item.number}
                  className="flex gap-3"
                >

                  <div
                    className="
                      flex-shrink-0

                      flex
                      items-center
                      justify-center

                      w-8
                      h-8

                      rounded-full

                      bg-primary-600
                      text-white

                      text-sm
                      font-bold
                    "
                  >
                    {item.number}
                  </div>

                  <div>

                    <p
                      className="
                        font-semibold

                        text-slate-800
                        text-sm

                        dark:text-slate-200
                      "
                    >
                      {item.title}
                    </p>

                    <p
                      className="
                        text-xs
                        text-slate-500

                        mt-1

                        leading-relaxed

                        dark:text-slate-400
                      "
                    >
                      {item.description}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* =================================================
              IMPORTANT INFORMATION
              ================================================= */}

          <div
            className="
              portal-notice

              bg-white/85
              backdrop-blur-sm

              dark:bg-slate-900/85
            "
          >

            <div className="flex gap-3">

              <Info
                className="
                  w-5
                  h-5

                  text-primary-600

                  flex-shrink-0
                  mt-0.5
                "
              />

              <div>

                <h3
                  className="
                    font-semibold

                    text-slate-800
                    text-sm

                    dark:text-slate-200
                  "
                >
                  Important Information
                </h3>

                <p
                  className="
                    text-xs

                    text-slate-600

                    mt-1

                    leading-relaxed

                    dark:text-slate-400
                  "
                >
                  JanSahay helps you find and understand suitable
                  government schemes. Final eligibility and loan
                  approval are decided by the authorized Channel
                  Partner.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}