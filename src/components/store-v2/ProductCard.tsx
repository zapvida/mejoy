import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import ProductPackShot, { shouldUsePackShot } from './ProductPackShot';
import FavoriteButton from './FavoriteButton';

interface ProductCardProps {
  slug: string;
  name: string;
  shortName?: string | null;
  shortBenefit?: string | null;
  homeBenefitStyle?: boolean;
  priceCents: number | null;
  compareAtCents?: number | null;
  image?: string | null;
  badges?: string[];
  rating?: number | null;
  formDisplay?: string | null;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export default function ProductCard({
  slug,
  name,
  shortName,
  shortBenefit,
  homeBenefitStyle = false,
  priceCents,
  compareAtCents,
  image,
  badges,
  rating,
  formDisplay,
}: ProductCardProps) {
  const displayName = shortName && shortName.trim() ? shortName.trim() : name;
  const benefitText = shortBenefit?.replace(/\s+/g, ' ').trim() ?? '';
  const hasDiscount = compareAtCents != null && compareAtCents > 0 && priceCents != null && compareAtCents > priceCents;
  const discountPct = hasDiscount && priceCents
    ? Math.round(((compareAtCents - priceCents) / compareAtCents) * 100)
    : 0;

  const renderHomeBenefit = (value: string) => {
    const [leadWord, ...restWords] = value.split(' ').filter(Boolean);
    if (!leadWord) return value;
    return (
      <>
        <strong className="font-semibold text-gray-900">{leadWord}</strong>
        {restWords.length ? ` ${restWords.join(' ')}` : ''}
      </>
    );
  };

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-brand-200 transition-all duration-200 group flex flex-col h-full">
      <Link href={`/p/${slug}`} className="flex flex-col flex-1 min-h-0">
        <div className="aspect-square bg-white relative shrink-0">
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
            {badges?.[0] && (
              <span className="px-2 py-0.5 rounded-md bg-brand text-white text-xs font-medium">
                {badges[0]}
              </span>
            )}
            <div onClick={(e) => e.stopPropagation()}>
              <FavoriteButton slug={slug} size="sm" />
            </div>
          </div>
          {image && !shouldUsePackShot(image) ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <ProductPackShot title={displayName ?? ''} variant="card" className="w-full h-full" />
          )}
          {hasDiscount && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-semibold">
              -{discountPct}%
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1 min-h-0">
          {formDisplay && (
            <span className="text-xs text-gray-700 uppercase tracking-wide shrink-0">{formDisplay}</span>
          )}
          <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 shrink-0 group-hover:text-brand transition-colors">
            {displayName}
          </h3>
          {benefitText ? (
            <p
              className={
                homeBenefitStyle
                  ? 'text-sm text-gray-700 mt-1 min-h-[2.5rem] max-h-[2.5rem] overflow-hidden leading-5 break-words'
                  : 'text-sm text-gray-700 mt-1 line-clamp-2 min-h-[2.5rem] break-words'
              }
            >
              {homeBenefitStyle ? renderHomeBenefit(benefitText) : benefitText}
            </p>
          ) : (
            <div className="min-h-[2.5rem]" aria-hidden />
          )}
          {rating != null && rating > 0 && (
            <div className="flex items-center gap-1 mt-2 shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
          )}
          <div className="mt-auto pt-3 flex items-baseline gap-2 shrink-0">
            {priceCents != null ? (
              <>
                <span className="text-lg font-bold text-gray-900">{formatPrice(priceCents)}</span>
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">{formatPrice(compareAtCents!)}</span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-700">Sob consulta</span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0 shrink-0" onClick={(e) => e.stopPropagation()}>
        <AddToCartButton
          productSlug={slug}
          className="w-full py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Adicionar
        </AddToCartButton>
      </div>
    </article>
  );
}
