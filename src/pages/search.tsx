import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { isStoreV2Enabled } from '@/lib/flags';
import StorefrontHeader from '@/components/store-v2/StorefrontHeader';
import StorefrontFooter from '@/components/store-v2/StorefrontFooter';
import ProductCard from '@/components/store-v2/ProductCard';
import Seo from '@/components/Seo';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  shortName?: string | null;
  shortBenefit?: string | null;
  priceCents: number | null;
  compareAtCents?: number | null;
  image?: string | null;
  objective?: string;
}

export default function SearchPage() {
  const router = useRouter();
  const q = (router.query.q as string) ?? '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(q);

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  useEffect(() => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/store-v2/search?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  if (!isStoreV2Enabled()) return null;

  return (
    <>
      <Seo title={`Buscar: ${q || 'Produtos'} | MeJoy`} description="Busque fórmulas manipuladas" path="/search" />
      <StorefrontHeader />
      <main className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Buscar produtos</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim();
              if (v.length < 2) {
                router.push('/produtos');
                return;
              }
              router.replace({ query: { q: v } }, undefined, { shallow: true });
            }}
          >
            <input
              name="q"
              type="search"
              placeholder="Busque por nome, sintomas etc..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <button type="submit" className="mt-2 px-6 py-2 rounded-lg bg-brand text-white font-medium">
              Buscar
            </button>
          </form>
          {loading && <p className="mt-4 text-gray-500">Buscando...</p>}
          {!loading && results.length > 0 && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  shortName={p.shortName}
                  shortBenefit={p.shortBenefit}
                  priceCents={p.priceCents}
                  compareAtCents={p.compareAtCents}
                  image={p.image}
                />
              ))}
            </div>
          )}
          {!loading && q.length >= 2 && results.length === 0 && (
            <p className="mt-8 text-gray-500">Nenhum produto encontrado para &quot;{q}&quot;</p>
          )}
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!isStoreV2Enabled()) {
    return { redirect: { destination: '/', permanent: false } };
  }
  const q = String(ctx.query?.q ?? '').trim();
  if (q.length < 2) {
    return { redirect: { destination: '/produtos', permanent: false } };
  }
  return { props: {} };
};
