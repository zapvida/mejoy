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
        'Quando houver indicacao medica, o profissional responsavel prescreve e orienta o uso. Nao existe liberacao automatica de medicamento, e a receita continua sendo obrigatoria.',
    },
    {
      question: 'O programa inclui medicamentos GLP-1 (ou similares)?',
      answer:
        'Pode incluir, sim, mas so quando fizer sentido para o seu perfil. Em alguns casos o medico pode considerar tirzepatida, semaglutida ou uma alternativa oral; em outros, o caminho mais seguro e comecar por ajustes de rotina, exames ou outra estrategia.',
    },
    {
      question: 'Quanto custa e posso cancelar?',
      answer:
        'Os valores dependem do plano e da conduta indicada na avaliação médica. Políticas de cancelamento e reembolso seguem os termos vigentes e a legislação aplicável.',
    },
  ];

  return (
    <section
      id="faq"
      data-home-section="faq"
      data-testid="emagrecimento-faq"
      data-sticky-cta-stop
      className="scroll-mt-24 bg-white py-14 sm:py-16 md:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Perguntas frequentes</p>
            <h2
              id="faq-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl"
            >
              Ainda tem dúvidas?
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Respostas diretas sobre elegibilidade, privacidade e como funciona o cuidado na Me Joy.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  'overflow-hidden rounded-[22px] border border-emerald-100',
                  'bg-[#fcfffd] shadow-sm transition-shadow hover:shadow-md'
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    const next = openIndex === index ? null : index;
                    handleToggle(index, next !== null);
                    setOpenIndex(next);
                  }}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-emerald-50 sm:px-6 sm:py-5"
                >
                  <span className="flex-1 text-base font-semibold leading-tight text-slate-950 sm:text-lg">
                    {faq.question}
                  </span>
                  <svg
                    className={cn(
                      'h-5 w-5 shrink-0 text-emerald-600 transition-transform sm:h-6 sm:w-6',
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
                  <div className="border-t border-emerald-100 bg-emerald-50 px-4 py-4 sm:px-6 sm:py-5">
                    <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center" data-sticky-cta-stop>
            <a
              href="/triagem/emagrecimento"
              onClick={handleCtaClick}
              className="inline-flex items-center justify-center h-14 sm:h-16 px-8 sm:px-10 md:px-12 text-base sm:text-lg md:text-xl font-bold text-white rounded-full shadow-xl transition-all duration-200 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 hover:shadow-2xl hover:scale-105 active:scale-100"
            >
              Iniciar minha triagem de elegibilidade
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
