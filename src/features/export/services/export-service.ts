/**
 * Data Export Service - Export user data in various formats
 * FEATURE: Allow users to export their profile, analytics, and activity data
 */

export type ExportFormat = 'json' | 'csv' | 'pdf' | 'xml';

export interface ExportOptions {
  format: ExportFormat;
  includeProfile?: boolean;
  includeAnalytics?: boolean;
  includeActivity?: boolean;
  includeRepositories?: boolean;
  includeContributions?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filename?: string;
}

export interface ExportResult {
  success: boolean;
  filename: string;
  format: ExportFormat;
  size: number;
  downloadUrl?: string;
  error?: string;
}

export interface ExportJob {
  id: string;
  userId: string;
  options: ExportOptions;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  result?: ExportResult;
  error?: string;
}

export class ExportService {
  private jobs: Map<string, ExportJob> = new Map();
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Request data export
   */
  async requestExport(
    userId: string,
    options: ExportOptions
  ): Promise<ExportJob> {
    const jobId = this.generateJobId();

    const job: ExportJob = {
      id: jobId,
      userId,
      options,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
    };

    this.jobs.set(jobId, job);

    // Start export process asynchronously
    this.processExport(jobId).catch((error) => {
      job.status = 'failed';
      job.error = error.message;
    });

    return job;
  }

  /**
   * Process export job
   */
  private async processExport(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error('Job not found');

    try {
      job.status = 'processing';
      job.progress = 10;

      // Fetch data based on options
      const data = await this.fetchData(job);
      job.progress = 50;

      // Convert to requested format
      const result = await this.convertData(data, job.options);
      job.progress = 90;

      // Save result
      job.result = result;
      job.status = 'completed';
      job.progress = 100;
      job.completedAt = new Date();
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Export failed';
      throw error;
    }
  }

  /**
   * Fetch data based on export options
   */
  private async fetchData(job: ExportJob): Promise<any> {
    const data: any = {};

    if (job.options.includeProfile) {
      data.profile = await this.fetchProfile(job.userId);
    }

    if (job.options.includeAnalytics) {
      data.analytics = await this.fetchAnalytics(
        job.userId,
        job.options.dateRange
      );
    }

    if (job.options.includeActivity) {
      data.activity = await this.fetchActivity(
        job.userId,
        job.options.dateRange
      );
    }

    if (job.options.includeRepositories) {
      data.repositories = await this.fetchRepositories(job.userId);
    }

    if (job.options.includeContributions) {
      data.contributions = await this.fetchContributions(
        job.userId,
        job.options.dateRange
      );
    }

    return data;
  }

