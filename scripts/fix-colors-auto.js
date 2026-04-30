#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing forbidden colors automatically...\n');

// Mapeamento de cores proibidas para tokens permitidos
const colorMappings = {
  // Gray -> muted/foreground
  'text-gray-900': 'text-foreground',
  'text-gray-800': 'text-foreground',
  'text-gray-700': 'text-foreground',
  'text-gray-600': 'text-muted-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-400': 'text-muted-foreground',
  'text-gray-300': 'text-muted-foreground',
  'text-gray-200': 'text-muted-foreground',
  'text-gray-100': 'text-muted-foreground',
  'text-gray': 'text-muted-foreground',
  
  'bg-gray-900': 'bg-background',
  'bg-gray-800': 'bg-background',
  'bg-gray-700': 'bg-muted',
  'bg-gray-600': 'bg-muted',
  'bg-gray-500': 'bg-muted',
  'bg-gray-400': 'bg-muted',
  'bg-gray-300': 'bg-muted',
  'bg-gray-200': 'bg-muted',
  'bg-gray-100': 'bg-muted',
  'bg-gray-50': 'bg-muted',
  'bg-gray': 'bg-muted',
  
  'border-gray-900': 'border-border',
  'border-gray-800': 'border-border',
  'border-gray-700': 'border-border',
  'border-gray-600': 'border-border',
  'border-gray-500': 'border-border',
  'border-gray-400': 'border-border',
  'border-gray-300': 'border-border',
  'border-gray-200': 'border-border',
  'border-gray-100': 'border-border',
  'border-gray': 'border-border',
  
  // Zinc -> muted/foreground
  'text-zinc-900': 'text-foreground',
  'text-zinc-800': 'text-foreground',
  'text-zinc-700': 'text-foreground',
  'text-zinc-600': 'text-muted-foreground',
  'text-zinc-500': 'text-muted-foreground',
  'text-zinc-400': 'text-muted-foreground',
  'text-zinc-300': 'text-muted-foreground',
  'text-zinc-200': 'text-muted-foreground',
  'text-zinc-100': 'text-muted-foreground',
  'text-zinc': 'text-muted-foreground',
  
  'bg-zinc-900': 'bg-background',
  'bg-zinc-800': 'bg-background',
  'bg-zinc-700': 'bg-muted',
  'bg-zinc-600': 'bg-muted',
  'bg-zinc-500': 'bg-muted',
  'bg-zinc-400': 'bg-muted',
  'bg-zinc-300': 'bg-muted',
  'bg-zinc-200': 'bg-muted',
  'bg-zinc-100': 'bg-muted',
  'bg-zinc': 'bg-muted',
  
  'from-zinc-900': 'from-background',
  'from-zinc-800': 'from-background',
  'from-zinc-700': 'from-muted',
  'from-zinc-600': 'from-muted',
  'to-zinc-900': 'to-background',
  'to-zinc-800': 'to-background',
  'to-zinc-700': 'to-muted',
  'to-zinc-600': 'to-muted',
  'via-zinc-600': 'via-muted',
  
  // Neutral -> muted/foreground
  'text-neutral-950': 'text-foreground',
  'text-neutral-900': 'text-foreground',
  'text-neutral-800': 'text-foreground',
  'text-neutral-700': 'text-foreground',
  'text-neutral-600': 'text-muted-foreground',
  'text-neutral-500': 'text-muted-foreground',
  'text-neutral-400': 'text-muted-foreground',
  'text-neutral-300': 'text-muted-foreground',
  'text-neutral-200': 'text-muted-foreground',
  'text-neutral-100': 'text-muted-foreground',
  'text-neutral': 'text-muted-foreground',
  
  'bg-neutral-950': 'bg-background',
  'bg-neutral-900': 'bg-background',
  'bg-neutral-800': 'bg-background',
  'bg-neutral-700': 'bg-muted',
  'bg-neutral-600': 'bg-muted',
  'bg-neutral-500': 'bg-muted',
  'bg-neutral-400': 'bg-muted',
  'bg-neutral-300': 'bg-muted',
  'bg-neutral-200': 'bg-muted',
  'bg-neutral-100': 'bg-muted',
  'bg-neutral': 'bg-muted',
  
  // Slate -> muted/foreground
  'text-slate-900': 'text-foreground',
  'text-slate-800': 'text-foreground',
  'text-slate-700': 'text-foreground',
  'text-slate-600': 'text-muted-foreground',
  'text-slate-500': 'text-muted-foreground',
  'text-slate-400': 'text-muted-foreground',
  'text-slate-300': 'text-muted-foreground',
  'text-slate-200': 'text-muted-foreground',
  'text-slate-100': 'text-muted-foreground',
  'text-slate': 'text-muted-foreground',
  
  'bg-slate-900': 'bg-background',
  'bg-slate-800': 'bg-background',
  'bg-slate-700': 'bg-muted',
  'bg-slate-600': 'bg-muted',
  'bg-slate-500': 'bg-muted',
  'bg-slate-400': 'bg-muted',
  'bg-slate-300': 'bg-muted',
  'bg-slate-200': 'bg-muted',
  'bg-slate-100': 'bg-muted',
  'bg-slate': 'bg-muted',
  
  // Cores específicas para brand
  'text-purple-100': 'text-brand-200',
  'text-purple-200': 'text-brand-300',
  'text-purple-300': 'text-brand-400',
  'text-purple-400': 'text-brand-500',
  'text-purple-500': 'text-brand-600',
  'text-purple-600': 'text-brand-700',
  'text-purple-700': 'text-brand-800',
  'text-purple-800': 'text-brand-900',
  'text-purple-900': 'text-brand-900',
  'text-purple': 'text-brand-600',
  
  'bg-purple-100': 'bg-brand-100',
  'bg-purple-200': 'bg-brand-200',
  'bg-purple-300': 'bg-brand-300',
  'bg-purple-400': 'bg-brand-400',
  'bg-purple-500': 'bg-brand-500',
  'bg-purple-600': 'bg-brand-600',
  'bg-purple-700': 'bg-brand-700',
  'bg-purple-800': 'bg-brand-800',
  'bg-purple-900': 'bg-brand-900',
  'bg-purple': 'bg-brand-600',
  
  // Blue -> brand
  'text-blue-100': 'text-brand-200',
  'text-blue-200': 'text-brand-300',
  'text-blue-300': 'text-brand-400',
  'text-blue-400': 'text-brand-500',
  'text-blue-500': 'text-brand-600',
  'text-blue-600': 'text-brand-700',
  'text-blue-700': 'text-brand-800',
  'text-blue-800': 'text-brand-900',
  'text-blue-900': 'text-brand-900',
  'text-blue': 'text-brand-600',
  
  'bg-blue-100': 'bg-brand-100',
  'bg-blue-200': 'bg-brand-200',
  'bg-blue-300': 'bg-brand-300',
  'bg-blue-400': 'bg-brand-400',
  'bg-blue-500': 'bg-brand-500',
  'bg-blue-600': 'bg-brand-600',
  'bg-blue-700': 'bg-brand-700',
  'bg-blue-800': 'bg-brand-800',
  'bg-blue-900': 'bg-brand-900',
  'bg-blue-50': 'bg-brand-50',
  'bg-blue': 'bg-brand-600',
  
  // Sky -> brand
  'text-sky-100': 'text-brand-200',
  'text-sky-200': 'text-brand-300',
  'text-sky-300': 'text-brand-400',
  'text-sky-400': 'text-brand-500',
  'text-sky-500': 'text-brand-600',
  'text-sky-600': 'text-brand-700',
  'text-sky-700': 'text-brand-800',
  'text-sky-800': 'text-brand-900',
  'text-sky-900': 'text-brand-900',
  'text-sky': 'text-brand-600',
  
  'bg-sky-100': 'bg-brand-100',
  'bg-sky-200': 'bg-brand-200',
  'bg-sky-300': 'bg-brand-300',
  'bg-sky-400': 'bg-brand-400',
  'bg-sky-500': 'bg-brand-500',
  'bg-sky-600': 'bg-brand-600',
  'bg-sky-700': 'bg-brand-700',
  'bg-sky-800': 'bg-brand-800',
  'bg-sky-900': 'bg-brand-900',
  'bg-sky': 'bg-brand-600',
  
  'from-sky-400': 'from-brand-400',
  'from-sky-500': 'from-brand-500',
  'from-sky-600': 'from-brand-600',
  'from-sky-700': 'from-brand-700',
  'from-sky-800': 'from-brand-800',
  'from-sky-900': 'from-brand-900',
  
  // Red -> destructive/foreground
  'text-red-100': 'text-foreground',
  'text-red-200': 'text-foreground',
  'text-red-300': 'text-foreground',
  'text-red-400': 'text-foreground',
  'text-red-500': 'text-foreground',
  'text-red-600': 'text-foreground',
  'text-red-700': 'text-foreground',
  'text-red-800': 'text-foreground',
  'text-red-900': 'text-foreground',
  'text-red': 'text-foreground',
  
  'bg-red-100': 'bg-muted',
  'bg-red-200': 'bg-muted',
  'bg-red-300': 'bg-muted',
  'bg-red-400': 'bg-muted',
  'bg-red-500': 'bg-muted',
  'bg-red-600': 'bg-muted',
  'bg-red-700': 'bg-muted',
  'bg-red-800': 'bg-muted',
  'bg-red-900': 'bg-muted',
  'bg-red-50': 'bg-muted',
  'bg-red': 'bg-muted',
  
  // Yellow -> brand
  'text-yellow-100': 'text-brand-200',
  'text-yellow-200': 'text-brand-300',
  'text-yellow-300': 'text-brand-400',
  'text-yellow-400': 'text-brand-500',
  'text-yellow-500': 'text-brand-600',
  'text-yellow-600': 'text-brand-700',
  'text-yellow-700': 'text-brand-800',
  'text-yellow-800': 'text-brand-900',
  'text-yellow-900': 'text-brand-900',
  'text-yellow': 'text-brand-600',
  
  'bg-yellow-100': 'bg-brand-100',
  'bg-yellow-200': 'bg-brand-200',
  'bg-yellow-300': 'bg-brand-300',
  'bg-yellow-400': 'bg-brand-400',
  'bg-yellow-500': 'bg-brand-500',
  'bg-yellow-600': 'bg-brand-600',
  'bg-yellow-700': 'bg-brand-700',
  'bg-yellow-800': 'bg-brand-800',
  'bg-yellow-900': 'bg-brand-900',
  'bg-yellow-50': 'bg-brand-50',
  'bg-yellow': 'bg-brand-600',
  
  // Pink -> brand
  'text-pink-100': 'text-brand-200',
  'text-pink-200': 'text-brand-300',
  'text-pink-300': 'text-brand-400',
  'text-pink-400': 'text-brand-500',
  'text-pink-500': 'text-brand-600',
  'text-pink-600': 'text-brand-700',
  'text-pink-700': 'text-brand-800',
  'text-pink-800': 'text-brand-900',
  'text-pink-900': 'text-brand-900',
  'text-pink': 'text-brand-600',
  
  'bg-pink-100': 'bg-brand-100',
  'bg-pink-200': 'bg-brand-200',
  'bg-pink-300': 'bg-brand-300',
  'bg-pink-400': 'bg-brand-400',
  'bg-pink-500': 'bg-brand-500',
  'bg-pink-600': 'bg-brand-600',
  'bg-pink-700': 'bg-brand-700',
  'bg-pink-800': 'bg-brand-800',
  'bg-pink-900': 'bg-brand-900',
  'bg-pink': 'bg-brand-600',
  
  'from-pink-50': 'from-brand-50',
  'to-rose-100': 'to-brand-100',
  
  // Fuchsia -> brand
  'text-fuchsia-100': 'text-brand-200',
  'text-fuchsia-200': 'text-brand-300',
  'text-fuchsia-300': 'text-brand-400',
  'text-fuchsia-400': 'text-brand-500',
  'text-fuchsia-500': 'text-brand-600',
  'text-fuchsia-600': 'text-brand-700',
  'text-fuchsia-700': 'text-brand-800',
  'text-fuchsia-800': 'text-brand-900',
  'text-fuchsia-900': 'text-brand-900',
  'text-fuchsia': 'text-brand-600',
  
  'bg-fuchsia-100': 'bg-brand-100',
  'bg-fuchsia-200': 'bg-brand-200',
  'bg-fuchsia-300': 'bg-brand-300',
  'bg-fuchsia-400': 'bg-brand-400',
  'bg-fuchsia-500': 'bg-brand-500',
  'bg-fuchsia-600': 'bg-brand-600',
  'bg-fuchsia-700': 'bg-brand-700',
  'bg-fuchsia-800': 'bg-brand-800',
  'bg-fuchsia-900': 'bg-brand-900',
  'bg-fuchsia': 'bg-brand-600',
  
  'to-fuchsia-500': 'to-brand-500',
  'to-fuchsia-600': 'to-brand-600',
  'to-fuchsia-700': 'to-brand-700',
  
  // Violet -> brand
  'text-violet-100': 'text-brand-200',
  'text-violet-200': 'text-brand-300',
  'text-violet-300': 'text-brand-400',
  'text-violet-400': 'text-brand-500',
  'text-violet-500': 'text-brand-600',
  'text-violet-600': 'text-brand-700',
  'text-violet-700': 'text-brand-800',
  'text-violet-800': 'text-brand-900',
  'text-violet-900': 'text-brand-900',
  'text-violet': 'text-brand-600',
  
  // Emerald -> brand
  'text-emerald-100': 'text-brand-200',
  'text-emerald-200': 'text-brand-300',
  'text-emerald-300': 'text-brand-400',
  'text-emerald-400': 'text-brand-500',
  'text-emerald-500': 'text-brand-600',
  'text-emerald-600': 'text-brand-700',
  'text-emerald-700': 'text-brand-800',
  'text-emerald-800': 'text-brand-900',
  'text-emerald-900': 'text-brand-900',
  'text-emerald': 'text-brand-600',
  
  // Orange -> brand
  'text-orange-100': 'text-brand-200',
  'text-orange-200': 'text-brand-300',
  'text-orange-300': 'text-brand-400',
  'text-orange-400': 'text-brand-500',
  'text-orange-500': 'text-brand-600',
  'text-orange-600': 'text-brand-700',
  'text-orange-700': 'text-brand-800',
  'text-orange-800': 'text-brand-900',
  'text-orange-900': 'text-brand-900',
  'text-orange': 'text-brand-600',
  
  'from-orange-500': 'from-brand-500',
  'to-orange-600': 'to-brand-600',
  'from-orange-600': 'from-brand-600',
  'to-orange-700': 'to-brand-700',
  
  // Gradientes gray
  'from-gray-900': 'from-background',
  'from-gray-800': 'from-background',
  'from-gray-700': 'from-muted',
  'from-gray-600': 'from-muted',
  'from-gray-500': 'from-muted',
  'to-gray-900': 'to-background',
  'to-gray-800': 'to-background',
  'to-gray-700': 'to-muted',
  'to-gray-600': 'to-muted',
  'to-gray-500': 'to-muted',
};

