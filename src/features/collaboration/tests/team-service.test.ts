/**
 * Team service tests
 */

import { describe, it, expect } from '@jest/globals';
import { TeamService } from '../services/team-service';

describe('TeamService', () => {
  it('should create team', async () => {
    const team = await TeamService.createTeam({
      name: 'Test Team',
      description: 'A test team',
      ownerId: 'user-id',
    });
    expect(team).toBeDefined();
  });

  it('should add member to team', async () => {
    const result = await TeamService.addMember('team-id', 'user-id');
    expect(result).toBeDefined();
  });
});

