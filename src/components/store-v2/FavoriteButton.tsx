'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  slug: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function FavoriteButton({ slug, className = '', size = 'md' }: FavoriteButtonProps) {
  const { toggle, isFavorite, mounted } = useFavorites();

  if (!mounted) return null;

  const isFav = isFavorite(slug);
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isFav
          ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      } ${className}`}
      aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart className={`${iconSize} ${isFav ? 'fill-current' : ''}`} />
    </button>
  );
}
