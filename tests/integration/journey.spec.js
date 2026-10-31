import { test, expect } from '@playwright/test';

test.describe('Business brief journey', () => {
  test('a business visitor reaches a recommendation and can send it', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('cta-automate').click();
    await expect(page.getByTestId('section-automate')).toBeInViewport({ timeout: 10_000 });

    await page.getByTestId('services-cta').click();
    await expect(page.getByTestId('section-brief')).toBeInViewport({ timeout: 10_000 });

    await page.getByTestId('option-automate').click();
    await page.getByTestId('option-manual-ui').click();
    await page.getByTestId('option-daily').click();
    await page.getByTestId('option-erp').click();
    await page.getByTestId('option-weeks').click();

    await page.getByTestId('input-name').fill('Priya Raman');
    await page.getByTestId('input-email').fill('priya@northwind.co');
    await page.getByTestId('input-company').fill('Northwind Logistics');
    await page.getByTestId('contact-submit').click();

    const brief = page.getByTestId('brief');
    await expect(brief).toBeVisible();
    await expect(brief.getByRole('heading')).toContainText(/software you already pay for/i);
    await expect(page.getByTestId('qualifier-progress')).toHaveText('100%');

    const mailto = await page.getByTestId('brief-send').getAttribute('href');
    expect(mailto).toContain('mailto:');
    expect(decodeURIComponent(mailto)).toContain('priya@northwind.co');
  });

  test('a hiring visitor gets the hiring brief instead', async ({ page }) => {
    await page.goto('/#brief');
    await page.getByTestId('option-hire').click();
    await page.getByTestId('option-agentic').click();
    await page.getByTestId('input-name').fill('Sam Okafor');
    await page.getByTestId('input-email').fill('sam@studio.dev');
    await page.getByTestId('contact-submit').click();

    await expect(page.getByTestId('brief').getByRole('heading')).toContainText(/closest thing/i);
    await expect(page.getByTestId('brief-evidence').first()).toBeVisible();
  });

  test('invalid contact details keep the visitor on the form', async ({ page }) => {
    await page.goto('/#brief');
    await page.getByTestId('option-hire').click();
    await page.getByTestId('option-data').click();
    await page.getByTestId('input-name').fill('x');
    await page.getByTestId('input-email').fill('nope');
    await page.getByTestId('contact-submit').click();

    await expect(page.getByTestId('error-email')).toBeVisible();
    await expect(page.getByTestId('error-name')).toBeVisible();
    await expect(page.getByTestId('brief')).toHaveCount(0);
  });

  test('the whole flow is reachable with the keyboard alone', async ({ page }) => {
    await page.goto('/#brief');
    await page.getByTestId('option-automate').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('option-ops-data')).toBeVisible();

    await page.getByTestId('option-ops-data').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('qualifier-prompt')).toContainText(/how often/i);
  });
});
