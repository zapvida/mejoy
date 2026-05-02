'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { useLandingPageKey } from '@/contexts/LandingAnalyticsContext';
import { getLpPriceHook } from '@/lib/emagrecimento/launchPricing';

const COPY = {
  default: {
    headline: 'Cuidado digital para sua próxima decisão clínica.',
    subheadline: 'Fluxo online, avaliação individual e continuidade no mesmo ambiente.',
  },
  emagrecimento: {
    headline: 'Finalmente levando a sério a perda de peso? Nós também. Perda de gordura facilitada com atendimento personalizado e medicação GLP-1.',
    subheadline:
      'Triagem rápida, avaliação médica quando indicada e continuidade clínica sem fricção.',
  },
} as const;

const socialLogos = ['Forbes', 'healthline', 'WebMD', 'FORHERS'] as const;

const collageDesktop = [
  { src: '/images/emagrecimento/medvi/reviews-06.webp', className: 'row-span-2 h-[18rem] rounded-[2.1rem]' },
  { src: '/images/emagrecimento/medvi/reviews-01.webp', className: 'mt-12 h-[12rem] rounded-[2rem]' },
  { src: '/images/emagrecimento/medvi/reviews-03.avif', className: 'h-[17rem] rounded-[2rem]' },
  { src: '/images/emagrecimento/medvi/reviews-07.webp', className: 'mt-12 h-[20rem] rounded-[2rem]' },
  { src: '/images/emagrecimento/medvi/avatar-sandra.webp', className: '-mt-10 h-[16rem] rounded-[2.1rem]' },
  { src: '/images/emagrecimento/medvi/avatar-melissa.webp', className: 'h-[10rem] rounded-[2rem]' },
] as const;

const collageMobile = [
  { src: '/images/emagrecimento/medvi/reviews-06.webp', className: 'h-48 rounded-[2rem]' },
  { src: '/images/emagrecimento/medvi/reviews-01.webp', className: 'mt-10 h-36 rounded-[1.8rem]' },
  { src: '/images/emagrecimento/medvi/reviews-03.avif', className: 'h-52 rounded-[2rem]' },
  { src: '/images/emagrecimento/medvi/reviews-07.webp', className: 'mt-10 h-52 rounded-[1.8rem]' },
  { src: '/images/emagrecimento/medvi/avatar-sandra.webp', className: 'h-44 rounded-[2rem]' },
  { src: '/images/emagrecimento/medvi/avatar-melissa.webp', className: 'h-32 rounded-[1.8rem]' },
] as const;

type HeroVariant = keyof typeof COPY;

