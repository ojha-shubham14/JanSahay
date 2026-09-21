import { useState } from 'react';

import {
  Mic,
  Store,
  GraduationCap,
  ArrowRight,
  Info,
  Globe2,
} from 'lucide-react';

import type {
  Language,
  Purpose,
} from '@/lib/types';

import {
  t,
  type TranslationKey,
} from '@/i18n/translations';

interface HomeScreenProps {
  lang: Language;

  onLangChange: (
    newLang: Language
  ) => void;

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
  const tr = (
    key: TranslationKey
  ) => t(lang, key);

  const [
    showLanguageModal,
    setShowLanguageModal,
  ] = useState(true);

  const [
    selectedLanguage,
    setSelectedLanguage,
  ] = useState<Language>(lang);

  /* =========================================================
     LANGUAGES
     ========================================================= */

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
    <div
      className="
        relative
        min-h-full
        animate-fade-in
      "
    >

      {/* =====================================================
          LANGUAGE POPUP
          
          IMPORTANT:
          The background is controlled globally by App.tsx.

          This popup only sits above that background.
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

              border
              border-slate-200

              p-6
              sm:p-8

              shadow-2xl

              animate-popup-attention
            "
          >

            {/* =================================================
                GLOBE
                ================================================= */}

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
                "
              >
                <Globe2 className="w-7 h-7" />
              </div>

            </div>


            {/* =================================================
                HEADING
                ================================================= */}

            <h2
              className="
                text-xl
                sm:text-2xl

                font-bold
                text-center

                text-slate-900
              "
            >
              {tr('languagePrompt')}
            </h2>


            {/* =================================================
                SUBTITLE
                ================================================= */}

            <p
              className="
                text-sm
                text-center

                text-slate-500

                mt-2
              "
            >
              {tr('languagePromptSubtitle')}
            </p>


            {/* =================================================
                LANGUAGE OPTIONS
                ================================================= */}

            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-4

                gap-3

                mt-6
              "
            >

