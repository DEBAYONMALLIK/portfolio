import { test, expect } from '@playwright/test';

test.describe('Page integrity', () => {
  test('loads without console errors or failed scripts', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      // Google Fonts is blocked inside the test sandbox; that is not a page fault.
      if (m.type() === 'error' && !/ERR_TUNNEL_CONNECTION_FAILED|fonts\.googleapis/.test(m.text())) {
        errors.push(m.text());
      }
    });
    await page.goto('/');
    await page.waitForTimeout(2800);
    expect(errors).toEqual([]);
  });

  test('has a single h1 and a sensible title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Debayon Mallik/);
  });

  test('filtering the work grid changes what is shown', async ({ page }) => {
    await page.goto('/#work');
    const all = await page.getByTestId('project-card').count();
    await page.getByTestId('filter-Full-Stack').click();
    await expect(page.getByTestId('project-card')).toHaveCount(1);
    await page.getByTestId('filter-All').click();
    await expect(page.getByTestId('project-card')).toHaveCount(all);
  });

  test('project detail expands on request', async ({ page }) => {
    await page.goto('/#work');
    const toggle = page.getByTestId('project-detail-toggle-conversion-workbench');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    await expect(page.getByTestId('project-detail-conversion-workbench')).toBeVisible();
  });

  test('every outbound link opens safely in a new tab', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a[href^="http"]');
    const n = await links.count();
    expect(n).toBeGreaterThan(5);
    for (let i = 0; i < n; i += 1) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank');
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/);
    }
  });

  test('respects a reduced-motion preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    // With motion reduced the trace is shown complete immediately, not typed out.
    await expect(page.getByTestId('run-trace')).toContainText('candidates ranked', { timeout: 2000 });
  });
});
