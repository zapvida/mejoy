const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");
const repoDirectory = path.basename(repoRoot);
const defaultsByRepo = {
	aimnese: {
		repoName: "aimnese",
		defaultLocalBaseUrl: "http://localhost:3000",
		defaultProductionBaseUrl: "https://aimnese.com",
		prodHosts: ["aimnese.com", "www.aimnese.com"],
	},
	mejoy: {
		repoName: "mejoy",
		defaultLocalBaseUrl: "http://localhost:3100",
		defaultProductionBaseUrl: "https://www.mejoy.com.br",
		prodHosts: ["mejoy.com.br", "www.mejoy.com.br"],
	},
	zapfarm: {
		repoName: "zapfarm",
		defaultLocalBaseUrl: "http://localhost:3000",
		defaultProductionBaseUrl: "https://zapfarm.com.br",
		prodHosts: ["zapfarm.com.br", "www.zapfarm.com.br"],
	},
};
const repoDefaults = defaultsByRepo[repoDirectory] || defaultsByRepo.mejoy;
const { repoName, defaultLocalBaseUrl, defaultProductionBaseUrl, prodHosts } =
	repoDefaults;

const baseEnvFiles = [
	".env.local",
	"apps/web/.env.local",
	".env.production.local",
	".env.production",
	".env",
];

const supplementalEnvFiles = [
	".env.playwright.local",
	".env.test",
	".env.preview.local",
	".env.production.check",
	".env.handoff.check",
];
const runtimeEnvKeys = new Set(["NODE_ENV", "OPENAI_API_KEY"]);

function parseDotenv(content) {
	const values = {};
	for (const rawLine of content.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) {
			continue;
		}
		const match = line.match(/^([\w.-]+)\s*=\s*(.*)$/);
		if (!match) {
			continue;
		}
		let value = match[2] ?? "";
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		values[match[1]] = value;
	}
	return values;
}

