/**
 * Tipos para a página Fluxos de Entrada — Sol com MeJoy no centro
 */

import type { ComponentType } from 'react';

export type NivelApresentacao = 'simples' | 'moderado' | 'completo';

export interface FluxoSimples {
  titulo: string;
  frase: string;
  passos: string[];
  quemPaga: string;
  receita: string;
}

export interface FluxoModerado {
  urls: string[];
  integracoes: string[];
  cta: string;
}

export interface FluxoCompleto {
  apis: string[];
  metricas: string[];
  escala: string;
  riscos: string[];
}

export interface Monetizacao {
  tipo: string;
  valores: string;
}

export interface FluxoEntry {
  slug: string;
  nome: string;
  labelCurto: string;
  icone: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  ordem: number;
  cor: string;
  tipo: 'produto' | 'triagem';
  simples: FluxoSimples;
  moderado: FluxoModerado;
  completo: FluxoCompleto;
  monetizacao: Monetizacao;
}
