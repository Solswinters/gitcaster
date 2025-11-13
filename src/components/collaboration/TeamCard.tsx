'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'

interface TeamCardProps {
  team: {
    id: string
    name: string
    members: Array<{ id: string; name: string; role: string }>
  }
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>{team.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {team.members.slice(0, 5).map((member) => (
            <Avatar key={member.id} className="h-8 w-8">
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
          ))}
          {team.members.length > 5 && (
            <Badge variant="secondary">+{team.members.length - 5}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

