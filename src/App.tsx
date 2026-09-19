import { useEffect, useState } from 'react';
import { ArrowLeft, Home } from 'lucide-react';

import { useTheme } from '@/hooks/useThemes';
import { Header } from '@/components/Header';
import { Stepper } from '@/components/Stepper';
import { HomeScreen } from '@/components/HomeScreen';
import { GuidedWizard } from '@/components/GuidedWizard';
import { ConversationMode } from '@/components/ConversationMode';
import { SchemeResult } from '@/components/SchemeResult';
import { EMICalculator } from '@/components/EMICalculator';
import { PartnerLocator } from '@/components/PartnerLocator';
import { ReadinessChecklist } from '@/components/ReadinessChecklist';
import { ContactUs } from '@/components/ContactUs';
import { FAQ } from '@/components/faq';
import { Dashboard } from '@/components/Dashboard';

import type {
  Language,
  Purpose,
  ApplicantProfile,
  SchemeMatch,
  RankedPartner,
} from '@/lib/types';

import { createEmptyProfile } from '@/lib/types';
import { recommendScheme } from '@/lib/recommender';

type Screen =
  | 'home'
  | 'input'
  | 'scheme'
  | 'emi'
  | 'partner'
  | 'readiness'
  | 'dashboard'
  | 'faq'
  | 'contact';

