# Checklist de Lançamento — Conformidade Jurídica e Tributária MeJoy

Documento de validação para go-live com máxima segurança jurídica, LGPD, tributária e consumerista.

---

## 1. Páginas Legais Obrigatórias

| Página | Rota | Status | Observação |
|--------|------|--------|------------|
| Termos de Uso | `/termos` | ✅ | Completo, com Footer |
| Política de Privacidade | `/privacidade` | ✅ | Completo, com Footer |
| Política LGPD | `/politicas-lgpd` | ✅ | 15 seções, DPO, Art. 18, impressão |
| Política de Reembolso/Troca/Devolução | `/reembolso` | ✅ | CDC Art. 49, troca, garantia 7 dias |
| Aviso Legal (Disclaimer) | `/disclaimer` | ✅ | Limitações médicas |
| Dados Fiscais | `/dados-fiscais` | ✅ | Usa env vars |
| Contato | `/contato` | ✅ | WhatsApp, e-mail, links legais |
| Telemedicina | `/telemedicina` | ✅ | Conformidade legal |
| Uso de IA | `/uso-ia` | ✅ | Privacidade e LGPD |

---

## 2. Variáveis de Ambiente (pode configurar depois)

O código usa **valores padrão (mocks)** quando as env vars não estão definidas. Você pode configurar os dados reais depois, em **Vercel → Settings → Environment Variables**:

| Variável | Descrição | Exemplo |
|----------|------------|---------|
| `NEXT_PUBLIC_LEGAL_NAME` | Razão social | MeJoy Tecnologia em Saúde Ltda. |
| `NEXT_PUBLIC_LEGAL_CNPJ` | CNPJ (apenas números ou formatado) | 12.345.678/0001-90 |
| `NEXT_PUBLIC_LEGAL_ADDRESS` | Endereço completo da sede | Rua X, 123 - Centro, Florianópolis/SC |
| `NEXT_PUBLIC_DPO_NAME` | Nome do Encarregado (DPO) | Nome Completo |
| `NEXT_PUBLIC_DPO_EMAIL` | E-mail do DPO | privacidade@mejoy.com.br |
| `NEXT_PUBLIC_DPO_PHONE` | Telefone do DPO | +55 47 99999-9999 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | E-mail de contato | contato@mejoy.com.br |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | WhatsApp (apenas números) | 554797789479 |

---

## 3. Links e Redirects

| De | Para | Status |
|----|------|--------|
| `/lgpd` | `/politicas-lgpd` | ✅ Redirect 301 |
| `/politica` | `/privacidade` | ✅ Redirect 301 |

---

## 4. Footers — Cobertura de Links Legais

| Componente | Páginas | Links Legais |
|------------|---------|--------------|
| FooterB2C | produtos, remédios, fórmulas, etc. | termos, privacidade, LGPD, reembolso, disclaimer, telemedicina, uso-ia, dados-fiscais |
| StorefrontFooter | PDP, cart, home store, checkout sucesso | privacidade, LGPD, termos, reembolso, disclaimer, dados-fiscais, contato |
| layout/Footer | politicas-lgpd, termos, privacidade, reembolso, etc. | LGPD, privacidade, termos, reembolso, Gerenciar Cookies |
| FooterZapfarm | emagrecimento, obesidade | termos, privacidade, LGPD, reembolso, disclaimer, contato, dados-fiscais |
| CheckoutFooter | checkout | termos, privacidade, reCAPTCHA |

---

## 5. Validações Pré-Lançamento

### Jurídico
- [ ] Advogado validar Termos de Uso
- [ ] Advogado validar Política de Privacidade e LGPD
- [ ] Advogado validar Política de Reembolso/Troca/Devolução
- [ ] Validar conformidade telemedicina (se aplicável)
- [ ] Validar disclaimer médico

### Tributário/Contábil
- [ ] CNPJ real configurado em `NEXT_PUBLIC_LEGAL_CNPJ`
- [ ] Endereço fiscal em `NEXT_PUBLIC_LEGAL_ADDRESS`
- [ ] Inscrição estadual verificada (isento ou número)
- [ ] Emissão de NF-e configurada

### LGPD
- [ ] DPO definido e contato configurado
- [ ] Cookie banner ativo e funcional
- [ ] API `/api/lgpd/cookie-consent` operacional
- [ ] Tabela `lgpd_consents` no banco

### Consumerista (CDC)
- [ ] Direito de arrependimento 7 dias na política
- [ ] Política de troca e devolução clara
- [ ] Canais de contato visíveis (WhatsApp, e-mail)

---

## 6. Segurança Técnica

- [ ] HTTPS em produção
- [ ] reCAPTCHA no checkout (se aplicável)
- [ ] Dados de pagamento via gateway (Stripe/Asaas)
- [ ] Headers de segurança (X-Frame-Options, etc.)

---

## 7. Resumo de Ações Antes do Go-Live

1. **Configurar env vars** com dados reais da empresa
2. **Validar com jurídico** todas as políticas
3. **Testar todos os links** do footer em cada página
4. **Verificar** que `/contato` responde
5. **Confirmar** que Cookie Banner aparece e salva consentimento

---

*Última atualização: Março 2025*
