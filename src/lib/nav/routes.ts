import { Home, ClipboardList, FileText, User, Package, CreditCard, Stethoscope, MessageCircle, Settings } from "lucide-react";

export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME ?? "Me Joy";

export type NavItem = {
  key: "dashboard" | "protocolos" | "relatorios" | "perfil" | "produtos" | "assinatura" | "plano-vida" | "chat" | "configuracoes";
  name: string;
  href: string;
  icon: any; // lucide icon
  testId: string;
};

// Rotas principais com fallbacks (check-up = protocolos)
export const ROUTES = {
  dashboard: ['/dashboard', '/'],
  protocolos: ['/protocolos', '/triagem'],
  relatorios: ['/relatorios'],
  perfil: ['/perfil'],
  produtos: ['/produtos'],
  assinatura: ['/assinatura', '/billing'],
  'plano-vida': ['/plano-vida'],
  chat: ['/chat'],
  configuracoes: ['/settings/profile', '/configuracoes'],
} as const;

// Configuração dos itens de navegação (sidebar completo)
export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard",  name: "Dashboard",  href: "/dashboard",             icon: Home,          testId: "nav-dashboard" },
  { key: "protocolos", name: "Check-up",   href: "/protocolos",            icon: Stethoscope,  testId: "nav-protocolos" },
  { key: "relatorios", name: "Relatórios", href: "/relatorios",            icon: FileText,     testId: "nav-relatorios" },
  { key: "produtos",   name: "Produtos",   href: "/produtos",              icon: Package,     testId: "nav-produtos" },
  { key: "plano-vida", name: "Plano de Vida", href: "/plano-vida",         icon: ClipboardList, testId: "nav-plano-vida" },
  { key: "assinatura", name: "Minha Assinatura", href: "/assinatura",     icon: CreditCard,  testId: "nav-assinatura" },
  { key: "chat",      name: "Conversa com Médico", href: "/chat",          icon: MessageCircle, testId: "nav-chat" },
  { key: "configuracoes", name: "Configurações", href: "/settings/profile", icon: Settings,  testId: "nav-configuracoes" },
  { key: "perfil",    name: "Perfil",     href: "/perfil",                 icon: User,         testId: "nav-perfil" },
];

// Função para resolver a rota correta baseada nas páginas existentes
export function resolveRoute(key: keyof typeof ROUTES, existing: string[] = []): string {
  const possibleRoutes = ROUTES[key];
  
  // Verifica se alguma das rotas possíveis existe
  for (const path of possibleRoutes) {
    if (existing.includes(path)) return path;
  }
  
  // Fallback para a primeira rota
  return possibleRoutes[0];
}

// Função para verificar se uma rota está ativa
export function isRouteActive(currentPath: string, navKey: keyof typeof ROUTES): boolean {
  const routes = ROUTES[navKey];
  return routes.some(route => 
    currentPath === route || 
    currentPath.startsWith(`${route}/`)
  );
}

// Configurações de haptics
export const HAPTIC_CONFIG = {
  enabled: typeof navigator !== 'undefined' && 'vibrate' in navigator,
  duration: 50, // ms
  pattern: [50] // padrão de vibração
};

// páginas nas quais a bottom bar NÃO aparece
export const MOBILE_TAB_HIDE_PATHS = [
  /\/checkout/i, 
  /\/billing\/portal/i, 
  /\/api\//i, 
  /\/auth\//i,
  /\/assinatura/i,
  /\/presente/i,
  /\/obrigado/i
];

export const MOBILE_TAB_HIDE_QUERY = (q: URLSearchParams) => q.get("print") === "true";
