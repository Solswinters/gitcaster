interface LoadingTextProps {
  text?: string;
}

export function LoadingText({ text = 'Loading' }: LoadingTextProps) {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <span>{text}</span>
      <span className="flex space-x-1">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
      </span>
    </div>
  );
}

