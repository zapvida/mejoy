'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { mainBenefits, programDescription } from '@/config/zapfarm/benefits';

export function BenefitsSectionObesidade() {
  const page = useLandingPageKey();

  const handleCtaClick = () => {
    track('cta_click', {
      page,
      position: 'benefits',
      section: 'benefits_section',
    });
  };
  
  const benefits = mainBenefits;
  const benefitImages = [
    '/images/emagrecimento/medvi/treatment-escolha.avif',
    '/images/emagrecimento/medvi/metabolism-habits.avif',
    '/images/emagrecimento/medvi/support-whatsapp.avif',
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {programDescription.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700">
              {programDescription.subtitle}
            </p>
            <p className="mt-4 text-sm sm:text-base text-gray-600">
              Sem atalhos milagrosos: decisões clínicas responsáveis, metas realistas e suporte de verdade.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white rounded-2xl p-6 sm:p-8 shadow-lg",
                  "border-2 border-emerald-100",
                  "hover:shadow-xl hover:border-emerald-300",
                  "transition-all duration-300",
                  "text-center"
                )}
              >
                <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50">
                  <Image
                    src={benefitImages[index] || benefitImages[0]}
                    alt={benefit.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="text-5xl sm:text-6xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="/triagem/emagrecimento"
              onClick={handleCtaClick}
              className={cn(
                "inline-flex items-center justify-center",
                "h-14 sm:h-16 px-8 sm:px-10 md:px-12",
                "text-base sm:text-lg md:text-xl font-bold text-white",
                "rounded-full shadow-xl transition-all duration-200",
                "bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800",
                "hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900",
                "hover:shadow-2xl hover:scale-105 active:scale-100"
              )}
            >
              Ver minha elegibilidade
            </a>
          </div>

          {/* Notice */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Tratamento e prescrição sempre dependem de avaliação médica individual.
          </p>
        </div>
      </div>
    </section>
  );
}
