import { env } from '@/lib/env';

describe('Environment Configuration', () => {
  it('exports env object', () => {
    expect(env).toBeDefined();
  });

  it('has NODE_ENV', () => {
    expect(env.NODE_ENV).toBeDefined();
  });

  it('has database URL', () => {
    expect(env.DATABASE_URL).toBeDefined();
  });
});

