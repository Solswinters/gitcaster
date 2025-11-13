import {
  getRelativeTime,
  formatDateRange,
  isToday,
  isYesterday,
  isThisWeek,
  addDays,
  addMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  daysBetween,
  formatDuration,
  parseISODate,
  isValidDate,
  getTimezoneOffset,
  toISODateString,
} from '@/shared/utils/date/dateUtils';

describe('Date Utils', () => {
  describe('getRelativeTime', () => {
    it('returns "just now" for recent times', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('just now');
    });

    it('returns minutes ago', () => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 5);
      expect(getRelativeTime(date)).toBe('5 minutes ago');
    });

    it('returns hours ago', () => {
      const date = new Date();
      date.setHours(date.getHours() - 3);
      expect(getRelativeTime(date)).toBe('3 hours ago');
    });

    it('returns days ago', () => {
      const date = new Date();
      date.setDate(date.getDate() - 2);
      expect(getRelativeTime(date)).toBe('2 days ago');
    });
  });

  describe('formatDateRange', () => {
    it('formats date range in same month', () => {
      const start = new Date('2024-01-15');
      const end = new Date('2024-01-20');
      const result = formatDateRange(start, end);
      expect(result).toContain('Jan');
      expect(result).toContain('15-20');
    });

    it('formats date range across months', () => {
      const start = new Date('2024-01-15');
      const end = new Date('2024-02-20');
      const result = formatDateRange(start, end);
      expect(result).toContain('Jan');
      expect(result).toContain('Feb');
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('returns true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday)).toBe(true);
    });

    it('returns false for today', () => {
      const today = new Date();
      expect(isYesterday(today)).toBe(false);
    });
  });

  describe('isThisWeek', () => {
    it('returns true for dates in current week', () => {
      const today = new Date();
      expect(isThisWeek(today)).toBe(true);
    });

    it('returns false for dates in previous week', () => {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 8);
      expect(isThisWeek(lastWeek)).toBe(false);
    });
  });

  describe('addDays', () => {
    it('adds days to date', () => {
      const date = new Date('2024-01-15');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('handles month boundary', () => {
      const date = new Date('2024-01-30');
      const result = addDays(date, 5);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(4);
    });
  });

  describe('addMonths', () => {
    it('adds months to date', () => {
      const date = new Date('2024-01-15');
      const result = addMonths(date, 2);
      expect(result.getMonth()).toBe(2); // March
    });

    it('handles year boundary', () => {
      const date = new Date('2024-11-15');
      const result = addMonths(date, 3);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February
    });
  });

  describe('startOfDay', () => {
    it('returns start of day', () => {
      const date = new Date('2024-01-15T15:30:45.123Z');
      const result = startOfDay(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('endOfDay', () => {
    it('returns end of day', () => {
      const date = new Date('2024-01-15T10:00:00.000Z');
      const result = endOfDay(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('startOfWeek', () => {
    it('returns start of week (Sunday)', () => {
      const date = new Date('2024-01-17'); // Wednesday
      const result = startOfWeek(date);
      expect(result.getDay()).toBe(0); // Sunday
    });
  });

  describe('endOfWeek', () => {
    it('returns end of week (Saturday)', () => {
      const date = new Date('2024-01-17'); // Wednesday
      const result = endOfWeek(date);
      expect(result.getDay()).toBe(6); // Saturday
    });
  });

  describe('startOfMonth', () => {
    it('returns first day of month', () => {
      const date = new Date('2024-01-15');
      const result = startOfMonth(date);
      expect(result.getDate()).toBe(1);
    });
  });

  describe('endOfMonth', () => {
    it('returns last day of month', () => {
      const date = new Date('2024-01-15');
      const result = endOfMonth(date);
      expect(result.getDate()).toBe(31);
    });

    it('handles February', () => {
      const date = new Date('2024-02-15');
      const result = endOfMonth(date);
      expect(result.getDate()).toBe(29); // 2024 is a leap year
    });
  });

  describe('daysBetween', () => {
    it('calculates days between dates', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-11');
      expect(daysBetween(start, end)).toBe(10);
    });

    it('handles negative differences', () => {
      const start = new Date('2024-01-11');
      const end = new Date('2024-01-01');
      expect(daysBetween(start, end)).toBe(-10);
    });
  });

  describe('formatDuration', () => {
    it('formats seconds', () => {
      expect(formatDuration(5000)).toBe('5s');
    });

    it('formats minutes and seconds', () => {
      expect(formatDuration(125000)).toBe('2m 5s');
    });

    it('formats hours and minutes', () => {
      expect(formatDuration(7325000)).toBe('2h 2m');
    });

    it('formats days and hours', () => {
      expect(formatDuration(90000000)).toBe('1d 1h');
    });
  });

  describe('parseISODate', () => {
    it('parses valid ISO date', () => {
      const result = parseISODate('2024-01-15T10:30:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
    });

    it('returns null for invalid date', () => {
      expect(parseISODate('invalid')).toBeNull();
    });
  });

  describe('isValidDate', () => {
    it('returns true for valid Date', () => {
      expect(isValidDate(new Date())).toBe(true);
    });

    it('returns false for invalid Date', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });

    it('returns false for non-Date values', () => {
      expect(isValidDate('2024-01-15')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });

  describe('getTimezoneOffset', () => {
    it('returns timezone offset string', () => {
      const offset = getTimezoneOffset();
      expect(offset).toMatch(/^[+-]\d{2}:\d{2}$/);
    });
  });

  describe('toISODateString', () => {
    it('formats date as YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(toISODateString(date)).toBe('2024-01-15');
    });
  });
});

