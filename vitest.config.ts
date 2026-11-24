/// <reference types="vitest/config" />
// Vitest: unit tests for the pure functions in src/lib.
import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: { include: ['tests/unit/**/*.test.ts'] },
});
