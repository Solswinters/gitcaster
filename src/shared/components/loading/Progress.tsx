import { cn } from '@/lib/utils/cn';

interface ProgressProps {
  /**
   * Current progress value
   */
  value: number;
  /**
   * Maximum value (default 100)
   */
  max?: number;
  /**
   * Display percentage label
   */
  showLabel?: boolean;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Color variant
   */
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

/**
 * Progress bar component for displaying completion status
 */
export function Progress({ 
  value, 
  max = 100, 
  showLabel = false,
  size = 'md',
  variant = 'default',
  className 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          sizeClasses[size],
          className
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Progress: ${percentage.toFixed(0)}%`}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-600 mt-1 text-right">
          {percentage.toFixed(0)}%
        </p>
      )}
    </div>
  );
}

/**
 * Circular progress indicator
 */
export function CircularProgress({ 
  value, 
  max = 100,
  size = 64,
  strokeWidth = 4,
  showLabel = true,
  className 
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-blue-600 transition-all duration-300 ease-in-out"
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-semibold">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
}

/**
 * Step progress indicator
 */
export function StepProgress({ 
  currentStep, 
  totalSteps,
  labels,
  className 
}: {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step circle */}
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                  isCompleted && 'bg-blue-600 text-white',
                  isCurrent && 'bg-blue-600 text-white',
                  !isCompleted && !isCurrent && 'bg-gray-200 text-gray-600'
                )}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              
              {/* Connector line */}
              {index < totalSteps - 1 && (
                <div className={cn(
                  'flex-1 h-1 mx-2',
                  isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                )} />
              )}
            </div>
          );
        })}
      </div>
      
      {labels && (
        <div className="flex justify-between mt-2">
          {labels.map((label, index) => (
            <span 
              key={index}
              className={cn(
                'text-xs',
                index + 1 <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

