// Performance monitoring utilities

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics | null = null;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // מדידת זמן טעינה
  measureLoadTime(): number {
    const loadTime = performance.now();
    return Math.round(loadTime);
  }

  // מדידת First Contentful Paint
  measureFirstContentfulPaint(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcp) {
            resolve(Math.round(fcp.startTime));
            observer.disconnect();
          }
        });

        observer.observe({ entryTypes: ['paint'] });
      } else {
        // Fallback for older browsers
        resolve(0);
      }
    });
  }

  // מדידת Largest Contentful Paint
  measureLargestContentfulPaint(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          if (lcp) {
            resolve(Math.round(lcp.startTime));
            observer.disconnect();
          }
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } else {
        resolve(0);
      }
    });
  }

  // מדידת First Input Delay
  measureFirstInputDelay(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fid = entries.find(entry => entry.entryType === 'first-input') as PerformanceEntry & { processingStart: number; startTime: number };
          if (fid) {
            resolve(Math.round(fid.processingStart - fid.startTime));
            observer.disconnect();
          }
        });

        observer.observe({ entryTypes: ['first-input'] });
      } else {
        resolve(0);
      }
    });
  }

  // מדידת Cumulative Layout Shift
  measureCumulativeLayoutShift(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry) => {
            const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
            if (!layoutShiftEntry.hadRecentInput) {
              cls += layoutShiftEntry.value;
            }
          });
        });

        observer.observe({ entryTypes: ['layout-shift'] });

        // Stop measuring after 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(Math.round(cls * 1000) / 1000);
        }, 5000);
      } else {
        resolve(0);
      }
    });
  }

  // איסוף כל המדדים
  async collectMetrics(): Promise<PerformanceMetrics> {
    const [fcp, lcp, fid, cls] = await Promise.all([
      this.measureFirstContentfulPaint(),
      this.measureLargestContentfulPaint(),
      this.measureFirstInputDelay(),
      this.measureCumulativeLayoutShift()
    ]);

    this.metrics = {
      loadTime: this.measureLoadTime(),
      firstContentfulPaint: fcp,
      largestContentfulPaint: lcp,
      firstInputDelay: fid,
      cumulativeLayoutShift: cls
    };

    return this.metrics;
  }

  // שליחת המדדים לשרת
  async sendMetrics(metrics: PerformanceMetrics): Promise<void> {
    try {
      await fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metrics,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.warn('Failed to send performance metrics:', error);
    }
  }

  // בדיקת ביצועים
  getPerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100;

    // FCP scoring
    if (metrics.firstContentfulPaint > 2000) score -= 20;
    else if (metrics.firstContentfulPaint > 1500) score -= 10;

    // LCP scoring
    if (metrics.largestContentfulPaint > 4000) score -= 25;
    else if (metrics.largestContentfulPaint > 2500) score -= 15;

    // FID scoring
    if (metrics.firstInputDelay > 300) score -= 25;
    else if (metrics.firstInputDelay > 100) score -= 15;

    // CLS scoring
    if (metrics.cumulativeLayoutShift > 0.25) score -= 20;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 10;

    return Math.max(0, score);
  }

  // ניטור בזמן אמת
  startRealTimeMonitoring(): void {
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry) => {
          if (entry.duration > 50) {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  // בדיקת זיכרון
  getMemoryInfo(): { used: number; total: number; limit: number } | null {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (memory) {
        return {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        };
      }
      return null;
    }
    return null;
  }
}

// Utility functions
export const performanceMonitor = PerformanceMonitor.getInstance();

// Auto-start monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.startRealTimeMonitoring();

  // Collect metrics after page load
  window.addEventListener('load', async () => {
    setTimeout(async () => {
      const metrics = await performanceMonitor.collectMetrics();
      const score = performanceMonitor.getPerformanceScore(metrics);

      console.log('Performance Metrics:', metrics);
      console.log('Performance Score:', score);

      // Send metrics to server
      await performanceMonitor.sendMetrics(metrics);
    }, 1000);
  });
}
