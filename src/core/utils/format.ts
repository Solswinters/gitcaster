/**
 * Formatting utilities
 */

export function formatDate(date: Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  if (format === 'relative') {
    return formatRelativeTime(date);
  }

  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 365) return `${Math.floor(days / 365)} years ago`;
  if (days > 30) return `${Math.floor(days / 30)} months ago`;
  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return 'just now';
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${formatNumber(value, decimals)}%`;
}

