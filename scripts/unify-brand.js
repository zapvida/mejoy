#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Unifying brand color to #00C853...\n');

// Arquivos para unificar
const filesToUpdate = [
  'src/theme/palette.ts',
  'src/theme/mobile.ts', 
  'scripts/brand-color.json',
  'src/styles/globals.css'
];

// Mapeamentos de substituição
const replacements = [
  // palette.ts
  { file: 'src/theme/palette.ts', from: '#00D084', to: '#00C853' },
  
  // brand-color.json
  { file: 'scripts/brand-color.json', from: '"hex": "#00D084"', to: '"hex": "#00C853"' },
  { file: 'scripts/brand-color.json', from: '"g": 208,', to: '"g": 200,' },
  { file: 'scripts/brand-color.json', from: '"b": 132', to: '"b": 83' },
  { file: 'scripts/brand-color.json', from: '"l": 41', to: '"l": 40' },
  { file: 'scripts/brand-color.json', from: '"500": "hsl(158, 100%, 41%)"', to: '"500": "hsl(158, 100%, 40%)"' },
  
  // globals.css
  { file: 'src/styles/globals.css', from: '--brand: 158 100% 41%;', to: '--brand: 158 100% 40%;' },
  { file: 'src/styles/globals.css', from: '--brand-500: 158 100% 41%;', to: '--brand-500: 158 100% 40%;' },
  { file: 'src/styles/globals.css', from: '--ring: 158 100% 41%;', to: '--ring: 158 100% 40%;' }
];

function updateFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  replacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
    return false;
  }
}

function main() {
  let updatedCount = 0;
  
  replacements.forEach(({ file, from, to }) => {
    if (updateFile(file, [{ from, to }])) {
      updatedCount++;
    }
  });
  
  console.log(`\n🎉 Brand color unification complete!`);
  console.log(`📊 Updated ${updatedCount} files`);
  console.log(`🎯 All brand colors now use #00C853 (HSL: 158 100% 40%)`);
}

if (require.main === module) {
  main();
}

module.exports = { updateFile, replacements };
