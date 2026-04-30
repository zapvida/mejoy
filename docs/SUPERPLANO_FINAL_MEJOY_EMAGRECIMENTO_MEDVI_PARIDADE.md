# Superplano Final MeJoy Emagrecimento

Data de consolidação: 23/04/2026
Escopo: do diagnóstico atual ao lançamento oficial em produção
Repositório base: `/Users/teobeckert/desenvolvimento/TecMed/mejoy`

## 1. Objetivo real

Levar o funil de emagrecimento do MeJoy a um estado de lançamento oficial real, com:

- UX estruturalmente alinhada ao padrão MedVi
- identidade MeJoy/TechMed preservada
- compliance brasileiro preservado
- persistência, relatório, checkout e handoff já existentes mantidos
- evidência objetiva de prontidão antes de chamar de "launch oficial"

Este plano substitui a leitura superficial de "deixar bonito" por uma execução em 3 frentes simultâneas:

- produto e UX
- integração e operação
- validação e go-live

## 2. Diagnóstico consolidado

### 2.1 O que já está certo no repo

- A LP de emagrecimento já existe em [src/pages/emagrecimento/index.tsx](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/emagrecimento/index.tsx).
- A rota de triagem já desvia `emagrecimento` para um componente específico `EmagrecimentoOnePageIntake` em [src/pages/triagem/[slug].tsx](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/triagem/[slug].tsx).
- O formulário de emagrecimento já foi parcialmente reestruturado para a lógica MedVi em [src/forms/emagrecimento.ts](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/forms/emagrecimento.ts), incluindo:
  - consentimento inicial
  - altura, peso e peso-meta
  - sexo
  - gestação
  - data de nascimento
  - comorbidades
  - contraindicações GLP-1
  - cirurgia bariátrica
  - opioides
  - medicação atual
  - uso prévio de medicação para emagrecimento
  - pressão arterial em faixa
  - frequência cardíaca em repouso
  - preferência de princípio ativo
  - primeiro nome
  - WhatsApp
  - consentimento LGPD/WhatsApp
- O fluxo já preserva `triageId`, persistência incremental e finalize.
- O relatório já tem camada de decisão e CTA clínico em [src/pages/emagrecimento/relatorio.tsx](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/emagrecimento/relatorio.tsx).
- O checkout já existe em [src/pages/emagrecimento/checkout.tsx](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/emagrecimento/checkout.tsx).
- O repo já contém checklist de launch, smoke test e handoff em produção.

### 2.2 O que está divergente do pedido final

- O pedido atual não é só "usar elementos MedVi"; ele exige paridade de arquitetura visual e de interação.
- O plano anterior de 21/04/2026 não exigia explicitamente uma triagem `one-page scroll` com cadência MedVi. O pedido atual exige.
- A referência MedVi é muito específica:
  - LP minimalista e limpa
  - intake em coluna única
  - topo fixo com confiança e progresso segmentado
  - começo por altura/peso/meta
  - cards clínicos grandes
  - resultado decisório acima da dobra
- O relatório MeJoy atual ainda carrega estética e cadência visual mais "gradiente promocional" do que "medical premium clean".
- O checkout atual ainda parece um checkout funcional, porém não totalmente coerente com uma jornada premium contínua desde relatório até pagamento.
- O estado de produção pode estar desatualizado em relação ao repo local. Isso hoje é risco, não hipótese descartada.

### 2.3 P0 reais antes de chamar de launch oficial

- Confirmar o commit exato em produção.
- Confirmar a URL de produção correta do fluxo de emagrecimento.
- Confirmar que o tráfego de `/emagrecimento` aponta para a versão desejada.
- Validar handoff MeJoy -> ZapVida em produção.
- Validar migrations de handoff no Supabase.
- Revisar envs críticos de produção.
- Confirmar pricing e copy finais.
- Confirmar guardrails de compliance e claims.
- Validar UTMs e GA4 mínimos.
- Arquivar evidência de smoke test de ponta a ponta.

