// src/components/PatientInfo/PatientInfoForm.tsx

interface PatientInfoFormProps {
  formData: {
    nome: string
    email: string
    cpf: string
    celular: string
  }
  // eslint-disable-next-line no-unused-vars
  setFormData: (_formData: { nome: string; email: string; cpf: string; celular: string }) => void
}

export default function PatientInfoForm({ formData, setFormData }: PatientInfoFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Informações do Paciente</h2>
      <input
        type="text"
        placeholder="Nome completo"
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="CPF"
        value={formData.cpf}
        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="tel"
        placeholder="Celular"
        value={formData.celular}
        onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
        className="w-full border p-2 rounded"
      />
    </div>
  )
}
