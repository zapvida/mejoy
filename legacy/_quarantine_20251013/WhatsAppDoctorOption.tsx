// src/components/WhatsAppDoctorOption/WhatsAppDoctorOption.tsx

import React from 'react'

export default function WhatsAppDoctorOption() {
  return (
    <div className="p-4 border rounded-xl bg-green-50 border-green-300 shadow-md mb-6">
      <h3 className="text-lg font-semibold text-brand mb-2">Inclui Médico pelo WhatsApp 📲</h3>
      <ul className="list-disc list-inside text-sm text-brand">
        <li>Receba contato de um médico em até 24h</li>
        <li>Receba pedidos de exames e fórmulas manipuladas</li>
        <li>Oriente-se sobre seu relatório</li>
        <li>Acompanhamento por 30 dias</li>
      </ul>
    </div>
  )
}