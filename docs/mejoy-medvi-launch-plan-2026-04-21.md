# Plano Final de Lançamento MeJoy GLP-1

Data de referência: 21/04/2026

## Objetivo

Adaptar o padrão de conversão validado da MEDVi para o ecossistema MeJoy, sem reconstruir o produto do zero, usando a infraestrutura já existente de:

- landing page
- triagem dinâmica
- geração de relatório
- captura e persistência de `whatsapp`
- envio de mensagem pós-triagem
- checkout por produto

O foco inicial deve ser:

- perda de peso
- peptídeos / GLP-1
- acompanhamento médico
- conversão por WhatsApp
- fulfillment com farmácia parceira

## O Que Já Existe no Código

O `mejoy` já tem a maior parte da base pronta:

- landing de emagrecimento em [`src/pages/emagrecimento/index.tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/emagrecimento/index.tsx)
- composição da LP em [`src/components/zapfarm/obesidade/EmagrecimentoMedviLanding.tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/components/zapfarm/obesidade/EmagrecimentoMedviLanding.tsx)
- configuração central do produto em [`src/config/zapfarm/products.ts`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/config/zapfarm/products.ts)
- triagem dinâmica em [`src/pages/triagem/[slug].tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/triagem/[slug].tsx)
- formulário atual de emagrecimento em [`src/forms/emagrecimento.ts`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/forms/emagrecimento.ts)
- captura de `whatsapp` no backend em [`src/pages/api/triage/answer.ts`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/api/triage/answer.ts)
- geração e finalização do relatório em [`src/pages/api/triage/finalize.ts`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/api/triage/finalize.ts)
- relatório específico por produto em [`src/pages/[product]/relatorio.tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/[product]/relatorio.tsx)
- precificação visual em [`src/components/zapfarm/shared/ProductPricingSection.tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/components/zapfarm/shared/ProductPricingSection.tsx)

Conclusão: o projeto não precisa de refactor estrutural grande. Precisa de reposicionamento do funil, compressão do relatório, nova arquitetura de oferta e ajuste de copy/compliance.

## Decisão Estratégica

Copiar a arquitetura de conversão da MEDVi faz sentido.

Copiar identidade visual, marca, símbolo, trade dress e aparência "idêntica" não faz sentido.

Diretriz:

- replicar a lógica de conversão
- replicar a cadência do funil
- replicar a redução de fricção
- superar a MEDVi em clareza, WhatsApp e personalização
- manter identidade própria MeJoy / TechMed

## Estrutura Recomendada de Funil

Usar 4 páginas:

1. LP de alta conversão
2. Triagem curta e progressiva
3. Resultado + recomendação + prova + CTA
4. Checkout + dados de entrega + pagamento

## Alinhamento 1:1 Melhorado

Meta real:

- reproduzir a arquitetura da MEDVi quase bloco a bloco
- manter o mesmo nível de percepção premium
- reduzir fricção onde a MEDVi ainda exagera
- aumentar clareza de oferta para Brasil
- converter melhor com WhatsApp e operação local

### O Que Deve Ficar 1:1

- hierarquia geral da home ecossistêmica
- hero da LP de emagrecimento
- padrão de card por vertical
- progress bar da triagem mobile
- container central estreito e mobile-first da triagem
- linguagem visual com blocos claros, bordas suaves, espaçamento respirado e pastéis
- ritmo visual de prova social, benefícios, garantia e badges
- padrão de CTA único e dominante

### O Que Deve Ficar Melhor Que a MEDVi

- menos texto morto
- menos disclaimers “brigando” com a conversão acima da dobra
- menos perguntas redundantes na triagem
- mais clareza sobre próximo passo
- mais transparência sobre médico, farmácia e WhatsApp
- relatório mais enxuto e mais decisivo
- oferta mais clara para o Brasil
- identidade própria mais refinada

### O Que Não Pode Desalinhar

- não virar uma landing genérica de clínica
- não virar e-commerce farmacêutico cru
- não ficar “bonita porém vaga”
- não trocar o ritmo premium/minimalista da MEDVi por visual carregado
- não encher de roxo, badges ou boxes desnecessários

## Spec Visual e Estrutural Por Página

### Home Ecossistêmica

Base observada nos prints:

- hero institucional com headline grande e muito limpa
- menu hambúrguer lateral simples
- cards de categorias no topo
- sections longas por vertical:
  - Weight Loss
  - Peptides & Longevity
  - Women's Health
  - Meals
  - Supplements
  - Men's Health
  - Hair
  - Skincare
  - Care Coaching
- grande área de testimonials
- barra inferior com garantias e diferenciais
- disclaimer robusto no rodapé

Versão MeJoy:

- manter a mesma arquitetura
- começar com:
  - Emagrecimento
  - Peptídeos & Longevidade
  - Saúde da Mulher
  - Saúde do Homem
- deixar os demais como `em breve` só se realmente necessário
- usar o mesmo padrão de cards premium horizontais com foto/produto e CTA em seta

### LP de Emagrecimento

Base observada:

- barra promocional no topo
- cabeçalho extremamente simples
- headline direta
- bullets curtos de valor
- CTA central forte
- mosaico humano logo abaixo
- logos de imprensa

Versão MeJoy:

- manter a mesma ordem
- trocar promessa EUA por promessa Brasil
- adicionar:
  - medicação original
  - avaliação médica
  - entrega na sua cidade
  - suporte por WhatsApp
- trocar “insurance/HSA/FSA” por equivalentes brasileiros úteis
- incluir prova local real logo cedo

### Triagem Mobile

Base observada:

- top bar com logo e nota
- progress bar em passos
- container narrow
- páginas longas por etapa
- campos de altura, peso, meta
- sexo, data de nascimento
- blocos extensos de contraindicação
- perguntas em cards simples
- pressão e frequência cardíaca em cards visuais
- telas intermediárias com pacing/goal projection
- telas intermediárias com vídeos/testemunhos

Versão MeJoy:

- manter exatamente o padrão mobile-first
- manter progress bar visual
- manter cards visuais para seleção
- encurtar a etapa clínica em 20% a 35%
- mover perguntas de menor impacto clínico para revisão médica posterior
- preservar apenas o que afeta:
  - contraindicação
  - segurança
  - escolha de princípio ativo
  - elegibilidade

### Resultados

Base do funil MEDVi e dos anexos:

- sensação de personalização
- escolha ou sugestão de protocolo
- CTA orientado a prescrição/checkout
- prova social e clareza do próximo passo

Versão MeJoy:

- primeira dobra precisa responder:
  - você é elegível?
  - qual opção faz mais sentido?
  - quanto custa aproximadamente?
  - o que acontece agora?
- o relatório completo fica abaixo
- o CTA para WhatsApp e checkout fica acima

### Checkout

Meta:

- continuar o estilo visual da MEDVi
- parecer premium e médico
- não parecer um Stripe cru

Necessário:

- resumo do tratamento
- o que está incluído
- originalidade da medicação
- revisão médica obrigatória
- entrega e pagamento
- confirmação do canal oficial

## Não-Negociáveis do Launch

1. A home nova precisa ter cara de ecossistema, não só de um produto.
2. A LP de emagrecimento precisa bater a MEDVi em limpeza visual e clareza.
3. A triagem precisa parecer premium e médica, mas terminar mais rápido.
4. O WhatsApp precisa virar o fio condutor do pós-triagem.
5. O relatório precisa vender decisão, não despejar informação.
6. O checkout precisa explicar o programa inteiro em 15 segundos.

### Página 1: LP `/emagrecimento`

Objetivo:

- gerar confiança
- vender a promessa
- posicionar acompanhamento médico + medicação original
- empurrar para a triagem

Blocos:

- hero com headline muito forte
- subtítulo focado em segurança, individualização e conveniência
- CTA primário para triagem
- bar de confiança com ANVISA, telemedicina, médicos, LGPD
- "como funciona" em 3 passos
- resultados reais com pacientes brasileiros
- comparação simples entre opções
- FAQ curto
- disclaimer regulatório no rodapé

Mensagem central:

- avaliação digital rápida
- médico valida
- medicação original
- farmácia parceira entrega
- acompanhamento e suporte por WhatsApp

### Página 2: Triagem `/triagem/emagrecimento`

Objetivo:

- medir elegibilidade
- reduzir fricção
- gerar relatório útil
- capturar WhatsApp no último passo

Ordem ideal:

- consentimento legal em 1 clique
- idade/sexo/gestação
- altura/peso
- comorbidades
- contraindicações
- histórico prévio de uso
- objetivo principal
- preferência inicial de tratamento
- primeiro nome
- WhatsApp como última resposta obrigatória

Regras:

- não pedir endereço aqui
- não pedir pagamento aqui
- não pedir informação de shipping aqui
- não pedir excesso de texto aberto
- manter perguntas condicionais

### Página 3: Resultado `/emagrecimento/relatorio`

Objetivo:

- converter o lead em intenção de compra
- entregar valor real
- mostrar qual caminho faz mais sentido
- disparar conexão com WhatsApp oficial

Estrutura:

- resumo do perfil em uma tela
- elegibilidade: apto, apto com ressalvas, não apto
- recomendação principal
- alternativa 1
- alternativa 2
- por que foi recomendada
- benefícios esperados
- próximos passos médicos
- CTA para checkout

O relatório atual tem informação demais acima da dobra.

O novo relatório deve ser:

- mais curto
- mais visual
- mais comercial sem perder credibilidade
- com foco em decisão

### Página 4: Checkout `/[product]/checkout`

Objetivo:

- fechar compra
- coletar entrega
- consolidar canal oficial

Blocos:

- opção selecionada
- o que está incluído
- custo estimado do tratamento
- revisão médica obrigatória
- endereço
- pagamento
- confirmação de canal oficial de WhatsApp

## Arquitetura de Oferta

### O Que Deve Ser Vendido na Frente do Funil

Para o launch, a comunicação comercial deve priorizar:

- tirzepatida original
- semaglutida original
- Contrave original
- escolha guiada pelo médico

### O Que Não Deve Ser Feito

Não usar o front-end como se fosse e-commerce puro de caneta.

O correto é vender:

- programa com avaliação médica
- escolha clínica individualizada
- medicação original validada
- acompanhamento

E não:

- "compre Ozempic em 1 clique"
- "Mounjaro direto sem avaliação"

## Observação Regulatória Crítica

Há um ponto importante de compliance:

- Mounjaro tem indicação aprovada no Brasil para controle crônico do peso em obesidade ou sobrepeso com comorbidade
- Wegovy também tem indicação de obesidade
- Ozempic e Rybelsus continuam ligados, no Brasil, ao diabetes tipo 2 nas comunicações oficiais da Novo Nordisk

Por isso:

- a landing não deve usar `Ozempic` e `Rybelsus` como headline principal de emagrecimento
- eles podem entrar como alternativas avaliadas pelo médico
- o front comercial principal deve falar em `tratamento com agonistas GLP-1 originais` ou destacar o caminho aprovado em bula

## Preços: Snapshot Brasil em 21/04/2026

Os preços abaixo são referências de mercado observadas em varejo e programas anunciados. Não devem ser gravados como promessa rígida em copy de topo, porque variam por canal, cidade, disponibilidade e programa do laboratório.

### Ozempic

- Ozempic 0,25/0,5 mg na Drogasil: R$ 963,00
- Faixa recente no CliqueFarma para 0,25/0,5 mg: R$ 1.153,82 a R$ 1.336,09 em 15/04/2026
- Ozempic teve redução oficial anunciada pela Novo Nordisk em 02/06/2025, com preço sugerido online de R$ 825 para a apresentação inicial 0,25 mg

Leitura prática:

- trabalhar como faixa inicial de referência
- não travar um pack fixo de 3 meses antes da validação médica

### Mounjaro

- Mounjaro 2,5 mg na Drogasil: R$ 1.422,52
- Mounjaro 5 mg na Drogasil: R$ 1.759,64
- Faixa recente no CliqueFarma para 2,5 mg: R$ 1.584,73 a R$ 1.960,69
- Faixa recente no CliqueFarma para 5 mg: R$ 1.406,75 a R$ 1.960,69

Leitura prática:

- protocolo comercial de 3 meses mais simples: 1 caixa 2,5 mg + 2 caixas 5 mg
- custo de medicamento tende a cair perto de R$ 4,9k a R$ 5,2k nesse desenho

### Rybelsus

- Novo Nordisk anunciou em 02/03/2026 custo mensal de R$ 565,00 no e-commerce e R$ 615,00 em loja física na compra de duas caixas de qualquer dosagem
- A mesma estratégia foi divulgada com teto de até R$ 844,00 por caixa dependendo da dose/canal
- CliqueFarma para Rybelsus 7 mg em 16/04/2026: R$ 788,25 a R$ 1.329,71
- Pague Menos para Rybelsus 14 mg: R$ 1.172,99

Leitura prática:

- usar `a partir de R$ 565/mês` somente se houver aderência operacional ao canal/programa
- no funil, mostrar faixa estimada e validar preço final com disponibilidade

### Contrave

- Pague Menos: R$ 695,99
- CliqueFarma em 15/04/2026: R$ 587,97 a R$ 954,44

Leitura prática:

- é a melhor âncora de entrada para ticket menor
- funciona bem como alternativa para perfis que não querem injetável ou não são bons candidatos a GLP-1

## Estratégia de Precificação Comercial

Não recomendo colocar preço final fechado na LP para todos os protocolos.

Recomendo três camadas:

- `A partir de` na LP
- `estimativa personalizada` na tela de resultado
- `preço final` no checkout após seleção e validação

Modelo sugerido:

- custo medicação parceira
- taxa MeJoy / TechMed de 15% a 20%
- taxa médica / operacional explícita ou embutida
- buffer logístico pequeno

### Faixas Comerciais Recomendadas para Teste

- Contrave 3 meses: ancorar abaixo de R$ 2,5k com programa completo
- Semaglutida oral 3 meses: ancorar entre R$ 2,3k e R$ 3,2k conforme dose e canal
- Tirzepatida 3 meses: ancorar entre R$ 5,5k e R$ 6,4k conforme dose e disponibilidade
- Semaglutida injetável original: usar estimativa personalizada, não pack rígido inicial

## WhatsApp Como Eixo do Funil

Essa deve ser a principal vantagem sobre a MEDVi.

Fluxo ideal:

- último passo da triagem = WhatsApp obrigatório
- após finalizar triagem = enviar mensagem automática do número oficial
- quando relatório ficar pronto = enviar link do relatório
- ao confirmar interesse = encaminhar para revisão médica
- após validação = enviar prescrição e próximos passos

No código atual, já existe base para isso em:

- [`src/pages/api/triage/answer.ts`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/api/triage/answer.ts)
- [`src/pages/api/triage/finalize.ts`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/api/triage/finalize.ts)

## Guardrails de Compliance

Obrigatório validar com jurídico, médico responsável e operação:

- retenção de receita para agonistas GLP-1 está em vigor desde 23/06/2025
- dados de saúde são dados pessoais sensíveis pela LGPD
- receita eletrônica deve seguir padrão aceito pela farmácia conveniada
- semaglutida manipulada sofreu restrições relevantes da Anvisa
- promessa comercial não pode substituir ato médico

Implicações de produto:

- sem claim agressivo de cura
- sem prometer elegibilidade antes da triagem
- sem prometer prescrição automática
- sem vender medicação controlada como carrinho comum
- manter revisão médica como passo formal e explícito

## Mudanças Prioritárias no Código

### 1. Reposicionar a LP

Arquivos:

- [`src/components/zapfarm/obesidade/EmagrecimentoMedviLanding.tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/components/zapfarm/obesidade/EmagrecimentoMedviLanding.tsx)
- componentes filhos em `src/components/zapfarm/obesidade/*`
- [`src/config/zapfarm/products.ts`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/config/zapfarm/products.ts)

