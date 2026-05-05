'use client';

import Image from 'next/image';
import { ClipboardDocumentListIcon, ChatBubbleLeftRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { cn } from '@/lib/utils';
import { EMAGRECIMENTO_LP } from '@/lib/emagrecimento-lp-assets';

const steps = [
  {
    icon: ClipboardDocumentListIcon,
    title: 'Triagem inteligente',
    text: 'Você informa histórico, rotina, apetite, tentativas anteriores e objetivo. A plataforma organiza o que importa.',
    image: EMAGRECIMENTO_LP.howTriagem,
    imageAlt: 'Pessoa preenchendo triagem de elegibilidade',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Avaliação e conduta',
    text: 'Quando indicado, médico com CRM analisa seu caso, define a conduta e explica limites, riscos e próximos passos.',
    image: EMAGRECIMENTO_LP.howConsulta,
    imageAlt: 'Consulta médica online para avaliação de emagrecimento',
  },
  {
    icon: UserGroupIcon,
    title: 'Acompanhamento contínuo',
    text: 'Você segue com app e WhatsApp oficial para check-ins, dúvidas e ajustes de rotina com mais consistência.',
    image: EMAGRECIMENTO_LP.howAcompanhamento,
    imageAlt: 'Acompanhamento contínuo de rotina e resultados',
  },
] as const;

export function HowItWorksSectionObesidade() {
  const page = useLandingPageKey();

  const handleCta = () => {
    track('cta_click', {
      page,
      position: 'how_it_works',
      section: 'how_it_works_section',
    });
  };

  return (
    <section
      id="como-funciona"
      className="py-12 sm:py-16 md:py-20 bg-white scroll-mt-24"
      aria-labelledby="how-it-works-heading"
      data-home-section="how-it-works"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2
              id="how-it-works-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Como sua jornada sai do improviso
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Primeiro entendemos seu contexto. Depois, você decide com orientação, critério e próximos passos claros.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <li key={step.title}>
                <div
                  className={cn(
                    'h-full rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-6 sm:p-8 shadow-sm',
                    'hover:border-emerald-200 hover:shadow-md transition-shadow'
                  )}
                >
                  <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex items-start gap-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
                        <step.icon className="h-6 w-6" aria-hidden />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-base text-gray-700 leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <a
              href="/triagem/emagrecimento"
              onClick={handleCta}
              className={cn(
                'inline-flex items-center justify-center',
                'h-14 sm:h-16 px-8 sm:px-10 md:px-12',
                'text-base sm:text-lg md:text-xl font-bold text-white',
                'rounded-full shadow-xl transition-all duration-200',
                'bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800',
                'hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900',
                'hover:shadow-2xl hover:scale-[1.02] active:scale-100'
              )}
            >
              Ver minha elegibilidade
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
