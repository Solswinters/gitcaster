import { useState, useRef, useEffect } from 'react';

import { AlertCircle } from 'lucide-react';

interface ErrorPopoverProps {
  message: string;
  children: React.ReactNode;
  trigger?: 'hover' | 'click';
}

/**
 * ErrorPopover utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ErrorPopover.
 */
export function ErrorPopover({ 
  message, 
  children, 
  trigger = 'hover' 
}: ErrorPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger === 'click') {
      const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }
  }, [isOpen, trigger]);

  const handleTrigger = () => {
    if (trigger === 'click') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div
        onMouseEnter={() => trigger === 'hover' && setIsOpen(true)}
        onMouseLeave={() => trigger === 'hover' && setIsOpen(false)}
        onClick={handleTrigger}
        className="cursor-help"
      >
        {children}
      </div>

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 animate-fade-in">
          <div className="bg-red-600 text-white text-sm rounded-lg px-3 py-2 shadow-lg max-w-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>{message}</p>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}

