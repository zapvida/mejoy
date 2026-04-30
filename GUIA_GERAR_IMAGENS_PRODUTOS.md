# 🎨 Guia Completo: Gerar Imagens de Produtos ZapFarm

## ✅ Status Atual

**Placeholders SVG criados e funcionando!**  
Todos os 10 produtos já têm placeholders profissionais que aparecem no checkout.

---

## 🚀 Opções para Gerar Imagens Reais

### Opção 1: DALL-E 3 (Recomendado - Mais Fácil)

**Onde:** https://chat.openai.com (ChatGPT Plus) ou API da OpenAI

**Como usar:**
1. Acesse o ChatGPT com DALL-E 3
2. Cole o prompt do produto (veja abaixo)
3. Gere a imagem
4. Baixe e salve em `/public/products/` com o nome correto

**Vantagens:**
- ✅ Muito fácil de usar
- ✅ Resultados consistentes
- ✅ Ajustes rápidos com conversação

---

### Opção 2: Midjourney (Melhor Qualidade)

**Onde:** Discord (servidor Midjourney)

**Como usar:**
1. Entre no servidor Midjourney no Discord
2. Use `/imagine` e cole o prompt
3. Escolha a melhor versão (U1, U2, U3, U4)
4. Baixe e salve

**Vantagens:**
- ✅ Qualidade fotográfica excepcional
- ✅ Estilo muito realista
- ✅ Melhor para produtos premium

**Desvantagens:**
- ⚠️ Requer Discord
- ⚠️ Pode precisar de várias iterações

---

### Opção 3: Leonardo.ai (Boa Qualidade + Controle)

**Onde:** https://leonardo.ai

**Como usar:**
1. Crie conta gratuita
2. Vá em "Image Generation"
3. Cole o prompt
4. Ajuste parâmetros (4:5 ou 1:1)
5. Gere e baixe

**Vantagens:**
- ✅ Controle fino de parâmetros
- ✅ Múltiplas variações
- ✅ Interface amigável

---

### Opção 4: Canva (Mais Manual, Mas Controle Total)

**Onde:** https://canva.com

**Como usar:**
1. Crie design 1024x1024
2. Use template de produto
3. Customize com cores ZapFarm
4. Exporte como PNG

**Vantagens:**
- ✅ Controle total do design
- ✅ Consistência visual garantida
- ✅ Pode reutilizar elementos

---

## 📋 Prompts Prontos (Copiar e Colar)

### 1. MetaboSlim (Emagrecimento)

```
Ultra realistic product photo of a premium weight loss supplement bottle on a clean white background. Brand name "ZapFarm" small at the top of the label. Big product name "MetaboSlim" in modern bold font. Subtitle: "Emagrecimento Metabólico Integrativo". Minimal, medical, high-end design. Main accent color: deep teal green with small orange details. White matte plastic bottle, soft studio lighting, subtle shadow, no people, no extra props.
```

### 2. CapilMax (Calvície)

```
Ultra realistic product photo of a premium hair health supplement bottle on a clean white background. Brand "ZapFarm" small at the top. Big product name "CapilMax". Subtitle: "Calvície & Saúde Capilar". Minimal clinical design. Accent color: dark blue with silver details, symbol of hair or follicles in a thin line icon. White matte bottle, soft studio light, subtle shadow, no people.
```

### 3. SonoZen (Sono)

```
Ultra realistic product photo of a sleep and relaxation supplement bottle on a clean white background. Brand "ZapFarm" small at the top. Big product name "SonoZen". Subtitle: "Sono Profundo & Ansiedade Noturna". Minimal design, accent color: deep navy blue with small moon and stars line icon. White matte bottle, soft studio lighting, calm mood, no people.
```

### 4. ZenDay (Ansiedade)

```
Ultra realistic product photo of an anti-stress and focus supplement bottle on a clean white background. Brand "ZapFarm" small at the top. Big product name "ZenDay". Subtitle: "Ansiedade & Estresse Diurno". Minimal, modern design, accent color: soft turquoise and light yellow, thin line icon suggesting calm and focus. White matte bottle, soft light, subtle shadow.
```

### 5. FloraBalance (Intestino)

```
Ultra realistic product photo of a gut health and microbiota supplement bottle on a clean white background. Brand "ZapFarm" small at the top. Big product name "FloraBalance". Subtitle: "Intestino & Microbiota Saudável". Minimal design, accent color: fresh green with small abstract microbiota dots icon. White matte bottle, soft studio lighting, no people.
```

