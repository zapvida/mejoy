import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/buttons';
import { fetchWithUserSession } from '@/lib/api/client-auth';
import StorefrontHeader from '@/components/store-v2/StorefrontHeader';
import StorefrontFooter from '@/components/store-v2/StorefrontFooter';

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

const WHATSAPP_CTA = process.env.NEXT_PUBLIC_WHATSAPP_CTA ?? 'https://wa.me/5511999999999';

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  PAID: 'Pago',
  PREPARING: 'Em preparação',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
};

const TIMELINE_STEPS = [
  { key: 'PENDING_PAYMENT', label: 'Pagamento', icon: '💳' },
  { key: 'PAID', label: 'Confirmado', icon: '✅' },
  { key: 'PREPARING', label: 'Em preparação', icon: '📦' },
  { key: 'SHIPPED', label: 'Enviado', icon: '🚚' },
  { key: 'DELIVERED', label: 'Entregue', icon: '🏠' },
] as const;

export default function OrderDetailPage() {
  const router = useRouter();
  const orderId = router.query.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const access = typeof router.query.access === 'string' ? router.query.access : '';
    const url = access
      ? `/api/store-v2/orders/${orderId}?access=${encodeURIComponent(access)}`
      : `/api/store-v2/orders/${orderId}`;

    setLoading(true);
    setError(null);

    fetchWithUserSession(url)
      .then((result) => {
        if (result.ok === false) {
          setError(result.error);
          setOrder(null);
          return;
        }
        setOrder(result.data);
      })
      .catch(() => {
        setError('Não foi possível carregar o pedido.');
      })
      .finally(() => setLoading(false));
  }, [orderId, router.query.access]);

  if (!orderId) {
    return (
      <>
        <Head><title>Pedido | Me Joy</title></Head>
        <main className="min-h-screen flex items-center justify-center">
          <Link href="/"><Button>Voltar ao início</Button></Link>
        </main>
      </>
    );
  }

  if (loading || !order) {
    return (
      <>
        <Head><title>Carregando... | Me Joy</title></Head>
        <StorefrontHeader />
        <main className="min-h-screen flex items-center justify-center">
          <div className="max-w-md text-center px-6">
            <p className="text-gray-500">
              {loading ? 'Carregando...' : error || 'Pedido não encontrado'}
            </p>
            {!loading && (
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/login?redirect=/dashboard" className="inline-flex justify-center">
                  <Button>Entrar para ver meus pedidos</Button>
                </Link>
                <a
                  href={`${WHATSAPP_CTA}?text=${encodeURIComponent(`Olá! Preciso de ajuda para acessar o pedido ${orderId?.slice(-8)?.toUpperCase() || ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Falar com suporte
                </a>
              </div>
            )}
          </div>
        </main>
        <StorefrontFooter />
      </>
    );
  }

  const addr = order.shippingAddress;
  const addressStr = addr
    ? [addr.endereco, addr.numero && `nº ${addr.numero}`, addr.bairro, addr.cidade && addr.estado && `${addr.cidade} - ${addr.estado}`, addr.cep && `CEP ${addr.cep}`].filter(Boolean).join(', ')
    : '';

  return (
    <>
      <Head>
        <title>Pedido #{order.id?.slice(-8)?.toUpperCase()} | MeJoy</title>
      </Head>
      <StorefrontHeader />
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Pedido #{order.id?.slice(-8)?.toUpperCase()}
          </h1>

          <div className="space-y-6">
            {/* Timeline */}
            <section className="p-6 bg-white rounded-2xl border border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-4">Andamento</h2>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {TIMELINE_STEPS.map((step, i) => {
                  const idx = TIMELINE_STEPS.findIndex((s) => s.key === order.status);
                  const isActive = i <= (idx >= 0 ? idx : 0);
                  return (
                    <div
                      key={step.key}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        isActive ? 'bg-brand-100 text-brand-800' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span>{step.icon}</span>
                      <span className="text-sm font-medium">{step.label}</span>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <span className="hidden sm:inline text-gray-300">→</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-600 text-sm mt-3">
                Status atual: {STATUS_LABELS[order.status] ?? order.status}
              </p>
            </section>

            <section className="p-6 bg-white rounded-2xl border border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-4">Itens</h2>
              <div className="space-y-2">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.lineTotalCents ?? item.priceCents * item.quantity)}</span>
                  </div>
                ))}
              </div>
              {order.shippingCents > 0 && (
                <div className="flex justify-between pt-2 mt-2 border-t">
                  <span>Frete</span>
                  <span>{formatPrice(order.shippingCents)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 mt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(order.totalCents)}</span>
              </div>
            </section>

            {addressStr && (
              <section className="p-6 bg-white rounded-2xl border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-2">Endereço de entrega</h2>
                <p className="text-gray-600 text-sm">{addressStr}</p>
              </section>
            )}

            {(order.trackingCode || order.trackingUrl) && (order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
              <section className="p-6 bg-white rounded-2xl border border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-2">Rastreamento</h2>
                {order.trackingCode && (
                  <p className="text-gray-600 text-sm mb-2">Código: {order.trackingCode}</p>
                )}
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
                  >
                    Rastrear entrega →
                  </a>
                )}
              </section>
            )}

            <div className="text-center pt-4">
              <a
                href={`${WHATSAPP_CTA}?text=${encodeURIComponent(`Olá! Dúvida sobre pedido #${order.id?.slice(-8)?.toUpperCase()}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-brand hover:bg-brand-600">Falar no WhatsApp</Button>
              </a>
            </div>
          </div>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
