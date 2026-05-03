import { Manrope, Sora } from 'next/font/google';
import Seo from '@/components/Seo';
import { EmagrecimentoMedviLanding } from '@/components/zapfarm/obesidade/EmagrecimentoMedviLanding';
import { ObesidadeImageGlobalStyles } from '@/components/zapfarm/obesidade/ObesidadeImageGlobalStyles';
import type { LandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { SITE } from '@/lib/seo';

const DESCRIPTION =
  'Emagrecimento com triagem online, avaliacao medica quando indicada e acompanhamento continuo para seguir com mais clareza, seguranca e constancia.';

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-emagrecimento-display',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-emagrecimento-body',
});

export function HomeMedviJourney({
  page = 'emagrecimento',
  canonicalPath = '/',
}: {
  page?: LandingPageKey;
  canonicalPath?: string;
}) {
  const ogImage = `${SITE.baseUrl}/images/emagrecimento/medvi/hero-main.webp`;

  return (
    <>
      <Seo
        title="Emagrecimento com avaliacao medica e acompanhamento continuo"
        description={DESCRIPTION}
        path={canonicalPath}
        ogImage={ogImage}
        keywords={[
          'emagrecimento com avaliacao medica',
          'triagem online',
          'telemedicina para emagrecimento',
          'acompanhamento continuo',
          'me joy',
        ]}
      />

      <div className={`${sora.variable} ${manrope.variable} emagrecimento-lp`}>
        <ObesidadeImageGlobalStyles />
        <EmagrecimentoMedviLanding page={page} />
      </div>
    </>
  );
}
