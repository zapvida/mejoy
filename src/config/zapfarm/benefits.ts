/**
 * Configuração centralizada de benefícios e features
 *
 * Esta é a fonte única de verdade para todos os benefícios exibidos
 * na landing page de obesidade/emagrecimento.
 *
 * Última atualização: Abril 2026
 */

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface PlanFeature {
  text: string;
}

/**
 * Benefícios principais do programa (exibidos na seção Benefits)
 */
export const mainBenefits: Benefit[] = [
  {
    icon: '🩺',
    title: 'Avaliação médica responsável',
    description: 'Elegibilidade e conduta definidas por profissional com CRM, conforme seu histórico clínico.',
  },
  {
    icon: '📋',
    title: 'Plano individual de emagrecimento',
    description: 'Estratégia prática com foco em adesão, hábitos e metas realistas para o seu perfil.',
  },
  {
    icon: '💬',
    title: 'Acompanhamento contínuo',
    description: 'Suporte no dia a dia via app e WhatsApp para manter consistência e ajustar a rota.',
  },
];

/**
 * Features do app (exibidas na seção App Features)
 */
export const appFeatures: string[] = [
  'Check-ins de peso, rotina e adesão em poucos toques',
  'Canal de suporte para dúvidas do dia a dia',
  'Plano organizado por etapas com próximos passos claros',
  'Resumo de evolução para consulta e tomada de decisão clínica',
  'Lembretes e acompanhamento de metas semanais',
  'Histórico centralizado para você não perder contexto',
];

/**
 * Features do Plano Essencial
 */
export const planEssentialFeatures: PlanFeature[] = [
  { text: 'Triagem clínica completa e organizada' },
  { text: 'Consulta médica online conforme seu plano' },
  { text: 'Acesso ao app para metas e acompanhamento' },
  { text: 'Canal de dúvidas assíncronas por mensagens' },
];

/**
 * Features do Plano Metabólico (adicionais ao Essencial)
 */
export const planMetabolicoFeatures: PlanFeature[] = [
  { text: 'Tudo do Essencial, com acompanhamento ampliado' },
  { text: 'Avaliação de elegibilidade para estratégias metabólicas' },
  { text: 'Discussão de medicação somente quando houver indicação médica' },
  { text: 'Revisão periódica de evolução e exames quando necessário' },
  { text: 'Prioridade de suporte em momentos de ajuste do plano' },
];

/**
 * Features do Plano Total (adicionais ao Metabólico)
 */
export const planTotalFeatures: PlanFeature[] = [
  { text: 'Tudo do Metabólico com apoio intensivo' },
  { text: 'Ritmo de acompanhamento mais próximo' },
  { text: 'Sessões adicionais com equipe multidisciplinar' },
  { text: 'Relatórios estruturados de evolução e aderência' },
  { text: 'Canal prioritário para dúvidas operacionais' },
];

/**
 * Descrição do programa (usada em múltiplos lugares)
 */
export const programDescription = {
  title: 'Programa de Emagrecimento com Direção Médica',
  subtitle:
    'Triagem inteligente, avaliação clínica e acompanhamento contínuo no mesmo fluxo para decisões seguras e consistentes.',
};

/**
 * Descrições dos planos
 */
export const planDescriptions = {
  essential: 'Entrada segura para iniciar com clareza e consistência',
  metabolico: 'Para quem precisa de acompanhamento clínico mais próximo',
  total: 'Estrutura intensiva para acelerar aderência com suporte ampliado',
};
