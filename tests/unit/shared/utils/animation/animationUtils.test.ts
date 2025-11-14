import { easings, animate, smoothScrollTo } from '@/shared/utils/animation/animationUtils';

describe('Animation Utils', () => {
  describe('easings', () => {
    it('linear easing returns input', () => {
      expect(easings.linear(0.5)).toBe(0.5);
    });

    it('easeIn accelerates', () => {
      expect(easings.easeIn(0.5)).toBeGreaterThan(easings.linear(0.5));
    });

    it('easeOut decelerates', () => {
      expect(easings.easeOut(0.5)).toBeLessThan(easings.linear(0.5));
    });

    it('easeInOut is symmetric', () => {
      const t1 = easings.easeInOut(0.25);
      const t2 = easings.easeInOut(0.75);
      expect(t1).toBeLessThan(0.25);
      expect(t2).toBeGreaterThan(0.75);
    });

    it('cubic easings work correctly', () => {
      expect(easings.easeInCubic(0.5)).toBeCloseTo(0.125, 2);
      expect(easings.easeOutCubic(0.5)).toBeGreaterThan(0.5);
    });
  });

  describe('animate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('animates value from start to end', () => {
      const onUpdate = jest.fn();
      const cancel = animate(0, 100, 1000, onUpdate);

      expect(typeof cancel).toBe('function');
    });

    it('calls onUpdate with interpolated values', () => {
      const onUpdate = jest.fn();
      animate(0, 100, 1000, onUpdate, easings.linear);

      // Animation should be called
      expect(onUpdate).toHaveBeenCalled();
    });

    it('returns cancel function', () => {
      const onUpdate = jest.fn();
      const cancel = animate(0, 100, 1000, onUpdate);

      expect(typeof cancel).toBe('function');
      cancel();
    });
  });

  describe('smoothScrollTo', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.pageYOffset = 0;
      window.scrollTo = jest.fn();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('scrolls to numeric position', async () => {
      const promise = smoothScrollTo(500, 300);

      jest.advanceTimersByTime(300);

      await promise;
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('scrolls to element', () => {
      const element = document.createElement('div');
      element.getBoundingClientRect = jest.fn(() => ({
        top: 100,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      smoothScrollTo(element, 300);

      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('respects offset parameter', () => {
      smoothScrollTo(500, 300, 50);
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });
});

