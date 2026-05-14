#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const reportPath =
	process.argv[2] ||
	(fs.existsSync("playwright-report/report.json")
		? "playwright-report/report.json"
		: "playwright-report/results.json");
const outputDir = process.argv[3] || "playwright-report";

function safeReadJson(filePath) {
	if (!fs.existsSync(filePath)) {
		return null;
	}
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8"));
	} catch {
		return null;
	}
}

function collectFailures(report) {
	const failures = [];
	function walkSuite(suite, ancestry = []) {
		const nextAncestry = suite.title ? [...ancestry, suite.title] : ancestry;
		for (const child of suite.suites || []) {
			walkSuite(child, nextAncestry);
		}
		for (const spec of suite.specs || []) {
			for (const test of spec.tests || []) {
				const failed = (test.results || []).find((result) =>
					["failed", "timedOut", "interrupted"].includes(result.status),
				);
				if (!failed) {
					continue;
				}
				failures.push({
					title: [...nextAncestry, spec.title].filter(Boolean).join(" > "),
					file: spec.file || suite.file || "unknown",
					project: test.projectName || "unknown",
					status: failed.status,
					error:
						failed.error?.message ||
						failed.errors?.map((error) => error.message).filter(Boolean).join("\n") ||
						"Unknown failure",
				});
			}
		}
	}
	for (const suite of report?.suites || []) {
		walkSuite(suite);
	}
	return failures;
}

const report = safeReadJson(reportPath);
const stats = report?.stats || {};
const failures = collectFailures(report || {});
const digestSource =
	failures.length > 0
		? failures
				.map((failure) => `${failure.project}|${failure.file}|${failure.title}|${failure.status}`)
				.sort()
				.join("\n")
		: `passed:${stats.expected ?? 0}:${stats.skipped ?? 0}`;
const digest = crypto.createHash("sha256").update(digestSource).digest("hex");

const summary = {
	generatedAt: new Date().toISOString(),
	reportPath,
	stats: {
		expected: stats.expected ?? 0,
		unexpected: stats.unexpected ?? failures.length,
		flaky: stats.flaky ?? 0,
		skipped: stats.skipped ?? 0,
		duration: stats.duration ?? 0,
	},
	failures,
	digest,
};

const markdown = [
	"# Playwright Summary",
	"",
	`- Expected: ${summary.stats.expected}`,
	`- Unexpected: ${summary.stats.unexpected}`,
	`- Flaky: ${summary.stats.flaky}`,
	`- Skipped: ${summary.stats.skipped}`,
	`- Digest: \`${digest}\``,
	"",
	failures.length > 0 ? "## Failures" : "## Result",
	failures.length > 0 ? "" : "No failures detected.",
	...failures.flatMap((failure) => [
		`- [${failure.project}] ${failure.title}`,
		`  - File: ${failure.file}`,
		`  - Status: ${failure.status}`,
		`  - Error: ${failure.error.split("\n")[0]}`,
	]),
].join("\n");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "summary.md"), `${markdown}\n`);
console.log(markdown);
