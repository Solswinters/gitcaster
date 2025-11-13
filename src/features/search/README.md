# Search Feature Module

Developer search and discovery functionality with advanced filtering, caching, and performance monitoring.

## Features

- **Advanced Search**: Multi-field search with relevance scoring
- **Smart Filtering**: Skills, languages, location, experience filters
- **Performance**: Client-side caching and indexing
- **Pagination**: Efficient result pagination
- **Analytics**: Search performance tracking

## Usage

```typescript
import { useSearch, searchService, SearchFilters } from '@/features/search';

// Using the hook
const { results, isSearching, search } = useSearch();

// Execute search
const filters: SearchFilters = {
  query: 'React developer',
  skills: ['React', 'TypeScript'],
  location: 'San Francisco',
  minYears: 3,
};

await search(filters);

// Direct service usage
const results = await searchService.search(filters, 1, 20);
```

## Utilities

- `searchHelpers` - Query building, relevance scoring, validation
- `searchCache` - Results caching with TTL
- `searchIndexing` - Client-side indexing for fast filtering
- `searchPagination` - Pagination calculations
- `searchPerformance` - Performance monitoring and analytics

## See Also

- [Search API Documentation](/docs/api/search.md)
- [Filter Customization Guide](/docs/guides/search-filters.md)

