import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { FooterZapfarm } from '@/components/zapfarm/emagrecimento/FooterZapfarm';
import { LandingPageViewTracker } from '@/components/zapfarm/obesidade/LandingPageViewTracker';
import { EmagrecimentoStickyCta } from '@/components/zapfarm/obesidade/EmagrecimentoStickyCta';
import { HeroSectionObesidade } from '@/components/zapfarm/obesidade/HeroSectionObesidade';
import { ZeroCostSectionObesidade } from '@/components/zapfarm/obesidade/ZeroCostSectionObesidade';
import { BenefitsSectionObesidade } from '@/components/zapfarm/obesidade/BenefitsSectionObesidade';
import { TailoredSectionObesidade } from '@/components/zapfarm/obesidade/TailoredSectionObesidade';
import { TestimonialsSectionObesidade } from '@/components/zapfarm/obesidade/TestimonialsSectionObesidade';
import { AppFeaturesSectionObesidade } from '@/components/zapfarm/obesidade/AppFeaturesSectionObesidade';
import { PlansSectionObesidade } from '@/components/zapfarm/obesidade/PlansSectionObesidade';
import { FaqSectionObesidade } from '@/components/zapfarm/obesidade/FaqSectionObesidade';
import { LandingAnalyticsProvider } from '@/contexts/LandingAnalyticsContext';

/** Rota `/obesidade` — ordem clássica da landing (sem trilha MEDVi extra). */
export function ObesidadeClassicLanding() {
  return (
    <LandingAnalyticsProvider page="obesidade">
      <LandingPageViewTracker />
      <div className="min-h-screen bg-white">
        <HeaderZapfarm />
        <EmagrecimentoStickyCta />
        <div className="pb-20 md:pb-0">
          <HeroSectionObesidade variant="default" />
        </div>
        <ZeroCostSectionObesidade />
        <BenefitsSectionObesidade />
        <TailoredSectionObesidade />
        <TestimonialsSectionObesidade />
        <AppFeaturesSectionObesidade />
        <PlansSectionObesidade />
        <FaqSectionObesidade />
        <FooterZapfarm />
      </div>
    </LandingAnalyticsProvider>
  );
}
