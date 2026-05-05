'use client';

import Image from 'next/image';

import { HOME_HUB_TESTIMONIALS } from '@/lib/home-hub-assets';

export function HomeTestimonials() {
  return (
    <section
      id="depoimentos"
      className="bg-[#f7faf7] py-12 sm:py-14 md:py-16"
      data-home-section="testimonials"
      aria-labelledby="home-testimonials-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
              Depoimentos
            </p>
            <h2
              id="home-testimonials-heading"
              className="mt-2 text-[1.5rem] font-bold tracking-[-0.04em] text-slate-950 sm:text-3xl md:text-4xl"
            >
              Histórias reais
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
            {HOME_HUB_TESTIMONIALS.map(({ name, location, avatar, quote }) => (
              <div
                key={name}
                className="flex h-full flex-col rounded-[24px] border border-emerald-100 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-100">
                    <Image src={avatar} alt={`Foto de ${name}`} fill className="object-cover" sizes="56px" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">{name}</p>
                    <p className="text-xs text-slate-500">{location}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-emerald-700" aria-label="Avaliação 5 de 5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} aria-hidden>
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-700">&ldquo;{quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
