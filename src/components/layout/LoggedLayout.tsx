'use client';

import { ReactNode } from 'react';

import MobileLayout from './MobileLayout';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

import { useResponsive } from '@/hooks/useResponsive';

export default function LoggedLayout({ children }: { children: ReactNode }) {
  const { isMobile } = useResponsive();
  
  // Layout mobile nativo com top + bottom bars
  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }
  
  // Layout desktop/tablet existente
  return (
    <div className="min-h-screen bg-aurora-dark text-foreground">
      {/* Navbar fixa no topo */}
      <Navbar />

      <div className="flex">
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {/* Conteúdo principal */}
        <main 
          className="flex-1 pt-16 pb-20 lg:ml-64 px-4 sm:px-6 lg:px-8"
          role="main"
          aria-label="Conteúdo principal"
        >
          {children}
        </main>
      </div>
    </div>
  );
}