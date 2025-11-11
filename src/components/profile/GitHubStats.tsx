import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GitHubStatsProps {
  stats: {
    publicRepos: number;
    totalStars: number;
    totalForks: number;
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalContributions: number;
  };
}

export function GitHubStats({ stats }: GitHubStatsProps) {
  const statItems = [
    { label: 'Repositories', value: stats.publicRepos },
    { label: 'Total Stars', value: stats.totalStars },
    { label: 'Total Forks', value: stats.totalForks },
    { label: 'Commits', value: stats.totalCommits },
    { label: 'Pull Requests', value: stats.totalPRs },
    { label: 'Issues', value: stats.totalIssues },
    { label: 'Contributions', value: stats.totalContributions },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

