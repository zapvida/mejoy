"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import LogoWithName from "@/components/ui/LogoWithName";
import { useHapticFeedback, useDeviceCapabilities } from "@/hooks/useHapticFeedback";
import { trackMobileMenuOpen } from "@/lib/analytics/nav";
import { BRAND_NAME, resolveRoute } from "@/lib/nav/routes";

interface MobileTopBarProps {
  onOpenMenu?: () => void;
  title?: string;
}

export default function MobileTopBar({ onOpenMenu, title }: MobileTopBarProps) {
  const [isMenuPressed, setIsMenuPressed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { trigger: hapticTrigger } = useHapticFeedback();
  const { haptic, touch } = useDeviceCapabilities();

  const handleMenuClick = () => {
    if (haptic) {
      hapticTrigger('medium');
    }
    trackMobileMenuOpen();
    setIsDrawerOpen(true);
    onOpenMenu?.();
  };

  const handleMenuPress = () => {
    if (touch) {
      setIsMenuPressed(true);
      if (haptic) {
        hapticTrigger('light');
      }
    }
  };

  const handleMenuRelease = () => {
    setIsMenuPressed(false);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleNavClick = (_href: string) => {
    if (haptic) {
      hapticTrigger('light');
    }
    setIsDrawerOpen(false);
  };

  const links = [
    { name: 'Dashboard', href: resolveRoute('dashboard', ['/','/dashboard']) },
    { name: 'Check-up', href: resolveRoute('protocolos', ['/protocolos','/triagem']) },
    { name: 'Relatórios', href: resolveRoute('relatorios', ['/relatorios']) },
    { name: 'Produtos', href: '/produtos' },
    { name: 'Plano de Vida', href: '/plano-vida' },
    { name: 'Minha Assinatura', href: '/assinatura' },
    { name: 'Conversa com Médico', href: '/chat' },
    { name: 'Configurações', href: '/settings/profile' },
    { name: 'Perfil', href: resolveRoute('perfil', ['/perfil']) },
  ];

  return (
    <>
      <header 
        role="navigation"
        aria-label="Navegação principal"
        className="fixed top-0 inset-x-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 pt-[env(safe-area-inset-top)] md:hidden"
      >
        <div className="flex items-center justify-between px-4 h-16">
          <Link 
            href="/" 
            className="flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-black"
            aria-label={`${BRAND_NAME} - Início`}
          >
            <LogoWithName size="small" variant="inverse" className="shrink-0 translate-y-px" />
            {title && title !== BRAND_NAME ? (
              <span className="min-w-0 truncate rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/82">
                {title}
              </span>
            ) : null}
          </Link>
          
          <button
            aria-label="Abrir menu"
            onClick={handleMenuClick}
            onMouseDown={handleMenuPress}
            onMouseUp={handleMenuRelease}
            onMouseLeave={handleMenuRelease}
            onTouchStart={handleMenuPress}
            onTouchEnd={handleMenuRelease}
            className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 min-h-[44px] min-w-[44px] ${
              isMenuPressed ? 'scale-95 opacity-80' : ''
            } focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-black`}
          >
            <Menu className="text-white" size={22} />
          </button>
        </div>
      </header>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleDrawerClose}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-md border-l border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <button
                onClick={handleDrawerClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Fechar menu"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-2">
              {links.map(({ name, href }) => (
                <Link
                  key={name}
                  href={href}
                  onClick={() => handleNavClick(href)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-black"
                >
                  <span className="font-medium">{name}</span>
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <div className="flex justify-center">
                <LogoWithName size="small" variant="inverse" className="translate-y-px opacity-80" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
