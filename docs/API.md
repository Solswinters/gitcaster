# API Documentation

Complete API reference for GitCaster.

## Base URL

```
https://api.gitcaster.com
```

## Authentication

All API requests require authentication using JWT tokens.

### Headers

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

## Endpoints

### Authentication

#### POST /api/auth/signin

Sign in with GitHub.

**Request:**
```json
{
  "code": "github_oauth_code"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://..."
  },
  "token": "jwt_token"
}
```

#### POST /api/auth/signout

Sign out current user.

**Response:**
```json
{
  "success": true
}
```

### Users

#### GET /api/users/me

Get current user profile.

**Response:**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "githubUsername": "johndoe",
  "walletAddress": "0x...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/users/me

Update current user profile.

**Request:**
```json
{
  "name": "John Updated",
  "bio": "Developer"
}
```

**Response:**
```json
{
  "id": "user_123",
  "name": "John Updated",
  "bio": "Developer"
}
```

### GitHub

#### GET /api/github/repos

Get user's GitHub repositories.

**Query Parameters:**
- `page` (number, optional): Page number
- `per_page` (number, optional): Items per page (max 100)

**Response:**
```json
{
  "repos": [
    {
      "id": 123,
      "name": "repo-name",
      "full_name": "user/repo-name",
      "description": "Repository description",
      "stars": 100,
      "forks": 50,
      "language": "TypeScript"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 30,
    "total": 100
  }
}
```

#### GET /api/github/stats

Get user's GitHub statistics.

**Response:**
```json
{
  "totalRepos": 50,
  "totalStars": 1000,
  "totalForks": 200,
  "contributions": 500,
  "languages": {
    "TypeScript": 40,
    "JavaScript": 30,
    "Python": 20,
    "Go": 10
  }
}
```

### Search

#### GET /api/search/users

Search for users.

**Query Parameters:**
- `q` (string, required): Search query
- `page` (number, optional): Page number
- `limit` (number, optional): Results per page

**Response:**
```json
{
  "users": [
    {
      "id": "user_123",
      "name": "John Doe",
      "githubUsername": "johndoe",
      "bio": "Developer",
      "avatar": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

#### GET /api/search/repos

Search for repositories.

**Query Parameters:**
- `q` (string, required): Search query
- `language` (string, optional): Filter by language
- `sort` (string, optional): Sort by (stars, forks, updated)

**Response:**
```json
{
  "repos": [
    {
      "id": 123,
      "name": "repo-name",
      "owner": "username",
      "description": "Description",
      "stars": 100
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Error Codes

- `VALIDATION_ERROR` (400): Invalid request data
- `UNAUTHORIZED` (401): Missing or invalid authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict
- `RATE_LIMIT` (429): Too many requests
- `SERVER_ERROR` (500): Internal server error

## Rate Limiting

API requests are rate limited to:

- **Authenticated**: 1000 requests/hour
- **Unauthenticated**: 60 requests/hour

Rate limit headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

## Webhooks

Subscribe to events via webhooks.

### Events

- `user.created`: New user registered
- `user.updated`: User profile updated
- `repo.created`: Repository created
- `repo.updated`: Repository updated

### Webhook Payload

```json
{
  "event": "user.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "user_123",
    "name": "John Doe"
  }
}
```

## SDKs

Official SDKs available for:

- JavaScript/TypeScript
- Python
- Go
- Ruby

## Examples

### JavaScript

```javascript
import { GitCasterClient } from '@gitcaster/sdk';

const client = new GitCasterClient({
  apiKey: 'YOUR_API_KEY',
});

// Get current user
const user = await client.users.me();

// Search users
const results = await client.search.users('john');
```

### cURL

```bash
# Get current user
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.gitcaster.com/api/users/me

# Search users
curl "https://api.gitcaster.com/api/search/users?q=john"
```

## Support

For API support:
- Check [documentation](../README.md)
- Email: api@gitcaster.com
- Discord: https://discord.gg/gitcaster

