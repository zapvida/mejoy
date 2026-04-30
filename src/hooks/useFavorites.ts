'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mejoy_favorites';

export function useFavorites() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        setSlugs(Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : []);
      }
    } catch {
      setSlugs([]);
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setSlugs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const add = useCallback(
    (slug: string) => {
      if (!slug) return;
      const next = slugs.includes(slug) ? slugs : [...slugs, slug];
      persist(next);
    },
    [slugs, persist]
  );

  const remove = useCallback(
    (slug: string) => {
      persist(slugs.filter((s) => s !== slug));
    },
    [slugs, persist]
  );

  const toggle = useCallback(
    (slug: string) => {
      if (slugs.includes(slug)) remove(slug);
      else add(slug);
    },
    [slugs, add, remove]
  );

  const isFavorite = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  return { slugs, add, remove, toggle, isFavorite, mounted };
}
