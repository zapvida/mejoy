'use client';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProductAppValue } from '@mejoy/api-contracts/mobile';
import { AppValueSection } from '@/components/mejoy-app/AppValueSection';
import { ZAPFARM_BUNDLES, ZAPFARM_SUBSCRIPTION } from '@/lib/flags';
import { hasVariants } from '@/config/zapfarm/product-variants';
import type { ZapfarmProductConfig } from '@/config/zapfarm/products';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { VariantSelector } from '@/components/zapfarm/checkout/VariantSelector';
import { BundleUpsell } from '@/components/zapfarm/checkout/BundleUpsell';
import { SubscriptionToggle } from '@/components/zapfarm/checkout/SubscriptionToggle';
import { Assinatura6MUpsell } from '@/components/zapfarm/checkout/Assinatura6MUpsell';
import { ComplianceFooter } from '@/components/zapfarm/shared/ComplianceFooter';
import { cn } from '@/lib/utils';
import { getProductColorClasses } from '@/lib/zapfarm/color-utils';
import { trackFunnelEvent } from '@/lib/funnel/events-client';

type Step = 1 | 2 | 3 | 4;
type PaymentMethod = 'PIX' | 'CREDIT_CARD' | null;
type DashboardReleaseState = 'idle' | 'checking' | 'pending' | 'error';
const PAID_PAYMENT_STATUSES = new Set(['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH']);

interface ProductCheckoutExperienceProps {
  productConfig: ZapfarmProductConfig;
  plans: {
    basico: any;
    completo: any;
    premium: any;
  };
  showVariants?: boolean;
  embedded?: boolean;
  reportId?: string | null;
  isTestMode?: boolean;
  productAppValue: ProductAppValue;
}

