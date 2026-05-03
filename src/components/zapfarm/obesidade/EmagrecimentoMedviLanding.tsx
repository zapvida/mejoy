import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { FooterZapfarm } from '@/components/zapfarm/emagrecimento/FooterZapfarm';
import { LandingPageViewTracker } from '@/components/zapfarm/obesidade/LandingPageViewTracker';
import { EmagrecimentoStickyCta } from '@/components/zapfarm/obesidade/EmagrecimentoStickyCta';
import { HeroSectionObesidade } from '@/components/zapfarm/obesidade/HeroSectionObesidade';
import { TrustBarSectionObesidade } from '@/components/zapfarm/obesidade/TrustBarSectionObesidade';
import { ZeroCostSectionObesidade } from '@/components/zapfarm/obesidade/ZeroCostSectionObesidade';
import { HowItWorksSectionObesidade } from '@/components/zapfarm/obesidade/HowItWorksSectionObesidade';
import { BenefitsSectionObesidade } from '@/components/zapfarm/obesidade/BenefitsSectionObesidade';
import { TailoredSectionObesidade } from '@/components/zapfarm/obesidade/TailoredSectionObesidade';
import { AppFeaturesSectionObesidade } from '@/components/zapfarm/obesidade/AppFeaturesSectionObesidade';
import { PlansSectionObesidade } from '@/components/zapfarm/obesidade/PlansSectionObesidade';
import { TestimonialsSectionObesidade } from '@/components/zapfarm/obesidade/TestimonialsSectionObesidade';
import { DecisionSectionObesidade } from '@/components/zapfarm/obesidade/DecisionSectionObesidade';
import { FaqSectionObesidade } from '@/components/zapfarm/obesidade/FaqSectionObesidade';
import { EmagrecimentoLegalDisclaimerSection } from '@/components/zapfarm/obesidade/EmagrecimentoLegalDisclaimerSection';
import { LandingAnalyticsProvider } from '@/contexts/LandingAnalyticsContext';
import type { LandingPageKey } from '@/contexts/LandingAnalyticsContext';

/**
 * Jornada principal MEDVi-like — usada na home `/` e em `/emagrecimento` como alias.
 */
export function EmagrecimentoMedviLanding({ page = 'emagrecimento' }: { page?: LandingPageKey }) {
  const isEmagrecimentoLanding = page === 'emagrecimento';

  return (
    <LandingAnalyticsProvider page={page}>
      <LandingPageViewTracker />
      <div className="min-h-screen bg-white" data-testid="home-medvi-journey">
        <HeaderZapfarm />
        <EmagrecimentoStickyCta />
        <main className="pb-24 md:pb-0">
          {isEmagrecimentoLanding ? (
            <>
              <HeroSectionObesidade variant="emagrecimento" />
              <BenefitsSectionObesidade />
              <PlansSectionObesidade />
              <TestimonialsSectionObesidade />
              <DecisionSectionObesidade />
              <FaqSectionObesidade />
              <EmagrecimentoLegalDisclaimerSection />
            </>
          ) : (
            <>
              <HeroSectionObesidade variant="emagrecimento" />
              <TrustBarSectionObesidade />
              <ZeroCostSectionObesidade />
              <HowItWorksSectionObesidade />
              <BenefitsSectionObesidade />
              <TailoredSectionObesidade />
              <AppFeaturesSectionObesidade />
              <TestimonialsSectionObesidade />
              <PlansSectionObesidade />
              <DecisionSectionObesidade />
              <FaqSectionObesidade />
              <EmagrecimentoLegalDisclaimerSection />
            </>
          )}
        </main>
        <FooterZapfarm />
      </div>
    </LandingAnalyticsProvider>
  );
}
