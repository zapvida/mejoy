#!/usr/bin/env tsx

import fs from "node:fs";
import path from "node:path";

const manifestPath = path.join(process.cwd(), ".next", "server", "pages-manifest.json");
const requiredRoutes = {
  "/api/handoff/create": "pages/api/handoff/create.js",
  "/api/handoff/status": "pages/api/handoff/status.js",
  "/api/triage/session": "pages/api/triage/session.js"
};

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest não encontrado: ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Record<string, string>;
const missing = Object.entries(requiredRoutes).filter(([route, artifact]) => manifest[route] !== artifact);

if (missing.length > 0) {
  console.error("Rotas ausentes ou divergentes no bundle:");
  for (const [route, artifact] of missing) {
    console.error(`- ${route}: esperado ${artifact}, recebido ${manifest[route] || "ausente"}`);
  }
  process.exit(1);
}

console.log("Rotas confirmadas no bundle de produção:");
for (const [route, artifact] of Object.entries(requiredRoutes)) {
  console.log(`- ${route} -> ${artifact}`);
}
