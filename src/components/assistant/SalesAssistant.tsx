'use client';

import { useState } from 'react';

export default function SalesAssistant() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600 transition flex items-center justify-center z-50"
        aria-label="Assistente de vendas"
      >
        ?
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-xl rounded-lg z-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Assistente de Vendas</h3>
        <button onClick={() => setOpen(false)} className="text-gray-500">
          ✕
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Entre em contato no WhatsApp ou envie um email para suporte.
      </p>
    </div>
  );
}

