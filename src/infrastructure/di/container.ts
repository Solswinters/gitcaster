/**
 * Dependency Injection Container
 * 
 * Production-grade service container for managing dependencies with
 * proper lifecycle management and type safety.
 */

type Constructor<T = any> = new (...args: any[]) => T;
type Factory<T = any> = (...args: any[]) => T;
type ServiceDefinition<T = any> = Constructor<T> | Factory<T> | T;

interface ServiceMetadata {
  implementation: ServiceDefinition;
  lifecycle: 'transient' | 'singleton' | 'scoped';
  instance?: any;
  dependencies?: string[];
}

export class Container {
  private static instance: Container;
  private services = new Map<string, ServiceMetadata>();
  private scopes = new Map<string, Map<string, any>>();
  private currentScopeId: string | null = null;

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
   * Reset container instance (useful for testing)
   */
  static reset(): void {
    Container.instance = new Container();
  }

  /**
   * Register a transient service (new instance every time)
   */
  register<T>(
    key: string,
    implementation: ServiceDefinition<T>,
    dependencies: string[] = []
  ): this {
    this.services.set(key, {
      implementation,
      lifecycle: 'transient',
      dependencies,
    });
    return this;
  }

  /**
   * Register a singleton service (same instance always)
   */
  registerSingleton<T>(
    key: string,
    implementation: ServiceDefinition<T>,
    dependencies: string[] = []
  ): this {
    this.services.set(key, {
      implementation,
      lifecycle: 'singleton',
      dependencies,
    });
    return this;
  }

  /**
   * Register a scoped service (same instance within a scope)
   */
  registerScoped<T>(
    key: string,
    implementation: ServiceDefinition<T>,
    dependencies: string[] = []
  ): this {
    this.services.set(key, {
      implementation,
      lifecycle: 'scoped',
      dependencies,
    });
    return this;
  }

  /**
   * Register a value directly
   */
  registerValue<T>(key: string, value: T): this {
    this.services.set(key, {
      implementation: value,
      lifecycle: 'singleton',
      instance: value,
    });
    return this;
  }

  /**
   * Resolve a service by key
   */
  resolve<T>(key: string): T {
    const metadata = this.services.get(key);
    
    if (!metadata) {
      throw new Error(`Service not found: ${key}`);
    }

    // Return singleton instance if already created
    if (metadata.lifecycle === 'singleton' && metadata.instance) {
      return metadata.instance;
    }

    // Return scoped instance if in scope and already created
    if (metadata.lifecycle === 'scoped' && this.currentScopeId) {
      const scopeInstances = this.scopes.get(this.currentScopeId);
      if (scopeInstances?.has(key)) {
        return scopeInstances.get(key);
      }
    }

    // Create instance
    const instance = this.createInstance(metadata);

    // Store singleton instance
    if (metadata.lifecycle === 'singleton') {
      metadata.instance = instance;
    }

    // Store scoped instance
    if (metadata.lifecycle === 'scoped' && this.currentScopeId) {
      let scopeInstances = this.scopes.get(this.currentScopeId);
      if (!scopeInstances) {
        scopeInstances = new Map();
        this.scopes.set(this.currentScopeId, scopeInstances);
      }
      scopeInstances.set(key, instance);
    }

    return instance;
  }

  /**
   * Create instance from metadata
   */
  private createInstance<T>(metadata: ServiceMetadata): T {
    const { implementation, dependencies = [] } = metadata;

    // If it's already an instance, return it
    if (
      typeof implementation !== 'function' ||
      (implementation as any).prototype === undefined
    ) {
      return implementation as T;
    }

    // Resolve dependencies
    const resolvedDeps = dependencies.map(dep => this.resolve(dep));

    // Check if it's a constructor or factory
    try {
      return new (implementation as Constructor<T>)(...resolvedDeps);
    } catch {
      return (implementation as Factory<T>)(...resolvedDeps);
    }
  }

  /**
   * Check if a service is registered
   */
  has(key: string): boolean {
    return this.services.has(key);
  }

  /**
   * Create a new scope
   */
  createScope(scopeId: string = `scope-${Date.now()}`): string {
    this.currentScopeId = scopeId;
    this.scopes.set(scopeId, new Map());
    return scopeId;
  }

  /**
   * End a scope and clean up scoped instances
   */
  endScope(scopeId: string): void {
    this.scopes.delete(scopeId);
    if (this.currentScopeId === scopeId) {
      this.currentScopeId = null;
    }
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
    this.scopes.clear();
    this.currentScopeId = null;
  }

  /**
   * Get all registered service keys
   */
  getRegisteredKeys(): string[] {
    return Array.from(this.services.keys());
  }
}

/**
 * Global container instance
 */
export const container = Container.getInstance();

