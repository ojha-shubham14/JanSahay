import { useEffect, useState } from 'react';
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
import type { Language, Purpose, ApplicantProfile, SchemeMatch, RankedPartner } from '@/lib/types';
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
  const [inputMode, setInputMode] = useState<'guided' | 'conversation'>('guided');
  const [profile, setProfile] = useState<ApplicantProfile>(createEmptyProfile());
  const [match, setMatch] = useState<SchemeMatch | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<RankedPartner | null>(null);
  const navigate = (nextScreen: Screen) => {
  window.history.pushState({ screen: nextScreen }, '', window.location.href);
  setScreen(nextScreen);
};
useEffect(() => {
  window.history.replaceState({ screen: 'home' }, '', window.location.href);

  const handlePopState = (event: PopStateEvent) => {
    const previousScreen = event.state?.screen as Screen | undefined;
    setScreen(previousScreen ?? 'home');
  };

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, []);

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    setProfile((prev) => ({ ...prev, language: newLang }));
  };

  const handleStart = (mode: 'guided' | 'conversation', purpose?: Purpose) => {
    setInputMode(mode);
    const fresh = createEmptyProfile();
    fresh.language = lang;
    if (purpose) fresh.purpose = purpose;
    setProfile(fresh);
    navigate('input');
  };

  const handleProfileComplete = (completedProfile: ApplicantProfile) => {
    setProfile(completedProfile);
    const result = recommendScheme(
      completedProfile.annual_family_income!,
      completedProfile.purpose!,
      completedProfile.estimated_cost!,
      completedProfile.education_status ?? undefined,
    );
    setMatch(result);
    navigate('scheme');
  };

  const handleReset = () => {
    setProfile(createEmptyProfile());
    setMatch(null);
    setSelectedPartner(null);
    navigate('home');
  };

  const stepperStep = screen === 'scheme' ? 1 : screen === 'emi' ? 2 : screen === 'partner' || screen === 'readiness' ? 3 : 1;

  return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-primary-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Header
        lang={lang}
        onLangChange={handleLangChange}
        onDashboardClick={() => navigate('dashboard')}
        onFAQClick={() => navigate('faq')}
        onContactClick={() => navigate('contact')}
        showDashboard={screen === 'dashboard'}
        themeMode={themeMode}
        onThemeChange={setThemeMode}
      />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 pt-6">
        {screen === 'dashboard' && <Dashboard lang={lang} onBack={() => navigate('home')} />}

        {screen === 'home' && <HomeScreen lang={lang} onStart={handleStart} />}

        {screen === 'input' && inputMode === 'guided' && (
          <GuidedWizard
            lang={lang}
            initialProfile={profile}
            onComplete={handleProfileComplete}
            onBack={() => navigate('home')}
          />
        )}

        {screen === 'input' && inputMode === 'conversation' && (
          <ConversationMode
            lang={lang}
            initialProfile={profile}
            onComplete={handleProfileComplete}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'faq' && (
          <FAQ
           lang={lang}
           onBack={() => navigate('home')}
          />
        )}

        {screen === 'contact' && (
          <ContactUs
            lang={lang}
            onBack={() => navigate('home')}
          />
        )}

        {(screen === 'scheme' || screen === 'emi' || screen === 'partner' || screen === 'readiness') && (
          <Stepper currentStep={stepperStep} lang={lang} />
        )}

        {screen === 'scheme' && match && (
          <SchemeResult
            lang={lang}
            match={match}
            onProceed={() => match.eligible && navigate('emi')}
            onReset={handleReset}
          />
        )}

        {screen === 'emi' && match?.eligible && (
          <EMICalculator
            lang={lang}
            match={match}
            onProceed={() => navigate('partner')}
            onReset={handleReset}
          />
        )}

        {screen === 'partner' && match?.eligible && (
          <PartnerLocator
            lang={lang}
            match={match}
            userCity={profile.location.display_name}
            onProceed={() => navigate('readiness')}
            onReset={handleReset}
          />
        )}

        {screen === 'readiness' && match?.eligible && (
          <ReadinessChecklist
            lang={lang}
            match={match}
            profile={profile}
            selectedPartner={selectedPartner}
            onReset={handleReset}
          />
        )}
      </main>

        <footer className="border-t border-slate-200/60 bg-white/50 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center">
            <p className="text-xs text-slate-400">
            Interest rate bands and partner NPA data are illustrative for the demo. In production, these would integrate with NSFDC/SCA live data feeds.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
