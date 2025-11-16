/**
 * Job posting card component
 */

'use client';

import type { JobPosting } from '../types';

interface JobPostingCardProps {
  posting: JobPosting;
  onClick?: () => void;
}

export function JobPostingCard({ posting, onClick }: JobPostingCardProps) {
  return (
    <div 
      className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{posting.title}</h3>
        <span className={`px-2 py-1 text-xs rounded ${
          posting.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {posting.status}
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {posting.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {posting.skills.slice(0, 3).map(skill => (
          <span key={skill} className="px-2 py-1 bg-secondary text-xs rounded">
            {skill}
          </span>
        ))}
        {posting.skills.length > 3 && (
          <span className="px-2 py-1 text-xs text-muted-foreground">
            +{posting.skills.length - 3} more
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>📍 {posting.location}</span>
        {posting.remote && <span>💼 Remote</span>}
        <span>⏰ {posting.employmentType}</span>
      </div>
    </div>
  );
}

