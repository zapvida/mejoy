'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MEDVI_GLP } from '@/lib/medvi-parity-tokens';

type HeroProofPhotoProps = {
  src: string;
  alt: string;
  sizes: string;
};

/** Retrato do trio hero: zoom-out no load (Ken Burns), sem alterar box (CLS). */
export function HeroProofPhoto({ src, alt, sizes }: HeroProofPhotoProps) {
  const [settled, setSettled] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setSettled(true);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setSettled(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [reduceMotion]);

  const from = MEDVI_GLP.heroProofPhotoZoomFrom;
  const scale = settled ? 1 : from;
  const ms = MEDVI_GLP.heroProofPhotoZoomMs;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      priority
      style={{
        transform: `scale(${scale})`,
        transition: reduceMotion ? undefined : `transform ${ms}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        willChange: settled ? undefined : 'transform',
      }}
    />
  );
}
