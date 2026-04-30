/**
 * Configurações e Feature Flags - Emagrecimento
 * 
 * Controla funcionalidades relacionadas ao fluxo de emagrecimento
 */

/**
 * Protocolo foco do launch MeJoy (congelamento operacional).
 * Slug da triagem / funil principal até go-live oficial — não substitui decisão de produto em outros canais.
 */
export const MEJOY_LAUNCH_PROTOCOL_FOCUS_SLUG = 'emagrecimento' as const;

/**
 * Feature flag para habilitar cálculo automático de posologia de tirzepatida
 * 
 * Quando false, a pré-prescrição não incluirá posologia numérica detalhada
 * 
 * @default true (para demo/apresentação)
 */
export function isAutoPosologiaEnabled(): boolean {
  return process.env.ENABLE_TIRZEPATIDA_AUTOPOSOLOGIA !== 'false';
}

/**
 * Feature flag para mostrar mensagem de modo demo
 * 
 * Quando true, exibe aviso adicional de que está em modo demonstração
 * 
 * @default false
 */
export function isDemoModeEnabled(): boolean {
  return process.env.ENABLE_TIRZEPATIDA_AUTOPOSOLOGIA_DEMO_MESSAGE === 'true';
}

/**
 * Relatório de emagrecimento em modo compacto: análise longa e evidências ficam recolhíveis.
 * Padrão: ligado. Desligue com NEXT_PUBLIC_EMAGRECIMENTO_REPORT_COMPACT=0
 */
export function isEmagrecimentoReportCompact(): boolean {
  return process.env.NEXT_PUBLIC_EMAGRECIMENTO_REPORT_COMPACT !== '0';
}

