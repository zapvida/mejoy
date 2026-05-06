// src/forms/gastro.ts
// Triagem Gastrointestinal — UX final (linguagem simples + why + ref + CTAs)
// ⚠️ Escopo: triagem apenas. Não altera PDF. Não muda número de passos.

export type TOption = { value: string; label: string; helper?: string };
export type TQuestion = {
  id: string;
  label: string;
  type: 'input'|'number'|'radio'|'checkbox'|'select'|'scale'|'textarea'|'date'|'matrix';
  placeholder?: string;
  options?: TOption[];
  min?: number; max?: number; step?: number;
  required?: boolean;
  saveAs?: string;
  unit?: string;
  hint?: string;
  why?: string;         // "por que perguntamos?" (texto curto, humano)
  ref?: string;         // NOVO: referência curta (ex.: "Escala de Bristol; guia clínico 2021")
  condition?: { when: string; is: any; not?: boolean }[];
  normalize?: 'digits'|'float'|'upper'|'lower';
};

export type TStep = { id: string; title: string; questions: TQuestion[]; };
export type TForm = { slug: 'gastro'; titulo: string; descricao: string; steps: TStep[]; };

// Mantemos Bristol 1–5 (compat) com microcopy clara
const bristol: TOption[] = [
  { value: '1', label: '1️⃣ Muito duras', helper: 'Cocô em bolinhas' },
  { value: '2', label: '2️⃣ Duras', helper: 'Salsicha com rachaduras' },
  { value: '3', label: '3️⃣ Intermediárias', helper: 'Mais firmes' },
  { value: '4', label: '4️⃣ Lisas e macias', helper: 'Padrão ideal' },
  { value: '5', label: '5️⃣ Moles/irregulares', helper: 'Tendência a diarreia' },
];

