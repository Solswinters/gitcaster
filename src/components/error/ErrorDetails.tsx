import { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorDetailsProps {
  error: Error;
  showStackTrace?: boolean;
}

export function ErrorDetails({ error, showStackTrace = true }: ErrorDetailsProps) {
  const [expanded, setExpanded] = useState(false);

  if (process.env.NODE_ENV !== 'development' && !showStackTrace) {
    return null;
  }

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm font-medium text-gray-700"
      >
        <span>Error Details</span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      
      {expanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="font-semibold text-gray-700">Name:</span>
              <span className="ml-2 text-gray-600">{error.name}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Message:</span>
              <span className="ml-2 text-gray-600">{error.message}</span>
            </div>
            {error.stack && (
              <div>
                <span className="font-semibold text-gray-700">Stack Trace:</span>
                <pre className="mt-1 p-2 bg-white border border-gray-200 rounded text-xs overflow-auto max-h-48">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

