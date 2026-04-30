'use client';

import SimpleView from './SimpleView';
import ModerateView from './ModerateView';
import CompleteView from './CompleteView';
import type { FluxoEntry } from '@/lib/fluxos-mejoy/types';
import type { NivelApresentacao } from '@/lib/fluxos-mejoy/types';

interface FlowDetailProps {
  fluxo: FluxoEntry;
  nivel: NivelApresentacao;
}

export default function FlowDetail({ fluxo, nivel }: FlowDetailProps) {
  if (nivel === 'completo') return <CompleteView fluxo={fluxo} />;
  if (nivel === 'moderado') return <ModerateView fluxo={fluxo} />;
  return <SimpleView fluxo={fluxo} />;
}
