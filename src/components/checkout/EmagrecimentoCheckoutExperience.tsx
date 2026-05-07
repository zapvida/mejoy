'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  CreditCard,
  Lock,
  MapPin,
  ShieldCheck,
  UserRound,
  Wallet,
} from 'lucide-react';
import RefinedInput from '@/components/ui/RefinedInput';
import { RefinedButton } from '@/components/ui/RefinedButton';
import { RefinedCard } from '@/components/ui/RefinedCard';
import {
  emagrecimentoLegalNote,
  emagrecimentoPlans,
  getPlanById,
  planIdToApiKey,
} from '@/config/zapfarm/emagrecimento-plans';
import { estimateWeightLossRangeKg } from '@/lib/emagrecimento/medicationCards';
import {
  TREATMENT_TRACKS,
  TREATMENT_TRACKS_BY_ID,
} from '@/lib/emagrecimento/treatmentTracks';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { cn } from '@/lib/utils';
import {
  trilhaFromPreferencia,
  type EmagrecimentoTrilha,
} from '@/lib/emagrecimento/checkoutUrls';

type PaymentMethod = 'PIX' | 'CREDIT_CARD';
type Step = 1 | 2 | 3;

const TRACKS = TREATMENT_TRACKS.map((track) => ({
  id: track.id,
  title: track.id === 'alternativas_clinicas' ? 'Alternativas clinicas' : `Programa com ${track.shortTitle}`,
  shortTitle: track.shortTitle,
  badge: track.badge,
  subtitle: track.subtitle,
  principle: track.principle,
  potency: track.potency,
  certainty: track.certainty,
  efficacy: track.efficacy,
  estimate: track.estimate,
  safety: track.safety,
  bestFor: track.bestFor,
}));

const PAID_STATUSES = new Set(['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH']);

interface PrefillProfile {
  name?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  weightKg?: number | null;
}

interface CheckoutFormData {
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  cep: string;
  endereco: string;
  enderecoNumero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface CreditCardFormData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  installments: number;
}

interface EmagrecimentoCheckoutExperienceProps {
  reportId?: string | null;
  triageId?: string | null;
  defaultPlanId?: string;
  defaultTrilha?: EmagrecimentoTrilha;
  defaultPrincipio?: string;
  appReturnUrl?: string | null;
  prefillProfile?: PrefillProfile | null;
  allowPlanSelection?: boolean;
  mode?: 'inline' | 'standalone';
  selectionVariant?: 'full' | 'locked';
  onSelectPlan?: (planId: string) => void;
  onSelectTrack?: (trilha: EmagrecimentoTrilha) => void;
  onRequestEditSelection?: () => void;
}

const initialFormData = (prefillProfile?: PrefillProfile | null): CheckoutFormData => ({
  nome: prefillProfile?.name || '',
  email: prefillProfile?.email || '',
  telefone: prefillProfile?.whatsapp ? formatPhone(prefillProfile.whatsapp) : '',
  cpfCnpj: '',
  cep: '',
  endereco: '',
  enderecoNumero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
});

