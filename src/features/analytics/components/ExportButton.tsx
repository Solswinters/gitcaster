'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, FileJson, FileSpreadsheet } from 'lucide-react'
import { AnalyticsExporter } from '@/lib/analytics/export-utils'

export function ExportButton({ data, filename }: { data: any; filename: string }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(true)
    try {
      if (format === 'json') {
        AnalyticsExporter.exportToJSON(data, filename)
      } else if (format === 'csv' && Array.isArray(data)) {
        AnalyticsExporter.exportToCSV(data, filename)
      }
    } finally {
      setTimeout(() => setIsExporting(false), 1000)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

