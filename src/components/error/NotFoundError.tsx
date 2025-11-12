import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface NotFoundErrorProps {
  resource?: string;
}

export function NotFoundError({ resource = 'page' }: NotFoundErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <FileQuestion className="h-12 w-12 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {resource === 'page' ? '404 - Page Not Found' : 'Not Found'}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        The {resource} you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button>
          Go Home
        </Button>
      </Link>
    </div>
  );
}