## 3. Leitura correta da referência MedVi

### 3.1 O que copiar

- gramática visual
- hierarquia de blocos
- ritmo do scroll
- densidade de informação por seção
- progressão clínica
- decisão forte acima da dobra no relatório
- continuidade emocional até o checkout

### 3.2 O que não copiar

- nome MEDVi
- logo
- copy literal
- trade dress exato
- prova social inventada
- claims regulatoriamente agressivos

### 3.3 Adaptação obrigatória para Brasil

- unidades em `cm` e `kg`
- WhatsApp como eixo operacional
- menção a avaliação médica e elegibilidade, não prescrição automática
- linguagem LGPD e telemedicina
- trilhas de programa, não e-commerce cru de medicamento

## 4. Decisão estratégica

O launch oficial do MeJoy emagrecimento deve ser tratado como uma operação de paridade MedVi adaptada, e não como redesign solto.

Isso significa:

- preservar backend e inteligência validados
- reconstruir apenas a camada de experiência e narrativa
- travar o go-live por gates objetivos
- separar claramente o que é bloqueio interno de engenharia do que é dependência externa de operação, jurídico ou produção

## 5. Arquitetura final obrigatória

O funil final deve operar em 4 páginas:

1. `/emagrecimento`
2. `/triagem/emagrecimento`
3. `/emagrecimento/relatorio`
4. `/emagrecimento/checkout`

## 6. Requisitos finais por página

### 6.1 LP `/emagrecimento`

Objetivo:

- gerar clique qualificado para triagem
- deixar claro que o produto é programa com avaliação médica, tratamento original quando indicado e suporte por WhatsApp

Estrutura obrigatória:

- hero clean com CTA único dominante
- subheadline curta
- prova social realista
- logos ou selos confiáveis, somente se verdadeiros
- bloco "como funciona" em 3 passos
- resumo da oferta
- FAQ curta
- disclaimer legal

Critérios de aceite:

- acima da dobra sem poluição
- CTA leva para `/triagem/emagrecimento`
- mobile impecável entre 390px e 430px
- sem headline sensível demais para compliance

### 6.2 Triagem `/triagem/emagrecimento`

Objetivo:

- parecer intake médico premium
- funcionar como coluna única contínua
- preservar persistência e relatório

Estrutura obrigatória:

1. consentimento inicial compacto
2. altura, peso e peso-meta
3. sexo
4. data de nascimento
5. bloco clínico 1
6. bloco clínico 2
7. perguntas binárias
8. pressão arterial em faixa
9. frequência cardíaca em faixa
10. preferência de linha terapêutica
11. primeiro nome
12. WhatsApp obrigatório
13. consentimento explícito de contato

Shell obrigatório:

- topo fixo
- marca MeJoy
- bloco de confiança realista
- barra de progresso segmentada por seções

Interação obrigatória:

- scroll contínuo
- validação por seção
- persistência incremental
- um único CTA final
- feedback de erro claro
- cards grandes com área de toque adequada

Critérios de aceite:

- não parecer wizard antigo
- não abrir 30 telas fullscreen
- não pedir endereço nem pagamento
- usar `triageId` existente
- manter compatibilidade com relatório

### 6.3 Relatório `/emagrecimento/relatorio`

Objetivo:

- virar tela de decisão
- responder imediatamente "sou elegível?", "qual caminho faz mais sentido?", "quanto custa?" e "qual o próximo passo?"

Acima da dobra obrigatório:

- status de elegibilidade
- recomendação principal
- resumo do perfil
- faixa de investimento
- quatro trilhas claras
- próximos passos
- CTA principal para WhatsApp
- CTA secundário para checkout ou handoff

Abaixo da dobra:

- explicação clínica
- riscos e red flags
- evidência científica
- FAQ
- disclaimers

As 4 trilhas obrigatórias:

- tirzepatida
- semaglutida
- Contrave
- médico escolhe / alternativas clínicas