export const gastro: TForm = {
  slug: 'gastro',
  titulo: 'Saúde do Seu Intestino',
  descricao: 'Triagem simples e inteligente sobre digestão, intestino, refluxo e hábitos. Grátis.',
  steps: [
    // 1) Sexo biológico
    {
      id: 'sexo',
      title: 'Quem é você',
      questions: [
        {
          id: 'sexo',
          label: 'Sexo biológico',
          type: 'radio',
          saveAs: 'sexo',
          required: true,
          why: 'Algumas faixas de referência mudam conforme o sexo.',
          ref: 'Guia clínico de rastreios por sexo/idade',
          options: [
            { value: 'masculino', label: 'Masculino' },
            { value: 'feminino', label: 'Feminino' },
            { value: 'nao_dizer', label: 'Prefiro não dizer' },
          ],
        },
      ],
    },

    // 2) Idade
    {
      id: 'idade',
      title: 'Idade',
      questions: [
        {
          id: 'idade',
          label: 'Qual sua idade?',
          type: 'number',
          saveAs: 'idade',
          required: true,
          min: 12, max: 90,
          why: 'Risco e condutas mudam com a idade.',
          ref: 'Diretrizes por faixa etária',
        },
      ],
    },

    // 3) Peso e Altura
    {
      id: 'peso_altura',
      title: 'Peso e Altura',
      questions: [
        {
          id: 'peso',
          label: 'Peso (kg)',
          type: 'number',
          saveAs: 'peso',
          required: true,
          min: 30, max: 200, step: 0.1,
          normalize: 'float',
          why: 'Usamos para IMC e orientar metas.',
          ref: 'OMS: IMC em adultos',
        },
        {
          id: 'altura',
          label: 'Altura (cm)',
          type: 'number',
          saveAs: 'altura',
          required: true,
          min: 100, max: 220, step: 0.1,
          normalize: 'float',
          why: 'Usamos para IMC e orientar metas.',
          ref: 'OMS: IMC em adultos',
        },
      ],
    },

    // 4) Sintoma principal
    {
      id: 'sintoma_principal',
      title: 'O que mais incomoda',
      questions: [
        {
          id: 'sintoma_principal',
          label: 'Qual é o seu principal sintoma hoje?',
          type: 'radio',
          saveAs: 'sintoma_principal',
          required: true,
          why: 'Ajuda a direcionar as orientações e o plano.',
          ref: 'Triagem centrada no sintoma',
          options: [
            { value: 'dor_abdominal', label: 'Dor na barriga' },
            { value: 'azia_refluxo', label: 'Azia / refluxo' },
            { value: 'constipacao', label: 'Intestino preso' },
            { value: 'diarreia', label: 'Diarreia' },
            { value: 'inchaço', label: 'Inchaço / gases' },
            { value: 'nausea', label: 'Náusea / enjoo' },
            { value: 'outro', label: 'Outro' },
          ],
        },
      ],
    },

    // 5) Padrão das fezes (Bristol) + NOVAS perguntas objetivas
    {
      id: 'bristol',
      title: 'Sobre o seu intestino',
      questions: [
        {
          id: 'bristol',
          label: 'Como costuma ser o seu cocô?',
          type: 'matrix',
          saveAs: 'bristol',
          required: true,
          why: 'A forma ajuda a entender se há constipação ou diarreia.',
          ref: 'Escala de Bristol (1–5 simplificada)',
          options: bristol,
        },
        // NOVO (curto, alto valor, não cria novo step)
        {
          id: 'urgencia',
          label: 'Dá vontade urgente de ir ao banheiro?',
          type: 'radio',
          saveAs: 'urgencia',
          options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }],
          why: 'Urgência pode indicar inflamação ou diarreia ativa.',
          ref: 'Sinais clínicos de alarme',
        },
        {
          id: 'nocturna',
          label: 'Você acorda à noite para evacuar?',
          type: 'radio',
          saveAs: 'nocturna',
          options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }],
          why: 'Evacuação noturna é um sinal de alerta.',
          ref: 'Sinais clínicos de alarme',
        },
      ],
    },

    // 6) Frequência
    {
      id: 'frequencia',
      title: 'Frequência',
      questions: [
        {
          id: 'frequencia_evacuacao',
          label: 'Com que frequência você evacua?',
          type: 'radio',
          saveAs: 'frequencia_evacuacao',
          required: true,
          why: 'Frequência complementa a forma e guia conduta.',
          ref: 'Critérios práticos de ritmo intestinal',
          options: [
            { value: '<3_semana', label: 'Menos de 3 por semana' },
            { value: '3-7_semana', label: '3–7 por semana' },
            { value: 'diaria', label: '1 vez por dia' },
            { value: '>1_dia', label: '2 ou mais por dia' },
          ],
        },
      ],
    },

    // 7) Duração
    {
      id: 'duracao',
      title: 'Desde quando',
      questions: [
        {
          id: 'duracao_quadro',
          label: 'Há quanto tempo isso acontece?',
          type: 'radio',
          saveAs: 'duracao_quadro',
          required: true,
          why: 'Ajuda a diferenciar algo pontual de algo crônico.',
          ref: 'Abordagem por tempo de sintomas',
          options: [
            { value: '1-3_dias', label: '1–3 dias' },
            { value: '1-4_semanas', label: '1–4 semanas' },
            { value: '1-3_meses', label: '1–3 meses' },
            { value: '>3_meses', label: 'Mais de 3 meses' },
          ],
        },
      ],
    },

    // 8) Red flags (lista clara)
    {
      id: 'red_flags',
      title: 'Sinais de alerta',
      questions: [
        {
          id: 'red_flags',
          label: 'Algum desses sinais apareceu?',
          type: 'checkbox',
          saveAs: 'red_flags',
          required: true,
          hint: 'Se marcar algo, recomendaremos falar com um médico.',
          why: 'Sinais que pedem avaliação mais rápida.',
          ref: 'Guia de sinais de alarme (intestino)',
          options: [
            { value: 'sangue_vivo', label: 'Sangue vivo ou fezes pretas' },
            { value: 'perda_peso', label: 'Perda de peso sem tentar' },
            { value: 'anemia', label: 'Anemia / cansaço fora do comum' },
            { value: 'nocturna', label: 'Acordo à noite para evacuar' },
            { value: 'vomitos_persistentes', label: 'Vômitos persistentes' },
            { value: 'febre_persistente', label: 'Febre persistente' },
            { value: 'nenhuma', label: 'Nenhuma dessas' },
          ],
        },
      ],
    },

    // 9) Medicamentos (linguagem simples, exemplos)
    {
      id: 'medicamentos',
      title: 'Remédios em uso',
      questions: [
        {
          id: 'medicamentos_recentes',
          label: 'Você usa algum destes remédios?',
          type: 'checkbox',
          saveAs: 'medicamentos_recentes',
          why: 'Eles podem mudar os sintomas.',
          ref: 'Efeito de remédios em sintomas digestivos',
          options: [
            { value: 'antiinflamatorio', label: 'Anti-inflamatórios (ibuprofeno, diclofenaco, naproxeno)' },
            { value: 'antiacidos', label: 'Remédios para acidez/refluxo (omeprazol, pantoprazol)' },
            { value: 'antibiotico', label: 'Antibiótico (últimos 3 meses)' },
            { value: 'nenhum', label: 'Nenhum' },
          ],
        },
      ],
    },

    // 10) Suplementos (com Alloezil como opção, não promocional aqui)
    {
      id: 'suplementos',
      title: 'Suplementos',
      questions: [
        {
          id: 'suplementos_digestivos',
          label: 'Você usa suplementos para o intestino/digestão?',
          type: 'radio',
          saveAs: 'suplementos_digestivos',
          required: true,
          why: 'Evita orientações duplicadas e ajusta doses.',
          ref: 'Recomendações práticas de uso',
          options: [
            { value: 'nao', label: 'Não' },
            { value: 'zapfarm', label: 'Sim, uso ou já usei MeJoy' },
            { value: 'outro', label: 'Sim, outro' },
          ],
        },
        {
          id: 'suplemento_outro',
          label: 'Qual suplemento?',
          type: 'input',
          saveAs: 'suplemento_outro',
          placeholder: 'Ex.: probiótico, enzimas…',
          condition: [{ when: 'suplementos_digestivos', is: 'outro' }],
        },
      ],
    },

    // 11) Hábitos (mantém checkboxes + NOVOS campos numéricos opcionais)
    {
      id: 'habitos',
      title: 'Seus hábitos',
      questions: [
        // NOVO: números opcionais que ajudam (não obrigatórios)
        {
          id: 'agua_litros',
          label: 'Quanta água você bebe por dia (em litros)?',
          type: 'number',
          saveAs: 'agua_litros',
          min: 0.5, max: 4.0, step: 0.1,
          unit: 'L/dia',
          why: 'Água suficiente ajuda o intestino a funcionar melhor.',
          ref: 'Recomendação prática de hidratação',
        },
        {
          id: 'fibras_gramas',
          label: 'Quantas fibras você costuma comer por dia (em gramas)?',
          type: 'number',
          saveAs: 'fibras_gramas',
          min: 0, max: 60, step: 1,
          unit: 'g/dia',
          why: 'Fibras ajudam no ritmo e conforto intestinal.',
          ref: 'Consumo diário de fibras — recomendação',
        },
        // Mantém seu bloco original
        {
          id: 'habitos_negativos',
          label: 'Quais destes hábitos você tem?',
          type: 'checkbox',
          saveAs: 'habitos_negativos',
          options: [
            { value: 'agua_baixa', label: 'Pouca água (< 1 L/dia)' },
            { value: 'fibras_baixas', label: 'Pouca fibra' },
            { value: 'cafeina_alta', label: 'Muita cafeína' },
            { value: 'alcool_frequente', label: 'Álcool frequente' },
            { value: 'sedentarismo', label: 'Sedentarismo' },
            { value: 'nenhum', label: 'Nenhum' },
          ],
        },
      ],
    },

    // 12) Antibiótico recente (condicional preservada)
    {
      id: 'antibiotico_direto',
      title: 'Antibiótico',
      questions: [
        {
          id: 'antibiotico_recente',
          label: 'Tomou antibiótico nos últimos 3 meses?',
          type: 'radio',
          saveAs: 'antibiotico_recente',
          required: true,
          condition: [{ when: 'medicamentos_recentes', is: 'antibiotico', not: true }],
          why: 'Antibióticos podem alterar o intestino temporariamente.',
          ref: 'Efeito de antibióticos na flora intestinal',
          options: [
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
            { value: 'nao_sei', label: 'Não sei' },
          ],
        },
      ],
    },

    // 13) Estresse & Sono
    {
      id: 'estresse_sono',
      title: 'Rotina e bem-estar',
      questions: [
        {
          id: 'estresse_nivel',
          label: 'Como está seu nível de estresse?',
          type: 'scale',
          saveAs: 'estresse_nivel',
          required: true,
          min: 0, max: 3, step: 1,
          hint: '0 = baixo • 1 = moderado • 2 = alto • 3 = muito alto',
          why: 'Estresse pode piorar sintomas digestivos.',
          ref: 'Relação estresse–intestino',
        },
        {
          id: 'sono_qualidade',
          label: 'Como está a qualidade do seu sono?',
          type: 'scale',
          saveAs: 'sono_qualidade',
          required: true,
          min: 0, max: 3, step: 1,
          hint: '0 = ruim • 1 = ok • 2 = boa • 3 = muito boa',
          why: 'Dormir bem ajuda o intestino a regular o ritmo.',
          ref: 'Sono e saúde digestiva',
        },
      ],
    },

    // 14) Histórico
    {
      id: 'doencas_conhecidas',
      title: 'Histórico',
      questions: [
        {
          id: 'doencas_conhecidas',
          label: 'Você tem alguma dessas condições?',
          type: 'checkbox',
          saveAs: 'doencas_conhecidas',
          why: 'Histórico muda prioridades de cuidado.',
          ref: 'Estratificação por comorbidades',
          options: [
            { value: 'gastrite', label: 'Gastrite' },
            { value: 'refluxo', label: 'Refluxo' },
            { value: 'intestino_irritavel', label: 'Intestino irritável' },
            { value: 'doenca_inflamatoria', label: 'Doença inflamatória intestinal' },
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'nenhuma', label: 'Nenhuma' },
          ],
        },
      ],
    },

    // 15) Objetivo + CTA Alloezil (penúltima)
    {
      id: 'objetivo',
      title: 'Seu objetivo',
      questions: [
        {
          id: 'objetivo_principal',
          label: 'Qual é seu objetivo principal agora?',
          type: 'radio',
          saveAs: 'objetivo_principal',
          required: true,
          why: 'Foco facilita o plano mais útil para você.',
          ref: 'Planejamento centrado no objetivo',
          options: [
            { value: 'parar_dor', label: 'Parar dor' },
            { value: 'melhorar_intestino', label: 'Destravar intestino preso' },
            { value: 'reduzir_refluxo', label: 'Reduzir azia/refluxo' },
            { value: 'controlar_diarreia', label: 'Controlar diarreia' },
            { value: 'entender_causas', label: 'Entender as causas' },
            { value: 'outro', label: 'Outro' },
          ],
        },
        // NOVO CTA penúltimo (curto, simpático)
        {
          id: 'cta_zapfarm',
          label: 'Você já conhece o MeJoy (suplemento para conforto intestinal)?',
          type: 'radio',
          saveAs: 'cta_alloezil',
          why: 'Se já usa, evitamos repetir orientação; se não, mostramos opções.',
          ref: 'Educação do usuário sobre suplemento',
          options: [
            { value: 'quero_saber', label: 'Quero saber mais' },
            { value: 'ja_uso', label: 'Já uso' },
            { value: 'agora_nao', label: 'Agora não' },
          ],
        },
      ],
    },

    // 16) Contato + CTA ZapVida (última)
    {
      id: 'contato',
      title: 'Finalizar',
      questions: [
        // NOVO CTA último (pergunta simples de intenção)
        {
          id: 'cta_zapvida',
          label: 'Quer falar com um médico agora pelo ZapVida (o "Uber" da telemedicina)?',
          type: 'radio',
          saveAs: 'cta_zapvida',
          why: 'Se quiser, abrimos as opções de consulta em minutos.',
          ref: 'Acesso rápido à telemedicina',
          options: [
            { value: 'sim', label: 'Sim, quero ver as opções' },
            { value: 'nao', label: 'Agora não' },
          ],
        },
        {
          id: 'email',
          label: 'Seu e-mail (opcional)',
          type: 'input',
          saveAs: 'email',
          placeholder: 'seu@email.com',
        },
        {
          id: 'whatsapp',
          label: 'Seu WhatsApp (opcional)',
          type: 'input',
          saveAs: 'whatsapp',
          placeholder: '(11) 99999-9999',
        },
      ],
    },
  ],
};

export default gastro;
