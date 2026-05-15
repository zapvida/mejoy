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
import { TestimonialsSectionObesidade } from '@/components/zapfarm/obesidade/TestimonialsSectionObesidade';
import { PlansSectionObesidade } from '@/components/zapfarm/obesidade/PlansSectionObesidade';
import { DecisionSectionObesidade } from '@/components/zapfarm/obesidade/DecisionSectionObesidade';
import { FaqSectionObesidade } from '@/components/zapfarm/obesidade/FaqSectionObesidade';
import { EmagrecimentoLegalDisclaimerSection } from '@/components/zapfarm/obesidade/EmagrecimentoLegalDisclaimerSection';
import { LandingAnalyticsProvider } from '@/contexts/LandingAnalyticsContext';
import type { LandingPageKey } from '@/contexts/LandingAnalyticsContext';

/**
 * LPAC GLP-1 / Emagrecimento — conjunto completo de seções (paridade com glp1.medvi.org).
 */
export function EmagrecimentoMedviLanding({ page = 'emagrecimento' }: { page?: LandingPageKey }) {
  return (
    <LandingAnalyticsProvider page={page}>
      <LandingPageViewTracker />
      <div className="min-h-screen overflow-x-hidden bg-white" data-testid="home-medvi-journey">
        <HeaderZapfarm />
        <EmagrecimentoStickyCta />
        {/* AppLayout já envolve a página em <main>; evitar <main> aninhado (HTML inválido / glitches de scroll). */}
        <div className="lpac-landing-body overflow-x-hidden pb-24 md:pb-0">
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
        </div>
        <FooterZapfarm />
      </div>
    </LandingAnalyticsProvider>
  );
}
