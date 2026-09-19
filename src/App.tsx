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
  const { mode: themeMode, setMode: setThemeMode } = useTheme();

  const [lang, setLang] = useState<Language>('en');
  const [screen, setScreen] = useState<Screen>('home');

  const [inputMode, setInputMode] = useState<
    'guided' | 'conversation'
  >('guided');

  const [profile, setProfile] =
    useState<ApplicantProfile>(createEmptyProfile());

  const [match, setMatch] =
    useState<SchemeMatch | null>(null);

  const [selectedPartner, setSelectedPartner] =
    useState<RankedPartner | null>(null);

  /* =========================================================
     BACKGROUND PARALLAX
     ========================================================= */

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const backgroundOffset = Math.min(
    scrollY * 0.08,
    180
  );

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
  };

  /* =========================================================
     BROWSER BACK
     ========================================================= */

  useEffect(() => {
    window.history.replaceState(
      { screen: 'home' },
      '',
      window.location.href
    );

    const handlePopState = (event: PopStateEvent) => {
      const previousScreen =
        event.state?.screen as Screen | undefined;

      setScreen(previousScreen ?? 'home');
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

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);

    setProfile((prev) => ({
      ...prev,
      language: newLang,
    }));
  };

  /* =========================================================
     START
     ========================================================= */

  const handleStart = (
    mode: 'guided' | 'conversation',
    purpose?: Purpose
  ) => {
    setInputMode(mode);

    const fresh = createEmptyProfile();

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
    setProfile(completedProfile);

    const result = recommendScheme(
      completedProfile.annual_family_income!,
      completedProfile.purpose!,
      completedProfile.estimated_cost!,
      completedProfile.education_status ?? undefined
    );

    setMatch(result);
    setSelectedPartner(null);

    navigate('scheme');
  };

  /* =========================================================
     RESET
     ========================================================= */

  const handleReset = () => {
    setProfile(createEmptyProfile());
    setMatch(null);
    setSelectedPartner(null);

    navigate('home');
  };

  /* =========================================================
     FLOW
     ========================================================= */

  const isFlowScreen =
    screen === 'scheme' ||
    screen === 'emi' ||
    screen === 'partner' ||
    screen === 'readiness';

  const handlePrevious = () => {
    window.history.back();
  };

  const stepperStep =
    screen === 'scheme'
      ? 1
      : screen === 'emi'
        ? 2
        : screen === 'partner' ||
            screen === 'readiness'
          ? 3
          : 1;

  /* =========================================================
     APP
     ========================================================= */

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-x-hidden

        bg-slate-50
        dark:bg-slate-950
      "
    >

      {/* =====================================================
          GLOBAL BACKGROUND

          IMPORTANT:
          This is now in App.tsx, outside HomeScreen.

          It covers the COMPLETE viewport and remains present
          while the user scrolls.
          ===================================================== */}

      {screen === 'home' && (
        <div
          className="
            fixed
            inset-0
            z-0
            overflow-hidden
            pointer-events-none
          "
        >

          {/* Desktop + mobile background */}

          <img
            src={`${import.meta.env.BASE_URL}images/backgroundHomepage.png`}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="
              absolute
              inset-0

              w-full
              h-full

              object-cover
              object-center

              max-[639px]:object-[center_center]

              select-none
            "
            style={{
              transform: `translate3d(0, ${-backgroundOffset}px, 0) scale(1.03)`,
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          />

          {/* Light overlay */}

          <div
            className="
              absolute
              inset-0

              bg-white/10

              dark:bg-slate-950/45
            "
          />

        </div>
      )}


      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="relative z-40">
        <Header
          lang={lang}
          onLangChange={handleLangChange}
          onDashboardClick={() =>
            navigate('dashboard')
          }
          onFAQClick={() =>
            navigate('faq')
          }
          onContactClick={() =>
            navigate('contact')
          }
          showDashboard={screen === 'dashboard'}
          themeMode={themeMode}
          onThemeChange={setThemeMode}
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
              onClick={handlePrevious}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleReset}
              className="btn-ghost"
            >
              <Home className="w-4 h-4" />
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
            onBack={() => navigate('home')}
          />
        )}


        {/* ===================================================
            HOME
            =================================================== */}

        {screen === 'home' && (
          <HomeScreen
            lang={lang}
            onLangChange={handleLangChange}
            onStart={handleStart}
          />
        )}


        {/* ===================================================
            GUIDED WIZARD
            =================================================== */}

        {screen === 'input' &&
          inputMode === 'guided' && (
            <GuidedWizard
              lang={lang}
              initialProfile={profile}
              onComplete={handleProfileComplete}
              onBack={() => navigate('home')}
            />
          )}


        {/* ===================================================
            CONVERSATION
            =================================================== */}

        {screen === 'input' &&
          inputMode === 'conversation' && (
            <ConversationMode
              lang={lang}
              initialProfile={profile}
              onComplete={handleProfileComplete}
              onBack={() => setScreen('home')}
            />
          )}


        {/* ===================================================
            FAQ
            =================================================== */}

        {screen === 'faq' && (
          <FAQ
            lang={lang}
            onBack={() => navigate('home')}
          />
        )}


        {/* ===================================================
            CONTACT
            =================================================== */}

        {screen === 'contact' && (
          <ContactUs
            lang={lang}
            onBack={() => navigate('home')}
          />
        )}


        {/* ===================================================
            STEPPER
            =================================================== */}

        {(screen === 'scheme' ||
          screen === 'emi' ||
          screen === 'partner' ||
          screen === 'readiness') && (
          <Stepper
            currentStep={stepperStep}
            lang={lang}
          />
        )}


        {/* ===================================================
            SCHEME
            =================================================== */}

        {screen === 'scheme' && match && (
          <SchemeResult
            lang={lang}
            match={match}
            onProceed={() =>
              match.eligible &&
              navigate('emi')
            }
            onReset={handleReset}
          />
        )}


        {/* ===================================================
            EMI
            =================================================== */}

        {screen === 'emi' &&
          match?.eligible && (
            <EMICalculator
              lang={lang}
              match={match}
              onProceed={() =>
                navigate('partner')
              }
              onReset={handleReset}
            />
          )}


        {/* ===================================================
            PARTNER
            =================================================== */}

        {screen === 'partner' &&
          match?.eligible && (
            <PartnerLocator
              lang={lang}
              match={match}
              userCity={
                profile.location.display_name
              }
              userLatitude={
                profile.location.latitude
              }
              userLongitude={
                profile.location.longitude
              }
              onProceed={(partner) => {
                setSelectedPartner(partner);
                navigate('readiness');
              }}
              onReset={handleReset}
            />
          )}


        {/* ===================================================
            READINESS
            =================================================== */}

        {screen === 'readiness' &&
          match?.eligible && (
            <ReadinessChecklist
              lang={lang}
              match={match}
              profile={profile}
              selectedPartner={selectedPartner}
              onReset={handleReset}
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

          <p className="text-xs text-slate-400">
            Interest rate bands and partner NPA data are
            illustrative for the demo. In production,
            these would integrate with NSFDC/SCA live
            data feeds.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default App;