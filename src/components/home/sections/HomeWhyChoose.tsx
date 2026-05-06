'use client';

import Image from 'next/image';

import { HOME_HUB_WHY_TILES } from '@/lib/home-hub-assets';

export function HomeWhyChoose() {
  return (
    <section
      className="bg-white py-12 sm:py-14 md:py-16"
      data-home-section="why_choose"
      aria-labelledby="home-why-choose-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
              Por que MeJoy
            </p>
            <h2
              id="home-why-choose-heading"
              className="mt-2 text-[1.5rem] font-bold tracking-[-0.04em] text-slate-950 sm:text-3xl md:text-4xl"
            >
              Clareza antes de tudo
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-4 lg:gap-4">
            {HOME_HUB_WHY_TILES.map(({ title, description, image }) => (
              <div
                key={title}
                className="flex h-full flex-col overflow-hidden rounded-[22px] border border-emerald-100 bg-[#fcfffd] shadow-[0_14px_36px_rgba(15,23,42,0.05)]"
              >
                <div className="relative aspect-[5/4] w-full shrink-0">
                  <Image src={image} alt="" fill className="object-cover" sizes="(max-width:1024px) 50vw, 25vw" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-base font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-snug text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
