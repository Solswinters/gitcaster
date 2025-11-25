/**
 * LoadingEllipsis utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LoadingEllipsis.
 */
export function LoadingEllipsis() {
  return (
    <span className="inline-flex space-x-1">
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
    </span>
  );
}

