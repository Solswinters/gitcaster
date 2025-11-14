/**
 * Progress Indicator Component
 *
 * Display progress with various styles (bar, circle, steps)
 *
 * @module shared/components/feedback/ProgressIndicator
 */

'use client';

import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const variantColors = {
  default: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  error: 'bg-red-600',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const displayLabel = label || `${Math.round(percentage)}%`;

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{displayLabel}</span>
          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${variantColors[variant]} h-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

export interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

export function ProgressCircle({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  className = '',
}: ProgressCircleProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeColors = {
    default: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColors[variant]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

export interface Step {
  label: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
}

export interface ProgressStepsProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ProgressSteps({
  steps,
  orientation = 'horizontal',
  className = '',
}: ProgressStepsProps) {
  const isVertical = orientation === 'vertical';

  return (
    <div className={className}>
      <div className={`flex ${isVertical ? 'flex-col' : 'items-center justify-between'}`}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex ${isVertical ? 'flex-row' : 'flex-col'} items-center ${
              !isVertical && index < steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center`}>
              <StepIndicator status={step.status} index={index + 1} />
              {!isVertical && index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-2 min-w-[40px]" />
              )}
            </div>
            <div className={`${isVertical ? 'ml-4' : 'mt-2 text-center'}`}>
              <div className="text-sm font-medium text-gray-900">{step.label}</div>
              {step.description && (
                <div className="text-xs text-gray-500 mt-1">{step.description}</div>
              )}
            </div>
            {isVertical && index < steps.length - 1 && (
              <div className="w-0.5 h-8 bg-gray-200 ml-4 my-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  status: Step['status'];
  index: number;
}

function StepIndicator({ status, index }: StepIndicatorProps) {
  const statusStyles = {
    pending: 'bg-gray-200 text-gray-600',
    current: 'bg-blue-600 text-white ring-4 ring-blue-100',
    completed: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
  };

  const icon = {
    pending: null,
    current: null,
    completed: '✓',
    error: '✕',
  };

  return (
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${statusStyles[status]}`}
    >
      {icon[status] || index}
    </div>
  );
}

