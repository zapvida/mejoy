import { Red_Hat_Text } from 'next/font/google';

import Seo from '@/components/Seo';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { FooterZapfarm } from '@/components/zapfarm/emagrecimento/FooterZapfarm';
import { LandingAnalyticsProvider } from '@/contexts/LandingAnalyticsContext';
import { ObesidadeImageGlobalStyles } from '@/components/zapfarm/obesidade/ObesidadeImageGlobalStyles';
import { LandingPageViewTracker } from '@/components/zapfarm/obesidade/LandingPageViewTracker';
import { SITE } from '@/lib/seo';

import { HomeEditorialTriptych } from './sections/HomeEditorialTriptych';
import { HomeHero } from './sections/HomeHero';
import { HomeTreatmentGrid } from './sections/HomeTreatmentGrid';
import { HomeHowItWorks } from './sections/HomeHowItWorks';
import { HomeWhyChoose } from './sections/HomeWhyChoose';
import { HomeTestimonials } from './sections/HomeTestimonials';
import { HomeCtaBanner } from './sections/HomeCtaBanner';
import { HomeFAQ } from './sections/HomeFAQ';
import { HomeWeightLossFeature } from './sections/HomeWeightLossFeature';

const DESCRIPTION =
  'Comece seu cuidado em saúde com triagem online, próximos passos claros, avaliação médica quando indicada e suporte oficial pelo WhatsApp da Me Joy.';

const redHat = Red_Hat_Text({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-medvi',
});

/**
 * Home institucional Me Joy — hub multi-tratamento.
 *
 * Renderiza a página inicial em mejoy.com.br como hub de tratamentos, separada
 * da LPAC `/emagrecimento`. Mantém header e footer compartilhados com o resto do site.
 */
export function MedviHomeHub({ canonicalPath = '/' }: { canonicalPath?: string } = {}) {
  const ogImage = `${SITE.baseUrl}/imagensmedvimejoyhome/me31.jpg`;

  return (
    <>
      <Seo
          title="Triagem online e cuidado em saúde com clareza | Me Joy"
        description={DESCRIPTION}
        path={canonicalPath}
        ogImage={ogImage}
        keywords={[
          'telemedicina',
          'avaliação médica online',
          'cuidado em saúde',
          'triagem online',
          'me joy',
        ]}
      />

      <div className={`${redHat.variable} emagrecimento-lp`}>
        <ObesidadeImageGlobalStyles />
        <LandingAnalyticsProvider page="home">
          <LandingPageViewTracker />
          <div className="min-h-screen bg-white" data-testid="home-medvi-journey">
            <HeaderZapfarm />
            <div className="home-hub-body">
              <HomeHero />
              <HomeWeightLossFeature />
              <HomeEditorialTriptych />
              <HomeTreatmentGrid />
              <HomeHowItWorks />
              <HomeWhyChoose />
              <HomeTestimonials />
              <HomeCtaBanner />
              <HomeFAQ />
            </div>
            <FooterZapfarm />
          </div>
        </LandingAnalyticsProvider>
      </div>
    </>
  );
}

export default MedviHomeHub;
