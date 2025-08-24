import { test, expect } from '@playwright/test';

test('Quick test - verify app loads', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Check if page loads
  await expect(page.locator('body')).toBeVisible();

  // Check if we can see some Hebrew text
  await expect(page.locator('text=ברוכים')).toBeVisible({ timeout: 10000 });

  console.log('✅ App loaded successfully!');
});
