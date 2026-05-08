import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const url = process.env.REPORT_URL ?? "https://alloehealth.com.br/relatorio/demo";
const outDir = "./codex-artifacts/lighthouse";
fs.mkdirSync(outDir, { recursive: true });

const run = (name, extraArgs = "") =>
  execSync(
    `npx lighthouse ${url} --quiet ${extraArgs} --output=json --output-path=${path.join(outDir, `${name}.json`)}`,
    { stdio: "inherit" }
  );

run("desktop", "--preset=desktop");
run("mobile");
