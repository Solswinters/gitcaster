/**
 * Search helper utilities
 */

export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function calculateRelevanceScore(
  item: { username: string; bio?: string; skills: string[] },
  query: string
): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();

  // Username match
  if (item.username.toLowerCase().includes(lowerQuery)) {
    score += 50;
  }

  // Bio match
  if (item.bio?.toLowerCase().includes(lowerQuery)) {
    score += 30;
  }

  // Skills match
  const matchedSkills = item.skills.filter((s) =>
    s.toLowerCase().includes(lowerQuery)
  );
  score += matchedSkills.length * 20;

  return score;
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function extractSearchTerms(query: string): string[] {
  return query
    .split(' ')
    .map((term) => term.trim())
    .filter(Boolean);
}

export function buildSearchUrl(query: string, filters?: Record<string, any>): string {
  const params = new URLSearchParams();
  
  if (query) params.set('q', query);
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, String(value));
        }
      }
    });
  }

  return `/search?${params.toString()}`;
}

