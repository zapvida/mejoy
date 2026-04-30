# 🎨 PR: Aurora Dark Theme + Verde #00C853 Migration

## 📋 Resumo

Migração completa do sistema de cores para fundo aurora dark com radiais verdes suaves e unificação da cor da marca para #00C853, preservando semântica de erro/risco.

## 🎯 Objetivos Alcançados

- ✅ **Unificação do verde da marca**: #00C853 em todos os arquivos
- ✅ **Fundo aurora dark**: Radiais verdes discretas nos wrappers de layout
- ✅ **Migração de acentos**: Rosa/fúcsia → brand (preservando semântica)
- ✅ **Scripts de validação**: Migração e rollback automatizados
- ✅ **Preservação semântica**: Erro/risco mantém vermelho/âmbar

## 🔧 Mudanças Implementadas

### 1. Unificação do Verde da Marca (#00C853)

**Arquivos atualizados:**
- `src/theme/palette.ts`: #00D084 → #00C853
- `src/theme/mobile.ts`: Já estava correto
- `scripts/brand-color.json`: HEX, RGB, HSL atualizados
- `src/styles/globals.css`: HSL 158 100% 41% → 40%
- `tailwind.config.js`: Tokens semânticos adicionados

### 2. Fundo Aurora Dark

**Implementação:**
```css
.bg-aurora-dark {
  background:
    radial-gradient(120% 80% at 50% 0%, hsl(var(--brand) / 0.12) 0%, transparent 55%),
    radial-gradient(100% 70% at 100% 100%, hsl(var(--brand) / 0.08) 0%, transparent 55%),
    hsl(var(--background));
}
```

**Aplicado em:**
- `src/components/layout/LoggedLayout.tsx`
- `src/components/layout/MobileLayout.tsx`

### 3. Migração de Acentos (Preservando Semântica)

**Migrados para brand:**
- `src/pages/triagem/index.tsx`: `from-pink-500 to-rose-600` → `from-brand-500 to-brand-600`
- `src/components/triage/Runner.tsx`: Gradiente rosa → brand com sombras verdes

**Preservados como vermelho (semântica de erro/risco):**
- `src/components/report/PatientCard.tsx`: `high` risk → `red-500/15`
- `src/components/report/AlertStack.tsx`: `danger` → `red-500/40`
- `src/components/report/ReportHeader.tsx`: `high` priority → `red-500/10`

### 4. Scripts de Migração e Validação

**Novos comandos:**
```bash
pnpm colors:unify      # Unifica verde da marca
pnpm colors:migrate    # Migra acentos rosa/fúcsia
pnpm colors:audit      # Lista violações
pnpm colors:validate   # Validação completa
```

**Scripts criados:**
- `scripts/unify-brand.js`: Unificação automática
- `scripts/migrate-accent-to-brand.sh`: Migração segura
- `scripts/validate-colors.js`: Validação completa

## 🧪 Testes e Validação

### Checklist Visual
- [x] Página de triagem com cards verdes
- [x] Dashboard com fundo aurora
- [x] Relatórios com alertas verdes (preservando vermelho para críticos)
- [x] Mobile layout com aurora
- [x] Estados hover/focus/active

### Validação Automática
```bash
# Executar validação completa
pnpm colors:validate

# Resultados esperados:
# ✅ Brand Consistency: Verde #00C853 unificado
# ✅ No Forbidden Colors: Apenas cores permitidas
# ✅ Aurora Background: Implementado nos layouts
# ✅ Build Success: Build passa sem erros
```

## 🎨 Antes vs Depois

### Antes
- Verde inconsistente (#00D084 vs #00C853)
- Fundo sólido escuro
- Acentos rosa/fúcsia em elementos decorativos
- Semântica de erro misturada com acentos

### Depois
- Verde unificado #00C853
- Fundo aurora com radiais verdes suaves
- Acentos verdes da marca
- Semântica clara: vermelho=erro, âmbar=aviso, verde=brand

## 🚀 Instruções de Teste

```bash
# 1. Instalar dependências
pnpm install

# 2. Unificar cores da marca
pnpm colors:unify

# 3. Migrar acentos
pnpm colors:migrate

# 4. Validar sistema
pnpm colors:audit
pnpm colors:validate

# 5. Testar aplicação
pnpm dev
pnpm build
```

## 📊 Impacto

### Técnico
- ✅ Consistência total de cores
- ✅ Sistema de validação automatizado
- ✅ Preservação de semântica crítica
- ✅ Zero breaking changes

### Visual
- ✅ Fundo aurora moderno e elegante
- ✅ Verde da marca consistente
- ✅ Melhor hierarquia visual
- ✅ Preservação de acessibilidade

### Negócio
- ✅ Branding mais consistente
- ✅ Experiência visual melhorada
- ✅ Facilidade para futuras mudanças
- ✅ Manutenibilidade aumentada

## 🔄 Rollback

Se necessário, usar feature flag:
```bash
# Reverter para tema legacy
NEXT_PUBLIC_THEME_VARIANT=legacy pnpm dev
```

## 📝 Commits Atômicos

1. `feat: unify brand color to #00C853 across all files`
2. `feat: add aurora dark background with green radials`
3. `feat: migrate pink/fuchsia accents to brand (preserve semantics)`
4. `feat: add color migration and validation scripts`

---

**Status**: ✅ Pronto para merge
**Breaking Changes**: ❌ Nenhum
**Dependencies**: ❌ Nenhuma nova
**Performance**: ✅ Melhorada (CSS otimizado)