Critérios de aceite:

- dobra inicial decisória
- ciência abaixo, não competindo com conversão
- identidade visual alinhada à triagem
- CTA oficial de WhatsApp forte

### 6.4 Checkout `/emagrecimento/checkout`

Objetivo:

- fechar o programa com coerência narrativa e estética

Estrutura obrigatória:

- trilha escolhida espelhada do relatório
- resumo do programa
- o que está incluído
- reforço de revisão médica obrigatória
- dados pessoais
- endereço
- pagamento
- segurança e canal oficial

Critérios de aceite:

- não parecer checkout genérico
- não parecer compra isolada de remédio
- continuar visual premium do relatório
- preço coerente com LP e relatório

## 7. Pilares não negociáveis

- Não reconstruir backend de triagem, relatório ou handoff do zero.
- Não quebrar `triageId`, `reportId`, persistência, finalize ou analytics.
- Não copiar marca MedVi.
- Não prometer prescrição automática.
- Não tratar medicamento controlado como commodity de carrinho.
- Não declarar launch oficial sem smoke test documentado.

## 8. Gaps concretos encontrados hoje

### 8.1 Gap de produto

- O repo já tem a intenção correta na triagem, mas o sistema inteiro ainda precisa ser travado por um plano único que organize:
  - UX final
  - operação
  - rollout
  - aceite

### 8.2 Gap visual

- A referência MedVi capturada no material local é mais limpa, clara e silenciosa do que parte da estética atual do relatório MeJoy.
- Há presença de gradientes e linguagem visual no relatório atual que pode enfraquecer a percepção premium médica.

### 8.3 Gap de produção

- Ainda não há, nesta auditoria, prova de qual commit está em produção.
- Logo, não é possível assumir que "o que está no repo" = "o que o usuário viu em produção".

### 8.4 Gap de launch

- O launch depende de engenharia mais operação.
- Sem validação de envs, migration, handoff, analytics e smoke prod, qualquer declaração de prontidão é fraca.

## 9. Plano máximo de execução

### Fase 0. Congelamento de escopo e fonte única

Objetivo:

- consolidar um único plano mestre
- travar o escopo do launch em emagrecimento

Saídas:

- este documento vira fonte de verdade
- o plano de 21/04/2026 passa a ser documento histórico, não documento final

Gate de saída:

- todos concordam que o foco do launch é emagrecimento MedVi parity adaptado

### Fase 1. Auditoria forense de ambiente

Objetivo:

- provar o que está em produção, preview e local

Checklist:

- mapear domínio, branch e commit
- identificar flags ou envs que alterem o fluxo
- confirmar se a produção atual usa `EmagrecimentoOnePageIntake`
- verificar se existe divergência entre build local e deploy ativo

Gate de saída:

- relatório comparativo `local vs preview vs produção`

### Fase 2. LP parity

Objetivo:

- alinhar `/emagrecimento` ao padrão visual e narrativo aprovado

Checklist:

- revisar hero
- revisar headline e subheadline
- revisar prova social
- revisar bloco como funciona
- revisar FAQs e disclaimers
- revisar assets e responsividade

Gate de saída:

- lado a lado com referência MedVi aprovado visualmente

### Fase 3. Intake parity

Objetivo:

- garantir que a triagem entregue experiência realmente `one-page`

Checklist:

- revisar ordem das seções
- revisar sticky header
- revisar barra segmentada
- revisar cards de seleção
- revisar validação por seção
- revisar persistência incremental
- revisar máscara e validação do WhatsApp BR
- revisar seções invisíveis e condicionais

Gate de saída:

- fluxo completo preenchido em mobile sem sensação de wizard antigo

### Fase 4. Relatório decisório

Objetivo:

- transformar o relatório em tela de decisão compatível com MedVi

Checklist:

- reorganizar a dobra inicial
- posicionar trilhas e faixa de preço acima da dobra
- manter ciência abaixo
- revisar CTA principal
- revisar consistência de copy e compliance

