'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { appFeatures } from '@/config/zapfarm/benefits';

export function AppFeaturesSectionObesidade() {
  const page = useLandingPageKey();

  const handleCtaClick = () => {
    track('cta_click', {
      page,
      position: 'app_features',
      section: 'app_features_section',
    });
  };
  
  const features = appFeatures;

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-amber-50"
      aria-labelledby="app-portal-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left - Text Content */}
            <div className="flex-1 space-y-6 sm:space-y-8">
              <h2
                id="app-portal-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Seu acompanhamento em tempo real, no app e no WhatsApp
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl">
                Você acompanha evolução, recebe orientação e mantém o plano ativo com menos fricção no dia a dia.
              </p>

              {/* Features List */}
              <ul className="space-y-4 sm:space-y-5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-800 flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                      {feature}
                    </span>
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
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Ver como funciona no app
                </a>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="flex-1 relative w-full max-w-lg mx-auto lg:mx-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-emerald-100 shadow-2xl">
                <Image
                  src="/images/emagrecimento/medvi/support-whatsapp.avif"
                  alt="Acompanhamento contínuo com suporte humano"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={86}
                />
              </div>
              <div className="absolute -bottom-6 -right-3 w-44 sm:w-56 rounded-2xl border border-white/80 bg-white p-2 shadow-xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <Image
                    src="/images/emagrecimento/medvi/metabolism-habits.avif"
                    alt="Monitoramento de hábitos e evolução"
                    fill
                    className="object-cover"
                    sizes="220px"
                    quality={84}
                  />
                </div>
                <p className="px-1 pt-2 text-xs font-semibold text-slate-700">Check-ins e evolução centralizados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
