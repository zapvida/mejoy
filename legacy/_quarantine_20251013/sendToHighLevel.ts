export async function sendToHighLevel({
  name,
  email,
  phone,
  cpf,
}: {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate?: string;
}) {
  try {
    const payload = { name, email, phone, cpf };

    console.log('🔄 Enviando dados para API interna:', payload);

    const baseUrl =
      typeof window === 'undefined'
        ? process.env.NEXT_PUBLIC_SITE_URL || 'https://alloehealth.com'
        : '';

    const res = await fetch(`${baseUrl}/api/send-to-ghl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erro ao enviar para o backend: ${res.status} - ${text}`);
    }

    console.log('✅ Contato enviado com sucesso via API interna.');
  } catch (error: any) {
    console.error('❌ Erro ao enviar para o HighLevel:', error.message || error);
  }
}