Gate de saída:

- usuário entende elegibilidade, recomendação, preço e próximo passo em menos de 15 segundos

### Fase 5. Checkout coerente

Objetivo:

- garantir continuidade visual e narrativa

Checklist:

- trilha selecionada coerente com relatório
- copy de segurança e revisão médica
- dados e pagamento com menos atrito
- reforço de WhatsApp oficial

Gate de saída:

- checkout não parece sistema avulso

### Fase 6. Operação e integrações

Objetivo:

- fechar o que realmente sustenta o launch

Checklist:

- validar handoff MeJoy -> ZapVida
- validar Supabase e migrations
- validar pricing/envs
- validar Asaas
- validar WhatsApp
- validar UTMs e GA4

Gate de saída:

- integrações críticas funcionando com evidência

### Fase 7. Staging, preview e UAT

Objetivo:

- garantir que o que ficou certo localmente também está certo fora da máquina

Checklist:

- preview aprovada
- smoke de ponta a ponta
- revisão visual com screenshots
- revisão de links, eventos e persistência

Gate de saída:

- checklist de preview fechado

### Fase 8. Go-live controlado

Objetivo:

- publicar com segurança e reversibilidade

Checklist:

- janela de deploy definida
- responsáveis definidos
- rollback pronto
- smoke test em produção executado
- evidência arquivada

Gate de saída:

- produção aprovada com evidência

### Fase 9. Pós-lançamento imediato

Objetivo:

- monitorar e corrigir rápido

Checklist:

- monitorar erros de API
- monitorar drop triagem -> relatório
- monitorar relatório -> handoff
- monitorar checkout -> pagamento
- corrigir P1 nas primeiras 24h

Gate de saída:

- estabilidade inicial confirmada

## 10. Ordem inteligente de execução

1. Confirmar produção, branch, commit e flags.
2. Congelar escopo do launch em emagrecimento.
3. Fechar LP.
4. Fechar triagem `one-page`.
5. Fechar relatório decisório.
6. Fechar checkout coerente.
7. Fechar integrações e observabilidade.
8. Rodar preview e staging.
9. Rodar smoke em produção.
10. Arquivar evidência e liberar launch oficial.

## 11. Critérios de aceite por disciplina

### Produto

- jornada parece premium médica
- UX é claramente alinhada à MedVi adaptada
- quatro páginas coerentes

### Engenharia

- lint, typecheck e build verdes
- persistência e finalize preservados
- regressão crítica zero

### Operação

- WhatsApp funcionando
- handoff funcionando
- preços e envs corretos

### Compliance

- sem claims arriscados
- sem promessas de prescrição automática
- disclaimers corretos

### Growth

- UTMs mínimas
- eventos essenciais chegando
- CTA dominante claro

## 12. Definição honesta de pronto

Só pode ser chamado de launch oficial quando os itens abaixo estiverem verdadeiros:

- a produção está no commit aprovado
- a LP está aprovada
- a triagem está `one-page` de verdade
- o WhatsApp é obrigatório no fim
- o relatório é decisório acima da dobra
- as 4 trilhas estão claras
- o checkout é coerente com a trilha
- lint, typecheck e build passaram
- preview foi aprovada
- smoke em produção foi executado
- handoff foi comprovado
- pricing, envs e compliance foram revisados

## 13. Matriz de prioridade

### P0

- paridade estrutural da triagem
- dobra decisória do relatório
- coerência do checkout
- produção/commit/flags
- handoff, envs, migrations, smoke prod

### P1

- refinamento visual fino
- prova social, logos, badges reais
- compressão de copy
- animações e polimento

### P2

- melhorias extras pós-launch
- otimizações finas de CRO
- testes A/B
- novas trilhas e extensões do ecossistema

## 14. Riscos e travas explícitas

