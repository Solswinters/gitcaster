/**
 * Performance monitoring utilities
 * Tracks performance metrics and reports them
 */

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []

  /**
   * Track a performance metric
   */
  track(name: string, value: number, unit: string = 'ms') {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    }

    this.metrics.push(metric)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value}${unit}`)
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportMetric(metric)
    }
  }

  /**
   * Measure execution time of a function
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<T> {
    const start = performance.now()
    
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.track(name, duration)
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.track(`${name}_error`, duration)
      throw error
    }
  }

  /**
   * Track page load time
   */
  trackPageLoad() {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (perfData) {
        this.track('page_load_time', perfData.loadEventEnd - perfData.fetchStart)
        this.track('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.fetchStart)
        this.track('first_byte', perfData.responseStart - perfData.requestStart)
      }
    })
  }

  /**
   * Track API request time
   */
  trackAPIRequest(endpoint: string, duration: number, status: number) {
    this.track(`api_${endpoint}_${status}`, duration)
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = []
  }

  /**
   * Report metric to analytics service
   */
  private reportMetric(metric: PerformanceMetric) {
    // TODO: Send to analytics service (e.g., Google Analytics, Mixpanel)
    // Example: analytics.track('performance_metric', metric)
  }
}

export const performanceMonitor = new PerformanceMonitor()

