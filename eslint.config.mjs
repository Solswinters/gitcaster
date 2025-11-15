import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "coverage/**",
  ]),
  {
    rules: {
      // Code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // TypeScript specific
      '@typescript-strict/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      
      // Import organization
      'sort-imports': ['error', {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
      }],
      
      // React best practices
      'react/jsx-no-target-blank': 'error',
      'react/no-unescaped-entities': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    // Layer boundary enforcement
    files: ['src/domain/**/*.ts', 'src/domain/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['**/presentation/**', '**/application/**', '**/infrastructure/**'],
            message: 'Domain layer cannot depend on other layers',
          },
          {
            group: ['react', 'react-dom', 'next', 'next/*'],
            message: 'Domain layer must be framework-agnostic',
          },
        ],
      }],
    },
  },
  {
    // Application layer rules
    files: ['src/application/**/*.ts', 'src/application/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['**/presentation/**'],
            message: 'Application layer cannot depend on Presentation layer',
          },
        ],
      }],
    },
  },
  {
    // Presentation layer rules
    files: ['src/presentation/**/*.ts', 'src/presentation/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['**/infrastructure/**', '**/domain/**'],
            message: 'Presentation layer should only depend on Application layer',
          },
        ],
      }],
    },
  },
]);

export default eslintConfig;
