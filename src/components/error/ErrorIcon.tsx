import { AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

interface ErrorIconProps {
  type?: 'error' | 'warning' | 'info' | 'critical';
  size?: number;
  className?: string;
}

export function ErrorIcon({ type = 'error', size = 20, className = '' }: ErrorIconProps) {
  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    critical: XCircle,
  };

  const colors = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    critical: 'text-red-800',
  };

  const Icon = icons[type];

  return <Icon className={`${colors[type]} ${className}`} size={size} />;
}

