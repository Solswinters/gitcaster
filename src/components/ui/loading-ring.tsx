interface LoadingRingProps {
  size?: number;
  color?: string;
}

/**
 * LoadingRing utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LoadingRing.
 */
export function LoadingRing({ size = 40, color = 'border-blue-600' }: LoadingRingProps) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-gray-200 ${color}`}
      style={{
        width: size,
        height: size,
        borderTopColor: 'transparent',
      }}
    />
  );
}

