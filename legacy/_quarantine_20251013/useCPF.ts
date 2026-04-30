import { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';

/**
 * Hook para gerenciar o CPF do paciente utilizando cookies, localStorage e URL query.
 */
export function useCPF() {
  const [cpf, setCpf] = useState<string | null>(null);

  const persistCpf = useCallback((value: string) => {
    Cookies.set('cpf', value, { expires: 7 });
    localStorage.setItem('cpf', value);
  }, []);

  // Carrega o CPF da URL, cookie ou localStorage
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryCpf = searchParams.get('cpf');
    const cookieCpf = Cookies.get('cpf');
    const localCpf = localStorage.getItem('cpf');

    const finalCpf = queryCpf || cookieCpf || localCpf;

    if (finalCpf) {
      setCpf(finalCpf);
      persistCpf(finalCpf);
    }
  }, [persistCpf]);

  const atualizarCpf = useCallback((novoCpf: string) => {
    setCpf(novoCpf);
    persistCpf(novoCpf);
  }, [persistCpf]);

  const removerCpf = useCallback(() => {
    setCpf(null);
    Cookies.remove('cpf');
    localStorage.removeItem('cpf');
  }, []);

  return { cpf, atualizarCpf, removerCpf };
}