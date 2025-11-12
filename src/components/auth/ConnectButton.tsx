'use client';

import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled loading>
        Loading...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-mono transition-colors duration-200 hover:text-gray-900">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <Button variant="outline" size="sm" onClick={() => disconnect()} className="hover:bg-red-50 hover:text-red-600 hover:border-red-300">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => open()} size="sm" aria-label="Connect your cryptocurrency wallet">
      Connect Wallet
    </Button>
  );
}

