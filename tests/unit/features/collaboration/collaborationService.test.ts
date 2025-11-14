import { collaborationService } from '@/features/collaboration/services/collaborationService';

describe('CollaborationService', () => {
  it('creates teams', async () => {
    const team = {
      name: 'Test Team',
      members: ['user1', 'user2'],
    };

    const result = await collaborationService.createTeam(team);
    expect(result).toBeTruthy();
  });

  it('manages team members', async () => {
    const result = await collaborationService.addMember('team1', 'user3');
    expect(result).toBeTruthy();
  });
});

