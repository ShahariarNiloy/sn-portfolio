/**
 * /icons.svg — every icon as one SVG sprite. Icons drawn many times on a page
 * (the brand logos on Home and /stack) point into it with <use>, so their paths
 * are downloaded once and cached, instead of repeated in every page's HTML.
 */
import type { APIRoute } from 'astro';

import { SPRITE } from '@/components/ui/icons';

export const GET: APIRoute = () => new Response(SPRITE, { headers: { 'Content-Type': 'image/svg+xml' } });
