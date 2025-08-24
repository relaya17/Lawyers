// Performance Configuration for ContractLab Pro
export const performanceConfig = {
  // Bundle Analysis
  bundle: {
    analyze: true,
    threshold: {
      size: 500 * 1024, // 500KB
      chunks: 10,
      modules: 100
    },
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage'
    ]
  },

  // Web Vitals
  webVitals: {
    lcp: 2500, // Largest Contentful Paint (2.5s)
    fid: 100,  // First Input Delay (100ms)
    cls: 0.1,  // Cumulative Layout Shift (0.1)
    fcp: 1800, // First Contentful Paint (1.8s)
    ttfb: 800  // Time to First Byte (800ms)
  },

  // Caching Strategy
  caching: {
    static: {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      immutable: true
    },
    dynamic: {
      maxAge: 60 * 60, // 1 hour
      staleWhileRevalidate: 24 * 60 * 60 // 24 hours
    },
    api: {
      maxAge: 5 * 60, // 5 minutes
      staleWhileRevalidate: 60 * 60 // 1 hour
    }
  },

  // Image Optimization
  images: {
    formats: ['webp', 'avif'],
    sizes: [320, 640, 768, 1024, 1280, 1920],
    quality: 80,
    lazy: true,
    placeholder: 'blur'
  },

  // Code Splitting
  codeSplitting: {
    chunks: 'all',
    minSize: 20000,
    maxSize: 244000,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      },
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'all',
        enforce: true
      }
    }
  },

  // Compression
  compression: {
    gzip: true,
    brotli: true,
    level: 6,
    threshold: 1024
  },

  // Monitoring
  monitoring: {
    enableRealUserMonitoring: true,
    enableSyntheticMonitoring: true,
    sampleRate: 0.1, // 10% of users
    collectMetrics: [
      'navigation',
      'resource',
      'paint',
      'layout-shift',
      'largest-contentful-paint',
      'first-input'
    ]
  },

  // Database Performance
  database: {
    connectionPool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200
    },
    queryTimeout: 30000,
    enableQueryLogging: false,
    enableSlowQueryLogging: true,
    slowQueryThreshold: 1000 // 1 second
  },

  // API Performance
  api: {
    timeout: 30000,
    retries: 3,
    circuitBreaker: {
      threshold: 5,
      timeout: 60000,
      resetTimeout: 300000
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // requests per window
    }
  }
};

export default performanceConfig;
