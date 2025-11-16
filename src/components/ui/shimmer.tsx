import { cn } from '@/core/utils/cn';

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div className={cn('relative overflow-hidden bg-gray-200', className)}>
      <div className="shimmer-animation absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
      <style jsx>{`
        .shimmer-animation {
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

