/**
 * Full page loader component
 */

'use client';

import { LoadingOverlay } from './LoadingOverlay';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return <LoadingOverlay message={message} fullScreen={true} />;
}

