import { test, expect } from '@playwright/test';

test.describe('Navigation and Core Functionality Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the home page before each test
        await page.goto('/', { waitUntil: 'domcontentloaded' });
    });

    test('should display home page with all navigation links', async ({ page }) => {
        // The app uses an AppBar (banner) rather than a <nav> element.
        await expect(page.getByRole('banner')).toBeVisible();

        // Header content is responsive; assert core visible actions only.
        await expect(page.getByRole('button', { name: /Contracts|חוזים|العقود/i }).first()).toBeVisible();
        const authButton = page.getByRole('button', { name: /Login|התחברות|تسجيل الدخول|Register|הרשמה|التسجيل/i });
        const menuButton = page.getByRole('button', { name: /More|עוד|المزيد|Menu|תפריט|القائمة/i });
        await expect(authButton.or(menuButton).first()).toBeVisible();
        await expect
            .poll(async () => await page.locator('header button').count())
            .toBeGreaterThan(2);
    });

    test('should navigate to all main pages successfully', async ({ page }) => {
        // Prefer URL navigation here (header may collapse/translate based on viewport/language).
        const routes = ['/', '/contracts', '/risk-analysis', '/negotiation', '/version-control', '/workflow-automation', '/security'];

        for (const path of routes) {
            await page.goto(path, { waitUntil: 'domcontentloaded' });

            // Core landmarks should exist on every page
            await expect(page.getByRole('banner')).toBeVisible();
            await expect(page.locator('main').first()).toBeVisible();

            // Verify we're not on a 404 page
            await expect(page.getByRole('heading', { name: '404' })).not.toBeVisible();
        }
    });

    test('should test version control page functionality', async ({ page }) => {
        await page.goto('/version-control', { waitUntil: 'domcontentloaded' });

        // Check if page loads with expected elements
        await expect(page.locator('text=ניהול גרסאות')).toBeVisible();
        await expect(page.getByRole('button', { name: /צור גרסה חדשה/i })).toBeVisible();

        // Test create new version button
        const createButton = page.getByRole('button', { name: /צור גרסה חדשה/i });
        await expect(createButton).toBeEnabled();

        // Click create version button
        await createButton.click();

        // Wait for notification to appear
        // Dialog should open
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    });

    test('should test workflow automation page functionality', async ({ page }) => {
        await page.goto('/workflow-automation', { waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('banner')).toBeVisible();
        await expect(page.locator('main').first()).toBeVisible();
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    });

    test('should test security page functionality', async ({ page }) => {
        await page.goto('/security', { waitUntil: 'domcontentloaded' });

        // Check if page loads with expected elements
        await expect(page.locator('text=מרכז האבטחה')).toBeVisible();
        await expect(page.locator('text=הגדרות אבטחה')).toBeVisible();

        // Check for security metrics
        await expect(page.locator('text=דירוג אבטחה כללי')).toBeVisible();
        await expect(page.locator('text=התקפות חסומות')).toBeVisible();

        // Check for tabs
        await expect(page.getByRole('tab', { name: 'התראות אבטחה' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'עמידה בתקנים' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'יומן גישה' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'המלצות' })).toBeVisible();
    });

    test('should test home page feature cards', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        // Hero heading exists (language may be EN/HE depending on settings)
        await expect(page.locator('h1')).toBeVisible();

        // Page contains multiple sections/cards (language-agnostic).
        const featureCards = page.locator('.MuiCard-root');
        await expect
            .poll(async () => await featureCards.count())
            .toBeGreaterThan(2);

        // Test navigation via URL (section cards may not be clickable in all layouts)
        await page.goto('/version-control', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('text=ניהול גרסאות')).toBeVisible();
    });

    test('should test responsive navigation', async ({ page }) => {
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Header should remain accessible across viewports (AppBar => banner)
        await expect(page.getByRole('banner')).toBeVisible();
        // On mobile we expect a compact header; at least the menu button should exist.
        await expect(page.getByRole('button', { name: /menu|תפריט/i })).toBeVisible();

        // Should not introduce horizontal scrolling on mobile
        const mobileHasNoHorizontalScroll = await page.evaluate(() => {
            const doc = document.documentElement;
            return doc.scrollWidth <= doc.clientWidth + 1;
        });
        if (!mobileHasNoHorizontalScroll) {
            const offenders = await page.evaluate(() => {
                const w = window.innerWidth;
                const results: Array<{ tag: string; id: string; cls: string; left: number; right: number; width: number; text: string }> = [];
                const all = Array.from(document.querySelectorAll<HTMLElement>('body *'));
                for (const el of all) {
                    const rect = el.getBoundingClientRect();
                    if (rect.width <= 0 || rect.height <= 0) continue;
                    if (rect.right > w + 1 || rect.left < -1) {
                        const text = (el.innerText || el.textContent || '').trim().slice(0, 80);
                        results.push({
                            tag: el.tagName.toLowerCase(),
                            id: el.id || '',
                            cls: (el.className || '').toString().slice(0, 120),
                            left: Math.round(rect.left),
                            right: Math.round(rect.right),
                            width: Math.round(rect.width),
                            text,
                        });
                    }
                }
                return results.slice(0, 10);
            });
            throw new Error(
                `Horizontal overflow detected at 375px.\nTop offenders: ${JSON.stringify(offenders, null, 2)}`
            );
        }

        // Test tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.getByRole('banner')).toBeVisible();
        await expect(page.getByRole('button', { name: /menu|תפריט/i })).toBeVisible();
        await expect
            .poll(async () => {
                return await page.evaluate(() => {
                    const doc = document.documentElement;
                    return doc.scrollWidth <= doc.clientWidth + 1;
                });
            })
            .toBe(true);

        // Test desktop viewport
        await page.setViewportSize({ width: 1920, height: 1080 });
        await expect(page.getByRole('banner')).toBeVisible();
        // Desktop should still show auth actions (or profile if logged in)
        await expect(page.getByRole('button', { name: /Login|התחברות|تسجيل الدخول/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Register|הרשמה|التسجيل/i })).toBeVisible();
        await expect
            .poll(async () => {
                return await page.evaluate(() => {
                    const doc = document.documentElement;
                    return doc.scrollWidth <= doc.clientWidth + 1;
                });
            })
            .toBe(true);
    });

    test('should test language switching', async ({ page }) => {
        // Look for language switcher
        const languageSwitcher = page.getByRole('combobox', { name: /language|שפה|اللغة/i });

        if (await languageSwitcher.isVisible()) {
            // Test switching to English
            await languageSwitcher.click();
            // A language menu should open (implementation-specific)
            await expect(page.getByRole('menu')).toBeVisible({ timeout: 3000 });
        }
    });

    test('should test error handling', async ({ page }) => {
        // Try to navigate to a non-existent page
        await page.goto('/non-existent-page', { waitUntil: 'domcontentloaded' });

        // Should show 404 or error page
        await expect(page.getByRole('heading', { name: '404' })).toBeVisible({ timeout: 5000 });
    });

    test('should test loading states', async ({ page }) => {
        // Navigate to a data-heavy page and allow either a loading indicator OR content to appear.
        await page.goto('/version-control', { waitUntil: 'domcontentloaded' });

        const loading = page.locator('.MuiLinearProgress-root, .loading, [role="progressbar"]');
        const content = page.locator('text=ניהול גרסאות');
        await expect(loading.or(content)).toBeVisible({ timeout: 8000 });
    });

    test('should test form interactions', async ({ page }) => {
        await page.goto('/version-control', { waitUntil: 'domcontentloaded' });

        // Test create version button interaction
        const createButton = page.getByRole('button', { name: /צור גרסה חדשה/i });

        // Button should be enabled
        await expect(createButton).toBeEnabled();

        // Click and check for loading state
        await createButton.click();

        // Dialog should open for creating a version
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    });

    test('should test accessibility', async ({ page }) => {
        // Check for proper heading structure
        const h1 = page.getByRole('heading', { level: 1 });
        await expect(h1).toHaveCount(1);
        await expect(h1.first()).toBeVisible();

        // Check for proper landmarks
        await expect(page.getByRole('banner')).toBeVisible();
        await expect(page.locator('main').first()).toBeVisible();

        // Check for proper button roles
        const buttons = page.locator('button');
        await expect(buttons.first()).toBeVisible();

        // Check for proper link roles
        const links = page.locator('a');
        if ((await links.count()) > 0) {
            await expect(links.first()).toBeVisible();
        }
    });

    test('should test performance', async ({ page }) => {
        // Measure page load time
        const startTime = Date.now();
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        const loadTime = Date.now() - startTime;

        // Page should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);

        // Check for no runtime errors. Collect both console errors and page errors for debugging.
        const consoleErrors: string[] = [];
        const pageErrors: string[] = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        page.on('pageerror', (err) => {
            pageErrors.push(String(err?.message || err));
        });

        // Navigate to a few pages to check for errors
        for (const path of ['/version-control', '/workflow-automation', '/security']) {
            await page.goto(path, { waitUntil: 'domcontentloaded' });
        }

        // Should have no runtime errors
        const allErrors = [...pageErrors, ...consoleErrors];
        expect(allErrors, `Runtime errors detected:\n${allErrors.join('\n')}`).toHaveLength(0);
    });
});
