/**
 * mdx.ts — the components MDX bodies may use, passed to every <Content />.
 * Case studies, projects and posts all share this one map.
 */
import JsonTryIt from '@/components/islands/JsonTryIt.astro';
import Link from '@/components/ui/Link.astro';
import RingSet from '@/components/ui/RingSet.astro';

import BarChart from './BarChart.astro';
import Caption from './Caption.astro';
import CategoryGrid from './CategoryGrid.astro';
import Compare from './Compare.astro';
import DraftNote from './DraftNote.astro';
import Flow from './Flow.astro';
import MetaList from './MetaList.astro';
import Note from './Note.astro';
import PaperTitle from './PaperTitle.astro';
import PrincipleGrid from './PrincipleGrid.astro';
import Shot from './Shot.astro';
import ShotGrid from './ShotGrid.astro';
import StatGrid from './StatGrid.astro';
import Steps from './Steps.astro';
import Tier from './Tier.astro';

/** Components available by name inside MDX content. */
export const MDX_COMPONENTS = {
	/** Markdown links get the inline style, and external ones open in a new tab. */
	a: Link,
	BarChart,
	Caption,
	CategoryGrid,
	Compare,
	DraftNote,
	Flow,
	JsonTryIt,
	MetaList,
	Note,
	PaperTitle,
	PrincipleGrid,
	RingSet,
	Shot,
	ShotGrid,
	StatGrid,
	Steps,
	Tier,
};