              {languages.map(
                (language) => {
                  const selected =
                    selectedLanguage ===
                    language.code;

                  return (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() =>
                        setSelectedLanguage(
                          language.code
                        )
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
                            `
                            : `
                              border-slate-200
                              bg-white
                              text-slate-700

                              hover:border-primary-300
                              hover:bg-primary-50/50
                            `
                        }
                      `}
                    >

                      <div
                        className="
                          font-bold
                          text-base
                        "
                      >
                        {language.native}
                      </div>

                      <div
                        className="
                          text-xs
                          mt-1
                          opacity-70
                        "
                      >
                        {language.english}
                      </div>

                    </button>
                  );
                }
              )}

            </div>


            {/* =================================================
                CONTINUE
                ================================================= */}

            <button
              type="button"
              onClick={() => {
                onLangChange(
                  selectedLanguage
                );

                setShowLanguageModal(
                  false
                );
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

              <ArrowRight
                className="w-4 h-4"
              />

            </button>

          </div>

        </div>
      )}


      {/* =====================================================
          MAIN JANSAHAY CONTENT
          
          IMPORTANT:
          There is NO background image here.

          App.tsx owns the single global background.
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

            lg:px-0
            lg:max-w-6xl
            lg:mx-auto
          "
        >

          <div className="w-full lg:max-w-6xl lg:mx-auto">


            {/* =================================================
                HERO HEADING
                ================================================= */}

            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                xl:text-6xl

                font-bold

                text-slate-900

                max-w-2xl
                mx-auto

                lg:max-w-4xl

                leading-tight

                drop-shadow-sm
              "
            >
              {tr('heroTitle')}
            </h2>


            {/* =================================================
                HERO SUBTITLE
                ================================================= */}

            <p
              className="
                text-slate-700

                mt-4

                max-w-xl
                mx-auto

                text-base
                sm:text-lg
                lg:text-xl

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

                lg:max-w-4xl
              "
            >
              {/* =================================================
                  PURPOSE CHOICES
                  ================================================= */}

              <div
                className="
                  grid
                  grid-cols-2

                  gap-3
                  lg:gap-5
                "
              >


                {/* =================================================
                    BUSINESS
                    ================================================= */}

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

                    lg:p-6
                    lg:min-h-[120px]

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
                  "
                >

                  <Store
                    className="
                      w-7
                      h-7

                      sm:w-8
                      sm:h-8
                      lg:w-10
                      lg:h-10

                      text-accent-600

                      flex-shrink-0
                    "
                  />

                  <div
                    className="min-w-0"
                  >

                    <span
                      className="
                        block

                        text-sm
                        sm:text-base
                        lg:text-lg

                        font-semibold

                        text-slate-800
                      "
                    >
                      {tr('businessLoan')}
                    </span>

                    <span
                      className="
                        hidden
                        sm:block

                        text-xs
                        lg:text-sm

                        text-slate-500

                        mt-1
                      "
                    >
                      For your business
                      needs
                    </span>

                  </div>

                </button>


                {/* =================================================
                    EDUCATION
                    ================================================= */}

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

                  <div
                    className="min-w-0"
                  >

                    <span
                      className="
                        block

                        text-sm
                        sm:text-base

                        font-semibold

                        text-slate-800
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
                      "
                    >
                      For higher education
                    </span>

                  </div>

                </button>

              </div>

              {/* =================================================
                  OR DIVIDER
                  ================================================= */}

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

                    bg-slate-400
                  "
                />

                <span
                  className="
                    text-xs
                    font-medium

                    text-slate-600

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

                    bg-slate-400
                  "
                />

              </div>

              <button
                type="button"
                onClick={() =>
                  onStart(
                    'conversation'
                  )
                }
                className="
                  w-full

                  flex
                  items-center
                  gap-4

                  p-4
                  sm:p-5

                  lg:p-6

                  rounded-md

                  bg-primary-700
                  text-white

                  hover:bg-primary-800

                  transition-colors
                  duration-150

                  shadow-md
                "
              >

                {/* Microphone */}

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
                  <Mic
                    className="w-5 h-5"
                  />
                </div>


                {/* Text */}

                <div
                  className="
                    flex-1
                    text-left
                  "
                >

                  <p
                    className="
                      font-bold
                      text-base
                      sm:text-lg
                    "
                  >
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
                    Speak or type in
                    simple language
                  </p>

                </div>


                {/* Arrow */}

                <ArrowRight
                  className="
                    w-5
                    h-5

                    flex-shrink-0
                  "
                />

              </button>
            </div>


            {/* =================================================
                SCROLL INDICATOR
                ================================================= */}

            <div
              className="
                mt-10

                flex
                flex-col
                items-center

                text-slate-500
              "
            >

              <span
                className="
                  text-xs
                  font-medium
                "
              >
                Scroll down to know
                more
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

            lg:px-0
            lg:max-w-6xl
            lg:mx-auto
          "
        >


          {/* =================================================
              KEY BENEFITS
              ================================================= */}

          <div
            className="
              portal-section

              lg:p-8

              bg-white/80
              backdrop-blur-sm
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


              {/* Simple */}

              <div className="text-center">

                <div
                  className="
                    text-primary-600
                    text-xl
                    mb-1
                  "
                >
                  ✓
                </div>

                <p
                  className="
                    font-semibold
                    text-slate-800
                    text-sm
                  "
                >
                  Simple & Easy
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500

                    mt-1
                  "
                >
                  Designed for
                  citizens
                </p>

              </div>


              {/* Languages */}

              <div className="text-center">

                <div
                  className="
                    text-primary-600
                    text-xl
                    mb-1
                  "
                >
                  ◎
                </div>

                <p
                  className="
                    font-semibold
                    text-slate-800
                    text-sm
                  "
                >
                  Multiple Languages
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500

                    mt-1
                  "
                >
                  English, Hindi,
                  Kannada & Tamil
                </p>

              </div>


              {/* Clear Information */}

              <div className="text-center">

                <div
                  className="
                    text-primary-600
                    text-xl
                    mb-1
                  "
                >
                  ✓
                </div>

                <p
                  className="
                    font-semibold
                    text-slate-800
                    text-sm
                  "
                >
                  Clear Information
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500

                    mt-1
                  "
                >
                  Easy to understand
                </p>

              </div>


              {/* Citizen Friendly */}

              <div className="text-center">

                <div
                  className="
                    text-primary-600
                    text-xl
                    mb-1
                  "
                >
                  ♙
                </div>

                <p
                  className="
                    font-semibold
                    text-slate-800
                    text-sm
                  "
                >
                  Citizen Friendly
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500

                    mt-1
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

              lg:p-8

              bg-white/80
              backdrop-blur-sm
            "
          >

            <h3
              className="
                portal-section-title
                mb-5
              "
            >
              How JanSahay helps you
            </h3>


            <div
              className="
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-5
              "
            >

              {[
                {
                  number: '1',
                  title: tr('step1Title'),
                  description: tr('step1Desc'),
                },
                {
                  number: '2',
                  title: tr('step2Title'),
                  description: tr('step2Desc'),
                },
                {
                  number: '3',
                  title: tr('step3Title'),
                  description: tr('step3Desc'),
                },
                {
                  number: '4',
                  title: tr('step4Title'),
                  description: tr('step4Desc'),
                },
                {
                  number: '5',
                  title: tr('step5Title'),
                  description: tr('step5Desc'),
                },
              ].map(
                (item) => (

                  <div
                    key={item.number}
                    className="
                      flex
                      gap-3
                    "
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
                        "
                      >
                        {item.description}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>


          {/* =================================================
              IMPORTANT INFORMATION
              ================================================= */}

          <div
            className="
              portal-notice

              lg:p-6

              bg-white/85
              backdrop-blur-sm
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
                  "
                >
                  JanSahay helps you find
                  and understand suitable
                  government schemes.
                  Final eligibility and loan
                  approval are decided by
                  the authorized Channel
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