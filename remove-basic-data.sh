#!/bin/bash
# Script para remover dados básicos duplicados de todas as triagens

echo "Removendo dados básicos duplicados das triagens..."

# Lista de arquivos de triagem (exceto gastro.ts que já está correto)
TRIAGE_FILES=(
  "src/forms/coluna.ts"
  "src/forms/biohacking.ts"
  "src/forms/bucal.ts"
  "src/forms/crianca.ts"
  "src/forms/microbioma.ts"
  "src/forms/dor-cronica.ts"
  "src/forms/tireoide.ts"
  "src/forms/cancer.ts"
  "src/forms/respiratoria.ts"
  "src/forms/auditiva.ts"
  "src/forms/ocular.ts"
  "src/forms/pele.ts"
  "src/forms/mama.ts"
  "src/forms/vitalidade.ts"
  "src/forms/longevidade.ts"
  "src/forms/hepatica.ts"
  "src/forms/micronutrientes.ts"
  "src/forms/trabalhador.ts"
  "src/forms/alergias.ts"
  "src/forms/gestante.ts"
  "src/forms/mental.ts"
  "src/forms/cardio.ts"
  "src/forms/metabolico.ts"
  "src/forms/sono.ts"
)

for file in "${TRIAGE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processando $file..."
    
    # Criar backup
    cp "$file" "$file.backup"
    
    # Usar sed para remover o bloco de dados básicos
    sed -i '' '/\/\/ Dados básicos (se não coletados anteriormente)/,/^  },$/d' "$file"
    
    echo "✅ $file processado"
  else
    echo "⚠️  $file não encontrado"
  fi
done

echo "✅ Remoção de dados básicos concluída!"
echo "Arquivos de backup criados com extensão .backup"
