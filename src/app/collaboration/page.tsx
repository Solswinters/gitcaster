'use client'

import { TeamCard } from '@/components/collaboration/TeamCard'
import { NetworkGraph } from '@/components/collaboration/NetworkGraph'

export default function CollaborationPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Collaboration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamCard team={{ id: '1', name: 'Team Alpha', members: [] }} />
        <NetworkGraph />
      </div>
    </div>
  )
}

