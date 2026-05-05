'use client';

import Image from 'next/image';

import { track } from '@/lib/analytics';
import { HOME_HUB_SECONDARY_TREATMENTS } from '@/lib/home-hub-assets';

export function HomeTreatmentGrid() {
  const handleClick = (slug: string) => {
    track('cta_click', {
      page: 'home',
      position: 'treatment_grid',
      section: 'home_treatments',
      treatment: slug,
    });
  };

  return (
    <section
      id="tratamentos"
      className="bg-white py-12 sm:py-14 md:py-[3.75rem]"
      data-home-section="treatments"
      aria-labelledby="home-treatments-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-emerald-800 sm:text-sm">
              Outras jornadas
            </p>
            <h2
              id="home-treatments-heading"
              className="mt-2 text-[1.5rem] font-bold leading-tight tracking-[-0.03em] text-slate-950 sm:text-3xl md:text-4xl"
            >
              Mais objetivos, mesmo cuidado
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5 md:mt-10">
            {HOME_HUB_SECONDARY_TREATMENTS.map(({ slug, title, href, image }) => (
              <a
                key={slug}
                href={href}
                onClick={() => handleClick(slug)}
                className="group overflow-hidden rounded-[22px] border border-emerald-100/80 bg-[#fafcfb] shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-emerald-200"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
                  <h3 className="text-base font-bold text-slate-950 sm:text-lg">{title}</h3>
                  <span className="text-sm font-bold text-emerald-700" aria-hidden>
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
