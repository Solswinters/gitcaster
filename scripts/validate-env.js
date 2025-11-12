#!/usr/bin/env node

/**
 * Environment validation script
 * Checks if all required environment variables are set
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'NEXT_PUBLIC_REOWN_PROJECT_ID',
  'NEXT_PUBLIC_APP_URL',
]

const optionalEnvVars = [
  'TALENT_PROTOCOL_API_KEY',
  'SENTRY_DSN',
  'REDIS_URL',
]

const errors = []
const warnings = []

console.log('🔍 Validating environment variables...\n')

// Check required variables
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    errors.push(`❌ Missing required environment variable: ${varName}`)
  } else {
    console.log(`✅ ${varName}`)
  }
})

// Check optional variables
optionalEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    warnings.push(`⚠️  Optional environment variable not set: ${varName}`)
  } else {
    console.log(`✅ ${varName}`)
  }
})

// Validate specific formats
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
  errors.push('❌ DATABASE_URL must be a PostgreSQL connection string')
}

if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
  warnings.push('⚠️  SESSION_SECRET should be at least 32 characters long')
}

if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.startsWith('http')) {
  errors.push('❌ NEXT_PUBLIC_APP_URL must start with http:// or https://')
}

// Print results
console.log('\n' + '='.repeat(50))

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:')
  warnings.forEach(warning => console.log(warning))
}

if (errors.length > 0) {
  console.log('\n❌ Errors:')
  errors.forEach(error => console.log(error))
  console.log('\n💡 Tip: Copy .env.example to .env and fill in the values')
  process.exit(1)
} else {
  console.log('\n✅ All required environment variables are set!')
  console.log('✅ Environment validation passed!')
}

