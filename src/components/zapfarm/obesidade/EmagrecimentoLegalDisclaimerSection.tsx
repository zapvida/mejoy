/**
 * Avisos regulatórios para LP de emagrecimento (contexto BR — ANVISA / CFM).
 * Texto informativo; revisão jurídica recomendada periodicamente.
 */
export function EmagrecimentoLegalDisclaimerSection() {
  return (
    <section
      className="border-t border-gray-200 bg-zinc-50 py-10 sm:py-12"
      aria-labelledby="legal-disclaimer-heading"
      data-home-section="legal-disclaimer"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-sm sm:prose-base prose-gray">
          <h2 id="legal-disclaimer-heading" className="text-lg font-semibold text-gray-900">
            Informações importantes sobre o programa
          </h2>
          <p className="text-gray-700 leading-relaxed">
            A MeJoy não substitui atendimento presencial quando ele for necessário. A triagem organiza informações,
            mas não cria, por si só, vínculo médico-paciente; prescrição e conduta clínica são responsabilidade do
            profissional habilitado que avaliar o caso. Medicamentos para obesidade só são utilizados quando indicados
            e prescritos, com dispensação em canais regulares e acompanhamento conforme normas aplicáveis.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Prescrição somente quando indicada em consulta médica. Dados são tratados com boas práticas de privacidade,
            segurança e governança em todo o fluxo.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Resultados variam conforme perfil clínico, aderência e orientação médica. Não prometemos resultado
            rápido ou garantido. Em caso de dúvida sobre riscos e benefícios de qualquer medicação, converse com
            o profissional que acompanha você.
          </p>
        </div>
      </div>
    </section>
  );
}
