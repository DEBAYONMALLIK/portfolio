import { test, expect } from '@playwright/test';

const SECTIONS = ['work', 'automate', 'brief', 'experience', 'skills', 'contact'];

test.describe('Responsive layout', () => {
  test('never scrolls horizontally', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2600); // let the hero trace finish laying out
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('renders every section', async ({ page }) => {
    await page.goto('/');
    for (const id of SECTIONS) {
      await expect(page.getByTestId(`section-${id}`)).toBeAttached();
    }
  });

  test('no content spills past the viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2600);
    const overflowing = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      // Decoration (the hero node graph) deliberately bleeds and is clipped;
      // this checks the content a visitor actually reads.
      const decorative = (el) => el.closest('[aria-hidden="true"]') !== null;
      return [...document.querySelectorAll('body *')]
        .filter((el) => {
          if (decorative(el)) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > vw + 2;
        })
        .slice(0, 5)
        .map((el) => `${el.tagName}.${String(el.className?.baseVal ?? el.className).slice(0, 60)}`);
    });
    expect(overflowing).toEqual([]);
  });

  test('tap targets in the brief are big enough to hit on a phone', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'phone-only check');
    await page.goto('/#brief');
    const box = await page.getByTestId('option-automate').boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test('the menu collapses on phones and expands on tap', async ({ page }, testInfo) => {
    await page.goto('/');
    const toggle = page.getByTestId('nav-toggle');
    if (testInfo.project.name === 'mobile') {
      await expect(toggle).toBeVisible();
      await expect(page.getByTestId('mobile-menu')).toHaveCount(0);
      await toggle.click();
      await expect(page.getByTestId('mobile-menu')).toBeVisible();
    } else {
      await expect(page.getByTestId('nav-work')).toBeVisible();
    }
  });
});
