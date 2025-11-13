# Search & Discovery Documentation

## Overview

GitCaster's search system allows recruiters and users to discover developers based on their GitHub activity, skills, location, experience level, and Talent Protocol scores.

## Features

### Search Capabilities

- **Text Search**: Search by developer name, GitHub username, bio, or tags
- **Skill Filtering**: Filter by programming languages, frameworks, and tools
- **Location-Based**: Find developers in specific locations or remote
- **Experience Level**: Filter by junior, mid-level, senior, or lead positions
- **Years of Experience**: Set minimum and maximum years
- **Talent Score**: Filter by minimum Talent Protocol score
- **Featured Developers**: Highlight top-performing developers

### User Interface

#### Desktop View
- Full-featured search page with sidebar filters
- Advanced search options
- Sort by relevance, activity, score, or experience
- Pagination with page numbers
- Keyboard shortcuts for navigation

#### Mobile View
- Optimized touch interface
- Bottom sheet filters
- Sticky search bar
- Scroll-to-top button
- Responsive design

### Advanced Features

#### Autocomplete
- Real-time suggestions as you type
- Suggests skills, locations, and usernames
- Shows result counts for locations
- Displays user avatars in suggestions

#### Saved Searches
- Save frequently used search queries
- Quick access to saved searches
- Manage saved searches from dashboard

#### Search Analytics
- Track popular search queries
- Monitor trending skills
- View search volume over time
- Analyze user search behavior

#### Keyboard Shortcuts
- `/` or `Ctrl/Cmd+K`: Focus search bar
- `Ctrl+F`: Toggle filters
- `Alt+←`: Previous page
- `Alt+→`: Next page
- `Esc`: Clear search or close modals

#### Caching
- Search results cached for 5 minutes
- Reduces API calls and improves performance
- Automatic cache cleanup

## API Endpoints

### Search Developers
```
GET /api/search
```

**Query Parameters:**
- `q`: Search query (name, username, bio)
- `skills`: Comma-separated skill names
- `languages`: Comma-separated programming languages
- `location`: Location string
- `experienceLevel`: Comma-separated levels (junior, mid, senior, lead)
- `minYears`: Minimum years of experience
- `maxYears`: Maximum years of experience
- `minScore`: Minimum Talent Protocol score
- `featured`: Boolean for featured developers only
- `hasGitHub`: Boolean for developers with GitHub
- `hasTalentProtocol`: Boolean for developers with Talent score
- `sortBy`: Sort option (relevance, activity, score, experience)
- `sortOrder`: Sort direction (asc, desc)
- `page`: Page number (default: 1)
- `pageSize`: Results per page (default: 20, max: 100)

**Response:**
```json
{
  "profiles": [
    {
      "id": "...",
      "slug": "developer-username",
      "displayName": "Developer Name",
      "bio": "Full stack developer...",
      "avatarUrl": "https://...",
      "location": "San Francisco, CA",
      "experienceLevel": "senior",
      "yearsOfExperience": 8,
      "talentScore": 85.5,
      "isFeatured": true,
      "user": {
        "githubUsername": "username",
        "githubStats": [...]
      },
      "skills": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Search Suggestions
```
POST /api/search
```

**Request Body:**
```json
{
  "query": "reac"
}
```

**Response:**
```json
{
  "suggestions": {
    "skills": [
      { "type": "skill", "value": "React", "category": "framework" }
    ],
    "locations": [
      { "type": "location", "value": "San Francisco", "count": 50 }
    ],
    "users": [
      {
        "type": "user",
        "value": "john-doe",
        "displayName": "John Doe",
        "avatarUrl": "https://..."
      }
    ]
  }
}
```

### Saved Searches

#### Get Saved Searches
```
GET /api/search/saved
```

Requires authentication.

#### Save a Search
```
POST /api/search/saved
```

**Request Body:**
```json
{
  "query": "React developer",
  "filters": {
    "skills": ["React", "TypeScript"],
    "experienceLevel": ["senior"]
  }
}
```

#### Delete Saved Search
```
DELETE /api/search/saved?id=<searchId>
```

### Search Analytics
```
GET /api/analytics/search?period=7d
```

**Parameters:**
- `period`: Time period (7d, 30d, 90d)

**Response:**
```json
{
  "totalSearches": 1250,
  "avgResults": 42,
  "popularQueries": [
    { "query": "React developer", "count": 120 }
  ],
  "topSkills": [
    { "skill": "TypeScript", "count": 85 }
  ],
  "trends": [
    { "date": "2024-01-01", "count": 45 }
  ]
}
```

## Database Schema

### Profile Search Fields
```prisma
model Profile {
  searchTags         String[]  @default([])
  experienceLevel    String?   // 'junior' | 'mid' | 'senior' | 'lead'
  yearsOfExperience  Int?
  isFeatured         Boolean   @default(false)
  featuredAt         DateTime?
  lastActiveAt       DateTime?
  
  @@index([experienceLevel])
  @@index([isFeatured])
  @@index([lastActiveAt])
}
```

### Skills
```prisma
model Skill {
  id        String   @id @default(cuid())
  name      String   @unique
  category  String   // 'language' | 'framework' | 'tool' | 'platform'
  
  @@index([category])
  @@index([name])
}

model ProfileSkill {
  id           String   @id @default(cuid())
  profileId    String
  skillId      String
  proficiency  Int      // 1-5 scale
  yearsUsed    Float?
  verified     Boolean  @default(false)
  
  @@unique([profileId, skillId])
  @@index([proficiency])
}
```

### Search Queries
```prisma
model SearchQuery {
  id        String   @id @default(cuid())
  query     String
  filters   Json?
  results   Int      @default(0)
  userId    String?
  createdAt DateTime @default(now())
  
  @@index([createdAt])
  @@index([userId])
}
```

## Performance Optimization

### Indexing Strategy
- Experience level indexed for quick filtering
- Location indexed for geographic searches
- Featured status indexed for priority display
- Last activity indexed for sorting
- Skills proficiency indexed for relevance

### Caching
- Client-side caching with 5-minute TTL
- Automatic cache invalidation
- Cache statistics available for monitoring

### Query Optimization
- Efficient Prisma queries with minimal joins
- Pagination to limit result sets
- Conditional includes based on requirements

## Usage Examples

### Basic Search
```typescript
const results = await fetch('/api/search?q=React developer');
```

### Advanced Filtering
```typescript
const results = await fetch('/api/search?' + new URLSearchParams({
  q: 'Full Stack',
  skills: 'TypeScript,React,Node.js',
  location: 'Remote',
  experienceLevel: 'senior,lead',
  minYears: '5',
  minScore: '70',
  sortBy: 'score'
}));
```

### Save Search
```typescript
await fetch('/api/search/saved', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'React developer',
    filters: { skills: ['React'], experienceLevel: ['senior'] }
  })
});
```

## Best Practices

1. **Use specific queries**: More specific searches return better results
2. **Combine filters**: Use multiple filters for precise targeting
3. **Save frequent searches**: Save searches you use regularly
4. **Monitor analytics**: Track what searches work best
5. **Leverage autocomplete**: Use suggestions for accurate skill names
6. **Use keyboard shortcuts**: Navigate faster with shortcuts

## Future Enhancements

- [ ] Semantic search with AI
- [ ] Geolocation-based radius search
- [ ] Salary range filtering
- [ ] Company size preferences
- [ ] Work authorization status
- [ ] Availability calendar integration
- [ ] Real-time search updates via WebSockets
- [ ] Search result preview cards
- [ ] Collaborative search with team sharing

