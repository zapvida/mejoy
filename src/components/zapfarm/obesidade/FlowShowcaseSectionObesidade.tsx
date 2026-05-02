'use client';

import Image from 'next/image';

export function FlowShowcaseSectionObesidade() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8" id="como-funciona">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#204b3d]">Ver como funciona</p>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4.4rem)] font-semibold tracking-[-0.05em] text-slate-900">
            Triagem, consulta e suporte no mesmo raciocínio visual.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Programa com avaliação médica e acompanhamento contínuo. Consulte faixas após a triagem.
          </p>
        </div>

        <div className="mt-10 rounded-[2.4rem] border border-slate-200 bg-[#eff4f0] p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-white">
            <div className="relative aspect-[1.05/1] w-full sm:aspect-[16/10]">
              <Image
                src="/images/emagrecimento/medvi/hero-main.webp"
                alt="Paciente em programa de emagrecimento com acompanhamento profissional"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 960px"
                quality={90}
              />
            </div>

            <div className="absolute right-4 top-4 rounded-[1.6rem] border border-emerald-100 bg-white/96 px-5 py-3 shadow-xl backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f7e76]">Fluxo completo</p>
              <p className="whitespace-nowrap text-base font-semibold tracking-[-0.03em] text-slate-900">
                Triagem → Consulta → Suporte
              </p>
            </div>

            <div className="absolute bottom-4 left-4 overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-2xl">
              <div className="relative h-24 w-32 sm:h-28 sm:w-36">
                <Image
                  src="/images/emagrecimento/medvi/hero-secondary.webp"
                  alt="Acompanhamento contínuo para manutenção de resultados"
                  fill
                  className="object-cover"
                  sizes="144px"
                  quality={88}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Prescrição somente quando indicada em consulta médica. Dados tratados com boas práticas de privacidade.
        </p>
      </div>
    </section>
  );
}
