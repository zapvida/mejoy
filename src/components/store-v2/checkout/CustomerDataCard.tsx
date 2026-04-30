'use client';

import { User } from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base';

export interface CustomerFormData {
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
}

interface CustomerDataCardProps {
  form: CustomerFormData;
  setForm: React.Dispatch<React.SetStateAction<CustomerFormData>>;
  cpfError: string | null;
  setCpfError: React.Dispatch<React.SetStateAction<string | null>>;
  onCpfBlur: () => void;
  formatCPF: (value: string) => string;
}

export default function CustomerDataCard({
  form,
  setForm,
  cpfError,
  setCpfError,
  onCpfBlur,
  formatCPF,
}: CustomerDataCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Dados do Cliente</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">Preencha seus dados para continuar</p>
      </div>
      <div className="p-4 lg:p-6 space-y-4">
        <input
          autoComplete="name"
          autoFocus
          placeholder="Nome completo"
          value={form.nome}
          onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
          className={inputClass}
          required
        />
        <input
          type="email"
          autoComplete="email"
          placeholder="E-mail"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={inputClass}
          required
        />
        <input
          type="tel"
          autoComplete="tel"
          placeholder="Celular (11) 99999-9999"
          value={form.telefone}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
            const formatted =
              digits.length <= 2
                ? digits.length > 0 ? `(${digits}` : ''
                : digits.length <= 7
                  ? `(${digits.slice(0, 2)}) ${digits.slice(2)}`
                  : `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
            setForm((f) => ({ ...f, telefone: formatted }));
          }}
          className={inputClass}
          required
        />
        <div>
          <input
            placeholder="CPF (opcional)"
            value={form.cpfCnpj}
            onChange={(e) => {
              setForm((f) => ({ ...f, cpfCnpj: formatCPF(e.target.value) }));
              setCpfError(null);
            }}
            onBlur={onCpfBlur}
            className={`${inputClass} ${cpfError ? 'border-red-500' : ''}`}
          />
          {cpfError && <p className="text-red-600 text-sm mt-1">{cpfError}</p>}
          <p className="text-xs text-gray-500 mt-1">Opcional para PIX. Necessário para nota fiscal.</p>
        </div>
      </div>
    </div>
  );
}
