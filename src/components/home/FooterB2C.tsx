'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, MessageCircle, Instagram, Facebook, Linkedin, Shield, Lock, Award, FileText, HelpCircle, Package, Users, Heart } from 'lucide-react';
import LogoWithName from '@/components/ui/LogoWithName';

const CONTACT_WHATSAPP = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '554797789479';

const footerSections = {
  produtos: {
    title: 'Produtos',
    links: [
      { name: 'Todos os produtos', href: '/produtos' },
      { name: '33 Fórmulas (transparência)', href: '/formulas' },
      { name: 'Emagrecimento', href: '/emagrecimento' },
      { name: 'Sono', href: '/sono' },
      { name: 'Calvície', href: '/calvicie' },
      { name: 'Check-up gratuito', href: '/protocolos' },
    ],
  },
  sobre: {
    title: 'Sobre',
    links: [
      { name: 'Quem somos', href: '/quem-somos' },
      { name: 'Nossa missão', href: '/quem-somos#missao' },
      { name: 'Equipe médica', href: '/quem-somos#equipe' },
      { name: 'Parceiros', href: '/parceiros' },
      { name: 'Fluxos', href: '/fluxos' },
      { name: 'Blog', href: '/emagrecimento/blog' },
    ],
  },
  suporte: {
    title: 'Suporte',
    links: [
      { name: 'Central de ajuda', href: '/faq' },
      { name: 'Como funciona', href: '/#como-funciona' },
      { name: 'Trocas e devoluções', href: '/reembolso' },
      { name: 'Fale conosco', href: `https://wa.me/${CONTACT_WHATSAPP}` },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { name: 'Termos de uso', href: '/termos' },
      { name: 'Política de privacidade', href: '/privacidade' },
      { name: 'Política LGPD', href: '/politicas-lgpd' },
      { name: 'Política de reembolso', href: '/reembolso' },
      { name: 'Aviso legal', href: '/disclaimer' },
      { name: 'Telemedicina', href: '/telemedicina' },
      { name: 'Uso de IA', href: '/uso-ia' },
      { name: 'Dados fiscais', href: '/dados-fiscais' },
    ],
  },
};

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contato@mejoy.com.br';

const contactInfo = {
  whatsapp: { label: 'WhatsApp', value: '(47) 99900-9923', href: `https://wa.me/${CONTACT_WHATSAPP}`, icon: MessageCircle },
  email: { label: 'E-mail', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  telefone: { label: 'Telefone', value: '(47) 3333-4444', href: 'tel:+554733334444', icon: Phone },
  endereco: { label: 'Endereço', value: 'Rua Exemplo, 123 - Centro\nFlorianópolis, SC - CEP 88010-000', icon: MapPin },
};

const socialLinks = [
  { name: 'Instagram', href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/mejoy', icon: Instagram },
  { name: 'Facebook', href: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/mejoy', icon: Facebook },
  { name: 'LinkedIn', href: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/mejoy', icon: Linkedin },
];

const certifications = [
  { name: 'LGPD', icon: Shield, desc: 'Conformidade com LGPD' },
  { name: 'Stripe', icon: Lock, desc: 'Pagamento seguro' },
  { name: 'ANVISA', icon: Award, desc: 'Produtos regulamentados' },
];

export default function FooterB2C() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700/50">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Top Section: Logo + Description + Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Logo e Descrição */}
          <div className="lg:col-span-4">
            <div className="mb-4">
              <LogoWithName size="medium" variant="inverse" nameClassName="text-white" />
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              Protocolos de saúde com curadoria médica. Produtos selecionados por especialistas para você cuidar da sua saúde em casa.
            </p>
            
            {/* Redes Sociais */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-brand flex items-center justify-center transition-colors group"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links em Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
                  {section.title === 'Produtos' && <Package className="w-4 h-4" />}
                  {section.title === 'Sobre' && <Users className="w-4 h-4" />}
                  {section.title === 'Suporte' && <HelpCircle className="w-4 h-4" />}
                  {section.title === 'Legal' && <FileText className="w-4 h-4" />}
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white text-sm transition-colors inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="border-t border-gray-700/50 pt-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* WhatsApp */}
            <a
              href={contactInfo.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand/30 transition-colors">
                <MessageCircle className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{contactInfo.whatsapp.label}</p>
                <p className="text-white font-semibold text-sm">{contactInfo.whatsapp.value}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={contactInfo.email.href}
              className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30 transition-colors">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{contactInfo.email.label}</p>
                <p className="text-white font-semibold text-sm break-all">{contactInfo.email.value}</p>
              </div>
            </a>

            {/* Telefone */}
            <a
              href={contactInfo.telefone.href}
              className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{contactInfo.telefone.label}</p>
                <p className="text-white font-semibold text-sm">{contactInfo.telefone.value}</p>
              </div>
            </a>

            {/* Endereço */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/50">
              <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{contactInfo.endereco.label}</p>
                <p className="text-white font-semibold text-sm whitespace-pre-line leading-relaxed">{contactInfo.endereco.value}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificações e Selos */}
        <div className="border-t border-gray-700/50 pt-8 mb-8">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Segurança e Conformidade
          </h3>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <div
                  key={cert.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50"
                >
                  <Icon className="w-5 h-5 text-brand-400" />
                  <div>
                    <p className="text-white font-semibold text-xs">{cert.name}</p>
                    <p className="text-gray-400 text-[10px]">{cert.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Newsletter (Opcional) */}
        <div className="border-t border-gray-700/50 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Receba novidades e ofertas
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Cadastre-se e receba informações sobre novos protocolos e promoções exclusivas.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-600 transition-colors text-sm whitespace-nowrap"
              >
                Cadastrar
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <p>© {new Date().getFullYear()} MeJoy. Todos os direitos reservados.</p>
              <span className="hidden sm:inline">•</span>
              <p>CNPJ: 12.345.678/0001-90</p>
              <span className="hidden sm:inline">•</span>
              <Link href="/politicas-lgpd" className="hover:text-white transition-colors">
                LGPD
              </Link>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Feito com cuidado para sua saúde</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
