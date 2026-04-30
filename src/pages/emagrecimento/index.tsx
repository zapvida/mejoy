import Head from 'next/head';
import { Sora, Manrope } from 'next/font/google';
import { EmagrecimentoMedviLanding } from '@/components/zapfarm/obesidade/EmagrecimentoMedviLanding';
import { ObesidadeImageGlobalStyles } from '@/components/zapfarm/obesidade/ObesidadeImageGlobalStyles';
import { buildCanonical, buildTitle, SITE } from '@/lib/seo';

const DESCRIPTION =
  'Programa de emagrecimento online com avaliação médica, triagem inteligente e acompanhamento contínuo. Conduta individual, privacidade e foco em resultado sustentável.';

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

export default function EmagrecimentoPage() {
  const canonical = buildCanonical('/emagrecimento');
  const ogImage = `${SITE.baseUrl}/images/emagrecimento/medvi/hero-main.webp`;

  return (
    <>
      <Head>
        <title>{buildTitle('Emagrecimento com acompanhamento médico')}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
        <link rel="canonical" href={canonical} />

        <meta property="og:title" content={buildTitle('Emagrecimento com acompanhamento médico')} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={SITE.name} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={buildTitle('Emagrecimento com acompanhamento médico')} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <div className={`${sora.variable} ${manrope.variable} emagrecimento-lp`}>
        <ObesidadeImageGlobalStyles />
        <EmagrecimentoMedviLanding />
      </div>
    </>
  );
}
