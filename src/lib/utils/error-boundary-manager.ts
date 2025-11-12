/**
 * Global error boundary state management
 */

type ErrorBoundaryCallback = (error: Error, errorInfo: React.ErrorInfo) => void;

class ErrorBoundaryManager {
  private callbacks: ErrorBoundaryCallback[] = [];

  /**
   * Register a global error handler
   */
  register(callback: ErrorBoundaryCallback): () => void {
    this.callbacks.push(callback);
    
    // Return unregister function
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all registered handlers
   */
  notify(error: Error, errorInfo: React.ErrorInfo): void {
    this.callbacks.forEach(callback => {
      try {
        callback(error, errorInfo);
      } catch (err) {
        console.error('Error in error boundary callback:', err);
      }
    });
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.callbacks = [];
  }
}

export const errorBoundaryManager = new ErrorBoundaryManager();

