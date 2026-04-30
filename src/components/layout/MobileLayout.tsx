"use client";
import { ReactNode } from "react";

import MobileTabBar from "@/components/mobile/MobileTabBar";
import MobileTopBar from "@/components/mobile/MobileTopBar";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className={`min-h-screen bg-aurora-dark text-white md:hidden`}>
      <MobileTopBar />
      
      <main 
        className="mobile-main pt-16 px-4 pb-[calc(64px+env(safe-area-inset-bottom))]"
        role="main"
        aria-label="Conteúdo principal"
      >
        {children}
      </main>
      
      <MobileTabBar />
    </div>
  );
}
