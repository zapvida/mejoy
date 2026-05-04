# Medvi parity harness — Mejoy ↔ Medvi

Harness de QA visual para comparar Mejoy (Preview Vercel ou produção) com Medvi
(referência) em desktop (1440x900) e mobile (iPhone 13 / 390x844). Não é
regressão automática — o objetivo é gerar pares de screenshots para diff visual
humano.

## Como rodar

### Contra Preview Vercel

```bash
PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app \
MEDVI_PARITY_REPORT_ID=<um-id-de-relatorio-real-do-preview> \
pnpm qa:medvi-parity
```

### Contra produção

```bash
PLAYWRIGHT_BASE_URL=https://www.mejoy.com.br \
MEDVI_PARITY_REPORT_ID=$PRODUCTION_REPORT_ID \
pnpm qa:medvi-parity
```

> Se `MEDVI_PARITY_REPORT_ID` (ou `PRODUCTION_REPORT_ID`) não estiver definido,
> a captura do relatório é pulada — os outros 3 fluxos (home, LPAC, triagem)
> rodam normalmente.

## Saída

Os screenshots são salvos em:

```
qa-artifacts/medvi-parity/
├── desktop/
│   ├── home.mejoy.png
│   ├── home.medvi.png
│   ├── lpac-emagrecimento.mejoy.png
│   ├── lpac-emagrecimento.medvi.png
│   ├── triagem-emagrecimento.mejoy.png
│   ├── triagem-emagrecimento.medvi.png
│   ├── relatorio-checkout.mejoy.png   (se MEDVI_PARITY_REPORT_ID estiver definido)
│   └── relatorio-checkout.medvi.png
├── mobile/
│   └── (mesma estrutura, em 390x844)
└── REPORT.md   (gerado automaticamente, com checklist por fluxo)
```

## Como auditar

1. Abrir os pares lado a lado (`desktop/home.mejoy.png` vs `desktop/home.medvi.png`).
2. Marcar deltas em `REPORT.md` por fluxo (UI, copy, imagens, espaçamento).
3. Re-rodar até o diff ficar aceitável (≤2 ajustes por tela).

## Fluxos cobertos

| ID | URL Mejoy | URL Medvi |
|----|-----------|-----------|
| `home` | `/` | `https://home.medvi.org/` |
| `lpac-emagrecimento` | `/emagrecimento` | `https://glp1.medvi.org/` |
| `triagem-emagrecimento` | `/triagem/emagrecimento` | `https://glp1.medvi.org/intake` |
| `relatorio-checkout` | `/emagrecimento/relatorio?id=…` | `https://glp1.medvi.org/results` |
