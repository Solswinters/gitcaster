/**
 * Performance monitoring and Web Vitals tracking
 */

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

export interface PageLoadMetric {
  url: string;
  loadTime: number;
  domContentLoaded: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  timestamp: number;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  size?: number;
  type: string;
}

class PerformanceMonitor {
  private pageLoadMetrics: PageLoadMetric[] = [];
  private resourceTimings: ResourceTiming[] = [];
  
  /**
   * Track Web Vitals (CLS, FID, LCP, FCP, TTFB)
   */
  reportWebVitals(metric: WebVitalsMetric): void {
    // Log metric
    console.log('[Web Vitals]', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });

    // Send to analytics in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      this.sendToAnalytics('web-vital', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        page: window.location.pathname,
      });
    }
  }

  /**
   * Track page load performance
   */
  trackPageLoad(url: string): void {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!perfData) return;

    const metric: PageLoadMetric = {
      url,
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      timestamp: Date.now(),
    };

    // Try to get paint metrics
    const paintEntries = window.performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-paint') {
        metric.firstPaint = entry.startTime;
      } else if (entry.name === 'first-contentful-paint') {
        metric.firstContentfulPaint = entry.startTime;
      }
    });

    this.pageLoadMetrics.push(metric);
    
    // Keep only last 50 entries
    if (this.pageLoadMetrics.length > 50) {
      this.pageLoadMetrics.shift();
    }

    console.log('[Page Load]', metric);

    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics('page-load', metric);
    }
  }

  /**
   * Track resource loading performance
   */
  trackResourcePerformance(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    resources.forEach((resource) => {
      const timing: ResourceTiming = {
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: resource.initiatorType,
      };

      this.resourceTimings.push(timing);
    });

    // Keep only last 100 entries
    if (this.resourceTimings.length > 100) {
      this.resourceTimings.splice(0, this.resourceTimings.length - 100);
    }
  }

  /**
   * Measure function execution time
   */
  measureFunction<T>(
    name: string,
    fn: () => T,
    options?: { logResult?: boolean; sendToAnalytics?: boolean }
  ): T {
    const startTime = performance.now();
    
    try {
      const result = fn();
      const duration = performance.now() - startTime;
      
      if (options?.logResult !== false) {
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      }
      
      if (options?.sendToAnalytics && process.env.NODE_ENV === 'production') {
        this.sendToAnalytics('function-timing', {
          function_name: name,
          duration,
        });
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Measure async function execution time
   */
  async measureAsyncFunction<T>(
    name: string,
    fn: () => Promise<T>,
    options?: { logResult?: boolean; sendToAnalytics?: boolean }
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      if (options?.logResult !== false) {
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      }
      
      if (options?.sendToAnalytics && process.env.NODE_ENV === 'production') {
        this.sendToAnalytics('function-timing', {
          function_name: name,
          duration,
        });
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Mark a custom performance point
   */
  mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark: string): number | null {
    if (typeof window === 'undefined' || !window.performance) {
      return null;
    }

    try {
      window.performance.measure(name, startMark, endMark);
      const measure = window.performance.getEntriesByName(name)[0];
      return measure ? measure.duration : null;
    } catch (error) {
      console.error(`Failed to measure ${name}:`, error);
      return null;
    }
  }

  /**
   * Get all page load metrics
   */
  getPageLoadMetrics(): PageLoadMetric[] {
    return [...this.pageLoadMetrics];
  }

  /**
   * Get resource timings
   */
  getResourceTimings(): ResourceTiming[] {
    return [...this.resourceTimings];
  }

  /**
   * Get average page load time
   */
  getAveragePageLoad(): number {
    if (this.pageLoadMetrics.length === 0) return 0;
    
    const total = this.pageLoadMetrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    return total / this.pageLoadMetrics.length;
  }

  /**
   * Clear all stored metrics
   */
  clear(): void {
    this.pageLoadMetrics = [];
    this.resourceTimings = [];
  }

  /**
   * Send metrics to analytics service
   */
  private sendToAnalytics(eventName: string, data: any): void {
    // TODO: Integrate with actual analytics service (Google Analytics, Mixpanel, etc.)
    console.log('[Analytics]', eventName, data);
    
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, data);
    }
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for Web Vitals reporting
 */
export function useReportWebVitals(onReport?: (metric: WebVitalsMetric) => void) {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      const reportHandler = (metric: any) => {
        performanceMonitor.reportWebVitals(metric);
        onReport?.(metric);
      };

      onCLS(reportHandler);
      onFID(reportHandler);
      onFCP(reportHandler);
      onLCP(reportHandler);
      onTTFB(reportHandler);
    });
  }
}

