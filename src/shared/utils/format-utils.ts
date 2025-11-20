/**
 * Format Utilities - Comprehensive data formatting functions
 */

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Format date
 */
export const formatDate = (date: Date | string | number, format: string = 'short'): string => {
  const d = new Date(date)

  const formats: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'long', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: 'numeric', minute: 'numeric' },
    datetime: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
  }

  return d.toLocaleDateString('en-US', formats[format] || formats.short)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
}

/**
 * Format duration in milliseconds
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  }

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }

  return `${seconds}s`
}

/**
 * Format phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '')

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }

  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4')
  }

  return phoneNumber
}

/**
 * Format address
 */
export const formatAddress = (address: string, chars: number = 4): string => {
  if (!address || address.length < chars * 2) {
    return address
  }

  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/**
 * Format Ethereum address
 */
export const formatEthAddress = (address: string): string => {
  return formatAddress(address, 6)
}

/**
 * Format hash
 */
export const formatHash = (hash: string, chars: number = 8): string => {
  return formatAddress(hash, chars)
}

/**
 * Format username
 */
export const formatUsername = (username: string): string => {
  return username.startsWith('@') ? username : `@${username}`
}

/**
 * Format GitHub URL
 */
export const formatGitHubUrl = (username: string): string => {
  return `https://github.com/${username}`
}

/**
 * Format Twitter URL
 */
export const formatTwitterUrl = (handle: string): string => {
  const cleanHandle = handle.replace('@', '')
  return `https://twitter.com/${cleanHandle}`
}

/**
 * Format LinkedIn URL
 */
export const formatLinkedInUrl = (username: string): string => {
  return `https://linkedin.com/in/${username}`
}

/**
 * Truncate text
 */
export const truncate = (text: string, length: number = 100, suffix: string = '...'): string => {
  if (text.length <= length) {
    return text
  }

  return text.slice(0, length - suffix.length) + suffix
}

/**
 * Truncate words
 */
export const truncateWords = (text: string, wordCount: number = 20, suffix: string = '...'): string => {
  const words = text.split(' ')

  if (words.length <= wordCount) {
    return text
  }

  return words.slice(0, wordCount).join(' ') + suffix
}

/**
 * Pluralize word
 */
export const pluralize = (word: string, count: number, plural?: string): string => {
  if (count === 1) {
    return word
  }

  return plural || `${word}s`
}

/**
 * Format count with word
 */
export const formatCount = (count: number, singular: string, plural?: string): string => {
  return `${formatNumber(count)} ${pluralize(singular, count, plural)}`
}

/**
 * Ordinal suffix (1st, 2nd, 3rd, etc.)
 */
export const ordinal = (num: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = num % 100
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

/**
 * Format list
 */
export const formatList = (items: string[], conjunction: 'and' | 'or' = 'and'): string => {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`

  const last = items[items.length - 1]
  const rest = items.slice(0, -1)

  return `${rest.join(', ')}, ${conjunction} ${last}`
}

/**
 * Format initials
 */
export const formatInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Format compact number (1K, 1M, 1B)
 */
export const formatCompactNumber = (num: number): string => {
  if (num < 1000) return num.toString()

  const units = ['', 'K', 'M', 'B', 'T']
  const order = Math.floor(Math.log10(Math.abs(num)) / 3)
  const unitName = units[order]
  const value = num / Math.pow(10, order * 3)

  return `${value.toFixed(1)}${unitName}`
}

/**
 * Format repo stars
 */
export const formatStars = (stars: number): string => {
  return formatCompactNumber(stars)
}

/**
 * Format score
 */
export const formatScore = (score: number, maxScore: number = 100): string => {
  const percentage = (score / maxScore) * 100
  return `${score}/${maxScore} (${percentage.toFixed(0)}%)`
}

/**
 * Format language
 */
export const formatLanguage = (language: string): string => {
  const languageNames: Record<string, string> = {
    js: 'JavaScript',
    ts: 'TypeScript',
    py: 'Python',
    rb: 'Ruby',
    go: 'Go',
    rs: 'Rust',
    cpp: 'C++',
    cs: 'C#',
    java: 'Java',
    php: 'PHP',
    swift: 'Swift',
    kt: 'Kotlin',
  }

  return languageNames[language.toLowerCase()] || language
}

/**
 * Format JSON
 */
export const formatJSON = (obj: any, indent: number = 2): string => {
  return JSON.stringify(obj, null, indent)
}

/**
 * Format bytes to human readable
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  return formatFileSize(bytes, decimals)
}

/**
 * Format time ago
 */
export const formatTimeAgo = (date: Date | string | number): string => {
  return formatRelativeTime(date)
}

/**
 * Format ISO date to local
 */
export const formatISODate = (isoString: string): string => {
  return formatDate(isoString)
}

/**
 * Format boolean to Yes/No
 */
export const formatBoolean = (value: boolean): string => {
  return value ? 'Yes' : 'No'
}

/**
 * Format array to comma-separated string
 */
export const formatArray = (arr: any[], separator: string = ', '): string => {
  return arr.join(separator)
}

/**
 * Format tags
 */
export const formatTags = (tags: string[]): string => {
  return tags.map((tag) => `#${tag}`).join(' ')
}

/**
 * Format skill level
 */
export const formatSkillLevel = (level: number): string => {
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master']
  return levels[Math.min(level - 1, levels.length - 1)] || 'Unknown'
}

/**
 * Format contribution count
 */
export const formatContributions = (count: number): string => {
  return formatCount(count, 'contribution')
}

/**
 * Format repository count
 */
export const formatRepoCount = (count: number): string => {
  return formatCount(count, 'repository', 'repositories')
}

/**
 * Format follower count
 */
export const formatFollowers = (count: number): string => {
  return formatCount(count, 'follower')
}

export default {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatDate,
  formatRelativeTime,
  formatDuration,
  formatPhoneNumber,
  formatAddress,
  formatEthAddress,
  formatHash,
  formatUsername,
  formatGitHubUrl,
  formatTwitterUrl,
  formatLinkedInUrl,
  truncate,
  truncateWords,
  pluralize,
  formatCount,
  ordinal,
  formatList,
  formatInitials,
  formatCompactNumber,
  formatStars,
  formatScore,
  formatLanguage,
  formatJSON,
  formatBytes,
  formatTimeAgo,
  formatISODate,
  formatBoolean,
  formatArray,
  formatTags,
  formatSkillLevel,
  formatContributions,
  formatRepoCount,
  formatFollowers,
}

