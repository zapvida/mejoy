'use client';

import {
  HeartIcon,
  MoonIcon,
  ScaleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/outline';

import { track } from '@/lib/analytics';

type Treatment = {
  slug: string;
  title: string;
  description: string;
  href: string;
  icon: typeof ScaleIcon;
  available: boolean;
};

const TREATMENTS: Treatment[] = [
  {
    slug: 'emagrecimento',
    title: 'Emagrecimento & Metabolismo',
    description: 'Programa com avaliação médica e acompanhamento contínuo para evolução estável.',
    href: '/emagrecimento',
    icon: ScaleIcon,
    available: true,
  },
  {
    slug: 'sono',
    title: 'Sono & Recuperação',
    description: 'Rotina noturna, suplementação orientada e suporte para noites mais estáveis.',
    href: '/triagem/sono',
    icon: MoonIcon,
    available: true,
  },
  {
    slug: 'articulacoes',
    title: 'Articulações & Mobilidade',
    description: 'Conforto articular e mobilidade no dia a dia com acompanhamento orientado.',
    href: '/triagem/articulacoes',
    icon: HandRaisedIcon,
    available: true,
  },
  {
    slug: 'cabelo',
    title: 'Cabelo & Couro Cabeludo',
    description: 'Cuidado capilar com protocolo orientado e suporte clínico para a rotina.',
    href: '/triagem/cabelo',
    icon: SparklesIcon,
    available: true,
  },
  {
    slug: 'saude',
    title: 'Saúde & Bem-estar',
    description: 'Suporte funcional para rotina saudável, com avaliação médica quando indicada.',
    href: '/triagem/saude',
    icon: HeartIcon,
    available: true,
  },
  {
    slug: 'detox',
    title: 'Detox & Fígado',
    description: 'Apoio hepático e digestivo com cuidado contínuo e orientação clínica.',
    href: '/triagem/detox',
    icon: ShieldCheckIcon,
    available: true,
  },
];

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
      className="bg-[#f7faf7] py-14 sm:py-16 md:py-20"
      data-home-section="treatments"
      aria-labelledby="home-treatments-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Tratamentos</p>
            <h2
              id="home-treatments-heading"
              className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl"
            >
              Escolha por onde começar seu cuidado
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 sm:text-xl">
              Cada jornada começa por uma triagem online, com avaliação médica quando indicada e suporte oficial pelo
              WhatsApp.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TREATMENTS.map(({ slug, title, description, href, icon: Icon }) => (
              <a
                key={slug}
                href={href}
                onClick={() => handleClick(slug)}
                className="group flex h-full flex-col rounded-[28px] border border-emerald-100 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_28px_60px_rgba(15,23,42,0.08)]"
              >
                <span className="inline-flex w-fit rounded-2xl bg-emerald-100 p-3 text-emerald-800 ring-1 ring-emerald-200">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-slate-600">{description}</p>
                <span className="mt-5 inline-flex items-center text-sm font-bold text-emerald-700 transition group-hover:translate-x-1">
                  Saiba mais
                  <span aria-hidden className="ml-1">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
