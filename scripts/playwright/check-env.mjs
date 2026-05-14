#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
	bootstrapPlaywrightEnv,
	resolvePlaywrightExecutable,
} from "./env.mjs";

function walkFiles(dir, acc = []) {
	if (!fs.existsSync(dir)) {
		return acc;
	}
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (["node_modules", ".next", "playwright-report", "test-results"].includes(entry.name)) {
			continue;
		}
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walkFiles(fullPath, acc);
		} else if (/\.(cjs|mjs|js|jsx|ts|tsx)$/.test(entry.name)) {
			acc.push(fullPath);
		}
	}
	return acc;
}

function findPersistentContextUsage(root) {
	return walkFiles(path.join(root, "tests"))
		.concat(walkFiles(path.join(root, "scripts", "playwright")))
		.filter((filePath) => path.basename(filePath) !== "check-env.mjs")
		.filter((filePath) =>
			fs.readFileSync(filePath, "utf8").includes("launchPersistentContext"),
		)
		.map((filePath) => path.relative(root, filePath));
}

const strict = process.argv.includes("--strict");
const asJson = process.argv.includes("--json");
const env = bootstrapPlaywrightEnv();
const persistentContextFiles = findPersistentContextUsage(env.repoRoot);

const result = {
	ok: fs.existsSync(resolvePlaywrightExecutable()) && persistentContextFiles.length === 0,
	repo: env.repoName,
	mode: env.mode,
	baseUrl: env.baseUrl,
	isProdLike: env.isProdLike,
	runId: env.runId,
	loadedFiles: env.loadedFiles,
	inspectedFiles: env.inspectedFiles,
	playwrightInstalled: fs.existsSync(resolvePlaywrightExecutable()),
	persistentContextFiles,
	mutationsAllowed: process.env.PLAYWRIGHT_ALLOW_MUTATIONS === "true",
};

if (asJson) {
	console.log(JSON.stringify(result, null, 2));
} else {
	console.log(`[playwright:${result.repo}] env`);
	console.log(`  baseUrl: ${result.baseUrl}`);
	console.log(`  mode: ${result.mode}`);
	console.log(`  runId: ${result.runId}`);
	console.log(`  playwrightInstalled: ${result.playwrightInstalled ? "yes" : "no"}`);
	console.log(
		`  persistentContext: ${persistentContextFiles.length === 0 ? "none" : persistentContextFiles.join(", ")}`,
	);
	console.log(`  mutationsAllowed: ${result.mutationsAllowed ? "yes" : "no"}`);
}

if (strict && !result.ok) {
	process.exit(1);
}