function normalizeUrl(value) {
	if (!value?.trim()) {
		return undefined;
	}
	const trimmed = value.trim();
	return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function readEnvFile(relativePath) {
	const absolutePath = path.join(repoRoot, relativePath);
	if (!fs.existsSync(absolutePath)) {
		return undefined;
	}
	return {
		relativePath,
		values: parseDotenv(fs.readFileSync(absolutePath, "utf8")),
	};
}

function setIfMissing(key, value, appliedKeys) {
	if (runtimeEnvKeys.has(key)) {
		return;
	}
	if (!value?.trim()) {
		return;
	}
	if (process.env[key]?.trim()) {
		return;
	}
	process.env[key] = value.trim();
	appliedKeys.push(key);
}

function isLocalUrl(url) {
	try {
		const parsed = new URL(normalizeUrl(url) ?? "");
		return ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
	} catch {
		return false;
	}
}

function isProdLikeUrl(url) {
	try {
		const parsed = new URL(normalizeUrl(url) ?? "");
		return prodHosts.includes(parsed.hostname);
	} catch {
		return false;
	}
}

function resolveBaseUrl(mode = process.env.PLAYWRIGHT_TECMED_MODE) {
	return (
		normalizeUrl(process.env.PLAYWRIGHT_BASE_URL) ||
		normalizeUrl(process.env.BASE_URL) ||
		normalizeUrl(
			mode === "staging-full" || mode === "local-smoke"
				? process.env.SANDBOX_URL || process.env.STAGING_URL
				: process.env.PRODUCTION_URL,
		) ||
		normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
		normalizeUrl(process.env.NEXT_PUBLIC_BASE_URL) ||
		(mode === "local-smoke" ? defaultLocalBaseUrl : defaultProductionBaseUrl)
	);
}

function createRunId() {
	const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
	return `${repoName}-pw-${stamp}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolvePlaywrightExecutable() {
	const suffix = process.platform === "win32" ? "playwright.cmd" : "playwright";
	return path.join(repoRoot, "node_modules", ".bin", suffix);
}

function resolveChromiumExecutablePath() {
	if (
		process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?.trim() &&
		fs.existsSync(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH)
	) {
		return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
	}
	if (process.platform !== "darwin") {
		return undefined;
	}
	if (process.env.PLAYWRIGHT_USE_SYSTEM_CHROMIUM !== "1") {
		return undefined;
	}
	return [
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
		"/Applications/Chromium.app/Contents/MacOS/Chromium",
		"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
	].find((candidate) => fs.existsSync(candidate));
}

function resolveBrowserUse() {
	const args = [
		"--no-sandbox",
		"--disable-setuid-sandbox",
		"--disable-dev-shm-usage",
		"--disable-crashpad",
		"--disable-crash-reporter",
		"--disable-breakpad",
		"--no-first-run",
		"--no-default-browser-check",
		...(process.env.PLAYWRIGHT_CHROMIUM_ARGS?.split(/\s+/).filter(Boolean) ??
			[]),
	];
	const executablePath = resolveChromiumExecutablePath();
	if (executablePath) {
		return { launchOptions: { executablePath, args } };
	}
	const channel = process.env.PLAYWRIGHT_CHROMIUM_CHANNEL?.trim();
	return channel
		? { channel, launchOptions: { args } }
		: { launchOptions: { args } };
}

function bootstrapPlaywrightEnv(options = {}) {
	const loadedFiles = [];
	const inspectedFiles = [];
	const appliedKeys = [];

	for (const relativePath of baseEnvFiles) {
		const envFile = readEnvFile(relativePath);
		if (!envFile) {
			continue;
		}
		loadedFiles.push(envFile.relativePath);
		for (const [key, value] of Object.entries(envFile.values)) {
			setIfMissing(key, value, appliedKeys);
		}
	}

	for (const relativePath of supplementalEnvFiles) {
		const envFile = readEnvFile(relativePath);
		if (!envFile) {
			continue;
		}
		inspectedFiles.push(envFile.relativePath);
		for (const [key, value] of Object.entries(envFile.values)) {
			setIfMissing(key, value, appliedKeys);
		}
	}

	const mode = options.mode || process.env.PLAYWRIGHT_TECMED_MODE || "prod-safe";
	process.env.PLAYWRIGHT_TECMED_MODE = mode;

	const baseUrl = normalizeUrl(options.baseUrl) || resolveBaseUrl(mode);
	process.env.PLAYWRIGHT_BASE_URL = baseUrl;
	process.env.BASE_URL = baseUrl;
	setIfMissing("PRODUCTION_URL", baseUrl, appliedKeys);

	if (!process.env.E2E_RUN_ID?.trim()) {
		process.env.E2E_RUN_ID = createRunId();
		appliedKeys.push("E2E_RUN_ID");
	}

	if (process.platform === "darwin") {
		setIfMissing("PLAYWRIGHT_USE_SYSTEM_CHROMIUM", "1", appliedKeys);
	}

	const runtimeDir = path.join(repoRoot, ".playwright");
	fs.mkdirSync(runtimeDir, { recursive: true });

	return {
		repoName,
		repoRoot,
		mode,
		baseUrl,
		isLocal: isLocalUrl(baseUrl),
		isProdLike: isProdLikeUrl(baseUrl),
		runId: process.env.E2E_RUN_ID,
		runtimeDir,
		loadedFiles,
		inspectedFiles,
		appliedKeys,
		homeDir: os.homedir(),
		playwrightExecutable: resolvePlaywrightExecutable(),
	};
}

module.exports = {
	repoRoot,
	repoName,
	defaultLocalBaseUrl,
	defaultProductionBaseUrl,
	isProdLikeUrl,
	resolveBaseUrl,
	createRunId,
	resolvePlaywrightExecutable,
	resolveChromiumExecutablePath,
	resolveBrowserUse,
	bootstrapPlaywrightEnv,
};
