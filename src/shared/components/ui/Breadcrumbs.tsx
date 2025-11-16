import { ReactNode } from 'react';
import { cn } from '@/core/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

export function Breadcrumbs({
  items,
  separator,
  className,
}: BreadcrumbsProps) {
  const defaultSeparator = (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <nav className={cn('flex items-center space-x-2', className)} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center space-x-2">
            {/* Breadcrumb Item */}
            {item.href || item.onClick ? (
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                className={cn(
                  'flex items-center gap-1.5 text-sm transition-colors',
                  isLast
                    ? 'text-gray-900 font-medium cursor-default'
                    : 'text-gray-600 hover:text-gray-900 cursor-pointer'
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </a>
            ) : (
              <span
                className={cn(
                  'flex items-center gap-1.5 text-sm',
                  isLast ? 'text-gray-900 font-medium' : 'text-gray-600'
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}

            {/* Separator */}
            {!isLast && <span>{separator || defaultSeparator}</span>}
          </div>
        );
      })}
    </nav>
  );
}

