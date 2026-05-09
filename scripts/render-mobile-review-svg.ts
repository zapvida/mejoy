import fs from 'node:fs';
import path from 'node:path';

import { reviewScreenDefinitions } from '../apps/mobile/src/review/screen-definitions';

const artifactDir = path.join(process.cwd(), 'artifacts', 'mejoy-native-release-review');
const screenshotsDir = path.join(artifactDir, 'screenshots', 'iphone');

const WIDTH = 860;
const PHONE_WIDTH = 500;
const PHONE_X = (WIDTH - PHONE_WIDTH) / 2;
const SCREEN_X = PHONE_X + 18;
const SCREEN_WIDTH = PHONE_WIDTH - 36;

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

fs.rmSync(screenshotsDir, { recursive: true, force: true });

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(text: string, limit: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > limit) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function renderTextBlock(params: {
  x: number;
  y: number;
  text: string;
  size: number;
  fill: string;
  weight?: number;
  lineHeight?: number;
  uppercase?: boolean;
  letterSpacing?: number;
  limit?: number;
}) {
  const lines = wrapText(params.uppercase ? params.text.toUpperCase() : params.text, params.limit ?? 34);
  const lineHeight = params.lineHeight ?? params.size * 1.4;
  return `
    <text x="${params.x}" y="${params.y}" fill="${params.fill}" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif" font-size="${params.size}" font-weight="${params.weight ?? 500}" letter-spacing="${params.letterSpacing ?? 0}">
      ${lines
        .map(
          (line, index) =>
            `<tspan x="${params.x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
        )
        .join('')}
    </text>
  `;
}

function badgeFill(tone: string) {
  if (tone === 'good') return { bg: '#DDF5E7', fg: '#106F4A' };
  if (tone === 'attention') return { bg: '#FEEFD7', fg: '#88541A' };
  if (tone === 'high') return { bg: '#FADDDD', fg: '#9C3030' };
  return { bg: '#E6ECE9', fg: '#50645D' };
}

function renderBadge(label: string, tone: string, x: number, y: number) {
  const colors = badgeFill(tone);
  const width = Math.max(110, label.length * 8.3 + 24);
  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="34" rx="17" fill="${colors.bg}" />
      <text x="${x + 14}" y="${y + 22}" fill="${colors.fg}" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif" font-size="13" font-weight="700">${escapeXml(label)}</text>
    </g>
  `;
}

function renderMetric(metric: { label: string; value: string; caption: string; tone?: string }, x: number, y: number) {
  const background = metric.tone === 'brand' ? '#1A4E3D' : metric.tone === 'accent' ? '#4E351E' : '#22312C';
  return `
    <g>
      <rect x="${x}" y="${y}" width="140" height="110" rx="22" fill="${background}" stroke="rgba(255,255,255,0.08)" />
      ${renderTextBlock({ x: x + 16, y: y + 24, text: metric.label, size: 11, fill: '#D7E7DF', weight: 700, uppercase: true, letterSpacing: 0.8, limit: 14 })}
      ${renderTextBlock({ x: x + 16, y: y + 54, text: metric.value, size: 28, fill: '#FFFFFF', weight: 700, limit: 8 })}
      ${renderTextBlock({ x: x + 16, y: y + 82, text: metric.caption, size: 12, fill: '#D7E7DF', lineHeight: 16, limit: 18 })}
    </g>
  `;
}

function renderAction(item: { eyebrow: string; title: string; description: string; caption?: string; tone?: string }, x: number, y: number) {
  const background = item.tone === 'brand' ? '#DEF3E8' : item.tone === 'accent' ? '#FFF0DE' : '#FFFFFF';
  const border = item.tone === 'brand' ? '#D4ECDD' : item.tone === 'accent' ? '#F8DFBE' : '#E4E8E5';
  const accent = item.tone === 'accent' ? '#4E351E' : '#0F6F4B';
  const titleLines = wrapText(item.title, 28);
  const descriptionLines = wrapText(item.description, 46);
  const height = 92 + titleLines.length * 14 + descriptionLines.length * 18;
  return {
    svg: `
      <g>
        <rect x="${x}" y="${y}" width="${SCREEN_WIDTH - 52}" height="${height}" rx="24" fill="${background}" stroke="${border}" />
        ${renderTextBlock({ x: x + 18, y: y + 24, text: item.eyebrow, size: 11, fill: accent, weight: 700, uppercase: true, letterSpacing: 0.8, limit: 24 })}
        ${renderTextBlock({ x: x + 18, y: y + 52, text: item.title, size: 24, fill: '#0C1A16', weight: 700, lineHeight: 28, limit: 28 })}
        ${renderTextBlock({ x: x + 18, y: y + 86 + Math.max(0, titleLines.length - 1) * 28, text: item.description, size: 15, fill: '#263631', lineHeight: 22, limit: 46 })}
        <text x="${x + 18}" y="${y + height - 18}" fill="${accent}" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif" font-size="13" font-weight="700">${escapeXml(item.caption || 'Abrir')}</text>
        <text x="${x + SCREEN_WIDTH - 70}" y="${y + height - 18}" fill="${accent}" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif" font-size="18" font-weight="700">→</text>
      </g>
    `,
    height,
  };
}

