import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { FooterZapfarm } from '@/components/zapfarm/emagrecimento/FooterZapfarm';
import { LandingPageViewTracker } from '@/components/zapfarm/obesidade/LandingPageViewTracker';
import { EmagrecimentoStickyCta } from '@/components/zapfarm/obesidade/EmagrecimentoStickyCta';
import { HeroSectionObesidade } from '@/components/zapfarm/obesidade/HeroSectionObesidade';
import { TrustBarSectionObesidade } from '@/components/zapfarm/obesidade/TrustBarSectionObesidade';
import { FlowShowcaseSectionObesidade } from '@/components/zapfarm/obesidade/FlowShowcaseSectionObesidade';
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

/**
 * LP principal /emagrecimento — ordem e blocos alinhados ao plano MEDVi + Me Joy.
 */
export function EmagrecimentoMedviLanding() {
  return (
    <LandingAnalyticsProvider page="emagrecimento">
      <LandingPageViewTracker />
      <div className="min-h-screen bg-white">
        <HeaderZapfarm
          mode="landing"
          primaryCtaLabel="Começar avaliação"
          primaryCtaMobileLabel="Começar"
          showMenuButton
          showDesktopLinks={false}
        />
        <EmagrecimentoStickyCta />
        <div className="pb-20 md:pb-0">
          <HeroSectionObesidade variant="emagrecimento" />
        </div>
        <TrustBarSectionObesidade />
        <FlowShowcaseSectionObesidade />
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
        <FooterZapfarm />
      </div>
    </LandingAnalyticsProvider>
  );
}
