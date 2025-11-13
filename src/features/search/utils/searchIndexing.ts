/**
 * Search Indexing Utilities
 * 
 * Client-side search indexing for faster local filtering
 */

export interface IndexedProfile {
  id: string;
  searchableText: string;
  skills: string[];
  languages: string[];
  location: string;
  experienceLevel: string;
  score: number;
}

/**
 * Create searchable index from profile
 */
export function createProfileIndex(profile: any): IndexedProfile {
  const searchableText = [
    profile.name,
    profile.username,
    profile.bio,
    profile.headline,
    ...( profile.skills?.map((s: any) => s.name) || []),
    ...(profile.languages?.map((l: any) => l.name) || []),
    profile.location,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return {
    id: profile.id,
    searchableText,
    skills: profile.skills?.map((s: any) => s.name.toLowerCase()) || [],
    languages: profile.languages?.map((l: any) => l.name.toLowerCase()) || [],
    location: profile.location?.toLowerCase() || '',
    experienceLevel: profile.experienceLevel?.toLowerCase() || '',
    score: profile.talentScore || 0,
  };
}

/**
 * Search indexed profiles locally
 */
export function searchIndexedProfiles(
  index: IndexedProfile[],
  query: string
): IndexedProfile[] {
  const terms = query.toLowerCase().split(' ').filter(Boolean);
  
  return index.filter(profile => {
    return terms.every(term => profile.searchableText.includes(term));
  });
}

/**
 * Filter indexed profiles by criteria
 */
export function filterIndexedProfiles(
  profiles: IndexedProfile[],
  filters: {
    skills?: string[];
    languages?: string[];
    location?: string;
    minScore?: number;
  }
): IndexedProfile[] {
  return profiles.filter(profile => {
    // Skills filter
    if (filters.skills?.length) {
      const hasSkill = filters.skills.some(skill =>
        profile.skills.includes(skill.toLowerCase())
      );
      if (!hasSkill) return false;
    }

    // Languages filter
    if (filters.languages?.length) {
      const hasLanguage = filters.languages.some(lang =>
        profile.languages.includes(lang.toLowerCase())
      );
      if (!hasLanguage) return false;
    }

    // Location filter
    if (filters.location) {
      if (!profile.location.includes(filters.location.toLowerCase())) {
        return false;
      }
    }

    // Score filter
    if (filters.minScore !== undefined && filters.minScore !== null) {
      if (profile.score < filters.minScore) return false;
    }

    return true;
  });
}

/**
 * Sort indexed profiles
 */
export function sortIndexedProfiles(
  profiles: IndexedProfile[],
  sortBy: 'relevance' | 'score' | 'recent'
): IndexedProfile[] {
  const sorted = [...profiles];

  switch (sortBy) {
    case 'score':
      return sorted.sort((a, b) => b.score - a.score);
    case 'relevance':
      // Relevance is determined by search algorithm
      return sorted;
    case 'recent':
      // Would need timestamp in index
      return sorted;
    default:
      return sorted;
  }
}

