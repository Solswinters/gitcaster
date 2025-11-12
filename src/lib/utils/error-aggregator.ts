/**
 * Aggregate and group similar errors
 */

interface AggregatedError {
  message: string;
  count: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  stackTrace?: string;
}

class ErrorAggregator {
  private errors: Map<string, AggregatedError> = new Map();

  /**
   * Add an error to the aggregator
   */
  add(error: Error) {
    const key = this.getErrorKey(error);
    const existing = this.errors.get(key);

    if (existing) {
      existing.count++;
      existing.lastOccurrence = new Date();
    } else {
      this.errors.set(key, {
        message: error.message,
        count: 1,
        firstOccurrence: new Date(),
        lastOccurrence: new Date(),
        stackTrace: error.stack,
      });
    }
  }

  /**
   * Get aggregated errors
   */
  getAll(): AggregatedError[] {
    return Array.from(this.errors.values()).sort((a, b) => b.count - a.count);
  }

  /**
   * Get errors that occurred more than threshold times
   */
  getFrequent(threshold: number = 3): AggregatedError[] {
    return this.getAll().filter(err => err.count >= threshold);
  }

  /**
   * Clear all errors
   */
  clear() {
    this.errors.clear();
  }

  /**
   * Generate a unique key for an error
   */
  private getErrorKey(error: Error): string {
    return `${error.name}:${error.message}`;
  }
}

export const errorAggregator = new ErrorAggregator();

