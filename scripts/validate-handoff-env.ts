#!/usr/bin/env tsx

import path from "node:path";
import { config } from "dotenv";

config({ path: path.join(process.cwd(), ".env.local") });

import { collectHandoffEnvGaps } from "@/lib/handoff/config";

const report = collectHandoffEnvGaps();

console.log(JSON.stringify(report, null, 2));

if (report.required.length > 0) {
  console.error(
    "\n[validate-handoff-env] Variáveis obrigatórias ausentes. " +
      "Em CI/deploy, configure HANDOFF_TOKEN_SECRET e NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL " +
      "(ver docs/ops/ENV_MATRIX_LOCAL_PREVIEW_PROD.md). Falha em máquina local sem .env é esperada.\n"
  );
  process.exit(1);
}
