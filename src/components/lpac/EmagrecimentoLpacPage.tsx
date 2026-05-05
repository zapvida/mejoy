import { Red_Hat_Text } from 'next/font/google';

import Seo from '@/components/Seo';
import { EmagrecimentoMedviLanding } from '@/components/zapfarm/obesidade/EmagrecimentoMedviLanding';
import { ObesidadeImageGlobalStyles } from '@/components/zapfarm/obesidade/ObesidadeImageGlobalStyles';
import { SITE } from '@/lib/seo';

const DESCRIPTION =
  'Programa de emagrecimento com triagem online, avaliação médica e acompanhamento contínuo, com clareza, segurança e suporte oficial pela Me Joy.';

const redHat = Red_Hat_Text({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-medvi',
});

/**
 * LPAC dedicada `/emagrecimento` — set completo de seções (espelho de glp1.medvi.org).
 * Wrapper isolado da Home para permitir paridade visual independente.
 */
export function EmagrecimentoLpacPage({
  canonicalPath = '/emagrecimento',
}: {
  canonicalPath?: string;
}) {
  const ogImage = `${SITE.baseUrl}/images/emagrecimento/medvi/hero-main.webp`;

  return (
    <>
      <Seo
        title="Emagrecimento com avaliação médica e acompanhamento contínuo | Me Joy"
        description={DESCRIPTION}
        path={canonicalPath}
        ogImage={ogImage}
        keywords={[
          'emagrecimento com avaliação médica',
          'GLP-1 telemedicina',
          'triagem online emagrecimento',
          'acompanhamento contínuo',
          'me joy',
        ]}
      />

      <div className={`${redHat.variable} emagrecimento-lp`}>
        <ObesidadeImageGlobalStyles />
        <EmagrecimentoMedviLanding page="emagrecimento" />
      </div>
    </>
  );
}

export default EmagrecimentoLpacPage;
