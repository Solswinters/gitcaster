/**
 * Pagination Component
 *
 * @module shared/components/ui/Pagination
 */

import React from 'react';

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** On page change handler */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show */
  siblingCount?: number;
  /** Show first/last buttons */
  showFirstLast?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  disabled = false,
  className = '',
}: PaginationProps) {
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    // Always show first page
    pages.push(1);

    // Show left dots
    if (showLeftDots) {
      pages.push('...');
    }

    // Show siblings
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Show right dots
    if (showRightDots) {
      pages.push('...');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  const handlePageChange = (page: number) => {
    if (disabled || page === currentPage || page < 1 || page > totalPages) {
      return;
    }
    onPageChange(page);
  };

  return (
    <nav
      className={`flex items-center justify-center space-x-2 ${className}`}
      aria-label="Pagination"
    >
      {/* First button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(1)}
          disabled={disabled || currentPage === 1}
          className={`
            px-3 py-2 text-sm font-medium rounded-md
            ${
              currentPage === 1 || disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
          aria-label="First page"
        >
          «
        </button>
      )}

      {/* Previous button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className={`
          px-3 py-2 text-sm font-medium rounded-md
          ${
            currentPage === 1 || disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }
        `}
        aria-label="Previous page"
      >
        ‹
      </button>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`dots-${index}`}
              className="px-3 py-2 text-sm font-medium text-gray-400"
            >
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            disabled={disabled}
            className={`
              px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `}
            aria-label={`Page ${pageNumber}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={disabled || currentPage === totalPages}
        className={`
          px-3 py-2 text-sm font-medium rounded-md
          ${
            currentPage === totalPages || disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }
        `}
        aria-label="Next page"
      >
        ›
      </button>

      {/* Last button */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
          className={`
            px-3 py-2 text-sm font-medium rounded-md
            ${
              currentPage === totalPages || disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
          aria-label="Last page"
        >
          »
        </button>
      )}
    </nav>
  );
}

