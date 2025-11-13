import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test homepage
  let res = http.get(BASE_URL);
  check(res, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in < 1s': (r) => r.timings.duration < 1000,
  });
  sleep(1);

  // Test search page
  res = http.get(`${BASE_URL}/search`);
  check(res, {
    'search page status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // Test API health check
  res = http.get(`${BASE_URL}/api/health`);
  check(res, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}

