import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isStoreV2Enabled } from '@/lib/flags';
import { track } from '@/lib/analytics';
import Seo from '@/components/Seo';
import { getOrCreateSessionId } from '@/lib/store-v2/session';
import CheckoutHeader from '@/components/store-v2/checkout/CheckoutHeader';
import CheckoutSteps from '@/components/store-v2/checkout/CheckoutSteps';
import CheckoutBanner from '@/components/store-v2/checkout/CheckoutBanner';
import CheckoutFooter from '@/components/store-v2/checkout/CheckoutFooter';
import CustomerDataCard from '@/components/store-v2/checkout/CustomerDataCard';
import AddressForm from '@/components/store-v2/checkout/AddressForm';
import OrderSummaryCard from '@/components/store-v2/checkout/OrderSummaryCard';
import PaymentForm, { type CreditCardData } from '@/components/store-v2/checkout/PaymentForm';

const STORAGE_KEY = 'mejoy_checkout_form';

function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;
  return true;
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

const initialForm = {
  nome: '',
  email: '',
  telefone: '',
  cpfCnpj: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const cartId = (router.query.cartId as string) || '';

  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<{
    cartId: string;
    items: Array<{
      id: string;
      quantity: number;
      product?: {
        name: string;
        slug: string;
        priceCents: number | null;
        images: string[];
        title?: string;
      };
    }>;
  } | null>(null);
  const [form, setForm] = useState(initialForm);
  const [cepError, setCepError] = useState<string | null>(null);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [cepSuccess, setCepSuccess] = useState(false);
  const [shipping, setShipping] = useState<{
    shippingCents: number;
    shippingDays: number;
    freeThresholdCents: number;
    region: string;
    message: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [creditCard, setCreditCard] = useState<CreditCardData>({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isStoreV2Enabled()) {
      router.replace('/');
      return;
    }
  }, [router]);

  const beginCheckoutTracked = useRef(false);
  useEffect(() => {
    if (cartId) {
      const sessionId = getOrCreateSessionId();
      fetch('/api/store-v2/cart', { headers: { 'X-Session-Id': sessionId } })
        .then((r) => r.json())
        .then(setCart);
    }
  }, [cartId]);

  useEffect(() => {
    if (cart && cart.items?.length > 0 && !beginCheckoutTracked.current) {
      beginCheckoutTracked.current = true;
      const value = cart.items.reduce((s, i) => s + (i.product?.priceCents ?? 0) * i.quantity, 0);
      track('begin_checkout', { cart_id: cart.cartId, value: value / 100, currency: 'BRL', item_count: cart.items.length });
    }
  }, [cart]);

  // Persistência: restaurar do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setForm((f) => ({ ...f, ...parsed }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persistência: salvar ao preencher (debounce)
  const saveForm = useCallback(() => {
    try {
      const toSave = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        cpfCnpj: form.cpfCnpj,
        cep: form.cep,
        endereco: form.endereco,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // ignore
    }
  }, [form]);

  useEffect(() => {
    const t = setTimeout(saveForm, 500);
    return () => clearTimeout(t);
  }, [form, saveForm]);

  const subtotal = (cart?.items ?? []).reduce(
    (s, i) => s + (i.product?.priceCents ?? 0) * i.quantity,
    0,
  );

  const fetchViaCep = async (cepRaw: string) => {
    const cepClean = cepRaw.replace(/\D/g, '');
    if (cepClean.length !== 8) return;
    setCepError(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError('CEP não encontrado');
        setCepSuccess(false);
        return;
      }
      setForm((f) => ({
        ...f,
        endereco: data.logradouro ?? f.endereco,
        bairro: data.bairro ?? f.bairro,
        cidade: data.localidade ?? f.cidade,
        estado: data.uf ?? f.estado,
      }));
      setCepSuccess(true);
    } catch {
      setCepError('Erro ao buscar CEP');
      setCepSuccess(false);
    }
  };

  const calculateFrete = async () => {
    const cepClean = form.cep.replace(/\D/g, '');
    if (cepClean.length !== 8) return;
    await fetchViaCep(form.cep);
    const res = await fetch('/api/store-v2/checkout/calculate-shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep: cepClean, subtotalCents: subtotal }),
    });
    const data = await res.json();
    if (!data.error) setShipping(data);
  };

  const handleCepBlur = () => {
    const cepClean = form.cep.replace(/\D/g, '');
    if (cepClean.length === 8) {
      fetchViaCep(form.cep);
      calculateFrete();
    } else {
      setCepSuccess(false);
    }
  };

  const handleCpfBlur = () => {
    const cleaned = form.cpfCnpj.replace(/\D/g, '');
    if (cleaned.length === 11) {
      setCpfError(validateCPF(form.cpfCnpj) ? null : 'CPF inválido');
    } else {
      setCpfError(null);
    }
  };

  const cpfCleaned = form.cpfCnpj.replace(/\D/g, '');
  const cepClean = form.cep.replace(/\D/g, '');
  const hasValidCep = cepClean.length === 8 && !cepError;
  const canProceedStep1 =
    form.nome.trim().length >= 3 &&
    form.email.includes('@') &&
    form.telefone.replace(/\D/g, '').length >= 11 &&
    (cpfCleaned.length === 0 || (cpfCleaned.length === 11 && validateCPF(form.cpfCnpj))) &&
    hasValidCep &&
    form.endereco.trim() &&
    form.numero.trim() &&
    form.bairro.trim() &&
    form.cidade.trim() &&
    form.estado.trim();

  const shippingCents = shipping?.shippingCents ?? 2990;
  const total = subtotal + shippingCents;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (cpfCleaned.length === 11 && !validateCPF(form.cpfCnpj)) {
      setCpfError('CPF inválido');
      return;
    }
    if (paymentMethod === 'CREDIT_CARD') {
      const cc = creditCard;
      const num = cc.number.replace(/\s/g, '');
      if (!cc.holderName.trim() || num.length < 16 || !cc.expiryMonth || !cc.expiryYear || cc.ccv.length < 3) {
        setError('Preencha todos os dados do cartão');
        return;
      }
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        cartId,
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        cpfCnpj: form.cpfCnpj.replace(/\D/g, ''),
        cep: form.cep.replace(/\D/g, ''),
        endereco: form.endereco,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        paymentMethod,
      };
      if (paymentMethod === 'CREDIT_CARD') {
        body.creditCard = {
          holderName: creditCard.holderName,
          number: creditCard.number.replace(/\s/g, ''),
          expiryMonth: creditCard.expiryMonth.padStart(2, '0'),
          expiryYear: creditCard.expiryYear,
          ccv: creditCard.ccv,
        };
      }
      const res = await fetch('/api/store-v2/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.status === 'success') {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        const orderId = data.orderId;
        if (paymentMethod === 'PIX' && data.payment?.pixTransaction) {
          try {
            sessionStorage.setItem(
              `mejoy_pix_${orderId}`,
              JSON.stringify({
                qrCode: data.payment.pixTransaction.qrCode,
                qrCodeBase64: data.payment.pixTransaction.qrCodeBase64,
                invoiceUrl: data.payment.invoiceUrl,
              })
            );
          } catch {
            // ignore
          }
          router.push(`/checkout/sucesso?orderId=${orderId}`);
        } else if (data.payment?.invoiceUrl) {
          window.location.href = data.payment.invoiceUrl;
        } else {
          router.push(`/checkout/sucesso?orderId=${orderId}`);
        }
      } else {
        setError(data.message || 'Erro ao processar pagamento');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (!isStoreV2Enabled()) return null;

  const steps = [
    { label: 'Dados e Entrega' },
    { label: 'Pagamento' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Seo title="Checkout | MeJoy" description="Finalize sua compra" path="/checkout" />
      <CheckoutHeader />
      <main className="min-h-screen py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <CheckoutSteps currentStep={step} steps={steps} />
          </div>
          <div className="mb-6">
            <CheckoutBanner
              hasCep={hasValidCep}
              freeThresholdCents={shipping?.freeThresholdCents ?? 19000}
              region={shipping?.region}
              subtotalCents={subtotal}
            />
          </div>

          {!cartId || !cart?.items?.length ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-900 mb-4">Carrinho vazio.</p>
              <Link href="/" className="text-orange-600 font-medium hover:underline">
                Voltar à loja
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_400px] gap-8" data-store-input>
              <div className={`space-y-6 ${step === 1 ? 'pb-24 md:pb-0' : ''}`}>
                {step === 1 && (
                  <>
                    <CustomerDataCard
                      form={{
                        nome: form.nome,
                        email: form.email,
                        telefone: form.telefone,
                        cpfCnpj: form.cpfCnpj,
                      }}
                      setForm={(fn) =>
                        setForm((f) => {
                          const next = typeof fn === 'function' ? fn({ ...form }) : fn;
                          return { ...f, ...next };
                        })
                      }
                      cpfError={cpfError}
                      setCpfError={setCpfError}
                      onCpfBlur={handleCpfBlur}
                      formatCPF={formatCPF}
                    />
                    <AddressForm
                      form={{
                        cep: form.cep,
                        endereco: form.endereco,
                        numero: form.numero,
                        complemento: form.complemento,
                        bairro: form.bairro,
                        cidade: form.cidade,
                        estado: form.estado,
                      }}
                      setForm={(fn) =>
                        setForm((f) => {
                          const next = typeof fn === 'function' ? fn({ ...form }) : fn;
                          return { ...f, ...next };
                        })
                      }
                      cepError={cepError}
                      setCepError={setCepError}
                      cepSuccess={cepSuccess}
                      onCepBlur={handleCepBlur}
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!canProceedStep1}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-50 hover:bg-orange-600 transition-colors min-h-[48px]"
                      >
                        Continuar para Pagamento
                      </button>
                    </div>
                    {/* Sticky CTA mobile — evita scroll para encontrar botão */}
                    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!canProceedStep1}
                        className="w-full py-4 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-50 hover:bg-orange-600 transition-colors"
                      >
                        Continuar para Pagamento
                      </button>
                    </div>
                  </>
                )}
                {step === 2 && (
                  <PaymentForm
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    creditCard={creditCard}
                    setCreditCard={setCreditCard}
                    totalCents={total}
                    loading={loading}
                    error={error}
                    onSubmit={handleSubmit}
                    onBack={() => setStep(1)}
                  />
                )}
              </div>
              <div className="lg:sticky lg:top-24 lg:self-start">
                <OrderSummaryCard
                  items={cart?.items ?? []}
                  subtotalCents={subtotal}
                  shippingCents={shippingCents}
                  totalCents={total}
                  shippingDays={shipping?.shippingDays}
                />
              </div>
            </div>
          )}

          <CheckoutFooter />
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
