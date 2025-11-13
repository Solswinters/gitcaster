/**
 * NPM Registry API client
 */

export class NPMClient {
  private baseURL: string = 'https://registry.npmjs.org'

  /**
   * Get package information
   */
  async getPackage(packageName: string) {
    const response = await fetch(`${this.baseURL}/${packageName}`)
    if (!response.ok) throw new Error('Package not found')
    return await response.json()
  }

  /**
   * Get user packages
   */
  async getUserPackages(username: string) {
    const response = await fetch(`${this.baseURL}/-/v1/search?text=maintainer:${username}`)
    if (!response.ok) throw new Error('Failed to fetch packages')
    const data = await response.json()
    return data.objects.map((obj: any) => obj.package)
  }

  /**
   * Get package stats
   */
  async getPackageStats(packageName: string) {
    const response = await fetch(`https://api.npmjs.org/downloads/point/last-month/${packageName}`)
    if (!response.ok) throw new Error('Failed to fetch stats')
    return await response.json()
  }

  /**
   * Get total downloads for user packages
   */
  async getUserTotalDownloads(username: string): Promise<number> {
    const packages = await this.getUserPackages(username)
    let totalDownloads = 0

    for (const pkg of packages) {
      try {
        const stats = await this.getPackageStats(pkg.name)
        totalDownloads += stats.downloads
      } catch (error) {
        console.error(`Failed to get stats for ${pkg.name}:`, error)
      }
    }

    return totalDownloads
  }
}

