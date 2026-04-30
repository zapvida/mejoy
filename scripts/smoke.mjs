#!/usr/bin/env zx

/**
 * Smoke test completo para B2B Demo
 * Roda: pnpm zx scripts/smoke.mjs
 */

const BASE = process.env.BASE || 'http://localhost:3000';
const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg==';

console.log('🚀 Smoke Test B2B Demo');
console.log(`📍 Base URL: ${BASE}\n`);

try {
  // 1) Upload de logo
  console.log('📤 Testando upload de logo...');
  const uploadRes = await fetch(`${BASE}/api/branding/upload-logo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64: `data:image/png;base64,${PNG_BASE64}` })
  });
  
  if (!uploadRes.ok) {
    throw new Error(`Upload falhou: ${uploadRes.status} ${uploadRes.statusText}`);
  }
  
  const uploadData = await uploadRes.json();
  console.log('✅ Upload OK:', uploadData.url || uploadData.path);
  
  // 2) Criar draft
  console.log('\n📝 Criando draft...');
  const draftRes = await fetch(`${BASE}/api/branding/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fantasyName: 'Clínica QA Smoke Test',
      brandColor: '#a34900',
      accentColor: '#050505',
      ctaText: 'Agendar Consulta Já',
      ctaUrl: 'https://wa.me/5547990099923',
      logoUrl: uploadData.url
    })
  });
  
  if (!draftRes.ok) {
    throw new Error(`Criar draft falhou: ${draftRes.status} ${draftRes.statusText}`);
  }
  
  const draftData = await draftRes.json();
  const draftId = draftData.id || draftData.draft?.id;
  
  if (!draftId) {
    throw new Error('Draft ID não retornado');
  }
  
  console.log('✅ Draft criado:', draftId);
  console.log('   Status:', draftRes.status === 201 ? '✅ 201 (Created)' : `⚠️ ${draftRes.status}`);
  
  // 3) Consultar draft
  console.log('\n🔍 Consultando draft...');
  const getRes = await fetch(`${BASE}/api/branding/draft?id=${draftId}`);
  
  if (!getRes.ok) {
    throw new Error(`Consultar draft falhou: ${getRes.status} ${getRes.statusText}`);
  }
  
  const getData = await getRes.json();
  console.log('✅ Draft encontrado:', getData.draft?.fantasyName || 'N/A');
  
  // 4) Sandbox URL
  console.log('\n🌐 URLs de teste:');
  console.log(`   Sandbox: ${BASE}/b2b/sandbox?draft=${draftId}`);
  console.log(`   Draft API: ${BASE}/api/branding/draft?id=${draftId}`);
  
  console.log('\n✅ Smoke test completo!');
  console.log(`\n📋 Próximos passos:`);
  console.log(`   1. Abra o sandbox no navegador`);
  console.log(`   2. Verifique se o branding foi aplicado`);
  console.log(`   3. Teste o botão "Testar Triagem Personalizada"`);
  
} catch (error) {
  console.error('\n❌ Erro no smoke test:', error.message);
  process.exit(1);
}

