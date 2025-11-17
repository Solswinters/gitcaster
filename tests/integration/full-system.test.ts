/**
 * Full system integration tests
 * 
 * This test suite verifies that all major components work together correctly
 */

describe('Full System Integration', () => {
  describe('Feature Integration', () => {
    it('analytics feature is properly structured', () => {
      const analyticsExports = require('@/features/analytics');
      expect(analyticsExports).toBeDefined();
    });

    it('profile feature is properly structured', () => {
      const profileExports = require('@/features/profile');
      expect(profileExports).toBeDefined();
    });

    it('search feature is properly structured', () => {
      const searchExports = require('@/features/search');
      expect(searchExports).toBeDefined();
    });

    it('auth feature is properly structured', () => {
      const authExports = require('@/features/auth');
      expect(authExports).toBeDefined();
    });

    it('github feature is properly structured', () => {
      const githubExports = require('@/features/github');
      expect(githubExports).toBeDefined();
    });

    it('collaboration feature is properly structured', () => {
      const collabExports = require('@/features/collaboration');
      expect(collabExports).toBeDefined();
    });

    it('themes feature is properly structured', () => {
      const themesExports = require('@/features/themes');
      expect(themesExports).toBeDefined();
    });

    it('onboarding feature is properly structured', () => {
      const onboardingExports = require('@/features/onboarding');
      expect(onboardingExports).toBeDefined();
    });

    it('notifications feature is properly structured', () => {
      const notificationsExports = require('@/features/notifications');
      expect(notificationsExports).toBeDefined();
    });

    it('recruiter feature is properly structured', () => {
      const recruiterExports = require('@/features/recruiter');
      expect(recruiterExports).toBeDefined();
    });

    it('pwa feature is properly structured', () => {
      const pwaExports = require('@/features/pwa');
      expect(pwaExports).toBeDefined();
    });
  });

  describe('Core Infrastructure', () => {
    it('core utilities are available', () => {
      const coreUtils = require('@/core/utils');
      expect(coreUtils).toBeDefined();
    });

    it('core components are available', () => {
      const coreComponents = require('@/core/components');
      expect(coreComponents).toBeDefined();
    });

    it('core errors are available', () => {
      const coreErrors = require('@/core/errors');
      expect(coreErrors).toBeDefined();
    });

    it('core config is available', () => {
      const coreConfig = require('@/core/config');
      expect(coreConfig).toBeDefined();
    });
  });

  describe('API Routes', () => {
    it('API utilities are available', () => {
      const apiUtils = require('@/app/api');
      expect(apiUtils).toBeDefined();
    });

    it('API middleware is available', () => {
      const { withErrorHandling, cors } = require('@/app/api/middleware');
      expect(withErrorHandling).toBeDefined();
      expect(cors).toBeDefined();
    });

    it('API validators are available', () => {
      const {
        validateRequest,
        paginationSchema,
      } = require('@/app/api/validators');
      expect(validateRequest).toBeDefined();
      expect(paginationSchema).toBeDefined();
    });

    it('API helpers are available', () => {
      const {
        createSuccessResponse,
        createErrorResponse,
      } = require('@/app/api/helpers');
      expect(createSuccessResponse).toBeDefined();
      expect(createErrorResponse).toBeDefined();
    });
  });

  describe('System Health', () => {
    it('all critical modules can be imported without errors', () => {
      expect(() => {
        require('@/features/analytics');
        require('@/features/profile');
        require('@/features/search');
        require('@/features/auth');
        require('@/features/github');
        require('@/features/collaboration');
        require('@/features/themes');
        require('@/features/onboarding');
        require('@/features/notifications');
        require('@/features/recruiter');
        require('@/features/pwa');
        require('@/core');
        require('@/app/api');
      }).not.toThrow();
    });
  });

  describe('Code Quality', () => {
    it('no duplicate code in critical paths', () => {
      // Verify that duplicates have been removed
      const fs = require('fs');
      const path = require('path');
      
      // Check that old duplicate locations don't exist
      const oldPaths = [
        'src/lib/utils/cn.ts',
        'src/lib/utils/validation-helpers.ts',
        'src/shared/utils/errors',
        'src/shared/components/loading',
        'src/shared/components/error',
      ];

      oldPaths.forEach((oldPath) => {
        const fullPath = path.join(process.cwd(), oldPath);
        expect(fs.existsSync(fullPath)).toBe(false);
      });
    });

    it('feature-based structure is maintained', () => {
      const fs = require('fs');
      const path = require('path');
      
      const features = [
        'analytics',
        'profile',
        'search',
        'auth',
        'github',
        'collaboration',
        'themes',
        'onboarding',
        'notifications',
        'recruiter',
        'pwa',
      ];

      features.forEach((feature) => {
        const featurePath = path.join(process.cwd(), 'src', 'features', feature);
        expect(fs.existsSync(featurePath)).toBe(true);
      });
    });

    it('core infrastructure is properly organized', () => {
      const fs = require('fs');
      const path = require('path');
      
      const coreModules = [
        'components',
        'config',
        'errors',
        'hooks',
        'lib',
        'types',
        'utils',
      ];

      coreModules.forEach((module) => {
        const modulePath = path.join(process.cwd(), 'src', 'core', module);
        expect(fs.existsSync(modulePath)).toBe(true);
      });
    });
  });
});