- Se produção estiver em commit antigo, todo julgamento visual atual fica contaminado.
- Se a copy jurídica não estiver fechada, launch precisa travar mesmo com UI pronta.
- Se a integração operacional não estiver estável, o risco deixa de ser de conversão e vira risco de experiência e reputação.
- Se a triagem parecer wizard antigo, o pedido central do projeto não foi cumprido.

## 15. Evidências mínimas que devem ser arquivadas

- screenshots mobile da LP
- screenshots mobile da triagem
- screenshots da dobra inicial do relatório
- screenshots da seleção de trilha no checkout
- resultado de lint, typecheck e build
- prova do commit e deploy
- prova do smoke prod
- prova do handoff
- prova dos eventos mínimos

## 16. Prompt operacional final

Use o texto abaixo quando for executar o ciclo completo no agente:

```text
Você é o Tech Lead Full-Stack + CRO + Launch Operator do projeto MeJoy.

REPOSITÓRIO
- Projeto local: /Users/teobeckert/desenvolvimento/TecMed/mejoy

MISSÃO
Executar, validar, revisar, polir e levar o funil de emagrecimento do MeJoy até um estado de launch oficial real, com paridade estrutural de UX com a referência MedVi, adaptada corretamente para MeJoy, Brasil, compliance, WhatsApp e operação TecMed.

FONTES DE VERDADE
1. Código atual do repositório.
2. docs/SUPERPLANO_FINAL_MEJOY_EMAGRECIMENTO_MEDVI_PARIDADE.md
3. docs/mejoy-medvi-launch-plan-2026-04-21.md como histórico.
4. Materiais da referência MedVi presentes em /Users/teobeckert/Desktop/medvi.zip ou em cópia local versionada.

NÃO NEGOCIÁVEL
- Não reconstruir backend de triagem/relatório/handoff do zero.
- Não quebrar triageId, reportId, persistência, finalize, analytics e checkout.
- Não copiar marca MEDVi.
- Não prometer prescrição automática.
- Não declarar launch oficial sem evidência.

DIAGNÓSTICO INICIAL OBRIGATÓRIO
1. Auditar produção vs repo.
2. Resumir o que já está certo.
3. Resumir o que diverge.
4. Listar P0 reais antes do launch.

ARQUITETURA FINAL
1. /emagrecimento
2. /triagem/emagrecimento
3. /emagrecimento/relatorio
4. /emagrecimento/checkout

OBJETIVOS POR PÁGINA
- LP: hero clean, CTA dominante, como funciona, prova social, FAQ, disclaimer.
- Triagem: one-page scroll, topo fixo, progresso segmentado, altura/peso/meta, sexo, nascimento, blocos clínicos, PA, FC, preferência, nome, WhatsApp, consentimento.
- Relatório: elegibilidade, recomendação, faixa de investimento, 4 trilhas, próximos passos e CTA WhatsApp acima da dobra.
- Checkout: trilha espelhada, resumo do programa, dados, endereço, pagamento, segurança e continuidade visual.

P0 OBRIGATÓRIO
- commit e produção confirmados
- handoff validado
- migrations aplicadas
- envs revisados
- pricing/copy/compliance revisados
- UTMs/GA4 mínimos
- smoke prod documentado

ORDEM
1. Gap analysis real
2. Implementação por etapas
3. Validação local
4. Preview/staging
5. Produção

FORMATO DE RESPOSTA EM CADA CICLO
1. Diagnóstico atual
2. O que será feito agora
3. Arquivos alterados
4. Evidências de teste
5. O que falta
6. % honesto do launch
7. Próxima ação única mais inteligente
```

## 17. Próxima ação única mais inteligente

A próxima ação correta não é "subir produção".

É esta:

- executar uma auditoria forense do ambiente para provar qual commit está em produção e se a rota real de `/triagem/emagrecimento` já está usando o `EmagrecimentoOnePageIntake` com os campos e ordem que o pedido final exige.

Sem isso, qualquer ajuste visual pode estar certo localmente e errado na operação real.
