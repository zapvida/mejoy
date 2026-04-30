'use client';

import { ReactNode } from 'react';

export default function TrackingProvider({ children }: { children?: ReactNode }) {
  // Tracking já é feito via GA e outros providers globais
  // Este componente existe apenas para compatibilidade
  return <>{children}</>;
}

