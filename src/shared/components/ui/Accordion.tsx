/**
 * Accordion Component
 *
 * @module shared/components/ui/Accordion
 */

import React, { useState } from 'react';

export interface AccordionItem {
  key: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  /** Accordion items */
  items: AccordionItem[];
  /** Allow multiple items open */
  multiple?: boolean;
  /** Default open keys */
  defaultOpenKeys?: string[];
  /** Controlled open keys */
  openKeys?: string[];
  /** On change handler */
  onChange?: (keys: string[]) => void;
  /** Custom class name */
  className?: string;
}

export function Accordion({
  items,
  multiple = false,
  defaultOpenKeys = [],
  openKeys: controlledOpenKeys,
  onChange,
  className = '',
}: AccordionProps) {
  const [uncontrolledOpenKeys, setUncontrolledOpenKeys] =
    useState<string[]>(defaultOpenKeys);

  const isControlled = controlledOpenKeys !== undefined;
  const openKeys = isControlled ? controlledOpenKeys : uncontrolledOpenKeys;

  const handleToggle = (key: string) => {
    const item = items.find((i) => i.key === key);
    if (item?.disabled) return;

    let newOpenKeys: string[];

    if (openKeys.includes(key)) {
      // Close item
      newOpenKeys = openKeys.filter((k) => k !== key);
    } else {
      // Open item
      if (multiple) {
        newOpenKeys = [...openKeys, key];
      } else {
        newOpenKeys = [key];
      }
    }

    if (!isControlled) {
      setUncontrolledOpenKeys(newOpenKeys);
    }

    onChange?.(newOpenKeys);
  };

  return (
    <div className={`divide-y divide-gray-200 ${className}`}>
      {items.map((item) => {
        const isOpen = openKeys.includes(item.key);

        return (
          <div key={item.key} className="border-b border-gray-200">
            <button
              onClick={() => handleToggle(item.key)}
              disabled={item.disabled}
              className={`
                w-full px-4 py-3 text-left flex items-center justify-between
                transition-colors
                ${
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <span className="font-medium">{item.title}</span>
              <svg
                className={`
                  w-5 h-5 transition-transform
                  ${isOpen ? 'transform rotate-180' : ''}
                `}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="px-4 py-3 text-gray-700">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

