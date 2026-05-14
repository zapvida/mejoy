#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import envModule from "./env.cjs";

const { bootstrapPlaywrightEnv, isProdLikeUrl, resolvePlaywrightExecutable } =
	envModule;

function parseArgs(argv) {
	const passthrough = [];
	let mode = process.env.PLAYWRIGHT_TECMED_MODE || "prod-safe";
	let baseUrl;

	for (const arg of argv) {
		if (arg.startsWith("--tecmed-mode=")) {
			mode = arg.slice("--tecmed-mode=".length);
			continue;
		}
		if (arg.startsWith("--base-url=")) {
			baseUrl = arg.slice("--base-url=".length);
			continue;
		}
		passthrough.push(arg);
	}

	return { mode, baseUrl, passthrough };
}

function requireProdFullAck(env) {
	const isProdFull = env.mode === "prod-full";
	if (!isProdFull) {
		return;
	}
	if (process.env.PLAYWRIGHT_ALLOW_MUTATIONS !== "true") {
		throw new Error(
			"prod-full exige PLAYWRIGHT_ALLOW_MUTATIONS=true para liberar fluxos mutáveis.",
		);
	}
	if (process.env.TECMED_PLAYWRIGHT_PROD_FULL_ACK !== "I_UNDERSTAND_PROD_MUTATIONS") {
		throw new Error(
			"prod-full exige TECMED_PLAYWRIGHT_PROD_FULL_ACK=I_UNDERSTAND_PROD_MUTATIONS.",
		);
	}
	if (!isProdLikeUrl(env.baseUrl)) {
		throw new Error(`prod-full deve apontar para produção canônica. Base atual: ${env.baseUrl}`);
	}
}

const { mode, baseUrl, passthrough } = parseArgs(process.argv.slice(2));
const env = bootstrapPlaywrightEnv({ mode, baseUrl });

try {
	requireProdFullAck(env);
} catch (error) {
	console.error(`[playwright:${env.repoName}] ${error.message}`);
	process.exit(2);
}

if (!fs.existsSync(resolvePlaywrightExecutable())) {
	console.error(
		`[playwright:${env.repoName}] Playwright não encontrado em node_modules. Rode pnpm install.`,
	);
	process.exit(1);
}

if (mode === "prod-safe" && process.env.PLAYWRIGHT_ALLOW_MUTATIONS !== "true") {
	process.env.PLAYWRIGHT_ALLOW_MUTATIONS = "false";
}

const child = spawn(resolvePlaywrightExecutable(), passthrough, {
	cwd: env.repoRoot,
	stdio: "inherit",
	env: {
		...process.env,
		PLAYWRIGHT_CANONICAL_ROOT: env.repoRoot,
		PLAYWRIGHT_TECMED_MODE: mode,
		PLAYWRIGHT_ARTIFACTS_DIR: path.join(
			env.repoRoot,
			"playwright-report",
			env.runId,
		),
	},
});

child.on("exit", (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}
	process.exit(code ?? 1);
});

child.on("error", (error) => {
	console.error(`[playwright:${env.repoName}] Falha ao iniciar runner:`, error);
	process.exit(1);
});
