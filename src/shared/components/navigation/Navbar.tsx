/**
 * Navbar Component
 *
 * Main navigation bar component
 *
 * @module shared/components/navigation/Navbar
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavbarProps {
  items: NavItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Navbar({ items, logo, actions, className = '' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {logo && <div className="flex-shrink-0">{logo}</div>}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium flex items-center gap-2"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          {actions && <div className="hidden md:flex md:items-center">{actions}</div>}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
          {actions && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2">{actions}</div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

