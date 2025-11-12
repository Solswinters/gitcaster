// Central loading state manager for coordinated loading indicators

type LoadingCallback = (isLoading: boolean) => void;

class LoadingManager {
  private loadingStates = new Map<string, boolean>();
  private callbacks = new Set<LoadingCallback>();

  /**
   * Register a loading state with a unique key
   */
  setLoading(key: string, isLoading: boolean): void {
    this.loadingStates.set(key, isLoading);
    this.notifyCallbacks();
  }

  /**
   * Check if any loading states are active
   */
  isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(Boolean);
  }

  /**
   * Get specific loading state
   */
  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  /**
   * Clear all loading states
   */
  clearAll(): void {
    this.loadingStates.clear();
    this.notifyCallbacks();
  }

  /**
   * Subscribe to loading state changes
   */
  subscribe(callback: LoadingCallback): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private notifyCallbacks(): void {
    const isLoading = this.isAnyLoading();
    this.callbacks.forEach(cb => cb(isLoading));
  }
}

export const loadingManager = new LoadingManager();

