import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const artifactDir = path.join(process.cwd(), 'artifacts', 'mejoy-native-release-review');
const manifestPath = path.join(artifactDir, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  throw new Error(`manifest.json not found at ${manifestPath}`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const { chromium } = require('playwright');

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 560, height: 1800 },
    deviceScaleFactor: 2,
  });

  for (const screen of manifest.screens) {
    const htmlPath = path.join(artifactDir, screen.htmlFile);
    const pngPath = path.join(artifactDir, screen.pngFile);

    fs.mkdirSync(path.dirname(pngPath), { recursive: true });

    await page.goto(`file://${htmlPath}`, { waitUntil: 'load' });
    await page.locator('.canvas').screenshot({
      path: pngPath,
      type: 'png',
    });

    console.log(`captured ${screen.screenId} -> ${screen.pngFile}`);
  }
} finally {
  await browser.close();
}
