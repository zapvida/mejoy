# Audit summary

## Status deste pacote
- `33/33` telas do pack novo geradas em `SVG` e `PNG`.
- Revisão visual principal em `iPhone-first`.
- Galeria navegável pronta em `html/gallery.html`.
- Manifesto, índice CSV, flow map e checklist já apontam apenas para o pack novo.
- `EAS`, `App Store Connect` e `Google Play` continuam pausados neste ciclo.

## O que foi refatorado
- Navegação principal trocada para `Hoje`, `Plano`, `Médico`, `Farmácia`, `Perfil`.
- Design system mobile reforçado com nova camada editorial:
  - `AppScreen`
  - `PremiumCard`
  - `ScoreCard`
  - `ActionCard`
  - `FeatureCard`
  - `StatusBadge`
  - `CTAButton`
  - `SecondaryButton`
  - `MetricCard`
  - `HealthAlert`
  - estados vazios/loading/error/success
- Home reposicionada como cockpit do paciente.
- Camada de stories premium criada para sustentar review visual consistente antes de EAS.
- Scripts de render do review pack endurecidos para limpar saídas antigas antes de gerar HTML/SVG/PNG.

## Status real vs mockado
### Real e conectado ao MeJoy web / mobile v1
- `dashboard`
- `entitlements`
- `health score`
- `prevention checklist`
- `journey`
- `goal toggle`
- `referral status`
- `specialist request`
- `meal analysis`
- `rituals`
- `wearables sync` manual/fallback

### Preparado / governado / parcialmente mockado
- `ZapVida`
  - UI, preparação de atendimento, resumo automático, fila e chat modelados
  - specialist/concierge request real no contrato mobile
  - integração operacional externa completa ainda deve ser tratada como `prepared`, não `fully live`
- `ZapFarm`
  - hub visual, prescrição, pedido, status e recompra modelados
  - integração farmacêutica externa ainda deve ser tratada como `prepared/mock-assisted`
- `HealthKit / Health Connect / devices`
  - UX e capacidade preparadas
  - fallback manual continua como caminho principal do review pack
- `barcode scanner / product scan`
  - fluxo e saída premium modelados para aprovação visual
  - leitura nativa de câmera/código ainda não foi fechada como integração produtiva neste ciclo

## Validação técnica concluída
- `pnpm typecheck` ✅
- `pnpm mobile:typecheck` ✅
- `pnpm mobile:doctor` ✅
- `./node_modules/.bin/jest --watchman=false --runInBand __tests__/lib/mobile-domain.test.ts __tests__/api/mobile-v1.test.ts __tests__/lib/mejoy-app-value.test.ts` ✅
- `pnpm build` ✅
- `next-sitemap` pós-build ✅

## Warnings residuais observados
- `experimental.useWasmBinary` ignorado em `darwin/arm64` durante doctor/testes.
- Aviso do plugin ESLint do Next não detectado automaticamente no build.
- `baseline-browser-mapping` desatualizado.
- `caniuse-lite` desatualizado.

## Decisões de release
- Este pacote existe para aprovação visual antes de qualquer binário de loja.
- O app foi reposicionado para `store-safe v1`.
- Nada foi enviado para `EAS`.
- Nada foi submetido às lojas.

## Observações de produto
- A linguagem clínica foi mantida como apoio, não diagnóstico.
- Ajuste de dose permanece dependente de validação médica.
- O score 0–100 é apresentado como `hábitos + adesão + prevenção`.
- A narrativa visual foi puxada para um padrão premium, com menos texto solto e mais próxima ação por tela.
