import { notFound } from 'next/navigation';

import { ProfilePageClient } from '@/components/profile/ProfilePageClient';

async function getProfile(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/profile/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    notFound();
  }

  return <ProfilePageClient profile={profile} />;
}

