#!/usr/bin/env node

/**
 * 🔧 CORREÇÃO AUTOMÁTICA - ALLOE HEALTH
 * Script para corrigir automaticamente problemas visuais e de código
 * Foco: Cards uniformes, cores, alinhamento, responsividade
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 INICIANDO CORREÇÕES AUTOMÁTICAS\n');

// 1. CORRIGIR CSS GLOBAL - PALETA PRETO/BRANCO/VERDE
console.log('🎨 CORRIGINDO CSS GLOBAL...\n');

const globalCSSContent = `/* Alloe Health - CSS Global Otimizado */
/* Paleta: Preto (#000000), Branco (#ffffff), Verde (#00ff00) */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Reset e Base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #000000;
  color: #ffffff;
  line-height: 1.6;
}

/* Cores Principais */
:root {
  --color-primary: #00ff00;
  --color-primary-dark: #00cc00;
  --color-primary-light: #33ff33;
  --color-black: #000000;
  --color-white: #ffffff;
  --color-gray-100: #f8f9fa;
  --color-gray-200: #e9ecef;
  --color-gray-300: #dee2e6;
  --color-gray-400: #ced4da;
  --color-gray-500: #adb5bd;
  --color-gray-600: #6c757d;
  --color-gray-700: #495057;
  --color-gray-800: #343a40;
  --color-gray-900: #212529;
}

/* Componentes Base */
.btn-primary {
  @apply bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
}

.card {
  @apply bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg;
}

.card-premium {
  @apply bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-xl p-6 shadow-lg;
}

.card-free {
  @apply bg-gradient-to-br from-green-600 to-green-700 border border-green-500 rounded-xl p-6 shadow-lg;
}

/* Cards de Triagem - Tamanhos Uniformes */
.triage-card {
  @apply w-full h-80 flex flex-col justify-between p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl;
}

.triage-card-free {
  @apply bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-500;
}

.triage-card-premium {
  @apply bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600;
}

.triage-card-premium-locked {
  @apply bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 opacity-75;
}

/* Grid Responsivo Perfeito */
.triage-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

/* Animações Suaves */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}

.animate-pulse-green {
  animation: pulse-green 2s infinite;
}

/* Responsividade Perfeita */
@media (max-width: 640px) {
  .triage-card {
    @apply h-72;
  }
  
  .triage-grid {
    @apply grid-cols-1 gap-4;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .triage-card {
    @apply h-80;
  }
  
  .triage-grid {
    @apply grid-cols-2 gap-6;
  }
}

@media (min-width: 1025px) {
  .triage-card {
    @apply h-80;
  }
  
  .triage-grid {
    @apply grid-cols-3 gap-6;
  }
}

@media (min-width: 1280px) {
  .triage-grid {
    @apply grid-cols-4 gap-8;
  }
}

/* Scrollbar Customizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {
  background: #00ff00;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00cc00;
}

/* Focus States */
input:focus,
textarea:focus,
select:focus {
  @apply outline-none ring-2 ring-green-500 border-green-500;
}

button:focus {
  @apply outline-none ring-2 ring-green-500;
}

/* Loading States */
.loading {
  @apply animate-pulse bg-gray-700 rounded;
}

/* Error States */
.error {
  @apply border-red-500 bg-red-900/20 text-red-300;
}

/* Success States */
.success {
  @apply border-green-500 bg-green-900/20 text-green-300;
}

/* Modal Overlay */
.modal-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center;
}

.modal-content {
  @apply bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4;
}

/* Badges */
.badge-free {
  @apply inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-300 border border-green-500/30;
}

.badge-premium {
  @apply inline-flex items-center gap-1 rounded-full bg-gray-500/20 px-2 py-1 text-xs text-gray-300 border border-gray-500/30;
}

/* Text Gradients */
.text-gradient-green {
  @apply bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent;
}

/* Shadows */
.shadow-green {
  box-shadow: 0 4px 14px 0 rgba(0, 255, 0, 0.39);
}

.shadow-green-lg {
  box-shadow: 0 10px 25px -3px rgba(0, 255, 0, 0.1), 0 4px 6px -2px rgba(0, 255, 0, 0.05);
}

/* Utilities */
.text-balance {
  text-wrap: balance;
}

