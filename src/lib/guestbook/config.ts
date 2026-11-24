/**
 * config.ts — reads and checks the Guestbook's secrets once per request, so a
 * missing secret fails with a clear 500 instead of a confusing GitHub error.
 */
import type { GitHubApp } from './github';

/** Everything the routes need from the environment. */
export interface GuestbookConfig {
	app: GitHubApp;
	sessionSecret: string;
	ownerGithubId: number;
	deployHookUrl: string;
}

/** Validates the secrets; returns null when any is missing. */
export function readConfig(
	env: Partial<Record<'GITHUB_CLIENT_ID' | 'GITHUB_CLIENT_SECRET' | 'SESSION_SECRET' | 'OWNER_GITHUB_ID' | 'DEPLOY_HOOK_URL', unknown>>,
	origin: string,
): GuestbookConfig | null {
	const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SESSION_SECRET, OWNER_GITHUB_ID, DEPLOY_HOOK_URL } = env;
	if (typeof GITHUB_CLIENT_ID !== 'string' || typeof GITHUB_CLIENT_SECRET !== 'string' || typeof SESSION_SECRET !== 'string') return null;
	const ownerGithubId = Number(OWNER_GITHUB_ID);
	if (!Number.isInteger(ownerGithubId) || SESSION_SECRET.length < 32) return null;
	return {
		app: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET, redirectUri: `${origin}/api/guestbook/callback` },
		sessionSecret: SESSION_SECRET,
		ownerGithubId,
		deployHookUrl: typeof DEPLOY_HOOK_URL === 'string' ? DEPLOY_HOOK_URL : '',
	};
}
