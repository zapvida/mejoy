#!/bin/bash

# Script para converter documentos Markdown para Word
# Requer: Pandoc instalado (brew install pandoc)

echo "🔄 Convertendo documentos Markdown para Word..."

# Verificar se Pandoc está instalado
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc não está instalado."
    echo "📦 Instale com: brew install pandoc"
    echo ""
    echo "💡 Alternativas:"
    echo "   1. Use Dillinger.io (https://dillinger.io)"
    echo "   2. Use StackEdit (https://stackedit.io)"
    echo "   3. Copie e cole no Word (converte automaticamente)"
    exit 1
fi

# Diretório dos documentos
DOCS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$DOCS_DIR"

echo "📁 Diretório: $DOCS_DIR"
echo ""

# Converter documento principal
if [ -f "$DOCS_DIR/APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.md" ]; then
    echo "✅ Convertendo: APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.md"
    pandoc "$DOCS_DIR/APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.md" \
        -o "$OUTPUT_DIR/APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.docx" \
        --reference-doc=/System/Library/Templates/Applications/Pages.app/Contents/Resources/Templates/pt_BR.lproj/Blank.pages 2>/dev/null || \
    pandoc "$DOCS_DIR/APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.md" \
        -o "$OUTPUT_DIR/APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.docx"
    echo "   ✅ Criado: APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.docx"
else
    echo "❌ Arquivo não encontrado: APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.md"
fi

# Converter mapas visuais
if [ -f "$DOCS_DIR/MAPAS_VISUAIS_TRIAGEM_EMAGRECIMENTO.md" ]; then
    echo "✅ Convertendo: MAPAS_VISUAIS_TRIAGEM_EMAGRECIMENTO.md"
    pandoc "$DOCS_DIR/MAPAS_VISUAIS_TRIAGEM_EMAGRECIMENTO.md" \
        -o "$OUTPUT_DIR/MAPAS_VISUAIS_TRIAGEM_EMAGRECIMENTO.docx"
    echo "   ✅ Criado: MAPAS_VISUAIS_TRIAGEM_EMAGRECIMENTO.docx"
fi

# Converter resumo executivo
if [ -f "$DOCS_DIR/RESUMO_EXECUTIVO_INVESTIDORES.md" ]; then
    echo "✅ Convertendo: RESUMO_EXECUTIVO_INVESTIDORES.md"
    pandoc "$DOCS_DIR/RESUMO_EXECUTIVO_INVESTIDORES.md" \
        -o "$OUTPUT_DIR/RESUMO_EXECUTIVO_INVESTIDORES.docx"
    echo "   ✅ Criado: RESUMO_EXECUTIVO_INVESTIDORES.docx"
fi

echo ""
echo "🎉 Conversão concluída!"
echo "📁 Arquivos Word criados em: $OUTPUT_DIR"
echo ""
echo "📝 Próximos passos:"
echo "   1. Abra os arquivos .docx no Word"
echo "   2. Ajuste formatação se necessário"
echo "   3. Adicione cabeçalho/rodapé se desejar"
echo "   4. Gere índice automático (Referências → Índice)"

