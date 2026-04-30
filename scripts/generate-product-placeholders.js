#!/usr/bin/env node

/**
 * Script para gerar placeholders SVG profissionais para produtos ZapFarm
 * 
 * Uso: node scripts/generate-product-placeholders.js
 */

const fs = require('fs');
const path = require('path');

const products = [
  {
    slug: 'metaboslim',
    name: 'MetaboSlim',
    subtitle: 'Emagrecimento Metabólico Integrativo',
    color: '#10b981', // teal green
    accent: '#f97316' // orange
  },
  {
    slug: 'capilmax',
    name: 'CapilMax',
    subtitle: 'Calvície & Saúde Capilar',
    color: '#4c51bf', // indigo
    accent: '#60a5fa' // blue
  },
  {
    slug: 'sonozen',
    name: 'SonoZen',
    subtitle: 'Sono Profundo & Ansiedade Noturna',
    color: '#2563eb', // blue
    accent: '#6366f1' // indigo
  },
  {
    slug: 'zenday',
    name: 'ZenDay',
    subtitle: 'Ansiedade & Estresse Diurno',
    color: '#059669', // emerald
    accent: '#fbbf24' // yellow
  },
  {
    slug: 'florabalance',
    name: 'FloraBalance',
    subtitle: 'Intestino & Microbiota Saudável',
    color: '#10b981', // green
    accent: '#34d399' // emerald
  },
  {
    slug: 'hepadetox',
    name: 'HepaDetox',
    subtitle: 'Fígado & Detox Metabólico',
    color: '#f59e0b', // amber
    accent: '#fbbf24' // yellow
  },
  {
    slug: 'vigormax',
    name: 'VigorMax',
    subtitle: 'Libido & Testosterona Masculina',
    color: '#dc2626', // red
    accent: '#1f2937' // dark gray
  },
  {
    slug: 'fembalance-360',
    name: 'FemBalance 360',
    subtitle: 'Menopausa & TPM 360',
    color: '#ec4899', // pink
    accent: '#fbbf24' // rose gold
  },
  {
    slug: 'articflex',
    name: 'ArticFlex',
    subtitle: 'Articulações & Coluna Saudável',
    color: '#475569', // slate
    accent: '#f97316' // orange
  },
  {
    slug: 'imuno360',
    name: 'Imuno360',
    subtitle: 'Imunidade 360 & Energia',
    color: '#06b6d4', // cyan
    accent: '#fbbf24' // yellow
  }
];

function generateSVG(product) {
  const { name, subtitle, color, accent } = product;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${product.slug}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="bottle-${product.slug}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fafafa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow-${product.slug}">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bg-${product.slug})"/>
  
  <!-- Shadow -->
  <ellipse cx="512" cy="900" rx="280" ry="40" fill="#d0d0d0" opacity="0.4"/>
  
  <!-- Bottle Container -->
  <g transform="translate(512, 500)" filter="url(#shadow-${product.slug})">
    <!-- Bottle body -->
    <rect x="-130" y="-280" width="260" height="420" rx="25" fill="url(#bottle-${product.slug})" stroke="#d0d0d0" stroke-width="2"/>
    
    <!-- Bottle cap -->
    <rect x="-90" y="-330" width="180" height="50" rx="10" fill="#2d3748" stroke="#1a202c" stroke-width="2"/>
    <rect x="-85" y="-325" width="170" height="5" rx="2" fill="#4a5568"/>
    
    <!-- Label area with rounded corners -->
    <rect x="-110" y="-200" width="220" height="280" rx="15" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>
    
    <!-- ZapFarm logo area -->
    <text x="0" y="-160" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${color}" text-anchor="middle" letter-spacing="1">ZapFarm</text>
    
    <!-- Product name -->
    <text x="0" y="-100" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1a202c" text-anchor="middle" letter-spacing="-1">${name}</text>
    
    <!-- Subtitle lines -->
    <text x="0" y="-50" font-family="Arial, sans-serif" font-size="16" fill="#4a5568" text-anchor="middle">${subtitle.split(' & ')[0]}</text>
    ${subtitle.includes(' & ') ? `<text x="0" y="-28" font-family="Arial, sans-serif" font-size="16" fill="#4a5568" text-anchor="middle">${subtitle.split(' & ')[1]}</text>` : ''}
    
    <!-- Accent decorative line -->
    <line x1="-95" y1="-10" x2="95" y2="-10" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-95" y1="0" x2="95" y2="0" stroke="${accent}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    
    <!-- Bottom info -->
    <text x="0" y="35" font-family="Arial, sans-serif" font-size="13" fill="#718096" text-anchor="middle" font-weight="600">30 dias de uso</text>
    <text x="0" y="55" font-family="Arial, sans-serif" font-size="11" fill="#a0aec0" text-anchor="middle">Uso sob orientação profissional</text>
    
    <!-- Small decorative element -->
    <circle cx="-80" cy="20" r="3" fill="${color}" opacity="0.5"/>
    <circle cx="80" cy="20" r="3" fill="${accent}" opacity="0.5"/>
  </g>
</svg>`;
}

// Criar diretório se não existir
const outputDir = path.join(__dirname, '..', 'public', 'products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Gerar SVG para cada produto
console.log('🎨 Gerando placeholders SVG para produtos ZapFarm...\n');

products.forEach(product => {
  const svg = generateSVG(product);
  const filename = `${product.slug}.svg`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, svg, 'utf8');
  console.log(`✅ Criado: ${filename}`);
});

console.log(`\n✨ ${products.length} placeholders SVG criados em ${outputDir}`);
console.log('\n💡 Próximos passos:');
console.log('   1. Os SVGs podem ser usados diretamente (Next.js suporta SVG)');
console.log('   2. Para converter para PNG: use ferramentas online ou ImageMagick');
console.log('   3. Para imagens reais: use os prompts fornecidos em DALL-E, Midjourney ou Leonardo.ai');
console.log('\n📝 Para usar SVGs, atualize os caminhos em products.ts de .png para .svg');

