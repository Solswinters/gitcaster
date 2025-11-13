/**
 * Search Pagination Utilities
 */

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Calculate pagination info
 */
export function calculatePagination(
  totalResults: number,
  currentPage: number,
  pageSize: number
): PaginationInfo {
  const totalPages = Math.ceil(totalResults / pageSize);

  return {
    currentPage,
    totalPages,
    pageSize,
    totalResults,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

/**
 * Get page numbers for pagination UI
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | '...')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];
  const halfVisible = Math.floor((maxVisible - 3) / 2);

  let startPage = Math.max(2, currentPage - halfVisible);
  let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

  if (currentPage - halfVisible <= 2) {
    endPage = Math.min(totalPages - 1, maxVisible - 2);
  }

  if (currentPage + halfVisible >= totalPages - 1) {
    startPage = Math.max(2, totalPages - (maxVisible - 3));
  }

  if (startPage > 2) {
    pages.push('...');
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push('...');
  }

  pages.push(totalPages);

  return pages;
}

/**
 * Calculate offset for API requests
 */
export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Validate page number
 */
export function validatePage(page: number, totalPages: number): number {
  if (page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}

