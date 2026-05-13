#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, basename } from "node:path";

const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
	encoding: "utf8",
}).trim();

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
	cwd: repoRoot,
	encoding: "buffer",
})
	.toString("utf8")
	.split("\0")
	.filter(Boolean);

const ignoredExtensions = new Set([
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".ico",
	".pdf",
	".zip",
	".gz",
	".tgz",
	".woff",
	".woff2",
	".ttf",
	".eot",
	".mp4",
	".mov",
	".pptx",
	".xlsx",
]);

const ignoredBasenames = new Set(["pnpm-lock.yaml", "package-lock.json"]);

const allowValueFragments = [
	"your_",
	"your-",
	"seu_",
	"seu-",
	"example",
	"placeholder",
	"changeme",
	"change_me",
	"dummy",
	"fake",
	"test",
	"password",
	"pass",
	"process.env",
	"import.meta.env",
	"env.",
	"xxx",
	"<",
	"...",
];

const rules = [
	{
		id: "private-key",
		pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/i,
	},
	{
		id: "openai-api-key",
		pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
	},
	{
		id: "stripe-secret-key",
		pattern: /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/,
	},
	{
		id: "stripe-webhook-secret",
		pattern: /\bwhsec_[A-Za-z0-9]{16,}\b/,
	},
	{
		id: "asaas-api-key",
		pattern: /\baact_(?:prod|hml)_[A-Za-z0-9_-]{16,}\b/,
	},
	{
		id: "database-url-with-password",
		pattern:
			/\b(?:postgresql|postgres|mysql|mongodb(?:\+srv)?):\/\/[^:\s/]+:[^@\s/]+@[^)\s"']+/i,
	},
	{
		id: "known-hardcoded-wpp-secret",
		pattern: /\bzapvida-secret-2024\b/i,
	},
	{
		id: "supabase-service-role-assignment",
		pattern:
			/\b(?:SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE_KEY)\s*[:=]\s*["']?([A-Za-z0-9._-]{20,})/i,
		valueGroup: 1,
	},
	{
		id: "generic-production-secret-assignment",
		pattern:
			/\b(?:CRON_SECRET|INTERNAL_HEALTH_TOKEN|ADMIN_BEARER|EVOLUTION_API_KEY|EVOLUTION_API_TOKEN|EVOLUTION_TOKEN|EVOLUTION_TOKEN_ZAPVIDAX|EVOLUTION_TOKEN_ZAPVIDAX_FALLBACK|PLANTAO_WEBHOOK_SECRET|ALLOEZIL_WEBHOOK_SECRET)\s*[:=]\s*["']?([A-Za-z0-9._/@:+-]{12,})/i,
		valueGroup: 1,
	},
];

function isProbablyPlaceholder(value) {
	const normalized = value.toLowerCase();
	return allowValueFragments.some((fragment) => normalized.includes(fragment));
}

function mask(raw) {
	const text = String(raw);
	if (text.length <= 8) return "[masked]";
	return `${text.slice(0, 3)}...${text.slice(-3)}`;
}

function shouldScan(file) {
	if (ignoredBasenames.has(basename(file))) return false;
	if (ignoredExtensions.has(extname(file).toLowerCase())) return false;
	if (file.includes("/node_modules/")) return false;
	if (file.includes("/.next/")) return false;
	if (file.includes("/playwright-report/")) return false;
	if (file.includes("/test-results/")) return false;
	return true;
}

const findings = [];

for (const file of trackedFiles) {
	if (!shouldScan(file)) continue;

	const absolutePath = `${repoRoot}/${file}`;
	if (!existsSync(absolutePath)) continue;

	const buffer = readFileSync(absolutePath);
	if (buffer.includes(0)) continue;

	const lines = buffer.toString("utf8").split(/\r?\n/);
	lines.forEach((line, index) => {
		for (const rule of rules) {
			const match = line.match(rule.pattern);
			if (!match) continue;

			const value = rule.valueGroup ? match[rule.valueGroup] : match[0];
			if (isProbablyPlaceholder(value)) continue;

			findings.push({
				file,
				line: index + 1,
				rule: rule.id,
				value: mask(value),
			});
		}
	});
}

if (findings.length === 0) {
	console.log("[security:secrets] OK: nenhum segredo de alto risco encontrado em arquivos versionados.");
	process.exit(0);
}

console.error(
	`[security:secrets] FAIL: ${findings.length} possível(is) segredo(s) em arquivos versionados.`,
);
for (const finding of findings.slice(0, 80)) {
	console.error(
		`- ${finding.file}:${finding.line} ${finding.rule} ${finding.value}`,
	);
}
if (findings.length > 80) {
	console.error(`- ... mais ${findings.length - 80} achado(s) omitido(s).`);
}
console.error(
	"[security:secrets] Remova o valor do arquivo versionado e rotacione a credencial no provedor.",
);
process.exit(1);
