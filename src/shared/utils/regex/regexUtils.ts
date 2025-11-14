/**
 * Regex Utilities
 *
 * Common regular expressions and validation patterns
 *
 * @module shared/utils/regex/regexUtils
 */

/**
 * Email regex pattern
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * URL regex pattern
 */
export const URL_REGEX =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

/**
 * Phone regex pattern (US format)
 */
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

/**
 * Hex color regex pattern
 */
export const HEX_COLOR_REGEX = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;

/**
 * IPv4 regex pattern
 */
export const IPV4_REGEX =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Username regex pattern (alphanumeric and underscore)
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Slug regex pattern (URL-friendly)
 */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Credit card regex pattern
 */
export const CREDIT_CARD_REGEX = /^[0-9]{13,19}$/;

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  return URL_REGEX.test(url);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}

/**
 * Validate IPv4 address
 */
export function isValidIPv4(ip: string): boolean {
  return IPV4_REGEX.test(ip);
}

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
  return USERNAME_REGEX.test(username);
}

/**
 * Validate slug
 */
export function isValidSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}

/**
 * Extract emails from text
 */
export function extractEmails(text: string): string[] {
  const emailRegex = /([^\s@]+@[^\s@]+\.[^\s@]+)/g;
  return text.match(emailRegex) || [];
}

/**
 * Extract URLs from text
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

/**
 * Extract hashtags from text
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.matchAll(hashtagRegex);
  return Array.from(matches, (m) => m[1]);
}

/**
 * Extract mentions from text
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const matches = text.matchAll(mentionRegex);
  return Array.from(matches, (m) => m[1]);
}

/**
 * Escape regex special characters
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create regex from wildcard pattern
 */
export function wildcardToRegex(pattern: string): RegExp {
  const escaped = escapeRegex(pattern).replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
  return new RegExp(`^${escaped}$`);
}

