import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

import { cn } from '@/core/utils/cn';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const icons = {
  default: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
};

/**
 * Alert utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Alert.
 */
export function Alert({ children, variant = 'default', className }: AlertProps) {
  const Icon = icons[variant];
  
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        {
          'bg-gray-50 border-gray-200 text-gray-900': variant === 'default',
          'bg-green-50 border-green-200 text-green-900': variant === 'success',
          'bg-yellow-50 border-yellow-200 text-yellow-900': variant === 'warning',
          'bg-red-50 border-red-200 text-red-900': variant === 'error',
          'bg-blue-50 border-blue-200 text-blue-900': variant === 'info',
        },
        className
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