function App() {
  const {
    mode: themeMode,
    setMode: setThemeMode,
  } = useTheme();

  /* =========================================================
     GLOBAL STATE
     ========================================================= */

  const [lang, setLang] =
    useState<Language>('en');

  const [screen, setScreen] =
    useState<Screen>('home');

  const [inputMode, setInputMode] =
    useState<'guided' | 'conversation'>(
      'guided'
    );

  const [profile, setProfile] =
    useState<ApplicantProfile>(
      createEmptyProfile()
    );

  const [match, setMatch] =
    useState<SchemeMatch | null>(null);

  const [selectedPartner, setSelectedPartner] =
    useState<RankedPartner | null>(null);


  /* =========================================================
     NAVIGATION
     ========================================================= */

  const navigate = (nextScreen: Screen) => {
    window.history.pushState(
      { screen: nextScreen },
      '',
      window.location.href
    );

    setScreen(nextScreen);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  /* =========================================================
     BROWSER BACK BUTTON
     ========================================================= */

  useEffect(() => {
    window.history.replaceState(
      { screen: 'home' },
      '',
      window.location.href
    );

    const handlePopState = (
      event: PopStateEvent
    ) => {
      const previousScreen =
        event.state?.screen as
          | Screen
          | undefined;

      setScreen(
        previousScreen ?? 'home'
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, []);


  /* =========================================================
     LANGUAGE
     ========================================================= */

  const handleLangChange = (
    newLang: Language
  ) => {
    setLang(newLang);

    setProfile((prev) => ({
      ...prev,
      language: newLang,
    }));
  };


  /* =========================================================
     START JANSAHAY FLOW
     ========================================================= */

  const handleStart = (
    mode:
      | 'guided'
      | 'conversation',
    purpose?: Purpose
  ) => {
    setInputMode(mode);

    const fresh =
      createEmptyProfile();

    fresh.language = lang;

    if (purpose) {
      fresh.purpose = purpose;
    }

    setProfile(fresh);
    setSelectedPartner(null);

    navigate('input');
  };


  /* =========================================================
     PROFILE COMPLETE
     ========================================================= */

  const handleProfileComplete = (
    completedProfile: ApplicantProfile
  ) => {
    setProfile(
      completedProfile
    );

    const result =
      recommendScheme(
        completedProfile
          .annual_family_income!,
        completedProfile.purpose!,
        completedProfile
          .estimated_cost!,
        completedProfile
          .education_status ??
          undefined
      );

    setMatch(result);
    setSelectedPartner(null);

    navigate('scheme');
  };


  /* =========================================================
     RESET
     ========================================================= */

  const handleReset = () => {
    setProfile(
      createEmptyProfile()
    );

    setMatch(null);

    setSelectedPartner(null);

    navigate('home');
  };


  /* =========================================================
     FLOW SCREEN CHECK
     ========================================================= */

  const isFlowScreen =
    screen === 'scheme' ||
    screen === 'emi' ||
    screen === 'partner' ||
    screen === 'readiness';


  /* =========================================================
     BACK
     ========================================================= */

  const handlePrevious = () => {
    window.history.back();
  };


  /* =========================================================
     STEPPER
     ========================================================= */

  const stepperStep =
    screen === 'scheme'
      ? 2
      : screen === 'emi'
        ? 3
        : screen === 'partner'
          ? 4
          : screen === 'readiness'
            ? 5
            : 2;


  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-clip
        bg-transparent
      "
    >

      {/* =====================================================
          GLOBAL JANSAHAY BACKGROUND

          DESKTOP:
          backgroundHomepage.png

          MOBILE:
          backgroundHomepageMobile.png

          This background belongs to App.tsx so it remains
          behind the complete website, not only HomeScreen.
          ===================================================== */}

      <div
        className="
          fixed
          inset-0
          z-0
          overflow-hidden
          pointer-events-none
        "
      >

        {/* =================================================
            DESKTOP BACKGROUND
            ================================================= */}

        <img
          src={`${import.meta.env.BASE_URL}images/backgroundHomepage.png`}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="
            hidden
            sm:block

            absolute
            inset-0

            w-full
            h-full

            object-cover
            object-center

            select-none
          "
        />


        {/* =================================================
            MOBILE BACKGROUND
            ================================================= */}

        <img
          src={`${import.meta.env.BASE_URL}images/backgroundHomepageMobile.png`}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="
            block
            sm:hidden

            absolute
            inset-0

            w-full
            h-full

            object-cover
            object-center

            select-none
          "
        />


        {/* =================================================
            VERY LIGHT OVERLAY

            Only 3% white so the actual background remains
            clearly visible.
            ================================================= */}

        <div
          className="
            absolute
            inset-0
            bg-white/[0.03]
          "
        />

      </div>


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div
        className="
          sticky
          top-0
          z-50
        "
      >
        <Header
          lang={lang}
          onLangChange={
            handleLangChange
          }
          onHomeClick={() =>
            navigate('home')
          }
          onDashboardClick={() =>
            navigate('dashboard')
          }
          onFAQClick={() =>
            navigate('faq')
          }
          onContactClick={() =>
            navigate('contact')
          }
          showDashboard={
            screen === 'dashboard'
          }
          themeMode={themeMode}
          onThemeChange={
            setThemeMode
          }
        />
      </div>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main
        className="
          relative
          z-10

          max-w-2xl
          mx-auto

          px-4
          sm:px-6

          pb-16
          pt-6

          bg-transparent
        "
      >

        {/* ===================================================
            FLOW NAVIGATION
            =================================================== */}

        {isFlowScreen && (
          <div
            className="
              flex
              items-center
              justify-between
              mb-4
            "
          >

            <button
              onClick={
                handlePrevious
              }
              className="
                btn-secondary
              "
            >
              <ArrowLeft
                className="
                  w-4
                  h-4
                "
              />

              Back
            </button>


            <button
              onClick={
                handleReset
              }
              className="
                btn-ghost
              "
            >
              <Home
                className="
                  w-4
                  h-4
                "
              />

              Home
            </button>

          </div>
        )}


        {/* ===================================================
            DASHBOARD
            =================================================== */}

        {screen === 'dashboard' && (
          <Dashboard
            lang={lang}
            onBack={() =>
              navigate('home')
            }
          />
        )}


        {/* ===================================================
            HOME
            =================================================== */}

        {screen === 'home' && (
          <HomeScreen
            lang={lang}
            onLangChange={
              handleLangChange
            }
            onStart={
              handleStart
            }
          />
        )}


        {/* ===================================================
            GUIDED WIZARD
            =================================================== */}

        {screen === 'input' &&
          inputMode ===
            'guided' && (
            <GuidedWizard
              lang={lang}
              initialProfile={
                profile
              }
              onComplete={
                handleProfileComplete
              }
              onBack={() =>
                navigate('home')
              }
            />
          )}


        {/* ===================================================
            CONVERSATION MODE
            =================================================== */}

        {screen === 'input' &&
          inputMode ===
            'conversation' && (
            <ConversationMode
              lang={lang}
              initialProfile={
                profile
              }
              onComplete={
                handleProfileComplete
              }
              onBack={() =>
                navigate('home')
              }
            />
          )}


        {/* ===================================================
            FAQ
            =================================================== */}

        {screen === 'faq' && (
          <FAQ
            lang={lang}
            onBack={() =>
              navigate('home')
            }
          />
        )}


        {/* ===================================================
            CONTACT
            =================================================== */}

        {screen === 'contact' && (
          <ContactUs
            lang={lang}
            onBack={() =>
              navigate('home')
            }
          />
        )}


        {/* ===================================================
            STEPPER
            =================================================== */}

        {(screen === 'scheme' ||
          screen === 'emi' ||
          screen === 'partner' ||
          screen ===
            'readiness') && (
          <Stepper
            currentStep={
              stepperStep
            }
            lang={lang}
          />
        )}


        {/* ===================================================
            SCHEME RESULT
            =================================================== */}

        {screen === 'scheme' &&
          match && (
            <SchemeResult
              lang={lang}
              match={match}
              onProceed={() =>
                match.eligible &&
                navigate('emi')
              }
              onReset={
                handleReset
              }
            />
          )}


        {/* ===================================================
            EMI CALCULATOR
            =================================================== */}

        {screen === 'emi' &&
          match?.eligible && (
            <EMICalculator
              lang={lang}
              match={match}
              onProceed={() =>
                navigate('partner')
              }
              onReset={
                handleReset
              }
            />
          )}


        {/* ===================================================
            PARTNER LOCATOR
            =================================================== */}

        {screen === 'partner' &&
          match?.eligible && (
            <PartnerLocator
              lang={lang}
              match={match}
              userCity={
                profile.location
                  .display_name
              }
              userLatitude={
                profile.location
                  .latitude
              }
              userLongitude={
                profile.location
                  .longitude
              }
              onProceed={(
                partner
              ) => {
                setSelectedPartner(
                  partner
                );

                navigate(
                  'readiness'
                );
              }}
              onReset={
                handleReset
              }
            />
          )}


        {/* ===================================================
            READINESS / SUMMARY
            =================================================== */}

        {screen ===
          'readiness' &&
          match?.eligible && (
            <ReadinessChecklist
              lang={lang}
              match={match}
              profile={profile}
              selectedPartner={
                selectedPartner
              }
              onReset={
                handleReset
              }
            />
          )}

      </main>


      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer
        className="
          relative
          z-10

          border-t
          border-slate-200/60

          bg-white/50
          backdrop-blur-sm

          dark:border-slate-800
          dark:bg-slate-950/50
        "
      >

        <div
          className="
            max-w-6xl
            mx-auto

            px-4
            sm:px-6

            py-4

            text-center
          "
        >

          <p
            className="
              text-xs
              text-slate-500
            "
          >
            Interest rate bands and
            partner NPA data are
            illustrative for the demo.
            In production, these would
            integrate with NSFDC/SCA
            live data feeds.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;