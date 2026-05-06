import { motion } from 'framer-motion';
import { LogOut, Menu, User, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import LogoWithName from '@/components/ui/LogoWithName';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/components/providers/TenantProvider';
import { getPrimaryCTA } from '@/lib/ctas';
import { isRootB2BDomain } from '@/lib/flags';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const tenant = useTenant();
  const router = useRouter();
  const [isRoot, setIsRoot] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    setIsRoot(isRootB2BDomain());
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  const linksB2C = [
    { name: 'Produtos', href: '/produtos' },
    { name: 'Check-up', href: '/protocolos' },
    { name: 'Como funciona', href: '/#como-funciona' },
    { name: 'FAQ', href: '/#faq' },
  ];
  
  const linksB2B = [
    { name: 'Produto', href: '/#produto' },
    { name: 'Como Funciona', href: '/#como-funciona' },
    { name: 'Casos', href: '/#cases' },
    { name: 'Recursos', href: '/#recursos' },
    { name: 'Planos', href: '/b2b/assinar' },
  ];

  const links = isRoot ? linksB2B : linksB2C;
  
  // CTAs condicionais
  const ctaB2C = getPrimaryCTA(tenant || { name: 'MeJoy' });
  const ctaB2B = { href: '/b2b/assinar', label: 'Assinar em 2 min' };
  const ctaSecondaryB2B = { href: '/b2b/sandbox', label: 'Ver demonstração' };
  
  const primaryCta = isRoot ? ctaB2B : ctaB2C;
  const showSecondaryCta = isRoot;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border h-16 transition-all duration-300 pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nome do Tenant (personalizável) */}
          <Link href="/" className="flex items-center">
            <LogoWithName size="small" priority />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <motion.div key={link.name} initial={false} whileHover={{ scale: 1.05 }}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    currentPath === link.href
                      ? 'text-brand'
                      : 'text-fg/70 hover:text-brand'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            {showSecondaryCta && (
              <a 
                href={ctaSecondaryB2B.href} 
                className="btn-ghost text-sm"
              >
                {ctaSecondaryB2B.label}
              </a>
            )}
            {!authLoading && (
              user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm font-medium text-fg/80 hover:text-brand transition-colors"
                  >
                    <User size={18} />
                    Meu painel
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-sm font-medium text-fg/80 hover:text-red-600 transition-colors"
                    aria-label="Sair"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-fg/80 hover:text-brand transition-colors"
                >
                  Entrar
                </Link>
              )
            )}
            <a 
              href={primaryCta.href} 
              className={isRoot ? "btn-brand" : "rounded-lg px-4 py-2 text-white text-sm font-medium hover:opacity-90 transition-opacity"}
              style={!isRoot ? { background: tenant?.primaryColor || 'var(--brand-primary, #10b981)' } : undefined}
            >
              {primaryCta.label}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-aurora-light hover:bg-aurora-light transition-colors border border-border"
            >
              {menuOpen ? <X size={20} className="text-fg" aria-hidden="true" /> : <Menu size={20} className="text-fg" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border bg-bg/90 backdrop-blur-md"
          >
            <div className="flex flex-col space-y-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium transition-colors duration-200 ${
                    currentPath === link.href
                      ? 'text-brand'
                      : 'text-fg/70 hover:text-brand'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {showSecondaryCta && (
                <a
                  href={ctaSecondaryB2B.href}
                  onClick={() => setMenuOpen(false)}
                  className="btn-ghost w-full text-center"
                >
                  {ctaSecondaryB2B.label}
                </a>
              )}
              {!authLoading && (
                user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 text-base font-medium text-fg/80 hover:text-brand"
                    >
                      <User size={20} />
                      Meu painel
                    </Link>
                    <button
                      type="button"
                      onClick={() => { signOut(); setMenuOpen(false); }}
                      className="flex items-center justify-center gap-2 py-3 text-base font-medium text-fg/80 hover:text-red-600 w-full"
                    >
                      <LogOut size={20} />
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="py-3 text-base font-medium text-fg/80 hover:text-brand"
                  >
                    Entrar
                  </Link>
                )
              )}
              <a
                href={primaryCta.href}
                onClick={() => setMenuOpen(false)}
                className={isRoot ? "btn-brand w-full text-center" : "rounded-lg px-4 py-3 text-white text-sm font-medium hover:opacity-90 transition-opacity w-full text-center"}
                style={!isRoot ? { background: tenant?.primaryColor || 'var(--brand-primary, #10b981)' } : undefined}
              >
                {primaryCta.label}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}