export function EmagrecimentoCheckoutExperience({
  reportId,
  triageId,
  defaultPlanId = 'programa-3m',
  defaultTrilha = 'alternativas_clinicas',
  defaultPrincipio,
  appReturnUrl,
  prefillProfile,
  allowPlanSelection = false,
  mode = 'inline',
  selectionVariant = 'full',
  onSelectPlan,
  onSelectTrack,
  onRequestEditSelection: _onRequestEditSelection,
}: EmagrecimentoCheckoutExperienceProps) {
  const resolvedDefaultTrilha =
    defaultTrilha === 'alternativas_clinicas'
      ? trilhaFromPreferencia(defaultPrincipio)
      : defaultTrilha;
  const [selectedPlan, setSelectedPlan] = useState(defaultPlanId);
  const [selectedTrilha, setSelectedTrilha] = useState<EmagrecimentoTrilha>(resolvedDefaultTrilha);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);
  const [pixQrCodeText, setPixQrCodeText] = useState<string | null>(null);
  const [fallbackPaymentLink, setFallbackPaymentLink] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [copiedPixCode, setCopiedPixCode] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData(prefillProfile));
  const [creditCardData, setCreditCardData] = useState<CreditCardFormData>({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
    installments: 1,
  });

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const redirectHandledRef = useRef(false);

  const plan = getPlanById(selectedPlan) || emagrecimentoPlans[1];
  const planApiKey = planIdToApiKey[plan.id] || 'completo';
  const pixAmount = Math.round(plan.totalAmount * 0.9 * 100) / 100;
  const selectedTrack = TREATMENT_TRACKS_BY_ID[selectedTrilha] || TREATMENT_TRACKS[3];
  const principio = selectedTrack.principle || '';
  const selectedTrackEstimate = estimateWeightLossRangeKg(
    prefillProfile?.weightKg ?? undefined,
    selectedTrack.id === 'tirzepatida'
      ? [15, 21]
      : selectedTrack.id === 'semaglutida'
        ? [10, 15]
        : selectedTrack.id === 'contrave'
          ? [5, 8]
          : [5, 10]
  );
  const inlineSteps = allowPlanSelection
    ? [
        { key: 1 as Step, title: 'Plano' },
        { key: 2 as Step, title: 'Dados' },
        { key: 3 as Step, title: 'Pagamento' },
      ]
    : [
        { key: 1 as Step, title: 'Dados' },
        { key: 2 as Step, title: 'Pagamento' },
        { key: 3 as Step, title: 'Confirmacao' },
      ];
  const selectionLocked = selectionVariant === 'locked';
  const journeyFrames = [
    {
      src: '/images/emagrecimento/medvi/journey-triagem.avif',
      alt: 'Triagem concluida',
      title: 'Triagem aproveitada',
      body: 'Seus dados entram neste checkout e evitam retrabalho no fechamento.',
    },
    {
      src: '/images/emagrecimento/medvi/journey-consulta.avif',
      alt: 'Consulta medica',
      title: 'Consulta valida a conduta',
      body: 'A avaliacao medica confirma ou ajusta trilha, dose e continuidade clinica.',
    },
    {
      src: '/images/emagrecimento/medvi/support-whatsapp.avif',
      alt: 'Suporte por WhatsApp',
      title: 'Suporte oficial',
      body: 'O acompanhamento segue com canal oficial e dashboard apos pagamento confirmado.',
    },
  ];

  const buildAppContinuationUrl = (paymentId: string) => {
    if (!appReturnUrl) return null;

    try {
      const nextUrl = new URL(appReturnUrl);
      nextUrl.searchParams.set('paymentId', paymentId);
      nextUrl.searchParams.set('status', 'confirmed');
      nextUrl.searchParams.set('source', 'checkout');
      if (reportId) {
        nextUrl.searchParams.set('reportId', reportId);
      }
      return nextUrl.toString();
    } catch {
      return appReturnUrl;
    }
  };

  useEffect(() => {
    setSelectedPlan(defaultPlanId);
  }, [defaultPlanId]);

  useEffect(() => {
    setSelectedTrilha(resolvedDefaultTrilha);
  }, [resolvedDefaultTrilha]);

  useEffect(() => {
    setFormData(initialFormData(prefillProfile));
  }, [prefillProfile]);

  useEffect(() => {
    const sourceId = triageId || reportId;
    if (!sourceId) return;

    let active = true;
    setLoadingProfile(true);

    fetch(`/api/triage/session?triageId=${sourceId}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Nao foi possivel carregar os dados da triagem.');
        }
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        const snapshot = data.profile_snapshot || {};
        setFormData((previous) => ({
          ...previous,
          nome: previous.nome || snapshot.name || '',
          email: previous.email || snapshot.email || '',
          telefone: previous.telefone || (snapshot.whatsapp ? formatPhone(snapshot.whatsapp) : ''),
        }));
      })
      .catch((requestError) => {
        console.warn('[emagrecimento-checkout] triage prefill failed', requestError);
      })
      .finally(() => {
        if (active) setLoadingProfile(false);
      });

    return () => {
      active = false;
    };
  }, [triageId, reportId]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const updatePlan = (planId: string) => {
    setSelectedPlan(planId);
    onSelectPlan?.(planId);
  };

  const updateTrack = (trilha: EmagrecimentoTrilha) => {
    setSelectedTrilha(trilha);
    onSelectTrack?.(trilha);
  };

  const resetPaymentState = () => {
    setPaymentId(null);
    setPixQrCode(null);
    setPixQrCodeText(null);
    setFallbackPaymentLink(null);
    setPaymentStatus(null);
    setPaymentConfirmed(false);
    setCopiedPixCode(false);
    setRedirecting(false);
    redirectHandledRef.current = false;
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleCepBlur = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await response.json();

      if (data.erro) {
        setFieldErrors((previous) => ({
          ...previous,
          cep: 'CEP nao encontrado. Confira o numero informado.',
        }));
        return;
      }

      setFormData((previous) => ({
        ...previous,
        endereco: data.logradouro || previous.endereco,
        bairro: data.bairro || previous.bairro,
        cidade: data.localidade || previous.cidade,
        estado: data.uf || previous.estado,
      }));
      setFieldErrors((previous) => {
        const next = { ...previous };
        delete next.cep;
        return next;
      });
    } catch (cepError) {
      console.error('[emagrecimento-checkout] cep lookup failed', cepError);
      setFieldErrors((previous) => ({
        ...previous,
        cep: 'Nao foi possivel buscar o CEP agora.',
      }));
    } finally {
      setLoadingCep(false);
    }
  };

  const resolveDashboardAccess = async (confirmedPaymentId: string) => {
    if (redirectHandledRef.current) return;
    redirectHandledRef.current = true;
    setRedirecting(true);
    setPaymentConfirmed(true);

    trackFunnelEvent('clinical_payment_success', {
      report_id: reportId,
      triage_id: triageId,
      payment_id: confirmedPaymentId,
      trilha: selectedTrilha,
      plano: selectedPlan,
      payment_method: paymentMethod,
    });

    const appContinuationUrl = buildAppContinuationUrl(confirmedPaymentId);
    if (appContinuationUrl) {
      window.location.href = appContinuationUrl;
      return;
    }

    try {
      const response = await fetch(`/api/asaas/payment-dashboard-link?paymentId=${confirmedPaymentId}`);
      const data = await response.json();

      if (!response.ok || data.status !== 'success' || !data.magicUrl) {
        throw new Error(data.message || 'Nao foi possivel liberar o dashboard.');
      }

      trackFunnelEvent('dashboard_redirect_after_payment', {
        report_id: reportId,
        triage_id: triageId,
        payment_id: confirmedPaymentId,
        trilha: selectedTrilha,
        plano: selectedPlan,
      });

      window.location.href = data.magicUrl;
    } catch (redirectError) {
      console.error('[emagrecimento-checkout] dashboard redirect failed', redirectError);
      const query = new URLSearchParams();
      query.set('paymentId', confirmedPaymentId);
      if (reportId) query.set('reportId', reportId);
      if (appReturnUrl) query.set('appReturnUrl', appReturnUrl);
      window.location.href = `/emagrecimento/obrigado?${query.toString()}`;
    }
  };

  const startPaymentPolling = (createdPaymentId: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/asaas/payment-status?paymentId=${createdPaymentId}`);
        const data = await response.json();

        if (data.status !== 'success') return;
        setPaymentStatus(data.paymentStatus || null);

        if (PAID_STATUSES.has(data.paymentStatus)) {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          await resolveDashboardAccess(createdPaymentId);
        }
      } catch (pollingError) {
        console.error('[emagrecimento-checkout] payment polling failed', pollingError);
      }
    }, 3000);

    window.setTimeout(() => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }, 300000);
  };

  const validateDataStep = () => {
    const nextErrors: Record<string, string> = {};
    const cleanedPhone = formData.telefone.replace(/\D/g, '');
    const cleanedDocument = formData.cpfCnpj.replace(/\D/g, '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nome.trim()) nextErrors.nome = 'Informe seu nome completo.';
    if (!emailRegex.test(formData.email)) nextErrors.email = 'Digite um e-mail valido.';
    if (cleanedPhone.length < 10) nextErrors.telefone = 'Digite um WhatsApp com DDD.';
    if (cleanedDocument.length !== 11 && cleanedDocument.length !== 14) {
      nextErrors.cpfCnpj = 'Digite um CPF ou CNPJ valido.';
    } else if (cleanedDocument.length === 11 && !validateCPF(cleanedDocument)) {
      nextErrors.cpfCnpj = 'Digite um CPF valido.';
    }
    if (!formData.cep.trim()) nextErrors.cep = 'Informe o CEP.';
    if (!formData.endereco.trim()) nextErrors.endereco = 'Informe o endereco.';
    if (!formData.enderecoNumero.trim()) nextErrors.enderecoNumero = 'Informe o numero.';
    if (!formData.bairro.trim()) nextErrors.bairro = 'Informe o bairro.';
    if (!formData.cidade.trim()) nextErrors.cidade = 'Informe a cidade.';
    if (!formData.estado.trim()) nextErrors.estado = 'Informe o estado.';

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateCardStep = () => {
    if (paymentMethod !== 'CREDIT_CARD') return true;

    const nextErrors: Record<string, string> = {};
    const cleanNumber = creditCardData.number.replace(/\D/g, '');
    const cleanCcv = creditCardData.ccv.replace(/\D/g, '');

    if (!creditCardData.holderName.trim()) {
      nextErrors.cardHolder = 'Informe o nome impresso no cartao.';
    }
    if (cleanNumber.length < 15) {
      nextErrors.cardNumber = 'Numero do cartao invalido.';
    }
    if (!creditCardData.expiryMonth || Number(creditCardData.expiryMonth) < 1 || Number(creditCardData.expiryMonth) > 12) {
      nextErrors.cardExpiryMonth = 'Mes invalido.';
    }
    if (!creditCardData.expiryYear || creditCardData.expiryYear.length !== 4) {
      nextErrors.cardExpiryYear = 'Ano invalido.';
    }
    if (cleanCcv.length < 3) {
      nextErrors.cardCcv = 'Codigo de seguranca invalido.';
    }

    setFieldErrors((previous) => ({ ...previous, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    const dataStep = allowPlanSelection ? 2 : 1;
    if (currentStep === dataStep && !validateDataStep()) return;
    setCurrentStep((previous) => Math.min(previous + 1, 3) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((previous) => Math.max(previous - 1, 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyPixCode = async () => {
    if (!pixQrCodeText) return;
    try {
      await navigator.clipboard.writeText(pixQrCodeText);
      setCopiedPixCode(true);
      window.setTimeout(() => setCopiedPixCode(false), 1800);
    } catch (copyError) {
      console.error('[emagrecimento-checkout] pix copy failed', copyError);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    setError(null);
    setFieldErrors({});

    if (!validateDataStep() || !validateCardStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    resetPaymentState();
    setLoading(true);

    trackFunnelEvent('report_inline_checkout_started', {
      report_id: reportId,
      triage_id: triageId,
      plano: selectedPlan,
      trilha: selectedTrilha,
      payment_method: paymentMethod,
      surface: mode,
    });

    try {
      const payload: Record<string, any> = {
        product: 'emagrecimento',
        plano: planApiKey,
        paymentMethod,
        reportId: reportId || '',
        triageId: triageId || reportId || '',
        trilha: selectedTrilha,
        principio,
        nome: formData.nome,
        email: formData.email.toLowerCase(),
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
          holderName: creditCardData.holderName.trim().toUpperCase(),
          number: creditCardData.number.replace(/\D/g, ''),
          expiryMonth: creditCardData.expiryMonth,
          expiryYear: creditCardData.expiryYear,
          ccv: creditCardData.ccv.replace(/\D/g, ''),
        };
        payload.installments = creditCardData.installments;
      }

      const response = await fetch('/api/asaas/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || data.status !== 'success' || !data.payment?.id) {
        throw new Error(data.message || data.details || 'Nao foi possivel criar o pagamento agora.');
      }

      setPaymentId(data.payment.id);
      setPaymentStatus(data.payment.status || null);
      setFallbackPaymentLink(data.payment.invoiceUrl || data.paymentLink || null);

      if (paymentMethod === 'PIX') {
        setPixQrCode(data.payment.pixTransaction?.qrCodeBase64 || null);
        setPixQrCodeText(data.payment.pixTransaction?.qrCode || null);
      }

      trackFunnelEvent('report_payment_pending', {
        report_id: reportId,
        triage_id: triageId,
        payment_id: data.payment.id,
        payment_method: paymentMethod,
        plano: selectedPlan,
        trilha: selectedTrilha,
      });

      if (PAID_STATUSES.has(data.payment.status)) {
        await resolveDashboardAccess(data.payment.id);
      } else {
        startPaymentPolling(data.payment.id);
        setCurrentStep(3);
      }
    } catch (submitError: any) {
      console.error('[emagrecimento-checkout] submit failed', submitError);
      setError(
        submitError?.message ||
          'Nao conseguimos processar o pagamento agora. Revise os dados e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={cn(
        'grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]',
        mode === 'inline' ? 'items-start' : 'items-start'
      )}
    >
      <div className="space-y-6">
        <RefinedCard
          rounded="xl"
          padding="lg"
          className="border border-[#d9e8df] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
        >
          <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Checkout MeJoy
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                {selectionLocked ? 'Conclua o pagamento do seu fechamento' : 'Finalize sem sair desta pagina'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                {selectionLocked
                  ? 'A trilha e o plano ja vieram escolhidos da pagina do relatorio. Agora voce so confirma dados, paga aqui e entra no dashboard quando o Asaas confirmar.'
                  : 'Seus dados da triagem entram no fluxo, o pagamento acontece aqui e o dashboard so e liberado depois da confirmacao real do Asaas.'}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
              Pagamento seguro e validado
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {inlineSteps.map((step) => {
              const isActive = currentStep === step.key;
              const isCompleted = currentStep > step.key || paymentConfirmed;
              return (
                <div
                  key={step.key}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm',
                    isActive
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : isCompleted
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-zinc-200 bg-white text-zinc-500'
                  )}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px]">
                    {isCompleted ? '✓' : step.key}
                  </span>
                  {step.title}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-6">
            {selectionLocked ? (
              <div className="rounded-[28px] border border-emerald-100 bg-[#f6fbf7] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Fechamento travado nesta pagina
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-950">
                      {plan.title} com {selectedTrack.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
                      {selectedTrack.bestFor}
                    </p>
                  </div>
                  {_onRequestEditSelection && (
                    <button
                      type="button"
                      onClick={_onRequestEditSelection}
                      className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                    >
                      Alterar trilha ou plano
                    </button>
                  )}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div className="rounded-[22px] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Potencia
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{selectedTrack.potency}</p>
                  </div>
                  <div className="rounded-[22px] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Previsibilidade
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{selectedTrack.certainty}</p>
                  </div>
                  <div className="rounded-[22px] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Faixa media
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      {selectedTrackEstimate ? selectedTrackEstimate.label : selectedTrack.estimate}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Plano ativo
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{plan.priceMain}</p>
                    <p className="mt-1 text-xs text-slate-500">{plan.duration}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900">Trilha escolhida</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {TRACKS.map((track) => {
                      const selected = selectedTrilha === track.id;
                      return (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => updateTrack(track.id)}
                          className={cn(
                            'rounded-2xl border p-4 text-left transition-all',
                            selected
                              ? 'border-emerald-500 bg-emerald-50 shadow-[0_12px_30px_rgba(5,150,105,0.12)]'
                              : 'border-zinc-200 bg-white hover:border-emerald-300'
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                                {track.badge}
                              </p>
                              <p className="text-sm font-bold text-slate-900">{track.title}</p>
                              <p className="mt-1 text-xs leading-relaxed text-slate-600">{track.subtitle}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                                  {track.potency}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                                  {track.certainty}
                                </span>
                              </div>
                              <p className="mt-3 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                                {track.efficacy}
                              </p>
                            </div>
                            {selected && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#f7fbf8_0%,#eef8f2_100%)] p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Leitura clara da trilha selecionada
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-950">{selectedTrack.title}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
                        {selectedTrack.bestFor}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
                        {selectedTrack.badge}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                        {selectedTrack.potency}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                        {selectedTrack.certainty}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-[22px] bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        Eficacia media observada
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTrack.efficacy}</p>
                    </div>
                    <div className="rounded-[22px] bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        Traduzindo em peso
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        {selectedTrackEstimate
                          ? `Usando o peso atual da sua triagem como referencia, isso pode representar ${selectedTrackEstimate.label}.`
                          : selectedTrack.estimate}
                      </p>
                    </div>
                    <div className="rounded-[22px] bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                        Seguranca clinica
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTrack.safety}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    Essas faixas resumem medias de estudos e pratica clinica. Resultado individual varia por
                    dose, adesao, tolerancia, comorbidades e decisao medica final.
                  </p>
                </div>
              </>
            )}

            {allowPlanSelection && currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-slate-900">Escolha do plano</p>
                <div className="grid gap-4 xl:grid-cols-3">
                  {emagrecimentoPlans.map((option) => {
                    const selected = option.id === selectedPlan;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => updatePlan(option.id)}
                        className={cn(
                          'rounded-[24px] border p-5 text-left transition-all',
                          selected
                            ? 'border-emerald-500 bg-[linear-gradient(180deg,#f5fbf7_0%,#edf8f1_100%)] shadow-[0_16px_45px_rgba(5,150,105,0.12)]'
                            : 'border-zinc-200 bg-white hover:border-emerald-300'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                              {option.badge}
                            </p>
                            <h3 className="mt-2 text-xl font-bold text-slate-900">{option.title}</h3>
                          </div>
                          {selected && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                        </div>
                        <p className="mt-3 text-sm text-slate-600">{option.subtitle}</p>
                        <div className="mt-4 text-3xl font-bold text-slate-900">{option.priceMain}</div>
                        <p className="mt-1 text-xs text-slate-500">{option.priceDetail}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end">
                  <RefinedButton onClick={handleNext} className="rounded-full px-6">
                    Continuar para os dados
                  </RefinedButton>
                </div>
              </div>
            )}

            {((allowPlanSelection && currentStep === 2) || (!allowPlanSelection && currentStep === 1)) && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <RefinedInput
                    label="Nome completo"
                    value={formData.nome}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, nome: event.target.value }))
                    }
                    error={fieldErrors.nome}
                    icon={<UserRound className="h-4 w-4" />}
                  />
                  <RefinedInput
                    label="E-mail"
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, email: event.target.value }))
                    }
                    error={fieldErrors.email}
                  />
                  <RefinedInput
                    label="WhatsApp"
                    value={formData.telefone}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        telefone: formatPhone(event.target.value),
                      }))
                    }
                    error={fieldErrors.telefone}
                    placeholder="(11) 99999-9999"
                  />
                  <RefinedInput
                    label="CPF ou CNPJ"
                    value={formData.cpfCnpj}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        cpfCnpj: formatCpfCnpj(event.target.value),
                      }))
                    }
                    error={fieldErrors.cpfCnpj}
                  />
                </div>

                <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <MapPin className="h-4 w-4 text-emerald-700" />
                    Endereco para cadastro e nota
                    {loadingCep && <span className="text-xs font-medium text-zinc-500">Buscando CEP...</span>}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                    <RefinedInput
                      label="CEP"
                      value={formData.cep}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          cep: formatCEP(event.target.value),
                        }))
                      }
                      onBlur={(event) => handleCepBlur(event.target.value)}
                      error={fieldErrors.cep}
                    />
                    <RefinedInput
                      label="Numero"
                      value={formData.enderecoNumero}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          enderecoNumero: event.target.value,
                        }))
                      }
                      error={fieldErrors.enderecoNumero}
                    />
                  </div>

                  <div className="mt-4 grid gap-4">
                    <RefinedInput
                      label="Endereco"
                      value={formData.endereco}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          endereco: event.target.value,
                        }))
                      }
                      error={fieldErrors.endereco}
                    />
                    <RefinedInput
                      label="Complemento"
                      value={formData.complemento}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          complemento: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_120px]">
                    <RefinedInput
                      label="Bairro"
                      value={formData.bairro}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          bairro: event.target.value,
                        }))
                      }
                      error={fieldErrors.bairro}
                    />
                    <RefinedInput
                      label="Cidade"
                      value={formData.cidade}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          cidade: event.target.value,
                        }))
                      }
                      error={fieldErrors.cidade}
                    />
                    <RefinedInput
                      label="UF"
                      value={formData.estado}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          estado: event.target.value.toUpperCase().slice(0, 2),
                        }))
                      }
                      error={fieldErrors.estado}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  {allowPlanSelection && (
                    <RefinedButton variant="ghost" onClick={handleBack} className="rounded-full px-6">
                      Voltar
                    </RefinedButton>
                  )}
                  <RefinedButton onClick={handleNext} className="rounded-full px-6 sm:ml-auto">
                    Continuar para pagamento
                  </RefinedButton>
                </div>
              </div>
            )}

            {((allowPlanSelection && currentStep === 3) || (!allowPlanSelection && currentStep === 2)) && (
              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900">Forma de pagamento</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('PIX')}
                      className={cn(
                        'rounded-2xl border p-4 text-left transition-all',
                        paymentMethod === 'PIX'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-zinc-200 bg-white hover:border-emerald-300'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-emerald-700" />
                        <div>
                          <p className="font-bold text-slate-900">PIX com 10% OFF</p>
                          <p className="text-xs text-slate-600">Pagamento instantaneo e QR code na mesma pagina.</p>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={cn(
                        'rounded-2xl border p-4 text-left transition-all',
                        paymentMethod === 'CREDIT_CARD'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-zinc-200 bg-white hover:border-emerald-300'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-emerald-700" />
                        <div>
                          <p className="font-bold text-slate-900">Cartao de credito</p>
                          <p className="text-xs text-slate-600">Ate {plan.installments}x sem juros, confirmado direto aqui.</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Lock className="h-4 w-4 text-emerald-700" />
                      Dados do cartao
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <RefinedInput
                        label="Nome impresso no cartao"
                        value={creditCardData.holderName}
                        onChange={(event) =>
                          setCreditCardData((previous) => ({
                            ...previous,
                            holderName: event.target.value.toUpperCase(),
                          }))
                        }
                        error={fieldErrors.cardHolder}
                      />
                      <RefinedInput
                        label="Numero do cartao"
                        value={creditCardData.number}
                        onChange={(event) =>
                          setCreditCardData((previous) => ({
                            ...previous,
                            number: formatCardNumber(event.target.value),
                          }))
                        }
                        error={fieldErrors.cardNumber}
                        placeholder="0000 0000 0000 0000"
                      />
                      <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                        <RefinedInput
                          label="Mes"
                          value={creditCardData.expiryMonth}
                          onChange={(event) =>
                            setCreditCardData((previous) => ({
                              ...previous,
                              expiryMonth: event.target.value.replace(/\D/g, '').slice(0, 2),
                            }))
                          }
                          error={fieldErrors.cardExpiryMonth}
                          placeholder="MM"
                        />
                        <RefinedInput
                          label="Ano"
                          value={creditCardData.expiryYear}
                          onChange={(event) =>
                            setCreditCardData((previous) => ({
                              ...previous,
                              expiryYear: event.target.value.replace(/\D/g, '').slice(0, 4),
                            }))
                          }
                          error={fieldErrors.cardExpiryYear}
                          placeholder="AAAA"
                        />
                        <RefinedInput
                          label="CVV"
                          value={creditCardData.ccv}
                          onChange={(event) =>
                            setCreditCardData((previous) => ({
                              ...previous,
                              ccv: event.target.value.replace(/\D/g, '').slice(0, 4),
                            }))
                          }
                          error={fieldErrors.cardCcv}
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-slate-900">Parcelamento</label>
                      <select
                        value={creditCardData.installments}
                        onChange={(event) =>
                          setCreditCardData((previous) => ({
                            ...previous,
                            installments: Number(event.target.value),
                          }))
                        }
                        className="h-11 w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 px-4 text-sm text-slate-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {Array.from({ length: plan.installments }, (_, index) => index + 1).map((installment) => (
                          <option key={installment} value={installment}>
                            {installment}x de {formatCurrency(plan.totalAmount / installment)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <RefinedButton
                    variant="ghost"
                    onClick={handleBack}
                    className="rounded-full px-6"
                  >
                    Voltar
                  </RefinedButton>
                  <RefinedButton
                    onClick={handleSubmit}
                    loading={loading}
                    className="rounded-full px-6"
                  >
                    {paymentMethod === 'PIX' ? 'Gerar PIX na mesma pagina' : 'Pagar com cartao'}
                  </RefinedButton>
                </div>
              </div>
            )}

            {(paymentId || paymentConfirmed) && (
              <div className="rounded-[28px] border border-emerald-200 bg-[linear-gradient(180deg,#f6fbf7_0%,#eef8f2_100%)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Pagamento em andamento
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {paymentMethod === 'PIX' ? 'Seu PIX esta pronto' : 'Estamos validando o cartao'}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Assim que o Asaas confirmar, voce segue automaticamente para o dashboard MeJoy.
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
                    Status: {paymentConfirmed ? 'Confirmado' : paymentStatus || 'Aguardando'}
                  </div>
                </div>

                {paymentMethod === 'PIX' && (
                  <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="rounded-3xl border border-white bg-white p-4 shadow-sm">
                      {pixQrCode ? (
                        <Image
                          src={`data:image/png;base64,${pixQrCode}`}
                          alt="QR Code PIX"
                          width={220}
                          height={220}
                          className="mx-auto h-auto w-full rounded-2xl"
                        />
                      ) : (
                        <div className="flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 text-center text-sm text-zinc-500">
                          O QR code esta sendo preparado. Se preferir, use o link de contingencia abaixo.
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-emerald-100 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-900">Valor com PIX</p>
                        <p className="mt-1 text-3xl font-bold text-emerald-700">{formatCurrency(pixAmount)}</p>
                        <p className="mt-1 text-xs text-slate-500">Desconto aplicado automaticamente.</p>
                      </div>

                      <div className="rounded-2xl border border-zinc-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          Codigo copiar e colar
                        </p>
                        <div className="mt-3 rounded-2xl bg-zinc-50 p-3 text-xs leading-relaxed text-slate-700">
                          {pixQrCodeText || 'O codigo aparecerá aqui assim que o Asaas responder.'}
                        </div>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                          <RefinedButton
                            onClick={copyPixCode}
                            variant="secondary"
                            className="rounded-full px-5"
                            disabled={!pixQrCodeText}
                          >
                            <Copy className="h-4 w-4" />
                            {copiedPixCode ? 'Codigo copiado' : 'Copiar codigo PIX'}
                          </RefinedButton>
                          {fallbackPaymentLink && (
                            <RefinedButton asChild variant="ghost" className="rounded-full px-5">
                              <a href={fallbackPaymentLink} target="_blank" rel="noopener noreferrer">
                                Abrir contingencia Asaas
                              </a>
                            </RefinedButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'CREDIT_CARD' && (
                  <div className="mt-5 rounded-2xl border border-emerald-100 bg-white p-4">
                    <p className="text-sm text-slate-700">
                      O cartao foi enviado para validacao segura. Se a confirmacao nao vier em poucos segundos, vamos continuar acompanhando e liberar o dashboard assim que o status virar pago.
                    </p>
                    {fallbackPaymentLink && (
                      <div className="mt-4">
                        <RefinedButton asChild variant="ghost" className="rounded-full px-5">
                          <a href={fallbackPaymentLink} target="_blank" rel="noopener noreferrer">
                            Abrir comprovante do pagamento
                          </a>
                        </RefinedButton>
                      </div>
                    )}
                  </div>
                )}

                {redirecting && (
                  <div className="mt-4 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-emerald-800">
                    Pagamento confirmado. Redirecionando para o seu dashboard...
                  </div>
                )}
              </div>
            )}
          </div>
        </RefinedCard>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        {selectionLocked ? (
          <RefinedCard
            rounded="xl"
            padding="lg"
            className="overflow-hidden border border-[#d9e8df] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="rounded-[24px] bg-[#f6fbf7] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                O que vem depois
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">O que acontece depois do pagamento</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                O pagamento confirma o fechamento. A consulta valida a conduta e o dashboard abre so quando o Asaas sinaliza pago.
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              {journeyFrames.map((frame) => (
                <div
                  key={frame.src}
                  className="overflow-hidden rounded-[24px] border border-zinc-200 bg-[#f8faf8] shadow-[0_16px_35px_rgba(15,23,42,0.04)]"
                >
                  <div className="relative aspect-[1.4] overflow-hidden">
                    <Image
                      src={frame.src}
                      alt={frame.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 24vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-slate-900">{frame.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{frame.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] border border-zinc-200 bg-white p-4 text-sm text-slate-700">
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <p className="font-semibold text-slate-900">Fechamento ativo</p>
                  <p className="mt-1 text-slate-600">{plan.title}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {plan.duration}
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">PIX</p>
                  <p className="mt-1 text-slate-600">10% OFF na mesma pagina</p>
                </div>
                <span className="text-right text-xl font-bold text-emerald-700">{formatCurrency(pixAmount)}</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">Cartao</p>
                  <p className="mt-1 text-slate-600">Ate {plan.installments}x sem juros</p>
                </div>
                <span className="text-right text-sm font-semibold text-slate-900">
                  {plan.priceMain}
                  <span className="block text-xs font-normal text-slate-500">{plan.priceDetail}</span>
                </span>
              </div>
            </div>
          </RefinedCard>
        ) : (
          <RefinedCard
            rounded="xl"
            padding="lg"
            className="overflow-hidden border border-[#d9e8df] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="rounded-[24px] bg-[linear-gradient(135deg,#0f172a_0%,#0b5c45_55%,#0a8f5b_100%)] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
                Resumo do fechamento
              </p>
              <h3 className="mt-2 text-2xl font-bold">{plan.title}</h3>
              <p className="mt-2 text-sm text-emerald-50">{plan.subtitle}</p>
            </div>

            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <p className="font-semibold text-slate-900">Trilha</p>
                  <p className="mt-1 text-slate-600">{selectedTrack.title}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Ajustavel pelo medico
                </span>
              </div>

              <div className="rounded-[22px] border border-emerald-100 bg-[linear-gradient(180deg,#f7fbf8_0%,#eef8f2_100%)] p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
                    {selectedTrack.potency}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {selectedTrack.certainty}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">Leitura clara</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTrack.bestFor}</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">Faixa media observada</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTrack.efficacy}</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">Seguranca clinica</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTrack.safety}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  Resultado individual varia. A consulta confirma a conduta final antes de qualquer prescricao.
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <p className="font-semibold text-slate-900">PIX</p>
                  <p className="mt-1 text-slate-600">Desconto imediato na mesma pagina</p>
                </div>
                <span className="text-xl font-bold text-emerald-700">{formatCurrency(pixAmount)}</span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <p className="font-semibold text-slate-900">Cartao</p>
                  <p className="mt-1 text-slate-600">Ate {plan.installments}x sem juros</p>
                </div>
                <span className="text-right text-sm font-semibold text-slate-900">
                  {plan.priceMain}
                  <span className="block text-xs font-normal text-slate-500">{plan.priceDetail}</span>
                </span>
              </div>

              <div>
                <p className="font-semibold text-slate-900">Incluido agora</p>
                <ul className="mt-3 space-y-2">
                  {plan.bullets.slice(0, 5).map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 leading-relaxed">
                      <span className="mt-0.5 text-emerald-600">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RefinedCard>
        )}

        <RefinedCard
          rounded="xl"
          padding="md"
          className="border border-zinc-200 bg-zinc-50/80 text-sm leading-relaxed text-slate-600"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
            <p>
              {emagrecimentoLegalNote}
            </p>
          </div>
          {loadingProfile && (
            <p className="mt-3 text-xs font-medium text-zinc-500">
              Preenchendo seus dados da triagem...
            </p>
          )}
        </RefinedCard>
      </aside>
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatCpfCnpj(value: string) {
  const cleaned = value.replace(/\D/g, '').slice(0, 14);
  if (cleaned.length <= 11) {
    return cleaned
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }
  return cleaned
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function formatPhone(value: string) {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, (_, ddd, first, second) =>
      second ? `(${ddd}) ${first}-${second}` : `(${ddd}) ${first}`
    );
  }
  return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, ddd, first, second) =>
    second ? `(${ddd}) ${first}-${second}` : `(${ddd}) ${first}`
  );
}

function formatCEP(value: string) {
  const cleaned = value.replace(/\D/g, '').slice(0, 8);
  return cleaned.replace(/(\d{5})(\d{0,3})/, (_, first, second) => (second ? `${first}-${second}` : first));
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function validateCPF(cpf: string) {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(cleaned.charAt(index)) * (10 - index);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== Number(cleaned.charAt(9))) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(cleaned.charAt(index)) * (11 - index);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  return digit === Number(cleaned.charAt(10));
}
