import Image from 'next/image';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { FooterZapfarm } from '@/components/zapfarm/emagrecimento/FooterZapfarm';
import { TrustBarSectionObesidade } from '@/components/zapfarm/obesidade/TrustBarSectionObesidade';
import { HowItWorksSectionObesidade } from '@/components/zapfarm/obesidade/HowItWorksSectionObesidade';
import { AppFeaturesSectionObesidade } from '@/components/zapfarm/obesidade/AppFeaturesSectionObesidade';
import { DecisionSectionObesidade } from '@/components/zapfarm/obesidade/DecisionSectionObesidade';

const homeLinks = [
  { label: 'Jornada', href: '#jornada' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Confiança', href: '#confianca' },
  { label: 'Produtos', href: '/produtos' },
];

const marqueeItems = [
  'Avaliação médica quando indicada',
  'Triagem online em poucos minutos',
  'Próximos passos no WhatsApp oficial',
  'Privacidade e LGPD no fluxo inteiro',
  'Acompanhamento humano com tecnologia',
];

const verticalCards = [
  {
    eyebrow: 'Disponível agora',
    title: 'Emagrecimento',
    description: 'Triagem online, leitura inicial do perfil e próximos passos com avaliação médica.',
    href: '/emagrecimento',
    cta: 'Começar agora',
    image: '/images/emagrecimento/medvi/hero-main.webp',
    tone: 'light',
  },
  {
    eyebrow: 'Próxima vertical',
    title: 'Longevidade',
    description: 'Rotinas de cuidado, prevenção e acompanhamento para sustentar consistência.',
    href: '/triagem/longevidade',
    cta: 'Em breve',
    image: '/images/emagrecimento/medvi/journey-consulta.avif',
    tone: 'dark',
  },
  {
    eyebrow: 'Planejamento ativo',
    title: 'Microbioma',
    description: 'Leitura funcional da rotina intestinal, sinais de inflamação e hábitos do dia a dia.',
    href: '/triagem/microbioma',
    cta: 'Explorar triagem',
    image: '/images/emagrecimento/medvi/support-whatsapp.avif',
    tone: 'dark',
  },
];

const carePillars = [
  {
    title: 'Menos atrito na jornada',
    text: 'Fluxo curto, linguagem objetiva e próximos passos claros em cada etapa.',
  },
  {
    title: 'Critério clínico real',
    text: 'A plataforma organiza contexto, mas a conduta final continua com o médico.',
  },
  {
    title: 'Experiência contínua',
    text: 'Home, landing, triagem e relatório agora fazem parte da mesma narrativa visual.',
  },
];

export function MeJoyGreenHome() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f0f4]">
      <HeaderZapfarm
        links={homeLinks}
        primaryCtaHref="/emagrecimento"
        primaryCtaLabel="Ver jornada de emagrecimento"
        primaryCtaMobileLabel="Ver jornada"
        secondaryCtaHref="/produtos"
        secondaryCtaLabel="Ver catálogo"
        brandSubtitle="Saúde digital com avaliação médica"
        transparentAtTop
      />

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(154,230,180,0.20),_transparent_32%),linear-gradient(180deg,_#254f3e_0%,_#16362b_58%,_#122b23_100%)] pt-28 sm:pt-32">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute left-8 top-20 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-lime-200/10 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,420px)] lg:px-8">
            <div className="min-w-0 py-6 lg:py-12">
              <div className="inline-flex rounded-full border border-emerald-300/25 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-100">
                Cuidado digital com avaliação médica
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[0.98] text-white sm:text-5xl lg:text-[72px]">
                Saúde digital, pensada para a vida real.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/88 sm:text-lg">
                Entre por uma jornada ativa, faça sua leitura inicial e continue no mesmo fluxo quando a
                avaliação médica for indicada.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/emagrecimento"
                  className="inline-flex h-14 items-center justify-center whitespace-nowrap rounded-full bg-[#69d39b] px-7 text-base font-bold text-[#123226] shadow-[0_24px_60px_rgba(105,211,155,0.25)] transition hover:translate-y-[-1px] hover:bg-[#77dda6]"
                >
                  Começar jornada de emagrecimento
                </a>
                <a
                  href="/triagem/emagrecimento"
                  className="inline-flex h-14 items-center justify-center whitespace-nowrap rounded-full border border-white/18 bg-white/10 px-7 text-base font-semibold text-white transition hover:bg-white/14"
                >
                  Fazer triagem online
                </a>
              </div>

              <div className="mt-7 overflow-hidden rounded-full border border-white/16 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
                <div className="marquee-fade">
                  <div className="marquee-track">
                    {[...marqueeItems, ...marqueeItems].map((item, index) => (
                      <span
                        key={`${item}-${index}`}
                        className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap px-5 py-3 text-sm font-medium text-white/92"
                      >
                        <span className="inline-flex h-2 w-2 rounded-full bg-[#8bf0b7]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div id="jornada" className="mt-10 grid gap-4 sm:grid-cols-3">
                {carePillars.map(item => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/7 p-5 shadow-[0_18px_40px_rgba(9,18,15,0.18)] backdrop-blur-sm"
                  >
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-emerald-50/84">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-w-0 pb-4 lg:pb-0">
              <div className="absolute -inset-x-2 top-8 bottom-0 rounded-[34px] bg-gradient-to-b from-white/8 to-transparent blur-xl" />
              <div className="relative space-y-4">
                {verticalCards.map(card => {
                  const isActive = card.tone === 'light';
                  return (
                    <a
                      key={card.title}
                      href={card.href}
                      className={`block rounded-[30px] border p-4 shadow-[0_28px_70px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 ${
                        isActive
                          ? 'border-white/40 bg-white text-slate-900'
                          : 'border-white/10 bg-white/10 text-white backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border border-black/5 bg-emerald-50">
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                            quality={86}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[11px] font-bold uppercase tracking-[0.28em] ${
                              isActive ? 'text-emerald-700' : 'text-emerald-100/90'
                            }`}
                          >
                            {card.eyebrow}
                          </p>
                          <h2 className="mt-2 truncate text-[30px] font-semibold leading-none">{card.title}</h2>
                          <p
                            className={`mt-3 text-sm leading-6 ${
                              isActive ? 'text-slate-600' : 'text-white/78'
                            }`}
                          >
                            {card.description}
                          </p>
                          <span
                            className={`mt-4 inline-flex whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
                              isActive
                                ? 'bg-emerald-600 text-white'
                                : 'border border-white/14 bg-white/10 text-white'
                            }`}
                          >
                            {card.cta}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="confianca">
          <TrustBarSectionObesidade />
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

        .marquee-fade {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          overflow: hidden;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: mejoy-home-marquee 30s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
