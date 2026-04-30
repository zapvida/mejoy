'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { User, Heart, ShoppingCart, Menu, X, ChevronDown, Search } from 'lucide-react';
import LogoWithName from '@/components/ui/LogoWithName';
import HeaderSearch from '@/components/store-v2/HeaderSearch';
import { useCartCount } from '@/hooks/useCartCount';
import { useFavorites } from '@/hooks/useFavorites';

const WHATSAPP_CTA = process.env.NEXT_PUBLIC_WHATSAPP_CTA ?? 'https://wa.me/5511999999999?text=Quero%20manipular%20minha%20receita';

type CategoryItem = {
  name: string;
  href: string;
  subs: { name: string; href: string }[];
};

const CATEGORIES: CategoryItem[] = [
  { name: 'Sono', href: '/c/sono', subs: [{ name: 'Ansiedade & Humor', href: '/c/ansiedade-humor' }] },
  {
    name: 'Saúde',
    href: '/c/saude',
    subs: [
      { name: 'Imunidade', href: '/c/imunidade' },
      { name: 'Energia & Performance', href: '/c/energia-performance' },
      { name: 'Articulações', href: '/c/articulacoes' },
      { name: 'Detox & Fígado', href: '/c/detox-figado' },
      { name: 'Hormonal & Libido', href: '/c/hormonal-libido' },
      { name: 'Menopausa & TPM', href: '/c/menopausa-tpm' },
      { name: 'Lipedema', href: '/c/lipedema' },
    ],
  },
  { name: 'Emagrecimento', href: '/c/emagrecimento-metabolismo', subs: [] },
  {
    name: 'Cabelo',
    href: '/c/cabelo',
    subs: [{ name: 'Pele & Beleza', href: '/c/pele-beleza' }],
  },
  { name: 'Intestino', href: '/c/intestino', subs: [] },
];

function NavItemDesktop({
  item,
  index,
  openIndex,
  onOpen,
  onClose,
}: {
  item: CategoryItem;
  index: number;
  openIndex: number | null;
  onOpen: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = openIndex === index;

  useEffect(() => {
    function handleClickOutside(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [onClose]);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => onClose(), 120);
  }, [onClose]);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    onOpen(index);
  }, [index, onOpen]);

  const hasSubs = item.subs.length > 0;

  return (
    <div ref={ref} className="relative" onMouseEnter={hasSubs ? handleMouseEnter : undefined} onMouseLeave={hasSubs ? handleMouseLeave : undefined}>
      {hasSubs ? (
        <div className="flex items-center gap-0.5 py-2 px-1 whitespace-nowrap">
          <Link
            href={item.href}
            className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
            onClick={onClose}
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => onOpen(open ? -1 : index)}
            className="inline-flex items-center text-gray-700 hover:text-orange-600 transition-colors"
            aria-label={`Abrir submenu ${item.name}`}
            aria-expanded={open}
            aria-haspopup="true"
          >
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      ) : (
        <Link
          href={item.href}
          className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors py-2 px-1 block whitespace-nowrap"
        >
          {item.name}
        </Link>
      )}
      {hasSubs && open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 min-w-[200px] z-[1001] pointer-events-auto"
        >
          <div className="rounded-xl bg-white shadow-xl border border-gray-100 py-2 overflow-hidden">
            <Link
              href={item.href}
              className="block px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              onClick={onClose}
            >
              Ver todos em {item.name}
            </Link>
            {item.subs.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                onClick={onClose}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavItemMobile({ item, onNavigate }: { item: CategoryItem; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasSubs = item.subs.length > 0;

  return (
    <div className="border-b border-gray-100 last:border-0">
      {hasSubs ? (
        <>
          <div className="flex items-center justify-between gap-2 py-3">
            <Link href={item.href} className="text-gray-700 font-medium" onClick={onNavigate}>
              {item.name}
            </Link>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-gray-700"
              aria-label={`Abrir submenu ${item.name}`}
              aria-expanded={expanded}
            >
              <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {expanded && (
            <div className="pb-2 pl-2 space-y-1">
              <Link href={item.href} className="block py-2 text-sm text-brand font-medium" onClick={onNavigate}>
                Ver todos em {item.name}
              </Link>
              {item.subs.map((sub) => (
                <Link key={sub.href} href={sub.href} className="block py-2 text-sm text-gray-600" onClick={onNavigate}>
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link href={item.href} className="block py-3 text-gray-700 font-medium" onClick={onNavigate}>
          {item.name}
        </Link>
      )}
    </div>
  );
}

export default function StorefrontHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cartCount = useCartCount();
  const { slugs: favoriteSlugs, mounted: favoritesMounted } = useFavorites();
  const favoriteCount = favoritesMounted ? favoriteSlugs.length : 0;

  const handleNavOpen = useCallback((index: number) => {
    setOpenIndex(index >= 0 ? index : null);
  }, []);
  const handleNavClose = useCallback(() => setOpenIndex(null), []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Linha 1: Logo | Busca (centralizada) | Ícones */}
        <div className="flex items-center justify-between gap-6 h-14">
          <Link href="/" className="flex items-center shrink-0">
            <LogoWithName
              size="header"
              priority
              tagline="Me Cuido, Me Amo!"
              taglineBelow
              taglineContent={
                <>
                  <span style={{ color: '#000' }}>Me Cuido, </span>
                  <span style={{ color: 'hsl(24, 95%, 47%)' }}>Me Amo!</span>
                </>
              }
            />
          </Link>

          <div className="flex-1 flex justify-center min-w-0 px-4">
            <HeaderSearch />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/produtos"
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-brand transition-colors"
              aria-label="Buscar produtos"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:flex p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-brand transition-colors"
              aria-label="Minha conta"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/favoritos"
              className="hidden sm:flex p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-brand transition-colors relative"
              aria-label={favoriteCount > 0 ? `Favoritos (${favoriteCount} itens)` : 'Favoritos'}
            >
              <Heart className="w-5 h-5" />
              {favoriteCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] flex items-center justify-center rounded-full bg-red-500 text-white text-[0.65rem] font-bold leading-none"
                  aria-hidden
                >
                  {favoriteCount > 99 ? '99+' : favoriteCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="flex p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-orange-600 transition-colors relative"
              aria-label={cartCount > 0 ? `Carrinho (${cartCount} itens)` : 'Carrinho'}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] flex items-center justify-center rounded-full bg-orange-500 text-white text-[0.65rem] font-bold leading-none"
                  aria-hidden
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <a
              href={WHATSAPP_CTA}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-600 transition-colors"
            >
              Manipule sua receita
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Linha 2: Nichos centralizados e simétricos */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 py-1.5 border-t border-gray-100">
          {CATEGORIES.map((item, i) => (
            <NavItemDesktop
              key={item.href}
              item={item}
              index={i}
              openIndex={openIndex}
              onOpen={handleNavOpen}
              onClose={handleNavClose}
            />
          ))}
        </nav>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col">
              <Link href="/produtos" className="py-3 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                Buscar produtos
              </Link>
              <Link href="/favoritos" className="py-3 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                Favoritos{favoriteCount > 0 ? ` (${favoriteCount})` : ''}
              </Link>
              {CATEGORIES.map((item) => (
                <NavItemMobile key={item.href} item={item} onNavigate={() => setMenuOpen(false)} />
              ))}
              <a
                href={WHATSAPP_CTA}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 py-3 text-brand font-medium"
              >
                Manipule sua receita
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
