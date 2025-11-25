import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PermissionErrorProps {
  resource?: string;
  action?: string;
}

export function PermissionError({ 
  resource = 'this resource',
  action = 'access'
}: PermissionErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-amber-100 p-4 mb-4">
        <ShieldAlert className="h-12 w-12 text-amber-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Permission Denied
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        You don't have permission to {action} {resource}.
      </p>
      <Link href="/dashboard">
        <Button variant="outline">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}

