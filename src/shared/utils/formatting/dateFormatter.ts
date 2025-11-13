/**
 * Date Formatting Utilities
 * 
 * Functions for formatting and manipulating dates
 */

/**
 * Format date to localized string
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  const d = new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }[format];

  return new Intl.DateTimeFormat('en-US', options).format(d);
}

/**
 * Format time
 */
export function formatTime(
  date: Date | string | number,
  includeSeconds = false
): string {
  const d = new Date(date);
  
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' }),
  });
}

/**
 * Format date and time together
 */
export function formatDateTime(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  return `${formatDate(date, format)} at ${formatTime(date)}`;
}

/**
 * Format date to ISO string
 */
export function toISOString(date: Date | string | number): string {
  return new Date(date).toISOString();
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin === 1) return '1 minute ago';
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour === 1) return '1 hour ago';
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffWeek === 1) return '1 week ago';
  if (diffWeek < 4) return `${diffWeek} weeks ago`;
  if (diffMonth === 1) return '1 month ago';
  if (diffMonth < 12) return `${diffMonth} months ago`;
  if (diffYear === 1) return '1 year ago';
  return `${diffYear} years ago`;
}

/**
 * Format date to "time from now"
 */
export function formatTimeFromNow(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  
  if (diffMs < 0) {
    return formatRelativeTime(date);
  }
  
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'in a few seconds';
  if (diffMin === 1) return 'in 1 minute';
  if (diffMin < 60) return `in ${diffMin} minutes`;
  if (diffHour === 1) return 'in 1 hour';
  if (diffHour < 24) return `in ${diffHour} hours`;
  if (diffDay === 1) return 'tomorrow';
  return `in ${diffDay} days`;
}

/**
 * Format duration between two dates
 */
export function formatDuration(
  startDate: Date | string | number,
  endDate: Date | string | number
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}

/**
 * Get day of week name
 */
export function getDayName(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Get month name
 */
export function getMonthName(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'long' });
}

/**
 * Get year
 */
export function getYear(date: Date | string | number): number {
  return new Date(date).getFullYear();
}

/**
 * Add days to date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Add months to date
 */
export function addMonths(date: Date | string | number, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Add years to date
 */
export function addYears(date: Date | string | number, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
  const d = new Date(date);
  const yesterday = addDays(new Date(), -1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if date is this week
 */
export function isThisWeek(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();
  const startOfWeek = addDays(today, -today.getDay());
  const endOfWeek = addDays(startOfWeek, 6);
  
  return d >= startOfDay(startOfWeek) && d <= endOfDay(endOfWeek);
}

/**
 * Check if date is this month
 */
export function isThisMonth(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is this year
 */
export function isThisYear(date: Date | string | number): boolean {
  return new Date(date).getFullYear() === new Date().getFullYear();
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string | number): boolean {
  return new Date(date) < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string | number): boolean {
  return new Date(date) > new Date();
}

/**
 * Check if date is between two dates
 */
export function isBetween(
  date: Date | string | number,
  start: Date | string | number,
  end: Date | string | number
): boolean {
  const d = new Date(date);
  return d >= new Date(start) && d <= new Date(end);
}

/**
 * Get age from birthdate
 */
export function getAge(birthdate: Date | string | number): number {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format as calendar date (Today, Yesterday, or date)
 */
export function formatCalendarDate(date: Date | string | number): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDate(date, 'medium');
}

/**
 * Parse ISO date string
 */
export function parseISODate(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Get quarter of year (1-4)
 */
export function getQuarter(date: Date | string | number): number {
  return Math.floor(new Date(date).getMonth() / 3) + 1;
}

/**
 * Get week number of year
 */
export function getWeekNumber(date: Date | string | number): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

