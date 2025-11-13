export interface ContributorNode {
  id: string
  name: string
  contributions: number
}

export interface CollaborationEdge {
  from: string
  to: string
  weight: number
}

export class ContributorGraph {
  static buildGraph(
    contributors: ContributorNode[],
    collaborations: CollaborationEdge[]
  ) {
    return {
      nodes: contributors,
      edges: collaborations,
      stats: {
        totalContributors: contributors.length,
        totalCollaborations: collaborations.length,
      },
    }
  }

  static findInfluencers(contributors: ContributorNode[]): ContributorNode[] {
    return contributors
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 10)
  }
}
