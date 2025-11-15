'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertCircle,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'

interface Insight {
  id: string
  category: 'strength' | 'opportunity' | 'warning' | 'suggestion'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  actionItems: string[]
}

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No insights available yet. Keep building to unlock insights!
          </p>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="p-4 rounded-lg border bg-card">
              <div className="flex items-start gap-3">
                {getIcon(insight.category)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{insight.title}</h4>
                    <Badge variant={insight.priority === 'high' ? 'default' : 'outline'}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  {insight.actionItems.length > 0 && (
                    <div className="pt-2 space-y-1">
                      {insight.actionItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <ChevronRight className="h-3 w-3" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant="link" size="sm" className="px-0">
                    Learn more →
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

