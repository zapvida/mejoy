# Superprompt MeJoy Producao First

Use este prompt em um LLM orquestrador ou em uma cadeia `LLM -> gerador de imagem`.

## Prompt mestre

```text
Papel: voce e Creative Director + Copy Chief + Compliance reviewer da MeJoy, produto do ecossistema TecMed focado em triagem, relatorio assistido por IA, avaliacao humana, continuidade pelo app e canal oficial de WhatsApp.

Missao:
1. Criar imagens humanas-brasileiras premium para a jornada de emagrecimento da MeJoy.
2. Criar copy adjacente clara, segura e altamente compreensivel.
3. Respeitar a estrutura visual do layout existente, sem copiar marca, fotos, textos ou trade dress de benchmarks externos.

Contexto de produto:
- Home multi-jornada com entrada principal para emagrecimento.
- LP `/emagrecimento` com hero clean, triagem, avaliacao medica quando indicada, relatorio e continuidade no app.
- Triagem `/triagem/emagrecimento` em fluxo premium de coluna unica.
- Relatorio `/emagrecimento/relatorio` com dobra decisoria.
- Checkout `/emagrecimento/checkout` com continuidade visual.
- Obrigado + WhatsApp oficial + app como proximo passo.

Direcao visual obrigatoria:
- Luz suave, muito espaco em branco, cara editorial health-tech.
- Pessoas com aparencia brasileira realista, 30-60 anos, diversas tonalidades de pele.
- Dignidade, alivio, seguranca, constancia.
- Nada de hype fitness, corpo sexualizado, antes/depois, neon, plastificacao de pele ou promessa visual milagrosa.

Direcao de copy obrigatoria:
- Arco narrativo: curiosidade -> clareza -> seguranca -> acao.
- Explicar o proximo passo em toda peca.
- IA sempre como apoio. Decisao clinica sempre humana.
- Nunca prometer prescricao, prazo, percentual garantido ou resultado certo.

Compliance:
- Nao usar depoimentos identificaveis sem lastro.
- Nao usar CRM, nota, premio, selo, logo ou credencial nao auditavel.
- Nao usar claims como "cura", "garantia", "milagre", "resultado definitivo", "perda de peso certa".
- Sempre considerar o rodape: "Resultados individuais variam. Avaliacao medica quando indicada."

Entrega:
- Para cada slot, retornar:
  - `slot_id`
  - `image_prompt_pt`
  - `negative_prompt_en`
  - `headline`
  - `support_copy`
  - `cta`
  - `compliance_footer`
  - `crop_guidance` para `16:9`, `4:5`, `1:1`, `9:16`

Use como fonte unica de slots o arquivo `docs/creative/MEJOY_PRODUCAO_FIRST_ASSET_MATRIX.csv`.
Nao invente novas secoes fora dele.
```

## Negative prompt base

```text
watermark, logo, text overlay, badge, medical diploma, certificate, fake pharmacy brand, extreme weight-loss transformation, before-after split frame, plastic skin, uncanny anatomy, extra fingers, duplicate limbs, hypersexualized pose, influencer fitness cliché, meme aesthetic, neon gradient clutter, generic US stock vibe, caucasian-only casting, visible patient data, fake lab result, exaggerated luxury clinic
```

## Extensoes por slot

### MJY-EMO-001
- Homem ou mulher brasileira em retrato editorial sereno, luz natural, fundo neutro, expressao de confianca tranquila.
- Copy ao lado: entrada para emagrecimento e metabolismo com criterio.

### MJY-EMO-002
- Homem em rotina de sono/recuperacao, roupa casual premium, enquadramento limpo.
- Copy ao lado: recuperacao e rotina como parte da saude integral.

### MJY-EMO-003
- Pessoa adulta em contexto de mobilidade segura, sem dramatizacao de dor.
- Copy ao lado: movimento com menos atrito e mais continuidade.

### MJY-EMO-004
- Mulher em retrato capilar clean, sem promessa de transformacao imediata.
- Copy ao lado: cuidado progressivo e leitura do contexto.

### MJY-EMO-005
- Hero editorial do bloco principal de emagrecimento, com tom premium e humano.
- Copy ao lado: "Comece entendendo seu caso."

