# 📄 INSTRUÇÕES PARA CONVERTER PARA WORD

## Arquivos Gerados

1. **`APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.md`**
   - Documento completo e detalhado (40+ páginas)
   - Todos os fluxos, classificações e cenários

2. **`MAPAS_VISUAIS_TRIAGEM_EMAGRECIMENTO.md`**
   - Diagramas e mapas visuais
   - Árvores de decisão
   - Fluxos detalhados

3. **`RESUMO_EXECUTIVO_INVESTIDORES.md`**
   - Resumo executivo (5-10 páginas)
   - Para apresentação rápida

---

## 🔄 OPÇÃO 1: CONVERSÃO ONLINE (RECOMENDADO)

### **Usando Dillinger.io ou StackEdit:**

1. Acesse: https://dillinger.io ou https://stackedit.io
2. Cole o conteúdo do arquivo `.md`
3. Clique em "Export" → "Word (.docx)"
4. Baixe o arquivo

### **Usando Pandoc (se instalado):**

```bash
# Instalar Pandoc (macOS)
brew install pandoc

# Converter documento principal
pandoc docs/APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.md \
  -o docs/APRESENTACAO_INVESTIDORES_TRIAGEM_EMAGRECIMENTO.docx \
  --reference-doc=template.docx

# Converter mapas visuais
pandoc docs/MAPAS_VISUAIS_TRIAGEM_EMAGRECIMENTO.md \
  -o docs/MAPAS_VISUAIS_TRIAGEM_EMAGRECIMENTO.docx

# Converter resumo executivo
pandoc docs/RESUMO_EXECUTIVO_INVESTIDORES.md \
  -o docs/RESUMO_EXECUTIVO_INVESTIDORES.docx
```

---

## 🔄 OPÇÃO 2: COPIAR E COLAR NO WORD

1. Abra Microsoft Word
2. Abra o arquivo `.md` em um editor de texto
3. Copie todo o conteúdo
4. Cole no Word
5. Word converterá automaticamente o Markdown

**Nota:** Diagramas ASCII podem precisar de ajuste manual ou conversão para imagens.

---

## 🔄 OPÇÃO 3: USAR VS CODE + EXTENSÃO

1. Instale extensão "Markdown PDF" no VS Code
2. Abra o arquivo `.md`
3. Clique com botão direito → "Markdown PDF: Export (docx)"
4. Arquivo será gerado automaticamente

---

## 📊 DIAGRAMAS E MAPAS

Os diagramas ASCII podem ser convertidos para imagens usando:

1. **Mermaid Live Editor:** https://mermaid.live
   - Converte diagramas Mermaid para PNG/SVG
   - Pode inserir no Word

2. **Draw.io:** https://app.diagrams.net
   - Criar diagramas profissionais
   - Exportar como PNG para Word

3. **Lucidchart:** https://www.lucidchart.com
   - Criar fluxogramas profissionais
   - Exportar para Word

---

## ✅ CHECKLIST DE CONVERSÃO

- [ ] Documento principal convertido
- [ ] Mapas visuais convertidos
- [ ] Resumo executivo convertido
- [ ] Diagramas convertidos para imagens (se necessário)
- [ ] Formatação verificada no Word
- [ ] Índice gerado (se necessário)
- [ ] Numeração de páginas adicionada
- [ ] Cabeçalho/rodapé adicionado (se necessário)

---

## 📝 SUGESTÕES DE FORMATAÇÃO NO WORD

### **Estilos Sugeridos:**

- **Título Principal:** Título 1, Negrito, 18pt
- **Títulos de Seção:** Título 2, Negrito, 14pt
- **Subtítulos:** Título 3, Negrito, 12pt
- **Corpo do Texto:** Normal, 11pt
- **Código/Exemplos:** Fonte monoespaçada, 10pt

### **Cores Sugeridas:**

- ✅ Verde: Para status positivo
- ❌ Vermelho: Para status negativo
- ⚠️ Amarelo: Para avisos
- 🔵 Azul: Para informações

---

**Boa sorte com a apresentação!** 🚀