/* Print Styles */
@media print {
  body {
    background: white !important;
    color: black !important;
  }
  
  .no-print {
    display: none !important;
  }
}
`;

fs.writeFileSync('src/styles/globals.css', globalCSSContent);
console.log('✅ CSS Global corrigido com paleta preto/branco/verde');

// 2. CORRIGIR CONFIGURAÇÃO TAILWIND
console.log('\n⚙️ CORRIGINDO CONFIGURAÇÃO TAILWIND...\n');

const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Principal: Preto, Branco, Verde
        primary: {
          50: '#f0fff4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00ff00', // Verde principal
          600: '#00cc00',
          700: '#00aa00',
          800: '#008800',
          900: '#006600',
        },
        black: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#000000', // Preto absoluto
        },
        white: {
          50: '#ffffff', // Branco absoluto
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        // Cores específicas do projeto
        alloe: {
          50: '#f0fff4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00ff00',
          600: '#00cc00',
          700: '#00aa00',
          800: '#008800',
          900: '#006600',
        },
        gray: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#000000',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      height: {
        '80': '20rem', // Altura padrão dos cards
        '96': '24rem',
      },
      width: {
        '80': '20rem',
        '96': '24rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-green': 'pulse-green 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 255, 0, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 255, 0, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'green': '0 4px 14px 0 rgba(0, 255, 0, 0.39)',
        'green-lg': '0 10px 25px -3px rgba(0, 255, 0, 0.1), 0 4px 6px -2px rgba(0, 255, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
`;

fs.writeFileSync('tailwind.config.js', tailwindConfigContent);
console.log('✅ Tailwind configurado com paleta otimizada');

// 3. CORRIGIR PÁGINA DE TRIAGENS
console.log('\n🃏 CORRIGINDO PÁGINA DE TRIAGENS...\n');

const triagemIndexContent = `import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { listaTriagens } from '@/forms';

export default function TriagemIndex() {
  const router = useRouter();
  const [openPlan, setOpenPlan] = useState(false);

  const handleTriageClick = (slug: string, isFree: boolean) => {
    if (isFree) {
      router.push(\`/triagem/\${slug}\`);
    } else {
      setOpenPlan(true);
    }
  };

  const handleCheckout = (priceId: string) => {
    router.push(\`/checkout?price=\${priceId}\`);
  };

  return (
    <>
      <Head>
        <title>Triagens | Alloe Health</title>
        <meta name="description" content="Escolha sua triagem de saúde personalizada" />
      </Head>

      <main className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="bg-black border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold text-center text-gradient-green mb-4">
              Escolha sua Triagem
            </h1>
            <p className="text-center text-gray-300 text-lg max-w-3xl mx-auto">
              Comece com nossa triagem gastrointestinal gratuita ou desbloqueie todas as triagens premium. 
              Cada avaliação é personalizada e gera um relatório completo com recomendações específicas.
            </p>
          </div>
        </div>

        {/* Grid de Triagens */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="triage-grid">
            {listaTriagens.map((triagem, index) => (
              <motion.div
                key={triagem.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={\`triage-card \${triagem.isFree ? 'triage-card-free' : 'triage-card-premium'}\`}
                onClick={() => handleTriageClick(triagem.slug, triagem.isFree || false)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTriageClick(triagem.slug, triagem.isFree || false);
                  }
                }}
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{triagem.icon || '🩺'}</span>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {triagem.titulo}
                    </h3>
                  </div>
                  
                  {/* Badge */}
                  <div className="flex-shrink-0">
                    {triagem.isFree ? (
                      <span className="badge-free">
                        🔓 Grátis
                      </span>
                    ) : (
                      <span className="badge-premium">
                        🔒 Premium
                      </span>
                    )}
                  </div>
                </div>

                {/* Descrição */}
                <div className="flex-1 mb-6">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {triagem.descricao || 'Inicie sua triagem agora.'}
                  </p>
                </div>

                {/* Footer do Card */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/70">
                    {triagem.isFree ? 'Começar agora' : 'Clique para desbloquear'}
                  </div>
                  
                  {!triagem.isFree && (
                    <div className="text-xs text-gray-400">
                      R$ 49
                    </div>
                  )}
                </div>

                {/* Overlay para cards premium */}
                {!triagem.isFree && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium">
                      Clique para desbloquear
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal de Plano */}
        {openPlan && (
          <div className="modal-overlay" onClick={() => setOpenPlan(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Desbloquear Todas as Triagens
              </h2>
              
              <p className="text-gray-300 mb-6">
                Acesso completo a todas as triagens premium com relatórios detalhados e planos de ação personalizados.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_ALL_ACCESS || 'price_all_access')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <span>Desbloquear por R$ 49</span>
                </button>

                <button
                  onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_GIFT || 'price_gift')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <span>Presentear por R$ 89</span>
                </button>
              </div>

              <button
                onClick={() => setOpenPlan(false)}
                className="w-full mt-4 text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cancelar
              </button>
            </motion.div>
          </div>
        )}

        {/* Seção de Segurança */}
        <div className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-xl font-semibold text-white">100% Seguro e Confidencial</h3>
            </div>
            <p className="text-center text-gray-300 max-w-2xl mx-auto">
              Seus dados são protegidos com criptografia de ponta a ponta. 
              Todas as informações são mantidas em total confidencialidade.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
`;

fs.writeFileSync('src/pages/triagem/index.tsx', triagemIndexContent);
console.log('✅ Página de triagens corrigida com cards uniformes');