### 6. HepaDetox (Fígado)

```
Ultra realistic product photo of a liver detox supplement bottle on a clean white background. Brand "ZapFarm" small at the top. Big product name "HepaDetox". Subtitle: "Fígado & Detox Metabólico". Minimal clinical design, accent color: emerald green with subtle line icon of liver. White matte bottle, high-end look, soft light and shadow.
```

### 7. VigorMax (Libido Masculina)

```
Ultra realistic product photo of a male vitality supplement bottle on a clean white background. Brand "ZapFarm" small at the top. Big product name "VigorMax". Subtitle: "Libido & Testosterona Masculina". Minimal design, accent color: deep red and dark charcoal, subtle masculine energy, thin lightning or energy line icon. White matte bottle, soft light, subtle shadow.
```

### 8. FemBalance 360 (Menopausa)

```
Ultra realistic product photo of a women's hormonal balance supplement bottle on a clean white background. Brand "ZapFarm" small at the top. Big product name "FemBalance 360". Subtitle: "Menopausa & TPM 360". Minimal elegant design, accent color: soft lilac and rose gold lines, thin icon suggesting female balance. White matte bottle, soft light, premium look.
```

### 9. ArticFlex (Articulações)

```
Ultra realistic product photo of a joint and spine support supplement bottle on a clean white background. Brand "ZapFarm" small at the top. Big product name "ArticFlex". Subtitle: "Articulações & Coluna Saudável". Minimal clinical design, accent color: blue and light orange, thin line icon of joints or spine. White matte bottle, soft studio lighting, subtle shadow.
```

### 10. Imuno360 (Imunidade)

```
Ultra realistic product photo of an immune support supplement bottle on a clean white background. Brand "ZapFarm" small at the top. Big product name "Imuno360". Subtitle: "Imunidade 360 & Energia". Minimal design, accent color: bright green and light yellow, thin shield or plus sign icon. White matte bottle, soft studio lighting.
```

---

## 📐 Especificações Técnicas

- **Formato:** PNG (recomendado) ou JPG
- **Dimensões:** 1024×1024 pixels (ou 1200×1200)
- **Fundo:** Branco ou transparente
- **Resolução:** Mínimo 300 DPI (para impressão futura)
- **Peso:** Máximo 500KB (otimizar se necessário)

---

## 🔄 Processo de Substituição

1. **Gere a imagem** usando um dos métodos acima
2. **Baixe a imagem** no seu computador
3. **Renomeie** para o nome correto (ex: `metaboslim.png`)
4. **Salve** em `/public/products/`
5. **Atualize o código** se necessário (mudar `.svg` para `.png` em `products.ts`)
6. **Teste** no checkout

---

## 💡 Dicas Profissionais

### Para Melhor Resultado:

1. **Use os prompts em inglês** - IAs geram melhor resultado
2. **Gere 3-5 variações** e escolha a melhor
3. **Mantenha consistência** - mesmo estilo de iluminação e ângulo
4. **Ajuste cores** se necessário usando ferramentas de edição
5. **Otimize imagens** antes de fazer upload (TinyPNG, ImageOptim)

### Se Precisar Ajustar:

- **Cores muito diferentes?** Adicione no prompt: "use exact color #10b981" (exemplo)
- **Bottle muito diferente?** Adicione: "same bottle style as previous image"
- **Fundo não branco?** Adicione: "pure white background, no shadows on background"

---

## 🎯 Recomendação Final

**Para começar rápido:** Use DALL-E 3 no ChatGPT  
**Para melhor qualidade:** Use Midjourney  
**Para controle total:** Use Canva com templates

**Tempo estimado:** 30-60 minutos para gerar todas as 10 imagens

---

## ✅ Checklist

- [ ] Gerar imagem MetaboSlim
- [ ] Gerar imagem CapilMax
- [ ] Gerar imagem SonoZen
- [ ] Gerar imagem ZenDay
- [ ] Gerar imagem FloraBalance
- [ ] Gerar imagem HepaDetox
- [ ] Gerar imagem VigorMax
- [ ] Gerar imagem FemBalance 360
- [ ] Gerar imagem ArticFlex
- [ ] Gerar imagem Imuno360
- [ ] Salvar todas em `/public/products/`
- [ ] Atualizar extensões de `.svg` para `.png` em `products.ts`
- [ ] Testar no checkout

---

**Boa sorte! 🚀**

Se precisar de ajuda com algum passo específico, é só perguntar!

