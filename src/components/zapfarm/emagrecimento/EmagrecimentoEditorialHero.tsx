import Image from 'next/image';
import { cn } from '@/lib/utils';

interface EmagrecimentoEditorialHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  ctaText: string;
  ctaHref?: string;
  analyticsEvent?: string;
  images: string[];
  imageAspect?: 'portrait' | 'square' | 'mixed';
}

export function EmagrecimentoEditorialHero({
  eyebrow = 'Programa MeJoy',
  title,
  description,
  bullets = [],
  ctaText,
  ctaHref = '/triagem/emagrecimento',
  analyticsEvent,
  images,
  imageAspect = 'mixed',
}: EmagrecimentoEditorialHeroProps) {
  const imageWrapClass =
    imageAspect === 'portrait'
      ? 'aspect-[3/4]'
      : imageAspect === 'square'
        ? 'aspect-square'
        : 'aspect-[4/5] sm:aspect-[3/4]';

  return (
    <section className="border-b border-slate-200 bg-[#f7f6f2] py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4d6d56]">{eyebrow}</p>
            <h1 className="mt-4 text-[clamp(2.2rem,5.6vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-[#2f2925]">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 lg:mx-0 lg:text-lg">
              {description}
            </p>
            {bullets.length > 0 ? (
              <ul className="mx-auto mt-6 max-w-xl space-y-3 text-left text-sm text-slate-700 sm:text-base lg:mx-0">
                {bullets.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dbe9d5] text-[11px] font-bold text-[#204b3d]">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <a
              href={ctaHref}
              onClick={() => {
                if (analyticsEvent && typeof window !== 'undefined' && (window as any).analytics) {
                  (window as any).analytics.track(analyticsEvent);
                }
              }}
              className="mt-8 inline-flex rounded-full bg-[#93b28d] px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#7e9f79] sm:text-base"
            >
              {ctaText}
            </a>
          </div>

          <div className={cn('grid gap-3 sm:gap-4', images.length >= 4 ? 'grid-cols-2' : 'grid-cols-3')}>
            {images.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className={cn(
                  'relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#dbd5cc] shadow-[0_18px_50px_rgba(15,23,42,0.08)]',
                  imageWrapClass,
                  images.length >= 4 && index % 2 === 1 ? 'translate-y-4 sm:translate-y-8' : ''
                )}
              >
                <Image src={src} alt="" fill className="object-cover object-top" sizes="(max-width: 1024px) 50vw, 280px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
