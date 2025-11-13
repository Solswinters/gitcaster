# Analytics API Reference

## Endpoints

### GET /api/analytics/metrics
Get comprehensive developer metrics with optional benchmarking.

**Auth Required**: Yes

**Query Parameters**:
- `userId` (optional): Target user ID. Defaults to authenticated user.
- `includeBenchmarks` (boolean): Include peer benchmarking data
- `includeHistory` (boolean): Include historical metrics

**Response**:
```json
{
  "metrics": {
    "commitFrequency": 15.2,
    "prVelocity": 10.5,
    "codeQualityScore": 85,
    ...
  },
  "benchmarks": {
    "commitFrequency": {
      "percentile": 75,
      "rank": 125
    },
    ...
  },
  "insights": [
    "🔥 Exceptional commit frequency!",
    ...
  ],
  "metadata": {
    "calculatedAt": "2024-01-01T00:00:00Z",
    "weeksActive": 52
  }
}
```

### GET /api/analytics/career
Get career progression and trajectory analysis.

**Auth Required**: Yes

**Query Parameters**:
- `userId` (optional): Target user ID

**Response**:
```json
{
  "trajectory": {
    "stages": [...],
    "currentStage": {...},
    "projectedNextStage": {...}
  },
  "skillProgressions": [...],
  "milestones": [...],
  "metadata": {
    "analyzedAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/analytics/predict
Get predictive analytics and forecasts.

**Auth Required**: Yes

**Query Parameters**:
- `type`: "growth" or "career"

**Response** (type=growth):
```json
{
  "predictions": [
    {
      "metric": "commits",
      "currentValue": 100,
      "predicted3Months": 120,
      "predicted6Months": 145,
      "predicted12Months": 190,
      "confidence": 85,
      "trend": "increasing"
    }
  ]
}
```

## Rate Limits
- 100 requests per minute per user
- 1000 requests per hour per user

## Error Responses
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access denied
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests

