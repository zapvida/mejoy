"use client";
import { Home, ClipboardList, FileText, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useHapticFeedback, useDeviceCapabilities } from "@/hooks/useHapticFeedback";
import { trackNavClick, trackBottomTabImpressionOnce } from "@/lib/analytics/nav";
import { resolveRoute, MOBILE_TAB_HIDE_PATHS, MOBILE_TAB_HIDE_QUERY } from "@/lib/nav/routes";


export default function MobileTabBar() {
  const router = useRouter();
  const pathname = router.asPath || router.pathname;
  const search = typeof window !== "undefined" ? new URLSearchParams(location.search) : new URLSearchParams();
  const [pressedTab, setPressedTab] = useState<string | null>(null);
  const { trigger: hapticTrigger } = useHapticFeedback();
  const { haptic, touch } = useDeviceCapabilities();

  const hide = MOBILE_TAB_HIDE_PATHS.some((re) => re.test(pathname)) || MOBILE_TAB_HIDE_QUERY(search);
  
  useEffect(() => { 
    if (!hide) trackBottomTabImpressionOnce(); 
  }, [hide]);

  if (hide) return null;

  const isActive = (href: string) => pathname.startsWith(href);

  const links = [
    { name: 'Dashboard', href: resolveRoute('dashboard', ['/','/dashboard']), icon: Home },
    { name: 'Check-up',  href: resolveRoute('protocolos', ['/protocolos','/triagem']), icon: ClipboardList },
    { name: 'Relatórios', href: resolveRoute('relatorios', ['/relatorios']), icon: FileText },
    { name: 'Perfil',    href: resolveRoute('perfil', ['/perfil']), icon: User },
  ];

  const handleTabPress = (name: string) => {
    if (touch) {
      setPressedTab(name);
      if (haptic) {
        hapticTrigger('light');
      }
    }
  };

  const handleTabRelease = () => {
    setPressedTab(null);
  };

  const handleTabClick = (name: string, _href: string, active: boolean) => {
    // Haptic feedback diferenciado por ação
    if (haptic && !active) {
      hapticTrigger('light');
    }
    
    // Analytics
    trackNavClick("bottom", name.toLowerCase());
  };

  return (
    <nav 
      role="navigation" 
      aria-label="Navegação inferior"
      className="fixed bottom-0 inset-x-0 z-50 bg-black/95 backdrop-blur-md border-t border-white/10 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center px-2 py-2">
        {links.map(({ name, href, icon: Icon }) => {
          const active = isActive(href);
          const isPressed = pressedTab === name;
          
          return (
            <Link
              key={name}
              href={href}
              prefetch
              data-testid={`tab-${name.toLowerCase()}`}
              aria-current={active ? "page" : undefined}
              onClick={() => handleTabClick(name, href, active)}
              onMouseDown={() => handleTabPress(name)}
              onMouseUp={handleTabRelease}
              onMouseLeave={handleTabRelease}
              onTouchStart={() => handleTabPress(name)}
              onTouchEnd={handleTabRelease}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] ${
                active 
                  ? "bg-gradient-to-r from-brand to-brand-600 text-white shadow-lg" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              } ${
                isPressed ? 'scale-95 opacity-80' : ''
              } focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-black`}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="text-[11px] font-medium">{name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
