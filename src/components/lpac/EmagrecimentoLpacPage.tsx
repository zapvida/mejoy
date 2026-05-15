import type { CSSProperties } from 'react';

import Seo from '@/components/Seo';
import { EmagrecimentoMedviLanding } from '@/components/zapfarm/obesidade/EmagrecimentoMedviLanding';
import { ObesidadeImageGlobalStyles } from '@/components/zapfarm/obesidade/ObesidadeImageGlobalStyles';
import { SITE } from '@/lib/seo';

const DESCRIPTION =
  'Emagrecimento online com triagem inteligente, avaliação médica quando indicada, plano personalizado e suporte oficial para decidir com mais clareza.';

const medviFontStyle = {
  '--font-medvi': '"Red Hat Text", Inter, ui-sans-serif, system-ui, sans-serif',
} as CSSProperties;

/**
 * LPAC dedicada `/emagrecimento` — set completo de seções (espelho de glp1.medvi.org).
 * Wrapper isolado da Home para permitir paridade visual independente.
 */
export function EmagrecimentoLpacPage({
  canonicalPath = '/emagrecimento',
}: {
  canonicalPath?: string;
}) {
  const ogImage = `${SITE.baseUrl}/imagensmedvimejoyhome/me31.jpg`;

  return (
    <>
      <Seo
        title="Emagrecimento online com triagem inteligente e avaliação médica | MeJoy"
        description={DESCRIPTION}
        path={canonicalPath}
        ogImage={ogImage}
        keywords={[
          'emagrecimento com avaliação médica',
          'GLP-1 telemedicina',
          'triagem online emagrecimento',
          'acompanhamento contínuo',
          'mejoy',
        ]}
      />

      <div className="emagrecimento-lp" style={medviFontStyle}>
        <ObesidadeImageGlobalStyles />
        <EmagrecimentoMedviLanding page="emagrecimento" />
      </div>
    </>
  );
}

export default EmagrecimentoLpacPage;
