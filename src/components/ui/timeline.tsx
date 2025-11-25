import { LucideIcon } from 'lucide-react';

import { cn } from '@/core/utils/cn';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: LucideIcon;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.id} className="relative flex gap-4">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-200" />
            )}
            
            {/* Icon */}
            <div className="relative flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white">
                {Icon ? (
                  <Icon className="h-5 w-5 text-blue-600" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                <time className="text-xs text-gray-500">{item.timestamp}</time>
              </div>
              {item.description && (
                <p className="text-sm text-gray-600">{item.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

