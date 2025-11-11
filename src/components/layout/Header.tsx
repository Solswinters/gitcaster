'use client';

import Link from 'next/link';
import { ConnectButton } from '@/components/auth/ConnectButton';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          GitCaster
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/explore" className="text-gray-600 hover:text-gray-900">
            Explore
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}