function renderTimeline(item: { title: string; subtitle: string; meta?: string; tone?: string }, x: number, y: number) {
  const titleLines = wrapText(item.title, 34);
  const subtitleLines = wrapText(item.subtitle, 48);
  const height = 68 + titleLines.length * 12 + subtitleLines.length * 17;
  const dotColor = item.tone === 'success' ? '#157347' : item.tone === 'warning' ? '#F0A04B' : '#15875F';

  return {
    svg: `
      <g>
        <rect x="${x}" y="${y}" width="${SCREEN_WIDTH - 52}" height="${height}" rx="20" fill="#F7F6F2" />
        <circle cx="${x + 18}" cy="${y + 22}" r="5" fill="${dotColor}" />
        ${renderTextBlock({ x: x + 34, y: y + 24, text: item.title, size: 18, fill: '#0C1A16', weight: 700, lineHeight: 22, limit: 34 })}
        ${item.meta ? `<text x="${x + SCREEN_WIDTH - 160}" y="${y + 24}" fill="#537067" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif" font-size="12">${escapeXml(item.meta)}</text>` : ''}
        ${renderTextBlock({ x: x + 34, y: y + 52 + Math.max(0, titleLines.length - 1) * 22, text: item.subtitle, size: 14, fill: '#6F847D', lineHeight: 20, limit: 48 })}
      </g>
    `,
    height,
  };
}

function renderScreen(screen: (typeof reviewScreenDefinitions)[number]) {
  let currentY = 118;
  const parts: string[] = [];

  parts.push(`<rect x="0" y="0" width="${WIDTH}" height="2400" fill="#F5F1EA" />`);
  parts.push(`<circle cx="110" cy="120" r="140" fill="rgba(21,135,95,0.08)" />`);
  parts.push(`<circle cx="720" cy="1820" r="180" fill="rgba(240,160,75,0.10)" />`);
  parts.push(`<rect x="${PHONE_X}" y="34" width="${PHONE_WIDTH}" height="2250" rx="52" fill="#141A1B" />`);
  parts.push(`<rect x="${SCREEN_X}" y="52" width="${SCREEN_WIDTH}" height="2214" rx="38" fill="#F6F5F0" />`);
  parts.push(`<rect x="${(WIDTH - 160) / 2}" y="74" width="160" height="36" rx="18" fill="#0F1012" />`);

  const heroHeight = screen.metrics?.length ? 320 : 236;
  parts.push(`<rect x="${SCREEN_X + 18}" y="${currentY}" width="${SCREEN_WIDTH - 36}" height="${heroHeight}" rx="28" fill="#13231E" />`);
  parts.push(`<circle cx="${SCREEN_X + SCREEN_WIDTH - 80}" cy="${currentY + 48}" r="64" fill="rgba(240,160,75,0.12)" />`);
  parts.push(`<circle cx="${SCREEN_X + 80}" cy="${currentY + heroHeight - 20}" r="56" fill="rgba(221,239,231,0.08)" />`);
  parts.push(renderTextBlock({ x: SCREEN_X + 42, y: currentY + 34, text: screen.eyebrow, size: 11, fill: '#CFE8DC', weight: 700, uppercase: true, letterSpacing: 0.8, limit: 28 }));
  parts.push(renderTextBlock({ x: SCREEN_X + 42, y: currentY + 80, text: screen.title, size: 40, fill: '#FFFFFF', weight: 700, lineHeight: 42, limit: 17 }));
  parts.push(renderTextBlock({ x: SCREEN_X + 42, y: currentY + 160, text: screen.summary, size: 16, fill: '#D7E7DF', lineHeight: 24, limit: 39 }));
  if (screen.badge) {
    parts.push(renderBadge(screen.badge.label, screen.badge.tone, SCREEN_X + SCREEN_WIDTH - 180, currentY + 34));
  }
  if (screen.metrics?.length) {
    const metricY = currentY + 210;
    screen.metrics.forEach((metric, index) => {
      parts.push(renderMetric(metric, SCREEN_X + 34 + index * 148, metricY));
    });
  }

  currentY += heroHeight + 18;

  for (const section of screen.sections) {
    let sectionHeight = 118;
    const sectionParts: string[] = [];
    sectionParts.push(`<rect x="${SCREEN_X + 18}" y="${currentY}" width="${SCREEN_WIDTH - 36}" height="9999" rx="26" fill="${section.tone === 'muted' ? '#F8F7F2' : '#FFFFFF'}" stroke="#E4E8E5" />`);
    sectionParts.push(renderTextBlock({ x: SCREEN_X + 40, y: currentY + 30, text: section.eyebrow, size: 11, fill: '#15875F', weight: 700, uppercase: true, letterSpacing: 0.8, limit: 24 }));
    sectionParts.push(renderTextBlock({ x: SCREEN_X + 40, y: currentY + 70, text: section.title, size: 30, fill: '#0C1A16', weight: 700, lineHeight: 32, limit: 25 }));
    if (section.support) {
      sectionParts.push(renderTextBlock({ x: SCREEN_X + 40, y: currentY + 112, text: section.support, size: 14, fill: '#6F847D', lineHeight: 20, limit: 48 }));
      sectionHeight += 42;
    }

    let itemY = currentY + sectionHeight - 6;
    for (const item of section.items) {
      if (item.type === 'action') {
        const rendered = renderAction(item, SCREEN_X + 30, itemY);
        sectionParts.push(rendered.svg);
        itemY += rendered.height + 12;
      } else if (item.type === 'timeline') {
        const rendered = renderTimeline(item, SCREEN_X + 30, itemY);
        sectionParts.push(rendered.svg);
        itemY += rendered.height + 12;
      } else if (item.type === 'badges') {
        let badgeX = SCREEN_X + 36;
        let badgeY = itemY;
        for (const badge of item.badges) {
          const widthEstimate = Math.max(110, badge.label.length * 8.3 + 24);
          if (badgeX + widthEstimate > SCREEN_X + SCREEN_WIDTH - 40) {
            badgeX = SCREEN_X + 36;
            badgeY += 46;
          }
          sectionParts.push(renderBadge(badge.label, badge.tone, badgeX, badgeY));
          badgeX += widthEstimate + 10;
        }
        itemY = badgeY + 52;
      } else {
        const lines = wrapText(item.body, 48);
        sectionParts.push(renderTextBlock({ x: SCREEN_X + 40, y: itemY + 20, text: item.body, size: 15, fill: '#263631', lineHeight: 23, limit: 48 }));
        itemY += 28 + lines.length * 23;
      }
    }

    const realHeight = itemY - currentY + 12;
    sectionParts[0] = `<rect x="${SCREEN_X + 18}" y="${currentY}" width="${SCREEN_WIDTH - 36}" height="${realHeight}" rx="26" fill="${section.tone === 'muted' ? '#F8F7F2' : '#FFFFFF'}" stroke="#E4E8E5" />`;
    parts.push(...sectionParts);
    currentY += realHeight + 18;
  }

  parts.push(renderTextBlock({ x: SCREEN_X + 48, y: currentY + 10, text: `${screen.route} · ${screen.state} · ${screen.tier}`, size: 12, fill: '#537067', limit: 42 }));

  const totalHeight = Math.max(currentY + 48, 1520);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${totalHeight}" viewBox="0 0 ${WIDTH} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${parts.join('\n')}
</svg>`;
}

ensureDir(screenshotsDir);

for (const screen of reviewScreenDefinitions) {
  fs.writeFileSync(path.join(screenshotsDir, `${screen.screenId}.svg`), renderScreen(screen));
}

console.log(`Static SVG review screens generated in ${screenshotsDir}`);
