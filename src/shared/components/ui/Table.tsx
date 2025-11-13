/**
 * Table Component
 *
 * @module shared/components/ui/Table
 */

import React from 'react';

export interface TableColumn<T> {
  key: string;
  title: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface TableProps<T = any> {
  /** Table columns configuration */
  columns: TableColumn<T>[];
  /** Table data */
  data: T[];
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyText?: string;
  /** Row key extractor */
  rowKey?: string | ((record: T) => string);
  /** Striped rows */
  striped?: boolean;
  /** Bordered table */
  bordered?: boolean;
  /** Hoverable rows */
  hoverable?: boolean;
  /** Compact table */
  compact?: boolean;
  /** On row click handler */
  onRowClick?: (record: T, index: number) => void;
  /** Custom class name */
  className?: string;
}

export function Table<T = any>({
  columns,
  data,
  loading = false,
  emptyText = 'No data',
  rowKey = 'id',
  striped = false,
  bordered = false,
  hoverable = true,
  compact = false,
  onRowClick,
  className = '',
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String((record as any)[rowKey] || index);
  };

  const getCellValue = (record: T, column: TableColumn<T>): any => {
    return (record as any)[column.key];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className={`
          min-w-full divide-y divide-gray-200
          ${bordered ? 'border border-gray-200' : ''}
        `}
      >
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className={`
                  px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${column.align === 'center' ? 'text-center' : ''}
                  ${column.align === 'right' ? 'text-right' : 'text-left'}
                  ${compact ? 'px-4 py-2' : ''}
                `}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`
            bg-white divide-y divide-gray-200
            ${striped ? 'divide-y-0' : ''}
          `}
        >
          {data.map((record, index) => (
            <tr
              key={getRowKey(record, index)}
              onClick={() => onRowClick?.(record, index)}
              className={`
                ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                ${hoverable ? 'hover:bg-gray-100 transition-colors' : ''}
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`
                    px-6 py-4 whitespace-nowrap text-sm text-gray-900
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : 'text-left'}
                    ${compact ? 'px-4 py-2' : ''}
                  `}
                >
                  {column.render
                    ? column.render(getCellValue(record, column), record, index)
                    : getCellValue(record, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

