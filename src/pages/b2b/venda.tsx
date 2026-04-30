export default function B2BVenda() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Plataforma White-Label para Clínicas</h1>
      <p className="mb-6">Seu app de saúde com sua marca, domínio próprio e cobrança automática.</p>
      <ul className="list-disc ml-6 space-y-2 mb-8">
        <li>Domínio personalizado e logo</li>
        <li>Checkout Stripe e CRM GHL integrados</li>
        <li>Relatórios em PDF, triagem e automações</li>
      </ul>
      <div className="flex gap-3">
        <a className="btn" href="/pricing">Ver planos</a>
        <a className="btn" href="https://wa.me/55XXXXXXXXXX?text=Quero%20white-label">Falar no WhatsApp</a>
      </div>
    </main>
  );
}
