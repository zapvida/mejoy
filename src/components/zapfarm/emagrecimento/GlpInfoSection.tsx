'use client';

import { useState } from 'react';

export function GlpInfoSection() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Como funcionam os tratamentos com GLP-1?',
      answer: 'Os tratamentos com GLP-1 (agonistas do receptor de GLP-1) são medicamentos que imitam a ação de um hormônio natural chamado GLP-1. Eles ajudam a reduzir o apetite, aumentar a sensação de saciedade e melhorar o controle glicêmico. A tirzepatida é um agonista duplo (GLP-1 + GIP) que oferece resultados ainda mais eficazes.',
    },
    {
      question: 'Para quem são indicados?',
      answer: 'Os tratamentos com GLP-1 são indicados para pessoas com obesidade (IMC ≥ 30) ou sobrepeso (IMC ≥ 27) com comorbidades como diabetes tipo 2, pré-diabetes, hipertensão ou apneia do sono. Sempre é necessária avaliação médica individual para determinar a indicação.',
    },
    {
      question: 'Quais são esses tratamentos?',
      answer: 'Os principais tratamentos incluem Tirzepatida (Mounjaro®), Semaglutida (Ozempic®, Wegovy®) e outros. A escolha do medicamento é feita pelo médico após avaliação completa do paciente, considerando perfil clínico, objetivos e possíveis contraindicações.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 leading-tight break-words">
              O que é tratamento GLP-1?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
              Entenda como funcionam os medicamentos mais modernos para emagrecimento
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-emerald-200 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-emerald-50 transition-colors gap-3"
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-900 flex-1 leading-tight">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-emerald-600 transition-transform flex-shrink-0 ${
                      openAccordion === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openAccordion === index && (
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-emerald-50 border-t border-emerald-200">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

