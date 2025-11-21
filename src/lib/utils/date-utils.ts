/**
 * Date manipulation utility functions
 * Provides reusable date operations
 */

export class DateUtils {
  /**
   * Format date to ISO string
   */
  static toISO(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parse ISO string to date
   */
  static fromISO(isoString: string): Date {
    return new Date(isoString);
  }

  /**
   * Add days to date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Add months to date
   */
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Add years to date
   */
  static addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  /**
   * Subtract days from date
   */
  static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days);
  }

  /**
   * Get difference in days between two dates
   */
  static daysDifference(date1: Date, date2: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((date2.getTime() - date1.getTime()) / msPerDay);
  }

  /**
   * Get difference in hours
   */
  static hoursDifference(date1: Date, date2: Date): number {
    const msPerHour = 60 * 60 * 1000;
    return Math.floor((date2.getTime() - date1.getTime()) / msPerHour);
  }

  /**
   * Get difference in minutes
   */
  static minutesDifference(date1: Date, date2: Date): number {
    const msPerMinute = 60 * 1000;
    return Math.floor((date2.getTime() - date1.getTime()) / msPerMinute);
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  /**
   * Check if date is yesterday
   */
  static isYesterday(date: Date): boolean {
    const yesterday = this.subtractDays(new Date(), 1);
    return this.isSameDay(date, yesterday);
  }

  /**
   * Check if date is tomorrow
   */
  static isTomorrow(date: Date): boolean {
    const tomorrow = this.addDays(new Date(), 1);
    return this.isSameDay(date, tomorrow);
  }

  /**
   * Check if two dates are the same day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Check if date is in the future
   */
  static isFuture(date: Date): boolean {
    return date > new Date();
  }

  /**
   * Check if date is between two dates
   */
  static isBetween(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }

  /**
   * Get start of day
   */
  static startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of day
   */
  static endOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Get start of week
   */
  static startOfWeek(date: Date, startDayOfWeek: number = 0): Date {
    const result = new Date(date);
    const day = result.getDay();
    const diff = (day < startDayOfWeek ? 7 : 0) + day - startDayOfWeek;
    result.setDate(result.getDate() - diff);
    return this.startOfDay(result);
  }

  /**
   * Get end of week
   */
  static endOfWeek(date: Date, startDayOfWeek: number = 0): Date {
    const result = this.startOfWeek(date, startDayOfWeek);
    result.setDate(result.getDate() + 6);
    return this.endOfDay(result);
  }

  /**
   * Get start of month
   */
  static startOfMonth(date: Date): Date {
    const result = new Date(date);
    result.setDate(1);
    return this.startOfDay(result);
  }

  /**
   * Get end of month
   */
  static endOfMonth(date: Date): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1, 0);
    return this.endOfDay(result);
  }

  /**
   * Get start of year
   */
  static startOfYear(date: Date): Date {
    const result = new Date(date);
    result.setMonth(0, 1);
    return this.startOfDay(result);
  }

  /**
   * Get end of year
   */
  static endOfYear(date: Date): Date {
    const result = new Date(date);
    result.setMonth(11, 31);
    return this.endOfDay(result);
  }

  /**
   * Get days in month
   */
  static daysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  /**
   * Get week number
   */
  static getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  /**
   * Get quarter
   */
  static getQuarter(date: Date): number {
    return Math.floor(date.getMonth() / 3) + 1;
  }

  /**
   * Check if leap year
   */
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * Get age from birthdate
   */
  static getAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Format as relative time (e.g., "2 hours ago")
   */
  static formatRelative(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;

    return `${Math.floor(seconds / 31536000)} years ago`;
  }

  /**
   * Format date
   */
  static format(date: Date, format: string): string {
    const map: Record<string, string> = {
      YYYY: date.getFullYear().toString(),
      YY: date.getFullYear().toString().slice(-2),
      MM: String(date.getMonth() + 1).padStart(2, '0'),
      M: String(date.getMonth() + 1),
      DD: String(date.getDate()).padStart(2, '0'),
      D: String(date.getDate()),
      HH: String(date.getHours()).padStart(2, '0'),
      H: String(date.getHours()),
      hh: String(date.getHours() % 12 || 12).padStart(2, '0'),
      h: String(date.getHours() % 12 || 12),
      mm: String(date.getMinutes()).padStart(2, '0'),
      m: String(date.getMinutes()),
      ss: String(date.getSeconds()).padStart(2, '0'),
      s: String(date.getSeconds()),
      A: date.getHours() < 12 ? 'AM' : 'PM',
      a: date.getHours() < 12 ? 'am' : 'pm',
    };

    return format.replace(/YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g, (match) => map[match]);
  }

  /**
   * Parse date from string
   */
  static parse(dateString: string, format: string): Date | null {
    try {
      // Simple implementation - can be expanded
      return new Date(dateString);
    } catch {
      return null;
    }
  }

  /**
   * Get timezone offset in minutes
   */
  static getTimezoneOffset(date: Date = new Date()): number {
    return date.getTimezoneOffset();
  }

  /**
   * Convert to UTC
   */
  static toUTC(date: Date): Date {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }

  /**
   * Convert from UTC
   */
  static fromUTC(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  /**
   * Get day name
   */
  static getDayName(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }

  /**
   * Get month name
   */
  static getMonthName(date: Date, locale: string = 'en-US'): string {
    return date.toLocaleDateString(locale, { month: 'long' });
  }

  /**
   * Get all dates in range
   */
  static getDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  /**
   * Get business days between two dates (excluding weekends)
   */
  static getBusinessDays(start: Date, end: Date): number {
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  /**
   * Check if weekend
   */
  static isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  /**
   * Check if weekday
   */
  static isWeekday(date: Date): boolean {
    return !this.isWeekend(date);
  }

  /**
   * Get next weekday
   */
  static getNextWeekday(date: Date): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + 1);

    while (this.isWeekend(result)) {
      result.setDate(result.getDate() + 1);
    }

    return result;
  }

  /**
   * Get previous weekday
   */
  static getPreviousWeekday(date: Date): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - 1);

    while (this.isWeekend(result)) {
      result.setDate(result.getDate() - 1);
    }

    return result;
  }
}

