'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react'

interface ComparisonViewProps {
  user1: { name: string; metrics: Record<string, number> }
  user2: { name: string; metrics: Record<string, number> }
  comparisons: Array<{
    metric: string
    user1Value: number
    user2Value: number
    winner: 'user1' | 'user2' | 'tie'
    percentageDiff: number
  }>
}

export function ComparisonView({ user1, user2, comparisons }: ComparisonViewProps) {
  const user1Wins = comparisons.filter((c) => c.winner === 'user1').length
  const user2Wins = comparisons.filter((c) => c.winner === 'user2').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Developer Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold">{user1.name}</h3>
              <div className="text-3xl font-bold mt-2">{user1Wins}</div>
              <p className="text-sm text-muted-foreground">wins</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{user2.name}</h3>
              <div className="text-3xl font-bold mt-2">{user2Wins}</div>
              <p className="text-sm text-muted-foreground">wins</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparisons */}
      <div className="space-y-4">
        {comparisons.map((comparison) => (
          <Card key={comparison.metric}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{comparison.metric}</h4>
                  <Badge
                    variant={
                      comparison.winner === 'tie'
                        ? 'outline'
                        : 'default'
                    }
                  >
                    {comparison.winner === 'user1'
                      ? user1.name
                      : comparison.winner === 'user2'
                        ? user2.name
                        : 'Tie'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{user1.name}</span>
                      <span className="font-semibold">
                        {comparison.user1Value.toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (comparison.user1Value /
                          Math.max(comparison.user1Value, comparison.user2Value)) *
                        100
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{user2.name}</span>
                      <span className="font-semibold">
                        {comparison.user2Value.toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (comparison.user2Value /
                          Math.max(comparison.user1Value, comparison.user2Value)) *
                        100
                      }
                    />
                  </div>
                </div>

                {Math.abs(comparison.percentageDiff) > 10 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {comparison.percentageDiff > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span>
                      {Math.abs(comparison.percentageDiff).toFixed(1)}% difference
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

