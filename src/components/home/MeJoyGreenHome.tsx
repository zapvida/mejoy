import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { FooterZapfarm } from '@/components/zapfarm/emagrecimento/FooterZapfarm';
import { HowItWorksSectionObesidade } from '@/components/zapfarm/obesidade/HowItWorksSectionObesidade';
import { AppFeaturesSectionObesidade } from '@/components/zapfarm/obesidade/AppFeaturesSectionObesidade';
import { DecisionSectionObesidade } from '@/components/zapfarm/obesidade/DecisionSectionObesidade';

const homeLinks = [
  { label: 'Emagrecimento', href: '/emagrecimento' },
  { label: 'Como funciona', href: '/emagrecimento/como-funciona' },
  { label: 'Resultados', href: '/emagrecimento/resultados' },
  { label: 'Especialistas', href: '/emagrecimento/especialistas' },
];

const categories = [
  {
    title: 'Perda de peso',
    href: '/emagrecimento',
    image: '/images/emagrecimento/medvi/treatment-injetavel.webp',
    imageClassName: 'object-contain bg-[#e9f0e5] p-4',
  },
  {
    title: 'Peptídeos e Longevidade',
    href: '/triagem/longevidade',
    image: '/images/emagrecimento/medvi/hero-secondary.webp',
    imageClassName: 'object-cover object-center',
  },
  {
    title: 'Saúde Masculina',
    href: '/emagrecimento/especialistas',
    image: '/images/emagrecimento/medvi/avatar-chris.webp',
    imageClassName: 'object-cover object-top',
  },
  {
    title: 'Saúde da Mulher',
    href: '/emagrecimento/tratamentos',
    image: '/images/emagrecimento/medvi/avatar-belinda.webp',
    imageClassName: 'object-cover object-top',
  },
];

const tickerItems = [
  'Profissionais de saúde licenciados',
  '100% online',
  'Precificação clara',
  'Entregue diretamente na sua porta',
  'Acompanhamento médico contínuo',
];

const supportingCards = [
  {
    title: 'Menos atrito na jornada',
    body: 'Triagem, consulta, relatório e acompanhamento no mesmo raciocínio visual.',
  },
  {
    title: 'Direção clínica real',
    body: 'O fluxo organiza o caso com clareza, e a conduta final continua com o médico.',
  },
  {
    title: 'Conversão com confiança',
    body: 'Menos quebra, menos ruído e mais entendimento em cada próxima ação.',
  },
];

export function MeJoyGreenHome() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <HeaderZapfarm
        mode="home"
        links={homeLinks}
        showPrimaryCta={false}
        showSecondaryCta={false}
        transparentAtTop
      />

      <main className="bg-white">
        <section className="relative overflow-hidden bg-[#204b3d] px-4 pb-0 pt-28 text-white sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(164,230,175,0.18),_transparent_32%),radial-gradient(circle_at_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
            <div className="absolute bottom-8 left-1/2 h-56 w-[1200px] -translate-x-1/2 text-center text-[clamp(7rem,24vw,24rem)] font-black uppercase tracking-[-0.08em] text-white/5">
              MeJoy
            </div>
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/88 sm:text-sm">
                Junte-se a mais de 500.000 pacientes da MeJoy
              </p>
              <h1 className="mt-5 text-[clamp(2.75rem,9vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-white">
                Saúde digital,
                <br />
                <span className="text-[#a8d897]">redefinida</span> para a vida real.
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-emerald-50/84 sm:text-lg">
                Atendimento médico online simples, direto e orientado por profissionais licenciados. Sem sala de espera.
                Sem etapas desnecessárias. Só cuidado que funciona.
              </p>
            </div>

            <div className="relative z-10 mx-auto mt-10 max-w-6xl translate-y-10 sm:mt-14">
              <div className="grid gap-3 sm:gap-4 lg:grid-cols-4">
                {categories.map((item, index) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="group overflow-hidden rounded-[2rem] border border-white/60 bg-white text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-[2.15/1] overflow-hidden border-b border-slate-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className={item.imageClassName}
                        sizes={index === 0 ? '(max-width: 1024px) 100vw, 260px' : '(max-width: 1024px) 100vw, 240px'}
                        quality={88}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-5 py-4">
                      <h2 className="min-w-0 text-base font-semibold tracking-[-0.03em] sm:text-[1.05rem]">
                        {item.title}
                      </h2>
                      <ArrowRightIcon className="h-5 w-5 shrink-0 text-slate-950 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-b border-slate-200 bg-white pt-16 sm:pt-20">
          <div className="overflow-hidden border-y border-slate-200">
            <div className="mejoy-home-marquee">
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex shrink-0 items-center gap-4 px-8 py-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-900 sm:px-14"
                >
                  <span className="h-5 w-5 rounded-full border border-slate-900/20" />
                  <span className="whitespace-nowrap">{item}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {supportingCards.map(card => (
              <div
                key={card.title}
                className="rounded-[2rem] border border-slate-200 bg-[#f7f6f2] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)]"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#204b3d]">MeJoy</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <HowItWorksSectionObesidade />
        <AppFeaturesSectionObesidade />
        <DecisionSectionObesidade />
      </main>

      <FooterZapfarm />

      <style jsx global>{`
        @keyframes mejoy-home-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .mejoy-home-marquee {
          display: flex;
          width: max-content;
          animation: mejoy-home-marquee 34s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .mejoy-home-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
