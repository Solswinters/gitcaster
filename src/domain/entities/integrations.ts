/**
 * Third-party Integration Types
 * 
 * Type definitions for external service integrations
 */

/**
 * Talent Protocol Types
 */
export interface TalentProtocolScore {
  passport_id: number;
  score: number;
  human_checkmark: boolean;
  calculating: boolean;
  passport_profile: {
    display_name: string;
    image_url: string;
    bio: string;
  };
  activity_score: number;
  identity_score: number;
  skills_score: number;
  passport_socials: Array<{
    source: string;
    follower_count: number;
  }>;
}

export interface TalentProtocolCredential {
  id: string;
  credential_type: string;
  name: string;
  value: string | number;
  verified: boolean;
  issued_at: string;
}

/**
 * Web3 Provider Types
 */
export interface WalletInfo {
  address: string;
  chainId: number;
  isConnected: boolean;
  connector?: string;
}

/**
 * Analytics Provider Types
 */
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

/**
 * Type guard for Talent Protocol score validity
 */
export function isValidTalentScore(score: TalentProtocolScore): boolean {
  return !score.calculating && score.score > 0;
}

/**
 * Get score category based on value
 */
export function getTalentScoreCategory(score: number): 'low' | 'medium' | 'high' | 'exceptional' {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  if (score < 85) return 'high';
  return 'exceptional';
}