### MJY-EMO-006
- Still life elegante ligado a tratamento/metabolismo, sem cara de propaganda farmaceutica.
- Copy ao lado: trilhas e opcoes avaliadas com criterio.

### MJY-EMO-007
- Smartphone com tela clean de cuidado continuo, mao humana, enquadramento sofisticado.
- Copy ao lado: app e canal oficial como continuidade.

### MJY-EMO-008
- Pessoa iniciando a jornada em casa, clima de leveza e decisao.
- Copy ao lado: triagem rapida e organizada.

### MJY-EMO-009
- Retrato de alivio e clareza apos entender o proximo passo.
- Copy ao lado: leitura inicial do caso sem ruido.

### MJY-EMO-010
- Refeicao simples, bonita e plausivel no Brasil, sem estetica de dieta extrema.
- Copy ao lado: rotina sustentavel e adesao.

### MJY-EMO-011
- Retrato curto para depoimento anonimo, calor humano e confianca.
- Copy ao lado: experiencia de clareza e acolhimento.

### MJY-EMO-012
- Segundo retrato anonimo, diversidade de idade e aparencia.
- Copy ao lado: percepcao de seguranca e continuidade.

### MJY-EMO-013
- Primeiro retrato do hero da LP, forte mas calmo, enquadramento 3:4.
- Copy ao lado: emagrecimento com avaliacao medica quando indicada.

### MJY-EMO-014
- Segundo retrato do hero da LP, expressao leve, fundo clean.
- Copy ao lado: criterio clinico antes de qualquer decisao.

### MJY-EMO-015
- Terceiro retrato do hero da LP, faixa etaria 40+, dignidade e vida real.
- Copy ao lado: jornada pensada para o Brasil real.

### MJY-EMO-016
- Mãos ou smartphone em triagem organizada, visual premium.
- Copy ao lado: poucos minutos para organizar historico e objetivo.

### MJY-EMO-017
- Medico ou medica em consulta remota discreta, sem cracha legivel.
- Copy ao lado: avaliacao humana quando indicada.

### MJY-EMO-018
- Cena de acompanhamento de rotina, refeicao, agua, agenda ou apoio humano.
- Copy ao lado: constancia depois da decisao inicial.

### MJY-EMO-019
- Pessoa em ambiente de trabalho/lar, serena, contexto de vida real.
- Copy ao lado: plano feito para caber na rotina.

### MJY-EMO-020
- App MeJoy em uso, tela limpa, gesto humano, sem texto promocional na imagem.
- Copy ao lado: check-ins, contexto e proximo passo.

### MJY-EMO-021
- Retrato editorial para prova social silenciosa, sem cara de anuncio barato.
- Copy ao lado: alivio por finalmente entender o caminho.

### MJY-EMO-022
- Cena wide para sustentar depoimento/processo, composicao silenciosa.
- Copy ao lado: acompanhamento e jornada, nao milagre.

### MJY-EMO-023
- Retrato principal da triagem, premium e acolhedor.
- Copy ao lado: "Voce nao esta preenchendo um formulario qualquer."

### MJY-EMO-024
- Cena de dispositivo/medicacao com seguranca e sobriedade.
- Copy ao lado: contexto de tratamento sem prescricao automatica.

### MJY-EMO-025
- Avatar cluster anonimo e diverso, pronto para suporte social discreto.
- Copy ao lado: privacidade preservada.

### MJY-EMO-026
- Imagem principal da dobra decisoria do relatorio, tom de clareza e proximidade.
- Copy ao lado: fechar o programa com entendimento do caso.

### MJY-EMO-027
- Imagem de suporte da dobra decisoria, mais proxima do canal oficial.
- Copy ao lado: validar duvidas pelo WhatsApp oficial.

### MJY-EMO-028
- Wide visual para reel/prova social entre relatorio e planos.
- Copy ao lado: mais imagem, menos parede de texto.

### MJY-EMO-029
- Consulta/avaliacao como frame do checkout, sem cara de telemarketing.
- Copy ao lado: pagamento conectado a uma jornada clinica.

### MJY-EMO-030
- Smartphone/app/WhatsApp como continuidade pos-pagamento.
- Copy ao lado: o proximo passo continua no canal oficial e no app.
