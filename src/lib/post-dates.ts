/**
 * post-dates.ts — one switch for showing blog post dates. Off while the dates in
 * the posts are placeholders: they are hidden on the site and left out of the RSS
 * feed and structured data. Set to true once every post has its real date.
 * Posts are still ordered by publishedOn.
 */

/** Whether post dates are shown and published. */
export const SHOW_POST_DATES = false;

/** The post's date when dates are on; undefined otherwise. */
export function postDate(date: Date | undefined): Date | undefined {
	return SHOW_POST_DATES ? date : undefined;
}
