import { test, expect } from '@playwright/test';

test.describe('Layout snapshots (manual triage aid)', () => {
  const viewports = [
    { name: 'mobile-375', width: 375, height: 667 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1280', width: 1280, height: 720 },
  ] as const;

  for (const vp of viewports) {
    test(`home layout @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // Core landmarks exist
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();

      // Wait for main hero content to render (language-agnostic)
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15000 });

      await page.screenshot({ path: `test-results/layout-${vp.name}.png`, fullPage: true });

      // Bottom-of-home snapshot (focus on responsiveness of the footer/stats area)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `test-results/layout-home-bottom-${vp.name}.png`, fullPage: false });
    });

    test(`contracts layout @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/contracts', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
      await page.screenshot({ path: `test-results/layout-contracts-${vp.name}.png`, fullPage: true });
    });

    test(`crm layout @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/crm', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
      await page.screenshot({ path: `test-results/layout-crm-${vp.name}.png`, fullPage: true });
    });

    test(`contract-templates layout @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/contract-templates', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
      await page.screenshot({ path: `test-results/layout-contract-templates-${vp.name}.png`, fullPage: true });
    });

    test(`contract-template-details layout @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/contract-templates/1', { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('banner')).toBeVisible();
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
      await page.screenshot({ path: `test-results/layout-contract-template-details-${vp.name}.png`, fullPage: true });
    });
  }
});


