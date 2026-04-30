import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function usePaciente() {
  const [cpf, setCpf] = useState<string | null>(null);
  const [dados, setDados] = useState<{
    nome: string;
    nascimento: string;
    email: string;
    whatsapp: string;
  }>({
    nome: '',
    nascimento: '',
    email: '',
    whatsapp: '',
  });

  useEffect(() => {
    const storedCpf = Cookies.get('cpf') || localStorage.getItem('cpf');
    if (storedCpf) {
      setCpf(storedCpf);
      // Buscar paciente via API Supabase
      fetch(`/api/pacientes?cpf=${storedCpf}`)
        .then((res) => res.json())
        .then((paciente) => {
          if (paciente && !paciente.error) {
            setDados({
              nome: paciente.nome || '',
              nascimento: paciente.nascimento || '',
              email: paciente.email || '',
              whatsapp: paciente.whatsapp || '',
            });
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar paciente:', error);
        });
    }
  }, []);

  const atualizarCpf = (novoCpf: string) => {
    setCpf(novoCpf);
    Cookies.set('cpf', novoCpf);
    localStorage.setItem('cpf', novoCpf);
  };

  const removerCpf = () => {
    setCpf(null);
    Cookies.remove('cpf');
    localStorage.removeItem('cpf');
    setDados({ nome: '', nascimento: '', email: '', whatsapp: '' });
  };

  return { cpf, dados, atualizarCpf, removerCpf };
}