/**
 * Sidebar Component
 *
 * Collapsible sidebar navigation
 *
 * @module shared/components/navigation/Sidebar
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

export function Sidebar({
  items,
  collapsed = false,
  onCollapse,
  className = '',
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);

    return (
      <div key={item.label}>
        <div
          className={`flex items-center justify-between px-4 py-2 text-sm ${
            level > 0 ? 'pl-8' : ''
          } hover:bg-gray-100 cursor-pointer`}
        >
          <Link
            href={item.href}
            className="flex items-center gap-3 flex-1"
            onClick={(e) => hasChildren && e.preventDefault()}
          >
            {item.icon && <span className="text-gray-500">{item.icon}</span>}
            {!collapsed && (
              <>
                <span className="text-gray-700">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
          {hasChildren && !collapsed && (
            <button
              onClick={() => toggleItem(item.label)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
        {hasChildren && isExpanded && !collapsed && (
          <div className="ml-4">
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 ${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && <h2 className="text-lg font-semibold text-gray-900">Menu</h2>}
        <button
          onClick={() => onCollapse?.(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      <nav className="py-4">{items.map((item) => renderItem(item))}</nav>
    </div>
  );
}

