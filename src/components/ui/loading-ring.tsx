interface LoadingRingProps {
  size?: number;
  color?: string;
}

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

