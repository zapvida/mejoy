import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { HeroSection } from '@/components/zapfarm/emagrecimento/HeroSection';
import { HowItWorksSection } from '@/components/zapfarm/emagrecimento/HowItWorksSection';
import { CalculatorSection } from '@/components/zapfarm/emagrecimento/CalculatorSection';
import { StatsSection } from '@/components/zapfarm/emagrecimento/StatsSection';
import { EducationSection } from '@/components/zapfarm/emagrecimento/EducationSection';
import { TreatmentsSection } from '@/components/zapfarm/emagrecimento/TreatmentsSection';
import { ComparisonSection } from '@/components/zapfarm/emagrecimento/ComparisonSection';
import { PlansPreviewSection } from '@/components/zapfarm/emagrecimento/PlansPreviewSection';
import { SpecialistsSection } from '@/components/zapfarm/emagrecimento/SpecialistsSection';
import { ReportPreviewSection } from '@/components/zapfarm/emagrecimento/ReportPreviewSection';
import { ResultsSection } from '@/components/zapfarm/emagrecimento/ResultsSection';
import { PharmaciesSection } from '@/components/zapfarm/emagrecimento/PharmaciesSection';
import { FaqSection } from '@/components/zapfarm/emagrecimento/FaqSection';
import { FinalCtaSection } from '@/components/zapfarm/emagrecimento/FinalCtaSection';
import { FooterZapfarm } from '@/components/zapfarm/emagrecimento/FooterZapfarm';
import { trackFunnelEvent } from '@/lib/funnel/events-client';

type LpVariant = 'A' | 'B' | 'C';

function getVariantFromQuery(query: { v?: string }): LpVariant | null {
  const v = query.v as string | undefined;
  if (v && ['A', 'B', 'C'].includes(v.toUpperCase())) {
    return v.toUpperCase() as LpVariant;
  }
  return null;
}

function getStoredVariant(): LpVariant | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('zapfarm_lp_variant');
    if (stored && ['A', 'B', 'C'].includes(stored)) {
      return stored as LpVariant;
    }
  } catch {
    // Ignore
  }
  return null;
}

function setStoredVariant(variant: LpVariant) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('zapfarm_lp_variant', variant);
  } catch {
    // Ignore
  }
}

function randomVariant(): LpVariant {
  const variants: LpVariant[] = ['A', 'B', 'C'];
  return variants[Math.floor(Math.random() * variants.length)];
}

export default function EmagrecimentoLpV1() {
  const router = useRouter();
  const [variant, setVariant] = useState<LpVariant>('A');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const finalVariant = useMemo(() => {
    if (!mounted) return 'A';

    // 1. Check query param first
    const queryVariant = getVariantFromQuery(router.query);
    if (queryVariant) {
      setStoredVariant(queryVariant);
      return queryVariant;
    }

    // 2. Check localStorage
    const storedVariant = getStoredVariant();
    if (storedVariant) {
      return storedVariant;
    }

    // 3. Randomize and store
    const newVariant = randomVariant();
    setStoredVariant(newVariant);
    return newVariant;
  }, [router.query, mounted]);

  useEffect(() => {
    setVariant(finalVariant);

    // Track view with variant
    if (mounted) {
      trackFunnelEvent('lp_view', {
        variant: finalVariant,
      });
    }
  }, [finalVariant, mounted]);

  return (
    <>
      <Head>
        <title>MeJoy - Emagrecimento com evidências científicas e tecnologia</title>
        <meta
          name="description"
          content="Programa de emagrecimento 100% online com médicos especialistas, estratégias modernas quando indicadas e suporte contínuo. Triagem inteligente e avaliação clínica."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Frame 1 - Header (sticky) */}
        <HeaderZapfarm />

        {/* Sticky CTA bar for mobile - com padding bottom para não sobrepor conteúdo */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-emerald-400 to-orange-400 p-3.5 sm:p-4 shadow-2xl md:hidden">
          <a
            href="/triagem/emagrecimento"
            onClick={() => trackFunnelEvent('cta_start_triage', { source: 'sticky_mobile' })}
            className="block w-full text-center rounded-full bg-white text-emerald-700 font-bold py-2.5 sm:py-3 px-4 sm:px-6 hover:bg-emerald-50 transition-colors text-sm sm:text-base"
          >
            Iniciar minha triagem →
          </a>
        </div>

        {/* Padding bottom para mobile sticky CTA */}
        <div className="pb-20 md:pb-0">
          {/* Frame 2 - Hero premium */}
          <HeroSection variant={variant} />
        </div>

        {/* Frame 3 - Como funciona (4 passos) */}
        <HowItWorksSection />

        {/* Frame 4 - Calculadora / IMC interativo */}
        <CalculatorSection />

        {/* Frame 5 - Estatísticas e evidências */}
        <StatsSection />

        {/* Frame 6 - Educação "por que isso é sério" */}
        <EducationSection />

        {/* Frame 7 - Tratamentos modernos e segurança */}
        <TreatmentsSection />

        {/* Frame 8 - Comparação "Com MeJoy vs Caminho Tradicional" */}
        <ComparisonSection />

        {/* Frame 9 - Preview dos planos */}
        <PlansPreviewSection />

        {/* Frame 10 - Time de especialistas */}
        <SpecialistsSection />

        {/* Frame 11 - Tecnologia + prévia do relatório clínico */}
        <ReportPreviewSection />

        {/* Frame 12 - Depoimentos/resultados */}
        <ResultsSection />

        {/* Frame 13 - Farmácias credenciadas e segurança */}
        <PharmaciesSection />

        {/* Frame 14 - FAQ expandido */}
        <FaqSection />

        {/* Frame 15 - CTA final forte */}
        <FinalCtaSection />

        {/* Frame 16 - Footer */}
        <FooterZapfarm />
      </div>
    </>
  );
}
