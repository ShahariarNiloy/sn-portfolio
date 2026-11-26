/**
 * illustrations/index.ts — registry of illustration components, keyed by the
 * `illustration` name used in content frontmatter. Used only by Illustration.astro.
 */
import DesignSystem from './DesignSystem.astro';
import Localization from './Localization.astro';
import AccessibilityDefault from './AccessibilityDefault.astro';
import AeoGeo from './AeoGeo.astro';
import BilingualBengali from './BilingualBengali.astro';
import BuildingRepoGalaxy from './BuildingRepoGalaxy.astro';
import FirstLoad from './FirstLoad.astro';
import HonestSitemaps from './HonestSitemaps.astro';
import Hreflang from './Hreflang.astro';
import LearningRust from './LearningRust.astro';
import LighterComponentLibrary from './LighterComponentLibrary.astro';
import MeasureHtml from './MeasureHtml.astro';
import MemoryLimit from './MemoryLimit.astro';
import MonthlyReview from './MonthlyReview.astro';
import MotionWithManners from './MotionWithManners.astro';
import Pseo from './Pseo.astro';
import RemotePipeline from './RemotePipeline.astro';
import RetriesLeak from './RetriesLeak.astro';
import RightFramework from './RightFramework.astro';
import ZeroServerPost from './ZeroServerPost.astro';
import Memory from './Memory.astro';
import Performance from './Performance.astro';
import BrowserFirst from './BrowserFirst.astro';
import Seo from './Seo.astro';
import Research from './Research.astro';
import MemoryTall from './MemoryTall.astro';
import ResearchTall from './ResearchTall.astro';
import SeoTall from './SeoTall.astro';
import BrowserFirstTall from './BrowserFirstTall.astro';
import type { IllustrationName } from './names';

/** One entry per illustration: the component and its viewBox size. */
export const ILLUSTRATIONS: Record<IllustrationName, { component: typeof DesignSystem; width: number; height: number }> = {
	'design-system': { component: DesignSystem, width: 420, height: 190 },
	localization: { component: Localization, width: 420, height: 190 },
	'accessibility-default': {
		component: AccessibilityDefault,
		width: 420,
		height: 200,
	},
	'aeo-geo': { component: AeoGeo, width: 420, height: 200 },
	'bilingual-bengali': { component: BilingualBengali, width: 420, height: 200 },
	'building-repo-galaxy': {
		component: BuildingRepoGalaxy,
		width: 420,
		height: 200,
	},
	'first-load': { component: FirstLoad, width: 420, height: 200 },
	'honest-sitemaps': { component: HonestSitemaps, width: 420, height: 200 },
	hreflang: { component: Hreflang, width: 420, height: 200 },
	'learning-rust': { component: LearningRust, width: 420, height: 200 },
	'lighter-component-library': {
		component: LighterComponentLibrary,
		width: 420,
		height: 200,
	},
	'measure-html': { component: MeasureHtml, width: 420, height: 200 },
	'memory-limit': { component: MemoryLimit, width: 420, height: 200 },
	'monthly-review': { component: MonthlyReview, width: 420, height: 200 },
	'motion-with-manners': {
		component: MotionWithManners,
		width: 420,
		height: 200,
	},
	pseo: { component: Pseo, width: 420, height: 200 },
	'remote-pipeline': { component: RemotePipeline, width: 420, height: 200 },
	'retries-leak': { component: RetriesLeak, width: 420, height: 200 },
	'right-framework': { component: RightFramework, width: 420, height: 200 },
	'zero-server-post': { component: ZeroServerPost, width: 420, height: 200 },
	memory: { component: Memory, width: 320, height: 180 },
	performance: { component: Performance, width: 520, height: 220 },
	'browser-first': { component: BrowserFirst, width: 320, height: 180 },
	seo: { component: Seo, width: 420, height: 180 },
	research: { component: Research, width: 420, height: 180 },
};

/** Upright drawings for narrow highlight cards. Wide drawings are never shrunk into them. */
export const TALL_ILLUSTRATIONS: Partial<Record<IllustrationName, { component: typeof DesignSystem; width: number; height: number }>> = {
	memory: { component: MemoryTall, width: 200, height: 240 },
	'browser-first': { component: BrowserFirstTall, width: 200, height: 240 },
	seo: { component: SeoTall, width: 200, height: 240 },
	research: { component: ResearchTall, width: 200, height: 240 },
};
