/**
 * String capitalization utilities
 */

export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeWords(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export function capitalizeAll(str: string): string {
  return str.toUpperCase();
}

export function capitalizeLowerCase(str: string): string {
  return str.toLowerCase();
}

