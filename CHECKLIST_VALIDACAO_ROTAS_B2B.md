# ✅ CHECKLIST — VALIDAÇÃO ROTAS B2B (Pós-Criação)

**Data:** 2025-01-27  
**Status:** Rotas criadas, pendente validação

---

## 🧪 TESTE LOCAL (Recomendado antes do deploy)

### 1. Iniciar servidor dev
```bash
pnpm dev
```

### 2. Testar rotas no navegador

| URL | O que verificar | Status |
|-----|-----------------|--------|
| `http://localhost:3000/` | Deve mostrar LP B2B (se configurado como root) | ⏳ Pendente |
| `http://localhost:3000/b2b/sandbox` | Deve mostrar página de demonstração **SEM 404** | ⏳ Pendente |
| `http://localhost:3000/b2b/assinar` | Deve mostrar formulário **SEM 404** | ⏳ Pendente |
| `http://localhost:3000/b2b/assinar` | Preencher e enviar → deve mostrar "Recebido ✅" | ⏳ Pendente |
| `http://localhost:3000/b2b/sandbox` | Clicar em "Quero assinar agora" → deve ir para `/b2b/assinar` | ⏳ Pendente |

**O que procurar:**
- ✅ Nenhuma página retorna 404
- ✅ Navbar aparece corretamente
- ✅ Estilos CSS aplicados (cores, bordas, botões)
- ✅ Formulário submete sem erro
- ✅ Navegação entre páginas funciona

---

## 🚀 DEPLOY NA VERCEL

### 1. Commit das mudanças
```bash
git add src/pages/b2b/sandbox.tsx src/pages/b2b/assinar.tsx
git add src/components/home/B2CLanding.tsx  # (correção do lint)
git commit -m "fix: criar rotas faltantes /b2b/sandbox e /b2b/assinar"
```

### 2. Push e deploy
```bash
git push origin main
# Ou se preferir deploy manual:
vercel --prod
```

### 3. Verificar build na Vercel
- ✅ Build deve passar (a menos que falte `DATABASE_URL`)
- ⚠️ Se build falhar por `DATABASE_URL`, verificar se está configurada no dashboard Vercel

---

## 🌐 VALIDAÇÃO EM PRODUÇÃO

Após deploy na Vercel, testar no domínio real:

| URL | Esperado | Status |
|-----|----------|--------|
| `https://aistotele.com/` | LP B2B aparece | ⏳ Pendente |
| `https://aistotele.com/b2b/sandbox` | **200 OK** (não 404) | ⏳ Pendente |
| `https://aistotele.com/b2b/assinar` | **200 OK** (não 404) | ⏳ Pendente |
| `https://aistotele.com/#cases` | Scroll para seção cases | ⏳ Pendente |

**Como testar:**
1. Abrir `https://aistotele.com/b2b/sandbox` no navegador
2. Verificar Network tab → status deve ser `200`
3. Se aparecer conteúdo visual = ✅ OK
4. Se aparecer 404 = ❌ Problema (rever deploy)

---

## 🔧 SE ALGO DER ERRADO

### Problema: 404 ainda aparece em produção

**Solução 1 - Verificar cache Vercel:**
```bash
# Fazer redeploy forçando rebuild
vercel --prod --force
```

**Solução 2 - Verificar se arquivos foram commitados:**
```bash
git ls-files | grep b2b/sandbox
git ls-files | grep b2b/assinar
# Deve listar os arquivos
```

### Problema: Formulário não envia

**Atual:** Formulário apenas faz `console.log()`. Isso é esperado.

**Próximo passo:** Criar endpoint `/api/b2b/lead` para receber os dados.

### Problema: Estilos não aparecem

**Verificar:**
- `src/styles/theme.css` está sendo importado em `_app.tsx`
- Classes CSS (`btn-brand`, `text-ink`, etc.) estão definidas

---

## 📊 VALIDAÇÃO COMPLETA

Após todos os testes acima:

- [ ] Teste local passou (todas as rotas 200)
- [ ] Deploy na Vercel concluído
- [ ] Rotas funcionam em `aistotele.com`
- [ ] Formulário exibe mensagem de sucesso
- [ ] Navegação entre páginas funciona

**Quando tudo acima estiver ✅ → Funil B2B está integro e pronto!**

---

## 🎯 PRÓXIMOS PASSOS (Após validação)

1. **Integrar formulário com backend**
   - Criar `/api/b2b/lead`
   - Enviar para CRM (GHL) ou e-mail
   - Adicionar tracking GA4

2. **Melhorar `/b2b/sandbox`**
   - Adicionar iframe/demo real
   - Screenshots de diferentes temas
   - Casos de uso

3. **Adicionar validações**
   - WhatsApp formatado (Brasil)
   - E-mail válido
   - Rate limiting no formulário

---

**Última atualização:** 2025-01-27

