/**
 * Analytics domain model
 */

export class AnalyticsModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly eventType: string,
    public readonly eventData: Record<string, any>,
    public readonly timestamp: Date,
    public readonly sessionId?: string
  ) {}

  /**
   * Create from database record
   */
  static fromDatabase(record: any): AnalyticsModel {
    return new AnalyticsModel(
      record.id,
      record.userId,
      record.eventType,
      record.eventData,
      new Date(record.timestamp),
      record.sessionId
    );
  }

  /**
   * Convert to database record
   */
  toDatabase() {
    return {
      id: this.id,
      userId: this.userId,
      eventType: this.eventType,
      eventData: this.eventData,
      timestamp: this.timestamp,
      sessionId: this.sessionId,
    };
  }

  /**
   * Check if event is within time range
   */
  isWithinRange(startDate: Date, endDate: Date): boolean {
    return (
      this.timestamp >= startDate &&
      this.timestamp <= endDate
    );
  }
}