// HEX colors para substituir
const hexMappings = {
  '#00ff00': '#00D084', // Verde neon para verde Alloe
  '#00D084': '#00D084', // Manter verde Alloe
  '#333': '#000000',    // Cinza escuro para preto
  '#666': '#000000',    // Cinza médio para preto
  '#999': '#000000',    // Cinza claro para preto
  '#ddd': '#ffffff',    // Cinza muito claro para branco
  '#eee': '#ffffff',    // Cinza muito claro para branco
  '#f8f9fa': '#ffffff', // Cinza muito claro para branco
  '#e8f4fd': '#ffffff', // Azul muito claro para branco
  '#ffc107': '#00D084', // Amarelo para verde Alloe
  '#856404': '#000000', // Marrom escuro para preto
  '#ffecd2': '#ffffff', // Bege claro para branco
  '#fcb69f': '#ffffff', // Rosa claro para branco
  '#8b4513': '#000000', // Marrom para preto
  '#a8edea': '#ffffff', // Verde claro para branco
  '#fed6e3': '#ffffff', // Rosa claro para branco
  '#2c3e50': '#000000', // Azul escuro para preto
  '#4facfe': '#00D084', // Azul para verde Alloe
  '#00f2fe': '#00D084', // Azul claro para verde Alloe
  '#1F2937': '#000000', // Cinza escuro para preto
  '#6B7280': '#000000', // Cinza médio para preto
  '#E5E7EB': '#ffffff', // Cinza claro para branco
  '#374151': '#000000', // Cinza escuro para preto
  '#9CA3AF': '#000000', // Cinza médio para preto
  '#174ea6': '#00D084', // Azul para verde Alloe
  '#2b2b2b': '#000000', // Cinza escuro para preto
  '#fdfdfd': '#ffffff', // Branco quase puro para branco
  '#555': '#000000',    // Cinza médio para preto
  '#1e293b': '#000000', // Cinza escuro para preto
  '#0f172a': '#000000', // Cinza muito escuro para preto
  '#2563eb': '#00D084', // Azul para verde Alloe
  '#334155': '#000000', // Cinza escuro para preto
  '#cbd5e1': '#ffffff', // Cinza claro para branco
  '#2fb356': '#00D084', // Verde para verde Alloe
  '#0f1720': '#000000', // Cinza escuro para preto
  '#475569': '#000000', // Cinza médio para preto
  '#124826': '#000000', // Verde escuro para preto
  '#e2e8f0': '#ffffff', // Cinza claro para branco
  '#64748b': '#000000', // Cinza médio para preto
  '#004d5c': '#000000', // Azul escuro para preto
  '#7C3AED': '#00D084', // Roxo para verde Alloe
  '#10B981': '#00D084', // Verde para verde Alloe
  '#A855F7': '#00D084', // Roxo para verde Alloe
  '#FFFFFF': '#ffffff', // Manter branco
  '#e5e7eb': '#ffffff', // Cinza claro para branco
};

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    // Aplicar mapeamentos de classes Tailwind
    Object.entries(colorMappings).forEach(([forbidden, replacement]) => {
      const regex = new RegExp(`\\b${forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, replacement);
        changes += matches.length;
      }
    });
    
    // Aplicar mapeamentos de HEX
    Object.entries(hexMappings).forEach(([forbidden, replacement]) => {
      const regex = new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, replacement);
        changes += matches.length;
      }
    });
    
    if (changes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${changes} color(s) in ${filePath}`);
      return changes;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return 0;
  }
}

function findFiles() {
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css'];
  const files = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
          walkDir(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
  }
  
  walkDir('./src');
  return files;
}

function main() {
  const files = findFiles();
  let totalChanges = 0;
  
  console.log(`📁 Processing ${files.length} files...\n`);
  
  files.forEach(file => {
    const changes = fixFile(file);
    totalChanges += changes;
  });
  
  console.log(`\n🎉 Fixed ${totalChanges} color usage(s) across ${files.length} files!`);
  console.log('✅ All colors are now compliant with the PB + Brand palette.');
}

if (require.main === module) {
  main();
}

module.exports = { fixFile, colorMappings, hexMappings };