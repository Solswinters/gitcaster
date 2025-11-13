import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      className,
      checked,
      id,
      ...props
    },
    ref
  ) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const sizeClasses = {
      sm: {
        container: 'w-8 h-4',
        toggle: 'w-3 h-3',
        translate: checked ? 'translate-x-4' : 'translate-x-0.5',
      },
      md: {
        container: 'w-11 h-6',
        toggle: 'w-5 h-5',
        translate: checked ? 'translate-x-5' : 'translate-x-0.5',
      },
      lg: {
        container: 'w-14 h-7',
        toggle: 'w-6 h-6',
        translate: checked ? 'translate-x-7' : 'translate-x-0.5',
      },
    };

    const bgColor = checked ? 'bg-blue-600' : 'bg-gray-200';

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => {
              const event = {
                target: { checked: !checked },
                currentTarget: { checked: !checked },
              } as any;
              props.onChange?.(event);
            }}
            className={cn(
              'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              sizeClasses[size].container,
              bgColor,
              props.disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={props.disabled}
          >
            <input
              ref={ref}
              type="checkbox"
              id={switchId}
              checked={checked}
              className="sr-only"
              {...props}
            />
            <span
              className={cn(
                'inline-block transform rounded-full bg-white transition-transform',
                sizeClasses[size].toggle,
                sizeClasses[size].translate
              )}
            />
          </button>
          {label && (
            <label
              htmlFor={switchId}
              className="ml-3 text-sm text-gray-700 cursor-pointer select-none"
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

Switch.displayName = 'Switch';

