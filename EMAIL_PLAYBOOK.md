# Email Playbook AlloeHealth

## Estratégia de Email Marketing

### Objetivo
Maximizar conversões através de sequência automatizada pós-triagem GI, focando nas 4 conversões principais.

## Sequência de Emails

### D0 - Relatório Pronto (Imediato)
**Gatilho**: Usuário completa triagem GI
**Assunto**: "Seu relatório AlloeHealth chegou 📄"
**Preview**: "Resumo do que observamos e o que fazer hoje."

**Conteúdo**:
- Confirmação de recebimento
- Link para visualizar relatório
- Deck de CTAs (ordem oficial)
- Disclaimer médico

**CTAs**:
1. Ver relatório completo
2. Liberar todas as triagens • R$ 49
3. Presentear acesso • R$ 89
4. Conhecer produtos Alloe
5. Falar com médico agora

### D+1 - Ação Prática (24h depois)
**Gatilho**: Usuário não converteu no D0
**Assunto**: "3 passos práticos para hoje"
**Preview**: "Ações simples baseadas nas suas respostas."

**Conteúdo**:
- 3 dicas personalizadas baseadas no relatório
- Foco em ações imediatas
- CTAs para produtos Alloe e médico

**CTAs**:
1. Conhecer produtos Alloe (prioritário)
2. Falar com médico agora (prioritário)

### D+3 - Oferta de Passe (72h depois)
**Gatilho**: Usuário não converteu no D+1
**Assunto**: "Desbloqueie todas as triagens por R$ 49"
**Preview**: "Acesso total por 30 dias — sem renovação automática."

**Conteúdo**:
- Benefícios do passe completo
- Garantia de 7 dias
- Urgência sutil

**CTAs**:
1. Ativar meu passe de 30 dias (principal)

### D+7 - Oferta de Presente (7 dias depois)
**Gatilho**: Usuário não converteu no D+3
**Assunto**: "Um presente útil de verdade 🎁"
**Preview**: "30 dias de AlloeHealth para quem você ama."

**Conteúdo**:
- História emocional
- Benefícios do presente
- Facilidade de envio

**CTAs**:
1. Presentear acesso • R$ 89 (principal)

## Templates de Email

### Estrutura Base
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <!-- Header AlloeHealth -->
  <!-- Conteúdo principal -->
  <!-- Deck de CTAs -->
  <!-- Footer com disclaimer -->
</body>
</html>
```

### Cores e Branding
- **Verde Alloe**: #00D084
- **Preto**: #0A0A0A
- **Branco**: #FFFFFF
- **Cinza**: #666666

### CTAs Padronizados
```html
<a href="{{url}}" 
   style="display: inline-block; padding: 12px 24px; background-color: #00D084; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
  {{label}}
