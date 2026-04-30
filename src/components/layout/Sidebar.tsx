'use client';

import {
  Home,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package,
  CreditCard,
  Stethoscope,
  MessageCircle,
  Target,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const { signOut } = useAuth();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home size={22} /> },
    { name: 'Check-up', href: '/protocolos', icon: <Stethoscope size={22} /> },
    { name: 'Relatórios', href: '/relatorios', icon: <FileText size={22} /> },
    { name: 'Produtos', href: '/produtos', icon: <Package size={22} /> },
    { name: 'Plano de Vida', href: '/plano-vida', icon: <Target size={22} /> },
    { name: 'Minha Assinatura', href: '/assinatura', icon: <CreditCard size={22} /> },
    { name: 'Conversa com Médico', href: '/chat', icon: <MessageCircle size={22} /> },
    { name: 'Configurações', href: '/settings/profile', icon: <Settings size={22} /> },
    { name: 'Perfil', href: '/perfil', icon: <User size={22} /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 ${
        isExpanded ? 'w-64' : 'w-20'
      } bg-background/95 backdrop-blur-sm border-r border-border hidden md:flex flex-col justify-between transition-all duration-300`}
    >
      <div>
        {/* Logo e botão */}
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="flex items-center shrink-0">
            <img
              src={isExpanded ? '/logosmejoy/logomejoy.png' : '/logosmejoy/faviconmejoy.png'}
              alt="Me Joy Farma"
              className={`transition-all object-contain hover:opacity-80 ${
                isExpanded ? 'h-9 w-auto max-w-[140px]' : 'h-9 w-9'
              }`}
            />
          </Link>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Recolher menu' : 'Expandir menu'}
            className="text-foreground hover:text-brand-600 transition"
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 px-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center ${
                  isExpanded ? 'justify-start' : 'justify-center'
                } gap-3 px-3 py-2 rounded-lg ${
                  isActive ? 'bg-brand-600 text-white' : 'text-muted-foreground'
                } hover:bg-brand-600 hover:text-white transition`}
              >
                {link.icon}
                {isExpanded && (
                  <span className="text-sm lg:text-base font-medium">
                    {link.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sair */}
      <div className="flex flex-col gap-2 px-2 mb-4">
        <button
          type="button"
          onClick={() => signOut()}
          className={`flex items-center ${
            isExpanded ? 'justify-start' : 'justify-center'
          } gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-brand-600 hover:text-white transition w-full`}
          aria-label="Sair"
        >
          <LogOut size={22} />
          {isExpanded && (
            <span className="text-sm lg:text-base font-medium">Sair</span>
          )}
        </button>
      </div>
    </aside>
  );
}