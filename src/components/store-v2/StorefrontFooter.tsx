import Link from 'next/link';
import { OBJECTIVES } from '@/lib/store-v2/slugs';

/** Todas as categorias Store V2 — single source of truth para footer e navegação */
const CATEGORIES = OBJECTIVES.map((o) => ({ name: o.name, href: `/c/${o.slug}` }));

const INSTITUCIONAL = [
  { name: 'Quem somos', href: '/quem-somos' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contato', href: '/contato' },
];

const LEGAL = [
  { name: 'Política de privacidade', href: '/privacidade' },
  { name: 'Política LGPD', href: '/politicas-lgpd' },
  { name: 'Termos de uso', href: '/termos' },
  { name: 'Política de reembolso', href: '/reembolso' },
  { name: 'Aviso legal', href: '/disclaimer' },
  { name: 'Dados fiscais', href: '/dados-fiscais' },
];

export default function StorefrontFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-4">Categorias</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-brand-400 transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Populares</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 4).map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="hover:text-brand-400 transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Institucional</h3>
            <ul className="space-y-2">
              {INSTITUCIONAL.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="hover:text-brand-400 transition-colors">
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand-400 transition-colors">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Frete por região</h3>
            <p className="text-sm">
              Sudeste/Sul: grátis acima de R$ 190<br />
              Centro-Oeste: acima de R$ 240<br />
              Norte/Nordeste: acima de R$ 349
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 space-y-4">
          <p className="text-xs text-gray-400 max-w-2xl">
            Farmácia de manipulação autorizada pela ANVISA. Imagens meramente ilustrativas. Os resultados variam de pessoa para pessoa. Consulte um profissional de saúde antes do uso.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {currentYear} Me Joy. Farmácia de manipulação online.
            </p>
            <div className="flex gap-6">
            <Link href="/faq" className="text-sm hover:text-brand-400 transition-colors">Dúvidas</Link>
            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || process.env.NEXT_PUBLIC_WHATSAPP_CTA || '554797789479').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-brand-400 transition-colors"
            >
              WhatsApp
            </a>
            <Link href="/contato" className="text-sm hover:text-brand-400 transition-colors">Contato</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
