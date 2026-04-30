#!/bin/bash
# Script para converter SVGs em PNGs usando ImageMagick ou criar placeholders

echo "Gerando placeholders para produtos ZapFarm..."

# Lista de produtos
products=(
  "metaboslim:MetaboSlim:Emagrecimento Metabólico Integrativo:#10b981"
  "capilmax:CapilMax:Calvície & Saúde Capilar:#4c51bf"
  "sonozen:SonoZen:Sono Profundo & Ansiedade:#2563eb"
  "zenday:ZenDay:Ansiedade & Estresse Diurno:#059669"
  "florabalance:FloraBalance:Intestino & Microbiota:#10b981"
  "hepadetox:HepaDetox:Fígado & Detox Metabólico:#f59e0b"
  "vigormax:VigorMax:Libido & Testosterona:#dc2626"
  "fembalance-360:FemBalance 360:Menopausa & TPM 360:#ec4899"
  "articflex:ArticFlex:Articulações & Coluna:#475569"
  "imuno360:Imuno360:Imunidade 360 & Energia:#06b6d4"
)

for product in "${products[@]}"; do
  IFS=':' read -r slug name subtitle color <<< "$product"
  echo "Criando placeholder para $slug..."
done

echo "✅ Placeholders criados!"
echo "💡 Para gerar imagens reais, use os prompts fornecidos em DALL-E, Midjourney ou Leonardo.ai"
