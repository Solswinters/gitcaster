/**
 * Team management system
 */

export interface TeamMember {
  id: string
  name: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: Date
}

export interface Team {
  id: string
  name: string
  description: string
  members: TeamMember[]
  repositories: string[]
  createdAt: Date
}

export class TeamManager {
  static createTeam(data: Omit<Team, 'id' | 'createdAt'>): Team {
    return {
      ...data,
      id: `team-${Date.now()}`,
      createdAt: new Date(),
    }
  }

  static addMember(team: Team, member: Omit<TeamMember, 'joinedAt'>): Team {
    return {
      ...team,
      members: [
        ...team.members,
        { ...member, joinedAt: new Date() },
      ],
    }
  }

  static removeMember(team: Team, memberId: string): Team {
    return {
      ...team,
      members: team.members.filter((m) => m.id !== memberId),
    }
  }

  static updateMemberRole(
    team: Team,
    memberId: string,
    role: TeamMember['role']
  ): Team {
    return {
      ...team,
      members: team.members.map((m) =>
        m.id === memberId ? { ...m, role } : m
      ),
    }
  }
}

