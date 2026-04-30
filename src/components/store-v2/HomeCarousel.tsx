'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { ProductCardData } from '@/lib/store-v2/catalog';

interface HomeCarouselProps {
  title: string;
  subtitle?: string;
  badge?: string;
  tone?: 'default' | 'search' | 'sales' | 'new';
  viewAllHref?: string;
  products: ProductCardData[];
}

const TONE_STYLES: Record<NonNullable<HomeCarouselProps['tone']>, { section: string; badge: string }> = {
  default: {
    section: 'bg-white border-gray-100',
    badge: 'bg-gray-100 text-gray-700',
  },
  search: {
    section: 'bg-sky-50/40 border-sky-100',
    badge: 'bg-sky-100 text-sky-800',
  },
  sales: {
    section: 'bg-orange-50/50 border-orange-100',
    badge: 'bg-orange-100 text-orange-800',
  },
  new: {
    section: 'bg-emerald-50/40 border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-800',
  },
};

export default function HomeCarousel({ title, subtitle, badge, tone = 'default', viewAllHref, products }: HomeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const toneStyle = TONE_STYLES[tone];

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const step = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className={`rounded-2xl border p-4 md:p-6 ${toneStyle.section}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
        <div>
          {badge ? (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-2 ${toneStyle.badge}`}>
              {badge}
            </span>
          ) : null}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-600 mt-1">{subtitle}</p> : null}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-brand font-medium hover:text-brand-600 transition-colors text-sm whitespace-nowrap"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="relative group/carousel">
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4 md:-mx-6 md:px-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="shrink-0 snap-start w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)] flex flex-col min-h-0"
            >
              <ProductCard
                slug={p.slug}
                name={p.name}
                shortName={p.shortName}
                shortBenefit={p.shortBenefit}
                homeBenefitStyle
                priceCents={p.priceCents}
                compareAtCents={p.compareAtCents}
                image={p.image}
                badges={p.badges}
                rating={p.rating}
                formDisplay={p.formDisplay}
              />
            </div>
          ))}
        </div>
        {products.length > 2 && (
          <>
            <button
              type="button"
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-brand transition-colors opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden md:flex"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-brand transition-colors opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden md:flex"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
