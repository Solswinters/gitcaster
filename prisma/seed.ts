import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create theme presets
  const themes = await Promise.all([
    prisma.profileTheme.upsert({
      where: { id: 'theme-default' },
      update: {},
      create: {
        id: 'theme-default',
        name: 'Default',
        isPreset: true,
        isPublic: true,
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#06b6d4',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        layout: 'default',
        fontFamily: 'Inter',
        fontSize: 'base',
      },
    }),
    prisma.profileTheme.upsert({
      where: { id: 'theme-dark' },
      update: {},
      create: {
        id: 'theme-dark',
        name: 'Dark Mode',
        isPreset: true,
        isPublic: true,
        primaryColor: '#60a5fa',
        secondaryColor: '#a78bfa',
        accentColor: '#22d3ee',
        backgroundColor: '#111827',
        textColor: '#f9fafb',
        layout: 'default',
        fontFamily: 'Inter',
        fontSize: 'base',
      },
    }),
    prisma.profileTheme.upsert({
      where: { id: 'theme-ocean' },
      update: {},
      create: {
        id: 'theme-ocean',
        name: 'Ocean',
        isPreset: true,
        isPublic: true,
        primaryColor: '#0ea5e9',
        secondaryColor: '#06b6d4',
        accentColor: '#14b8a6',
        backgroundColor: '#f0f9ff',
        textColor: '#0c4a6e',
        layout: 'default',
        fontFamily: 'Inter',
        fontSize: 'base',
      },
    }),
    prisma.profileTheme.upsert({
      where: { id: 'theme-sunset' },
      update: {},
      create: {
        id: 'theme-sunset',
        name: 'Sunset',
        isPreset: true,
        isPublic: true,
        primaryColor: '#f97316',
        secondaryColor: '#ec4899',
        accentColor: '#eab308',
        backgroundColor: '#fff7ed',
        textColor: '#7c2d12',
        layout: 'default',
        fontFamily: 'Inter',
        fontSize: 'base',
      },
    }),
    prisma.profileTheme.upsert({
      where: { id: 'theme-forest' },
      update: {},
      create: {
        id: 'theme-forest',
        name: 'Forest',
        isPreset: true,
        isPublic: true,
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        accentColor: '#84cc16',
        backgroundColor: '#f0fdf4',
        textColor: '#064e3b',
        layout: 'default',
        fontFamily: 'Inter',
        fontSize: 'base',
      },
    }),
  ]);

  console.log(`✅ Created ${themes.length} theme presets`);

  // Create common skills
  const skills = await Promise.all([
    // Languages
    prisma.skill.upsert({
      where: { name: 'JavaScript' },
      update: {},
      create: {
        name: 'JavaScript',
        category: 'language',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'TypeScript' },
      update: {},
      create: {
        name: 'TypeScript',
        category: 'language',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Python' },
      update: {},
      create: {
        name: 'Python',
        category: 'language',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Go' },
      update: {},
      create: {
        name: 'Go',
        category: 'language',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Rust' },
      update: {},
      create: {
        name: 'Rust',
        category: 'language',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
      },
    }),
    // Frameworks
    prisma.skill.upsert({
      where: { name: 'React' },
      update: {},
      create: {
        name: 'React',
        category: 'framework',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Next.js' },
      update: {},
      create: {
        name: 'Next.js',
        category: 'framework',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Node.js' },
      update: {},
      create: {
        name: 'Node.js',
        category: 'framework',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Vue.js' },
      update: {},
      create: {
        name: 'Vue.js',
        category: 'framework',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Django' },
      update: {},
      create: {
        name: 'Django',
        category: 'framework',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
      },
    }),
    // Tools
    prisma.skill.upsert({
      where: { name: 'Docker' },
      update: {},
      create: {
        name: 'Docker',
        category: 'tool',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Kubernetes' },
      update: {},
      create: {
        name: 'Kubernetes',
        category: 'tool',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Git' },
      update: {},
      create: {
        name: 'Git',
        category: 'tool',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      },
    }),
    // Databases
    prisma.skill.upsert({
      where: { name: 'PostgreSQL' },
      update: {},
      create: {
        name: 'PostgreSQL',
        category: 'platform',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'MongoDB' },
      update: {},
      create: {
        name: 'MongoDB',
        category: 'platform',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Redis' },
      update: {},
      create: {
        name: 'Redis',
        category: 'platform',
        iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
      },
    }),
  ]);

  console.log(`✅ Created ${skills.length} common skills`);

  console.log('✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

