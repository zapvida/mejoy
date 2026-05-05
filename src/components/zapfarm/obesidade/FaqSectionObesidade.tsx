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
        'Você começa pela triagem online. Suas respostas ajudam a identificar perfil, histórico, objetivos e pontos de atenção. Quando indicado, o médico avalia se o programa faz sentido para o seu caso.',
    },
    {
      question: 'O que acontece depois que eu inicio a triagem?',
      answer:
        'Você recebe uma leitura inicial com próximos passos. Se houver indicação, segue para avaliação médica. Depois da conduta definida, o acompanhamento continua pelo app e WhatsApp oficial.',
    },
    {
      question: 'Meus dados estão seguros?',
      answer:
        'Sim. Dados de saúde são tratados com sigilo, boas práticas de segurança e base na LGPD. As políticas do site explicam como os dados são usados, armazenados e protegidos.',
    },
    {
      question: 'Preciso de receita? Como funciona a medicação?',
      answer:
        'Sim, medicamentos sujeitos a prescrição exigem receita. Quando houver indicação médica, o profissional responsável prescreve e orienta o uso. Não existe liberação automática.',
    },
    {
      question: 'O programa inclui medicamentos GLP-1 (ou similares)?',
      answer:
        'Pode incluir, mas somente quando fizer sentido para o seu perfil. Em alguns casos o médico pode considerar tirzepatida, semaglutida ou alternativa oral; em outros, o melhor caminho pode ser rotina, exames ou outra estratégia.',
    },
    {
      question: 'Quanto custa e posso cancelar?',
      answer:
        'Os valores dependem do plano e da conduta indicada. Você vê as etapas e custos antes de avançar. Cancelamento e reembolso seguem os termos vigentes e a legislação aplicável.',
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
              Antes de começar, tire as dúvidas certas
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Respostas objetivas sobre elegibilidade, medicação, receita, privacidade, preço e próximos passos.
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
              className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 px-8 text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 hover:shadow-2xl active:scale-100 sm:h-16 sm:px-10 sm:text-lg"
            >
              Fazer minha triagem
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
