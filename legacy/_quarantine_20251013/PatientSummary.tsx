import React from 'react';

type PatientSummaryProps = {
  nome?: string;
  nascimento?: string;
  sexo?: string;
  peso?: string;
  altura?: string;
  imc?: string;
  email?: string;
  whatsapp?: string;
  cpf?: string;
  data?: string;
};

const PatientSummary = ({
  nome = 'Não informado',
  nascimento = 'Não informado',
  sexo = 'Não informado',
  peso = 'Não informado',
  altura = 'Não informado',
  imc = 'Não informado',
  email = 'Não informado',
  whatsapp = 'Não informado',
  cpf = 'Não informado',
  data = 'Não informado',
}: PatientSummaryProps) => {
  return (
    <div className="w-full rounded-xl border border-border bg-background p-6 shadow-md">
      <h2 className="text-2xl font-bold text-brand mb-4">
        🩺 Resumo do Paciente
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base text-muted-foreground">
        <div><strong>👤 Nome:</strong> {nome}</div>
        <div><strong>🎂 Nascimento:</strong> {nascimento}</div>
        <div><strong>⚧️ Sexo:</strong> {sexo}</div>
        <div><strong>⚖️ Peso:</strong> {peso}</div>
        <div><strong>📏 Altura:</strong> {altura}</div>
        <div><strong>📊 IMC:</strong> {imc}</div>
        <div><strong>📧 Email:</strong> {email}</div>
        <div><strong>📱 WhatsApp:</strong> {whatsapp}</div>
        <div><strong>🆔 CPF:</strong> {cpf}</div>
        <div><strong>🗓️ Data do Relatório:</strong> {data}</div>
      </div>
    </div>
  );
};

export default PatientSummary;