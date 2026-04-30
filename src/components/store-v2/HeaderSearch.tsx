'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  shortName?: string | null;
  shortBenefit?: string | null;
  priceCents: number | null;
  image?: string | null;
}

export default function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/store-v2/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(query.trim()), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (results.length > 0 && query.trim().length >= 2) setOpen(true);
  }, [results.length, query]);

  const showDropdown = open && (focused || results.length > 0);
  const hasResults = results.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSelect = (slug: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/p/${slug}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl hidden md:block">
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setFocused(true);
              if (query.trim().length >= 2 || results.length > 0) setOpen(true);
            }}
            onBlur={() => setFocused(false)}
            placeholder="Busque por nome, sintomas etc..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-colors"
            aria-label="Buscar produtos"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            autoComplete="off"
          />
        </div>
      </form>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-full mt-1 py-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[320px] overflow-y-auto z-[1002]"
          role="listbox"
        >
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">Buscando...</div>
          )}
          {!loading && query.length >= 2 && !hasResults && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Nenhum resultado para &quot;{query}&quot;
            </div>
          )}
          {!loading && hasResults && (
            <>
              {results.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  href={`/p/${p.slug}`}
                  onClick={() => handleSelect(p.slug)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors"
                  role="option"
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 line-clamp-2">{p.shortName || p.name}</p>
                    {p.shortBenefit && (
                      <p className="text-xs text-gray-500 line-clamp-2">{p.shortBenefit}</p>
                    )}
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-brand hover:bg-orange-50 border-t border-gray-100"
              >
                Ver todos os resultados →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
