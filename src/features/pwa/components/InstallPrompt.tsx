/**
 * PWA install prompt component
 */

'use client';

import { usePWA } from '../hooks';

export function InstallPrompt() {
  const { canInstall, promptInstall, isInstalled } = usePWA();

  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 p-4 bg-primary text-primary-foreground rounded-lg shadow-lg md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="flex items-start gap-3">
        <span className="text-2xl">📱</span>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Install GitCaster</h3>
          <p className="text-sm opacity-90 mb-3">
            Install our app for a better experience
          </p>
          <div className="flex gap-2">
            <button
              onClick={promptInstall}
              className="px-4 py-2 bg-primary-foreground text-primary rounded text-sm font-medium"
            >
              Install
            </button>
            <button
              className="px-4 py-2 border border-primary-foreground rounded text-sm"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

