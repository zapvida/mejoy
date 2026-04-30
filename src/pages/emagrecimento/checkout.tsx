'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';
import RefinedInput from '@/components/ui/RefinedInput';
import { RefinedButton } from '@/components/ui/RefinedButton';
import { RefinedCard } from '@/components/ui/RefinedCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { buildZapVidaPlantaoUrl, emagrecimentoPlans, emagrecimentoLegalNote, planIdMapping, planIdToApiKey } from '@/config/zapfarm/emagrecimento-plans';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import {
  normalizeCheckoutTrilhaParam,
  type EmagrecimentoTrilha,
} from '@/lib/emagrecimento/checkoutUrls';

const TRILHA_CHECKOUT_LABEL: Record<EmagrecimentoTrilha, string> = {
  tirzepatida: 'Programa — tirzepatida (original), quando indicada na consulta',
  semaglutida: 'Programa — semaglutida (original), quando indicada na consulta',
  contrave: 'Programa — Contrave® (original), quando indicada na consulta',
  alternativas_clinicas: 'Programa — alternativas clínicas conforme avaliação médica',
};

// Validação de CPF
const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  
  // Rejeitar sequências óbvias
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validar dígitos verificadores
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
};

// Converter planos centralizados para formato usado no checkout
const plans = emagrecimentoPlans.map((plan) => ({
  id: plan.id,
  // Mapear IDs antigos para compatibilidade
  oldId: Object.keys(planIdMapping).find(key => planIdMapping[key as keyof typeof planIdMapping] === plan.id),
  name: plan.title,
  subtitle: plan.subtitle,
  price: plan.priceMain,
  priceDetail: plan.priceDetail,
  unitPrice: plan.totalAmount, // Valor total em reais
    period: '',
  badge: plan.badge,
  recommended: plan.recommended,
  highlight: plan.highlight,
  features: plan.bullets.map(bullet => `✅ ${bullet}`),
  copy: plan.subtitle,
  ctaLabel: plan.ctaLabel,
  duration: plan.duration,
}));

