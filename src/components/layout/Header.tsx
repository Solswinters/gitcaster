'use client';

import Link from 'next/link';
import { ConnectButton } from '@/components/auth/ConnectButton';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
            <Link 
              href="/" 
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200" 
              aria-label="GitCaster Home"
              tabIndex={0}
            >
              <h1 className="sr-only">GitCaster</h1>
              <span aria-hidden="true">GitCaster</span>
            </Link>
        
        <nav className="flex items-center gap-6" role="navigation" aria-label="Main navigation">
          <Link 
            href="/explore" 
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200" 
            aria-label="Explore developer profiles"
            tabIndex={0}
          >
            Explore
          </Link>
          <Link 
            href="/dashboard" 
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200" 
            aria-label="View your dashboard"
            tabIndex={0}
          >
            Dashboard
          </Link>
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}

