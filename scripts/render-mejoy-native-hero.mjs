import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'design', 'mejoy-native-premium-hero-home.html');
const outputPath = path.join(root, 'public', 'images', 'mejoy-native-premium-hero-home.png');

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1400, deviceScaleFactor: 2 });

  await page.goto(`file://${sourcePath}`, { waitUntil: 'load' });
  await page.screenshot({
    path: outputPath,
    type: 'png',
  });

  console.log(outputPath);
} finally {
  await browser.close();
}
