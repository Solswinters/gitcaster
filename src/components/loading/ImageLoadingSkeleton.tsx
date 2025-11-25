interface ImageLoadingSkeletonProps {
  aspectRatio?: string;
  className?: string;
}

/**
 * ImageLoadingSkeleton utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ImageLoadingSkeleton.
 */
export function ImageLoadingSkeleton({ 
  aspectRatio = 'aspect-video',
  className = ''
}: ImageLoadingSkeletonProps) {
  return (
    <div className={`${aspectRatio} ${className} bg-gray-200 rounded-lg animate-pulse relative overflow-hidden`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

