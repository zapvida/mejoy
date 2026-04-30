export interface LinhaDoTempoItem {
  data: string;
  evento: string;
  detalhe?: string;
}

export interface LinhaDoTempoSectionProps {
  linhaDoTempo: LinhaDoTempoItem[];
}