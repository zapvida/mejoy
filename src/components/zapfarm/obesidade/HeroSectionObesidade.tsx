'use client';

import Image from 'next/image';
import {
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { getLpPriceHook } from '@/lib/emagrecimento/launchPricing';

const proofBullets = [
  'Triagem em poucos minutos para entender historico, rotina e objetivo.',
  'Avaliacao medica quando indicada, com conduta e proximo passo claros.',
  'Suporte oficial no app e no WhatsApp para manter constancia.',
] as const;

const quickProof = [
  { label: 'Triagem', value: '5 min' },
  { label: 'Canal oficial', value: 'WhatsApp' },
  { label: 'Prescricao', value: 'Quando indicada' },
] as const;

export function HeroSectionObesidade({ variant = 'emagrecimento' }: { variant?: string }) {
  const page = useLandingPageKey();

  const handlePrimaryCta = () => {
    track('cta_click', {
      page,
      position: 'hero_primary',
      section: 'hero_section',
      variant,
    });
  };

  return (
    <section
      id="programa"
      data-home-section="hero"
      data-testid="home-medvi-hero"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(209,250,229,0.7),_rgba(255,255,255,0.96)_44%,_#ffffff_76%)] pt-28 sm:pt-32 lg:pt-36"
    >
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[linear-gradient(180deg,rgba(4,120,87,0.05),rgba(255,255,255,0))]" />
      <div className="absolute left-[-8rem] top-24 h-52 w-52 rounded-full bg-emerald-100/70 blur-3xl sm:h-72 sm:w-72" />
      <div className="absolute right-[-7rem] top-16 h-56 w-56 rounded-full bg-lime-100/60 blur-3xl sm:h-72 sm:w-72" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8" data-testid="emagrecimento-hero">
        <div className="grid items-center gap-10 pb-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] lg:gap-12 lg:pb-16">
          <div className="relative z-10 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-800 shadow-sm">
                Programa 100% online com avaliacao medica
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                <span className="relative h-3 w-20 overflow-hidden">
                  <Image
                    src="/images/emagrecimento/medvi/social-proof-rating.webp"
                    alt="Avaliacoes positivas do programa"
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </span>
                Clareza, privacidade e suporte oficial.
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[0.96] tracking-[-0.06em] text-slate-950 sm:text-5xl lg:max-w-[12ch] lg:text-[4.2rem]">
              Emagrecimento com <span className="text-emerald-700">avaliacao medica</span>, plano claro e suporte
              continuo.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Voce preenche a triagem, entende o seu perfil e recebe o proximo passo com mais seguranca. Quando houver
              indicacao, a decisao clinica acontece no fluxo certo, sem catalogo confuso nem promessa vaga.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:items-start">
              <a
                href="/triagem/emagrecimento"
                onClick={handlePrimaryCta}
                data-testid="home-primary-cta"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 px-7 text-base font-bold text-white shadow-[0_22px_48px_rgba(5,150,105,0.26)] transition-all hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(5,150,105,0.3)] sm:h-16 sm:px-8 sm:text-lg"
              >
                Comecar minha triagem
              </a>
              <p className="max-w-xl rounded-2xl border border-emerald-100 bg-white/92 px-4 py-3 text-[11px] font-medium leading-relaxed text-emerald-950 shadow-sm sm:text-sm">
                {getLpPriceHook()}
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {quickProof.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-emerald-100 bg-white/88 px-4 py-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)] backdrop-blur"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 sm:text-[15px]">{item.value}</p>
                </div>
              ))}
            </div>

            <ul className="mt-6 space-y-3">
              {proofBullets.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-[22px] border border-emerald-100 bg-white/78 px-4 py-3.5 shadow-sm backdrop-blur"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-6 text-slate-700 sm:text-[15px]">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 max-w-xl text-xs leading-6 text-slate-500 sm:text-sm">
              Prescricao e escolha da trilha dependem de avaliacao medica individual, disponibilidade e criterio
              clinico.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[38rem] lg:max-w-none">
            <div className="absolute inset-x-8 top-12 h-64 rounded-full bg-emerald-200/45 blur-3xl" />

            <div className="relative grid gap-4 sm:grid-cols-[0.86fr_1fr]">
              <div className="order-2 space-y-4 sm:order-1 sm:pt-12">
                <div className="rounded-[30px] border border-emerald-100 bg-white/88 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-800">
                      <ClipboardDocumentCheckIcon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                        Fluxo organizado
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Triagem, avaliacao e proximo passo no mesmo caminho, sem te deixar perdido entre telas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_26px_65px_rgba(15,23,42,0.1)]">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/images/emagrecimento/medvi/hero-secondary.webp"
                      alt="Paciente acompanhada em programa de emagrecimento"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 22vw"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="order-1 space-y-4 sm:order-2">
                <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white shadow-[0_34px_80px_rgba(15,23,42,0.12)]">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/images/emagrecimento/medvi/hero-main.webp"
                      alt="Paciente em retrato principal da jornada Me Joy"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 58vw, 30vw"
                      priority
                    />
                  </div>

                  <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/90 bg-white/94 p-4 shadow-lg backdrop-blur">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">
                      O que voce recebe
                    </p>
                    <div className="mt-3 grid gap-2.5">
                      {[
                        'Leitura inicial do seu caso',
                        'Conduta definida quando indicada',
                        'Suporte oficial para seguir com clareza',
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                          <span className="text-sm font-medium text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[30px] border border-emerald-100 bg-[#113c31] p-5 text-white shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
                    <div className="inline-flex rounded-2xl bg-white/12 p-2.5 text-emerald-200">
                      <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-200">
                      Suporte oficial
                    </p>
                    <p className="mt-2 text-base font-semibold">App e WhatsApp no mesmo fluxo</p>
                    <p className="mt-2 text-sm leading-6 text-white/78">
                      Menos tentativa e erro, mais acompanhamento para seguir o plano com constancia.
                    </p>
                  </div>

                  <div className="rounded-[30px] border border-emerald-100 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                    <div className="inline-flex rounded-2xl bg-emerald-100 p-2.5 text-emerald-700">
                      <ShieldCheckIcon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                      Seguranca clinica
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      A medicacao so entra quando fizer sentido para o seu perfil e para a sua avaliacao.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
