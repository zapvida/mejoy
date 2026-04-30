'use client';

import { Home, ClipboardList, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function BottomMenu() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home /> },
    { name: 'Triagens', href: '/triagem', icon: <ClipboardList /> },
    { name: 'Relatórios', href: '/relatorios', icon: <FileText /> },
    { name: 'Perfil', href: '/perfil', icon: <User /> },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-black/90 border-t border-white/10 backdrop-blur md:hidden flex items-center">
      <div className="flex justify-around items-center w-full px-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 ${
                isActive ? 'text-brand' : 'text-white/70'
              } hover:text-brand transition`}
            >
              {React.cloneElement(link.icon, { size: 20 })}
              <span className="text-[11px]">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}