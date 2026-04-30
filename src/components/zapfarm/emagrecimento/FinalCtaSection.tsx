import Link from 'next/link';
import { RefinedButton } from '@/components/ui/RefinedButton';
import { trackFunnelEvent } from '@/lib/funnel/events-client';

interface FinalCtaSectionProps {
  ctaText?: string;
  analyticsEvent?: string;
}

export function FinalCtaSection({ ctaText, analyticsEvent = 'triagem_emagrecimento_cta_final' }: FinalCtaSectionProps = {}) {
  const handleClick = () => {
    trackFunnelEvent('cta_start_triage', { source: analyticsEvent });
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white">
          Você não precisa enfrentar isso sozinho(a).
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Como médico, vejo que o primeiro passo é sempre o mais difícil. Dê esse passo com uma triagem online clara, sem promessa exagerada.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <RefinedButton
            variant="secondary"
            size="lg"
            onClick={handleClick}
            asChild
            className="bg-white text-brand-700 hover:bg-zinc-50 shadow-xl"
          >
            <a href="/triagem/emagrecimento">
              {ctaText || 'Fazer triagem digital'}
            </a>
          </RefinedButton>
          <Link
            href="/produtos"
            className="inline-flex items-center justify-center rounded-full px-8 py-4 font-bold text-white/90 border-2 border-white/50 hover:bg-white/10 transition-all"
          >
            Ver produtos →
          </Link>
        </div>
        <p className="mt-6 text-sm sm:text-base text-white/80">
          Relatório inicial com plano de próximos passos
        </p>
      </div>
    </section>
  );
}
