import { useRouter } from 'next/router';

export function FooterZapfarm() {
  const router = useRouter();
  const whatsapp =
    process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ||
    process.env.NEXT_PUBLIC_WHATSAPP_CTA ||
    '554797789479';
  const whatsappDisplay = whatsapp.replace(/^55/, '+55 ').replace(/(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contato@mejoy.com.br';
  const asPath = router.asPath?.split('?')[0] || '';
  const isLandingPage = router.pathname === '/emagrecimento' || asPath === '/emagrecimento';
  const lpBasePath = isLandingPage ? '/emagrecimento' : '';
  const links = isLandingPage
    ? [
        { label: 'Programa', href: `${lpBasePath}#programa` },
        { label: 'Tratamentos', href: `${lpBasePath}#tratamentos` },
        { label: 'Resultados', href: `${lpBasePath}#depoimentos` },
        { label: 'FAQ', href: `${lpBasePath}#faq` },
      ]
    : [
        { label: 'Programa', href: '/#programa' },
        { label: 'Como funciona', href: '/#como-funciona' },
        { label: 'Planos', href: '/#planos' },
        { label: 'Depoimentos', href: '/#depoimentos' },
        { label: 'FAQ', href: '/#faq' },
      ];

  return (
    <footer className="bg-slate-950 text-white py-8 sm:py-10 md:py-12" data-home-section="footer">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-black mb-3 sm:mb-4 text-white tracking-[0.18em]">
              MeJoy
            </h3>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Me amo. Me cuido!</p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Programa de emagrecimento com avaliação médica, acompanhamento contínuo e suporte oficial pelo WhatsApp.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
              <li><a href="/contato" className="hover:text-white transition-colors">Contato</a></li>
              <li><a href="/dados-fiscais" className="hover:text-white transition-colors">Dados fiscais</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li><a href="/termos" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="/politicas-lgpd" className="hover:text-white transition-colors">Política LGPD</a></li>
              <li><a href="/reembolso" className="hover:text-white transition-colors">Política de Reembolso</a></li>
              <li><a href="/disclaimer" className="hover:text-white transition-colors">Aviso Legal</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Contato</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="break-words">WhatsApp: {whatsappDisplay}</li>
              <li className="break-words">Email: {supportEmail}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-400">
          <p>© 2026 MeJoy. Todos os direitos reservados.</p>
          <p className="mt-2">Avaliação médica obrigatória antes de qualquer prescrição. Telemedicina e privacidade tratadas conforme a legislação aplicável.</p>
        </div>
      </div>
    </footer>
  );
}
