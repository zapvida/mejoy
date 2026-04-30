import { CheckCircle2, Loader2 } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/buttons';
import StorefrontHeader from '@/components/store-v2/StorefrontHeader';
import StorefrontFooter from '@/components/store-v2/StorefrontFooter';
import { track } from '@/lib/analytics';

const WHATSAPP_CTA = process.env.NEXT_PUBLIC_WHATSAPP_CTA ?? 'https://wa.me/5511999999999';

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

type OrderData = {
  id: string;
  status: string;
  customerName: string;
  totalCents: number;
  shippingCents: number;
  shippingDays?: number;
  shippingAddress?: {
    cep?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    priceCents: number;
    lineTotalCents?: number;
  }>;
};

type PixData = {
  qrCode?: string;
  qrCodeBase64?: string;
  invoiceUrl?: string;
};

function formatAddress(addr: OrderData['shippingAddress']): string {
  if (!addr) return '';
  const parts = [
    addr.endereco,
    addr.numero && `nº ${addr.numero}`,
    addr.complemento,
    addr.bairro,
    addr.cidade && addr.estado && `${addr.cidade} - ${addr.estado}`,
    addr.cep && `CEP ${addr.cep}`,
  ].filter(Boolean);
  return parts.join(', ');
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const orderId = (router.query.orderId as string) || '';
  const [order, setOrder] = useState<OrderData | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [loading, setLoading] = useState(!!orderId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    try {
      const stored = sessionStorage.getItem(`mejoy_pix_${orderId}`);
      if (stored) {
        const parsed = JSON.parse(stored) as PixData;
        setPixData(parsed);
        sessionStorage.removeItem(`mejoy_pix_${orderId}`);
      }
    } catch {
      // sessionStorage may be unavailable
    }

    fetch(`/api/store-v2/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setOrder(data);
        if (data.totalCents) {
          const items = (data.items ?? []).map((i: { name?: string; quantity?: number; priceCents?: number }) => ({
            item_name: i.name,
            quantity: i.quantity,
            price: i.priceCents ? i.priceCents / 100 : 0,
          }));
          track('purchase', {
            value: data.totalCents / 100,
            currency: 'BRL',
            order_id: data.id,
            items: items.length ? items : undefined,
          });
        }
      })
      .catch(() => setError('Erro ao carregar pedido'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) {
    return <LegacySuccess />;
  }

  if (loading) {
    return (
      <>
        <Head><title>Processando... | Me Joy</title></Head>
        <StorefrontHeader />
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
          <p className="text-gray-600">Carregando seu pedido...</p>
        </main>
        <StorefrontFooter />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Head><title>Erro | Me Joy</title></Head>
        <StorefrontHeader />
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <p className="text-red-600 mb-4">{error || 'Pedido não encontrado'}</p>
          <Link href="/"><Button>Voltar ao início</Button></Link>
        </main>
        <StorefrontFooter />
      </>
    );
  }

  const isPaid = order.status === 'PAID';
  const isPending = order.status === 'PENDING_PAYMENT';
  const address = formatAddress(order.shippingAddress);

  return (
    <>
      <Head>
        <title>{isPaid ? 'Compra confirmada!' : 'Finalize seu pagamento'} | Me Joy</title>
        <meta
          name="description"
          content={isPaid ? 'Seu pedido foi confirmado. Acompanhe pelo dashboard.' : 'Pague com PIX para confirmar sua compra.'}
        />
      </Head>
      <StorefrontHeader />
      <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          <div className="text-center mb-8 w-full">
            {isPaid ? (
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏳</span>
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {isPaid ? 'Compra confirmada!' : 'Quase lá! Pague o PIX'}
            </h1>
            <p className="text-gray-600">
              {isPaid
                ? `Obrigado, ${order.customerName?.split(' ')[0] || 'cliente'}! Seu pedido #${order.id.slice(-8).toUpperCase()} foi confirmado.`
                : 'Escaneie o QR Code ou copie o código PIX para finalizar.'}
            </p>
          </div>

          {/* PIX (apenas se PENDING) */}
          {isPending && pixData && (
            <section className="mb-8 p-6 sm:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm w-full flex flex-col items-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 w-full text-center">Pagamento PIX</h2>
              {pixData.qrCodeBase64 && (
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200 mb-4 flex justify-center">
                  <img
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-48 h-48 sm:w-56 sm:h-56"
                  />
                </div>
              )}
              {pixData.qrCode && (
                <div className="mb-4 w-full max-w-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código PIX (copiar e colar)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixData.qrCode}
                      className="flex-1 px-4 py-2 border rounded-lg font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(pixData.qrCode!)}
                      className="px-4 py-2 bg-brand text-white rounded-lg shrink-0"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              )}
              {pixData.invoiceUrl && (
                <a
                  href={pixData.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand hover:underline"
                >
                  Abrir página de pagamento →
                </a>
              )}
              <p className="text-sm text-gray-500 mt-4 text-center">
                Após o pagamento, você receberá a confirmação por e-mail e WhatsApp com link para acessar seu painel.
              </p>
            </section>
          )}

          {/* Resumo do pedido */}
          <section className="mb-8 p-6 sm:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do pedido</h2>
            <p className="text-sm text-gray-500 mb-4">Pedido #{order.id.slice(-8).toUpperCase()}</p>
            <div className="space-y-3 mb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice((item.lineTotalCents ?? item.priceCents * item.quantity))}</span>
                </div>
              ))}
            </div>
            {order.shippingCents > 0 && (
              <div className="flex justify-between text-sm text-gray-600 py-2 border-t">
                <span>Frete</span>
                <span>{formatPrice(order.shippingCents)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(order.totalCents)}</span>
            </div>
          </section>

          {/* Endereço */}
          {address && (
            <section className="mb-8 p-6 sm:p-8 bg-white rounded-2xl border border-gray-200 shadow-sm w-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Endereço de entrega</h2>
              <p className="text-gray-600 text-sm">{address}</p>
              {order.shippingDays && (
                <p className="text-gray-500 text-sm mt-2">Previsão: até {order.shippingDays} dias úteis</p>
              )}
            </section>
          )}

          {/* Status + CTA */}
          <section className="text-center space-y-4 w-full flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              bg-gray-100 text-gray-800">
              Status: {order.status === 'PAID' ? '✅ Pago' : '⏳ Aguardando pagamento'}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isPaid && (
                <Link href="/dashboard">
                  <Button className="w-full sm:w-auto">
                    Acessar meu painel
                  </Button>
                </Link>
              )}
              <Link href={`/pedidos/${order.id}`}>
                <Button variant="outline" className="w-full sm:w-auto">
                  Ver detalhes do pedido
                </Button>
              </Link>
              <a
                href={`${WHATSAPP_CTA}?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre meu pedido #${order.id.slice(-8).toUpperCase()}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  Falar no WhatsApp
                </Button>
              </a>
            </div>
            <Link href="/" className="inline-block text-gray-500 hover:text-gray-700 text-sm">
              ← Continuar comprando
            </Link>
          </section>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}

function LegacySuccess() {
  useEffect(() => {
    track('purchase', { value: 49, currency: 'BRL', plan: 'basic' });
    navigator.sendBeacon('/api/analytics/event',
      new Blob([JSON.stringify({ event: 'LP_VISITED', payload: {} })], { type: 'application/json' })
    );
  }, []);

  return (
    <>
      <Head>
        <title>Pagamento Confirmado | Me Joy</title>
        <meta
          name="description"
          content="Seu pagamento foi realizado com sucesso. Agora você pode acessar sua plataforma de saúde personalizada com IA."
        />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-brand mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Pagamento Confirmado!</h1>
        <p className="text-muted-foreground text-lg max-w-md mb-6">
          Sua ativação foi processada com sucesso. Você receberá um e-mail e uma mensagem no WhatsApp com os próximos passos.
        </p>
        <Link href="/">
          <Button className="px-6 py-3 text-white bg-brand hover:bg-brand rounded-lg text-base">
            Voltar à Página Inicial
          </Button>
        </Link>
      </div>
    </>
  );
}
