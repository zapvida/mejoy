'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { getLpPriceHook } from '@/lib/emagrecimento/launchPricing';
import {
  planEssentialFeatures,
  planMetabolicoFeatures,
  planTotalFeatures,
  planDescriptions,
} from '@/config/zapfarm/benefits';

export function PlansSectionObesidade() {
  const page = useLandingPageKey();

  const handleCtaClick = () => {
    track('cta_click', {
      page,
      position: 'plans',
      section: 'plans_section',
    });
  };

  const plans = [
    {
      name: 'Plano Essencial Me Joy',
      features: planEssentialFeatures.map(f => f.text),
      description: planDescriptions.essential,
      popular: false,
      image: '/images/emagrecimento/medvi/treatment-comprimidos.avif',
    },
    {
      name: 'Plano Metabólico Me Joy',
      features: planMetabolicoFeatures.map(f => f.text),
      description: planDescriptions.metabolico,
      popular: true,
      image: '/images/emagrecimento/medvi/treatment-escolha.avif',
    },
    {
      name: 'Plano Total Me Joy',
      features: planTotalFeatures.map(f => f.text),
      description: planDescriptions.total,
      popular: false,
      image: '/images/emagrecimento/medvi/treatment-injetavel.webp',
    },
  ];

  return (
    <section id="planos" className="py-12 sm:py-16 md:py-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Escolha o nível de acompanhamento ideal para você
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Você escolhe o formato de suporte. A conduta clínica continua sendo definida em consulta médica.
            </p>
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mt-3">
              {getLpPriceHook()}
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={cn(
                  "relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 transition-all duration-300",
                  plan.popular
                    ? "border-emerald-500 shadow-xl scale-105 md:scale-110"
                    : "border-emerald-100 hover:border-emerald-300 hover:shadow-xl"
                )}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                      Mais escolhido
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                  {plan.name}
                </h3>

                <div className="relative mx-auto mb-4 aspect-[4/3] w-28 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50">
                  <Image
                    src={plan.image}
                    alt={plan.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                    quality={85}
                  />
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">
                  {plan.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 sm:space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-800 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed flex-1">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="/triagem/emagrecimento"
                  onClick={handleCtaClick}
                  className={cn(
                    "inline-flex items-center justify-center w-full",
                    "h-12 sm:h-14 px-6 sm:px-8",
                    "text-sm sm:text-base font-bold text-white",
                    "rounded-full shadow-lg transition-all duration-200",
                    plan.popular
                      ? "bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800",
                    "hover:shadow-xl hover:scale-105 active:scale-100"
                  )}
                >
                  Iniciar triagem deste plano
                </a>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="text-center">
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              As decisões de tratamento são sempre tomadas pelo médico responsável. A tecnologia apenas ajuda a organizar informações e padronizar os protocolos, nunca substitui o julgamento clínico.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
