import {
  copyToClipboard,
  readFromClipboard,
  isClipboardAvailable,
  copyJsonToClipboard,
  copyCodeToClipboard,
} from '@/shared/utils/clipboard/clipboardUtils';

describe('Clipboard Utils', () => {
  describe('copyToClipboard', () => {
    it('copies text using modern API', async () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText },
      });
      Object.defineProperty(window, 'isSecureContext', { value: true, writable: true });

      const result = await copyToClipboard('test text');

      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith('test text');
    });

    it('falls back to execCommand when modern API unavailable', async () => {
      Object.assign(navigator, { clipboard: undefined });
      document.execCommand = jest.fn().mockReturnValue(true);

      const result = await copyToClipboard('test text');

      expect(result).toBe(true);
    });

    it('returns false on error', async () => {
      const writeText = jest.fn().mockRejectedValue(new Error('Failed'));
      Object.assign(navigator, {
        clipboard: { writeText },
      });
      Object.defineProperty(window, 'isSecureContext', { value: true, writable: true });

      const result = await copyToClipboard('test text');

      expect(result).toBe(false);
    });
  });

  describe('readFromClipboard', () => {
    it('reads text using modern API', async () => {
      const readText = jest.fn().mockResolvedValue('clipboard text');
      Object.assign(navigator, {
        clipboard: { readText },
      });
      Object.defineProperty(window, 'isSecureContext', { value: true, writable: true });

      const result = await readFromClipboard();

      expect(result).toBe('clipboard text');
      expect(readText).toHaveBeenCalled();
    });

    it('returns null when API unavailable', async () => {
      Object.assign(navigator, { clipboard: undefined });

      const result = await readFromClipboard();

      expect(result).toBeNull();
    });

    it('returns null on error', async () => {
      const readText = jest.fn().mockRejectedValue(new Error('Failed'));
      Object.assign(navigator, {
        clipboard: { readText },
      });
      Object.defineProperty(window, 'isSecureContext', { value: true, writable: true });

      const result = await readFromClipboard();

      expect(result).toBeNull();
    });
  });

  describe('isClipboardAvailable', () => {
    it('returns true when clipboard API available', () => {
      Object.assign(navigator, {
        clipboard: { writeText: jest.fn() },
      });

      expect(isClipboardAvailable()).toBe(true);
    });

    it('returns false when clipboard API unavailable', () => {
      Object.assign(navigator, { clipboard: undefined });

      expect(isClipboardAvailable()).toBe(false);
    });
  });

  describe('copyJsonToClipboard', () => {
    it('copies object as formatted JSON', async () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText },
      });
      Object.defineProperty(window, 'isSecureContext', { value: true, writable: true });

      const obj = { name: 'test', value: 123 };
      const result = await copyJsonToClipboard(obj);

      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith(JSON.stringify(obj, null, 2));
    });

    it('returns false on invalid JSON', async () => {
      const circular: any = {};
      circular.self = circular;

      const result = await copyJsonToClipboard(circular);

      expect(result).toBe(false);
    });
  });

  describe('copyCodeToClipboard', () => {
    it('copies code with language formatting', async () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText },
      });
      Object.defineProperty(window, 'isSecureContext', { value: true, writable: true });

      const code = 'console.log("hello");';
      const result = await copyCodeToClipboard(code, 'javascript');

      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith('```javascript\n' + code + '\n```');
    });

    it('copies code without formatting when no language', async () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText },
      });
      Object.defineProperty(window, 'isSecureContext', { value: true, writable: true });

      const code = 'console.log("hello");';
      const result = await copyCodeToClipboard(code);

      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith(code);
    });
  });
});

