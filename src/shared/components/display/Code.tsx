/**
 * Code Component
 *
 * Display code with syntax highlighting
 *
 * @module shared/components/display/Code
 */

'use client';

import React, { useState } from 'react';
import { copyToClipboard } from '@/shared/utils/clipboard';

export interface CodeProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  className?: string;
}

export function Code({
  code,
  language = 'plaintext',
  showLineNumbers = false,
  maxHeight,
  className = '',
}: CodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.split('\n');

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 uppercase font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-2"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div
        className="overflow-x-auto"
        style={{ maxHeight: maxHeight || 'none' }}
      >
        <pre className="p-4 text-sm">
          <code className="text-gray-100 font-mono">
            {showLineNumbers ? (
              lines.map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-500 select-none mr-4 text-right" style={{ minWidth: '2.5rem' }}>
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

