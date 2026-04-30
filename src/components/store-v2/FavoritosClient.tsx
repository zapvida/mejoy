'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import ProductCard from '@/components/store-v2/ProductCard';
import Link from 'next/link';

interface ProductData {
  id: string;
  slug: string;
  name: string;
  shortName?: string | null;
  shortBenefit?: string | null;
  priceCents: number | null;
  compareAtCents?: number | null;
  image?: string | null;
  badges?: string[];
  formDisplay?: string | null;
}

export default function FavoritosClient() {
  const { slugs, mounted } = useFavorites();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted || slugs.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/store-v2/products-by-slugs?slugs=${encodeURIComponent(slugs.join(','))}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [mounted, slugs]);

  if (!mounted) {
    return <p className="text-gray-500">Carregando...</p>;
  }

  if (slugs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">Você ainda não tem favoritos.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-white font-medium hover:bg-brand-600 transition-colors"
        >
          Explorar produtos
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="text-gray-500">Carregando favoritos...</p>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">Nenhum produto encontrado nos favoritos.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-white font-medium hover:bg-brand-600 transition-colors"
        >
          Explorar produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          slug={p.slug}
          name={p.name}
          shortName={p.shortName}
          shortBenefit={p.shortBenefit}
          priceCents={p.priceCents}
          compareAtCents={p.compareAtCents}
          image={p.image}
          badges={p.badges}
          formDisplay={p.formDisplay}
        />
      ))}
    </div>
  );
}
