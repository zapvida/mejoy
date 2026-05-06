import Head from 'next/head';
import { ObesidadeClassicLanding } from '@/components/zapfarm/obesidade/ObesidadeClassicLanding';
import { ObesidadeImageGlobalStyles } from '@/components/zapfarm/obesidade/ObesidadeImageGlobalStyles';
import { buildCanonical, buildTitle, SITE } from '@/lib/seo';

const DESCRIPTION =
  'Programa de gestão de peso online com médicos, triagem, app MeJoy e acompanhamento. Verifique sua elegibilidade.';

export default function ObesidadePage() {
  const canonical = buildCanonical('/obesidade');
  const ogImage = `${SITE.baseUrl}/images/obesidade-hero-people.jpg`;

  return (
    <>
      <Head>
        <title>{buildTitle('Gestão de peso e bem-estar')}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
        <link rel="canonical" href={canonical} />

        <meta property="og:title" content={buildTitle('Gestão de peso e bem-estar')} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={SITE.name} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={buildTitle('Gestão de peso e bem-estar')} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <ObesidadeImageGlobalStyles />
      <ObesidadeClassicLanding />
    </>
  );
}
