# 📸 GUIA COMPLETO - IMAGENS NECESSÁRIAS PARA LPAC OBESIDADE

## 🎯 RESUMO EXECUTIVO

**Total de imagens necessárias: 2 imagens principais**

Todas as outras seções usam:
- ✅ Gradientes CSS (não precisam de imagens)
- ✅ Emojis (não precisam de imagens)
- ✅ Mockups CSS (não precisam de imagens)

---

## 📋 IMAGENS OBRIGATÓRIAS

### 1️⃣ **IMAGEM HERO - Pessoas Felizes (Circular)**

**Localização no código:**
- Arquivo: `src/components/zapfarm/obesidade/HeroSectionObesidade.tsx`
- Linha: ~48-70

**Especificações Técnicas:**
- **Formato:** JPG ou WebP (recomendado WebP para melhor performance)
- **Dimensões:** 800x800px mínimo (formato quadrado)
- **Tamanho do arquivo:** Máximo 300KB (otimizado)
- **Proporção:** 1:1 (quadrado perfeito)
- **Corte:** Circular (será cortado em círculo no CSS)

**Conteúdo da Imagem:**
- **Pessoas:** 2 pessoas (homem e mulher) sorrindo genuinamente
- **Idade:** 30-50 anos (público-alvo)
- **Expressão:** Feliz, acolhedora, leve, positiva
- **Pose:** Olhando para a câmera ou ligeiramente para o lado
- **Fundo:** Natureza desfocada (parque, jardim, ou fundo verde claro)
- **Iluminação:** Natural, suave, não muito contrastada
- **Cores:** Tons quentes (laranja, rosa, amarelo suave) - combina com gradiente roxo/laranja

**Exemplo de Referência:**
- Similar à Teladoc: pessoas sorrindo, fundo verde desfocado
- Estilo: fotografia de stock profissional, não muito "corporate"
- Sentimento: leveza, felicidade, acolhimento

**Onde salvar:**
```
public/images/obesidade-hero-people.jpg
```
ou
```
public/images/obesidade-hero-people.webp
```

**Como aplicar:**
1. Salvar a imagem em `public/images/obesidade-hero-people.jpg`
2. Abrir `src/components/zapfarm/obesidade/HeroSectionObesidade.tsx`
3. Descomentar as linhas 61-69 (remover `/*` e `*/`)
4. Remover ou comentar o placeholder (linhas 50-59)

---

### 2️⃣ **IMAGEM TAILORED - Pessoa Comendo Saudável**

**Localização no código:**
- Arquivo: `src/components/zapfarm/obesidade/TailoredSectionObesidade.tsx`
- Linha: ~13-34

**Especificações Técnicas:**
- **Formato:** JPG ou WebP (recomendado WebP)
- **Dimensões:** 600x600px mínimo (formato quadrado)
- **Tamanho do arquivo:** Máximo 250KB (otimizado)
- **Proporção:** 1:1 (quadrado perfeito)
- **Corte:** Retangular com bordas arredondadas

**Conteúdo da Imagem:**
- **Pessoa:** 1 pessoa (homem ou mulher) sorrindo
- **Ação:** Comendo comida saudável (salada, frutas, prato colorido)
- **Ambiente:** Cozinha moderna, mesa limpa, iluminação natural
- **Expressão:** Satisfeita, feliz, confortável
- **Comida:** Prato colorido, saudável, apetitoso
- **Fundo:** Neutro ou desfocado (branco, bege claro, ou cozinha moderna)

**Exemplo de Referência:**
- Estilo: lifestyle, natural, não muito "dietético"
- Sentimento: prazer em comer saudável, não privação
- Cores: Tons verdes, laranjas, vermelhos (frutas/vegetais)

**Onde salvar:**
```
public/images/obesidade-healthy-eating.jpg
```
ou
```
public/images/obesidade-healthy-eating.webp
```

**Como aplicar:**
1. Salvar a imagem em `public/images/obesidade-healthy-eating.jpg`
2. Abrir `src/components/zapfarm/obesidade/TailoredSectionObesidade.tsx`
3. Descomentar as linhas 26-33 (remover `/*` e `*/`)
4. Remover ou comentar o placeholder (linhas 17-24)

---

## 🎨 IMAGENS OPCIONAIS (Melhorias Futuras)

### 3️⃣ **Fotos de Depoimentos (Opcional)**

**Localização:** `src/components/zapfarm/obesidade/TestimonialsSectionObesidade.tsx`

**Status atual:** Usa emojis (👩‍🦱, 👩, 👩‍🦰, 👨)

**Se quiser melhorar:**
- Adicionar fotos reais dos depoentes
- Formato: 200x200px (quadrado)
- Salvar em: `public/images/testimonials/[nome].jpg`
- Atualizar o componente para usar `<Image>` ao invés de emoji

