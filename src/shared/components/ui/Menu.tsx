/**
 * Menu Component
 *
 * @module shared/components/ui/Menu
 */

import React, { useState, useRef } from 'react';
import { useClickOutside } from '@/shared/hooks';

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  danger?: boolean;
}

export interface MenuProps {
  /** Menu items */
  items: MenuItem[];
  /** Trigger element */
  trigger?: 'click' | 'hover';
  /** Menu placement */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  /** Custom class name */
  className?: string;
  /** Children (trigger element) */
  children: React.ReactNode;
}

export function Menu({
  items,
  trigger = 'click',
  placement = 'bottom-start',
  className = '',
  children,
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  const handleClick = () => {
    if (trigger === 'click') {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsOpen(false);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      item.onClick?.();
      setIsOpen(false);
    }
  };

  const getPlacementClasses = () => {
    switch (placement) {
      case 'bottom-end':
        return 'right-0 mt-2';
      case 'top-start':
        return 'left-0 bottom-full mb-2';
      case 'top-end':
        return 'right-0 bottom-full mb-2';
      default:
        return 'left-0 mt-2';
    }
  };

  return (
    <div
      ref={menuRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div onClick={handleClick}>{children}</div>

      {isOpen && (
        <div
          className={`
            absolute z-50 min-w-[200px] bg-white rounded-lg shadow-lg
            border border-gray-200 py-1
            ${getPlacementClasses()}
          `}
        >
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`
                w-full px-4 py-2 text-left text-sm transition-colors
                flex items-center space-x-2
                ${
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

