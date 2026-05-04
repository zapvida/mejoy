const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();
const distDirName = process.env.NEXT_DIST_DIR || '.next';
const distDir = path.join(baseDir, distDirName);
const exportDir = path.join(distDir, 'export');
const serverPagesDir = path.join(distDir, 'server', 'pages');
const localizedExportDir = path.join(exportDir, 'pt-BR');
const localizedServerDir = path.join(serverPagesDir, 'pt-BR');

const fallbackPages = [
  {
    filename: '404.html',
    title: 'Pagina nao encontrada',
    heading: '404',
    body: 'Pagina nao encontrada.',
  },
  {
    filename: '500.html',
    title: 'Erro interno',
    heading: '500',
    body: 'Ocorreu um erro ao carregar esta pagina.',
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function ensureFile(filePath, html) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, html, 'utf8');
  }
}

function renderHtml(page) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,nofollow" />
    <title>${page.title}</title>
    <style>
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f8fcf9;
        color: #0f172a;
      }
      main {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
      }
      section {
        max-width: 480px;
        width: 100%;
        border: 1px solid #d1fae5;
        border-radius: 28px;
        background: #ffffff;
        box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
        padding: 32px;
        text-align: center;
      }
      h1 {
        margin: 0;
        font-size: 56px;
        line-height: 1;
        color: #059669;
      }
      p {
        margin: 16px 0 0;
        font-size: 18px;
        line-height: 1.6;
        color: #475569;
      }
      a {
        display: inline-block;
        margin-top: 24px;
        border-radius: 999px;
        background: linear-gradient(90deg, #059669 0%, #065f46 100%);
        color: #ffffff;
        text-decoration: none;
        font-weight: 700;
        padding: 14px 24px;
      }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h1>${page.heading}</h1>
        <p>${page.body}</p>
        <a href="/">Voltar ao inicio</a>
      </section>
    </main>
  </body>
</html>
`;
}

fs.rmSync(distDir, { recursive: true, force: true });
ensureDir(exportDir);
ensureDir(serverPagesDir);
ensureDir(localizedExportDir);
ensureDir(localizedServerDir);

for (const page of fallbackPages) {
  ensureFile(path.join(localizedExportDir, page.filename), renderHtml(page));
}
