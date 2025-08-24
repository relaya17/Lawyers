// Test Configuration for ContractLab Pro
export const testConfig = {
  // Unit Tests
  unit: {
    framework: 'vitest',
    coverage: {
      enabled: true,
      threshold: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80
      },
      exclude: [
        'node_modules/**',
        'dist/**',
        'build/**',
        'coverage/**',
        '**/*.d.ts',
        '**/*.config.js',
        '**/*.config.ts'
      ]
    },
    timeout: 10000,
    retries: 2
  },

  // Integration Tests
  integration: {
    framework: 'vitest',
    database: {
      setup: 'test-db',
      cleanup: true,
      seed: true
    },
    api: {
      baseUrl: 'http://localhost:4000',
      timeout: 30000
    },
    timeout: 30000
  },

  // E2E Tests
  e2e: {
    framework: 'playwright',
    browsers: ['chromium', 'firefox', 'webkit'],
    devices: [
      'Desktop Chrome',
      'Desktop Firefox',
      'Desktop Safari',
      'iPhone 12',
      'iPad Pro'
    ],
    viewport: {
      width: 1280,
      height: 720
    },
    timeout: 60000,
    retries: 1,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // Performance Tests
  performance: {
    framework: 'playwright',
    metrics: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-input-delay',
      'cumulative-layout-shift'
    ],
    thresholds: {
      'first-contentful-paint': 1800,
      'largest-contentful-paint': 2500,
      'first-input-delay': 100,
      'cumulative-layout-shift': 0.1
    }
  },

  // Security Tests
  security: {
    framework: 'snyk',
    scanTypes: [
      'vulnerabilities',
      'license-compliance',
      'code-quality',
      'container-security'
    ],
    failOn: 'high',
    monitor: true
  },

  // Accessibility Tests
  accessibility: {
    framework: 'axe-core',
    rules: {
      'color-contrast': 'error',
      'button-name': 'error',
      'image-alt': 'error',
      'form-field-multiple-labels': 'error'
    },
    include: ['**/*.tsx', '**/*.jsx'],
    exclude: ['node_modules/**']
  },

  // Visual Regression Tests
  visual: {
    framework: 'playwright',
    baseline: 'baseline',
    tolerance: 0.1,
    include: ['**/*.tsx', '**/*.jsx'],
    exclude: ['node_modules/**']
  },

  // Load Tests
  load: {
    framework: 'artillery',
    scenarios: [
      {
        name: 'Homepage Load',
        weight: 40,
        requests: [
          { method: 'GET', url: '/' }
        ]
      },
      {
        name: 'Contract Management',
        weight: 30,
        requests: [
          { method: 'GET', url: '/contracts' },
          { method: 'POST', url: '/api/contracts' }
        ]
      },
      {
        name: 'User Authentication',
        weight: 20,
        requests: [
          { method: 'POST', url: '/api/auth/login' },
          { method: 'POST', url: '/api/auth/logout' }
        ]
      }
    ],
    phases: [
      { duration: 60, arrivalRate: 10 },
      { duration: 120, arrivalRate: 20 },
      { duration: 60, arrivalRate: 10 }
    ]
  },

  // Test Data
  data: {
    fixtures: 'test/fixtures',
    factories: 'test/factories',
    seeders: 'test/seeders'
  },

  // Reporting
  reporting: {
    html: true,
    json: true,
    junit: true,
    coverage: true,
    screenshots: true,
    videos: true
  }
};

export default testConfig;