export default function ProductCheckoutExperience({
  productConfig,
  plans,
  showVariants = false,
  embedded = false,
  reportId,
  isTestMode = false,
  productAppValue,
}: ProductCheckoutExperienceProps) {
  const router = useRouter();
  const { plano: planoQuery, bundle: bundleQuery } = router.query;
  const queryReportId =
    typeof router.query.reportId === 'string'
      ? router.query.reportId
      : typeof router.query.id === 'string'
        ? router.query.id
        : '';
  const effectiveReportId = reportId || queryReportId;
  const isBundleMode = ZAPFARM_BUNDLES && typeof bundleQuery === 'string' && bundleQuery;
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedPlan, setSelectedPlan] = useState<string>((planoQuery as string) || 'completo');
  const [selectedVariant, setSelectedVariant] = useState<'core' | 'pro'>('pro');
  const [pricesOverride, setPricesOverride] = useState<{ basico: number; completo: number; premium: number } | null>(null);
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);
  const [bundlePriceReais, setBundlePriceReais] = useState<number | null>(null);
  const [isSubscription, setIsSubscription] = useState(ZAPFARM_SUBSCRIPTION);
  const [assinatura6M, setAssinatura6M] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [dashboardReleaseState, setDashboardReleaseState] = useState<DashboardReleaseState>('idle');
  const [dashboardReleaseMessage, setDashboardReleaseMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    cep: '',
    endereco: '',
    enderecoNumero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [creditCardData, setCreditCardData] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
    installments: 1,
  });
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const dashboardRedirectStartedRef = useRef(false);

  // Carregar dados do perfil do paciente ao montar o componente
  useEffect(() => {
    async function loadProfileData() {
      try {
        const response = await fetch('/api/profile/me-basic');
        const data = await response.json();
        
        if (data && (data.name || data.email || data.whatsapp)) {
          setFormData(prev => ({
            ...prev,
            nome: data.name || prev.nome,
            email: data.email || prev.email,
            telefone: data.whatsapp ? formatPhone(data.whatsapp) : prev.telefone,
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
        // Não mostrar erro ao usuário, apenas continuar com campos vazios
      }
    }

    loadProfileData();
  }, []);

  useEffect(() => {
    if (!embedded) return;
    trackFunnelEvent('report_inline_checkout_opened', {
      product: productConfig.slug,
      reportId: effectiveReportId || undefined,
    });
  }, [embedded, productConfig.slug, effectiveReportId]);

  useEffect(() => {
    if (typeof bundleQuery === 'string' && bundleQuery) setSelectedBundleId(bundleQuery);
  }, [bundleQuery]);

  // Buscar preço do bundle (para upsell ou modo bundle)
  useEffect(() => {
    if (!ZAPFARM_BUNDLES) return;
    const bid =
      selectedBundleId ||
      (productConfig.slug === 'sono' || productConfig.slug === 'ansiedade'
        ? 'sono-ansiedade'
        : productConfig.slug === 'intestino' || productConfig.slug === 'imunidade'
          ? 'intestino-imunidade'
          : null);
    if (!bid) return;
    fetch(`/api/zapfarm/prices?bundle=${bid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.priceReais != null) setBundlePriceReais(data.priceReais);
      })
      .catch(() => {});
  }, [productConfig.slug, selectedBundleId]);

  // Buscar preços por variante quando flag variants está on
  useEffect(() => {
    if (!showVariants || !hasVariants(productConfig.slug)) return;
    fetch(`/api/zapfarm/prices?product=${productConfig.slug}&variant=${selectedVariant}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.pricesCents) {
          setPricesOverride({
            basico: data.pricesCents.basico / 100,
            completo: data.pricesCents.completo / 100,
            premium: data.pricesCents.premium / 100,
          });
        }
      })
      .catch((err) => console.warn('[checkout] Erro ao buscar preços por variante:', err));
  }, [showVariants, productConfig.slug, selectedVariant]);

  // Converter planos para formato esperado (usa pricesOverride quando variante selecionada)
  const baseUnitPrices = pricesOverride ?? {
    basico: plans.basico.unitPrice || 0,
    completo: plans.completo.unitPrice || 0,
    premium: plans.premium.unitPrice || 0,
  };
  const plansArray = [
    {
      id: 'basico',
      name: plans.basico.name,
      price: plans.basico.price,
      unitPrice: baseUnitPrices.basico,
      period: plans.basico.period,
      badge: plans.basico.badge,
      features: plans.basico.features,
      description: plans.basico.description,
    },
    {
      id: 'completo',
      name: plans.completo.name,
      price: plans.completo.price,
      unitPrice: baseUnitPrices.completo,
      period: plans.completo.period,
      badge: plans.completo.badge,
      features: plans.completo.features,
      description: plans.completo.description,
      recommended: plans.completo.recommended,
    },
    {
      id: 'premium',
      name: plans.premium.name,
      price: plans.premium.price,
      unitPrice: baseUnitPrices.premium,
      period: plans.premium.period,
      badge: plans.premium.badge,
      features: plans.premium.features,
      description: plans.premium.description,
    },
  ];

  const derivedTestMode = useMemo(() => {
    if (isTestMode) return true;
    return plansArray.every((plan) => plan.unitPrice > 0 && plan.unitPrice < 100);
  }, [isTestMode, plansArray]);
  const maxCardInstallments = derivedTestMode ? 1 : 12;

  const shouldShowBundleUpsell = ZAPFARM_BUNDLES && !isBundleMode && !derivedTestMode;
  const shouldShowAssinaturaUpsell = !isBundleMode && !derivedTestMode;

  const selectedPlanData = plansArray.find((p) => p.id === selectedPlan) || plansArray[1];
  const ASSINATURA_6M_PARTNER = 2442;
  const ASSINATURA_6M_PUBLIC = 2942;
  const isAssinatura6MMode = assinatura6M && !isBundleMode;
  const baseTotalReais = isAssinatura6MMode
    ? ASSINATURA_6M_PUBLIC
    : isBundleMode && bundlePriceReais != null
      ? bundlePriceReais * quantity
      : selectedPlanData.unitPrice * quantity;
  const subscriptionDiscount = !isAssinatura6MMode && isSubscription ? 0.9 : 1;
  const displayTotalReais = isAssinatura6MMode ? baseTotalReais : baseTotalReais * subscriptionDiscount;

  const steps = [
    { number: 1, title: 'Plano', description: 'Escolha seu plano' },
    { number: 2, title: 'Dados', description: 'Seus dados' },
    { number: 3, title: 'Pagamento', description: 'Forma de pagamento' },
    { number: 4, title: 'Dashboard', description: 'Liberar acesso' },
  ];

  const handleNext = () => {
    if (embedded && currentStep === 1) {
      trackFunnelEvent('report_inline_checkout_started', {
        product: productConfig.slug,
        plan: selectedPlan,
        reportId: effectiveReportId || undefined,
      });
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const getPlanDescription = (description?: string) => {
    if (!derivedTestMode) {
      return description || null;
    }

    return 'Valor temporário de homologação para validar o pagamento e o redirecionamento em produção.';
  };

  const unlockDashboardAccess = async (paymentId: string) => {
    if (dashboardRedirectStartedRef.current) {
      return true;
    }

    setDashboardReleaseState('checking');
    setDashboardReleaseMessage('Confirmando o pagamento e liberando seu dashboard MeJoy...');

    try {
      const response = await fetch(
        `/api/asaas/payment-dashboard-link?paymentId=${encodeURIComponent(paymentId)}`
      );
      const data = await response.json();

      if (response.ok && data.magicUrl) {
        dashboardRedirectStartedRef.current = true;
        trackFunnelEvent('dashboard_redirect_after_payment', {
          product: productConfig.slug,
          plan: selectedPlan,
          paymentId,
          reportId: effectiveReportId || undefined,
        });
        window.location.href = data.magicUrl as string;
        return true;
      }

      if (response.status === 409) {
        setDashboardReleaseState('pending');
        setDashboardReleaseMessage(
          'Pagamento criado. Assim que a confirmação chegar no Asaas, você será enviado para o dashboard automaticamente.'
        );
        return false;
      }

      setDashboardReleaseState('error');
      setDashboardReleaseMessage(data?.message || 'Nao foi possivel liberar o dashboard agora.');
      return false;
    } catch (unlockError) {
      console.error('[checkout] Falha ao liberar dashboard:', unlockError);
      setDashboardReleaseState('error');
      setDashboardReleaseMessage('Falha ao liberar o dashboard. Tente novamente em alguns instantes.');
      return false;
    }
  };

  const refreshPaymentStatus = async (paymentId: string) => {
    try {
      const response = await fetch(
        `/api/asaas/payment-status?paymentId=${encodeURIComponent(paymentId)}`
      );
      const data = await response.json();
      const paymentStatus = data?.paymentStatus as string | undefined;

      if (paymentStatus) {
        setPaymentData((current: any) =>
          current
            ? {
                ...current,
                status: paymentStatus,
                paymentDate: data?.payment?.paymentDate || current.paymentDate || null,
                dueDate: data?.payment?.dueDate || current.dueDate || null,
              }
            : current
        );
      }

      if (paymentStatus && PAID_PAYMENT_STATUSES.has(paymentStatus)) {
        return unlockDashboardAccess(paymentId);
      }

      setDashboardReleaseState('pending');
      setDashboardReleaseMessage(
        paymentMethod === 'PIX'
          ? 'Estamos aguardando a compensacao do PIX. Quando confirmar, o dashboard abre sozinho.'
          : 'Estamos aguardando a confirmacao final do cartao. O dashboard sera liberado automaticamente.'
      );
      return false;
    } catch (statusError) {
      console.error('[checkout] Falha ao atualizar status do pagamento:', statusError);
      setDashboardReleaseState('error');
      setDashboardReleaseMessage('Nao foi possivel consultar o status do pagamento agora.');
      return false;
    }
  };

  const handleCEPChange = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length === 8) {
      setIsLoadingCEP(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await response.json();
        if (!data.erro && data.localidade) {
          setFormData(prev => ({
            ...prev,
            cep: formatCEP(cleaned),
            cidade: data.localidade || prev.cidade,
            estado: data.uf || prev.estado,
            bairro: data.bairro || prev.bairro,
            endereco: data.logradouro || prev.endereco,
          }));
        } else {
          // CEP não encontrado, mas não mostrar erro - usuário pode preencher manualmente
          console.warn('CEP não encontrado:', cleaned);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        // Não mostrar erro ao usuário - ele pode preencher manualmente
      } finally {
        setIsLoadingCEP(false);
      }
    }
  };

  useEffect(() => {
    setCreditCardData((previous) =>
      previous.installments > maxCardInstallments
        ? {
            ...previous,
            installments: 1,
          }
        : previous
    );
  }, [maxCardInstallments]);

  useEffect(() => {
    if (currentStep !== 4 || !paymentData?.id || dashboardRedirectStartedRef.current) {
      return;
    }

    let cancelled = false;

    const sync = async () => {
      if (cancelled || dashboardRedirectStartedRef.current) {
        return;
      }

      const currentStatus = paymentData?.status as string | undefined;
      if (currentStatus && PAID_PAYMENT_STATUSES.has(currentStatus)) {
        await unlockDashboardAccess(paymentData.id as string);
        return;
      }

      await refreshPaymentStatus(paymentData.id as string);
    };

    void sync();
    const interval = window.setInterval(() => {
      void sync();
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [currentStep, paymentData?.id, paymentData?.status]);

  const handleFinalizePayment = async () => {
    setError(null);
    setIsProcessingPayment(true);

    try {
      const payload: any = {
        product: isBundleMode ? undefined : productConfig.slug,
        plano: isBundleMode ? undefined : selectedPlan,
        bundleId: isBundleMode ? selectedBundleId : undefined,
        quantity: assinatura6M && !isBundleMode ? 1 : quantity,
        paymentMethod,
        reportId: effectiveReportId || '',
        ...(showVariants && hasVariants(productConfig.slug) && !isBundleMode && { variant: selectedVariant }),
        ...(ZAPFARM_SUBSCRIPTION && !assinatura6M && { isSubscription }),
        ...(assinatura6M && !isBundleMode && { assinatura6M: true, isPartner: false }),
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone.replace(/\D/g, ''),
        cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, ''),
        endereco: formData.endereco,
        enderecoNumero: formData.enderecoNumero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
      };

      if (paymentMethod === 'CREDIT_CARD') {
        payload.creditCard = {
          holderName: creditCardData.holderName,
          number: creditCardData.number.replace(/\s/g, ''),
          expiryMonth: creditCardData.expiryMonth,
          expiryYear: creditCardData.expiryYear,
          ccv: creditCardData.ccv,
        };
        payload.installments = maxCardInstallments === 1 ? 1 : creditCardData.installments;
      }

      const response = await fetch('/api/asaas/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Mapear dados do pagamento corretamente, especialmente para PIX
        const payment = data.payment;
        const mappedPayment = {
          ...payment,
          // Extrair dados do PIX se existirem
          pixQrCode: payment.pixTransaction?.qrCode || null,
          pixQrCodeBase64: payment.pixTransaction?.qrCodeBase64 || null,
          pixValue: payment.pixTransaction?.value || null,
        };
        
        setPaymentData(mappedPayment);
        
        if (paymentMethod === 'PIX') {
          // Validar que temos os dados do PIX antes de avançar
          if (!mappedPayment.pixQrCode && !mappedPayment.pixQrCodeBase64) {
            // Se temos paymentLink ou invoiceUrl, podemos usar como fallback
            if (data.paymentLink || payment.invoiceUrl) {
              console.log('[checkout] QR Code não disponível, mas temos link de pagamento:', data.paymentLink || payment.invoiceUrl);
              // Tentar buscar o QR Code novamente após alguns segundos
              if (data.retryable && payment.id) {
                console.log('[checkout] Tentando buscar QR Code novamente em 3 segundos...');
                setTimeout(async () => {
                  try {
                    const retryResponse = await fetch(`/api/asaas/payment-status?paymentId=${payment.id}`);
                    const retryData = await retryResponse.json();
                    if (retryData.payment?.pixTransaction?.qrCode || retryData.payment?.pixTransaction?.qrCodeBase64) {
                      setPaymentData({
                        ...mappedPayment,
                        pixQrCode: retryData.payment.pixTransaction.qrCode || null,
                        pixQrCodeBase64: retryData.payment.pixTransaction.qrCodeBase64 || null,
                        pixValue: retryData.payment.pixTransaction.value || null,
                      });
                      setCurrentStep(4);
                    } else {
                      // Se ainda não tiver QR Code, usar o link de pagamento
                      window.open(data.paymentLink || payment.invoiceUrl, '_blank');
                      setError('QR Code não disponível. Abrindo link de pagamento em nova aba...');
                    }
                  } catch (retryError) {
                    console.error('[checkout] Erro ao buscar QR Code novamente:', retryError);
                    window.open(data.paymentLink || payment.invoiceUrl, '_blank');
                    setError('QR Code não disponível. Abrindo link de pagamento em nova aba...');
                  }
                }, 3000);
                setIsProcessingPayment(false);
                return;
              } else {
                // Abrir link de pagamento diretamente
                window.open(data.paymentLink || payment.invoiceUrl, '_blank');
                setError('QR Code não disponível. Abrindo link de pagamento em nova aba...');
                setIsProcessingPayment(false);
                return;
              }
            } else {
              setError('Erro ao gerar QR Code PIX. Tente novamente.');
              setIsProcessingPayment(false);
              return;
            }
          }
          setIsProcessingPayment(false);
          setDashboardReleaseState('pending');
          setDashboardReleaseMessage(
            'Pagamento criado. Assim que o PIX for compensado, voce sera enviado para o dashboard MeJoy.'
          );
          setCurrentStep(4);
        } else {
          setIsProcessingPayment(false);
          setCurrentStep(4);
          await unlockDashboardAccess(payment.id);
        }
      } else {
        // Erro retornado pela API
        const errorMessage = data.message || data.details || 'Erro ao processar pagamento. Tente novamente.';
        setError(errorMessage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsProcessingPayment(false);
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsProcessingPayment(false);
    }
  };

  const validateStep1 = () => {
    if (isBundleMode) return selectedBundleId != null && quantity >= 1 && quantity <= 10 && bundlePriceReais != null;
    return selectedPlan !== '' && quantity >= 1 && quantity <= 10;
  };
  const validateStep2 = () => {
    return formData.nome.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.telefone.trim() !== '' &&
           formData.cpfCnpj.trim() !== '' &&
           formData.cep.trim() !== '' &&
           formData.endereco.trim() !== '' &&
           formData.cidade.trim() !== '' &&
           formData.estado.trim() !== '';
  };
  const validateStep3 = () => {
    if (!paymentMethod) return false;
    if (paymentMethod === 'CREDIT_CARD') {
      return creditCardData.holderName.trim() !== '' &&
             creditCardData.number.replace(/\s/g, '').length === 16 &&
             creditCardData.expiryMonth !== '' &&
             creditCardData.expiryYear !== '' &&
             creditCardData.ccv.length === 3;
    }
    return true;
  };

  const { colors } = productConfig;
  const colorClasses = getProductColorClasses(colors);
  const shellClass = embedded
    ? 'rounded-[2rem] border border-white/15 bg-white/95 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur sm:p-6 lg:p-8'
    : `min-h-screen bg-gradient-to-br ${colorClasses.gradientBg}`;
  const sectionTopClass = embedded ? '' : 'pt-20 sm:pt-16 md:pt-20';
  const containerClass = embedded
    ? 'mx-auto max-w-7xl'
    : 'container mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:py-12';
  const checkoutIntro = embedded
    ? 'Finalize aqui mesmo. Relatorio, oferta e pagamento conectados no mesmo contexto.'
    : 'Finalize sua compra com o mesmo fluxo validado em producao.';

  return (
    <>
      {!embedded && (
        <Head>
          <title>Checkout - {productConfig.commercialName} | MeJoy</title>
          <meta name="description" content={`Finalize sua compra de ${productConfig.commercialName}`} />
        </Head>
      )}

      <div className={shellClass}>
        {!embedded && <HeaderZapfarm />}

        <div className={sectionTopClass}>
          <div className={containerClass}>
            {embedded && (
              <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,_#08151f_0%,_#10242b_52%,_#0f3b2f_100%)] p-6 text-white shadow-[0_24px_60px_rgba(8,21,31,0.16)]">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Checkout no relatorio</p>
                <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
                  Seu protocolo e o pagamento estao na mesma pagina.
                </h3>
                <p className="mt-3 max-w-3xl text-sm text-slate-200 sm:text-base">
                  {checkoutIntro}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-emerald-50">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Pagamento seguro via Asaas</span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Redirecionamento automatico para o dashboard</span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Pedido refletido no admin MeJoy</span>
                </div>
              </div>
            )}

            <div className="mb-6 sm:mb-8">
              <AppValueSection
                value={productAppValue}
                surface={embedded ? 'report' : 'checkout'}
                compact
                title="Ganhe acesso ao App MeJoy Premium neste checkout"
              />
            </div>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-fade-in">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900 mb-1">Erro ao processar pagamento</h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Progress Steps */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={cn(
                          "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all shadow-lg",
                          currentStep >= step.number
                            ? `bg-gradient-to-r ${colorClasses.stepGradient} text-white scale-110`
                            : 'bg-white text-gray-400 border-2 border-gray-300'
                        )}
                      >
                        {currentStep > step.number ? '✓' : step.number}
                      </div>
                      <div className="mt-2 text-center hidden sm:block">
                        <div className={cn(
                          "text-xs sm:text-sm font-semibold",
                          currentStep >= step.number ? colorClasses.text : 'text-gray-500'
                        )}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "h-1 flex-1 mx-2 sm:mx-4 transition-all",
                          currentStep > step.number ? `bg-gradient-to-r ${colorClasses.stepGradient}` : 'bg-gray-200'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-2">
                {/* Step 1: Escolha do Plano */}
                {currentStep === 1 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {isBundleMode ? 'Bundle selecionado' : 'Escolha seu plano'}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                      {isBundleMode && selectedBundleId
                        ? `${selectedBundleId.replace(/-/g, ' + ')}`
                        : `${productConfig.commercialName} - ${productConfig.protocolTitle}`}
                    </p>

                    {!isBundleMode && showVariants && hasVariants(productConfig.slug) && (
                      <VariantSelector
                        productSlug={productConfig.slug}
                        selected={selectedVariant}
                        onSelect={setSelectedVariant}
                        colorClasses={colorClasses}
                      />
                    )}

                    {shouldShowBundleUpsell && (
                      <BundleUpsell
                        currentProductSlug={productConfig.slug}
                        bundlePriceReais={bundlePriceReais}
                        onSelect={(id) => setSelectedBundleId(id)}
                        colorClasses={colorClasses}
                        basePath={typeof window !== 'undefined' ? window.location.href : ''}
                      />
                    )}

                    {!isBundleMode && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                      {plansArray.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={cn(
                            "p-5 sm:p-6 rounded-xl border-2 text-left transition-all relative",
                            selectedPlan === plan.id
                              ? `${colorClasses.border500} bg-gradient-to-br ${colorClasses.gradientBg} shadow-lg scale-105`
                              : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                          )}
                        >
                          {plan.badge && (
                            <div className={cn(
                              "absolute top-3 right-3 px-2 sm:px-3 py-1 rounded-full text-white text-xs font-bold",
                              colorClasses.bg600
                            )}>
                              {plan.badge}
                            </div>
                          )}
                          <div className="font-bold text-gray-900 text-base sm:text-lg mb-2">{plan.name}</div>
                          <div className={cn("font-bold text-xl sm:text-2xl mb-1", colorClasses.text)}>
                            {formatCurrency(plan.unitPrice)}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {derivedTestMode
                              ? `PIX: ${formatCurrency(Math.round(plan.unitPrice * 0.9 * 100) / 100)} (-10%) • Cartao: ${formatCurrency(plan.unitPrice)} a vista`
                              : `PIX: ${formatCurrency(Math.round(plan.unitPrice * 0.9 * 100) / 100)} (-10%) • 12x ${formatCurrency(Math.round(plan.unitPrice / 12 * 100) / 100)} sem juros`}
                          </div>
                          {getPlanDescription(plan.description) && (
                            <p className="text-xs text-gray-600 mb-3">{getPlanDescription(plan.description)}</p>
                          )}
                          <ul className="space-y-1.5 mt-3">
                            {plan.features.slice(0, 2).map((feature: string, index: number) => (
                              <li key={index} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                                <span className={cn("flex-shrink-0 mt-0.5", colorClasses.text)}>✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>
                    )}

                    {shouldShowAssinaturaUpsell && (
                      <Assinatura6MUpsell
                        checked={assinatura6M}
                        onChange={setAssinatura6M}
                        pricePartnerReais={ASSINATURA_6M_PARTNER}
                        pricePublicReais={ASSINATURA_6M_PUBLIC}
                        isPartner={false}
                        colorClasses={colorClasses}
                      />
                    )}
                    {ZAPFARM_SUBSCRIPTION && !isBundleMode && !assinatura6M && (
                      <SubscriptionToggle
                        checked={isSubscription}
                        onChange={setIsSubscription}
                        priceReais={selectedPlanData.unitPrice}
                        colorClasses={colorClasses}
                      />
                    )}
                    {ZAPFARM_SUBSCRIPTION && isBundleMode && bundlePriceReais != null && (
                      <SubscriptionToggle
                        checked={isSubscription}
                        onChange={setIsSubscription}
                        priceReais={bundlePriceReais}
                        colorClasses={colorClasses}
                      />
                    )}

                    {/* Seletor de Quantidade (oculto quando Assinatura 6m) */}
                    {!assinatura6M && (
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Quantidade
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className={cn(
                            "w-10 h-10 rounded-lg font-bold transition-all",
                            quantity <= 1
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : `${colorClasses.bg600} text-white hover:opacity-80`
                          )}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setQuantity(Math.min(10, Math.max(1, val)));
                          }}
                          className="w-20 text-center text-lg font-bold bg-white text-gray-900 border-2 border-gray-300 rounded-lg py-2"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          disabled={quantity >= 10}
                          className={cn(
                            "w-10 h-10 rounded-lg font-bold transition-all",
                            quantity >= 10
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : `${colorClasses.bg600} text-white hover:opacity-80`
                          )}
                        >
                          +
                        </button>
                        <div className="flex-1">
                          <div className="text-sm text-gray-600">
                            {quantity} {quantity === 1 ? 'unidade' : 'unidades'}
                          </div>
                          <div className={cn("text-lg font-bold", colorClasses.text)}>
                            Total: {formatCurrency(displayTotalReais)}
                          </div>
                        </div>
                      </div>
                    </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleNext}
                        disabled={!validateStep1()}
                        className={cn(
                          "px-8 py-4 text-white rounded-full font-bold text-base hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                          `bg-gradient-to-r ${colorClasses.gradientCTA}`
                        )}
                      >
                        Continuar →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Dados Pessoais */}
                {currentStep === 2 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      Seus dados
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                      Preencha suas informações para continuar
                    </p>

                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                            Nome completo *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                              E-mail *
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                              WhatsApp *
                            </label>
                            <input
                              type="tel"
                              required
                              value={formData.telefone}
                              onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                              placeholder="(11) 99999-9999"
                              maxLength={15}
                              className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                            CPF/CNPJ *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.cpfCnpj}
                            onChange={(e) => setFormData({ ...formData, cpfCnpj: formatCPF(e.target.value) })}
                            placeholder="000.000.000-00"
                            maxLength={18}
                            className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                              CEP * {isLoadingCEP && <span className="text-xs text-gray-500">(Buscando...)</span>}
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.cep}
                              onChange={(e) => {
                                const formatted = formatCEP(e.target.value);
                                const cleaned = formatted.replace(/\D/g, '');
                                setFormData({ ...formData, cep: formatted });
                                // Buscar automaticamente quando tiver 8 dígitos
                                if (cleaned.length === 8) {
                                  handleCEPChange(formatted);
                                }
                              }}
                              onBlur={(e) => {
                                // Também buscar ao sair do campo se tiver 8 dígitos
                                const cleaned = e.target.value.replace(/\D/g, '');
                                if (cleaned.length === 8) {
                                  handleCEPChange(e.target.value);
                                }
                              }}
                              placeholder="00000-000"
                              maxLength={9}
                              disabled={isLoadingCEP}
                              className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                              Endereço completo *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.endereco}
                              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                              className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Número *</label>
                            <input
                              type="text"
                              required
                              value={formData.enderecoNumero}
                              onChange={(e) => setFormData({ ...formData, enderecoNumero: e.target.value })}
                              className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Complemento</label>
                            <input
                              type="text"
                              value={formData.complemento}
                              onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                              className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Bairro</label>
                            <input
                              type="text"
                              value={formData.bairro}
                              onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                              className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Cidade *</label>
                            <input
                              type="text"
                              required
                              value={formData.cidade}
                              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                              className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Estado *</label>
                            <input
                              type="text"
                              required
                              value={formData.estado}
                              onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                              maxLength={2}
                              placeholder="SP"
                              className="w-full px-4 py-3 text-sm sm:text-base bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-bold text-base hover:bg-gray-300 transition-all"
                        >
                          ← Voltar
                        </button>
                        <button
                          type="submit"
                          disabled={!validateStep2()}
                          className={cn(
                            "px-8 py-4 text-white rounded-full font-bold text-base hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                            `bg-gradient-to-r ${colorClasses.gradientCTA}`
                          )}
                        >
                          Continuar →
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 3: Método de Pagamento */}
                {currentStep === 3 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      Forma de pagamento
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                      Escolha como deseja pagar
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                      <button
                        onClick={() => setPaymentMethod('PIX')}
                        className={cn(
                          "p-6 rounded-xl border-2 text-left transition-all",
                          paymentMethod === 'PIX'
                            ? `${colorClasses.border500} bg-gradient-to-br ${colorClasses.gradientBg} shadow-lg scale-105`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        )}
                      >
                        <div className="text-4xl mb-3">💳</div>
                        <div className="font-bold text-gray-900 text-lg mb-2">PIX</div>
                        <div className="text-sm text-gray-600">
                          Aprovação instantânea • Sem taxas adicionais
                        </div>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('CREDIT_CARD')}
                        className={cn(
                          "p-6 rounded-xl border-2 text-left transition-all",
                          paymentMethod === 'CREDIT_CARD'
                            ? `${colorClasses.border500} bg-gradient-to-br ${colorClasses.gradientBg} shadow-lg scale-105`
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        )}
                      >
                        <div className="text-4xl mb-3">💳</div>
                        <div className="font-bold text-gray-900 text-lg mb-2">Cartão de Crédito</div>
                        <div className="text-sm text-gray-600">
                          {derivedTestMode
                            ? 'Cobranca simples no cartao para homologacao'
                            : 'Parcelamento em ate 12x • Aprovacao imediata'}
                        </div>
                      </button>
                      </div>

                    {paymentMethod === 'CREDIT_CARD' && (
                      <form onSubmit={(e) => { e.preventDefault(); handleFinalizePayment(); }} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nome no cartão *
                          </label>
                          <input
                            type="text"
                            required
                            value={creditCardData.holderName}
                            onChange={(e) => setCreditCardData({ ...creditCardData, holderName: e.target.value.toUpperCase() })}
                            placeholder="NOME COMO ESTÁ NO CARTÃO"
                            className="w-full px-4 py-3 text-sm bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Número do cartão *
                          </label>
                          <input
                            type="text"
                            required
                            value={creditCardData.number}
                            onChange={(e) => setCreditCardData({ ...creditCardData, number: formatCardNumber(e.target.value) })}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="w-full px-4 py-3 text-sm bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mês *</label>
                            <input
                              type="text"
                              required
                              value={creditCardData.expiryMonth}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                                if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
                                  setCreditCardData({ ...creditCardData, expiryMonth: val });
                                }
                              }}
                              placeholder="MM"
                              maxLength={2}
                              className="w-full px-4 py-3 text-sm bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ano *</label>
                            <input
                              type="text"
                              required
                              value={creditCardData.expiryYear}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setCreditCardData({ ...creditCardData, expiryYear: val });
                              }}
                              placeholder="AAAA"
                              maxLength={4}
                              className="w-full px-4 py-3 text-sm bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">CVV *</label>
                            <input
                              type="text"
                              required
                              value={creditCardData.ccv}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                                setCreditCardData({ ...creditCardData, ccv: val });
                              }}
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-3 text-sm bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                      </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Parcelas
                          </label>
                          <select
                            value={creditCardData.installments}
                            onChange={(e) => setCreditCardData({ ...creditCardData, installments: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 text-sm bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            {Array.from({ length: maxCardInstallments }, (_, index) => index + 1).map(num => (
                              <option key={num} value={num}>
                                {num}x de {formatCurrency(selectedPlanData.unitPrice * quantity / num)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </form>
                      )}

                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={handleBack}
                        disabled={isProcessingPayment}
                        className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-bold text-base hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Voltar
                      </button>
                      {paymentMethod === 'PIX' ? (
                        <button
                          onClick={handleFinalizePayment}
                          disabled={!validateStep3() || isProcessingPayment}
                          className={cn(
                            "px-8 py-4 text-white rounded-full font-bold text-base hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                            `bg-gradient-to-r ${colorClasses.gradientCTA}`
                          )}
                        >
                          {isProcessingPayment ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Gerando PIX...
                            </>
                          ) : (
                            'Gerar PIX →'
                          )}
                        </button>
                      ) : (
                      <button
                          type="button"
                          onClick={handleFinalizePayment}
                          disabled={!validateStep3() || isProcessingPayment}
                        className={cn(
                            "px-8 py-4 text-white rounded-full font-bold text-base hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                          `bg-gradient-to-r ${colorClasses.gradientCTA}`
                        )}
                      >
                          {isProcessingPayment ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processando...
                            </>
                          ) : (
                            'Finalizar pagamento →'
                          )}
                      </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmacao / acesso ao dashboard */}
                {currentStep === 4 && paymentData && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
                      {paymentMethod === 'PIX' ? 'Pagamento PIX' : 'Pagamento enviado'}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">
                      {paymentMethod === 'PIX'
                        ? 'Escaneie o QR Code ou copie o codigo PIX. Assim que o pagamento compensar, voce vai direto para o dashboard.'
                        : 'Estamos validando seu pagamento para liberar o dashboard MeJoy automaticamente.'}
                    </p>

                    <div className="max-w-md mx-auto">
                      {paymentMethod === 'PIX' && paymentData.pixQrCodeBase64 ? (
                        <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6 flex justify-center">
                          <img
                            src={`data:image/png;base64,${paymentData.pixQrCodeBase64}`}
                            alt="QR Code PIX"
                            className="w-64 h-64"
                            onError={(e) => {
                              console.error('Erro ao carregar QR Code');
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6 text-center">
                          <p className="text-yellow-800 text-sm">
                            ⚠️ QR Code não disponível. Use o código PIX abaixo.
                          </p>
                        </div>
                      )}
                      
                      {paymentMethod === 'PIX' && paymentData.pixQrCode ? (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Codigo PIX (copiar e colar)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={paymentData.pixQrCode}
                              className="flex-1 px-4 py-2 text-xs border-2 border-gray-300 rounded-lg bg-white font-mono"
                              onClick={(e) => (e.target as HTMLInputElement).select()}
                            />
                            <button
                              type="button"
                              onClick={async (e) => {
                                try {
                                  await navigator.clipboard.writeText(paymentData.pixQrCode);
                                  // Feedback visual melhorado
                                  const btn = e.currentTarget as HTMLButtonElement;
                                  const originalText = btn.textContent;
                                  btn.textContent = '✓ Copiado!';
                                  btn.classList.add('bg-green-600');
                                  setTimeout(() => {
                                    btn.textContent = originalText;
                                    btn.classList.remove('bg-green-600');
                                  }, 2000);
                                } catch {
                                  // Fallback para navegadores antigos
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  if (input) {
                                    input.select();
                                    document.execCommand('copy');
                                    alert('Código PIX copiado!');
                                  }
                                }
                              }}
                              className={cn(
                                "px-4 py-2 text-white rounded-lg font-semibold text-sm transition-colors",
                                colorClasses.bg600,
                                "hover:opacity-90"
                              )}
                            >
                              Copiar
                            </button>
                          </div>
                        </div>
                      ) : paymentMethod === 'PIX' ? (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                          <p className="text-red-800 text-sm text-center">
                            ⚠️ Erro ao gerar codigo PIX. Por favor, tente novamente ou entre em contato com o suporte.
                          </p>
                        </div>
                      ) : null}

                      <div className={cn("p-6 rounded-xl border-2 mb-6", colorClasses.bg, colorClasses.border)}>
                        <div className="text-center">
                          <div className={cn("text-3xl font-bold mb-2", colorClasses.text)}>
                            {formatCurrency(
                              paymentData.pixValue ||
                              paymentData.value ||
                              displayTotalReais
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {paymentData.dueDate ? (
                              <>Vencimento: {new Date(paymentData.dueDate).toLocaleDateString('pt-BR')}</>
                            ) : (
                              <>Pagamento valido por 3 dias</>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          'rounded-xl border p-4 mb-6 text-center',
                          dashboardReleaseState === 'error'
                            ? 'border-red-200 bg-red-50'
                            : dashboardReleaseState === 'checking'
                              ? 'border-amber-200 bg-amber-50'
                              : 'border-emerald-200 bg-emerald-50'
                        )}
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {dashboardReleaseState === 'checking'
                            ? 'Liberando seu dashboard...'
                            : dashboardReleaseState === 'error'
                              ? 'Precisamos de uma nova tentativa'
                              : 'Dashboard MeJoy conectado a esta compra'}
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          {dashboardReleaseMessage ||
                            'Quando o pagamento for confirmado, o pedido aparece no dashboard do cliente e no admin automaticamente.'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          void refreshPaymentStatus(paymentData.id as string);
                        }}
                        className={cn(
                          'w-full px-8 py-4 text-white rounded-full font-bold text-base hover:shadow-lg transition-all',
                          `bg-gradient-to-r ${colorClasses.gradientCTA}`
                        )}
                      >
                        {dashboardReleaseState === 'checking'
                          ? 'Confirmando...'
                          : 'Ja paguei, liberar meu dashboard'}
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="mt-3 w-full rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Ir para o dashboard MeJoy
                      </button>
                      </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Resumo */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 lg:sticky lg:top-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Resumo do pedido</h2>
                  
                  {/* Imagem do produto */}
                  {productConfig.image && (
                    <div className="mb-4 sm:mb-6 flex justify-center">
                      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                        {productConfig.image.endsWith('.svg') ? (
                          <img
                            src={productConfig.image}
                            alt={productConfig.commercialName}
                            className="w-full h-full object-contain p-4"
                          />
                        ) : (
                          <Image
                            src={productConfig.image}
                            alt={productConfig.commercialName}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 640px) 192px, 224px"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="border-b border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
                    <div className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                      {isBundleMode && selectedBundleId
                        ? selectedBundleId.replace(/-/g, ' + ')
                        : productConfig.commercialName}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {isBundleMode ? 'Bundle' : selectedPlanData.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Quantidade: {quantity} {quantity === 1 ? 'unidade' : 'unidades'}
                    </div>
                    <div className={cn("font-bold text-xl sm:text-2xl mt-2", colorClasses.text)}>
                      {formatCurrency(displayTotalReais)}
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="text-xs sm:text-sm text-gray-600 font-semibold">Você receberá:</div>
                    {(isBundleMode ? ['2 frascos do combo', 'Entrega em todo o Brasil'] : selectedPlanData.features).map((feature: string, index: number) => (
                      <div key={index} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2 leading-relaxed">
                        <span className={cn("flex-shrink-0 mt-0.5", colorClasses.text)}>✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      ✓ Pagamento seguro via Asaas<br />
                      ✓ Garantia de satisfação<br />
                      ✓ Suporte 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <ComplianceFooter />
          </div>
        </div>
      </div>
    </>
  );
}
