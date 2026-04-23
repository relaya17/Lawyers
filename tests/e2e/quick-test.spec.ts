import { test, expect } from '@playwright/test';

test('Quick test - verify app loads', async ({ page }) => {
  // Navigate to the app (baseURL is set in playwright.config.ts)
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Check if page loads
  await expect(page.locator('body')).toBeVisible();

  // Check if we can see the main hero header (language-agnostic; app supports he/en/ar)
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({ timeout: 15000 });

  // Check call-to-action buttons exist (allow localized labels)
  await expect(
    page.getByRole('button', {
      name: /Get Started|התחל עכשיו|התחל ללמוד|התחל עכשיו\s*בחינם|ابدأ الآن/i
    }).first()
  ).toBeVisible();
  await expect(
    page.getByRole('button', {
      name: /Try Simulation|נסה סימולציה|נסה את הסימולטור|סימולטור|جرّب المحاكاة/i
    }).first()
  ).toBeVisible();

  console.log('✅ App loaded successfully!');
});
