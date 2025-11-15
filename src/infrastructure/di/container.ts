/**
 * Dependency Injection Container
 * 
 * Simple service container for managing dependencies.
 */

type Constructor<T = any> = new (...args: any[]) => T;
type Factory<T = any> = () => T;

export class Container {
  private static instance: Container;
  private services = new Map<string, any>();
  private singletons = new Map<string, any>();

  private constructor() {}

  /**
   * Get the container instance
   */
  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * Register a service with a key
   */
  register<T>(key: string, implementation: Constructor<T> | Factory<T>): void {
    this.services.set(key, implementation);
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(key: string, implementation: Constructor<T> | Factory<T>): void {
    this.services.set(key, implementation);
    this.singletons.set(key, null); // Mark as singleton
  }

  /**
   * Resolve a service by key
   */
  resolve<T>(key: string): T {
    const service = this.services.get(key);
    
    if (!service) {
      throw new Error(`Service not found: ${key}`);
    }

    // Check if it's a singleton
    if (this.singletons.has(key)) {
      let instance = this.singletons.get(key);
      
      if (!instance) {
        instance = typeof service === 'function' ? new service() : service();
        this.singletons.set(key, instance);
      }
      
      return instance;
    }

    // Create new instance
    return typeof service === 'function' ? new service() : service();
  }

  /**
   * Check if a service is registered
   */
  has(key: string): boolean {
    return this.services.has(key);
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }
}

/**
 * Global container instance
 */
export const container = Container.getInstance();

