/**
 * Profile Card Component
 *
 * Display user profile information
 *
 * @module features/profile/components/ProfileCard
 */

'use client';

import React from 'react';
import { Avatar } from '@/shared/components/ui';

export interface ProfileCardProps {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  stats?: Array<{ label: string; value: string | number }>;
  actions?: React.ReactNode;
  className?: string;
}

export function ProfileCard({
  name,
  email,
  avatar,
  bio,
  stats,
  actions,
  className = '',
}: ProfileCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
          <Avatar src={avatar} alt={name} size="xl" className="border-4 border-white" />
          <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            <p className="text-gray-600">{email}</p>
          </div>
          {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
        </div>

        {bio && <p className="mt-6 text-gray-700">{bio}</p>}

        {stats && stats.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

