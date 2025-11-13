import {
  isBrowser,
  querySelector,
  querySelectorAll,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  isInViewport,
  isVisible,
  getDimensions,
} from '@/shared/utils/dom/domUtils';

describe('DOM Utils', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('isBrowser', () => {
    it('returns true in test environment', () => {
      expect(isBrowser()).toBe(true);
    });
  });

  describe('querySelector', () => {
    it('finds element by selector', () => {
      document.body.innerHTML = '<div class="test">Content</div>';

      const element = querySelector('.test');

      expect(element).toBeTruthy();
      expect(element?.textContent).toBe('Content');
    });

    it('returns null for missing element', () => {
      const element = querySelector('.missing');

      expect(element).toBeNull();
    });
  });

  describe('querySelectorAll', () => {
    it('finds all matching elements', () => {
      document.body.innerHTML = `
        <div class="test">1</div>
        <div class="test">2</div>
      `;

      const elements = querySelectorAll('.test');

      expect(elements).toHaveLength(2);
    });

    it('returns empty array for no matches', () => {
      const elements = querySelectorAll('.missing');

      expect(elements).toHaveLength(0);
    });
  });

  describe('addClass', () => {
    it('adds class to element', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      addClass(div, 'test-class');

      expect(div.classList.contains('test-class')).toBe(true);
    });

    it('handles null element', () => {
      expect(() => addClass(null, 'test')).not.toThrow();
    });
  });

  describe('removeClass', () => {
    it('removes class from element', () => {
      const div = document.createElement('div');
      div.classList.add('test-class');
      document.body.appendChild(div);

      removeClass(div, 'test-class');

      expect(div.classList.contains('test-class')).toBe(false);
    });
  });

  describe('toggleClass', () => {
    it('toggles class on element', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      toggleClass(div, 'test-class');
      expect(div.classList.contains('test-class')).toBe(true);

      toggleClass(div, 'test-class');
      expect(div.classList.contains('test-class')).toBe(false);
    });
  });

  describe('hasClass', () => {
    it('checks if element has class', () => {
      const div = document.createElement('div');
      div.classList.add('test-class');
      document.body.appendChild(div);

      expect(hasClass(div, 'test-class')).toBe(true);
      expect(hasClass(div, 'other-class')).toBe(false);
    });

    it('returns false for null element', () => {
      expect(hasClass(null, 'test')).toBe(false);
    });
  });

  describe('isVisible', () => {
    it('checks if element is visible', () => {
      const div = document.createElement('div');
      div.style.width = '100px';
      div.style.height = '100px';
      document.body.appendChild(div);

      expect(isVisible(div)).toBe(true);
    });

    it('returns false for hidden element', () => {
      const div = document.createElement('div');
      div.style.display = 'none';
      document.body.appendChild(div);

      expect(isVisible(div)).toBe(false);
    });
  });

  describe('getDimensions', () => {
    it('returns element dimensions', () => {
      const div = document.createElement('div');
      Object.defineProperty(div, 'offsetWidth', { value: 100 });
      Object.defineProperty(div, 'offsetHeight', { value: 50 });
      document.body.appendChild(div);

      const dimensions = getDimensions(div);

      expect(dimensions.width).toBe(100);
      expect(dimensions.height).toBe(50);
    });
  });
});

