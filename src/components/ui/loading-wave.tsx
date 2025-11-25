/**
 * LoadingWave utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LoadingWave.
 */
export function LoadingWave() {
  return (
    <div className="flex items-end space-x-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-blue-600 rounded-t animate-wave"
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes wave {
          0%, 60%, 100% {
            height: 0.5rem;
          }
          30% {
            height: 2rem;
          }
        }
        .animate-wave {
          animation: wave 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

