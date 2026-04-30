'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, Sparkles, ArrowRight, Crown } from 'lucide-react';
import { track } from '@/lib/analytics';

const features = [
  'Ativação em minutos',
  '30 dias de garantia',
  'Sem equipe técnica',
  'Logo, domínio e CTAs',
  'Relatórios com IA',
  'Analytics e métricas',
  'Integração WhatsApp/CRM',
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const monthlyPrice = 299;
  const yearlyPrice = 299 * 10; // 2 meses grátis
  const yearlyTotal = monthlyPrice * 12;
  const savings = yearlyTotal - yearlyPrice;
  const yearlyMonthlyEquivalent = Math.round(yearlyPrice / 12);
  const discountPercent = Math.round((savings / yearlyTotal) * 100); // ~15%

  const handleCheckout = async () => {
    setLoading(true);
    track('pricing_checkout_click', {
      section: 'pricing',
      billing_cycle: billingCycle,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
    });

    try {
      const response = await fetch('/api/asaas/subscription-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'plus',
          period: billingCycle,
        })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        if (data.payment?.pixTransaction) {
          window.location.href = `/checkout/pix?paymentId=${data.paymentId}&qrCode=${encodeURIComponent(data.payment.pixTransaction.qrCode)}`;
        } else if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      setLoading(false);
    }
  };

  return (
    <section id="planos" className="py-20 md:py-28 bg-gradient-to-b from-surface via-muted/30 to-surface relative overflow-hidden">
      {/* Aurora background para Pricing */}
      <div className="absolute inset-x-0 -top-8 h-40 lpac-aurora pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4 leading-tight text-balance">
            Pronto para colocar sua marca no ar?
          </h2>
          <p className="text-xl text-ink-muted max-w-2xl mx-auto mb-12 leading-relaxed">
            Ativação em minutos. Sem equipe técnica. Comece hoje.
          </p>

          {/* Toggle Mensal/Anual com economia sempre visível */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-2 py-1 text-sm bg-surface">
            <button
              onClick={() => setBillingCycle('monthly')}
              data-on={billingCycle === 'monthly'}
              className="px-3 py-1 rounded-full transition-all duration-300 data-[on=true]:bg-[color:var(--muted)] data-[on=true]:font-semibold"
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              data-on={billingCycle === 'yearly'}
              className="px-3 py-1 rounded-full transition-all duration-300 relative data-[on=true]:bg-[color:var(--muted)] data-[on=true]:font-semibold"
            >
              Anual
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-[color:var(--accent-600)]/12 text-[color:var(--accent-600)] font-semibold">
                Economize {discountPercent}%
              </span>
            </button>
          </div>

          {/* Card de Preço Premium */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto relative"
          >
            <div className="card-surface p-10 relative overflow-hidden group">
              {/* Gradiente sutil no fundo (Light) */}
              <div className="absolute inset-0 -z-10 lpac-grad lpac-grad-emerald opacity-5 rounded-3xl" />
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-[color:var(--brand-600)]" />
                  <span className="text-lg font-bold text-ink">Plano Plus</span>
                </div>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-6xl font-extrabold text-ink">
                    R$ {billingCycle === 'monthly' ? monthlyPrice : yearlyMonthlyEquivalent}
                  </span>
                  <span className="text-xl text-ink-muted">/mês</span>
                </div>
                <p className="text-sm text-ink-muted mt-2">
                  {billingCycle === 'yearly' ? (
                    <>
                      <span className="line-through">R$ {monthlyPrice * 12}</span>{' '}
                      <span className="text-[color:var(--brand-600)] font-bold text-lg">R$ {yearlyPrice}/ano</span>
                    </>
                  ) : (
                    <span className="text-[color:var(--brand-600)] font-semibold">Economize {discountPercent}% no anual</span>
                  )}
                </p>
              </div>

              <ul className="space-y-4 mb-10">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 text-base text-ink leading-relaxed"
                  >
                    <div className="w-6 h-6 rounded-full bg-[color:var(--brand-600)] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <button
                onClick={handleCheckout}
                disabled={loading}
                data-testid="pricing-cta"
                data-analytics="lpac_pricing_checkout"
                className="btn-gradient-brand w-full focus-ring"
                aria-label={`Assinar plano ${billingCycle === 'monthly' ? 'mensal' : 'anual'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Carregando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Assinar agora
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                <div className="chip-soft">
                  <Check className="icon-soft" />
                  <span>SSL</span>
                </div>
                <div className="chip-soft">
                  <Check className="icon-soft" />
                  <span>LGPD</span>
                </div>
                <div className="chip-soft">
                  <Check className="icon-soft" />
                  <span>Asaas</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
