import Link from 'next/link';
import { Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface AuthErrorProps {
  message?: string;
  showLoginButton?: boolean;
}

/**
 * AuthError utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of AuthError.
 */
export function AuthError({ 
  message = 'You need to be signed in to access this page.',
  showLoginButton = true
}: AuthErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-purple-100 p-4 mb-4">
        <Shield className="h-12 w-12 text-purple-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Authentication Required
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      {showLoginButton && (
        <Link href="/onboarding">
          <Button>
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
}

