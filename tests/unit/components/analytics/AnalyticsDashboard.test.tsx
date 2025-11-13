import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

const mockAnalytics = {
  views: 1250,
  uniqueVisitors: 890,
  averageTime: 145,
  topReferrers: [
    { source: 'google.com', visits: 450 },
    { source: 'github.com', visits: 320 },
  ],
};

describe('AnalyticsDashboard', () => {
  it('should render analytics data', () => {
    render(<AnalyticsDashboard data={mockAnalytics} />);

    expect(screen.getByText(/1250|1,250/)).toBeInTheDocument();
    expect(screen.getByText(/890/)).toBeInTheDocument();
  });

  it('should display top referrers', () => {
    render(<AnalyticsDashboard data={mockAnalytics} />);

    expect(screen.getByText('google.com')).toBeInTheDocument();
    expect(screen.getByText('github.com')).toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    render(<AnalyticsDashboard data={null} />);

    expect(screen.getByText(/no data|no analytics/i)).toBeInTheDocument();
  });
});

