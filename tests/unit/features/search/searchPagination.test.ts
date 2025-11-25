import {

  calculatePagination,
  getPageNumbers,
  calculateOffset,
  validatePage,
} from '@/features/search/utils/searchPagination';

describe('Search Pagination', () => {
  describe('calculatePagination', () => {
    it('calculates pagination info correctly', () => {
      const info = calculatePagination(100, 2, 10);

      expect(info.currentPage).toBe(2);
      expect(info.totalPages).toBe(10);
      expect(info.pageSize).toBe(10);
      expect(info.totalResults).toBe(100);
      expect(info.hasNextPage).toBe(true);
      expect(info.hasPrevPage).toBe(true);
    });

    it('handles first page', () => {
      const info = calculatePagination(50, 1, 10);

      expect(info.hasNextPage).toBe(true);
      expect(info.hasPrevPage).toBe(false);
    });

    it('handles last page', () => {
      const info = calculatePagination(50, 5, 10);

      expect(info.hasNextPage).toBe(false);
      expect(info.hasPrevPage).toBe(true);
    });
  });

  describe('getPageNumbers', () => {
    it('returns all pages when total is small', () => {
      const pages = getPageNumbers(1, 5);
      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('includes ellipsis for large page counts', () => {
      const pages = getPageNumbers(5, 20);
      expect(pages).toContain('...');
      expect(pages[0]).toBe(1);
      expect(pages[pages.length - 1]).toBe(20);
    });
  });

  describe('calculateOffset', () => {
    it('calculates offset correctly', () => {
      expect(calculateOffset(1, 10)).toBe(0);
      expect(calculateOffset(2, 10)).toBe(10);
      expect(calculateOffset(3, 10)).toBe(20);
    });
  });

  describe('validatePage', () => {
    it('keeps valid page numbers', () => {
      expect(validatePage(5, 10)).toBe(5);
    });

    it('corrects page below 1', () => {
      expect(validatePage(0, 10)).toBe(1);
      expect(validatePage(-5, 10)).toBe(1);
    });

    it('corrects page above total', () => {
      expect(validatePage(15, 10)).toBe(10);
    });
  });
});

