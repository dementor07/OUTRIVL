import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression configuration.
 *
 * The brief treats the approved scenes as a visual contract: once a scene is
 * golden, its screenshots are kept as fixtures so an engineering refactor
 * cannot quietly sand the design away. These tests are that safety net.
 *
 * Runs against a production build on its own port, so a dev server left
 * running on 3000 doesn't interfere and the captures match what ships.
 */
const PORT = 3100;

export default defineConfig({
  testDir: './tests/visual',
  // Baselines are pixel data and rendering differs per OS, so the platform is
  // part of the path rather than a source of mystery diffs.
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://localhost:${PORT}`,
    // Pinned rather than downloaded. Environments that ship a Chromium (CI
    // images, this project's sandbox) rarely match the exact build
    // @playwright/test wants, and a mismatched auto-download is a slow,
    // silent way to get different pixels than everyone else.
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
    },
    channel: undefined,
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      /**
       * Tight on purpose. A ratio-based tolerance is the wrong shape here: 1%
       * of a full-page capture is ~24,000 pixels, which is more than every
       * acid-coloured element on the Board put together — a suite set that way
       * passes while the accent colour changes. Captures are deterministic
       * (animations frozen, clocks masked), so the honest budget is a small
       * absolute number that only absorbs antialiasing noise.
       */
      maxDiffPixels: 120,
      threshold: 0.02,
    },
  },
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Never reuse a running server. A visual suite that reuses one silently
    // compares the new baselines against a stale build — it passes while the
    // design is broken, which is worse than having no suite at all. The extra
    // build is the price of the gate actually being a gate.
    reuseExistingServer: false,
    timeout: 300_000,
    stdout: 'ignore',
  },
});
