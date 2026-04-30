'use client';

import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}

