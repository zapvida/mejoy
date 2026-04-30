import React from 'react'

interface RelatorioProps {
  relatorio: {
    planoDeAcao?: string[]
    vitaminasENutrientes?: string[]
    examesCheckup?: string[]
    linhaDoTempo?: string[]
    consideracoesFinais?: string
  }
  paciente: any
}

const Relatorio: React.FC<RelatorioProps> = ({ relatorio }) => {
  const {
    planoDeAcao = [],
    vitaminasENutrientes = [],
    examesCheckup = [],
    linhaDoTempo = [],
    consideracoesFinais = '',
  } = relatorio
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <section>
        <h2 className="text-xl font-bold mb-2">Plano de Ação</h2>
        {planoDeAcao.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {planoDeAcao.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Não informado.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Vitaminas e Nutrientes</h2>
        {vitaminasENutrientes.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {vitaminasENutrientes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Não informado.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Exames de Check-up</h2>
        {examesCheckup.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {examesCheckup.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Não informado.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Linha do Tempo</h2>
        {linhaDoTempo.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {linhaDoTempo.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Não informado.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Considerações Finais</h2>
        {consideracoesFinais ? (
          <p className="text-base">{consideracoesFinais}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Não informado.</p>
        )}
      </section>
    </div>
  )
}

export default Relatorio