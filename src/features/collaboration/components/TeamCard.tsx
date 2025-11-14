/**
 * TeamCard Component
 *
 * Display team information
 *
 * @module features/collaboration/components/TeamCard
 */

'use client';

import React from 'react';
import { Avatar, Badge } from '@/shared/components/ui';

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface TeamCardProps {
  name: string;
  description?: string;
  members: TeamMember[];
  memberCount: number;
  isPrivate?: boolean;
  onJoin?: () => void;
  onView?: () => void;
  className?: string;
}

export function TeamCard({
  name,
  description,
  members,
  memberCount,
  isPrivate = false,
  onJoin,
  onView,
  className = '',
}: TeamCardProps) {
  const displayMembers = members.slice(0, 3);
  const remainingCount = memberCount - displayMembers.length;

  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        {isPrivate && <Badge variant="secondary">Private</Badge>}
      </div>

      <div className="flex items-center mb-4">
        <div className="flex -space-x-2">
          {displayMembers.map((member) => (
            <Avatar
              key={member.id}
              src={member.avatar}
              alt={member.name}
              size="sm"
              className="border-2 border-white"
            />
          ))}
          {remainingCount > 0 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 border-2 border-white">
              +{remainingCount}
            </div>
          )}
        </div>
        <span className="ml-3 text-sm text-gray-600">
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </span>
      </div>

      <div className="flex gap-2">
        {onView && (
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Team
          </button>
        )}
        {onJoin && (
          <button
            onClick={onJoin}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Join Team
          </button>
        )}
      </div>
    </div>
  );
}

