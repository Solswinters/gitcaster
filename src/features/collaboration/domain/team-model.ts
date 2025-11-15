/**
 * Team domain model
 */

import type { Team, TeamMember } from '../types';

export class TeamModel {
  constructor(private team: Team) {}

  get id(): string {
    return this.team.id;
  }

  get memberCount(): number {
    return this.team.members.length;
  }

  isOwner(userId: string): boolean {
    return this.team.ownerId === userId;
  }

  isAdmin(userId: string): boolean {
    const member = this.getMember(userId);
    return member?.role === 'admin' || member?.role === 'owner';
  }

  isMember(userId: string): boolean {
    return this.team.members.some(m => m.userId === userId);
  }

  getMember(userId: string): TeamMember | undefined {
    return this.team.members.find(m => m.userId === userId);
  }

  getAdmins(): TeamMember[] {
    return this.team.members.filter(m => m.role === 'admin' || m.role === 'owner');
  }

  toJSON(): Team {
    return this.team;
  }
}

