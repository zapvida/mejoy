import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LogoWithName from '@/components/ui/LogoWithName';

interface EmagrecimentoLayoutProps {
  children: React.ReactNode;
  showStickyCta?: boolean;
}

export function EmagrecimentoLayout({ children, showStickyCta = false }: EmagrecimentoLayoutProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [router.asPath]);

  const navLinks = [
    { href: '/emagrecimento/como-funciona', label: 'Como funciona' },
    { href: '/emagrecimento/tratamentos', label: 'Tratamentos' },
    { href: '/emagrecimento/especialistas', label: 'Especialistas' },
    { href: '/emagrecimento/resultados', label: 'Resultados' },
    { href: '/emagrecimento/blog', label: 'Blog' },
  ];

  const textColor = scrolled ? 'text-emerald-700' : 'text-white';
  const logoVariant = scrolled ? 'primary' : 'inverse';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 sm:h-16 md:h-20">
            <Link href="/emagrecimento" className="flex items-center shrink-0">
              <LogoWithName
                size="header"
                variant={logoVariant}
                priority
                className="translate-y-px"
              />
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:opacity-80 ${textColor}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button - Desktop */}
            <Link
              href="/triagem/emagrecimento"
              prefetch={false}
              className={`hidden md:inline-block rounded-full px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-bold transition-all hover:scale-105 ${
                scrolled
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lg'
                  : 'bg-white text-emerald-700 shadow-xl'
              }`}
            >
              Começar avaliação
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${textColor}`}
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
            <nav className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-base font-medium text-gray-900 hover:text-emerald-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/triagem/emagrecimento"
                prefetch={false}
                className="inline-flex items-center justify-center mt-4 py-3 px-6 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-bold transition-all hover:scale-105"
              >
                Começar avaliação
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20 sm:pt-16 md:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">MeJoy</h3>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Me amo. Me cuido!</p>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Emagrecimento com acompanhamento médico especializado e medicação sob prescrição.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Links</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="/emagrecimento" className="hover:text-white transition-colors">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="/emagrecimento/como-funciona" className="hover:text-white transition-colors">
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link href="/emagrecimento/tratamentos" className="hover:text-white transition-colors">
                    Tratamentos
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="/termos" className="hover:text-white transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="hover:text-white transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Contato</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li className="break-words">WhatsApp: (11) 99999-9999</li>
                <li className="break-words">Email: contato@mejoy.com.br</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>© 2025 MeJoy. Todos os direitos reservados.</p>
            <p className="mt-2">Tratamento sob prescrição médica. Siga as normas da ANVISA.</p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA bar for mobile */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-emerald-600 to-emerald-800 p-3.5 sm:p-4 shadow-2xl md:hidden">
          <Link
            href="/triagem/emagrecimento"
            prefetch={false}
            className="inline-flex items-center justify-center w-full rounded-full bg-white text-emerald-700 font-bold py-2.5 sm:py-3 px-4 sm:px-6 hover:bg-emerald-50 transition-colors text-sm sm:text-base"
          >
            Fazer minha triagem agora →
          </Link>
        </div>
      )}
    </div>
  );
}
