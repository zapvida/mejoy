# 🧪 COMANDO DE TESTE FINAL

Execute este comando e me mostre a saída completa:

```bash
curl -v "http://localhost:3000/api/test-db" 2>&1
```

Isso vai mostrar:
- Headers HTTP
- Status code
- Corpo da resposta
- Erros de conexão

---

**Ou se preferir, execute o servidor em um terminal separado e veja os logs:**

```bash
# Terminal 1
pnpm dev

# Terminal 2 (quando o servidor estiver rodando)
curl -X POST "http://localhost:3000/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Teste","brandColor":"#10b981","accentColor":"#059669","ctaText":"Teste","ctaUrl":"https://wa.me/123"}'
```

E me mostre os logs do Terminal 1 após a requisição.