  /**
   * Fetch profile data
   */
  private async fetchProfile(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Fetch analytics data
   */
  private async fetchAnalytics(
    userId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<any> {
    try {
      let url = `${this.baseUrl}/analytics/${userId}`;

      if (dateRange) {
        const params = new URLSearchParams({
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString(),
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  /**
   * Fetch activity data
   */
  private async fetchActivity(
    userId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<any> {
    try {
      let url = `${this.baseUrl}/activity/${userId}`;

      if (dateRange) {
        const params = new URLSearchParams({
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString(),
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch activity');
      return await response.json();
    } catch (error) {
      console.error('Error fetching activity:', error);
      return null;
    }
  }

  /**
   * Fetch repositories
   */
  private async fetchRepositories(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/github/repos/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch repositories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return null;
    }
  }

  /**
   * Fetch contributions
   */
  private async fetchContributions(
    userId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<any> {
    try {
      let url = `${this.baseUrl}/github/contributions/${userId}`;

      if (dateRange) {
        const params = new URLSearchParams({
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString(),
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch contributions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching contributions:', error);
      return null;
    }
  }

  /**
   * Convert data to requested format
   */
  private async convertData(
    data: any,
    options: ExportOptions
  ): Promise<ExportResult> {
    const filename =
      options.filename ||
      `gitcaster-export-${Date.now()}.${options.format}`;

    switch (options.format) {
      case 'json':
        return this.exportAsJSON(data, filename);
      case 'csv':
        return this.exportAsCSV(data, filename);
      case 'pdf':
        return this.exportAsPDF(data, filename);
      case 'xml':
        return this.exportAsXML(data, filename);
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  /**
   * Export as JSON
   */
  private exportAsJSON(data: any, filename: string): ExportResult {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);

    return {
      success: true,
      filename,
      format: 'json',
      size: blob.size,
      downloadUrl,
    };
  }

  /**
   * Export as CSV
   */
  private exportAsCSV(data: any, filename: string): ExportResult {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const downloadUrl = URL.createObjectURL(blob);

    return {
      success: true,
      filename: filename.replace(/\.\w+$/, '.csv'),
      format: 'csv',
      size: blob.size,
      downloadUrl,
    };
  }

  /**
   * Export as PDF
   */
  private async exportAsPDF(data: any, filename: string): Promise<ExportResult> {
    // This is a placeholder - in production, use a PDF library like jsPDF
    const htmlContent = this.convertToHTML(data);
    const blob = new Blob([htmlContent], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blob);

    return {
      success: true,
      filename: filename.replace(/\.\w+$/, '.pdf'),
      format: 'pdf',
      size: blob.size,
      downloadUrl,
    };
  }

  /**
   * Export as XML
   */
  private exportAsXML(data: any, filename: string): ExportResult {
    const xmlString = this.convertToXML(data);
    const blob = new Blob([xmlString], { type: 'application/xml' });
    const downloadUrl = URL.createObjectURL(blob);

    return {
      success: true,
      filename: filename.replace(/\.\w+$/, '.xml'),
      format: 'xml',
      size: blob.size,
      downloadUrl,
    };
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any): string {
    const rows: string[] = [];

    // Helper to flatten nested objects
    const flattenObject = (obj: any, prefix = ''): any => {
      return Object.keys(obj).reduce((acc: any, key: string) => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(acc, flattenObject(value, newKey));
        } else {
          acc[newKey] = value;
        }

        return acc;
      }, {});
    };

    // Process each section
    for (const [section, sectionData] of Object.entries(data)) {
      if (!sectionData) continue;

      rows.push(`\n# ${section.toUpperCase()}\n`);

      if (Array.isArray(sectionData)) {
        if (sectionData.length > 0) {
          const flattened = sectionData.map((item) => flattenObject(item));
          const headers = Object.keys(flattened[0]);
          rows.push(headers.join(','));

          flattened.forEach((item) => {
            const values = headers.map((header) => {
              const value = item[header];
              return typeof value === 'string' && value.includes(',')
                ? `"${value}"`
                : value;
            });
            rows.push(values.join(','));
          });
        }
      } else {
        const flattened = flattenObject(sectionData);
        rows.push('Property,Value');
        for (const [key, value] of Object.entries(flattened)) {
          rows.push(`${key},"${value}"`);
        }
      }
    }

    return rows.join('\n');
  }

  /**
   * Convert data to HTML format
   */
  private convertToHTML(data: any): string {
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>GitCaster Data Export</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    h2 { color: #666; margin-top: 30px; }
    table { border-collapse: collapse; width: 100%; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>GitCaster Data Export</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
`;

    for (const [section, sectionData] of Object.entries(data)) {
      if (!sectionData) continue;

      html += `<h2>${section.toUpperCase()}</h2>`;

      if (Array.isArray(sectionData)) {
        html += '<table><thead><tr>';
        if (sectionData.length > 0) {
          const headers = Object.keys(sectionData[0]);
          headers.forEach((header) => {
            html += `<th>${header}</th>`;
          });
          html += '</tr></thead><tbody>';

          sectionData.forEach((item) => {
            html += '<tr>';
            headers.forEach((header) => {
              html += `<td>${item[header] || ''}</td>`;
            });
            html += '</tr>';
          });
        }
        html += '</tbody></table>';
      } else {
        html += '<table><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>';
        for (const [key, value] of Object.entries(sectionData)) {
          html += `<tr><td>${key}</td><td>${value}</td></tr>`;
        }
        html += '</tbody></table>';
      }
    }

    html += '</body></html>';
    return html;
  }

  /**
   * Convert data to XML format
   */
  private convertToXML(data: any, rootName = 'export'): string {
    const toXML = (obj: any, indent = 0): string => {
      const spaces = '  '.repeat(indent);
      let xml = '';

      for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) continue;

        if (Array.isArray(value)) {
          value.forEach((item) => {
            xml += `${spaces}<${key}>\n`;
            xml += toXML(item, indent + 1);
            xml += `${spaces}</${key}>\n`;
          });
        } else if (typeof value === 'object') {
          xml += `${spaces}<${key}>\n`;
          xml += toXML(value, indent + 1);
          xml += `${spaces}</${key}>\n`;
        } else {
          xml += `${spaces}<${key}>${value}</${key}>\n`;
        }
      }

      return xml;
    };

    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${toXML(data, 1)}</${rootName}>`;
  }

  /**
   * Get export job status
   */
  getJobStatus(jobId: string): ExportJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs for user
   */
  getUserJobs(userId: string): ExportJob[] {
    return Array.from(this.jobs.values()).filter(
      (job) => job.userId === userId
    );
  }

  /**
   * Cancel export job
   */
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'completed' || job.status === 'failed') {
      return false;
    }

    job.status = 'failed';
    job.error = 'Cancelled by user';
    return true;
  }

  /**
   * Delete export job
   */
  deleteJob(jobId: string): boolean {
    return this.jobs.delete(jobId);
  }

  /**
   * Download export result
   */
  downloadExport(jobId: string): void {
    const job = this.jobs.get(jobId);

    if (!job || job.status !== 'completed' || !job.result?.downloadUrl) {
      throw new Error('Export not ready for download');
    }

    const link = document.createElement('a');
    link.href = job.result.downloadUrl;
    link.download = job.result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(): string {
    return `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup old jobs
   */
  cleanup(maxAge: number = 86400000): void {
    // Default: 24 hours
    const now = Date.now();

    for (const [jobId, job] of this.jobs.entries()) {
      const age = now - job.createdAt.getTime();
      if (age > maxAge) {
        // Revoke blob URL if exists
        if (job.result?.downloadUrl) {
          URL.revokeObjectURL(job.result.downloadUrl);
        }
        this.jobs.delete(jobId);
      }
    }
  }
}

export default ExportService;