**Não é obrigatório para validação inicial!**

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Antes de Validar:
- [ ] Imagem 1: `obesidade-hero-people.jpg` salva em `public/images/`
- [ ] Imagem 2: `obesidade-healthy-eating.jpg` salva em `public/images/`
- [ ] Imagem 1 aplicada no HeroSectionObesidade.tsx
- [ ] Imagem 2 aplicada no TailoredSectionObesidade.tsx
- [ ] Imagens otimizadas (tamanho < 300KB cada)
- [ ] Testado em `http://localhost:3000/obesidade`

### Após Aplicar:
- [ ] Hero section mostra imagem circular real
- [ ] Tailored section mostra imagem de comida saudável
- [ ] Imagens carregam rapidamente
- [ ] Responsividade funciona (mobile e desktop)
- [ ] Sem erros no console do navegador

---

## 🔧 COMO APLICAR AS IMAGENS

### Passo 1: Preparar as Imagens

1. **Editar as imagens:**
   - Redimensionar para as dimensões corretas (800x800 e 600x600)
   - Otimizar com TinyPNG, Squoosh ou similar
   - Converter para WebP se possível (melhor performance)

2. **Salvar no projeto:**
   ```bash
   # Criar diretório se não existir
   mkdir -p public/images
   
   # Copiar imagens
   cp /caminho/da/imagem.jpg public/images/obesidade-hero-people.jpg
   cp /caminho/da/imagem2.jpg public/images/obesidade-healthy-eating.jpg
   ```

### Passo 2: Aplicar no HeroSectionObesidade.tsx

**Arquivo:** `src/components/zapfarm/obesidade/HeroSectionObesidade.tsx`

**ANTES (placeholder):**
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300">
  {/* placeholder */}
</div>
{/* Uncomment when you have the actual image:
<Image
  src="/images/obesidade-hero-people.jpg"
  ...
/>
*/}
```

**DEPOIS (com imagem real):**
```tsx
<Image
  src="/images/obesidade-hero-people.jpg"
  alt="Pessoas felizes em tratamento de obesidade"
  fill
  className="object-cover"
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Passo 3: Aplicar no TailoredSectionObesidade.tsx

**Arquivo:** `src/components/zapfarm/obesidade/TailoredSectionObesidade.tsx`

**ANTES (placeholder):**
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400">
  {/* placeholder */}
</div>
{/* You can replace with actual image:
<Image
  src="/images/obesidade-healthy-eating.jpg"
  ...
/>
*/}
```

**DEPOIS (com imagem real):**
```tsx
<Image
  src="/images/obesidade-healthy-eating.jpg"
  alt="Pessoa comendo saudável"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Passo 4: Adicionar Import do Next/Image

**Verificar se já existe:**
```tsx
import Image from 'next/image';
```

Se não existir, adicionar no topo de cada arquivo.

---

## 📊 ONDE ENCONTRAR IMAGENS

### Opções Gratuitas:
1. **Unsplash** (unsplash.com)
   - Buscar: "happy people", "healthy eating", "wellness"
   - Filtros: Square, Portrait, Natural

2. **Pexels** (pexels.com)
   - Buscar: "happy couple", "healthy food", "lifestyle"

3. **Pixabay** (pixabay.com)
   - Buscar termos similares

### Opções Pagas (Melhor Qualidade):
1. **Shutterstock** (shutterstock.com)
2. **Getty Images** (gettyimages.com)
3. **Adobe Stock** (stock.adobe.com)

### Dicas de Busca:
- "happy diverse people outdoors"
- "healthy eating lifestyle"
- "wellness weight management"
- "positive body image"
- "smiling people nature background"

---

## 🎯 RESUMO FINAL

### ✅ OBRIGATÓRIO (2 imagens):
1. **Hero:** 800x800px - Pessoas felizes (circular)
2. **Tailored:** 600x600px - Pessoa comendo saudável

### ⚠️ OPCIONAL (melhorias futuras):
3. Fotos de depoimentos (4 fotos 200x200px)

### ✅ NÃO PRECISA:
- ❌ Imagem de balança inteligente (usa ícone emoji)
- ❌ Imagem de app (usa mockup CSS)
- ❌ Imagem de coaching (usa ícone emoji)
- ❌ Backgrounds (usa gradientes CSS)

---

## 🚀 PRÓXIMOS PASSOS

1. **Obter as 2 imagens** (hero + tailored)
2. **Otimizar** (redimensionar + comprimir)
3. **Salvar** em `public/images/`
4. **Aplicar** nos componentes (descomentar código)
5. **Testar** em `http://localhost:3000/obesidade`
6. **Validar** visualmente

**Pronto! Com essas 2 imagens, sua LPAC estará 100% completa!** 🎉

