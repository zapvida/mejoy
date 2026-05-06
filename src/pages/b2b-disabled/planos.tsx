'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { redirectToStripeCheckout } from '@/utils/stripeCheckout';

export default function PlanosPage() {
  const [periodo, setPeriodo] = useState<'mensal' | 'anual'>('mensal');

  const planos = [
    {
      name: 'Starter',
      price: 289,
      monthlyPrice: 289,
      yearlyPrice: 289 * 12 * 0.6,
      features: [
        'Relatórios inteligentes com IA',
        'Triagem ilimitada com sua base de pacientes',
        'Download do PDF com orientações personalizadas',
        'Dashboard com dados dos pacientes',
      ],
      priceId: 'starter',
      popular: false,
    },
    {
      name: 'White Label',
      price: 549,
      monthlyPrice: 549,
      yearlyPrice: 549 * 12 * 0.6,
      features: [
        'Todos os recursos do Starter',
        'Sua logo e domínio personalizado',
        'Relatório com sua identidade visual',
        'Acesso multiusuário e suporte dedicado',
      ],
      priceId: 'whiteLabel',
      popular: true,
    },
    {
      name: 'Scale Pro',
      price: '289 + R$1,49/msg',
      monthlyPrice: 289,
      yearlyPrice: 289 * 12 * 0.6,
      features: [
        'Todos os recursos do White Label',
        'Envio automático pelo WhatsApp via IA',
        'Campanhas de reativação de pacientes',
        'Análise de engajamento e ROI em tempo real',
      ],
      priceId: 'scalePro',
      popular: false,
    },
  ];

  return (
    <>
      <Head>
        <title>Planos | MeJoy</title>
        <meta name="description" content="Escolha o plano ideal e veja sua clínica crescer com IA." />
      </Head>
      <main className="min-h-screen bg-bg text-fg">
        <Navbar />

        {/* HERO SECTION */}
        <section className="pt-24 pb-12 text-center px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Atenda mais pacientes com qualidade premium usando IA Médica Inteligente
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/80">
            Escolha seu plano e veja sua clínica gerar mais resultados, economizar tempo nas consultas e encantar seus pacientes.
          </p>
          <div className="mt-6 inline-flex gap-4 text-sm justify-center">
            <button
              onClick={() => setPeriodo('mensal')}
              className={`px-4 py-2 rounded-full border ${
                periodo === 'mensal'
                  ? 'bg-brand border-brand text-white'
                  : 'bg-transparent border-brand text-brand'
              } transition`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriodo('anual')}
              className={`px-4 py-2 rounded-full border ${
                periodo === 'anual'
                  ? 'bg-brand border-brand text-white'
                  : 'bg-transparent border-brand text-brand'
              } transition`}
            >
              Anual (economize 40%)
            </button>
          </div>
        </section>

        {/* PLANOS CARDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white/10 backdrop-blur-md">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {planos.map((plano) => {
              const price =
                typeof plano.price === 'number'
                  ? periodo === 'mensal'
                    ? plano.monthlyPrice
                    : plano.yearlyPrice
                  : plano.price;
              return (
                <div
                  key={plano.name}
                  className={`relative p-6 rounded-2xl shadow-xl border-2 ${
                    plano.popular ? 'border-brand' : 'border-border'
                  } bg-white text-foreground`}
                >
                  {plano.popular && (
                    <span className="absolute -top-3 left-3 bg-brand text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                      Mais Popular
                    </span>
                  )}
                  <h3 className="text-2xl font-semibold mb-1">{plano.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {plano.name === 'Starter' && 'Ideal para começar com IA médica'}
                    {plano.name === 'White Label' && 'Sua marca, seu domínio, seu visual'}
                    {plano.name === 'Scale Pro' && 'Alta performance e automação completa'}
                  </p>
                  <p className="text-3xl font-bold text-brand mb-4">
                    {typeof price === 'number'
                      ? `R$ ${price.toFixed(0)}/${periodo === 'mensal' ? 'mês' : 'ano'}`
                      : price}
                  </p>
                  <ul className="space-y-2 mb-6 text-sm">
                    {plano.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-brand mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => redirectToStripeCheckout(plano.priceId as 'starter' | 'whiteLabel' | 'scalePro')}
                    className="w-full rounded-md bg-brand px-4 py-2 text-white font-medium hover:bg-brand transition"
                  >
                    Contratar agora
                  </button>
                </div>
              );
            })}
          </div>

          {/* Contador de urgência */}
          <div className="mt-12 text-center text-sm text-fg font-semibold">
            Oferta anual com 40% OFF termina em: <span>23h 59m 12s ⏳</span>
          </div>
        </section>
        {/* BENEFÍCIOS EMOCIONAIS */}
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-lg text-white">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-3xl font-bold mb-10">
            O que sua clínica ganha com o MeJoy
    </h2>
    <div className="grid md:grid-cols-3 gap-8 text-left">
      <div className="bg-white/10 rounded-xl p-6 shadow-lg hover:scale-[1.02] transition">
        <div className="text-brand text-3xl mb-3">⏱️</div>
        <h3 className="text-xl font-semibold mb-2">Mais tempo nas consultas</h3>
        <p className="text-white/80 text-sm">
          Com relatórios pré-gerados por IA, você começa a consulta com todas as informações em mãos. Ganhe até 30% de tempo por paciente.
        </p>
      </div>
      <div className="bg-white/10 rounded-xl p-6 shadow-lg hover:scale-[1.02] transition">
        <div className="text-brand text-3xl mb-3">💰</div>
        <h3 className="text-xl font-semibold mb-2">Mais lucro e fidelização</h3>
        <p className="text-white/80 text-sm">
          Pacientes encantados com relatórios claros e personalizados retornam mais, indicam mais e aumentam sua receita.
        </p>
      </div>
      <div className="bg-white/10 rounded-xl p-6 shadow-lg hover:scale-[1.02] transition">
        <div className="text-brand text-3xl mb-3">📈</div>
        <h3 className="text-xl font-semibold mb-2">Crescimento profissional</h3>
        <p className="text-white/80 text-sm">
          Posicione sua clínica como referência em tecnologia e inovação. Atraia novos públicos e destaque-se no mercado.
        </p>
      </div>
    </div>
  </div>
</section>
{/* FAQ */}
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30 backdrop-blur-md text-white">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-10">❓ Perguntas Frequentes</h2>
    <div className="space-y-6">
      {[
        {
          question: 'Como o MeJoy reduz o tempo das consultas?',
          answer:
            'Com nossa IA médica, você recebe um relatório pré-consulta com histórico, sintomas e riscos organizados. Assim, você inicia a consulta com clareza total, economizando até 30% do tempo por atendimento.',
        },
        {
          question: 'O que significa plano White Label?',
          answer:
            'Significa que sua clínica poderá utilizar o MeJoy com sua própria marca, logo e domínio personalizado. Seus pacientes verão apenas sua identidade visual.',
        },
        {
          question: 'Preciso pagar taxa extra por paciente?',
          answer:
            'Não! Os planos possuem triagens ilimitadas para sua base. Apenas o plano Pro cobra uma taxa unitária para envio via WhatsApp automático.',
        },
        {
          question: 'Posso cancelar quando quiser?',
          answer:
            'Sim! Nossos planos são 100% flexíveis. Você pode cancelar ou pausar sua assinatura a qualquer momento, sem multas ou fidelidade.',
        },
        {
          question: 'Os dados dos meus pacientes estão seguros?',
          answer:
            'Sim. Seguimos rigorosamente a LGPD, com criptografia de ponta a ponta, hospedagem segura (Supabase/Vercel) e controle de acesso para garantir total privacidade.',
        },
        {
          question: 'Existe suporte humano disponível?',
          answer:
            'Sim! Nosso time de suporte está disponível para tirar dúvidas técnicas e ajudar você na implantação do MeJoy em sua clínica. Planos White Label e Pro têm atendimento prioritário.',
        },
      ].map((faq, i) => (
        <details
          key={i}
          className="rounded-lg bg-white/10 p-4 group transition-all"
          open={i === 0}
        >
          <summary className="font-semibold cursor-pointer text-lg text-white flex justify-between items-center">
            {faq.question}
            <span className="ml-2 text-brand group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p className="mt-3 text-white/80 text-sm">{faq.answer}</p>
        </details>
      ))}
    </div>
    <p className="mt-8 text-center text-white/70 text-sm">
      Ainda tem dúvidas? <a href="mailto:suporte@zapfarm.com.br" className="underline">Fale com nosso suporte.</a>
    </p>
  </div>
</section>
{/* CTA FINAL */}
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand via-brand to-brand text-white relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent blur-xl opacity-30 pointer-events-none" />
  <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
    <h2 className="text-3xl sm:text-4xl font-extrabold">
      ✅ Pronto para transformar sua clínica com IA?
    </h2>
    <p className="text-white/80 text-lg sm:text-xl">
      Comece agora e ofereça um atendimento digital, rápido e inteligente para seus pacientes. Seus concorrentes já estão se movimentando.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
      <button
        onClick={() => redirectToStripeCheckout('starter' as 'starter')}
        className="bg-brand hover:bg-brand text-white px-6 py-3 rounded-full font-semibold transition shadow-lg"
      >
        🎁 Testar gratuitamente
      </button>
      <button
        onClick={() => redirectToStripeCheckout('whiteLabel' as 'whiteLabel')}
        className="bg-brand hover:bg-brand text-white px-6 py-3 rounded-full font-semibold transition shadow-lg"
      >
        🚀 Escolher plano agora
      </button>
    </div>
    <p className="text-xs text-white/60 mt-4">
      Sem fidelidade. Cancelamento a qualquer momento.
    </p>
  </div>
</section>
{/* FOOTER PREMIUM */}
<footer className="bg-bg text-fg py-12 px-6 sm:px-10 lg:px-20 border-t border-border">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
    
    {/* Marca */}
    <div>
      <h3 className="text-xl font-bold mb-3 text-brand">MeJoy</h3>
      <p className="text-white/70">
        Inteligência Médica para clínicas modernas. Triagens automáticas, relatórios personalizados e experiência premium para seus pacientes.
      </p>
    </div>

    {/* Navegação */}
    <div>
      <h4 className="text-white font-semibold mb-3">Navegação</h4>
      <ul className="space-y-2 text-white/80">
        <li><Link href="/b2b/planos" className="hover:text-white">Planos</Link></li>
        <li><Link href="/relatorio/exemplo" className="hover:text-white">Exemplo de Relatório</Link></li>
        <li><Link href="/triagem" className="hover:text-white">Triagem Inteligente</Link></li>
        <li><a href="/parceiros" className="hover:text-white">Parcerias</a></li>
      </ul>
    </div>

    {/* Suporte */}
    <div>
      <h4 className="text-white font-semibold mb-3">Suporte</h4>
      <ul className="space-y-2 text-white/80">
        <li><a href="mailto:suporte@zapfarm.com.br" className="hover:text-white">suporte@zapfarm.com.br</a></li>
        <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
        <li><a href="/contato" className="hover:text-white">Fale Conosco</a></li>
      </ul>
    </div>

    {/* Legal */}
    <div>
      <h4 className="text-white font-semibold mb-3">Legal</h4>
      <ul className="space-y-2 text-white/80">
        <li><Link href="/termos" className="hover:text-white">Termos de Uso</Link></li>
        <li><Link href="/politicas-lgpd" className="hover:text-white">Política de Privacidade (LGPD)</Link></li>
      </ul>
    </div>
  </div>

  <div className="mt-10 text-center text-white/40 text-xs">
    © {new Date().getFullYear()} MeJoy. Todos os direitos reservados.
  </div>
</footer>
</main>
<Footer/>
</>);
}