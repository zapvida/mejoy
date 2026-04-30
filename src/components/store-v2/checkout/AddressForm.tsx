'use client';

import { MapPin } from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base';

export interface AddressFormData {
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface AddressFormProps {
  form: AddressFormData;
  setForm: React.Dispatch<React.SetStateAction<AddressFormData>>;
  cepError: string | null;
  setCepError: React.Dispatch<React.SetStateAction<string | null>>;
  cepSuccess: boolean;
  onCepBlur: () => void;
}

export default function AddressForm({
  form,
  setForm,
  cepError,
  setCepError,
  cepSuccess,
  onCepBlur,
}: AddressFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Endereço de Entrega</h3>
        </div>
      </div>
      <div className="p-4 lg:p-6 space-y-4">
        <div>
          <input
            autoComplete="postal-code"
            placeholder="CEP"
            value={form.cep}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
              const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
              setForm((f) => ({ ...f, cep: formatted }));
              setCepError(null);
            }}
            onBlur={onCepBlur}
            className={`${inputClass} ${cepError ? 'border-red-500' : ''}`}
          />
          {cepError && <p className="text-red-600 text-sm mt-1">{cepError}</p>}
          {cepSuccess && (
            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
              ✓ Endereço preenchido automaticamente
            </p>
          )}
          {!cepError && !cepSuccess && (
            <p className="text-xs text-gray-500 mt-1">Endereço preenchido automaticamente ao informar o CEP</p>
          )}
        </div>
        <input
          autoComplete="street-address"
          placeholder="Rua"
          value={form.endereco}
          onChange={(e) => setForm((f) => ({ ...f, endereco: e.target.value }))}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            autoComplete="off"
            placeholder="Número"
            value={form.numero}
            onChange={(e) => setForm((f) => ({ ...f, numero: e.target.value }))}
            className={inputClass}
          />
          <input
            placeholder="Complemento (opcional)"
            value={form.complemento}
            onChange={(e) => setForm((f) => ({ ...f, complemento: e.target.value }))}
            className={inputClass}
          />
        </div>
        <input
          autoComplete="address-level3"
          placeholder="Bairro"
          value={form.bairro}
          onChange={(e) => setForm((f) => ({ ...f, bairro: e.target.value }))}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            autoComplete="address-level2"
            placeholder="Cidade"
            value={form.cidade}
            onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))}
            className={inputClass}
          />
          <input
            autoComplete="address-level1"
            placeholder="UF"
            value={form.estado}
            onChange={(e) =>
              setForm((f) => ({ ...f, estado: e.target.value.toUpperCase().slice(0, 2) }))
            }
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
