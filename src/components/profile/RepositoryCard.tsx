import { Card } from '@/components/ui/card';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { GitHubRepo } from '@/types';

interface RepositoryCardProps {
  repo: GitHubRepo;
}

export function RepositoryCard({ repo }: RepositoryCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-600 hover:underline flex items-center gap-2">
              {repo.name}
              <ExternalLink size={14} />
            </h3>
            {repo.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star size={14} />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={14} />
            {repo.forks_count}
          </span>
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {repo.topics.slice(0, 5).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </a>
    </Card>
  );
}

