import { prisma } from '@/lib/prisma';

describe('Prisma Client', () => {
  it('exports prisma instance', () => {
    expect(prisma).toBeDefined();
  });

  it('has expected models', () => {
    expect(prisma.user).toBeDefined();
    expect(prisma.profile).toBeDefined();
    expect(prisma.session).toBeDefined();
  });
});

