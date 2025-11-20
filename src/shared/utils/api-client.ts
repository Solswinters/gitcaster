/**
 * API Client - Comprehensive HTTP client with interceptors, retry logic, and caching
 */

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string | number | boolean>
  timeout?: number
  retry?: RetryConfig
  cache?: CacheConfig
  signal?: AbortSignal
}

export interface RetryConfig {
  maxRetries: number
  retryDelay: number
  retryOn?: number[] // HTTP status codes to retry
  shouldRetry?: (error: any) => boolean
}

export interface CacheConfig {
  ttl: number // Time to live in milliseconds
  key?: string
  force?: boolean // Force refresh cache
}

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
}

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
type ResponseInterceptor = (response: ApiResponse) => ApiResponse | Promise<ApiResponse>
type ErrorInterceptor = (error: ApiError) => Promise<never>

export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []
  private cache: Map<string, { data: any; expiry: number }> = new Map()

  constructor(baseURL: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    }
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor)
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor)
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor)
  }

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' })
  }

  /**
   * Make a POST request
   */
  async post<T = any>(url: string, body?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', body })
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, body?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', body })
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(url: string, body?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PATCH', body })
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' })
  }

  /**
   * Make a request
   */
  private async request<T = any>(url: string, config: RequestConfig): Promise<ApiResponse<T>> {
    // Check cache first
    if (config.method === 'GET' && config.cache && !config.cache.force) {
      const cached = this.getFromCache(url, config)
      if (cached) {
        return cached as ApiResponse<T>
      }
    }

    // Apply request interceptors
    let finalConfig = { ...config }
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig)
    }

    try {
      const response = await this.executeRequest<T>(url, finalConfig)

      // Apply response interceptors
      let finalResponse = response
      for (const interceptor of this.responseInterceptors) {
        finalResponse = await interceptor(finalResponse)
      }

      // Cache response if configured
      if (config.method === 'GET' && config.cache) {
        this.saveToCache(url, config, finalResponse)
      }

      return finalResponse
    } catch (error: any) {
      // Apply error interceptors
      for (const interceptor of this.errorInterceptors) {
        await interceptor(error)
      }
      throw error
    }
  }

  /**
   * Execute the actual HTTP request
   */
  private async executeRequest<T = any>(
    url: string,
    config: RequestConfig,
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    const fullUrl = this.buildUrl(url, config.params)
    const headers = { ...this.defaultHeaders, ...config.headers }

    const fetchOptions: RequestInit = {
      method: config.method || 'GET',
      headers,
      signal: config.signal,
    }

    if (config.body && ['POST', 'PUT', 'PATCH'].includes(config.method || '')) {
      fetchOptions.body = JSON.stringify(config.body)
    }

    try {
      const controller = new AbortController()
      let timeoutId: NodeJS.Timeout | undefined

      if (config.timeout) {
        timeoutId = setTimeout(() => controller.abort(), config.timeout)
        fetchOptions.signal = controller.signal
      }

      const response = await fetch(fullUrl, fetchOptions)

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // Check if we should retry
      if (!response.ok && config.retry) {
        const shouldRetry = this.shouldRetry(response.status, retryCount, config.retry)
        if (shouldRetry) {
          await this.delay(config.retry.retryDelay)
          return this.executeRequest<T>(url, config, retryCount + 1)
        }
      }

      if (!response.ok) {
        throw await this.createError(response)
      }

      const data = await this.parseResponse<T>(response)
      const responseHeaders = this.extractHeaders(response)

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          code: 'TIMEOUT',
        } as ApiError
      }

      // Retry on network errors
      if (config.retry && retryCount < config.retry.maxRetries) {
        if (config.retry.shouldRetry && config.retry.shouldRetry(error)) {
          await this.delay(config.retry.retryDelay)
          return this.executeRequest<T>(url, config, retryCount + 1)
        }
      }

      throw error
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`

    if (!params) {
      return fullUrl
    }

    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    return queryString ? `${fullUrl}?${queryString}` : fullUrl
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      return response.json()
    }

    if (contentType?.includes('text')) {
      return response.text() as Promise<T>
    }

    if (contentType?.includes('blob')) {
      return response.blob() as Promise<T>
    }

    return response.text() as Promise<T>
  }

  /**
   * Extract headers from response
   */
  private extractHeaders(response: Response): Record<string, string> {
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })
    return headers
  }

  /**
   * Create error from response
   */
  private async createError(response: Response): Promise<ApiError> {
    let details: any

    try {
      details = await response.json()
    } catch {
      details = await response.text()
    }

    return {
      message: details?.message || response.statusText || 'Request failed',
      status: response.status,
      code: details?.code,
      details,
    }
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(status: number, retryCount: number, retry: RetryConfig): boolean {
    if (retryCount >= retry.maxRetries) {
      return false
    }

    if (retry.retryOn && !retry.retryOn.includes(status)) {
      return false
    }

    // By default, retry on 5xx errors and 429 (Too Many Requests)
    if (!retry.retryOn) {
      return status >= 500 || status === 429
    }

    return true
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Generate cache key
   */
  private getCacheKey(url: string, config: RequestConfig): string {
    if (config.cache?.key) {
      return config.cache.key
    }

    const fullUrl = this.buildUrl(url, config.params)
    return fullUrl
  }

  /**
   * Get from cache
   */
  private getFromCache(url: string, config: RequestConfig): ApiResponse | null {
    const key = this.getCacheKey(url, config)
    const cached = this.cache.get(key)

    if (cached && cached.expiry > Date.now()) {
      return cached.data
    }

    if (cached) {
      this.cache.delete(key)
    }

    return null
  }

  /**
   * Save to cache
   */
  private saveToCache(url: string, config: RequestConfig, response: ApiResponse): void {
    if (!config.cache) return

    const key = this.getCacheKey(url, config)
    const expiry = Date.now() + config.cache.ttl

    this.cache.set(key, {
      data: response,
      expiry,
    })
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Clear cache by pattern
   */
  clearCacheByPattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Set base URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL
  }

  /**
   * Set default header
   */
  setHeader(name: string, value: string): void {
    this.defaultHeaders[name] = value
  }

  /**
   * Remove default header
   */
  removeHeader(name: string): void {
    delete this.defaultHeaders[name]
  }

  /**
   * Get default headers
   */
  getHeaders(): Record<string, string> {
    return { ...this.defaultHeaders }
  }
}

/**
 * Create a configured API client instance
 */
export const createApiClient = (
  baseURL: string,
  config?: {
    headers?: Record<string, string>
    timeout?: number
    retry?: RetryConfig
  }
): ApiClient => {
  const client = new ApiClient(baseURL, config?.headers)

  // Add default request interceptor for timeout
  if (config?.timeout) {
    client.addRequestInterceptor((requestConfig) => ({
      ...requestConfig,
      timeout: requestConfig.timeout || config.timeout,
    }))
  }

  // Add default request interceptor for retry
  if (config?.retry) {
    client.addRequestInterceptor((requestConfig) => ({
      ...requestConfig,
      retry: requestConfig.retry || config.retry,
    }))
  }

  return client
}

export default ApiClient

