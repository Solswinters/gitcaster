/**
 * Browser Storage Utility
 * 
 * Safe wrapper around localStorage and sessionStorage with JSON serialization
 */

class BrowserStorage {
  private isAvailable(storage: Storage): boolean {
    try {
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get value from storage
   */
  private get<T>(storage: Storage, key: string): T | null {
    if (!this.isAvailable(storage)) return null;

    try {
      const item = storage.getItem(key);
      
      if (item === null) return null;

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to get ${key} from storage:`, error);
      return null;
    }
  }

  /**
   * Set value in storage
   */
  private set<T>(storage: Storage, key: string, value: T): boolean {
    if (!this.isAvailable(storage)) return false;

    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to set ${key} in storage:`, error);
      return false;
    }
  }

  /**
   * Remove value from storage
   */
  private remove(storage: Storage, key: string): boolean {
    if (!this.isAvailable(storage)) return false;

    try {
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove ${key} from storage:`, error);
      return false;
    }
  }

  /**
   * Clear storage
   */
  private clear(storage: Storage): boolean {
    if (!this.isAvailable(storage)) return false;

    try {
      storage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  // LocalStorage methods
  getLocal<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    return this.get<T>(localStorage, key);
  }

  setLocal<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    return this.set<T>(localStorage, key, value);
  }

  removeLocal(key: string): boolean {
    if (typeof window === 'undefined') return false;
    return this.remove(localStorage, key);
  }

  clearLocal(): boolean {
    if (typeof window === 'undefined') return false;
    return this.clear(localStorage);
  }

  // SessionStorage methods
  getSession<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    return this.get<T>(sessionStorage, key);
  }

  setSession<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') return false;
    return this.set<T>(sessionStorage, key, value);
  }

  removeSession(key: string): boolean {
    if (typeof window === 'undefined') return false;
    return this.remove(sessionStorage, key);
  }

  clearSession(): boolean {
    if (typeof window === 'undefined') return false;
    return this.clear(sessionStorage);
  }

  /**
   * Get all keys from storage
   */
  getKeys(type: 'local' | 'session' = 'local'): string[] {
    if (typeof window === 'undefined') return [];
    
    const storage = type === 'local' ? localStorage : sessionStorage;
    
    if (!this.isAvailable(storage)) return [];

    return Object.keys(storage);
  }

  /**
   * Check if key exists in storage
   */
  has(key: string, type: 'local' | 'session' = 'local'): boolean {
    if (typeof window === 'undefined') return false;
    
    const storage = type === 'local' ? localStorage : sessionStorage;
    
    return storage.getItem(key) !== null;
  }
}

export const storage = new BrowserStorage();

// Convenience exports
export const localStorage = {
  get: <T>(key: string) => storage.getLocal<T>(key),
  set: <T>(key: string, value: T) => storage.setLocal<T>(key, value),
  remove: (key: string) => storage.removeLocal(key),
  clear: () => storage.clearLocal(),
  has: (key: string) => storage.has(key, 'local'),
};

export const sessionStorage = {
  get: <T>(key: string) => storage.getSession<T>(key),
  set: <T>(key: string, value: T) => storage.setSession<T>(key, value),
  remove: (key: string) => storage.removeSession(key),
  clear: () => storage.clearSession(),
  has: (key: string) => storage.has(key, 'session'),
};

