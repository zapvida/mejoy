'use client';

import Image from 'next/image';

import { HOME_HUB_HOW_STEPS } from '@/lib/home-hub-assets';

export function HomeHowItWorks() {
  return (
    <section
      id="como-funciona"
      className="bg-[#f7faf7] py-12 sm:py-14 md:py-16"
      data-home-section="how_it_works"
      aria-labelledby="home-how-it-works-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
              Como funciona
            </p>
            <h2
              id="home-how-it-works-heading"
              className="mt-2 text-[1.5rem] font-bold tracking-[-0.04em] text-slate-950 sm:text-3xl md:text-4xl"
            >
              Três passos para sair do improviso
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
            {HOME_HUB_HOW_STEPS.map(({ step, title, description, image }) => (
              <div
                key={step}
                className="flex h-full flex-col overflow-hidden rounded-[24px] border border-emerald-100 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-700">{step}</span>
                  <h3 className="mt-2 text-lg font-bold text-slate-950 sm:text-xl">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
