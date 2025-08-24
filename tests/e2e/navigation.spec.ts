import { test, expect } from '@playwright/test';

test.describe('Navigation and Core Functionality Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the home page before each test
        await page.goto('http://localhost:5174');
        // Wait for the page to load
        await page.waitForLoadState('networkidle');
    });

    test('should display home page with all navigation links', async ({ page }) => {
        // Check if main navigation is visible
        await expect(page.locator('nav')).toBeVisible();

        // Check for all main navigation items
        const navItems = [
            'בית',
            'חוזים',
            'ניהול גרסאות',
            'מעבדה',
            'ניתוח סיכון',
            'מו"מ',
            'שוק',
            'תבניות',
            'מפת זרימה',
            'אבטחה',
            'הגדרות',
            'פרופיל'
        ];

        for (const item of navItems) {
            await expect(page.getByRole('link', { name: item })).toBeVisible();
        }
    });

    test('should navigate to all main pages successfully', async ({ page }) => {
        const navigationTests = [
            { link: 'בית', expectedTitle: 'ברוכים הבאים' },
            { link: 'חוזים', expectedTitle: 'חוזים' },
            { link: 'ניהול גרסאות', expectedTitle: 'ניהול גרסאות' },
            { link: 'מעבדה', expectedTitle: 'מעבדה' },
            { link: 'ניתוח סיכון', expectedTitle: 'ניתוח סיכון' },
            { link: 'מו"מ', expectedTitle: 'מו"מ' },
            { link: 'שוק', expectedTitle: 'שוק' },
            { link: 'תבניות', expectedTitle: 'תבניות' },
            { link: 'מפת זרימה', expectedTitle: 'מפת זרימת חוזים' },
            { link: 'אבטחה', expectedTitle: 'מרכז האבטחה' },
            { link: 'הגדרות', expectedTitle: 'הגדרות' },
            { link: 'פרופיל', expectedTitle: 'פרופיל' }
        ];

        for (const testCase of navigationTests) {
            // Click on navigation link
            await page.getByRole('link', { name: testCase.link }).click();

            // Wait for page to load
            await page.waitForLoadState('networkidle');

            // Check if page title is visible (case insensitive)
            await expect(page.locator('h1, h2, h3, h4, h5, h6')).toContainText(testCase.expectedTitle, { ignoreCase: true });

            // Verify we're not on a 404 page
            await expect(page.locator('text=404')).not.toBeVisible();
            await expect(page.locator('text=Not Found')).not.toBeVisible();
        }
    });

    test('should test version control page functionality', async ({ page }) => {
        // Navigate to version control page
        await page.getByRole('link', { name: 'ניהול גרסאות' }).click();
        await page.waitForLoadState('networkidle');

        // Check if page loads with expected elements
        await expect(page.locator('text=ניהול גרסאות')).toBeVisible();
        await expect(page.locator('text=צור גרסה חדשה')).toBeVisible();

        // Test create new version button
        const createButton = page.getByRole('button', { name: 'צור גרסה חדשה' });
        await expect(createButton).toBeEnabled();

        // Click create version button
        await createButton.click();

        // Wait for notification to appear
        await expect(page.locator('.MuiAlert-root')).toBeVisible({ timeout: 5000 });
    });

    test('should test flow map page functionality', async ({ page }) => {
        // Navigate to flow map page
        await page.getByRole('link', { name: 'מפת זרימה' }).click();
        await page.waitForLoadState('networkidle');

        // Check if page loads with expected elements
        await expect(page.locator('text=מפת זרימת חוזים')).toBeVisible();
        await expect(page.locator('text=צור זרימה חדשה')).toBeVisible();

        // Check for flow list
        await expect(page.locator('text=זרימות פעילות')).toBeVisible();

        // Check for tabs
        await expect(page.locator('text=תהליך העבודה')).toBeVisible();
        await expect(page.locator('text=מסמכים')).toBeVisible();
        await expect(page.locator('text=סיכונים')).toBeVisible();
        await expect(page.locator('text=סטטיסטיקות')).toBeVisible();
    });

    test('should test security page functionality', async ({ page }) => {
        // Navigate to security page
        await page.getByRole('link', { name: 'אבטחה' }).click();
        await page.waitForLoadState('networkidle');

        // Check if page loads with expected elements
        await expect(page.locator('text=מרכז האבטחה')).toBeVisible();
        await expect(page.locator('text=הגדרות אבטחה')).toBeVisible();

        // Check for security metrics
        await expect(page.locator('text=דירוג אבטחה כללי')).toBeVisible();
        await expect(page.locator('text=התקפות חסומות')).toBeVisible();

        // Check for tabs
        await expect(page.locator('text=התראות אבטחה')).toBeVisible();
        await expect(page.locator('text=עמידה בתקנים')).toBeVisible();
        await expect(page.locator('text=יומן גישה')).toBeVisible();
        await expect(page.locator('text=המלצות')).toBeVisible();
    });

    test('should test home page feature cards', async ({ page }) => {
        // Check if we're on home page
        await expect(page.locator('text=ברוכים הבאים')).toBeVisible();

        // Check for feature cards
        const featureCards = [
            'ניהול חוזים',
            'ניתוח סיכונים',
            'מו"מ דיגיטלי',
            'ניהול גרסאות'
        ];

        for (const card of featureCards) {
            await expect(page.locator(`text=${card}`)).toBeVisible();
        }

        // Test clicking on version control feature card
        await page.locator('text=ניהול גרסאות').click();
        await page.waitForLoadState('networkidle');

        // Should navigate to version control page
        await expect(page.locator('text=ניהול גרסאות')).toBeVisible();
    });

    test('should test responsive navigation', async ({ page }) => {
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Check if navigation is still accessible
        await expect(page.locator('nav')).toBeVisible();

        // Test tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('nav')).toBeVisible();

        // Test desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });
        await expect(page.locator('nav')).toBeVisible();
    });

    test('should test language switching', async ({ page }) => {
        // Look for language switcher
        const languageSwitcher = page.locator('[data-testid="language-switcher"], .language-switcher, button:has-text("EN")');

        if (await languageSwitcher.isVisible()) {
            // Test switching to English
            await languageSwitcher.click();
            await page.waitForLoadState('networkidle');

            // Check if some text changed to English
            await expect(page.locator('text=Welcome, Home, Contracts')).toBeVisible({ timeout: 3000 });
        }
    });

    test('should test error handling', async ({ page }) => {
        // Try to navigate to a non-existent page
        await page.goto('http://localhost:5174/non-existent-page');
        await page.waitForLoadState('networkidle');

        // Should show 404 or error page
        const errorContent = page.locator('text=404, Not Found, שגיאה, דף לא נמצא');
        await expect(errorContent).toBeVisible({ timeout: 5000 });
    });

    test('should test loading states', async ({ page }) => {
        // Navigate to version control page which has loading states
        await page.getByRole('link', { name: 'ניהול גרסאות' }).click();

        // Should show loading indicator briefly
        await expect(page.locator('.MuiLinearProgress-root, .loading, [role="progressbar"]')).toBeVisible({ timeout: 2000 });

        // Wait for content to load
        await page.waitForLoadState('networkidle');

        // Loading should be gone
        await expect(page.locator('text=טוען')).not.toBeVisible();
    });

    test('should test form interactions', async ({ page }) => {
        // Navigate to version control page
        await page.getByRole('link', { name: 'ניהול גרסאות' }).click();
        await page.waitForLoadState('networkidle');

        // Test create version button interaction
        const createButton = page.getByRole('button', { name: 'צור גרסה חדשה' });

        // Button should be enabled
        await expect(createButton).toBeEnabled();

        // Click and check for loading state
        await createButton.click();

        // Should show success notification
        await expect(page.locator('.MuiAlert-root')).toBeVisible({ timeout: 5000 });
    });

    test('should test accessibility', async ({ page }) => {
        // Check for proper heading structure
        await expect(page.locator('h1')).toBeVisible();

        // Check for proper navigation landmarks
        await expect(page.locator('nav')).toBeVisible();

        // Check for proper button roles
        const buttons = page.locator('button');
        await expect(buttons.first()).toBeVisible();

        // Check for proper link roles
        const links = page.locator('a');
        await expect(links.first()).toBeVisible();
    });

    test('should test performance', async ({ page }) => {
        // Measure page load time
        const startTime = Date.now();
        await page.goto('http://localhost:5174');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        // Page should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);

        // Check for no console errors
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Navigate to a few pages to check for errors
        await page.getByRole('link', { name: 'ניהול גרסאות' }).click();
        await page.waitForLoadState('networkidle');

        await page.getByRole('link', { name: 'מפת זרימה' }).click();
        await page.waitForLoadState('networkidle');

        await page.getByRole('link', { name: 'אבטחה' }).click();
        await page.waitForLoadState('networkidle');

        // Should have no console errors
        expect(consoleErrors.length).toBe(0);
    });
});
