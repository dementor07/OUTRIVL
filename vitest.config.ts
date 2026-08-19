import { defineConfig } from 'vitest/config';

/**
 * Unit tests only.
 *
 * `tests/visual` belongs to Playwright — without this, Vitest collects the
 * spec files there and fails on `test.describe`, which looks like a broken
 * test suite rather than two runners tripping over each other.
 */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
