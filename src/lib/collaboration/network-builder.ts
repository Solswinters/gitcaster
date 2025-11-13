/**
 * Developer network and connection management
 */

export interface Connection {
  id: string
  userId: string
  connectedUserId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}

export interface NetworkStats {
  connectionsCount: number
  mutualConnectionsCount: number
  networkReach: number
  influenceScore: number
}

export class NetworkBuilder {
  static sendConnectionRequest(
    userId: string,
    targetUserId: string
  ): Connection {
    return {
      id: `conn-${Date.now()}`,
      userId,
      connectedUserId: targetUserId,
      status: 'pending',
      createdAt: new Date(),
    }
  }

  static acceptConnection(connection: Connection): Connection {
    return {
      ...connection,
      status: 'accepted',
    }
  }

  static calculateNetworkStats(
    connections: Connection[],
    mutualConnections: Connection[]
  ): NetworkStats {
    return {
      connectionsCount: connections.length,
      mutualConnectionsCount: mutualConnections.length,
      networkReach: connections.length + mutualConnections.length * 2,
      influenceScore: Math.min(100, connections.length * 2 + mutualConnections.length * 5),
    }
  }

  static findMutualConnections(
    userConnections: Connection[],
    targetUserConnections: Connection[]
  ): Connection[] {
    const userIds = new Set(userConnections.map((c) => c.connectedUserId))
    return targetUserConnections.filter((c) => userIds.has(c.connectedUserId))
  }
}

