/**
 * Social media sharing utilities
 */

export interface ShareOptions {
  title: string
  text?: string
  url: string
}

/**
 * Share on Twitter
 */
export function shareOnTwitter({ title, text, url }: ShareOptions) {
  const tweetText = text || title
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, '_blank', 'width=600,height=400')
}

/**
 * Share on LinkedIn
 */
export function shareOnLinkedIn({ url }: ShareOptions) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  window.open(linkedInUrl, '_blank', 'width=600,height=600')
}

/**
 * Copy link to clipboard
 */
export async function copyProfileLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch (error) {
    console.error('Failed to copy link:', error)
    return false
  }
}

/**
 * Generate Open Graph image URL
 */
export function generateOGImageURL(profile: {
  displayName?: string
  githubUsername?: string
  bio?: string
  avatarUrl?: string
}): string {
  const params = new URLSearchParams({
    name: profile.displayName || profile.githubUsername || 'Developer',
    bio: profile.bio || 'Developer Profile',
    avatar: profile.avatarUrl || '',
  })
  
  return `/api/og-image?${params.toString()}`
}

/**
 * Generate QR code for profile
 */
export function generateQRCode(url: string, size: number = 256): string {
  // Using a QR code API service
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
}

/**
 * Generate embed code for profile
 */
export function generateEmbedCode(profileSlug: string, options: {
  width?: number
  height?: number
  theme?: 'light' | 'dark'
} = {}): string {
  const { width = 350, height = 450, theme = 'light' } = options
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/embed/${profileSlug}?theme=${theme}`
  
  return `<iframe src="${url}" width="${width}" height="${height}" frameborder="0" allowtransparency="true"></iframe>`
}

/**
 * Native share API (mobile)
 */
export async function nativeShare({ title, text, url }: ShareOptions): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false
  }

  try {
    await navigator.share({ title, text, url })
    return true
  } catch (error) {
    console.error('Native share failed:', error)
    return false
  }
}

