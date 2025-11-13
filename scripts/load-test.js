#!/usr/bin/env node

/**
 * Load testing script for GitCaster
 * Tests API endpoints under load
 */

const http = require('http')

const config = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3000',
  duration: parseInt(process.env.DURATION || '60'), // seconds
  concurrency: parseInt(process.env.CONCURRENCY || '10'),
  endpoints: [
    { path: '/', method: 'GET' },
    { path: '/api/health', method: 'GET' },
    { path: '/profile/test', method: 'GET' },
  ],
}

const stats = {
  requests: 0,
  successful: 0,
  failed: 0,
  responseTimes: [],
}

function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const start = Date.now()
    const url = new URL(endpoint.path, config.baseUrl)
    
    const req = http.get(url, (res) => {
      const duration = Date.now() - start
      stats.requests++
      stats.responseTimes.push(duration)
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        stats.successful++
      } else {
        stats.failed++
      }
      
      res.on('data', () => {}) // consume response
      res.on('end', () => resolve())
    })
    
    req.on('error', () => {
      stats.requests++
      stats.failed++
      resolve()
    })
  })
}

async function runLoadTest() {
  console.log('🚀 Starting load test...')
  console.log(`Target: ${config.baseUrl}`)
  console.log(`Duration: ${config.duration}s`)
  console.log(`Concurrency: ${config.concurrency}`)
  console.log('')
  
  const startTime = Date.now()
  const endTime = startTime + config.duration * 1000
  
  const workers = []
  
  for (let i = 0; i < config.concurrency; i++) {
    const worker = async () => {
      while (Date.now() < endTime) {
        const endpoint = config.endpoints[Math.floor(Math.random() * config.endpoints.length)]
        await makeRequest(endpoint)
      }
    }
    workers.push(worker())
  }
  
  // Progress reporting
  const progressInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000
    const rps = (stats.requests / elapsed).toFixed(2)
    process.stdout.write(`\rProgress: ${elapsed.toFixed(0)}s | Requests: ${stats.requests} | RPS: ${rps}`)
  }, 1000)
  
  await Promise.all(workers)
  clearInterval(progressInterval)
  
  console.log('\n')
  console.log('=' . repeat(50))
  console.log('📊 Load Test Results')
  console.log('=' . repeat(50))
  
  const duration = (Date.now() - startTime) / 1000
  const rps = (stats.requests / duration).toFixed(2)
  const successRate = ((stats.successful / stats.requests) * 100).toFixed(2)
  
  const sorted = stats.responseTimes.sort((a, b) => a - b)
  const p50 = sorted[Math.floor(sorted.length * 0.5)]
  const p95 = sorted[Math.floor(sorted.length * 0.95)]
  const p99 = sorted[Math.floor(sorted.length * 0.99)]
  const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length
  
  console.log(`Duration: ${duration.toFixed(2)}s`)
  console.log(`Total Requests: ${stats.requests}`)
  console.log(`Successful: ${stats.successful}`)
  console.log(`Failed: ${stats.failed}`)
  console.log(`Success Rate: ${successRate}%`)
  console.log(`Requests/sec: ${rps}`)
  console.log('')
  console.log('Response Times:')
  console.log(`  Average: ${avg.toFixed(2)}ms`)
  console.log(`  P50: ${p50}ms`)
  console.log(`  P95: ${p95}ms`)
  console.log(`  P99: ${p99}ms`)
  console.log('')
  
  // Exit with error if too many failures
  if (stats.failed / stats.requests > 0.01) {
    console.log('❌ Test failed: Too many errors (>1%)')
    process.exit(1)
  }
  
  if (p95 > 1000) {
    console.log('⚠️  Warning: P95 response time >1s')
  }
  
  console.log('✅ Load test completed!')
}

runLoadTest().catch((err) => {
  console.error('Error running load test:', err)
  process.exit(1)
})