type Step = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const router = useRouter();
  const { plano: planoQuery, reportId, triageId, principio, trilha: trilhaQuery } = router.query;
  const trilha = normalizeCheckoutTrilhaParam(trilhaQuery);
  const principioNorm =
    typeof principio === 'string' ? principio : Array.isArray(principio) ? principio[0] : undefined;
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedPlanId, setRecommendedPlanId] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  
  // Estados para autopreenchimento
  const [isLoadingTriageData, setIsLoadingTriageData] = useState(false);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  
  // Estados para pagamento
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);
  const [pixQrCodeText, setPixQrCodeText] = useState<string | null>(null);
  const [pixValue, setPixValue] = useState<number | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [copiedPixCode, setCopiedPixCode] = useState(false);
  
  // Estados para validação
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // Ref para polling interval
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const paymentStartTrackedRef = useRef(false);
  
  // Calcular plano recomendado baseado no relatório
  useEffect(() => {
    if (reportId && !planoQuery) {
      const cacheKey = `report_cache_${reportId}`;
      const cached = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
      
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          const classification = cachedData.classification;
          const impactoVida = cachedData.impacto_vida;
          const comorbidades = cachedData.comorbidades || [];
          
          if (classification) {
            const recommended = getRecommendedPlan(classification, impactoVida, comorbidades);
            setRecommendedPlanId(recommended);
          }
          return;
        } catch {
          // Cache inválido, continuar com fetch
        }
      }
      
      setLoadingReport(true);
      fetch('/api/gerarRelatorio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triageId: reportId })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Relatório não encontrado');
          }
          return res.json();
        })
        .then(data => {
          if (data.report) {
            const vm = data.report;
            const classification = (vm as any).classification;
            const answers = (vm as any).answers || {};
            const impactoVida = answers.impacto_vida;
            const comorbidades = Array.isArray(answers.comorbidades)
              ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
              : [];
            
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(cacheKey, JSON.stringify({
                classification,
                impactoVida,
                comorbidades,
                timestamp: Date.now()
              }));
            }
            
            if (classification) {
              const recommended = getRecommendedPlan(classification, impactoVida, comorbidades);
              setRecommendedPlanId(recommended);
            }
          }
        })
        .catch((err) => {
          console.warn('[checkout] Erro ao buscar relatório:', err);
        })
        .finally(() => {
          setLoadingReport(false);
        });
    }
  }, [reportId, planoQuery]);
  
  // Mapear planoQuery para novo ID se necessário
  const getPlanIdFromQuery = (query: string | undefined): string => {
    if (!query) return 'programa-3m'; // Default: plano recomendado
    // Se for ID antigo, mapear para novo
    return planIdMapping[query as keyof typeof planIdMapping] || query;
  };
  
  const [selectedPlan, setSelectedPlan] = useState<string>(
    getPlanIdFromQuery(planoQuery as string | undefined)
  );
  
  // Atualizar selectedPlan quando recommendedPlanId for definido
  useEffect(() => {
    if (recommendedPlanId && !planoQuery) {
      // Mapear ID antigo para novo se necessário
      const mappedId = planIdMapping[recommendedPlanId as keyof typeof planIdMapping] || recommendedPlanId;
      setSelectedPlan(mappedId);
    }
  }, [recommendedPlanId, planoQuery]);
  
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

  // Autopreenchimento de dados da triagem
  useEffect(() => {
    async function loadTriageData() {
      const id = triageId || reportId;
      if (!id) return;
      
      setIsLoadingTriageData(true);
      try {
        const response = await fetch(`/api/triage/session?triageId=${id}`);
        if (!response.ok) throw new Error('Erro ao buscar dados');
        
        const data = await response.json();
        if (data.profile_snapshot) {
          const snapshot = data.profile_snapshot as any;
          setFormData(prev => ({
            ...prev,
            // Só preencher se o campo estiver vazio
            nome: prev.nome || snapshot.name || '',
            email: prev.email || snapshot.email || '',
            telefone: prev.telefone || (snapshot.whatsapp ? formatPhone(snapshot.whatsapp) : ''),
          }));
        }
      } catch (error) {
        console.warn('[checkout] Erro ao carregar dados da triagem:', error);
      } finally {
        setIsLoadingTriageData(false);
      }
    }
    
    loadTriageData();
  }, [triageId, reportId]);

  // Preferência / princípio ativo vindo da results (URL)
  const preferenciaPrincipio =
    principioNorm === 'tirzepatida'
      ? 'Tirzepatida'
      : principioNorm === 'semaglutida'
        ? 'Semaglutida'
        : principioNorm === 'contrave'
          ? 'Contrave® (bupropiona + naltrexona)'
          : undefined;

  const selectedPlanData = plans.find(p => p.id === selectedPlan) || plans[1];

  const steps = [
    { number: 1, title: 'Seus dados', description: 'Confirme suas informações', icon: '👤' },
    { number: 2, title: 'Endereço', description: 'Para nota e contato', icon: '📍' },
    { number: 3, title: 'Escolha do plano', description: 'Selecione o ideal', icon: '🎯' },
    { number: 4, title: 'Pagamento seguro', description: 'Finalize sua compra', icon: '🔒' },
  ];

  const handleNext = () => {
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

  // Busca automática de CEP
  const handleCepBlur = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length === 8) {
      setIsLoadingCEP(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          setFieldErrors(prev => ({ ...prev, cep: 'CEP não encontrado. Verifique e tente novamente.' }));
        } else {
          setFormData(prev => ({
            ...prev,
            endereco: data.logradouro || prev.endereco,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            estado: data.uf || prev.estado,
          }));
          setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.cep;
            return newErrors;
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setFieldErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP. Tente novamente.' }));
      } finally {
        setIsLoadingCEP(false);
      }
    }
  };

  // Polling de confirmação do pagamento
  const startPaymentPolling = (paymentId: string) => {
    // Limpar interval anterior se existir
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/asaas/payment-status?paymentId=${paymentId}`);
        const data = await response.json();
        
        if (data.status === 'success' && (data.paymentStatus === 'RECEIVED' || data.paymentStatus === 'CONFIRMED')) {
          setPaymentConfirmed(true);
          clearInterval(interval);
          pollingIntervalRef.current = null;
          
          setTimeout(() => {
            router.push(`/emagrecimento/obrigado?paymentId=${paymentId}`);
          }, 2000);
        }
      } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error);
      }
    }, 3000);
    
    pollingIntervalRef.current = interval;
    
    // Parar após 5 minutos
    setTimeout(() => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }, 300000);
  };

  // Limpar interval ao desmontar
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentStep !== 4 || paymentStartTrackedRef.current) return;
    trackFunnelEvent('pharmacy_order_started', {
      source: 'checkout_step',
      report_id: reportId,
      triage_id: triageId,
      trilha,
    });
    paymentStartTrackedRef.current = true;
  }, [currentStep, reportId, triageId, trilha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenir múltiplos submits
    if (loading) return;
    
    setLoading(true);
    setError(null);
    setFieldErrors({});

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFieldErrors({ email: 'Digite um e-mail válido' });
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validação de telefone (mínimo 10 dígitos)
    const telefoneCleaned = formData.telefone.replace(/\D/g, '');
    if (telefoneCleaned.length < 10) {
      setFieldErrors({ telefone: 'Digite um telefone válido com DDD' });
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validação de CPF
    const cpfCleaned = formData.cpfCnpj.replace(/\D/g, '');
    if (cpfCleaned.length === 11 && !validateCPF(formData.cpfCnpj)) {
      setFieldErrors({ cpfCnpj: 'Digite um CPF válido' });
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      // Mapear ID do plano para chave API (basico/completo/premium)
      const planoForApi = planIdToApiKey[selectedPlan] || selectedPlan;
      trackFunnelEvent('pharmacy_order_started', {
        source: 'checkout_submit',
        payment_method: paymentMethod,
        report_id: reportId,
        triage_id: triageId,
        trilha,
      });

      const response = await fetch('/api/asaas/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'emagrecimento',
          plano: planoForApi,
          paymentMethod: paymentMethod,
          reportId: reportId || '',
          triageId: triageId || '',
          trilha,
          principio: principioNorm || '',
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
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success' && data.payment) {
        trackFunnelEvent('pharmacy_order_created', {
          payment_id: data.payment.id,
          payment_method: paymentMethod,
          report_id: reportId,
          triage_id: triageId,
          trilha,
        });
        if (paymentMethod === 'PIX') {
          // Se tiver QR Code, mostrar na mesma página
          if (data.payment.pixTransaction && (data.payment.pixTransaction.qrCodeBase64 || data.payment.pixTransaction.qrCode)) {
            setPixQrCode(data.payment.pixTransaction.qrCodeBase64);
            setPixQrCodeText(data.payment.pixTransaction.qrCode);
            setPixValue(data.payment.pixTransaction.value || data.payment.value);
            
            // Iniciar polling
            startPaymentPolling(data.payment.id);
          } else if (data.retryable && data.paymentLink) {
            // Fallback: QR Code não veio, mas temos link de pagamento
            // Redirecionar para o link de pagamento do Asaas (que tem o QR Code)
            setError(null);
            window.location.href = data.paymentLink;
        } else {
            // Último fallback: redirecionar para obrigado
            router.push(`/emagrecimento/obrigado?paymentId=${data.payment.id}`);
        }
        } else if (paymentMethod === 'CREDIT_CARD') {
          // Para cartão, redirecionar
          if (data.payment.invoiceUrl || data.paymentLink) {
            window.location.href = data.payment.invoiceUrl || data.paymentLink;
      } else {
            router.push(`/emagrecimento/obrigado?paymentId=${data.payment.id}`);
          }
        } else {
          // Fallback: redirecionar para obrigado
          router.push(`/emagrecimento/obrigado?paymentId=${data.payment.id}`);
        }
      } else {
        const errorMessage = data.message || data.details || 'Não conseguimos processar seu pagamento agora. Verifique os dados ou tente novamente em alguns minutos.';
        setError(errorMessage);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Erro:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateStep1 = () => selectedPlan !== '';
  const validateDataStep = () =>
    formData.nome.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.telefone.trim() !== '' &&
    formData.cpfCnpj.trim() !== '';
  const validateStep2 = () => {
    return validateDataStep() &&
           formData.cep.trim() !== '' &&
           formData.endereco.trim() !== '' &&
           formData.enderecoNumero.trim() !== '' &&
           formData.cidade.trim() !== '' &&
           formData.estado.trim() !== '';
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

  const copyPixCode = async () => {
    if (pixQrCodeText) {
      try {
        await navigator.clipboard.writeText(pixQrCodeText);
        setCopiedPixCode(true);
        setTimeout(() => setCopiedPixCode(false), 2000);
      } catch (error) {
        console.error('Erro ao copiar código PIX:', error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Checkout - Me Joy</title>
        <meta name="description" content="Finalize sua compra e inicie seu tratamento de emagrecimento" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
        {/* Header */}
        <div className="relative z-50">
          <HeaderZapfarm />
        </div>

        {/* Padding top para compensar header fixo */}
        <div className="pt-20 sm:pt-16 md:pt-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8 sm:py-10 md:py-12">
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
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  Passo {currentStep} de 4 — menos de 2 minutos pra concluir
                </p>
              </div>
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all ${
                          currentStep >= step.number
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {currentStep > step.number ? '✓' : step.number}
                      </div>
                      <div className="mt-2 text-center hidden sm:block">
                        <div className={`text-xs sm:text-sm font-semibold ${
                          currentStep >= step.number ? 'text-emerald-700' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 sm:mx-4 transition-all ${
                          currentStep > step.number ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Conteúdo Principal */}
              <div className="lg:col-span-2">
                {/* Step 1: Dados Pessoais */}
                {currentStep === 1 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                      Seus dados
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                      Confirme suas informações
                    </p>
                    
                    {isLoadingTriageData && (
                      <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
                          <p className="text-sm sm:text-base text-gray-700">
                            Carregando seus dados da triagem…
                          </p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                      <div className="space-y-4 sm:space-y-6">
                        <RefinedInput
                          label="Nome completo *"
                          type="text"
                          required
                          value={formData.nome}
                          onChange={(e) => {
                            setFormData({ ...formData, nome: e.target.value });
                            if (fieldErrors.nome) {
                              setFieldErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.nome;
                                return newErrors;
                              });
                            }
                          }}
                          error={fieldErrors.nome}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <RefinedInput
                            label="E-mail *"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => {
                              const email = e.target.value;
                              setFormData({ ...formData, email });
                              // Validação em tempo real
                              if (fieldErrors.email) {
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (emailRegex.test(email) || email === '') {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.email;
                                    return newErrors;
                                  });
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              if (e.target.value && !emailRegex.test(e.target.value)) {
                                setFieldErrors(prev => ({ ...prev, email: 'Digite um e-mail válido' }));
                              }
                            }}
                            error={fieldErrors.email}
                          />
                          <RefinedInput
                            label="WhatsApp *"
                            type="tel"
                            required
                            value={formData.telefone}
                            onChange={(e) => {
                              setFormData({ ...formData, telefone: formatPhone(e.target.value) });
                              if (fieldErrors.telefone) {
                                setFieldErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.telefone;
                                  return newErrors;
                                });
                              }
                            }}
                            placeholder="(11) 99999-9999"
                            maxLength={15}
                            error={fieldErrors.telefone}
                          />
                        </div>
                        <RefinedInput
                          label="CPF/CNPJ *"
                          type="text"
                          required
                          value={formData.cpfCnpj}
                          onChange={(e) => {
                            setFormData({ ...formData, cpfCnpj: formatCPF(e.target.value) });
                            if (fieldErrors.cpfCnpj) {
                              setFieldErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.cpfCnpj;
                                return newErrors;
                              });
                            }
                          }}
                          placeholder="000.000.000-00"
                          maxLength={18}
                          error={fieldErrors.cpfCnpj}
                        />
                      </div>

                      <div className="mt-6 sm:mt-8 flex justify-end">
                        <RefinedButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          disabled={!validateDataStep()}
                        >
                          Continuar →
                        </RefinedButton>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 2: Endereço */}
                {currentStep === 2 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                      Endereço
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                      Para nota e contato
                    </p>

                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                      <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <div className="relative">
                            <RefinedInput
                              label="CEP *"
                              type="text"
                              required
                              value={formData.cep}
                              onChange={(e) => {
                                const formatted = formatCEP(e.target.value);
                                setFormData({ ...formData, cep: formatted });
                                if (fieldErrors.cep) {
                                  setFieldErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.cep;
                                    return newErrors;
                                  });
                                }
                              }}
                              onBlur={(e) => handleCepBlur(e.target.value)}
                              placeholder="00000-000"
                              maxLength={9}
                              inputMode="numeric"
                              error={fieldErrors.cep}
                              icon={isLoadingCEP ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
                              ) : undefined}
                              iconPosition="right"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <RefinedInput
                              label="Endereço completo *"
                              type="text"
                              required
                              value={formData.endereco}
                              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <RefinedInput
                            label="Número *"
                            type="text"
                            required
                            value={formData.enderecoNumero}
                            onChange={(e) => setFormData({ ...formData, enderecoNumero: e.target.value })}
                          />
                          <div className="sm:col-span-2">
                            <RefinedInput
                              label="Complemento"
                              type="text"
                              value={formData.complemento}
                              onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                          <RefinedInput
                            label="Bairro"
                            type="text"
                            value={formData.bairro}
                            onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                          />
                          <RefinedInput
                            label="Cidade *"
                            type="text"
                            required
                            value={formData.cidade}
                            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                          />
                          <RefinedInput
                            label="Estado *"
                            type="text"
                            required
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                            maxLength={2}
                            placeholder="SP"
                          />
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 flex justify-between gap-4">
                        <RefinedButton
                          type="button"
                          variant="secondary"
                          size="lg"
                          onClick={handleBack}
                        >
                          ← Voltar
                        </RefinedButton>
                        <RefinedButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          disabled={!validateStep2()}
                        >
                          Continuar →
                        </RefinedButton>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 3: Escolha do Plano */}
                {currentStep === 3 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                      Escolha do plano
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                      Escolha a melhor forma de iniciar seu programa hoje
                    </p>
                    
                    {/* Microcopy de valor */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-100 to-teal-50 rounded-xl border-2 border-emerald-200">
                      <p className="text-sm sm:text-base text-gray-900 font-semibold leading-relaxed text-center">
                        💡 <strong>Programa completo:</strong> avaliação clínica, acompanhamento, retorno médico e trilha coordenada com prescrição quando indicada.
                      </p>
                    </div>
                    
                    {loadingReport && (
                      <RefinedCard variant="subtle" padding="md" rounded="lg" className="mb-6">
                        <div className="flex items-center gap-3">
                          <Skeleton variant="circular" width={20} height={20} />
                          <Skeleton variant="text" width="60%" />
                        </div>
                      </RefinedCard>
                    )}
                    
                    <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
                      <p className="text-sm sm:text-base text-gray-800">
                        <strong>Trilha escolhida:</strong> {TRILHA_CHECKOUT_LABEL[trilha]}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        O valor abaixo é do programa (consultas e acompanhamento). Medicação, quando prescrita, segue regras da consulta e disponibilidade.
                      </p>
                    </div>

                    {preferenciaPrincipio && !loadingReport && (
                      <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <p className="text-sm sm:text-base text-gray-700">
                          <strong>Preferência declarada na triagem:</strong> {preferenciaPrincipio}
                          <span className="text-gray-500 text-xs sm:text-sm block mt-1">
                            (o médico irá avaliar se essa é a melhor opção para o seu caso)
                          </span>
                        </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      {plans.map((plan) => (
                        <RefinedCard
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          hover
                          padding="lg"
                          rounded="xl"
                          variant={selectedPlan === plan.id ? "elevated" : "default"}
                          className={`relative text-left transition-all cursor-pointer ${
                            selectedPlan === plan.id
                              ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl scale-105 ring-4 ring-emerald-100'
                              : plan.recommended
                              ? 'border-teal-300 bg-gradient-to-br from-teal-50 to-emerald-50 hover:border-teal-400'
                              : 'border-gray-200 hover:border-emerald-300 bg-white'
                          }`}
                        >
                          {/* Badge */}
                          {plan.badge && (
                            <div className={plan.recommended 
                              ? "absolute -top-3 left-1/2 -translate-x-1/2"
                              : "mb-3"
                            }>
                              <div className={`px-3 sm:px-4 py-1 rounded-full text-white text-xs font-bold shadow-lg ${
                                plan.recommended
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                                  : 'bg-slate-900'
                              }`}>
                                {plan.recommended ? '⭐ ' : ''}{plan.badge}
                      </div>
                            </div>
                          )}
                          
                          {/* Nome e Subtítulo */}
                          <div className="mb-3">
                            <div className="font-bold text-gray-900 text-lg mb-1">{plan.name}</div>
                            {plan.subtitle && (
                              <div className="text-xs text-gray-600">{plan.subtitle}</div>
                            )}
                          </div>
                          
                          {/* Preço */}
                          <div className="mb-4">
                            <div className="text-emerald-700 font-bold text-xl sm:text-2xl mb-1">
                              {plan.price}
                            </div>
                            {plan.priceDetail && (
                              <div className="text-xs text-gray-600 leading-relaxed">
                                {plan.priceDetail}
                              </div>
                            )}
                            {plan.duration && (
                              <div className="text-xs text-gray-500 mt-1">
                                Duração: {plan.duration}
                      </div>
                          )}
                          </div>
                          
                          {/* Features */}
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                                <span className="flex-shrink-0 mt-0.5">
                                  {feature.startsWith('❌') ? '❌' : '✅'}
                                </span>
                                <span className={feature.startsWith('❌') ? 'text-gray-500 line-through' : ''}>
                                  {feature.replace(/^[✅❌]\s*/, '')}
                                </span>
                              </li>
                            ))}
                          </ul>
                          
                        </RefinedCard>
                      ))}
                    </div>

                    {/* Nota Legal */}
                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-xs sm:text-sm text-gray-700 text-center leading-relaxed">
                        {emagrecimentoLegalNote}
                      </p>
                    </div>

                    <div className="mt-6 sm:mt-8 flex justify-end">
                      <button
                        onClick={handleNext}
                        disabled={!validateStep1()}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold text-sm sm:text-base hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continuar →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Pagamento */}
                {currentStep === 4 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                      Pagamento seguro
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                      Finalize sua compra
                    </p>

                    {!pixQrCode && !paymentConfirmed && (
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Escolha a forma de pagamento *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('PIX')}
                            className={`p-5 rounded-xl border-2 transition-all text-left ${
                              paymentMethod === 'PIX'
                                ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-emerald-300 bg-white'
                            }`}
                          >
                            <div className="text-3xl mb-2">📱</div>
                            <div className="font-bold text-gray-900 mb-1">PIX</div>
                            <div className="text-xs text-gray-600">
                              ✅ Aprovação imediata<br />
                              🔒 Pagamento seguro via Asaas
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('CREDIT_CARD')}
                            className={`p-5 rounded-xl border-2 transition-all text-left ${
                              paymentMethod === 'CREDIT_CARD'
                                ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-emerald-300 bg-white'
                            }`}
                          >
                            <div className="text-3xl mb-2">💳</div>
                            <div className="font-bold text-gray-900 mb-1">Cartão de Crédito</div>
                            <div className="text-xs text-gray-600">
                              💳 Até 12x sem juros<br />
                              🔒 Ambiente seguro do Asaas
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* QR Code PIX */}
                    {pixQrCode && (
                      <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 mb-6">
                        <div className="text-center">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            Escaneie o QR Code ou copie o código PIX
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Assim que o pagamento for confirmado, você receberá o acesso por WhatsApp e e-mail.
                          </p>
                          
                          {/* QR Code Image */}
                          <div className="flex justify-center mb-4">
                            <div className="bg-white p-4 rounded-xl shadow-lg">
                              <img 
                                src={`data:image/png;base64,${pixQrCode}`} 
                                alt="QR Code PIX"
                                className="w-48 h-48 sm:w-64 sm:h-64"
                              />
                            </div>
                          </div>
                          
                          {/* Valor */}
                          {pixValue && (
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-4">
                              R$ {pixValue.toFixed(2).replace('.', ',')}
                            </div>
                          )}
                          
                          {/* Código PIX copiável */}
                          {pixQrCodeText && (
                            <div className="mb-4">
                              <label className="block text-xs font-semibold text-gray-700 mb-2">
                                Código PIX (copiar e colar):
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={pixQrCodeText}
                                  readOnly
                                  className="flex-1 px-4 py-2 text-xs bg-white border border-gray-300 rounded-lg font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={copyPixCode}
                                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    copiedPixCode
                                      ? 'bg-green-600 text-white'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                                >
                                  {copiedPixCode ? '✓ Copiado!' : 'Copiar'}
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {/* Status do pagamento */}
                          {paymentConfirmed ? (
                            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                              <div className="text-2xl mb-2">✅</div>
                              <p className="font-bold text-green-900">Pagamento confirmado!</p>
                              <p className="text-sm text-green-700">Redirecionando...</p>
                            </div>
                          ) : (
                            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                              <div className="flex items-center gap-2 justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                                <p className="text-sm text-blue-700">Aguardando confirmação do pagamento...</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!pixQrCode && (
                      <>
                      <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 mb-6 sm:mb-8">
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl mb-4">🔒</div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Pagamento seguro</h3>
                          <p className="text-sm sm:text-base text-gray-600 mb-4">
                            Seus dados estão protegidos e o pagamento será processado de forma segura através do Asaas
                          </p>
                          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-2">
                            {selectedPlanData.price}
                          </div>
                          {selectedPlanData.priceDetail && (
                            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                              {selectedPlanData.priceDetail}
                            </div>
                          )}
                          {selectedPlanData.duration && (
                            <div className="text-xs text-gray-500 mt-1">
                              Duração: {selectedPlanData.duration}
                            </div>
                          )}
                        </div>
                      </div>

                        <div className="space-y-4 sm:space-y-6 mb-6">
                        <div className="p-4 sm:p-6 bg-green-50 rounded-xl border border-green-200">
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-center">
                              🔒 <strong>Pagamento 100% seguro via Asaas</strong> • Você pode cancelar a assinatura a qualquer momento diretamente pelo painel.
                          </p>
                        </div>
                      </div>
                      </>
                    )}

                    {!pixQrCode && (
                      <form onSubmit={handleSubmit}>
                      <div className="mt-6 sm:mt-8 flex justify-between gap-4">
                        <RefinedButton
                          type="button"
                          variant="secondary"
                          size="lg"
                          onClick={handleBack}
                        >
                          ← Voltar
                        </RefinedButton>
                        <RefinedButton
                          type="submit"
                          variant="primary"
                          size="lg"
                          loading={loading}
                          disabled={loading}
                        >
                          {loading ? 'Processando pagamento…' : 'Finalizar pagamento →'}
                        </RefinedButton>
                      </div>
                    </form>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar - Resumo */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:sticky lg:top-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Resumo do programa</h2>
                  <div className="mb-4 p-3 rounded-lg border border-teal-100 bg-teal-50/80">
                    <p className="text-xs font-semibold text-teal-900 uppercase tracking-wide">Trilha</p>
                    <p className="text-sm text-gray-800 mt-1 leading-snug">{TRILHA_CHECKOUT_LABEL[trilha]}</p>
                    {preferenciaPrincipio && (
                      <p className="text-xs text-gray-600 mt-2">
                        Preferência na triagem: <span className="font-medium text-gray-800">{preferenciaPrincipio}</span>
                      </p>
                    )}
                  </div>
                  <div className="border-b border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
                    <div className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{selectedPlanData.name}</div>
                    <div className="text-emerald-700 font-bold text-xl sm:text-2xl mb-1">
                      {selectedPlanData.price}
                    </div>
                    {selectedPlanData.priceDetail && (
                      <div className="text-xs text-gray-600 leading-relaxed mb-1">
                        {selectedPlanData.priceDetail}
                      </div>
                    )}
                    {selectedPlanData.duration && (
                      <div className="text-xs text-gray-500">
                        Duração: {selectedPlanData.duration}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="text-xs sm:text-sm text-gray-600 font-semibold">Incluso no programa:</div>
                    {selectedPlanData.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-600 flex-shrink-0 mt-0.5">
                          {feature.startsWith('❌') ? '❌' : '✅'}
                        </span>
                        <span className={feature.startsWith('❌') ? 'text-gray-500 line-through' : ''}>
                          {feature.replace(/^[✅❌]\s*/, '')}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      ✓ Pagamento seguro via Asaas<br />
                      ✓ Acompanhamento médico contínuo<br />
                      ✓ Suporte por WhatsApp
                    </p>
                  </div>
                  <a
                    href={buildZapVidaPlantaoUrl('checkout_support')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-xs sm:text-sm text-emerald-700 hover:text-emerald-800 font-medium py-2"
                  >
                    👨‍⚕️ Tirar dúvida clínica antes de pagar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