</a>
<p style="font-size: 12px; color: #666; margin-top: 8px;">{{sub}}</p>
```

## Personalização por Segmento

### Por Tipo de Triagem
- **GI**: Foco em sintomas digestivos
- **Cardio**: Foco em saúde cardiovascular
- **Neuro**: Foco em saúde mental

### Por Score do Relatório
- **Score Alto**: Parabéns + manutenção
- **Score Médio**: Melhorias + alertas
- **Score Baixo**: Urgência + médico

### Por Comportamento
- **Visualizou relatório**: Foco em ação
- **Não visualizou**: Foco em curiosidade
- **Clicou em CTA**: Foco em conversão

## Automações

### Triggers
1. **Completou triagem GI** → D0
2. **Não converteu D0** → D+1
3. **Não converteu D+1** → D+3
4. **Não converteu D+3** → D+7

### Condições de Saída
- **Comprou passe** → Parar sequência
- **Comprou presente** → Parar sequência
- **Descadastrou** → Parar sequência
- **Marcou como spam** → Parar sequência

### Re-engajamento
- **D+14**: "Você ainda está por aqui?"
- **D+30**: "Última chance de aproveitar"

## Métricas e KPIs

### Métricas Primárias
- **Open Rate**: >25%
- **Click Rate**: >5%
- **Conversion Rate**: >2%
- **Unsubscribe Rate**: <0.5%

### Métricas por Email
- **D0**: CTR relatório >15%
- **D+1**: CTR produtos >3%
- **D+3**: CR passe >1%
- **D+7**: CR presente >0.5%

### A/B Testing
- **Assuntos**: Testar emojis vs sem emojis
- **Horários**: Manhã vs tarde vs noite
- **CTAs**: Texto vs benefício vs urgência
- **Frequência**: Diário vs alternado

## Compliance

### LGPD
- ✅ Opt-in explícito
- ✅ Descadastro fácil
- ✅ Dados minimizados
- ✅ Consentimento específico

### Disclaimers Médicos
- ✅ "Não substitui consulta médica"
- ✅ "Procure atendimento em caso de sinais de alerta"
- ✅ "Informações de caráter educativo"

### Anti-Spam
- ✅ Assunto claro e não enganoso
- ✅ Remetente identificado
- ✅ Endereço físico presente
- ✅ Descadastro em 1 clique

## Ferramentas Recomendadas

### ESP (Email Service Provider)
- **SendGrid**: Para transacionais
- **Mailchimp**: Para marketing
- **ConvertKit**: Para automações

### Analytics
- **Google Analytics**: Tracking de conversões
- **Mixpanel**: Análise de comportamento
- **Hotjar**: Heatmaps de emails

### A/B Testing
- **Mailchimp**: Testes nativos
- **Optimizely**: Testes avançados
- **VWO**: Testes de conversão

## Checklist de Envio

### Pré-Envio
- [ ] Assunto testado
- [ ] Links funcionando
- [ ] Imagens otimizadas
- [ ] Mobile responsivo
- [ ] Disclaimer presente
- [ ] Descadastro funcionando

### Pós-Envio
- [ ] Deliverability monitorada
- [ ] Bounces tratados
- [ ] Feedback loops configurados
- [ ] Métricas coletadas
- [ ] A/B resultados analisados

## Exemplos de Conteúdo

### D0 - Relatório Pronto
```
Olá, {{firstName}}!

Seu relatório personalizado está pronto. Veja o que observamos e os próximos passos práticos.

🎯 Principais descobertas:
• {{finding1}}
• {{finding2}}
• {{finding3}}

📋 O que fazer hoje:
• {{action1}}
• {{action2}}
• {{action3}}

Você pode imprimir e levar ao seu médico.

Transforme o plano em ação:
[Ver relatório completo] [Liberar todas as triagens • R$ 49] [Presentear acesso • R$ 89] [Conhecer produtos Alloe] [Falar com médico agora]
```

### D+1 - Ação Prática
```
Olá, {{firstName}}!

Selecionamos três ações simples para você começar agora:

🌙 Sono: {{tip_sono}}
🥗 Nutrição: {{tip_nutricao}}
🏃‍♂️ Rotina: {{tip_rotina}}

Comece hoje mesmo e veja a diferença!

[Conhecer produtos Alloe] [Falar com médico agora]
```

### D+3 - Oferta de Passe
```
Olá, {{firstName}}!

Amplie sua visão com acesso total por 30 dias.

✅ Todas as triagens liberadas
✅ Relatórios completos e imprimíveis
✅ Suporte por e-mail
✅ Sem renovação automática

Garantia: 7 dias para reembolso

[Ativar meu passe de 30 dias]
```

### D+7 - Oferta de Presente
```
Olá, {{firstName}}!

Surpreenda alguém com 30 dias de AlloeHealth.

🎁 Entrega por e-mail/WhatsApp
🎁 Mensagem personalizada
🎁 Resgate em 1 clique
🎁 Válido por 6 meses

Um presente que cuida da saúde de quem você ama.

[Presentear acesso • R$ 89]
```

## Monitoramento Contínuo

### Relatórios Semanais
- Performance por email
- Conversões por CTA
- Segmentação por comportamento
- A/B test results

### Relatórios Mensais
- ROI da sequência
- Lifetime value por usuário
- Churn rate
- Otimizações implementadas

### Ajustes Trimestrais
- Revisão de copy
- Atualização de templates
- Novos segmentos
- Novas automações

---

**Última atualização**: $(date)
**Versão**: 1.0.0
**Próxima revisão**: 3 meses
