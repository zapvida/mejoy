'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function TestimonialsSectionObesidade() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote:
        'Quando entrei, eu só tinha tentado dieta restritiva. Com acompanhamento e meta semanal simples, consegui manter rotina por meses.',
      author: 'Paciente A., 37 anos',
      image: '/images/emagrecimento/medvi/avatar-belinda.webp',
    },
    {
      quote:
        'A diferença foi ter clareza do próximo passo. Não fico mais perdida, e consigo ajustar alimentação e treino sem culpa.',
      author: 'Paciente B., 42 anos',
      image: '/images/emagrecimento/medvi/avatar-melissa.webp',
    },
    {
      quote:
        'O suporte frequente no WhatsApp ajudou a manter adesão. Hoje eu consigo enxergar progresso sem ansiedade de resultado imediato.',
      author: 'Paciente C., 33 anos',
      image: '/images/emagrecimento/medvi/avatar-sandra.webp',
    },
    {
      quote:
        'Eu precisava de um plano realista, não de promessa. Com avaliação médica e metas possíveis, parei de começar e abandonar.',
      author: 'Paciente D., 45 anos',
      image: '/images/emagrecimento/medvi/avatar-terri.webp',
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Histórias de evolução com acompanhamento
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Relatos de pacientes acompanhados no programa. Identidade preservada por privacidade.
            </p>
            <div className="mx-auto mt-4 w-fit rounded-full border border-amber-100 bg-amber-50 px-4 py-2">
              <Image
                src="/images/emagrecimento/medvi/social-proof-rating.webp"
                alt="Faixa de prova social com avaliações"
                width={150}
                height={14}
              />
            </div>
          </div>

          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg mb-8">
            <div className="text-center">
              <div className="relative mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full border-2 border-emerald-200 sm:h-24 sm:w-24">
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.author}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-800 mb-6 leading-relaxed italic">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>

              <p className="text-base sm:text-lg font-semibold text-gray-900">{currentTestimonial.author}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prevTestimonial}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors"
              aria-label="Depoimento anterior"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Selecionar depoimento">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all',
                    index === currentIndex
                      ? 'bg-emerald-600 w-8 sm:w-10'
                      : 'bg-emerald-200 hover:bg-emerald-300'
                  )}
                  aria-label={`Ir para depoimento ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextTestimonial}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors"
              aria-label="Próximo depoimento"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              '/images/emagrecimento/medvi/reviews-01.webp',
              '/images/emagrecimento/medvi/reviews-03.avif',
              '/images/emagrecimento/medvi/reviews-04.avif',
              '/images/emagrecimento/medvi/reviews-06.webp',
            ].map((src) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-emerald-100">
                <Image src={src} alt="Momento de acompanhamento no programa" fill className="object-cover" sizes="25vw" />
              </div>
            ))}
          </div>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-10 max-w-xl mx-auto">
            Resultados individuais variam. Cada caso é acompanhado por equipe médica; depoimentos não garantem o mesmo
            desempenho para todos.
          </p>
        </div>
      </div>
    </section>
  );
}
