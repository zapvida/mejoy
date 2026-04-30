import { useState, useEffect } from 'react';

export function useConversionTriggers(enabled: boolean = true) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    // Lógica simples: não mostrar automaticamente
    // Pode ser expandido depois
  }, [enabled]);

  return { shouldShow, setShouldShow };
}

