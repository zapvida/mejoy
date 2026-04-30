// LEGACY: fluxo antigo de triagem mantido apenas para referência. O Runner substitui este componente.
import { formularios } from '@/forms';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePersistentState } from '@/utils/usePersistentState';
import { Step, FormData } from '@/types/triagem';
import { Input } from '@/components/ui/inputs';
import SelectCard from '@/components/ui/inputs/SelectCard';
import { Circle } from 'lucide-react';
import { Button } from '@/components/ui/buttons';
import Toast from '@/components/ui/feedback/Toast';
import Particles from '@tsparticles/react';
import ProgressBar from '@/components/ui/inputs/ProgressBar';

type TriagemStepFormProps = {
  tipoTriagem?: string;
  cpf: string;
  onSubmitStart?: () => void;
};

export default function TriagemStepForm({
  tipoTriagem = 'mental',
  cpf,
  onSubmitStart,
}: TriagemStepFormProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = usePersistentState<Record<string, string | string[]>>('triagemForm', {});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [profileData, setProfileData] = useState<Record<string, string | string[]>>({});
  const [profileStepIndex, setProfileStepIndex] = useState(0);


  useEffect(() => {
    if (!cpf) {
      router.push('/triagem');
      return;
    }
    const cpfLimpo = cpf.replace(/\D/g, '');
    localStorage.setItem('cpf', cpfLimpo);
    document.cookie = `cpf=${cpfLimpo}; path=/; max-age=31536000`;

    setFormData((prev) => ({ ...prev, cpf: cpfLimpo }));

    // Verificar se é primeira vez do usuário (exceto para gastro que tem seus próprios campos)
    const hasProfile = localStorage.getItem(`hasProfile_${cpfLimpo}`);
    if (!hasProfile && tipoTriagem !== 'gastro') {
      setIsFirstTime(true);
    }

    fetch(`/api/pacientes?cpf=${cpfLimpo}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          // Carregar TODOS os dados do perfil para o formData da triagem
          setFormData((prev) => ({
            ...prev,
            nome: data.nome || '',
            nascimento: data.nascimento || '',
            email: data.email || '',
            whatsapp: data.whatsapp || '',
            sexo: data.sex || '',
            altura: data.height_cm ? String(data.height_cm) : '',
            peso: data.weight_kg ? String(data.weight_kg) : '',
            circunferencia_abdominal: data.circunferencia_abdominal || '',
            cpf: cpfLimpo,
          }));
          
          // Se já tem perfil completo, não é primeira vez
          if (data.nome && data.nascimento && data.email && data.whatsapp) {
            setIsFirstTime(false);
            localStorage.setItem(`hasProfile_${cpfLimpo}`, 'true');
          }
        }
      })
      .catch((err) => console.error('Erro ao carregar paciente:', err));
  }, [cpf, router, setFormData, tipoTriagem]);

  useEffect(() => {
    document.title = tipoTriagem
      ? `Triagem: ${tipoTriagem}`
      : 'Triagem de Saúde Integrativa';
  }, [tipoTriagem]);

  // Dados do perfil inicial (Check-up Geral de Saúde) - uma pergunta por vez
  const profileSteps: Step[] = [
    {
      type: 'intro',
      name: 'intro',
      label: 'Check-up Geral de Saúde',
      description: 'Vamos conhecer você melhor para personalizar suas recomendações de saúde.',
      justification: 'Esses dados são essenciais para análise de riscos e personalização das recomendações.',
    },
    {
      type: 'text',
      name: 'nome',
      label: 'Nome completo',
      placeholder: 'Seu nome completo',
      description: 'Usado para personalizar seu relatório',
      required: true,
    },
    {
      type: 'text',
      name: 'email',
      label: 'E-mail',
      placeholder: 'seu@email.com',
      description: 'Para backup do relatório',
      required: true,
    },
    {
      type: 'text',
      name: 'whatsapp',
      label: 'WhatsApp',
      placeholder: '(11) 99999-9999',
      description: 'Para envio do relatório',
      required: true,
    },
    {
      type: 'text',
      name: 'dataNascimento',
      label: 'Data de nascimento',
      placeholder: 'dd/mm/aaaa',
      description: 'A idade impacta diretamente em fatores de risco e recomendações.',
      justification: 'Fonte: Ministério da Saúde, 2022',
      required: true,
    },
    {
      type: 'select',
      name: 'sexo',
      label: 'Qual seu sexo biológico?',
      description: 'Importante para cálculos hormonais e metabólicos.',
      justification: 'Fonte: Sociedade Brasileira de Endocrinologia, 2023',
      options: [
        { value: 'Masculino', label: '🧍‍♂️ Masculino' },
        { value: 'Feminino', label: '🧍‍♀️ Feminino' },
      ],
      required: true,
    },
    {
      type: 'text',
      name: 'altura',
      label: 'Altura (em cm)',
      placeholder: 'Ex: 170',
      description: 'Importante para cálculo do IMC e avaliação de composição corporal.',
      justification: 'Fonte: WHO, 2021',
      required: true,
    },
    {
      type: 'text',
      name: 'peso',
      label: 'Peso (em kg)',
      placeholder: 'Ex: 70',
      description: 'Utilizado no cálculo do IMC e avaliação de saúde metabólica.',
      justification: 'Fonte: WHO, 2021',
      required: true,
    },
    {
      type: 'select',
      name: 'circunferencia_abdominal',
      label: 'Compare com seu perfil no espelho e selecione a imagem mais próxima de sua barriga 🪞👇',
      description: 'Imagens meramente ilustrativas para facilitar sua autoavaliação. Use um espelho e escolha o perfil mais próximo.',
      options: [
        {
          value: 'perfil_1',
          label: 'Menor que 90 cm',
          image: '/abdomen/male_funnel_belly_1.png',
        },
        {
          value: 'perfil_2',
          label: '90 a 100 cm',
          image: '/abdomen/male_funnel_belly_2.png',
        },
        {
          value: 'perfil_3',
          label: '100 a 110 cm',
          image: '/abdomen/male_funnel_belly_3.png',
        },
        {
          value: 'perfil_4',
          label: '110 a 120 cm',
          image: '/abdomen/male_funnel_belly_4.png',
        },
      ],
      justification: 'A circunferência abdominal é um dos principais marcadores de risco cardiometabólico e inflamação crônica.',
      example: 'Exemplo: Medida com fita métrica na altura do umbigo.',
      required: true,
      prioridade: 'alta',
      categoriaIA: 'nutricao',
    },
  ];
  const currentProfileStep = profileSteps[profileStepIndex];
  const totalProfileSteps = profileSteps.length;

  const steps: Step[] = formularios[tipoTriagem as keyof typeof formularios]?.perguntas || [];
  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;

  const shouldShowStep = (step: Step, data: Record<string, string | string[]> = formData) => {
    if (!step.conditional) return true;
    if (Array.isArray(step.conditional)) {
      return step.conditional.every((cond) => data[cond.field] === cond.value);
    }
    return data[step.conditional.field] === step.conditional.value;
  };

  // Se é primeira vez, mostrar formulário de perfil inicial (exceto para gastro que tem seus próprios campos)
  if (isFirstTime && currentProfileStep && tipoTriagem !== 'gastro') {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 via-brand-500 to-background px-4 py-6 text-foreground overflow-y-auto">
        <Particles
          id="tsparticles"
          options={{
            fullScreen: { enable: false },
            background: { color: 'transparent' },
            particles: {
              color: { value: '#00D084' },
              links: {
                color: '#00D084',
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                enable: true,
                speed: 0.5,
                direction: 'none',
                random: false,
                straight: false,
                outModes: { default: 'bounce' },
              },
              number: {
                value: 50,
                density: {
                  enable: true,
                },
              },
              opacity: { value: 0.2 },
              shape: { type: 'circle' },
              size: { value: { min: 1, max: 4 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 -z-10"
        />

        <div className="absolute top-4 left-4">
          <img src="/images/logo-teodoc.png" alt="Logo Teodoc" className="h-28 w-auto" />
        </div>
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => router.push(`/dashboard?cpf=${cpf.replace(/\D/g, '')}`)}
            className="px-6 py-3 text-base bg-background/80 backdrop-blur-sm border border-border hover:bg-brand-600 hover:text-white"
          >
            Voltar
          </Button>
        </div>

        <div className="bg-background/80 backdrop-blur-2xl rounded-3xl p-6 md:p-10 w-full max-w-xl shadow-2xl border border-border">
          {profileStepIndex === 0 && (
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground drop-shadow">
                👤 Cadastro Inicial
              </h1>
              <p className="mt-2 text-muted-foreground text-sm md:text-base">
                Primeira vez aqui? Vamos nos conhecer melhor para personalizar suas recomendações de saúde.
              </p>
              <div className="mt-4 text-left">
                <p className="text-xs md:text-sm text-foreground font-medium bg-muted/30 px-4 py-2 rounded-lg border border-border shadow-lg mb-4 text-center">
                  🔒 Suas respostas são <u>salvas no seu perfil</u> e podem ser editadas a qualquer momento. Dados protegidos pela <strong>LGPD</strong>.
                </p>
                <label className="inline-flex items-start space-x-3 text-sm md:text-base text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={termosAceitos}
                    onChange={(e) => setTermosAceitos(e.target.checked)}
                    className="mt-1 accent-brand-500 w-4 h-4 rounded"
                  />
                  <span>
                    Ao clicar em <strong>Iniciar</strong>, você concorda com os{' '}
                    <a href="/termos" target="_blank" rel="noopener noreferrer" className="underline text-brand-600 hover:text-brand-700">
                      Termos de Uso e Privacidade
                    </a>.
                  </span>
                </label>
              </div>
            </div>
          )}

          <ProgressBar current={profileStepIndex + 1} total={totalProfileSteps} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (profileStepIndex === 0 && !termosAceitos) {
                setToastMessage("⚠️ Você precisa aceitar os termos para continuar.");
                return;
              }
              handleProfileNext();
            }}
          >
            <AnimatePresence mode="wait">
              {shouldShowStep(currentProfileStep, profileData) && (
                <>
                  {/* Handle intro and setor types */}
                  {['intro', 'setor'].includes(currentProfileStep.type) && (
                    <div className="mb-6 text-center">
                      <h2 className="text-xl font-bold mb-3 text-foreground">{currentProfileStep.label}</h2>
                      {currentProfileStep.description && (
                        <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                          {currentProfileStep.description}
                        </p>
                      )}
                      {currentProfileStep.image && (
                        <div className="flex justify-center mb-4">
                          <img
                            src={currentProfileStep.image}
                            alt={currentProfileStep.label}
                            className="max-h-48 rounded-xl shadow-lg border border-border object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {/* Handle other types */}
                  {!['intro', 'setor'].includes(currentProfileStep.type) && (
                    <motion.div
                      key={currentProfileStep.name}
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      className="mb-6"
                    >
                      <label className="block text-lg font-semibold mb-2 text-foreground">
                        {currentProfileStep.label}
                      </label>
                      {currentProfileStep.example && (
                        <div className="text-sm text-muted-foreground italic mb-1">
                          Exemplo: {currentProfileStep.example}
                        </div>
                      )}
                      {currentProfileStep.description && (
                        <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
                          {currentProfileStep.description}
                        </p>
                      )}

                      {currentProfileStep.type === 'select' || currentProfileStep.type === 'multiselect' ? (
                        <SelectCard
                          options={(currentProfileStep.options || []).map((opt) =>
                            typeof opt === 'string'
                              ? { label: opt, value: opt, icon: <Circle /> }
                              : opt
                          )}
                          value={profileData[currentProfileStep.name as keyof typeof profileData] || (currentProfileStep.type === 'multiselect' ? [] : '')}
                          onChange={(value) =>
                            setProfileData((prev) => {
                              const updated = { ...prev };
                              if (currentProfileStep.type === 'multiselect') {
                                updated[currentProfileStep.name] = Array.isArray(value) ? value : [value];
                              } else {
                                updated[currentProfileStep.name] = typeof value === 'string' ? value : String(value);
                              }
                              return updated;
                            })
                          }
                          isMulti={currentProfileStep.type === 'multiselect'}
                        />
                      ) : (
                        <Input
                          type={currentProfileStep.type}
                          value={profileData[currentProfileStep.name as keyof typeof profileData] || ''}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              [currentProfileStep.name]: e.target.value,
                            }))
                          }
                          placeholder={currentProfileStep.placeholder || ''}
                          className={error ? 'border-foreground' : ''}
                        />
                      )}

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-foreground text-sm mt-1"
                        >
                          Este campo é obrigatório.
                        </motion.div>
                      )}
                      {currentProfileStep.justification && (
                        <div className="mt-2 text-sm text-muted-foreground italic">
                          <strong>Por que essa pergunta é importante?</strong>
                          <br />
                          {currentProfileStep.justification}
                        </div>
                      )}
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center mt-6 gap-4">
              <Button
                type="button"
                onClick={() => setProfileStepIndex((prev) => Math.max(prev - 1, 0))}
                className="w-1/2 text-lg font-bold py-3 transition-all duration-300 bg-muted hover:bg-muted/80 text-foreground shadow-md"
                disabled={profileStepIndex === 0 || loading}
              >
                Voltar
              </Button>

              <Button
                type="submit"
                className="w-1/2 text-lg font-bold py-3 transition-all duration-300 bg-brand-600 hover:bg-brand-700 text-white shadow-xl"
                disabled={loading}
              >
                {loading
                  ? 'Salvando...'
                  : profileStepIndex + 1 === totalProfileSteps
                  ? 'Finalizar Cadastro'
                  : 'Próxima'}
              </Button>
            </div>
          </form>
        </div>

        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-bg text-fg text-center">
        <img
          src="/logoalloehealthmaior.png"
          alt="Logo Alloe Health animado"
          className="w-24 h-24 mb-4 animate-bounce"
        />
        <p className="text-xl font-semibold">Estamos gerando seu Relatório e Plano de Vida...</p>
      </div>
    );
  }

  const criarTriagemAPI = async (cpf: string, dados: any) => {
    const res = await fetch(`/api/triagens?id=${encodeURIComponent(cpf)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!res.ok) throw new Error('Erro ao criar triagem');
    const json = await res.json();
    return json.id;
  };

  const gerarRelatorioAPI = async (cpf: string, dados: any) => {
    const res = await fetch('/api/gerarRelatorio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, formData: dados, tipo: tipoTriagem }),
    });
    if (!res.ok) throw new Error('Erro ao gerar relatório');
  };

  // Função para salvar perfil inicial
  const salvarPerfilInicial = async () => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    try {
      await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: cpfLimpo,
          nome: Array.isArray(profileData.nome) ? profileData.nome.join('') : profileData.nome || 'Não informado',
          email: Array.isArray(profileData.email) ? profileData.email.join('') : profileData.email || 'Não informado',
          whatsapp: Array.isArray(profileData.whatsapp) ? profileData.whatsapp.join('') : profileData.whatsapp || 'Não informado',
          nascimento: profileData.dataNascimento ? formatarData(profileData.dataNascimento) : '',
          sex: Array.isArray(profileData.sexo) ? profileData.sexo.join('') : profileData.sexo || '',
          height_cm: profileData.altura ? parseInt(Array.isArray(profileData.altura) ? profileData.altura.join('') : profileData.altura) : null,
          weight_kg: profileData.peso ? parseFloat(Array.isArray(profileData.peso) ? profileData.peso.join('') : profileData.peso) : null,
          circunferencia_abdominal: Array.isArray(profileData.circunferencia_abdominal) ? profileData.circunferencia_abdominal.join('') : profileData.circunferencia_abdominal || '',
        }),
      });

      // Marcar que o usuário já tem perfil
      localStorage.setItem(`hasProfile_${cpfLimpo}`, 'true');
      setIsFirstTime(false);
      
      // Copiar dados do perfil para o formData da triagem
      setFormData((prev) => ({
        ...prev,
        nome: profileData.nome || '',
        nascimento: profileData.dataNascimento || '',
        email: profileData.email || '',
        whatsapp: profileData.whatsapp || '',
        sexo: profileData.sexo || '',
        altura: profileData.altura || '',
        peso: profileData.peso || '',
        circunferencia_abdominal: profileData.circunferencia_abdominal || '',
        cpf: cpfLimpo,
      }));

      setToastMessage('✅ Perfil salvo com sucesso!');
    } catch (err) {
      console.error(err);
      setToastMessage('❌ Erro ao salvar perfil. Tente novamente.');
    }
  };

  const formatarData = (data: string | string[]) => {
    const dataStr = Array.isArray(data) ? data.join('') : data;
    const partes = dataStr.split('/');
    return partes.length === 3
      ? `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`
      : dataStr;
  };

  const handleProfileNext = () => {
    if (
      currentProfileStep.required &&
      (!profileData[currentProfileStep.name as keyof typeof profileData] ||
        (Array.isArray(currentProfileStep.conditional) &&
          currentProfileStep.conditional.some(
            (cond) => profileData[cond.field] !== cond.value
          )))
    ) {
      setError(true);
      return;
    }
    setError(false);
    if (profileStepIndex + 1 < totalProfileSteps) {
      setProfileStepIndex(profileStepIndex + 1);
    } else {
      salvarPerfilInicial();
    }
  };

  const handleNext = () => {
    if (
      currentStep.required &&
      (!formData[currentStep.name as keyof FormData] ||
        (Array.isArray(currentStep.conditional) &&
          currentStep.conditional.some(
            (cond) => formData[cond.field] !== cond.value
          )))
    ) {
      setError(true);
      return;
    }
    setError(false);
    if (stepIndex + 1 < totalSteps) {
      setStepIndex(stepIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    onSubmitStart && onSubmitStart();
    setLoading(true);

    // Sanitize CPF, handling string | string[]
    const rawCpf = formData.cpf || cpf;
    const cpfSanitized = Array.isArray(rawCpf) ? rawCpf.join('').replace(/\D/g, '') : rawCpf.replace(/\D/g, '');
    if (!cpfSanitized) {
      setToastMessage('❌ CPF obrigatório');
      setLoading(false);
      return;
    }

    document.cookie = `cpf=${cpfSanitized}; path=/; max-age=31536000`;
    localStorage.setItem('cpf', cpfSanitized);

    const formatarData = (data: string) => {
      const partes = data.split('/');
      return partes.length === 3
        ? `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`
        : data;
    };

    // Helpers to safely trim or access string or string[] values from formData fields
    const getTrimmedValue = (field: string | string[] | undefined | null): string => {
      if (!field) return '';
      if (Array.isArray(field)) return field.map((f) => (typeof f === 'string' ? f.trim() : '')).join(', ');
      return field.trim();
    };

    try {
      // Salvar dados do paciente via API
      await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: cpfSanitized,
          nome: getTrimmedValue(formData.nome) || 'Não informado',
          email: getTrimmedValue(formData.email) || 'Não informado',
          whatsapp: getTrimmedValue(formData.whatsapp) || 'Não informado',
          nascimento: formData.nascimento
            ? formatarData(getTrimmedValue(formData.nascimento))
            : '',
        }),
      });

      await criarTriagemAPI(cpfSanitized, { formData, tipo: tipoTriagem });
      await gerarRelatorioAPI(cpfSanitized, formData);

      localStorage.setItem('dadosTriagem', JSON.stringify(formData));
      localStorage.removeItem('triagemForm');

      setToastMessage('✅ Triagem enviada com sucesso!');
      router.push(`/dashboard?cpf=${cpfSanitized}`);
    } catch (err) {
      console.error(err);
      setToastMessage('❌ Erro ao salvar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!steps.length) {
    return (
      <div className="text-white p-10">
        <h1>Erro</h1>
        <p>Triagem não encontrada: {tipoTriagem}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 via-brand-500 to-background px-4 py-6 text-foreground overflow-y-auto">
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false },
          background: { color: 'transparent' },
          particles: {
            color: { value: '#00D084' },
            links: {
              color: '#00D084',
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.5,
              direction: 'none',
              random: false,
              straight: false,
              outModes: { default: 'bounce' },
            },
            number: {
              value: 50,
              density: {
                enable: true,
              },
            },
            opacity: { value: 0.2 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />

      <div className="absolute top-4 left-4">
        <img src="/images/logo-teodoc.png" alt="Logo Teodoc" className="h-28 w-auto" />
      </div>
      <div className="absolute top-4 right-4">
        <Button
          onClick={() => router.push(`/dashboard?cpf=${cpf.replace(/\D/g, '')}`)}
          className="px-6 py-3 text-base bg-background/80 backdrop-blur-sm border border-border hover:bg-brand-600 hover:text-white"
        >
          Voltar
        </Button>
      </div>

      <div className="bg-background/80 backdrop-blur-2xl rounded-3xl p-6 md:p-10 w-full max-w-xl shadow-2xl border border-border">
        {stepIndex === 0 && (
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground drop-shadow">
              🧠 {tipoTriagem === 'mental'
                ? 'Avaliação de Saúde Mental'
                : tipoTriagem === 'geral'
                ? 'Check-up Geral de Saúde'
                : tipoTriagem === 'geralRapida'
                ? 'Triagem Rápida de Saúde'
                : `Triagem ${tipoTriagem.charAt(0).toUpperCase() + tipoTriagem.slice(1)}`}
            </h1>
            <p className="mt-2 text-muted-foreground text-sm md:text-base">
              Responda algumas perguntas e receba orientações personalizadas com base científica.
            </p>
            {/* Bloco Termos de Uso e Privacidade */}
            <div className="mt-4 text-left">
              <p className="text-xs md:text-sm text-foreground font-medium bg-muted/30 px-4 py-2 rounded-lg border border-border shadow-lg mb-4 text-center">
                🔒 Suas respostas são <u>excluídas</u> após gerar o relatório. Dados protegidos pela <strong>LGPD</strong>.
              </p>
              <label className="inline-flex items-start space-x-3 text-sm md:text-base text-muted-foreground">
                <input
                  type="checkbox"
                  checked={termosAceitos}
                  onChange={(e) => setTermosAceitos(e.target.checked)}
                  className="mt-1 accent-brand-500 w-4 h-4 rounded"
                />
                <span>
                  Ao clicar em <strong>Iniciar</strong>, você concorda com os{' '}
                  <a href="/termos" target="_blank" rel="noopener noreferrer" className="underline text-brand-600 hover:text-brand-700">
                    Termos de Uso e Privacidade
                  </a>.
                </span>
              </label>
            </div>
          </div>
        )}

        <ProgressBar current={stepIndex + 1} total={totalSteps} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (stepIndex === 0 && !termosAceitos) {
              setToastMessage("⚠️ Você precisa aceitar os termos para continuar.");
              return;
            }
            handleNext();
          }}
        >
          <AnimatePresence mode="wait">
            {shouldShowStep(currentStep) && (
              <>
                {/* Handle intro and setor types */}
                {['intro', 'setor'].includes(currentStep.type) && (
                  <div className="mb-6 text-center">
                    <h2 className="text-xl font-bold mb-3 text-foreground">{currentStep.label}</h2>
                    {currentStep.description && (
                      <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                        {currentStep.description}
                      </p>
                    )}
                    {currentStep.image && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={currentStep.image}
                          alt={currentStep.label}
                          className="max-h-48 rounded-xl shadow-lg border border-border object-contain"
                        />
                      </div>
                    )}
                    {/* Botão principal já está ao final do formulário, esse é redundante e foi removido */}
                  </div>
                )}
                {/* Handle other types */}
                {!['intro', 'setor'].includes(currentStep.type) && (
                  <motion.div
                    key={currentStep.name}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6"
                  >
                    <label className="block text-lg font-semibold mb-2 text-foreground">
                      {currentStep.label}
                    </label>
                    {currentStep.example && (
                      <div className="text-sm text-muted-foreground italic mb-1">
                        Exemplo: {currentStep.example}
                      </div>
                    )}
                    {currentStep.description && (
                      <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
                        {currentStep.description}
                      </p>
                    )}

                    {currentStep.type === 'select' || currentStep.type === 'multiselect' ? (
                    <SelectCard
                      options={(currentStep.options || []).map((opt) =>
                        typeof opt === 'string'
                          ? { label: opt, value: opt, icon: <Circle /> }
                          : opt
                      )}
                      value={formData[currentStep.name as keyof typeof formData] || (currentStep.type === 'multiselect' ? [] : '')}
                      onChange={(value) =>
                        setFormData((prev) => {
                          const updated = { ...prev };
                          if (currentStep.type === 'multiselect') {
                            updated[currentStep.name] = Array.isArray(value) ? value : [value];
                          } else {
                            updated[currentStep.name] = typeof value === 'string' ? value : String(value);
                          }
                          return updated;
                        })
                      }
                      isMulti={currentStep.type === 'multiselect'}
                    />
                    ) : (
                      <Input
                        type={currentStep.type}
                        value={formData[currentStep.name as keyof FormData] || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [currentStep.name]: e.target.value,
                          }))
                        }
                        placeholder={currentStep.placeholder || ''}
                        className={error ? 'border-foreground' : ''}
                      />
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-foreground text-sm mt-1"
                      >
                        Este campo é obrigatório.
                      </motion.div>
                    )}
                    {currentStep.justification && (
                      <div className="mt-2 text-sm text-muted-foreground italic">
                        <strong>Por que essa pergunta é importante?</strong>
                        <br />
                        {currentStep.justification}
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-6 gap-4">
            <Button
              type="button"
              onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
              className="w-1/2 text-lg font-bold py-3 transition-all duration-300 bg-muted hover:bg-muted/80 text-foreground shadow-md"
              disabled={stepIndex === 0 || loading}
            >
              Voltar
            </Button>

            <Button
              type="submit"
              className="w-1/2 text-lg font-bold py-3 transition-all duration-300 bg-brand-600 hover:bg-brand-700 text-white shadow-xl"
              disabled={loading}
            >
              {loading
                ? 'Salvando...'
                : stepIndex + 1 === totalSteps
                ? 'Finalizar'
                : 'Próxima'}
            </Button>
          </div>
        </form>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
