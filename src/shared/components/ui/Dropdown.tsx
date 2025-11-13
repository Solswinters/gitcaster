import { useState, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { useClickOutside } from '@/shared/hooks/useClickOutside';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  placement = 'bottom-right',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const placementStyles = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2',
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-200 py-1',
            placementStyles[placement],
            className
          )}
        >
          {items.map((item) => {
            if (item.divider) {
              return <div key={item.id} className="my-1 border-t border-gray-200" />;
            }

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors',
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                )}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

