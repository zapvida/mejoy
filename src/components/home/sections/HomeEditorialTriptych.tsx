'use client';

import Image from 'next/image';

import { HOME_HUB_EDITORIAL_TRIPTYCH } from '@/lib/home-hub-assets';
import { MEDVI_HOME } from '@/lib/medvi-parity-tokens';

/**
 * Três retratos com stagger — confiança / “pessoas felizes”.
 */
export function HomeEditorialTriptych() {
  const r = MEDVI_HOME.editorialTriptychRadiusPx;
  const gap = MEDVI_HOME.editorialTriptychGapPx;
  const stagger = MEDVI_HOME.editorialTriptychStaggerPx;
  const shadow = MEDVI_HOME.editorialTriptychShadow;

  return (
    <section
      className="bg-[#f9faf9] py-12 sm:py-14 md:py-16"
      data-home-section="editorial_triptych"
    >
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8">
        <div
          className="mx-auto flex max-w-[720px] flex-row items-start justify-center md:max-w-none"
          style={{ gap: `${gap}px` }}
        >
          {HOME_HUB_EDITORIAL_TRIPTYCH.map((item, idx) => (
            <div
              key={item.src}
              className="relative w-[min(30vw,7.5rem)] shrink-0 overflow-hidden sm:w-[min(28vw,9rem)] md:w-[min(24%,13.5rem)]"
              style={{
                borderRadius: r,
                boxShadow: shadow,
                marginTop: idx === 1 ? `${stagger}px` : 0,
              }}
            >
              <div className="aspect-[3/4] w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 30vw, 200px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
