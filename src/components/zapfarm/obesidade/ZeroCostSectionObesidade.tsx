'use client';

import {
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';

const inclusions = [
  {
    icon: UserCircleIcon,
    title: 'Avaliação médica',
    text: 'Consulta online com profissional habilitado para entender seu histórico, rotina e objetivos.',
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: 'Plano personalizado',
    text: 'Conduta alinhada ao seu perfil com foco em adesão, rotina e segurança clínica.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Canal de suporte',
    text: 'Orientação contínua para dúvidas de hábitos, rotina e próximos passos do programa.',
  },
  {
    icon: TruckIcon,
    title: 'Fluxo completo',
    text: 'Quando houver prescrição, orientamos o caminho operacional com parceiros regulares.',
  },
] as const;

export function ZeroCostSectionObesidade() {
  const page = useLandingPageKey();

  const handleCtaClick = () => {
    track('cta_click', {
      page,
      position: 'zero_cost',
      section: 'transparency',
    });
  };

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-green-100 via-emerald-100 to-green-50"
      aria-labelledby="inclusions-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div
            className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative"
            style={{
              border: '3px solid rgb(34, 197, 94)',
              boxShadow: `
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04),
                inset 0 2px 4px rgba(34, 197, 94, 0.1),
                0 0 0 1px rgba(34, 197, 94, 0.2)
              `,
            }}
          >
            <div className="flex items-center justify-center mb-6">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgb(187, 247, 208) 0%, rgb(134, 239, 172) 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(34, 197, 94, 0.2), 0 4px 8px rgba(34, 197, 94, 0.15)',
                }}
              >
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h2
              id="inclusions-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-3 sm:mb-4"
            >
              O que você recebe no programa, sem surpresa
            </h2>
            <p className="text-base sm:text-lg text-gray-700 text-center leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
              Você entende o que está incluso antes de decidir. Tudo o que depende de avaliação médica
              é tratado com transparência na consulta, inclusive eventual indicação de medicação.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10">
              {inclusions.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-xl border border-green-100 bg-green-50/50 p-4 sm:p-5"
                >
                  <div className="shrink-0 rounded-lg bg-white p-2 text-green-700 shadow-sm ring-1 ring-green-100">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="/triagem/emagrecimento"
                onClick={handleCtaClick}
                className={cn(
                  'inline-flex items-center justify-center',
                  'h-14 sm:h-16 px-8 sm:px-10 md:px-12',
                  'text-base sm:text-lg md:text-xl font-bold text-white',
                  'rounded-full shadow-xl transition-all duration-200',
                  'bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800',
                  'hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900',
                  'hover:shadow-2xl hover:scale-105 active:scale-100'
                )}
              >
                Iniciar minha triagem agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
