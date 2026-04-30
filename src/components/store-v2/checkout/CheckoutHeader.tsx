'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import LogoWithName from '@/components/ui/LogoWithName';

export default function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <LogoWithName size="header" />
        </Link>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Lock className="w-4 h-4 shrink-0" aria-hidden />
          <span>Ambiente seguro</span>
        </div>
      </div>
    </header>
  );
}
