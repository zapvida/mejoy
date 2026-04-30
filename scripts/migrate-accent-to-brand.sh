#!/bin/bash
set -euo pipefail

echo "🧹 Migrating pink/fuchsia accents to brand (preserving semantics)..."

# Padrões para substituir (apenas acentos decorativos)
PINK_PATTERNS=(
  "from-pink-500"
  "to-rose-600" 
  "bg-rose-500/15"
  "text-rose-200"
  "border-rose-500/40"
  "bg-rose-500/10"
  "stroke-rose-400"
  "#ff5f6d"
  "#ffc371"
)

# Mapeamentos de substituição
declare -A REPLACEMENTS=(
  ["from-pink-500"]="from-brand-500"
  ["to-rose-600"]="to-brand-600"
  ["bg-rose-500/15"]="bg-brand-500/15"
  ["text-rose-200"]="text-brand-200"
  ["border-rose-500/40"]="border-brand-500/40"
  ["bg-rose-500/10"]="bg-brand-500/10"
  ["stroke-rose-400"]="stroke-brand-400"
  ["#ff5f6d"]="#00C853"
  ["#ffc371"]="#00C853"
)

# Função para verificar se a linha contém contexto de erro/risco
is_error_context() {
  local line="$1"
  # Ignorar linhas que contêm palavras-chave de erro/risco
  if echo "$line" | grep -qiE "(danger|error|critical|risk|status|high.*risk|alert.*danger)"; then
    return 0  # É contexto de erro
  fi
  return 1  # Não é contexto de erro
}

# Função para substituir padrões seguros
safe_replace() {
  local file="$1"
  local pattern="$2"
  local replacement="$3"
  
  # Usar sed com backup e verificação de contexto
  sed -i.bak "
    /$(echo "$pattern" | sed 's/[[\.*^$()+?{|]/\\&/g')/ {
      # Verificar se não é contexto de erro
      /danger\|error\|critical\|risk\|status\|high.*risk\|alert.*danger/I! {
        s/$(echo "$pattern" | sed 's/[[\.*^$()+?{|]/\\&/g')/$(echo "$replacement" | sed 's/[[\.*^$()+?{|]/\\&/g')/g
      }
    }
  " "$file"
  
  # Remover backup se a substituição foi feita
  if [ -f "$file.bak" ]; then
    if ! diff -q "$file" "$file.bak" > /dev/null; then
      rm "$file.bak"
      echo "✅ Updated: $file ($pattern → $replacement)"
    else
      mv "$file.bak" "$file"
    fi
  fi
}

# Encontrar arquivos TypeScript/TSX (excluir tests, stories, mocks)
FILES=$(find src -name "*.tsx" -o -name "*.ts" | grep -vE "(test|spec|story|mock|__tests__|__mocks__)" | head -20)

echo "📁 Found $(echo "$FILES" | wc -l) files to process"

# Aplicar substituições
for file in $FILES; do
  if [ -f "$file" ]; then
    echo "🔍 Processing: $file"
    
    for pattern in "${PINK_PATTERNS[@]}"; do
      if grep -q "$pattern" "$file"; then
        replacement="${REPLACEMENTS[$pattern]}"
        if [ -n "$replacement" ]; then
          safe_replace "$file" "$pattern" "$replacement"
        fi
      fi
    done
  fi
done

echo ""
echo "🎉 Migration complete!"
echo "📊 Preserved error/risk semantics (red/amber)"
echo "🎨 Migrated decorative accents to brand green"
echo ""
echo "💡 Next steps:"
echo "   1. Run: pnpm colors:audit"
echo "   2. Run: pnpm colors:validate" 
echo "   3. Test: pnpm dev"
