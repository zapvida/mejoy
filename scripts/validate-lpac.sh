#!/bin/bash
echo "🔍 VALIDAÇÃO LPAC v3"
echo "===================="
echo ""

echo "✅ Verificando componentes..."
COMPONENTS=$(find src/components/b2b -name "*.tsx" | wc -l)
echo "   Componentes encontrados: $COMPONENTS"

echo ""
echo "✅ Verificando imports..."
grep -r "from '@/lib/analytics'" src/components/b2b/ | wc -l | xargs echo "   Tracking analytics:"

echo ""
echo "✅ Verificando data-testid..."
grep -r "data-testid" src/components/b2b/ | wc -l | xargs echo "   Test IDs:"

echo ""
echo "✅ Verificando aria-label..."
grep -r "aria-label" src/components/b2b/ | wc -l | xargs echo "   Aria labels:"

echo ""
echo "✅ Verificando design system..."
grep -q "text-text\|bg-surface\|bg-muted\|text-primary" src/components/b2b/Hero.tsx && echo "   Design system: ✅" || echo "   Design system: ❌"

echo ""
echo "✅ Validação completa!"
