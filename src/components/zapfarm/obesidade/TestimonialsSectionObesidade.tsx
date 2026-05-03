'use client';

import Image from 'next/image';

export function TestimonialsSectionObesidade() {
  const testimonials = [
    {
      quote:
        'Eu precisava de um plano realista, não de promessa. Quando entendi o próximo passo com clareza, ficou mais fácil manter consistência sem começar e abandonar.',
      author: 'Paciente A., 37 anos',
      role: 'Acompanhamento com metas claras',
    },
    {
      quote:
        'A diferença foi sair da tentativa aleatória e entrar em uma rotina acompanhada. O suporte ajudou a transformar direção em constância.',
      author: 'Paciente B., 42 anos',
      role: 'Suporte para aderência e próximos passos',
    },
  ];

  return (
    <section
      id="depoimentos"
      data-home-section="testimonials"
      data-testid="emagrecimento-results"
      data-sticky-cta-stop
      className="bg-white py-14 sm:py-16 md:py-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Resultados e depoimentos</p>
            <h2
              id="testimonials-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl"
            >
              Resultado sem contexto vira promessa vazia. Aqui, a história é outra.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Relatos de pacientes acompanhados no programa. Identidade preservada por privacidade.
            </p>
            <div className="mx-auto mt-5 w-fit rounded-full border border-amber-100 bg-amber-50 px-4 py-2 shadow-sm">
              <Image
                src="/images/emagrecimento/medvi/social-proof-rating.webp"
                alt="Faixa de prova social com avaliações"
                width={160}
                height={15}
              />
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="rounded-[32px] border border-emerald-100 bg-[#fcfffd] p-6 shadow-[0_24px_55px_rgba(15,23,42,0.05)] sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Depoimento em foco</p>
              <blockquote className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-3xl">
                &ldquo;{testimonials[0].quote}&rdquo;
              </blockquote>
              <p className="mt-6 text-base font-semibold text-slate-900">{testimonials[0].author}</p>
              <p className="mt-1 text-sm text-slate-500">{testimonials[0].role}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.author} className="rounded-2xl border border-emerald-100 bg-white p-4">
                    <p className="text-sm leading-relaxed text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
                    <p className="mt-4 text-sm font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-emerald-700">{testimonial.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { src: '/images/emagrecimento/medvi/reviews-01.webp', alt: 'Paciente em retrato editorial', className: 'aspect-[4/5]' },
                { src: '/images/emagrecimento/medvi/reviews-03.avif', alt: 'Paciente sorrindo em acompanhamento', className: 'aspect-[4/5]' },
                { src: '/images/emagrecimento/medvi/reviews-04.avif', alt: 'Paciente em etapa de acompanhamento', className: 'col-span-2 aspect-[16/10]' },
                { src: '/images/emagrecimento/medvi/support-whatsapp.avif', alt: 'Profissional do suporte do programa', className: 'col-span-2 aspect-[16/10]' },
              ].map((image) => (
                <div
                  key={image.src}
                  className={`relative overflow-hidden rounded-[28px] border border-emerald-100 shadow-[0_18px_40px_rgba(15,23,42,0.05)] ${image.className}`}
                >
                  <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 30vw" />
                </div>
              ))}
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-center text-xs text-slate-500 sm:text-sm">
            Resultados individuais variam. Cada caso é acompanhado por equipe médica; depoimentos não garantem o mesmo
            desempenho para todos.
          </p>
        </div>
      </div>
    </section>
  );
}
