import fs from 'node:fs';
import path from 'node:path';

import { reviewScreenDefinitions } from '../apps/mobile/src/review/screen-definitions';

const artifactDir = path.join(process.cwd(), 'artifacts', 'mejoy-native-release-review');
const htmlDir = path.join(artifactDir, 'html');

function ensureDir(target: string) {
  fs.mkdirSync(target, { recursive: true });
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function badgeClass(tone: string) {
  if (tone === 'good') return 'badge badge-good';
  if (tone === 'attention') return 'badge badge-attention';
  if (tone === 'high') return 'badge badge-high';
  return 'badge badge-low';
}

function tileClass(tone?: string) {
  if (tone === 'brand') return 'tile tile-brand';
  if (tone === 'accent') return 'tile tile-accent';
  return 'tile';
}

function renderItem(item: (typeof reviewScreenDefinitions)[number]['sections'][number]['items'][number]) {
  if (item.type === 'action') {
    return `
      <article class="${tileClass(item.tone)}">
        <p class="eyebrow">${escapeHtml(item.eyebrow)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="body">${escapeHtml(item.description)}</p>
        <div class="tile-footer">
          <span>${escapeHtml(item.caption || 'Abrir')}</span>
          <span>→</span>
        </div>
      </article>
    `;
  }

  if (item.type === 'timeline') {
    return `
      <article class="timeline ${item.tone || 'default'}">
        <div class="dot"></div>
        <div class="timeline-copy">
          <div class="timeline-head">
            <h3>${escapeHtml(item.title)}</h3>
            ${item.meta ? `<span>${escapeHtml(item.meta)}</span>` : ''}
          </div>
          <p>${escapeHtml(item.subtitle)}</p>
        </div>
      </article>
    `;
  }

  if (item.type === 'badges') {
    return `
      <div class="badge-row">
        ${item.badges.map((badge) => `<span class="${badgeClass(badge.tone)}">${escapeHtml(badge.label)}</span>`).join('')}
      </div>
    `;
  }

  return `<p class="body">${escapeHtml(item.body)}</p>`;
}

function renderScreen(screen: (typeof reviewScreenDefinitions)[number]) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(screen.screenId)} · MeJoy review</title>
    <style>
      :root {
        --bg: #f4f1eb;
        --card: #ffffff;
        --card-subtle: #f7f6f2;
        --ink: #0c1a16;
        --brand: #15875f;
        --brand-soft: #def3e8;
        --accent: #f0a04b;
        --accent-soft: #fff0de;
        --danger: #b84a4a;
        --success: #157347;
        --border: rgba(12, 26, 22, 0.09);
        --text: #263631;
        --text-soft: #537067;
        --text-muted: #6f847d;
        --white: #ffffff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top left, rgba(21, 135, 95, 0.12), transparent 28%),
          radial-gradient(circle at bottom right, rgba(240, 160, 75, 0.12), transparent 22%),
          linear-gradient(180deg, #f8f6f1 0%, #eef3ef 100%);
        color: var(--text);
      }
      .canvas {
        min-height: 100vh;
        padding: 40px 24px 56px;
        display: flex;
        justify-content: center;
      }
      .device {
        width: 430px;
        border-radius: 48px;
        padding: 18px;
        background: linear-gradient(180deg, #20292a 0%, #111617 100%);
        box-shadow: 0 36px 80px rgba(12, 26, 22, 0.24);
      }
      .screen {
        position: relative;
        overflow: hidden;
        min-height: 860px;
        border-radius: 34px;
        padding: 22px;
        background:
          radial-gradient(circle at top right, rgba(21,135,95,0.08), transparent 18%),
          linear-gradient(180deg, #f7f6f1 0%, #eef4ef 100%);
      }
      .dynamic-island {
        width: 136px;
        height: 34px;
        border-radius: 999px;
        margin: 0 auto 18px;
        background: #0f1012;
      }
      .hero {
        background: linear-gradient(180deg, #10211b 0%, #152e26 100%);
        border-radius: 28px;
        padding: 24px;
        color: var(--white);
        box-shadow: 0 24px 56px rgba(12, 26, 22, 0.18);
      }
      .hero .eyebrow,
      .section .eyebrow,
      .tile .eyebrow {
        margin: 0 0 8px;
        font-size: 11px;
        letter-spacing: 0.08em;
        font-weight: 700;
        text-transform: uppercase;
      }
      .hero .eyebrow { color: #cfe8dc; }
      .hero h1 {
        margin: 0 0 12px;
        font-size: 38px;
        line-height: 1.02;
      }
      .hero .summary {
        margin: 0;
        line-height: 1.55;
        color: #d8e6df;
      }
      .hero-top {
        display: flex;
        gap: 12px;
        justify-content: space-between;
        align-items: flex-start;
      }
      .badge {
        display: inline-flex;
        padding: 8px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
      }
      .badge-good { background: rgba(223, 246, 235, 1); color: #0f6f4b; }
      .badge-attention { background: rgba(255, 239, 219, 1); color: #8b5518; }
      .badge-high { background: rgba(255, 228, 228, 1); color: #9d3030; }
      .badge-low { background: rgba(233, 238, 235, 1); color: #50645d; }
      .metric-row, .badge-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }
      .metric {
        flex: 1 1 120px;
        min-width: 110px;
        padding: 14px;
        border-radius: 22px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.08);
      }
      .metric.brand { background: rgba(21, 135, 95, 0.18); }
      .metric.accent { background: rgba(240, 160, 75, 0.18); }
      .metric.warning { background: rgba(255, 255, 255, 0.10); }
      .metric .label {
        margin: 0 0 4px;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #d7e7df;
      }
      .metric .value { margin: 0 0 4px; font-size: 26px; font-weight: 700; }
      .metric .caption { margin: 0; color: #d7e7df; font-size: 12px; line-height: 1.4; }
      .section {
        margin-top: 16px;
        background: rgba(255,255,255,0.92);
        border-radius: 26px;
        padding: 20px;
        border: 1px solid var(--border);
        box-shadow: 0 16px 32px rgba(12, 26, 22, 0.08);
      }
      .section.muted { background: rgba(249, 248, 244, 0.96); }
      .section .eyebrow { color: var(--brand); }
      .section h2 {
        margin: 0 0 8px;
        font-size: 28px;
        line-height: 1.1;
        color: var(--ink);
      }
      .section .support {
        margin: 0 0 16px;
        color: var(--text-muted);
        line-height: 1.5;
      }
      .tile {
        background: var(--card);
        border-radius: 22px;
        border: 1px solid var(--border);
        padding: 18px;
        margin-top: 12px;
        box-shadow: 0 10px 24px rgba(12, 26, 22, 0.06);
      }
      .tile-brand { background: var(--brand-soft); border-color: rgba(21, 135, 95, 0.1); }
      .tile-accent { background: var(--accent-soft); border-color: rgba(240, 160, 75, 0.12); }
      .tile h3, .timeline h3 { margin: 0 0 8px; font-size: 22px; line-height: 1.15; color: var(--ink); }
      .body, .tile .body, .timeline p {
        margin: 0;
        line-height: 1.55;
        color: var(--text);
        font-size: 15px;
      }
      .tile-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        font-size: 13px;
        font-weight: 700;
        color: var(--brand);
      }
      .timeline {
        display: flex;
        gap: 12px;
        margin-top: 12px;
        background: var(--card-subtle);
        padding: 16px;
        border-radius: 20px;
      }
      .timeline .dot {
        margin-top: 8px;
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: var(--brand);
        flex: 0 0 auto;
      }
      .timeline.success .dot { background: var(--success); }
      .timeline.warning .dot { background: var(--accent); }
      .timeline-copy { flex: 1; }
      .timeline-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }
      .timeline-head span {
        white-space: nowrap;
        color: var(--text-soft);
        font-size: 12px;
      }
      .footer-note {
        margin-top: 16px;
        color: var(--text-soft);
        font-size: 12px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <main class="canvas">
      <div class="device">
        <div class="screen">
          <div class="dynamic-island"></div>
          <section class="hero">
            <div class="hero-top">
              <div>
                <p class="eyebrow">${escapeHtml(screen.eyebrow)}</p>
                <h1>${escapeHtml(screen.title)}</h1>
              </div>
              ${screen.badge ? `<span class="${badgeClass(screen.badge.tone)}">${escapeHtml(screen.badge.label)}</span>` : ''}
            </div>
            <p class="summary">${escapeHtml(screen.summary)}</p>
            ${screen.metrics?.length ? `
              <div class="metric-row">
                ${screen.metrics
                  .map(
                    (metric) => `
                      <div class="metric ${metric.tone || ''}">
                        <p class="label">${escapeHtml(metric.label)}</p>
                        <p class="value">${escapeHtml(metric.value)}</p>
                        <p class="caption">${escapeHtml(metric.caption)}</p>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            ` : ''}
          </section>
          ${screen.sections
            .map(
              (section) => `
                <section class="section ${section.tone === 'muted' ? 'muted' : ''}">
                  <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
                  <h2>${escapeHtml(section.title)}</h2>
                  ${section.support ? `<p class="support">${escapeHtml(section.support)}</p>` : ''}
                  ${section.items.map(renderItem).join('')}
                </section>
              `
            )
            .join('')}
          <p class="footer-note">${escapeHtml(screen.route)} · ${escapeHtml(screen.state)} · ${escapeHtml(screen.tier)}</p>
        </div>
      </div>
    </main>
  </body>
</html>`;
}

ensureDir(htmlDir);

for (const screen of reviewScreenDefinitions) {
  fs.writeFileSync(path.join(htmlDir, `${screen.screenId}.html`), renderScreen(screen));
}

const indexHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>MeJoy review pack</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; background: #f5f1ea; color: #10211b; padding: 32px; }
      h1 { margin-top: 0; }
      ul { padding-left: 18px; }
      li { margin: 10px 0; }
      a { color: #15875f; text-decoration: none; font-weight: 700; }
    </style>
  </head>
  <body>
    <h1>MeJoy Native review pack</h1>
    <ul>
      ${reviewScreenDefinitions
        .map((screen) => `<li><a href="./${screen.screenId}.html">${screen.screenId}</a> — ${escapeHtml(screen.title)}</li>`)
        .join('')}
    </ul>
  </body>
</html>`;

fs.writeFileSync(path.join(htmlDir, 'index.html'), indexHtml);

const galleryHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>MeJoy review gallery</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; background: #f5f1ea; color: #10211b; margin: 0; padding: 32px; }
      h1 { margin-top: 0; }
      .lede { max-width: 760px; color: #537067; line-height: 1.6; margin-bottom: 28px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
      .card { background: white; border-radius: 24px; padding: 18px; box-shadow: 0 18px 42px rgba(12,26,22,0.08); }
      .card h2 { margin: 0 0 8px; font-size: 18px; }
      .meta { margin: 0 0 16px; color: #537067; font-size: 13px; }
      img { width: 100%; height: auto; border-radius: 18px; border: 1px solid rgba(12,26,22,0.08); background: #f6f5f0; }
      .links { margin-top: 12px; display: flex; gap: 12px; flex-wrap: wrap; }
      a { color: #15875f; text-decoration: none; font-weight: 700; font-size: 13px; }
    </style>
  </head>
  <body>
    <h1>MeJoy Native review gallery</h1>
    <p class="lede">Pacote visual para aprovação antes do EAS. Cada card abaixo aponta para a versão HTML da tela e para o PNG rasterizado da revisão.</p>
    <div class="grid">
      ${reviewScreenDefinitions
        .map(
          (screen) => `
            <article class="card">
              <h2>${screen.screenId} — ${escapeHtml(screen.title)}</h2>
              <p class="meta">${escapeHtml(screen.route)} · ${escapeHtml(screen.state)} · ${escapeHtml(screen.tier)}</p>
              <img src="../screenshots/iphone-png/${screen.screenId}.png" alt="${escapeHtml(screen.title)}" />
              <div class="links">
                <a href="./${screen.screenId}.html">abrir html</a>
                <a href="../screenshots/iphone-png/${screen.screenId}.png">abrir png</a>
                <a href="../screenshots/iphone/${screen.screenId}.svg">abrir svg</a>
              </div>
            </article>
          `
        )
        .join('')}
    </div>
  </body>
</html>`;

fs.writeFileSync(path.join(htmlDir, 'gallery.html'), galleryHtml);

console.log(`Static HTML review screens generated in ${htmlDir}`);
