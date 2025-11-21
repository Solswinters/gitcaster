import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useComponentBase } from '../../hooks/useComponentBase';

export interface AccordionItemProps {
  id: string;
  title: string | React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItemProps[];
  allowMultiple?: boolean; // Allow multiple items to be open at once
  defaultOpenIds?: string[]; // IDs of items that should be open by default
  onItemToggle?: (itemId: string, isOpen: boolean) => void;
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'bordered' | 'filled' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean; // Enable smooth animations
  collapsible?: boolean; // Allow closing all items (only relevant if allowMultiple is false)
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  onItemToggle,
  className = '',
  itemClassName = '',
  headerClassName = '',
  contentClassName = '',
  variant = 'default',
  size = 'md',
  animated = true,
  collapsible = true,
}) => {
  const { theme } = useComponentBase();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpenIds));
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Initialize with default open items
    const defaultOpen = items
      .filter((item) => item.defaultOpen || defaultOpenIds.includes(item.id))
      .map((item) => item.id);

    setOpenItems(new Set(defaultOpen));
  }, [items, defaultOpenIds]);

  const toggleItem = useCallback(
    (itemId: string, disabled: boolean = false) => {
      if (disabled) return;

      setOpenItems((prev) => {
        const newOpenItems = new Set(prev);
        const isCurrentlyOpen = newOpenItems.has(itemId);

        if (isCurrentlyOpen) {
          newOpenItems.delete(itemId);
        } else {
          if (!allowMultiple) {
            newOpenItems.clear();
          }
          newOpenItems.add(itemId);
        }

        // If collapsible is false and we're in single mode, ensure at least one is open
        if (!collapsible && !allowMultiple && newOpenItems.size === 0) {
          // Find the first non-disabled item and open it
          const firstEnabledItem = items.find((item) => !item.disabled);
          if (firstEnabledItem) {
            newOpenItems.add(firstEnabledItem.id);
          }
        }

        if (onItemToggle) {
          onItemToggle(itemId, !isCurrentlyOpen);
        }

        return newOpenItems;
      });
    },
    [allowMultiple, collapsible, items, onItemToggle],
  );

  const getVariantStyles = () => {
    const baseStyles = 'rounded overflow-hidden';

    switch (variant) {
      case 'bordered':
        return `${baseStyles} border border-gray-200 dark:border-gray-700`;
      case 'filled':
        return `${baseStyles} bg-gray-100 dark:bg-gray-800`;
      case 'minimal':
        return 'border-b border-gray-200 dark:border-gray-700 last:border-b-0';
      case 'default':
      default:
        return `${baseStyles} border-b border-gray-200 dark:border-gray-700 last:border-b-0`;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'md':
      default:
        return 'text-base';
    }
  };

  const getHeaderPadding = () => {
    switch (size) {
      case 'sm':
        return 'p-2';
      case 'lg':
        return 'p-6';
      case 'md':
      default:
        return 'p-4';
    }
  };

  const getContentPadding = () => {
    switch (size) {
      case 'sm':
        return 'px-2 pb-2';
      case 'lg':
        return 'px-6 pb-6';
      case 'md':
      default:
        return 'px-4 pb-4';
    }
  };

  return (
    <div className={`accordion ${getSizeStyles()} ${className}`} role="region">
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const contentRef = contentRefs.current.get(item.id);

        return (
          <div
            key={item.id}
            className={`accordion-item ${getVariantStyles()} ${itemClassName} ${
              item.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            data-item-id={item.id}
            data-open={isOpen}
          >
            {/* Header */}
            <button
              type="button"
              className={`accordion-header w-full flex items-center justify-between ${getHeaderPadding()} ${headerClassName} ${
                !item.disabled
                  ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                  : 'cursor-not-allowed'
              } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              onClick={() => toggleItem(item.id, item.disabled)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              disabled={item.disabled}
            >
              <div className="flex items-center gap-3 flex-1">
                {item.icon && <div className="accordion-icon">{item.icon}</div>}
                <div className="accordion-title font-semibold text-left">{item.title}</div>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${animated ? 'duration-300' : ''} ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Content */}
            <div
              id={`accordion-content-${item.id}`}
              ref={(el) => {
                if (el) {
                  contentRefs.current.set(item.id, el);
                }
              }}
              className={`accordion-content overflow-hidden transition-all ${animated ? 'duration-300 ease-in-out' : ''}`}
              style={{
                maxHeight: isOpen
                  ? contentRef
                    ? `${contentRef.scrollHeight}px`
                    : '1000px'
                  : '0px',
              }}
              aria-hidden={!isOpen}
            >
              <div className={`${getContentPadding()} ${contentClassName}`}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