export function HeroSectionObesidade({ variant = 'default' }: { variant?: HeroVariant }) {
  const page = useLandingPageKey();
  const copy = COPY[variant];

  const handlePrimaryCta = () => {
    track('hero_primary_cta_click', {
      page,
      position: 'hero',
      section: 'hero',
    });
  };

  return (
    <section className="bg-[#f7f6f2] px-4 pb-10 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-slate-200/80 pb-4 text-center text-sm text-[#345242]">
          <span className="font-semibold text-[#7c9d74]">Promoção de primavera!</span>{' '}
          <span className="font-medium">{getLpPriceHook()}</span>
        </div>

        <div className="mx-auto max-w-6xl pt-7 text-center sm:pt-12">
          <p className="text-sm text-slate-600 sm:text-lg">
            Junte-se a <span className="font-bold text-slate-900">mais de 500.000</span> pacientes da MeJoy
          </p>

          <h1 className="mx-auto mt-4 max-w-[1180px] text-[clamp(2rem,9vw,4.8rem)] font-normal leading-[0.96] tracking-[-0.06em] text-[#2f2925] sm:mt-5 sm:text-[clamp(2.3rem,5.2vw,4.4rem)] sm:leading-[0.94] lg:text-[4.65rem]">
            {variant === 'emagrecimento' ? (
              <>
                Finalmente levando a sério a perda de peso? Nós também.
                <span className="text-[#4d6d56]"> Perda de gordura facilitada</span> com atendimento personalizado e medicação GLP-1.
              </>
            ) : (
              copy.headline
            )}
          </h1>

          <div className="mx-auto mt-4 max-w-2xl space-y-1.5 text-sm text-slate-700 sm:mt-4 sm:space-y-1.5 sm:text-[15px] sm:leading-7">
            <p>Perca gordura toda semana</p>
            <p>
              <strong>Sem taxa de adesão ou custos ocultos.</strong> Tudo o que você precisa está incluído.
            </p>
            <p className="sm:hidden">Triagem rápida e continuidade clínica sem fricção.</p>
            <p className="hidden sm:block">{copy.subheadline}</p>
            <p className="hidden sm:block">Aprovado para sua rotina, quando indicado em consulta.</p>
          </div>

          <div className="mt-4 sm:mt-5">
            <a
              href="/triagem/emagrecimento"
              onClick={handlePrimaryCta}
              className={cn(
                'inline-flex items-center justify-center rounded-full px-10 py-4 text-sm font-bold uppercase tracking-[0.12em] transition-colors sm:text-base',
                'bg-[#93b28d] text-white hover:bg-[#7e9f79]'
              )}
            >
              Sou qualificado?
            </a>
          </div>
        </div>

        <div className="mt-6 lg:hidden">
          <div className="grid grid-cols-3 gap-3">
            {collageMobile.map(item => (
              <div key={item.src} className={cn('relative overflow-hidden bg-[#dfd7c9]', item.className)}>
                <Image
                  src={item.src}
                  alt="Paciente em jornada de emagrecimento"
                  fill
                  className="object-cover object-top"
                  sizes="33vw"
                  quality={88}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 hidden lg:block">
          <div className="grid grid-cols-[1.05fr_0.95fr_1fr_0.95fr_1.05fr] gap-3">
            <div className="space-y-3">
              <div className="relative h-[19rem] overflow-hidden rounded-[2.2rem] bg-[#dbd5cc]">
                <Image
                  src={collageDesktop[0].src}
                  alt="Paciente em jornada de emagrecimento"
                  fill
                  className="object-cover object-top"
                  sizes="18vw"
                  quality={88}
                />
              </div>
              <div className="relative h-[15rem] overflow-hidden rounded-[2.2rem] bg-[#dbd5cc]">
                <Image
                  src={collageDesktop[4].src}
                  alt="Paciente em jornada de emagrecimento"
                  fill
                  className="object-cover object-top"
                  sizes="18vw"
                  quality={88}
                />
              </div>
            </div>

            <div className="space-y-3 pt-20">
              <div className="relative h-[11rem] overflow-hidden rounded-[2rem] bg-[#dbd5cc]">
                <Image
                  src={collageDesktop[1].src}
                  alt="Paciente em jornada de emagrecimento"
                  fill
                  className="object-cover object-top"
                  sizes="16vw"
                  quality={88}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative h-[20rem] overflow-hidden rounded-[2.2rem] bg-[#dbd5cc]">
                <Image
                  src={collageDesktop[2].src}
                  alt="Paciente em jornada de emagrecimento"
                  fill
                  className="object-cover object-top"
                  sizes="18vw"
                  quality={88}
                />
              </div>
            </div>

            <div className="space-y-3 pt-20">
              <div className="relative h-[21rem] overflow-hidden rounded-[2rem] bg-[#dbd5cc]">
                <Image
                  src={collageDesktop[3].src}
                  alt="Paciente em jornada de emagrecimento"
                  fill
                  className="object-cover object-top"
                  sizes="16vw"
                  quality={88}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative h-[19rem] overflow-hidden rounded-[2.2rem] bg-[#dbd5cc]">
                <Image
                  src="/images/emagrecimento/medvi/avatar-terri.webp"
                  alt="Paciente em jornada de emagrecimento"
                  fill
                  className="object-cover object-top"
                  sizes="18vw"
                  quality={88}
                />
              </div>
              <div className="relative ml-auto h-[8.5rem] w-[70%] overflow-hidden rounded-[1.8rem] bg-[#dbd5cc]">
                <Image
                  src={collageDesktop[5].src}
                  alt="Paciente em jornada de emagrecimento"
                  fill
                  className="object-cover object-top"
                  sizes="12vw"
                  quality={88}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-y border-slate-200/80 py-6">
          <div className="grid gap-4 text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#2f2925] sm:grid-cols-4 lg:grid-cols-5">
            {socialLogos.map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
