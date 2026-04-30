import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { isStoreV2Enabled, isStoreV2ConversionEnabled } from '@/lib/flags';
import StorefrontHeader from '@/components/store-v2/StorefrontHeader';
import StorefrontFooter from '@/components/store-v2/StorefrontFooter';
import CartProgressBar from '@/components/store-v2/CartProgressBar';
import CartTrustMini from '@/components/store-v2/CartTrustMini';
import CartUpsell from '@/components/store-v2/CartUpsell';
import ProductPackShot, { shouldUsePackShot } from '@/components/store-v2/ProductPackShot';
import Seo from '@/components/Seo';
import { getOrCreateSessionId } from '@/lib/store-v2/session';
import { dispatchCartUpdated } from '@/lib/store-v2/cart-events';
import { ShoppingBag } from 'lucide-react';

const DEFAULT_FREE_THRESHOLD_CENTS = 19000; // Sudeste/Sul — menor threshold

interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product?: {
    slug: string;
    name: string;
    priceCents: number | null;
    images: string[];
    formDisplay: string | null;
  };
}

interface CartData {
  cartId: string;
  items: CartItem[];
  itemCount: number;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cep, setCep] = useState('');
  const [shippingResult, setShippingResult] = useState<{
    freeThresholdCents: number;
    region: string;
  } | null>(null);

  const fetchCart = useCallback(() => {
    const sessionId = getOrCreateSessionId();
    return fetch('/api/store-v2/cart', { headers: { 'X-Session-Id': sessionId } })
      .then((r) => r.json())
      .then(setCart)
      .catch(() => setCart({ cartId: '', items: [], itemCount: 0 }));
  }, []);

  useEffect(() => {
    if (!isStoreV2Enabled()) {
      router.replace('/');
      return;
    }
    fetchCart().finally(() => setLoading(false));
  }, [router, fetchCart]);

  const calculateFreteFromCep = useCallback(() => {
    const cepClean = cep.replace(/\D/g, '');
    if (cepClean.length !== 8 || !cart?.items?.length) return;
    const subtotal = (cart.items ?? []).reduce(
      (s, i) => s + (i.product?.priceCents ?? 0) * i.quantity,
      0,
    );
    fetch('/api/store-v2/checkout/calculate-shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep: cepClean, subtotalCents: subtotal }),
    })
      .then((r) => r.json())
      .then((data: { freeThresholdCents?: number; region?: string; error?: string }) => {
        if (!data.error && data.freeThresholdCents != null) {
          setShippingResult({
            freeThresholdCents: data.freeThresholdCents,
            region: data.region ?? 'sua região',
          });
        }
      })
      .catch(() => {});
  }, [cep, cart]);

  const removeItem = async (itemId: string) => {
    const sessionId = getOrCreateSessionId();
    await fetch(`/api/store-v2/cart/${itemId}`, {
      method: 'DELETE',
      headers: { 'X-Session-Id': sessionId },
    });
    const res = await fetch('/api/store-v2/cart', { headers: { 'X-Session-Id': sessionId } });
    setCart(await res.json());
    dispatchCartUpdated();
  };

  const updateQty = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    const sessionId = getOrCreateSessionId();
    await fetch(`/api/store-v2/cart/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Session-Id': sessionId },
      body: JSON.stringify({ quantity }),
    });
    const res = await fetch('/api/store-v2/cart', { headers: { 'X-Session-Id': sessionId } });
    setCart(await res.json());
    dispatchCartUpdated();
  };

  if (!isStoreV2Enabled()) return null;
  if (loading) {
    return (
      <>
        <Seo title="Carrinho | Me Joy" description="Seu carrinho" path="/cart" />
        <StorefrontHeader />
        <main className="min-h-screen py-16 flex flex-col items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
          {isStoreV2ConversionEnabled() && (
            <div className="sr-only" aria-hidden>
              <div data-testid="cart-progress" />
              <div data-testid="cart-trust" />
              <div data-testid="cart-upsell" />
            </div>
          )}
        </main>
        <StorefrontFooter />
      </>
    );
  }

  const subtotal = (cart?.items ?? []).reduce(
    (s, i) => s + (i.product?.priceCents ?? 0) * i.quantity,
    0,
  );

  return (
    <>
      <Seo title="Carrinho | Me Joy" description="Seu carrinho de compras" path="/cart" />
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <StorefrontHeader />
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Carrinho</h1>

          {!cart?.items?.length ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-8">Seu carrinho está vazio</p>
              <Link
                href="/"
                className="inline-flex px-6 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
              >
                Continuar comprando
              </Link>
              {isStoreV2ConversionEnabled() && (
                <div className="mt-8 max-w-md mx-auto space-y-4">
                  <CartProgressBar
                    subtotalCents={0}
                    freeThresholdCents={DEFAULT_FREE_THRESHOLD_CENTS}
                    hasCep={false}
                  />
                  <CartTrustMini />
                  <div data-testid="cart-upsell" aria-hidden />
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-24 md:pb-0">
              <div className="lg:col-span-2 space-y-4">
                {isStoreV2ConversionEnabled() && (
                  <div className="mb-4">
                    <label htmlFor="cart-cep" className="block text-sm font-medium text-gray-700 mb-1">
                      Calcular frete (opcional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="cart-cep"
                        type="text"
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
                  }}
                        onBlur={calculateFreteFromCep}
                        className="cart-cep-input flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={calculateFreteFromCep}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                      >
                        Calcular
                      </button>
                    </div>
                  </div>
                )}
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200"
                  >
                    <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 overflow-hidden relative">
                      {item.product?.images?.[0] && !shouldUsePackShot(item.product.images[0]) ? (
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ProductPackShot
                          title={(item.product as { title?: string })?.title ?? item.product?.name ?? ''}
                          variant="cart"
                          className="absolute inset-0"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/p/${item.product?.slug}`} className="font-medium text-gray-900 hover:text-brand">
                        {item.product?.name}
                      </Link>
                      <p className="text-sm text-gray-700">{item.product?.formDisplay}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 min-w-[2rem] text-center text-gray-900 font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.product?.priceCents != null && (
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.product.priceCents * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {isStoreV2ConversionEnabled() && (
                  <CartUpsell
                    firstItemSlug={cart.items?.[0]?.product?.slug ?? null}
                    onCartUpdate={fetchCart}
                  />
                )}
              </div>
              <div>
                {/* Barra fixa mobile: Finalizar compra sempre visível */}
                <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
                  <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-900">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900">{formatPrice(subtotal)}</p>
                    </div>
                    <Link
                      href={`/checkout?cartId=${cart.cartId}`}
                      className="flex-1 py-4 rounded-xl bg-orange-500 text-white font-semibold text-center hover:bg-orange-600 transition-colors shadow-md"
                    >
                      Finalizar compra
                    </Link>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                  {isStoreV2ConversionEnabled() && (
                    <div className="mb-4">
                      <CartProgressBar
                        subtotalCents={subtotal}
                        freeThresholdCents={shippingResult?.freeThresholdCents ?? DEFAULT_FREE_THRESHOLD_CENTS}
                        region={shippingResult?.region}
                        hasCep={!!cep && cep.replace(/\D/g, '').length === 8}
                      />
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-900 mb-2">Subtotal</p>
                  <p className="text-2xl font-bold text-gray-900 mb-4">{formatPrice(subtotal)}</p>
                  <p className="text-sm text-gray-700 mb-6">
                    Frete calculado no checkout
                  </p>
                  <Link
                    href={`/checkout?cartId=${cart.cartId}`}
                    className="block w-full py-4 rounded-xl bg-orange-500 text-white font-semibold text-center hover:bg-orange-600 transition-colors shadow-md"
                  >
                    Finalizar compra
                  </Link>
                  <Link href="/" className="block mt-4 text-center text-sm font-medium text-gray-900 hover:text-orange-600 hover:underline">
                    Continuar comprando
                  </Link>
                  {isStoreV2ConversionEnabled() && <CartTrustMini />}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}
