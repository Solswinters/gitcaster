import { Copy, ExternalLink, MapPin, Building, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProfileHeaderProps {
  profile: {
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    location: string | null;
    company: string | null;
    website: string | null;
    walletAddress: string;
    githubUsername: string | null;
    viewCount: number;
  };
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const copyAddress = () => {
    navigator.clipboard.writeText(profile.walletAddress);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        {profile.avatarUrl && (
          <div className="flex-shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName || 'Profile'}
              className="w-32 h-32 rounded-full border-4 border-blue-100"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.displayName || profile.githubUsername || 'Anonymous'}
              </h1>
              {profile.bio && (
                <p className="text-gray-600 mt-2 max-w-2xl">{profile.bio}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{profile.viewCount} views</div>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            {profile.company && (
              <div className="flex items-center gap-1">
                <Building size={16} />
                <span>{profile.company}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-blue-600"
              >
                <Globe size={16} />
                <span>{profile.website}</span>
              </a>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-mono">
              <span>{profile.walletAddress.slice(0, 6)}...{profile.walletAddress.slice(-4)}</span>
              <button onClick={copyAddress} className="hover:text-blue-600">
                <Copy size={14} />
              </button>
            </div>

            {profile.githubUsername && (
              <a
                href={`https://github.com/${profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink size={14} className="mr-1" />
                  GitHub Profile
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