Objetivo:

- trocar visual genérico atual
- subir densidade de prova e confiança
- ajustar copy para Brasil
- posicionar tratamento, não só "MetaboSlim"

### 2. Reduzir fricção da triagem

Arquivos:

- [`src/forms/emagrecimento.ts`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/forms/emagrecimento.ts)
- possivelmente runner / renderer da triagem

Objetivo:

- reduzir campos
- reordenar perguntas
- deixar `whatsapp` como última resposta obrigatória
- manter lógica condicional

### 3. Enxugar o relatório

Arquivos:

- [`src/pages/[product]/relatorio.tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/[product]/relatorio.tsx)
- [`src/components/zapfarm/report/ReportPrePrescription.tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/components/zapfarm/report/ReportPrePrescription.tsx)
- outros componentes em `src/components/zapfarm/report/*`

Objetivo:

- transformar o relatório em tela de decisão
- manter ciência no fundo
- puxar recomendação, prova social e CTA para cima

### 4. Reescrever a oferta e o checkout

Arquivos:

- [`src/components/zapfarm/shared/ProductPricingSection.tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/components/zapfarm/shared/ProductPricingSection.tsx)
- [`src/pages/[product]/checkout.tsx`](/Users/teobeckert/desenvolvimento/TecMed/mejoy/src/pages/[product]/checkout.tsx)

Objetivo:

- trocar plano atual genérico por oferta real de perda de peso
- usar faixa de preço inteligente
- evidenciar revisão médica e originalidade da medicação

## Métricas de Lançamento

KPIs mínimos:

- LP -> triagem iniciada
- triagem iniciada -> triagem concluída
- triagem concluída -> relatório visualizado
- relatório visualizado -> checkout iniciado
- checkout iniciado -> pago
- triagem concluída -> mensagem WhatsApp entregue
- WhatsApp entregue -> resposta

Targets iniciais:

- LP -> triagem: 15%+
- triagem conclusão: 55%+
- relatório -> checkout: 20%+
- checkout -> pago: 30%+

## Fontes

- MEDVi GLP-1 landing: [glp.medvi.org](https://glp.medvi.org/)
- MEDVi intake: [glp1.medvi.org/intake?afid=org](https://glp1.medvi.org/intake?afid=org)
- Telemedicina CFM Resolução 2.314/2022: [CFM PDF](https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2022/2314_2022.pdf)
- LGPD dados sensíveis: [ANPD](https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes/perguntas-frequentes/2-dados-pessoais/2-2-o-que-sao)
- Retenção de receita GLP-1: [Anvisa](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2025/entra-em-vigor-norma-que-preve-retencao-de-receita-para-medicamentos-agonistas-glp-1)
- Prescrição digital e ICP-Brasil: [ITI](https://www.gov.br/iti/pt-br/assuntos/noticias/indice-de-noticias/acoes-de-telemedicina-incluem-receitas-e-atestados-medicos-com-assinatura-digital-icp-brasil)
- Mounjaro nova indicação para peso: [Anvisa](https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/novos-medicamentos-e-indicacoes/mounjaro-r-tirzepatida-nova-indicacao)
- Anvisa manipulação de GLP-1: [Anvisa](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2025/anvisa-esclarece-e-determina-regras-para-manipulacao-de-canetas-de-glp-1)
- Novo Nordisk redução Ozempic/Wegovy: [Novo Nordisk](https://www.novonordisk.com.br/noticias-e-imprensa/busca-noticias/gordura-no-figado-a-epidemia-silenciosa-ainda-pouco-conhecida-no-brasil0.html)
- Novo Nordisk estratégia Wegovy/Rybelsus: [Novo Nordisk](https://www.novonordisk.com.br/noticias-e-imprensa/busca-noticias/novo-nordisk-anuncia-estrategia-de-expansao-de-acesso-com-preco-especial-para-wegovy-e-rybelsus-semaglutida-injetavel-e-semaglutida-oral.html)
- Ozempic 0,25/0,5 mg Drogasil: [Drogasil](https://wap.drogasil.com.br/ozempic-0-25mg-0-5mg-com-6-agulhas-de-novofine-4mm.html)
- Ozempic 1 mg Pague Menos: [Pague Menos](https://www.paguemenos.com.br/ozempic-1mg-com-1-sistema-mais-4-agulhas-novo-fine-4mm/p)
- Ozempic faixa de preço: [CliqueFarma](https://www.cliquefarma.com.br/preco/ozempic)
- Mounjaro 2,5 mg Drogasil: [Drogasil](https://www.drogasil.com.br/mounjaro-2-5mg-solucao-injetavel-0-5ml-4-canetas-aplicadoras-1272170.html)
- Mounjaro 5 mg Drogasil: [Drogasil](https://wap.drogasil.com.br/mounjaro-5mg-solucao-injetavel-0-5ml-4-canetas-aplicadoras-1272173.html)
- Mounjaro faixa 2,5 mg: [CliqueFarma](https://www.cliquefarma.com.br/preco/mounjaro-2-5mg-0-5ml-4-canetas-aplicadoras-com-0-5ml/menor-preco)
- Mounjaro faixa 5 mg: [CliqueFarma](https://www.cliquefarma.com.br/preco/mounjaro-5mg-ml-com-4-seringas-preenchidas-0-5ml-solucao-uso-subcutaneo-4-canetas-aplicadoras)
- Rybelsus estratégia oficial de preço: [Novo Nordisk](https://www.novonordisk.com.br/noticias-e-imprensa/busca-noticias/novo-nordisk-anuncia-estrategia-de-expansao-de-acesso-com-preco-especial-para-wegovy-e-rybelsus-semaglutida-injetavel-e-semaglutida-oral.html)
- Rybelsus 14 mg Pague Menos: [Pague Menos](https://www.paguemenos.com.br/rybelsus-14mg-com-30-comprimidos/p)
- Rybelsus 7 mg faixa: [CliqueFarma](https://www.cliquefarma.com.br/preco/rybelsus-comprimidos-7mg-oral-com-90)
- Contrave Pague Menos: [Pague Menos](https://www.paguemenos.com.br/contrave-8mg-90mg-com-120-comprimidos-psicotropicos-revestidos-de-liberacao-prolongada/p)
- Contrave faixa de preço: [CliqueFarma](https://www.cliquefarma.com.br/preco/contrave-90-comprimidos-8mg-liberacao-prolongada-frasco-com-120)
- Lançamento Contrave no Brasil: [Merck / PRNewswire](https://www.prnewswire.com/news-releases/merck-lanca-contrave-r-primeiro-medicamento-para-obesidade-que-combina-naltrexona-e-bupropiona-em-um-so-comprimido-no-brasil-862410993.html)

## Superprompt Para Executar no Codex

```text
Você está no repositório /Users/teobeckert/desenvolvimento/TecMed/mejoy.

Objetivo: transformar o funil atual de emagrecimento do MeJoy em uma versão inspirada na arquitetura de conversão validada da MEDVi, mas com identidade própria, menos fricção, melhor estética, melhor clareza comercial e melhor integração com WhatsApp.

Contexto obrigatório:
- Não reconstruir a base do zero.
- Aproveitar o que já existe em landing, triagem, relatório e checkout.
- O foco é launch imediato do vertical de perda de peso.
- O funil deve ter 4 páginas: LP, triagem, resultado, checkout.
- O último passo obrigatório da triagem deve ser WhatsApp.
- O relatório deve ser enviado e reforçado no WhatsApp oficial.
- O médico continua sendo o validador final da conduta e da prescrição.
- O sistema deve vender programa com avaliação + acompanhamento + medicação original, e não uma compra cega de caneta.

Arquivos prioritários:
- src/components/zapfarm/obesidade/EmagrecimentoMedviLanding.tsx
- src/components/zapfarm/obesidade/*
- src/config/zapfarm/products.ts
- src/forms/emagrecimento.ts
- src/pages/[product]/relatorio.tsx
- src/components/zapfarm/report/*
- src/components/zapfarm/shared/ProductPricingSection.tsx
- src/pages/[product]/checkout.tsx
- src/pages/api/triage/finalize.ts

Diretrizes de produto:
- Replicar a lógica de conversão da MEDVi, não a marca da MEDVi.
- Manter identidade visual própria MeJoy / TechMed.
- Deixar o visual mais premium, limpo e confiável.
- Reduzir fricção na triagem.
- Tirar qualquer excesso de texto técnico acima da dobra.
- Puxar recomendação e CTA para cima no relatório.
- Fortalecer prova social, segurança médica, ANVISA, LGPD e conveniência.

Diretrizes de oferta:
- Tratar o funil como programa de emagrecimento com acompanhamento médico.
- Mostrar opções de tratamento original:
  - tirzepatida original
  - semaglutida original
  - Contrave original
  - decisão guiada pelo médico
- Não transformar a landing em venda direta agressiva de medicamento controlado.
- Não usar Ozempic e Rybelsus como headline principal de emagrecimento.
- Usar linguagem de avaliação clínica, elegibilidade, tratamento original e escolha individualizada.

Diretrizes de triagem:
- Reordenar src/forms/emagrecimento.ts para:
  1. consentimento
  2. idade/sexo/gestação
  3. altura/peso
  4. comorbidades
  5. contraindicações
  6. histórico prévio
  7. objetivo principal
  8. preferência inicial de tratamento
  9. primeiro nome
  10. WhatsApp obrigatório como última resposta
- Não pedir endereço nem shipping na triagem.
- Manter perguntas condicionais.
- Otimizar para conclusão em 2 a 4 minutos.

Diretrizes de relatório:
- Reestruturar o relatório para ser uma tela de decisão comercial com utilidade clínica.
- Ordem desejada:
  1. resumo do perfil
  2. elegibilidade
  3. recomendação principal
  4. alternativa 1
  5. alternativa 2
  6. benefícios esperados
  7. próximos passos com médico
  8. CTA para checkout
- Manter detalhes científicos mais abaixo.
- Se houver excesso de componentes, simplificar.

Diretrizes de checkout:
- Mostrar programa escolhido, o que está incluído, revisão médica obrigatória, dados de entrega e pagamento.
- Ajustar a seção de preço para oferta real de emagrecimento.
- Trabalhar com faixa ou estimativa quando o preço depender de dose/canal.
- Evidenciar medicação original e farmácia parceira.

Diretrizes de WhatsApp:
- Garantir que o WhatsApp capturado na triagem seja o canal principal do pós-triagem.
- Após relatório pronto, disparar mensagem do número oficial com link e próximos passos.
- Preparar o fluxo para, após confirmação/pagamento, o médico ou operação assumir dali.

Diretrizes de copy:
- Português-Brasil.
- Mais bonito, mais direto, mais premium.
- Menos jargão.
- Mais clareza de benefício, segurança e conveniência.
- Hero com promessa forte e CTA único.
- Reforçar:
  - medicação original
  - avaliação médica
  - entrega na cidade do paciente
  - suporte por WhatsApp

Diretrizes de design:
- Não usar visual genérico.
- Não usar roxo padrão sem critério.
- Criar linguagem visual sofisticada, clara e quente.
- Não clonar o logo ou a marca da MEDVi.

Entregáveis:
1. Implementar as mudanças.
2. Preservar o que já funciona.
3. Atualizar copy, fluxo e componentes.
4. Validar build ou testes mínimos possíveis.
5. No final, resumir:
   - o que foi alterado
   - riscos remanescentes
   - próximos passos operacionais

Se houver conflito entre conversão e compliance, priorize compliance sem matar a conversão.
```
