// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
// Fully static output: every page is prerendered to plain HTML in dist/.
export default defineConfig({
	site: "https://shahariarniloy.com",
	integrations: [sitemap()],
	// v1 pages that moved in the v2 redesign.
	redirects: {
		"/about": "/experience",
		"/contact": "/#contact",
	},
});
