// User-facing message constants for consistent messaging

export const MESSAGES = {
  AUTH: {
    CONNECTING: 'Connecting wallet...',
    SIGNING: 'Sign the message in your wallet to continue',
    SUCCESS: 'Successfully authenticated!',
    ERROR: 'Authentication failed. Please try again.',
  },
  SYNC: {
    IN_PROGRESS: 'Syncing your data...',
    SUCCESS: 'Data synced successfully!',
    ERROR: 'Failed to sync data. Please try again.',
  },
  PROFILE: {
    COPIED: 'Profile link copied to clipboard!',
    NOT_FOUND: 'Profile not found',
  },
} as const;

