#!/usr/bin/env bash
set -euo pipefail

echo "🎨 Verificando paleta de cores..."

# Cores permitidas (apenas preto, branco e verde Alloe)
ALLOWED_COLORS=(
  "black"
  "white"
  "brand"
  "bg"
  "fg"
  "border"
  "muted"
  "foreground"
  "background"
  "primary"
  "secondary"
  "accent"
  "destructive"
  "muted-foreground"
  "card"
  "card-foreground"
  "popover"
  "popover-foreground"
  "input"
  "ring"
  "chart-1"
  "chart-2"
  "chart-3"
  "chart-4"
  "chart-5"
)

# Cores proibidas
FORBIDDEN_COLORS=(
  "purple"
  "indigo"
  "blue"
  "red"
  "yellow"
  "orange"
  "pink"
  "gray"
  "slate"
  "zinc"
  "neutral"
  "stone"
  "amber"
  "lime"
  "emerald"
  "teal"
  "cyan"
  "sky"
  "violet"
  "fuchsia"
  "rose"
)

# Verificar arquivos TypeScript/TSX
echo "🔍 Verificando arquivos TypeScript/TSX..."
VIOLATIONS=0

for color in "${FORBIDDEN_COLORS[@]}"; do
  if grep -r --include="*.ts" --include="*.tsx" -i "bg-${color}\|text-${color}\|border-${color}\|hover:bg-${color}\|hover:text-${color}" src/; then
    echo "❌ Cor proibida encontrada: ${color}"
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done

# Verificar arquivos CSS (ignorar animações)
echo "🔍 Verificando arquivos CSS..."
if grep -r --include="*.css" -i "purple\|indigo\|blue\|red\|yellow\|orange\|pink\|gray\|slate\|zinc\|neutral\|stone\|amber\|lime\|emerald\|teal\|cyan\|sky\|violet\|fuchsia\|rose" src/ | grep -v "grayscale\|transform\|translateY\|translateX"; then
  echo "❌ Cores proibidas encontradas em CSS"
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# Verificar Tailwind config (ignorar animações)
echo "🔍 Verificando configuração Tailwind..."
if grep -i "purple\|indigo\|blue\|red\|yellow\|orange\|pink\|gray\|slate\|zinc\|neutral\|stone\|amber\|lime\|emerald\|teal\|cyan\|sky\|violet\|fuchsia\|rose" tailwind.config.js | grep -v "transform\|translateY\|translateX"; then
  echo "❌ Cores proibidas encontradas no Tailwind config"
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# Resultado final
if [ $VIOLATIONS -eq 0 ]; then
  echo "✅ Paleta de cores está correta!"
  echo "✅ Apenas preto, branco e verde Alloe são usados"
  exit 0
else
  echo "❌ $VIOLATIONS violações de paleta encontradas"
  echo "❌ Use apenas: preto, branco e verde Alloe (brand)"
  exit 1
fi
