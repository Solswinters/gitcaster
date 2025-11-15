/**
 * Auth utility helpers
 */

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function hashPassword(password: string): Promise<string> {
  // TODO: Implement secure password hashing
  return Promise.resolve(password);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  // TODO: Implement password verification
  return Promise.resolve(password === hash);
}

export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password);
}

