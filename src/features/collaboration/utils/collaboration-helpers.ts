/**
 * Collaboration utility helpers
 */

export function formatTeamUrl(teamId: string): string {
  return `/teams/${teamId}`;
}

export function generateInviteToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function isInviteExpired(expiresAt: Date): boolean {
  return expiresAt.getTime() < Date.now();
}

