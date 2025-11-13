'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Calendar, Target } from 'lucide-react'

interface Prediction {
  metric: string
  currentValue: number
  predicted3Months: number
  predicted6Months: number
  predicted12Months: number
  confidence: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

export function PredictionCard({ prediction }: { prediction: Prediction }) {
  const getTrendColor = (trend: string) => {
    if (trend === 'increasing') return 'text-green-500'
    if (trend === 'decreasing') return 'text-red-500'
    return 'text-gray-500'
  }

  const getTrendIcon = () => {
    if (prediction.trend === 'increasing') return <TrendingUp className="h-4 w-4" />
    return <TrendingUp className="h-4 w-4 rotate-180" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{prediction.metric}</CardTitle>
          <Badge variant={prediction.confidence > 70 ? 'default' : 'outline'}>
            {prediction.confidence}% confident
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current</p>
            <p className="text-2xl font-bold">{prediction.currentValue.toFixed(1)}</p>
          </div>
          <div className={`flex items-center gap-2 ${getTrendColor(prediction.trend)}`}>
            {getTrendIcon()}
            <span className="capitalize">{prediction.trend}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">3 months</span>
              <span className="font-semibold">{prediction.predicted3Months.toFixed(1)}</span>
            </div>
            <Progress value={30} />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">6 months</span>
              <span className="font-semibold">{prediction.predicted6Months.toFixed(1)}</span>
            </div>
            <Progress value={60} />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">12 months</span>
              <span className="font-semibold">{prediction.predicted12Months.toFixed(1)}</span>
            </div>
            <Progress value={100} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

