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

              rounded-2xl

              bg-white

              border
              border-slate-200

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

                text-slate-950
              "
            >
              {tr('languagePrompt')}
            </h2>

            {/* Subtitle */}

            <p
              className="
                text-sm
                text-center

                text-slate-600
                sm:text-slate-500

                mt-2
              "
            >
              {tr('languagePromptSubtitle')}
            </p>

            {/* Language options */}

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
                        rounded-xl
                        border-2

                        px-3
                        py-3

                        transition-all
                        duration-200

                        ${
                          selected
                            ? `
                              border-primary-500
                              bg-primary-50
                              text-primary-800
                              shadow-sm
                            `
                            : `
                              border-slate-200
                              bg-white
                              text-slate-800

                              hover:border-primary-300
                              hover:bg-primary-50/60
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

            {/* Continue */}

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

                rounded-xl

                bg-blue-600
                hover:bg-blue-700

                px-5
                py-3.5

                text-white
                font-semibold

                shadow-sm

                transition-all
                duration-200

                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2
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
          App.tsx owns the global background.
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

            {/* Hero heading */}

            <h2
              className="
                text-3xl
                sm:text-4xl

                font-bold

                text-slate-950
                sm:text-slate-900

                max-w-2xl
                mx-auto

                leading-tight

                drop-shadow-sm
              "
            >
              {tr('heroTitle')}
            </h2>

            {/* Hero subtitle */}

            <p
              className="
                text-slate-800
                sm:text-slate-700

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

            {/* Main actions */}

            <div
              className="
                mt-8

                space-y-4

                max-w-xl
                mx-auto
              "
            >

              {/* Business + Education */}

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

                    rounded-2xl

                    bg-white/90
                    backdrop-blur-sm

                    border-2
                    border-slate-200

                    shadow-sm

                    hover:border-blue-400
                    hover:bg-white
                    hover:shadow-md

                    transition-all
                    duration-200

                    text-left
                  "
                >

                  <Store
                    className="
                      w-7
                      h-7

                      sm:w-8
                      sm:h-8

                      text-blue-600

                      flex-shrink-0
                    "
                  />

                  <div
                    className="
                      min-w-0
                    "
                  >

                    <span
                      className="
                        block

                        text-sm
                        sm:text-base

                        font-semibold

                        text-slate-900
                      "
                    >
                      {tr('businessLoan')}
                    </span>

                    <span
                      className="
                        hidden
                        sm:block

                        text-xs

                        text-slate-600

                        mt-1
                      "
                    >
                      For your business
                      needs
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

                    rounded-2xl

                    bg-white/90
                    backdrop-blur-sm

                    border-2
                    border-slate-200

                    shadow-sm

                    hover:border-blue-400
                    hover:bg-white
                    hover:shadow-md

                    transition-all
                    duration-200

                    text-left
                  "
                >

                  <GraduationCap
                    className="
                      w-7
                      h-7

                      sm:w-8
                      sm:h-8

                      text-blue-600

                      flex-shrink-0
                    "
                  />

                  <div
                    className="
                      min-w-0
                    "
                  >

                    <span
                      className="
                        block

                        text-sm
                        sm:text-base

                        font-semibold

                        text-slate-900
                      "
                    >
                      {tr('educationLoan')}
                    </span>

                    <span
                      className="
                        hidden
                        sm:block

                        text-xs

                        text-slate-600

                        mt-1
                      "
                    >
                      For higher education
                    </span>

                  </div>

                </button>

              </div>

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
                    bg-slate-500
                  "
                />

                <span
                  className="
                    text-xs
                    font-medium

                    text-slate-700

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
                    bg-slate-500
                  "
                />

              </div>

              {/* Conversation */}

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

                  rounded-2xl

                  bg-blue-600
                  hover:bg-blue-700

                  text-white

                  transition-all
                  duration-200

                  shadow-md
                  hover:shadow-lg
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-center

                    w-10
                    h-10

                    rounded-xl

                    bg-white/15

                    flex-shrink-0
                  "
                >
                  <Mic className="w-5 h-5" />
                </div>

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

                      text-blue-100

                      mt-0.5
                    "
                  >
                    Speak or type in
                    simple language
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

            </div>

            {/* Scroll indicator */}

            <div
              className="
                mt-10

                flex
                flex-col
                items-center

                text-slate-700
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
          "
        >

          {/* Benefits */}

          <div
            className="
              portal-section

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
                    text-slate-900
                    text-sm
                  "
                >
                  Simple & Easy
                </p>

                <p
                  className="
                    text-xs
                    text-slate-600
                    mt-1
                  "
                >
                  Designed for
                  citizens
                </p>

              </div>

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
                    text-slate-900
                    text-sm
                  "
                >
                  Multiple Languages
                </p>

                <p
                  className="
                    text-xs
                    text-slate-600
                    mt-1
                  "
                >
                  English, Hindi,
                  Kannada & Tamil
                </p>

              </div>

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
                    text-slate-900
                    text-sm
                  "
                >
                  Clear Information
                </p>

                <p
                  className="
                    text-xs
                    text-slate-600
                    mt-1
                  "
                >
                  Easy to understand
                </p>

              </div>

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
                    text-slate-900
                    text-sm
                  "
                >
                  Citizen Friendly
                </p>

                <p
                  className="
                    text-xs
                    text-slate-600
                    mt-1
                  "
                >
                  Built for easy access
                </p>

              </div>

            </div>

          </div>

          {/* How JanSahay helps */}

          <div
            className="
              portal-section

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

                          text-slate-900
                          text-sm
                        "
                      >
                        {item.title}
                      </p>

                      <p
                        className="
                          text-xs

                          text-slate-600

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

          {/* Important information */}

          <div
            className="
              portal-notice

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

                    text-slate-900
                    text-sm
                  "
                >
                  Important Information
                </h3>

                <p
                  className="
                    text-xs

                    text-slate-700

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