/**
 * Analytics data export utilities
 */

export class AnalyticsExporter {
  static exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] || '')).join(',')
      ),
    ].join('\n')

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv')
  }

  static exportToJSON(data: any, filename: string): void {
    const jsonContent = JSON.stringify(data, null, 2)
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json')
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

