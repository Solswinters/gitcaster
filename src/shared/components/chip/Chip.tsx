import React, { useCallback } from 'react';
import { useComponentBase } from '../../hooks/useComponentBase';

export interface ChipProps {
  label: string | React.ReactNode;
  variant?: 'filled' | 'outlined' | 'soft';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  deleteIcon?: React.ReactNode;
  clickable?: boolean; // Whether the chip is clickable (adds hover effects)
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'filled',
  color = 'default',
  size = 'md',
  icon,
  avatar,
  onDelete,
  onClick,
  disabled = false,
  className = '',
  deleteIcon,
  clickable = false,
}) => {
  const { theme } = useComponentBase();

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering onClick when deleting
      if (onDelete && !disabled) {
        onDelete();
      }
    },
    [onDelete, disabled],
  );

  const handleClick = useCallback(() => {
    if (onClick && !disabled) {
      onClick();
    }
  }, [onClick, disabled]);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5 h-5';
      case 'lg':
        return 'text-base px-4 py-2 h-10';
      case 'md':
      default:
        return 'text-sm px-3 py-1 h-7';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-5 h-5';
      case 'md':
      default:
        return 'w-4 h-4';
    }
  };

  const getColorStyles = () => {
    const baseStyles = 'transition-colors';

    if (variant === 'filled') {
      switch (color) {
        case 'primary':
          return `${baseStyles} bg-blue-500 text-white hover:bg-blue-600`;
        case 'secondary':
          return `${baseStyles} bg-gray-500 text-white hover:bg-gray-600`;
        case 'success':
          return `${baseStyles} bg-green-500 text-white hover:bg-green-600`;
        case 'warning':
          return `${baseStyles} bg-yellow-500 text-white hover:bg-yellow-600`;
        case 'error':
          return `${baseStyles} bg-red-500 text-white hover:bg-red-600`;
        case 'info':
          return `${baseStyles} bg-cyan-500 text-white hover:bg-cyan-600`;
        case 'default':
        default:
          return `${baseStyles} bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600`;
      }
    } else if (variant === 'outlined') {
      switch (color) {
        case 'primary':
          return `${baseStyles} border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900`;
        case 'secondary':
          return `${baseStyles} border-2 border-gray-500 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900`;
        case 'success':
          return `${baseStyles} border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900`;
        case 'warning':
          return `${baseStyles} border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900`;
        case 'error':
          return `${baseStyles} border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900`;
        case 'info':
          return `${baseStyles} border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900`;
        case 'default':
        default:
          return `${baseStyles} border-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800`;
      }
    } else if (variant === 'soft') {
      switch (color) {
        case 'primary':
          return `${baseStyles} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800`;
        case 'secondary':
          return `${baseStyles} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`;
        case 'success':
          return `${baseStyles} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800`;
        case 'warning':
          return `${baseStyles} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800`;
        case 'error':
          return `${baseStyles} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800`;
        case 'info':
          return `${baseStyles} bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 hover:bg-cyan-200 dark:hover:bg-cyan-800`;
        case 'default':
        default:
          return `${baseStyles} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`;
      }
    }

    return baseStyles;
  };

  const isClickable = clickable || !!onClick;

  const chipContent = (
    <>
      {avatar && <div className="chip-avatar mr-1 -ml-1 flex items-center">{avatar}</div>}
      {icon && <div className={`chip-icon mr-1 flex items-center ${getIconSize()}`}>{icon}</div>}
      <span className="chip-label font-medium truncate">{label}</span>
      {onDelete && (
        <button
          type="button"
          className={`chip-delete ml-1 -mr-1 rounded-full p-0.5 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
          onClick={handleDelete}
          disabled={disabled}
          aria-label="Delete"
        >
          {deleteIcon || (
            <svg className={getIconSize()} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      )}
    </>
  );

  const chipClasses = `
    chip
    inline-flex
    items-center
    rounded-full
    font-sans
    whitespace-nowrap
    ${getSizeStyles()}
    ${getColorStyles()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : isClickable ? 'cursor-pointer' : 'cursor-default'}
    ${className}
  `.trim();

  if (isClickable && !disabled) {
    return (
      <button
        type="button"
        className={chipClasses}
        onClick={handleClick}
        disabled={disabled}
        aria-label={typeof label === 'string' ? label : 'Chip'}
      >
        {chipContent}
      </button>
    );
  }

  return (
    <div className={chipClasses} role="status" aria-label={typeof label === 'string' ? label : 'Chip'}>
      {chipContent}
    </div>
  );
};

export default Chip;
