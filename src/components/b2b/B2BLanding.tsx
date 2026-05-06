import Head from 'next/head';
import { BRAND_NAME } from '@/lib/flags';
import Navbar from '@/components/layout/Navbar';
import Hero from './Hero';
// import TrustBar from './TrustBar'; // ✅ Removido - duplicação de cards
import Benefits from './Benefits';
import Integrations from './Integrations';
import Steps from './Steps';
import Cases from './Cases';
import Resources from './Resources';
import Pricing from './Pricing';
import FAQ from './FAQ';
import Footer from './Footer';
import StickyBar from './StickyBar';

export default function B2BLanding() {
  // ✅ Vibrant ativo por padrão; desligar só com NEXT_PUBLIC_LPAC_VIBRANT="0"
  const isVibrant = process.env.NEXT_PUBLIC_LPAC_VIBRANT !== '0';

  return (
    <>
      <Head>
        <title>White-label de Triagens Médicas com IA | {BRAND_NAME}</title>
        <meta
          name="description"
          content="Triagens inteligentes com sua marca. White-label completo, CTAs, relatórios com IA, métricas e automações."
        />
        <meta
          property="og:title"
          content={`White-label de Triagens Médicas | ${BRAND_NAME}`}
        />
        <meta
          property="og:description"
          content="Sua clínica com IA em minutos: logo, domínio, CTAs, relatórios e notificações. MeJoy e ZapVida já utilizam."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zapfarm.com" />
      </Head>

      <main
        data-lpac={isVibrant ? 'vibrant' : undefined}
        className="relative min-h-screen bg-bg pb-safe"
      >
        <Navbar />

        {/* Seções na ordem otimizada */}
        <Hero />
        {/* ✅ TrustBar removido - cards já estão no Hero (duplicação removida) */}
        <Benefits />
        <Integrations />
        <Steps />
        <Cases />
        <Resources />
        <Pricing />
        <FAQ />
        <Footer />

        {/* Sticky CTA Mobile - apenas mobile */}
        <StickyBar />

        {/* Sales Assistant removido - apenas WhatsApp */}
      </main>
    </>
  );
}
