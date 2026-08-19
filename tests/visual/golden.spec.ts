import { expect, test, type Page } from '@playwright/test';

/**
 * Golden scene fixtures.
 *
 * One capture per surface at the 1440 reference width, plus the two mobile
 * layouts. Regenerate deliberately with `npm run test:visual:update` after a
 * design change — never to make a failing run go green.
 */

const REFERENCE = { width: 1440, height: 1000 };
const PHONE = { width: 390, height: 844 };

/** Live clocks tick, so they are masked rather than frozen. */
const masked = (page: Page) => ({ mask: [page.getByTestId('live-clock')] });

/** Wait for fonts and the first paint of derived state to settle. */
async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
}

async function openApp(page: Page, nav?: string) {
  await page.goto('/app');
  await settle(page);
  if (nav) {
    await page.getByText(nav, { exact: true }).first().click();
    await page.waitForTimeout(500);
  }
}

test.describe('landing', () => {
  test('hero at the reference width', async ({ page }) => {
    await page.setViewportSize(REFERENCE);
    await page.goto('/');
    await settle(page);
    await expect(page).toHaveScreenshot('landing-hero.png', masked(page));
  });

  test('full page with every section revealed', async ({ page }) => {
    await page.setViewportSize(REFERENCE);
    await page.goto('/');
    await settle(page);
    // Sections reveal on scroll, so walk the page before capturing it.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);
    await expect(page).toHaveScreenshot('landing-full.png', { ...masked(page), fullPage: true });
  });

  test('phone', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/');
    await settle(page);
    await expect(page).toHaveScreenshot('landing-phone.png', masked(page));
  });
});

test.describe('market', () => {
  for (const [name, nav] of [
    ['board', undefined],
    ['floor', 'FLOOR'],
    ['ladder', 'LADDER'],
  ] as const) {
    test(name, async ({ page }) => {
      await page.setViewportSize(REFERENCE);
      await openApp(page, nav);
      await expect(page).toHaveScreenshot(`market-${name}.png`, { ...masked(page), fullPage: true });
    });
  }
});

test.describe('desk', () => {
  for (const [name, nav] of [
    ['product', 'YOUR PRODUCT'],
    ['challenges', 'CHALLENGES'],
    ['studio', 'WIDGET STUDIO'],
    ['insights', 'INSIGHTS'],
    ['feed', 'BATTLE FEED'],
    ['season', 'SEASON'],
  ] as const) {
    test(name, async ({ page }) => {
      await page.setViewportSize(REFERENCE);
      await openApp(page, nav);
      await expect(page).toHaveScreenshot(`desk-${name}.png`, { ...masked(page), fullPage: true });
    });
  }
});

test.describe('product tabs', () => {
  for (const [name, label] of [
    ['performance', 'PERFORMANCE'],
    ['discussion', 'DISCUSSION 128'],
    ['updates', 'UPDATES 7'],
    ['team', 'TEAM'],
  ] as const) {
    test(name, async ({ page }) => {
      await page.setViewportSize(REFERENCE);
      await openApp(page, 'YOUR PRODUCT');
      await page.getByText(label, { exact: true }).first().click();
      await page.waitForTimeout(450);
      await expect(page).toHaveScreenshot(`tab-${name}.png`, { ...masked(page), fullPage: true });
    });
  }
});

test.describe('widget render states', () => {
  // The claim is one spec across six canvases; these fixtures hold it to that.
  for (const state of ['ROW', 'CARD', 'FEATURE', 'THRONE', 'FLOOR_BOOTH', 'PRODUCT_PAGE'] as const) {
    test(state, async ({ page }) => {
      await page.setViewportSize(REFERENCE);
      await openApp(page, 'WIDGET STUDIO');
      await page.getByText(state, { exact: true }).first().click();
      await page.waitForTimeout(400);
      await expect(page).toHaveScreenshot(`state-${state}.png`, masked(page));
    });
  }
});

test.describe('widget templates', () => {
  for (const [name, label] of [
    ['calculator', 'CALCULATOR'],
    ['before-after', 'BEFORE / AFTER'],
    ['sdk', 'CUSTOM SDK BUILD'],
  ] as const) {
    test(name, async ({ page }) => {
      await page.setViewportSize(REFERENCE);
      await openApp(page, 'WIDGET STUDIO');
      await page.getByText(label, { exact: true }).first().click();
      await page.waitForTimeout(400);
      await expect(page).toHaveScreenshot(`template-${name}.png`, masked(page));
    });
  }
});

test.describe('app on a phone', () => {
  test('board', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/app');
    await settle(page);
    await expect(page).toHaveScreenshot('phone-board.png', masked(page));
  });

  test('navigation drawer', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/app');
    await settle(page);
    await page.getByLabel('Open navigation').click();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot('phone-drawer.png', masked(page));
  });
});
