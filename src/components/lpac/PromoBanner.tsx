'use client';

import React from 'react';

export default function PromoBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl px-4 py-3 mx-auto max-w-4xl">
      <div className="flex items-center justify-center gap-3 text-white">
        <div className="w-2 h-2 bg-brand-200 rounded-full"></div>
        <span className="text-sm font-medium">
          Presente de Me Joy Suplementos e ZapVida Telemedicina
        </span>
        <span className="text-lg">🎁</span>
      </div>
    </div>
  );
}
