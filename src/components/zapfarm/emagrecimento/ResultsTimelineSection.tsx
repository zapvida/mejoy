'use client';

import { useState } from 'react';

export function ResultsTimelineSection() {
  const [activeStep, setActiveStep] = useState(0);

  const timelineSteps = [
    {
      period: 'Dia 1',
      title: 'Início do tratamento',
      description: 'Primeira consulta com o médico, início do tratamento quando indicado, e estabelecimento de metas realistas.',
      highlights: [
        'Avaliação médica completa',
        'Definição de plano personalizado',
        'Início de mudanças de hábitos',
      ],
    },
    {
      period: 'Mês 1',
      title: 'Primeiros sinais',
      description: 'Começam a aparecer os primeiros resultados: redução da fome, primeiros quilos perdidos, e melhora no bem-estar geral.',
      highlights: [
        'Redução gradual da fome',
        'Primeiros quilos perdidos',
        'Aumento de energia',
      ],
    },
    {
      period: 'Mês 3',
      title: 'Progresso consistente',
      description: 'Perda de peso mais consistente, melhora em exames de saúde, e consolidação de novos hábitos alimentares.',
      highlights: [
        'Perda de peso mais visível',
        'Melhora em exames (glicemia, pressão)',
        'Hábitos mais estabelecidos',
      ],
    },
    {
      period: 'Mês 6+',
      title: 'Manutenção e sustentabilidade',
      description: 'Fase de manutenção do peso perdido, prevenção de reganho, e continuidade do acompanhamento médico.',
      highlights: [
        'Manutenção do peso perdido',
        'Acompanhamento contínuo',
        'Prevenção de reganho',
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Timeline de progresso
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            O que você pode esperar em cada etapa do tratamento
          </p>
        </div>

        {/* Mobile: Stepper vertical */}
        <div className="lg:hidden space-y-6">
          {timelineSteps.map((step, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-md transition-all ${
                activeStep === index ? 'ring-2 ring-emerald-500' : ''
              }`}
              onClick={() => setActiveStep(index)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-emerald-600 to-orange-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">{step.period}</p>
                  <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                </div>
              </div>
              {activeStep === index && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">{step.description}</p>
                  <ul className="space-y-2">
                    {step.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden lg:block">
          <div className="flex items-start gap-4 mb-8">
            {timelineSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`flex-1 text-center transition-all ${
                  activeStep === index ? 'scale-105' : ''
                }`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full font-bold mb-3 ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-emerald-600 to-orange-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <p className="text-sm font-semibold text-gray-500 mb-1">{step.period}</p>
                <p className="text-base font-bold text-gray-900">{step.title}</p>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {timelineSteps[activeStep].title}
            </h3>
            <p className="text-base text-gray-700 mb-6 leading-relaxed">
              {timelineSteps[activeStep].description}
            </p>
            <ul className="space-y-3">
              {timelineSteps[activeStep].highlights.map((highlight, highlightIndex) => (
                <li key={highlightIndex} className="flex items-start gap-3 text-base text-gray-700">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-gray-600 text-center italic">
            <strong>Importante:</strong> Esta timeline é uma referência geral. Cada pessoa responde de forma diferente ao tratamento, e os resultados podem variar.
          </p>
        </div>
      </div>
    </section>
  );
}

