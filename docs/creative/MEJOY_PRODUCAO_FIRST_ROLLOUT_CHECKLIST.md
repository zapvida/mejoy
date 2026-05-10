# Rollout Checklist - MeJoy Producao First

## Ordem obrigatoria
1. Home first frame
2. LP `/emagrecimento` first frame
3. LP middle sections
4. Triagem visuals
5. Relatorio decisorio
6. Checkout
7. Obrigado e WhatsApp continuity
8. App continuity surfaces

## 1. Home first frame
- [ ] Confirmar que [HomeHero](/Users/teobeckert/.codex/worktrees/3d88/mejoy/src/components/home/sections/HomeHero.tsx:12) nao mudou geometria.
- [ ] Validar `390x844` e `430x932`.
- [ ] Checar overlap do painel branco, stack mobile e trust marquee.
- [ ] Confirmar que imagens novas respeitam aspect ratio e corte do slot.

## 2. LP `/emagrecimento` first frame
- [ ] Confirmar que [HeroSectionObesidade](/Users/teobeckert/.codex/worktrees/3d88/mejoy/src/components/zapfarm/obesidade/HeroSectionObesidade.tsx:23) manteve padding, CTA, trio de retratos e sentinela.
- [ ] Validar `390x844` e `430x932` com foco exclusivo na primeira viewport.
- [ ] Garantir ausencia de gaps novos, jitter do header ou quebra do sticky CTA.

## 3. LP middle sections
- [ ] Revisar `HowItWorks`, `Tailored`, `AppFeatures`, `Testimonials` e `Decision`.
- [ ] Conferir alinhamento entre imagem e copy.
- [ ] Verificar que nenhum badge ou asset de benchmark continua publico.

## 4. Triagem visuals
- [ ] Confirmar que o shell de triagem nao mudou logica nem progresso.
- [ ] Revisar hero frames e avatars anonimos.
- [ ] Garantir que a copy continua explicando motivo da pergunta e canal oficial.

## 5. Relatorio decisorio
- [ ] Revisar dobra principal, cards de suporte e area de prova social.
- [ ] Confirmar que o checkout inline continua na mesma pagina.
- [ ] Garantir que a escolha de trilha continua clinica e sem promessas absolutas.

## 6. Checkout
- [ ] Revisar frames de jornada, suporte e continuidade.
- [ ] Garantir que pagamento, consulta e liberacao do painel permanecem claros.
- [ ] Confirmar que o fluxo nao promete acesso imediato sem confirmacao.

## 7. Obrigado e WhatsApp continuity
- [ ] Revisar mensagens pos-pagamento e CTAs.
- [ ] Garantir que o WhatsApp e tratado como canal oficial.
- [ ] Validar que o handoff textual nao contradiz relatorio nem checkout.

## 8. App continuity
- [ ] Revisar mencoes a check-in, score, plano, telemedicina, farmacia e relatorios.
- [ ] Confirmar que toda promessa do app existe no workspace atual.
- [ ] Garantir consistencia de tom entre landing, relatorio, checkout e app.

## Auditoria de runtime
- [ ] `src/` sem referencias a `images/emagrecimento/medvi/*`.
- [ ] `src/` sem referencias a `images/emagrecimento/lp-pdf/*`.
- [ ] Benchmark movido para [docs/references/benchmarks](/Users/teobeckert/.codex/worktrees/3d88/mejoy/docs/references/benchmarks).
- [ ] PDF de referencia fora de `public/`.

## Validacao editorial
- [ ] IA descrita como apoio, nunca substituicao medica.
- [ ] Sem CRM, nota, premio ou depoimento sem lastro.
- [ ] Sem promessa de resultado garantido.
- [ ] Sem antes/depois ou visual corporal apelativo.

## Validacao tecnica
- [ ] Revisao de imports e referencias de assets.
- [ ] Busca textual final em `src/`.
- [ ] Build ou typecheck quando o ambiente local tiver toolchain instalada.
- [ ] Smoke manual do fluxo: LP -> triagem -> relatorio -> checkout -> obrigado.
