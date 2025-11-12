interface LoadingBounceProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function LoadingBounce({ size = 'md', color = 'bg-blue-600' }: LoadingBounceProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const ballSize = sizeClasses[size];

  return (
    <div className="flex space-x-2">
      <div className={`${ballSize} ${color} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`${ballSize} ${color} rounded-full animate-bounce`} style={{ animationDelay: '100ms' }}></div>
      <div className={`${ballSize} ${color} rounded-full animate-bounce`} style={{ animationDelay: '200ms' }}></div>
    </div>
  );
}

