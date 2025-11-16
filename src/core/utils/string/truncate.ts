/**
 * String truncation utilities
 */

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + '...';
}

export function truncateWords(str: string, maxWords: number): string {
  const words = str.split(' ');
  if (words.length <= maxWords) {
    return str;
  }
  return words.slice(0, maxWords).join(' ') + '...';
}

export function truncateMiddle(str: string, maxLength: number, separator: string = '...'): string {
  if (str.length <= maxLength) {
    return str;
  }
  
  const charsToShow = maxLength - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  
  return str.slice(0, frontChars) + separator + str.slice(-backChars);
}

