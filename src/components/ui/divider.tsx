import { cn } from '@/core/utils/cn';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

export function Divider({ orientation = 'horizontal', className, label }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('w-px bg-gray-200', className)}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div className={cn('relative', className)} role="separator" aria-label={label}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('h-px bg-gray-200', className)}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}

