import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyles =
      'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : '';

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(baseStyles, errorStyles, className)}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

