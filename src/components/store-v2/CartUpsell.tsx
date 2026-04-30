'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import ProductPackShot, { shouldUsePackShot } from './ProductPackShot';

interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  shortBenefit?: string | null;
  priceCents: number | null;
  compareAtCents?: number | null;
  image?: string | null;
  formDisplay?: string | null;
}

interface CartUpsellProps {
  /** Slug do primeiro item do carrinho para buscar relacionados */
  firstItemSlug: string | null;
  onCartUpdate?: () => void;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export default function CartUpsell({ firstItemSlug, onCartUpdate }: CartUpsellProps) {
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(!!firstItemSlug);

  useEffect(() => {
    if (!firstItemSlug) {
      setRelated([]);
      setLoading(false);
      return;
    }
    fetch(`/api/store-v2/catalog/related?slug=${encodeURIComponent(firstItemSlug)}&limit=8`)
      .then((r) => r.json())
      .then((data: { products?: RelatedProduct[] }) => setRelated(data.products ?? []))
      .catch(() => setRelated([]))
      .finally(() => setLoading(false));
  }, [firstItemSlug]);

  if (!firstItemSlug || (loading && related.length === 0)) {
    return (
      <div data-testid="cart-upsell" className="mt-8">
        {loading && (
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" aria-hidden />
        )}
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div data-testid="cart-upsell" className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Completar seu objetivo
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {related.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col"
          >
            <Link href={`/p/${p.slug}`} className="block flex-1 min-h-0">
              <div className="aspect-square bg-white rounded-md overflow-hidden relative mb-2">
                {p.image && !shouldUsePackShot(p.image) ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                ) : (
                  <ProductPackShot
                    title={(p as { title?: string }).title ?? p.name ?? ''}
                    variant="card"
                    className="w-full h-full"
                  />
                )}
              </div>
              <p className="font-medium text-gray-900 text-sm line-clamp-2">{p.name}</p>
              {p.priceCents != null && (
                <p className="text-brand-600 font-semibold text-sm mt-1">
                  {formatPrice(p.priceCents)}
                </p>
              )}
            </Link>
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <AddToCartButton
                productSlug={p.slug}
                redirectToCart={false}
                onAdded={onCartUpdate}
                className="w-full py-2 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors"
              >
                Adicionar
              </AddToCartButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
