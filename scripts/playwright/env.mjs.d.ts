export const repoRoot: string;
export const repoName: string;
export const defaultLocalBaseUrl: string;
export const defaultProductionBaseUrl: string;

export function isProdLikeUrl(url?: string): boolean;
export function resolveBaseUrl(mode?: string): string;
export function createRunId(): string;
export function resolvePlaywrightExecutable(): string;
export function resolveChromiumExecutablePath(): string | undefined;
export function resolveBrowserUse(): Record<string, unknown>;
export function bootstrapPlaywrightEnv(options?: {
	mode?: string;
	baseUrl?: string;
}): {
	repoName: string;
	repoRoot: string;
	mode: string;
	baseUrl: string;
	isLocal: boolean;
	isProdLike: boolean;
	runId: string;
	runtimeDir: string;
	loadedFiles: string[];
	inspectedFiles: string[];
	appliedKeys: string[];
	homeDir: string;
	playwrightExecutable: string;
};
