'use client';

import { CheckIcon, GiftIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import Seo from '@/components/Seo';
import LogoWithName from '@/components/ui/LogoWithName';
import { useGA4 } from '@/hooks/useGA4';
import { buildCanonical, productJsonLd } from '@/lib/seo';
import { formatPrice } from '@/lib/asaas/config';

type CheckoutVariant = 'standard' | 'gift';

function calculateYearlySavings(monthlyPrice: number): number {
  const yearlyPrice = monthlyPrice * 10; // 10 meses de desconto
  const fullYearPrice = monthlyPrice * 12;
  return fullYearPrice - yearlyPrice;
}

const BASE_PRICES = {
  standard: { monthly: 2990, yearly: 29900 },
  gift: { monthly: 1990, yearly: 19900 }
} as const;

const ADDON_PRICES = {
  monthly: 990,
  yearly: 9900
} as const;

const PLAN_FEATURES = [
  'Tudo do básico + relatórios ilimitados',
  'Consultas virtuais e monitoramento contínuo',
  'Integração com Stripe e GHL automaticamente',
  'Presenteie alguém com um clique',
  'Adicione até 10 pessoas extras no checkout'
] as const;

const PricingPage = () => {
  const router = useRouter();
  const { trackEvent } = useGA4();
  const [isYearly, setIsYearly] = useState(false);
  const [variant, setVariant] = useState<CheckoutVariant>('standard');
  const [extraSeats, setExtraSeats] = useState<number>(0);
  const [beneficiaryEmail, setBeneficiaryEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'Pricing - MeJoy',
      page_location: window.location.href
    });

    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    if (planParam && /year/i.test(planParam)) {
      setIsYearly(true);
      trackEvent('plan_pre_selected', {
        plan_type: 'PLUS_YEARLY',
        billing_period: 'yearly'
      });
    }

    const variantParam = urlParams.get('variant');
    if (variantParam === 'gift') {
      setVariant('gift');
    }
  }, [trackEvent]);

  const billingPeriod = isYearly ? 'yearly' : 'monthly';
  const baseAmount = (variant === 'gift' ? BASE_PRICES.gift : BASE_PRICES.standard)[billingPeriod];
  const addonUnitAmount = ADDON_PRICES[billingPeriod];
  const extraSeatsClamped = Math.max(0, Math.min(10, Math.floor(extraSeats || 0)));
  const addonAmount = addonUnitAmount * extraSeatsClamped;
  const totalAmount = baseAmount + addonAmount;
  const yearlySavings = isYearly
    ? calculateYearlySavings((variant === 'gift' ? BASE_PRICES.gift.monthly : BASE_PRICES.standard.monthly) / 100)
    : 0;
  const beneficiaryEmailTrimmed = beneficiaryEmail.trim();

  const handleSubscribe = async () => {
    setIsLoading(true);

    try {
      trackEvent('subscribe_click', {
        plan: 'plus',
        period: billingPeriod,
        method: 'card',
        variant,
        extraSeats: extraSeatsClamped
      });

      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'CHECKOUT_STARTED',
          payload: {
            monetary: totalAmount,
            variant,
            extraSeats: extraSeatsClamped,
            beneficiaryEmail: variant === 'gift' && beneficiaryEmailTrimmed ? beneficiaryEmailTrimmed : undefined
          }
        })
      });

      const response = await fetch('/api/asaas/subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: 'plus',
          period: billingPeriod,
          variant,
          extraSeats: extraSeatsClamped,
          ...(variant === 'gift' && beneficiaryEmailTrimmed ? { beneficiaryEmail: beneficiaryEmailTrimmed } : {}),
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        if (data.payment?.pixTransaction) {
          // Para PIX, redirecionar para página de confirmação com QR Code
          window.location.href = `/checkout/pix?paymentId=${data.paymentId}&qrCode=${encodeURIComponent(data.payment.pixTransaction.qrCode)}`;
        } else if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Resposta inválida do servidor');
        }
      } else {
        throw new Error(data.message || 'Erro ao criar checkout');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Erro ao processar assinatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Planos e Preços"
        description="Assine o Plano Plus mensal ou anual, com opção de presente e assentos extras."
        path="/pricing"
        jsonLd={[
          productJsonLd({
            name: 'Plano Plus MeJoy',
            description: 'Plano principal com gift e assentos adicionais.',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
            price: 29.9
          })
        ]}
      />

      <Head>
        <title>Planos - MeJoy Plus</title>
        <meta
          name="description"
          content="Assine o Plano Plus do MeJoy, com opção de presente e assentos extras para sua equipe."
        />
        <meta property="og:title" content="Planos - MeJoy Plus" />
        <meta
          property="og:description"
          content="Assinatura pronta para presente e equipes. Stripe e GHL integrados automaticamente."
        />
        <meta property="og:image" content="https://www.mejoy.com.br/og-default.png" />
        <link rel="canonical" href={buildCanonical('/pricing')} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LogoWithName size="small" variant="inverse" priority />
              </div>
              <button
                onClick={() => router.push('/')}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Plano Plus pronto para vender
            </h1>
            <p className="text-xl text-zinc-300 mb-8 max-w-3xl mx-auto">
              Assinatura mensal ou anual em BRL, com preço especial para presente e até 10 pessoas extras
              no mesmo checkout. Stripe, webhooks e GHL já integrados.
            </p>

            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg ${!isYearly ? 'text-white' : 'text-zinc-400'}`}>Mensal</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-blue-600' : 'bg-zinc-600'
                }`}
                role="switch"
                aria-checked={isYearly}
                aria-label="Alternar entre cobrança mensal e anual"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg ${isYearly ? 'text-white' : 'text-zinc-400'}`}>Anual</span>
              {isYearly && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Economia de 2 meses
                </span>
              )}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-zinc-800 rounded-2xl p-8 border-2 border-blue-500 shadow-2xl shadow-blue-500/20 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                  <GiftIcon className="h-4 w-4" />
                  <span>Assinatura Plus</span>
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-3">Plano Plus</h3>
                <p className="text-zinc-400 mb-6">
                  Ideal para uso pessoal ou para presentear alguém especial. Adicione pessoas extras conforme a necessidade.
                </p>

                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">
                    {formatPrice(baseAmount)}
                  </span>
                  <span className="text-zinc-400 ml-2">/{isYearly ? 'ano' : 'mês'}</span>
                </div>

                {addonAmount > 0 && (
                  <div className="text-sm text-zinc-300 mb-2">
                    {extraSeatsClamped} pessoa(s) extra: +{formatPrice(addonAmount)}
                  </div>
                )}

                {isYearly && yearlySavings > 0 && (
                  <div className="text-green-400 text-sm">
                    Economia de {formatPrice(yearlySavings * 100)} por ano
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8 text-left">
                {PLAN_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-300 mb-6">
                <div className="flex items-center justify-between">
                  <span>Total no checkout</span>
                  <span className="text-white font-semibold">{formatPrice(totalAmount)}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  {formatPrice(baseAmount)} plano principal
                  {extraSeatsClamped > 0 ? ` + ${extraSeatsClamped} pessoa(s) extra` : ''}.
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <label className="flex items-center justify-between bg-zinc-700/40 border border-zinc-600 rounded-xl px-4 py-3 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${variant === 'gift' ? 'bg-purple-600' : 'bg-zinc-700'}`}>
                      <GiftIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Dar de presente</p>
                      <p className="text-sm text-zinc-400">
                        Ative para usar o preço especial de presente e incluir o e-mail do beneficiário.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-zinc-500"
                    checked={variant === 'gift'}
                    onChange={(event) => {
                      const enabled = event.target.checked;
                      setVariant(enabled ? 'gift' : 'standard');
                      if (!enabled) setBeneficiaryEmail('');
                    }}
                  />
                </label>

                {variant === 'gift' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      E-mail do beneficiário (opcional)
                    </label>
                    <input
                      type="email"
                      value={beneficiaryEmail}
                      onChange={(event) => setBeneficiaryEmail(event.target.value)}
                      placeholder="pessoa@exemplo.com"
                      className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Usaremos esse e-mail para personalizar a entrega do presente.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Pessoas extras (0 a 10)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={extraSeatsClamped}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      if (Number.isFinite(value)) {
                        setExtraSeats(Math.max(0, Math.min(10, Math.floor(value))));
                      }
                    }}
                    className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    {isYearly ? 'R$ 99,00 por pessoa extra/ano' : 'R$ 9,90 por pessoa extra/mês'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processando...' : `Assinar por ${formatPrice(totalAmount)}`}
              </button>

              <button
                disabled={true}
                className="w-full mt-3 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 bg-zinc-600 text-zinc-400 cursor-not-allowed opacity-50"
                title="PIX em breve"
              >
                PIX (Em breve)
              </button>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: 'Posso cancelar minha assinatura a qualquer momento?',
                  a: 'Sim, você pode cancelar sua assinatura a qualquer momento através do seu painel de controle. Não há taxas de cancelamento.'
                },
                {
                  q: 'Presentear muda alguma coisa na cobrança?',
                  a: 'Não. O checkout usa o preço especial de presente e você pode informar o e-mail do beneficiário para identificarmos quem receberá o acesso.'
                },
                {
                  q: 'Quantas pessoas extras posso adicionar?',
                  a: 'Até 10 pessoas extras por checkout. Cada pessoa extra custa R$ 9,90/mês ou R$ 99,00/ano.'
                },
                {
                  q: 'Como funcionam as integrações?',
                  a: 'Stripe, webhooks e GHL recebem automaticamente o contexto do tenant, variante (standard/gift) e assentos extras para o time comercial.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-zinc-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
