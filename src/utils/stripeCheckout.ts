export async function redirectToStripeCheckout(plan: 'starter' | 'whiteLabel' | 'scalePro') {
  console.log('➡️ Iniciando redirecionamento para o plano:', plan);

  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });

  const data = await response.json();
  console.log('📦 Resposta da API:', data);

  if (data?.url) {
    console.log('✅ Redirecionando para:', data.url);
    window.location.href = data.url;
  } else {
    alert('❌ Erro ao redirecionar para o checkout.');
  }
}