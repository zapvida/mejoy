import Link from 'next/link';

import LogoWithName from '@/components/ui/LogoWithName';

export default function Footer() {
  return (
    <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <LogoWithName size="small" variant="inverse" className="mb-4" />
            <p className="text-white/70 mb-4 max-w-md">
              MeJoy - Transformando a saúde através da inteligência artificial. 
              Relatórios personalizados baseados em evidências científicas.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li><Link href="/triagem" className="text-white/70 hover:text-brand transition-colors">Triagem</Link></li>
              <li><Link href="/quem-somos" className="text-white/70 hover:text-brand transition-colors">Sobre</Link></li>
              <li><Link href="/faq" className="text-white/70 hover:text-brand transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/politicas-lgpd" className="text-white/70 hover:text-brand transition-colors">Política LGPD</Link></li>
              <li><Link href="/privacidade" className="text-white/70 hover:text-brand transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/termos" className="text-white/70 hover:text-brand transition-colors">Termos de Uso</Link></li>
              <li><Link href="/reembolso" className="text-white/70 hover:text-brand transition-colors">Política de Reembolso</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      // Limpar cookies de consentimento para forçar banner aparecer novamente
                      document.cookie = 'zapfarm_cookie_consent=; Max-Age=0; path=/;';
                      document.cookie = 'cookie_policy_version=; Max-Age=0; path=/;';
                      window.location.reload();
                    }
                  }}
                  className="text-white/70 hover:text-brand transition-colors text-left"
                >
                  Gerenciar Cookies
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Banner Institucional */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="bg-gradient-to-r from-brand/10 to-brand/5 border border-brand/20 rounded-xl p-6 mb-6">
            <p className="text-white/90 text-center leading-relaxed">
              <strong>MeJoy é oferecido gratuitamente pela MeJoy e pela ZapVida</strong><br />
              Bem-estar e educação em saúde • LGPD • Política de reembolso por SLA
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-white/50">
              © 2025 MeJoy. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
