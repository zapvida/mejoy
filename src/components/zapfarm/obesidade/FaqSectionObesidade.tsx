'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';

export function FaqSectionObesidade() {
  const page = useLandingPageKey();

  const handleCtaClick = () => {
    track('cta_click', {
      page,
      position: 'faq',
      section: 'faq_section',
    });
  };

  const handleToggle = (index: number, willOpen: boolean) => {
    if (willOpen) {
      track('cta_click', {
        page,
        position: 'faq',
        section: 'faq_expand',
        faq_index: index,
      });
    }
  };

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Como sei se sou elegível ao programa?',
      answer:
        'Você começa pela triagem online. Com base nas respostas e nos critérios clínicos, o médico avalia se o programa faz sentido para o seu caso e quais estratégias podem ser consideradas.',
    },
    {
      question: 'O que acontece depois que eu inicio a triagem?',
      answer:
        'Sua triagem é organizada para consulta e definição de conduta. Depois, você recebe os próximos passos do plano e orientações de acompanhamento no app/WhatsApp.',
    },
    {
      question: 'Meus dados estão seguros?',
      answer:
        'Tratamos dados de saúde com base na LGPD e boas práticas de segurança. Você pode consultar nossos avisos de privacidade e políticas no site para detalhes sobre uso e armazenamento.',
    },
    {
      question: 'Preciso de receita? Como funciona a medicação?',
      answer:
        'Quando houver indicação médica, o profissional responsável realiza a prescrição e orienta o uso. Não há dispensação de medicamento sem receita.',
    },
    {
      question: 'O programa inclui medicamentos GLP-1 (ou similares)?',
      answer:
        'O médico pode avaliar elegibilidade para estratégias metabólicas, incluindo classes usadas em obesidade, quando apropriado para o seu perfil clínico. A decisão sempre é individualizada.',
    },
    {
      question: 'Preciso baixar o app?',
      answer:
        'O app é recomendado para acompanhar metas, evolução e orientações. Se você não conseguir usar, o suporte orienta alternativas de acompanhamento.',
    },
    {
      question: 'Quanto custa e posso cancelar?',
      answer:
        'Os valores dependem do plano e da conduta indicada na avaliação médica. Políticas de cancelamento e reembolso seguem os termos vigentes e a legislação aplicável.',
    },
    {
      question: 'Qual a diferença entre os planos Essencial, Metabólico e Total?',
      answer:
        'O Essencial cobre a base do acompanhamento. O Metabólico amplia o acompanhamento clínico. O Total adiciona suporte intensivo e mais frequência de acompanhamento.',
    },
  ];

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 bg-white scroll-mt-24" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 id="faq-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ainda tem dúvidas?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Respostas diretas sobre elegibilidade, privacidade e como funciona o cuidado na Me Joy.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  'border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden',
                  'bg-white shadow-sm hover:shadow-md transition-shadow'
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    const next = openIndex === index ? null : index;
                    handleToggle(index, next !== null);
                    setOpenIndex(next);
                  }}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-emerald-50 transition-colors gap-4"
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-900 leading-tight flex-1">
                    {faq.question}
                  </span>
                  <svg
                    className={cn(
                      'w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 transition-transform flex-shrink-0',
                      openIndex === index ? 'rotate-180' : ''
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-4 sm:px-6 py-4 sm:py-5 bg-emerald-50 border-t border-emerald-200">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
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
              Iniciar minha triagem de elegibilidade
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