// 4. CORRIGIR PACIENTE INFO CARD
console.log('\n🃏 CORRIGINDO PACIENTE INFO CARD...\n');

const pacienteInfoCardContent = `import React from "react";
import { motion } from "framer-motion";

type Props = { 
  nome: string; 
  idade?: number | null; 
  imc?: number | null; 
  sexo?: string | null;
};

const PacienteInfoCard: React.FC<Props> = ({ nome, idade, imc, sexo }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-md p-8 shadow-green-lg"
  >
    <motion.h3
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-6 flex items-center gap-3 text-2xl font-bold text-green-400"
    >
      <span className="text-3xl animate-float">🩺</span>
      Resumo do Paciente
    </motion.h3>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {[
        { 
          label: "Nome", 
          value: nome || "Não informado", 
          icon: "👤", 
          color: "from-gray-800 to-gray-700",
          textColor: "text-white"
        },
        { 
          label: "Idade", 
          value: idade ? \`\${idade} anos\` : "Não informada", 
          icon: "🎂", 
          color: "from-gray-800 to-gray-700",
          textColor: "text-white"
        },
        { 
          label: "IMC", 
          value: imc ? \`\${imc} kg/m²\` : "Não informado", 
          icon: "⚖️", 
          color: "from-green-600 to-green-700",
          textColor: "text-white"
        },
        { 
          label: "Sexo", 
          value: sexo || "Não informado", 
          icon: "👥", 
          color: "from-gray-800 to-gray-700",
          textColor: "text-white"
        },
      ].map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={\`rounded-xl bg-gradient-to-br \${item.color} backdrop-blur-sm p-6 border border-gray-600 hover:border-green-400/30 transition-all duration-300 hover:shadow-lg\`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl animate-pulse-slow">{item.icon}</span>
            <p className="text-sm font-medium text-gray-300 uppercase tracking-wide">{item.label}</p>
          </div>
          <p className={\`text-xl font-bold \${item.textColor}\`}>{item.value}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

export default PacienteInfoCard;
`;

fs.writeFileSync('src/components/ui/cards/PacienteInfoCard.tsx', pacienteInfoCardContent);
console.log('✅ PacienteInfoCard corrigido com paleta otimizada');

// 5. CRIAR SCRIPT DE TESTE RÁPIDO
console.log('\n⚡ CRIANDO SCRIPT DE TESTE RÁPIDO...\n');

const quickTestScript = `#!/usr/bin/env node

/**
 * ⚡ TESTE RÁPIDO - ALLOE HEALTH
 * Verificação rápida de funcionalidades críticas
 */

const { execSync } = require('child_process');

console.log('⚡ TESTE RÁPIDO - ALLOE HEALTH\\n');

try {
  // 1. Typecheck
  console.log('🔍 Verificando tipos...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript OK');

  // 2. Build
  console.log('🔨 Testando build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build OK');

  // 3. Prisma
  console.log('🗄️ Verificando Prisma...');
  execSync('npx prisma generate', { stdio: 'pipe' });
  console.log('✅ Prisma OK');

  console.log('\\n🎉 TODOS OS TESTES PASSARAM!');
  console.log('🚀 Projeto pronto para deploy!');

} catch (error) {
  console.error('❌ Erro encontrado:', error.message);
  process.exit(1);
}
`;

fs.writeFileSync('scripts/test-quick.js', quickTestScript);
console.log('✅ Script de teste rápido criado');

// 6. ATUALIZAR PACKAGE.JSON COM SCRIPTS
console.log('\n📦 ATUALIZANDO PACKAGE.JSON...\n');

const packageJsonPath = 'package.json';
let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  'test:complete': 'node scripts/test-complete.js',
  'test:visual': 'node scripts/test-visual.js',
  'test:quick': 'node scripts/test-quick.js',
  'fix:visual': 'node scripts/fix-visual.js',
  'optimize:cards': 'node scripts/optimize-cards.js',
  'test:responsive': 'node scripts/test-responsive.js',
  'check:all': 'npm run test:quick && npm run test:visual && npm run test:complete'
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Scripts de teste adicionados ao package.json');

console.log('\n🎉 CORREÇÕES AUTOMÁTICAS CONCLUÍDAS!');
console.log('\n📋 RESUMO DAS CORREÇÕES:');
console.log('✅ CSS Global com paleta preto/branco/verde');
console.log('✅ Tailwind configurado com cores otimizadas');
console.log('✅ Cards de triagem com tamanhos uniformes');
console.log('✅ PacienteInfoCard com paleta consistente');
console.log('✅ Scripts de teste criados');
console.log('✅ Package.json atualizado');

console.log('\n🚀 PRÓXIMOS PASSOS:');
console.log('1. npm run test:quick');
console.log('2. npm run test:visual');
console.log('3. npm run build');
console.log('4. npm run dev');

process.exit(0);
