'use client';

import Link from 'next/link';

const footerLinks = {
  legal: [
    { name: 'Termos', href: '/termos' },
    { name: 'Privacidade', href: '/privacidade' },
    { name: 'Política LGPD', href: '/politicas-lgpd' },
    { name: 'Reembolso', href: '/reembolso' },
  ],
  support: [
    { name: 'Contato', href: '/contato' },
    { name: 'Documentação', href: '/docs' },
  ],
};

export default function Footer() {
  return (
    <footer className="py-12 md:py-16 border-t border-[color:var(--border)] bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted hover:text-[color:var(--brand-600)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Suporte</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted hover:text-[color:var(--brand-600)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[color:var(--border)] text-center text-sm text-ink-muted">
          <p>© {new Date().getFullYear()} MeJoy. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

