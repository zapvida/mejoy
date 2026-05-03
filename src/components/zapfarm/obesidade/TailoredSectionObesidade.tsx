'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';

export function TailoredSectionObesidade() {
  const page = useLandingPageKey();

  const handleCtaClick = () => {
    track('cta_click', {
      page,
      position: 'tailored',
      section: 'tailored_section',
    });
  };
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white" data-home-section="tailored">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left - Image */}
            <div className="flex-1 w-full max-w-md mx-auto lg:mx-0">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/emagrecimento/medvi/metabolism-results.avif"
                  alt="Acompanhamento de hábitos e evolução metabólica"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={86}
                />
              </div>
            </div>

            {/* Right - Content */}
            <div className="flex-1 space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Um plano que respeita seu corpo, sua rotina e sua meta
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed">
                Aqui você não recebe uma receita genérica. Cada etapa é construída com base no seu contexto clínico
                para aumentar adesão e reduzir tentativas frustradas.
              </p>

              <ul className="space-y-3 text-base sm:text-lg text-slate-700">
                {[
                  'Estratégia alinhada ao seu histórico e ao seu momento de vida',
                  'Metas semanais claras para gerar progresso contínuo',
                  'Ajustes orientados por acompanhamento, não por achismo',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="/triagem/emagrecimento"
                  onClick={handleCtaClick}
                  className={cn(
                    "inline-flex items-center justify-center",
                    "h-14 sm:h-16 px-8 sm:px-10",
                    "text-base sm:text-lg font-bold text-white",
                    "rounded-full shadow-xl transition-all duration-200",
                    "bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800",
                    "hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900",
                    "hover:shadow-2xl hover:scale-105 active:scale-100"
                  )}
                >
                  Ver minha elegibilidade
                </a>
                <a
                  href="/triagem/emagrecimento"
                  onClick={handleCtaClick}
                  className={cn(
                    "inline-flex items-center justify-center gap-2",
                    "h-14 sm:h-16 px-8 sm:px-10",
                    "text-base sm:text-lg font-bold text-emerald-700",
                    "rounded-full border-2 border-emerald-600",
                    "bg-white hover:bg-emerald-50",
                    "transition-all duration-200"
                  )}
                >
                  Ver próximos passos do programa
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
