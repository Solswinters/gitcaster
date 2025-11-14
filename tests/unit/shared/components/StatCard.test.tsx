import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/shared/components/data-display/StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Users" value="1,234" />);

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders positive change indicator', () => {
    render(<StatCard label="Revenue" value="$10,000" change={15.5} />);

    expect(screen.getByText('↑ 15.5%')).toBeInTheDocument();
  });

  it('renders negative change indicator', () => {
    render(<StatCard label="Errors" value="42" change={-10.2} />);

    expect(screen.getByText('↓ 10.2%')).toBeInTheDocument();
  });

  it('renders change label', () => {
    render(
      <StatCard label="Sales" value="500" change={8.5} changeLabel="vs last month" />
    );

    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const icon = <svg data-testid="test-icon" />;
    render(<StatCard label="Users" value="100" icon={icon} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<StatCard label="Loading..." value="0" loading />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatCard label="Test" value="123" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles numeric values', () => {
    render(<StatCard label="Count" value={42} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('handles zero change', () => {
    render(<StatCard label="Static" value="100" change={0} />);

    expect(screen.getByText('↑ 0%')).toBeInTheDocument();
  });
});

