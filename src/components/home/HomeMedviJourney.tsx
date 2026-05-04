import type { CSSProperties } from 'react';

import Seo from '@/components/Seo';
import { EmagrecimentoMedviLanding } from '@/components/zapfarm/obesidade/EmagrecimentoMedviLanding';
import { ObesidadeImageGlobalStyles } from '@/components/zapfarm/obesidade/ObesidadeImageGlobalStyles';
import type { LandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { SITE } from '@/lib/seo';

const DESCRIPTION =
  'Emagrecimento com triagem online, avaliacao medica quando indicada e acompanhamento continuo para seguir com mais clareza, seguranca e constancia.';

export function HomeMedviJourney({
  page = 'home',
  canonicalPath = '/',
}: {
  page?: LandingPageKey;
  canonicalPath?: string;
}) {
  const ogImage = `${SITE.baseUrl}/images/emagrecimento/medvi/hero-main.webp`;

  return (
    <>
      <Seo
        title="Emagrecimento com avaliacao medica, plano claro e suporte continuo"
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

      <div
        className="emagrecimento-lp"
        style={
          {
            '--font-emagrecimento-display':
              '"Avenir Next", "Segoe UI", system-ui, sans-serif',
            '--font-emagrecimento-body':
              '"Avenir Next", "Helvetica Neue", system-ui, sans-serif',
          } as CSSProperties
        }
      >
        <ObesidadeImageGlobalStyles />
        <EmagrecimentoMedviLanding page={page} />
      </div>
    </>
  );
}
