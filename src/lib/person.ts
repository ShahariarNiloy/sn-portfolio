/**
 * person.ts — the full Person JSON-LD (Home and About), built from content:
 * current employer, university, skills from the Stack, awards and the avatar.
 */
import { getImage } from 'astro:assets';

import avatar from '@/assets/avatar.png';

import { getCareer, getProjects, getSite, getStack } from './content';
import { buildPersonJsonLd } from './seo';

/** Person JSON-LD with every fact the site already states. `origin` is the site URL. */
export async function getPersonJsonLd(origin: string): Promise<Record<string, unknown>> {
	const [site, career, stack, projects, photo] = await Promise.all([
		getSite(),
		getCareer(),
		getStack(),
		getProjects(),
		getImage({ src: avatar, width: 400, format: 'png' }),
	]);
	const current = career.find((c) => c.to === null);
	const employerSite = projects.find((p) => p.data.group === 'company')?.data.url;
	return buildPersonJsonLd(site, new URL('/', origin).href, {
		image: new URL(photo.src, origin).href,
		worksFor: current && { name: current.company, url: employerSite },
		alumniOf: 'East West University',
		knowsAbout: [
			'Web performance',
			'Design systems',
			'Search engine optimisation',
			'Accessibility',
			...stack.filter((s) => s.data.group !== 'learning').map((s) => s.data.name),
		],
		award: site.home.recognition.filter((r) => r.title.startsWith('Best ')).map((r) => `${r.title} (${r.detail})`),
	});
}
