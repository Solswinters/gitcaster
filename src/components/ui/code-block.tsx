import { useState } from 'react';

import { Check, Copy } from 'lucide-react';

import { cn } from '@/core/utils/cn';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

/**
 * CodeBlock utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of CodeBlock.
 */
export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative group', className)}>
      <div className="absolute top-2 right-2">
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className={language ? `language-${language}` : ''}>
          {code}
        </code>
      </pre>
    </div>
  );
}

