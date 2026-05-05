'use client';

import { HeartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

import { track } from '@/lib/analytics';

type Treatment = {
  slug: string;
  title: string;
  description: string;
  href: string;
  icon: typeof HeartIcon;
};

const TREATMENTS: Treatment[] = [
  {
    slug: 'saude',
    title: 'Saúde & bem-estar',
    description: 'Uma entrada simples para organizar sinais, rotina e próximos passos de cuidado.',
    href: '/triagem/saude',
    icon: HeartIcon,
  },
  {
    slug: 'detox',
    title: 'Detox & fígado',
    description: 'Triagem para entender hábitos, desconfortos digestivos e apoio hepático com mais critério.',
    href: '/triagem/detox',
    icon: ShieldCheckIcon,
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
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-emerald-800 sm:text-sm">
              Outras jornadas
            </p>
            <h2
              id="home-treatments-heading"
              className="mt-3 text-[1.75rem] font-bold leading-tight tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[2.25rem]"
            >
              Cuidado organizado para diferentes objetivos
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-600 sm:text-lg">
              O mesmo padrão Me Joy: triagem objetiva, linguagem clara, privacidade e suporte pelo canal oficial.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
            {TREATMENTS.map(({ slug, title, description, href, icon: Icon }) => (
              <a
                key={slug}
                href={href}
                onClick={() => handleClick(slug)}
                className="group flex h-full flex-col rounded-[26px] border border-emerald-100/90 bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-emerald-200/80 hover:shadow-[0_24px_56px_rgba(15,23,42,0.08)]"
              >
                <span className="inline-flex w-fit rounded-2xl bg-emerald-50 p-3 text-emerald-800 ring-1 ring-emerald-100/80">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-950 sm:text-xl">{title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-600">{description}</p>
                <span className="mt-5 inline-flex items-center text-sm font-bold text-emerald-700 transition group-hover:translate-x-0.5">
                  Saiba mais
                  <span aria-hidden className="ml-1">
                    →
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
