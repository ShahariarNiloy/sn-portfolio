/**
 * /llms.txt — a plain-text map of the site for AI assistants and answer
 * engines (llmstxt.org): who I am, then every project, case study, post and
 * essay with its one-line summary. Built from content, so it never drifts.
 */
import type { APIRoute } from 'astro';

import { getEssays, getHighlights, getProjects, getPublishedPosts, getSite } from '@/lib/content';
import { stripInline } from '@/lib/seo';

export const GET: APIRoute = async (context) => {
	const [site, projects, highlights, posts, essays] = await Promise.all([getSite(), getProjects(), getHighlights(), getPublishedPosts(), getEssays()]);
	const origin = context.site?.origin ?? 'https://shahariarniloy.com';
	const link = (title: string, path: string, note: string): string => `- [${title}](${origin}${path}): ${stripInline(note).replace(/\s+/g, ' ')}`;
	const lines = [
		`# ${site.name}`,
		'',
		`> ${site.description}`,
		'',
		stripInline(site.home.intro),
		'',
		`Contact: ${site.email} · GitHub: ${site.github} · LinkedIn: ${site.linkedin}`,
		'',
		'## Pages',
		'',
		link('About', '/about', 'Who I am, how I work and how I got here.'),
		link('Timeline', '/timeline', 'Roles, research and recognition, with dates. The CV is linked there.'),
		link('Stack', '/stack', 'The tools I use, and what for.'),
		link('Now', '/now', "What I'm focused on at the moment."),
		link('Contact', '/contact', 'Email, LinkedIn and GitHub.'),
		link('CV (PDF)', '/shahariar-niloy-cv.pdf', 'One-page CV.'),
		'',
		'## Work',
		'',
		...projects.map((p) => link(p.data.name, `/work/${p.id}`, p.data.summary)),
		'',
		'## Case studies',
		'',
		...highlights.map((h) => link(h.data.title, `/highlights/${h.id}`, h.data.lede)),
		'',
		'## Blog',
		'',
		...posts.map((p) => link(p.data.title, `/blog/${p.id}`, p.data.summary)),
		'',
		'## Optional',
		'',
		...essays.map((e) => link(e.data.title, `/off-the-clock/${e.id}`, `Personal essay. ${e.data.excerpt}`)),
		'',
	];
	return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
