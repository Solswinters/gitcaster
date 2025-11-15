module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type enforcement
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting, missing semicolons, etc.
        'refactor', // Code restructuring
        'perf',     // Performance improvements
        'test',     // Adding tests
        'chore',    // Maintenance tasks
        'ci',       // CI/CD changes
        'build',    // Build system changes
        'revert',   // Revert previous commit
      ],
    ],
    
    // Subject rules
    'subject-case': [0], // Allow any case
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 100],
    'subject-min-length': [2, 'always', 10],
    
    // Body rules
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 200],
    
    // Footer rules
    'footer-leading-blank': [2, 'always'],
    
    // Header rules
    'header-max-length': [2, 'always', 120],
    
    // Scope rules (optional but encouraged)
    'scope-case': [2, 'always', 'kebab-case'],
    'scope-enum': [
      1,
      'always',
      [
        'auth',
        'profile',
        'github',
        'analytics',
        'search',
        'collaboration',
        'notifications',
        'ui',
        'api',
        'db',
        'config',
        'deps',
        'domain',
        'application',
        'infrastructure',
        'presentation',
        'shared',
      ],
    ],
    
    // Type rules
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },
};
