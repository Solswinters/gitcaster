/**
 * Repository Card Component
 *
 * Display GitHub repository information
 *
 * @module features/github/components/RepoCard
 */

'use client';

import React from 'react';
import { Badge } from '@/shared/components/ui';

export interface RepoCardProps {
  name: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
  isPrivate?: boolean;
  updatedAt?: string;
  url?: string;
  className?: string;
}

export function RepoCard({
  name,
  description,
  language,
  stars = 0,
  forks = 0,
  isPrivate = false,
  updatedAt,
  url,
  className = '',
}: RepoCardProps) {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 ${
        url ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
          {name}
        </h3>
        {isPrivate && <Badge variant="secondary">Private</Badge>}
      </div>

      {description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        {language && (
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>{language}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{stars}</span>
        </div>

        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>{forks}</span>
        </div>

        {updatedAt && <span className="ml-auto">Updated {updatedAt}</span>}
      </div>
    </div>
  );
}

