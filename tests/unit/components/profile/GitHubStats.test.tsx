import React from 'react'
import GitHubStats from '@/components/profile/GitHubStats'
import { render, screen } from '../../../utils/test-helpers'

describe('GitHubStats Component', () => {
  const mockStats = {
    totalCommits: 1250,
    totalPRs: 85,
    totalIssues: 42,
    totalRepos: 45,
    languages: [
      { language: 'TypeScript', percentage: 45, color: '#2b7489' },
      { language: 'JavaScript', percentage: 30, color: '#f1e05a' },
      { language: 'Python', percentage: 25, color: '#3572A5' },
    ],
  }

  it('should render total commits', () => {
    render(<GitHubStats stats={mockStats} />)
    expect(screen.getByText(/1,?250/)).toBeInTheDocument()
  })

  it('should render total PRs', () => {
    render(<GitHubStats stats={mockStats} />)
    expect(screen.getByText(/85/)).toBeInTheDocument()
  })

  it('should render total issues', () => {
    render(<GitHubStats stats={mockStats} />)
    expect(screen.getByText(/42/)).toBeInTheDocument()
  })

  it('should render total repositories', () => {
    render(<GitHubStats stats={mockStats} />)
    expect(screen.getByText(/45/)).toBeInTheDocument()
  })

  it('should render language statistics', () => {
    render(<GitHubStats stats={mockStats} />)
    
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('should display language percentages', () => {
    render(<GitHubStats stats={mockStats} />)
    
    expect(screen.getByText(/45%/)).toBeInTheDocument()
    expect(screen.getByText(/30%/)).toBeInTheDocument()
    expect(screen.getByText(/25%/)).toBeInTheDocument()
  })

  it('should handle empty stats gracefully', () => {
    const emptyStats = {
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalRepos: 0,
      languages: [],
    }
    
    render(<GitHubStats stats={emptyStats} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should render chart/visualization elements', () => {
    const { container } = render(<GitHubStats stats={mockStats} />)
    
    // Check for chart or progress bar elements
    const charts = container.querySelectorAll('[role="progressbar"], .chart, svg')
    expect(charts.length).toBeGreaterThan(0)
  })
})

