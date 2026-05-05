'use client';

import Image from 'next/image';

const TESTIMONIALS = [
  {
    name: 'Carolina M.',
    location: 'São Paulo, SP',
    avatar: '/images/emagrecimento/medvi/avatar-belinda.webp',
    quote:
      'Em poucos minutos eu entendi o que vinha depois. Foi direto, claro e sem promessa exagerada.',
  },
  {
    name: 'Rafaela T.',
    location: 'Belo Horizonte, MG',
    avatar: '/images/emagrecimento/medvi/avatar-melissa.webp',
    quote:
      'O relatório deixou tudo mais organizado. O suporte pelo WhatsApp me ajudou a seguir sem ficar perdida.',
  },
  {
    name: 'Patrícia S.',
    location: 'Curitiba, PR',
    avatar: '/images/emagrecimento/medvi/avatar-sandra.webp',
    quote:
      'Gostei da transparência. Meu caso foi avaliado com critério e eu sabia exatamente qual era o próximo passo.',
  },
] as const;

export function HomeTestimonials() {
  return (
    <section
      id="depoimentos"
      className="bg-white py-14 sm:py-16 md:py-20"
      data-home-section="testimonials"
      aria-labelledby="home-testimonials-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Depoimentos</p>
            <h2
              id="home-testimonials-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl"
            >
              Clareza muda a forma de começar
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 sm:text-xl">
              Relatos de pacientes que procuravam uma jornada mais simples, organizada e segura.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, location, avatar, quote }) => (
              <div
                key={name}
                className="flex h-full flex-col rounded-[28px] border border-emerald-100 bg-[#fcfffd] p-6 shadow-[0_20px_45px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-emerald-100">
                    <Image src={avatar} alt={`Foto de ${name}`} fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">{name}</p>
                    <p className="text-xs text-slate-500">{location}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-emerald-700" aria-label="Avaliação 5 de 5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} aria-hidden>★</span>
                  ))}
                </div>
                <p className="mt-3 flex-1 text-base leading-relaxed text-slate-700">
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
