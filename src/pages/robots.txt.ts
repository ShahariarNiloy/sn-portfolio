/**
 * /robots.txt — allows everything except the Guestbook admin and API, and
 * points crawlers to the sitemap.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) =>
	new Response(`User-agent: *\nDisallow: /guestbook/admin\nDisallow: /api/\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
