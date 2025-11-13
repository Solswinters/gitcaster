/**
 * Performance Monitoring Utility
 * 
 * Tracks and reports application performance metrics
 */

import { logger } from '../logger/logger';

export interface PerformanceMark {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private marks = new Map<string, number>();
  private measurements = new Map<string, PerformanceMark>();
  private isEnabled = typeof window !== 'undefined' && 'performance' in window;

  /**
   * Start a performance measurement
   */
  start(name: string): void {
    if (!this.isEnabled) return;

    this.marks.set(name, performance.now());
  }

  /**
   * End a performance measurement
   */
  end(name: string): number | null {
    if (!this.isEnabled) return null;

    const startTime = this.marks.get(name);
    
    if (!startTime) {
      logger.warn(`Performance mark "${name}" not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    this.measurements.set(name, {
      name,
      startTime,
      endTime,
      duration,
    });

    this.marks.delete(name);

    logger.performance(name, duration);
    
    return duration;
  }

  /**
   * Measure a function execution time
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<T> {
    this.start(name);
    
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get a measurement
   */
  getMeasurement(name: string): PerformanceMark | undefined {
    return this.measurements.get(name);
  }

  /**
   * Get all measurements
   */
  getAllMeasurements(): PerformanceMark[] {
    return Array.from(this.measurements.values());
  }

  /**
   * Clear measurements
   */
  clear(): void {
    this.marks.clear();
    this.measurements.clear();
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals(): void {
    if (!this.isEnabled) return;

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          logger.performance('LCP', lastEntry.startTime, 'ms');
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry: any) => {
            logger.performance('FID', entry.processingStart - entry.startTime, 'ms');
          });
        });

        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
              logger.performance('CLS', clsScore, '');
            }
          });
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        logger.error('Failed to observe web vitals', error as Error);
      }
    }
  }

  /**
   * Track page load performance
   */
  trackPageLoad(): void {
    if (!this.isEnabled) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        
        if (navigation) {
          logger.performance('DNS Lookup', navigation.domainLookupEnd - navigation.domainLookupStart);
          logger.performance('TCP Connection', navigation.connectEnd - navigation.connectStart);
          logger.performance('Request', navigation.responseStart - navigation.requestStart);
          logger.performance('Response', navigation.responseEnd - navigation.responseStart);
          logger.performance('DOM Processing', navigation.domComplete - navigation.domLoading);
          logger.performance('Total Load Time', navigation.loadEventEnd - navigation.fetchStart);
        }
      }, 0);
    });
  }

  /**
   * Track resource loading
   */
  trackResources(): void {
    if (!this.isEnabled) return;

    const resources = performance.getEntriesByType('resource');
    
    resources.forEach((resource: any) => {
      if (resource.duration > 1000) {
        // Log slow resources (> 1 second)
        logger.warn(`Slow resource: ${resource.name} (${resource.duration}ms)`);
      }
    });
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): any | null {
    if (!this.isEnabled) return null;

    const memory = (performance as any).memory;
    
    if (memory) {
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }

    return null;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-track on client side
if (typeof window !== 'undefined') {
  performanceMonitor.trackWebVitals();
  performanceMonitor.trackPageLoad();
}

