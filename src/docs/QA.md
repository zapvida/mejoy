# ✅ QA Final — Projeto Alloe Health (Relatório Médico com IA + Voz)

Este documento lista todos os testes manuais e técnicos a serem validados antes do deploy oficial da plataforma.

---

## 1. FUNCIONALIDADES CRÍTICAS

- [x] Página `/triagem` renderiza corretamente
- [x] Página `/relatorio/[id]` gera relatório com dados reais e mock
- [x] Componente `MedicalChat` responde com contexto real (nome, idade, plano)
- [x] Chat médico exibe mensagens em tempo real (stream)
- [x] Botão de microfone transcreve com precisão (Web Speech API)
- [x] Prompt enviado à IA inclui `score`, `sintomas` e `planoAcao`
- [x] PDF do relatório é gerado completo e com layout legível
- [ ] Campos “Não informado” são exibidos corretamente nos blocos vazios
- [x] Fallbacks visuais estão funcionando (nome, sintomas, sexo, idade)

---

## 2. VISUAL E LAYOUT

- [x] Layout do relatório está responsivo (mobile e desktop)
- [x] Blocos numerados de 1 a 7 visíveis e bem estruturados
- [x] Barra de progresso da triagem exibe etapas corretamente
- [x] Temas de cor e contraste seguem padrão (`#004d5c`, `#e1f5f7`)
- [x] Ícones `lucide-react` aplicados nos pontos certos
- [x] Fontes legíveis em todas as telas
- [ ] Animações com `framer-motion` suaves em botões e entradas

---

## 3. TESTES MOBILE-FIRST

- [x] Navegação funcional no iPhone e Android
- [x] Nenhum elemento quebrando no mobile
- [x] Inputs grandes o suficiente para toque
- [x] Scroll fluido no relatório e chat
- [x] PDF é gerado corretamente ao abrir em celular

---

## 4. INTEGRAÇÃO COM IA

- [x] API `/api/chat-medico.ts` opera corretamente
- [x] `OpenAIStream.ts` transmite tokens em tempo real
- [x] Contexto do paciente enviado corretamente ao prompt
- [ ] Testar diferentes pacientes para checar personalização da IA

---

## 5. SEGURANÇA E PRIVACIDADE

- [x] Política de privacidade (`/politica.tsx`) visível
- [x] Termos de uso e disclaimer presentes
- [x] Nenhum `console.log` com dados pessoais
- [x] Variáveis sensíveis estão no `.env.local`
- [x] Nenhum dado salvo no Supabase sem CPF do paciente
- [ ] Verificar se APIs públicas bloqueiam acessos indevidos

---

## 6. PAGAMENTOS COM STRIPE (MODO TESTE)

- [x] Botões de planos redirecionam corretamente
- [x] Checkout com plano Starter → `/checkout/sucesso`
- [x] Stripe salva compra e dispara webhook
- [ ] Supabase salva dados do plano comprado
- [x] Redirecionamento correto após compra
- [ ] Webhook testado em produção

---

## 7. DEPLOY E INFRAESTRUTURA

- [x] Vercel Hosting funcionando (`vercel.json`)
- [x] Funções SSR habilitadas
- [x] `pnpm build` sem erros
- [ ] Executar `vercel deploy` final
- [x] Variáveis `.env.production` configuradas:
  - `OPENAI_API_KEY`
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Validar logs com `vercel logs`

---

## 8. SEO, INDEXAÇÃO E METADADOS

- [ ] `<title>` e `<meta description>` estão aplicados nas principais páginas
- [ ] Ícone (`/logosmejoy/faviconmejoy.png`) aparece corretamente
- [ ] Páginas indexáveis pelos buscadores (sem `noindex`)
- [ ] Imagem para compartilhamento social (OG image) definida

---

✅ **Status final esperado:** ✅ 100% das caixas acima marcadas  
📍*A cada alteração, atualizar este arquivo com a data e responsável pelos testes*

---

📅 Última atualização: `{{preencher quando revisar}}`  
👤 Responsável: `{{seu nome ou da equipe}}`