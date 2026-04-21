import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
    testDir: './tests/e2e',
    outputDir: './test-results',
    timeout: 30_000,
    expect: { timeout: 10_000 },
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 1 : undefined,
    reporter: isCI
        ? [['github'], ['html', { open: 'never' }]]
        : [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://localhost:5852',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
    },

    projects: [
        // Desktop — always run
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Mobile — always run (layout snapshots test mobile viewports)
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        // Cross-browser — CI only
        ...(isCI
            ? [
                  {
                      name: 'firefox',
                      use: { ...devices['Desktop Firefox'] },
                  },
                  {
                      name: 'webkit',
                      use: { ...devices['Desktop Safari'] },
                  },
                  {
                      name: 'Mobile Safari',
                      use: { ...devices['iPhone 12'] },
                  },
              ]
            : []),
    ],

    webServer: {
        command: 'pnpm -F @lawyers/web dev',
        url: 'http://localhost:5852',
        reuseExistingServer: !isCI,
        timeout: 120_000,
    },
});
