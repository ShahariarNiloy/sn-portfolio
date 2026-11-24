/**
 * /blog/rss.xml — RSS feed of published posts (drafts never appear).
 */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

import { getLatestPosts, getSite } from '@/lib/content';

export const GET: APIRoute = async (context) => {
	const [site, posts] = await Promise.all([getSite(), getLatestPosts(Number.POSITIVE_INFINITY)]);
	return rss({
		title: `${site.name} — Blog`,
		description: site.description,
		site: context.site ?? 'https://shahariarniloy.com',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.summary,
			link: `/blog/${post.id}`,
			pubDate: post.data.publishedOn,
		})),
	});
};
