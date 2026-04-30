import { execSync } from "node:child_process";
import fs from "node:fs"; 
import path from "node:path";

const url = process.env.REPORT_URL ?? "https://alloehealth.com.br/relatorio/demo";
const outDir = "./codex-artifacts/lighthouse";
fs.mkdirSync(outDir, { recursive: true });

const run = (preset) =>
  execSync(`npx lighthouse ${url} --quiet --preset=${preset} --output=json --output-path=${path.join(outDir, preset+".json")}`, { stdio: "inherit" });

run("desktop");
run("mobile");
