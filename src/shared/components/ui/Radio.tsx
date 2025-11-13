import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const radioId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyles =
      'h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : '';

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className={cn(baseStyles, errorStyles, className)}
            {...props}
          />
          {label && (
            <label
              htmlFor={radioId}
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

Radio.displayName = 'Radio';

export interface RadioGroupProps {
  name: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
  label,
  orientation = 'vertical',
}: RadioGroupProps) {
  const orientationStyles =
    orientation === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-2';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className={orientationStyles}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            disabled={option.disabled}
            checked={value === option.value}
            onChange={(e) => {
              if (onChange && e.target.checked) {
                onChange(option.value);
              }
            }}
          />
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

