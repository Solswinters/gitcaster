#!/usr/bin/env node
/**
 * File Size Checker
 * 
 * Enforces file size limits to maintain code maintainability.
 */

const fs = require('fs');
const path = require('path');

const LIMITS = {
  RECOMMENDED: 400,
  MAX: 500,
  ABSOLUTE_MAX: 800,
};

const EXCLUDED_PATTERNS = [
  /node_modules/,
  /\.next/,
  /build/,
  /dist/,
  /coverage/,
  /\.git/,
  /package-lock\.json/,
  /yarn\.lock/,
  /pnpm-lock\.yaml/,
];

const FILE_PATTERNS = [
  /\.tsx?$/,
  /\.jsx?$/,
];

function shouldCheckFile(filePath) {
  if (EXCLUDED_PATTERNS.some(pattern => pattern.test(filePath))) {
    return false;
  }
  
  return FILE_PATTERNS.some(pattern => pattern.test(filePath));
}

function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').length;
}

function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDED_PATTERNS.some(pattern => pattern.test(filePath))) {
        scanDirectory(filePath, results);
      }
    } else if (shouldCheckFile(filePath)) {
      const lineCount = countLines(filePath);
      results.push({ path: filePath, lines: lineCount });
    }
  }
  
  return results;
}

function formatPath(fullPath) {
  return path.relative(process.cwd(), fullPath);
}

function main() {
  console.log('🔍 Checking file sizes...\n');
  
  const results = scanDirectory('./src');
  
  const warnings = [];
  const errors = [];
  const critical = [];
  
  results.forEach(({ path: filePath, lines }) => {
    const formattedPath = formatPath(filePath);
    
    if (lines > LIMITS.ABSOLUTE_MAX) {
      critical.push({ path: formattedPath, lines });
    } else if (lines > LIMITS.MAX) {
      errors.push({ path: formattedPath, lines });
    } else if (lines > LIMITS.RECOMMENDED) {
      warnings.push({ path: formattedPath, lines });
    }
  });
  
  if (warnings.length > 0) {
    console.log('⚠️  Files exceeding recommended size (400 lines):\n');
    warnings.forEach(({ path, lines }) => {
      console.log(`   ${path}: ${lines} lines`);
    });
    console.log('');
  }
  
  if (errors.length > 0) {
    console.log('❌ Files exceeding maximum size (500 lines):\n');
    errors.forEach(({ path, lines }) => {
      console.log(`   ${path}: ${lines} lines`);
    });
    console.log('');
  }
  
  if (critical.length > 0) {
    console.log('🚨 CRITICAL: Files exceeding absolute maximum (800 lines):\n');
    critical.forEach(({ path, lines }) => {
      console.log(`   ${path}: ${lines} lines`);
    });
    console.log('');
  }
  
  const totalIssues = warnings.length + errors.length + critical.length;
  
  if (totalIssues === 0) {
    console.log('✅ All files are within size limits!\n');
    process.exit(0);
  } else {
    console.log(`\n📊 Summary:`);
    console.log(`   Total files checked: ${results.length}`);
    console.log(`   Warnings: ${warnings.length}`);
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Critical: ${critical.length}`);
    console.log('');
    console.log('💡 Consider refactoring large files by:');
    console.log('   - Extracting reusable components');
    console.log('   - Moving utility functions to separate files');
    console.log('   - Splitting complex logic into smaller modules');
    console.log('');
    
    // Exit with error only if critical issues exist
    process.exit(critical.length > 0 ? 1 : 0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { countLines, shouldCheckFile };

