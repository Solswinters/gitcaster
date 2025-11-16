'use client';

import { useState } from 'react';
import { cn } from '@/core/utils/cn';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = allowMultiple ? new Set(prev) : new Set();
      if (prev.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={cn('divide-y divide-gray-200 border border-gray-200 rounded-lg', className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={isOpen}
              aria-controls={`content-${item.id}`}
            >
              <span className="font-medium text-gray-900">{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-gray-500 transition-transform duration-200',
                  isOpen && 'transform rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div
                id={`content-${item.id}`}
                className="px-4 py-4 text-gray-600 bg-gray-50"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

